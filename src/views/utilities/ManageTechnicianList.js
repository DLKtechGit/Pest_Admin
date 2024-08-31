import React, { useState } from 'react';
import { Popconfirm, Typography } from 'antd';
import { IconEdit, IconTrash } from '@tabler/icons';
import MainCard from 'ui-component/cards/MainCard';
import { Form, Input, InputNumber, Table } from 'antd';
import Buttons from 'ui-component/Button/Button';
import ApiTechnician from '../../Services/TechniciansService';
// import { useNavigate } from 'react-router';
import Search from 'ui-component/SearchFilter/Search';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik, Field, ErrorMessage } from 'formik';
import Modal from 'react-bootstrap/Modal';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Loader from 'ui-component/Loader/Loader';
import Mudule from 'ui-component/module/Mudule';

const EditableCell = ({ editing, dataIndex, title, inputType, children, ...restProps }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ManageTechnicianList = () => {
  const [Show, setShow] = useState(false);
  const [idFetch, setIdFetch] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState('');
  // console.log('data', data);
  const [editingKey, setEditingKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTechnician, setDeleteTechnician] = useState('');
  const [fnamefetch, setFnamefetch] = useState('');
  const [lnamefetch, setLnamefetch] = useState('');
  const [emailfetch, setEmailfetch] = useState('');
  const [phonefetch, setPhonefetch] = useState('');
  const [loader,setLoader] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [customerId,setCustomerId] = useState('')

  useEffect(() => {
    getAllTechnician();
  }, [deleteTechnician]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      getAllTechnician();
    } else {
      const filteredItems = data.filter((userdata) => userdata.firstName.toLowerCase().includes(searchTerm.toLowerCase()));
      setData(filteredItems);
    }
  };

  const handleCloseModal = ()=>{
    setShowModal(false)
    setCustomerId('')
  }

  const handleShowModel = (_id)=>{
    setShowModal(true)
setCustomerId(_id)

  }

  console.log("cusId",customerId);

  const getAllTechnician = async () => {
    setLoader(true)
    try {
      const allTechnician = await ApiTechnician.technicianList();
    const Technicians = allTechnician.data.Results;
    const listTechnicians = Technicians.filter((tech) => tech.deleted === false);
    const sortedData = listTechnicians.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

    setData(sortedData);
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoader(false)    }
    
  };

  const isEditing = (record) => record.key === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const handleShow = async (_id, email, firstName, lastName, phoneNumber) => {
    setIdFetch(_id);
    setFnamefetch(firstName);
    setLnamefetch(lastName);
    setEmailfetch(email);
    setPhonefetch(phoneNumber);
    setShow(true);
  };


  const handleClose = () => {
    setShow(false);
  };

  const onSubmit = async (values) => {
    setLoader(true)
    try {
      const res = await ApiTechnician.EditTechnician(values);
      console.log('res:', res);
      toast.success(res.data.message);
      setShow(false);
      getAllTechnician(); 
    } catch (error) {
      toast.error(error);
    }
    finally{
      setLoader(false)
    }
  };

  const handleConfirmModal = async () => {
    const _id = customerId

    setLoader(true)
    try {
      const deletedTechnician = await ApiTechnician.DeleteTechinician(_id);
      console.log('deletedTechnician', deletedTechnician);

      if (deletedTechnician.status === 200) {
        toast.success('Technician Deleted successfully');

        getAllTechnician();
      } else {
        toast.error('Failed to delete technician');
      }
    } catch (error) {
      console.error('Error deleting technician:', error);
      toast.error('Failed to delete technician');
    }
    finally{
      setLoader(false)
      setShowModal(false)

    }
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sNo',
      width: '5%',
      editable: true,
      render: (_, __, index) => index + 1
    },
    {
      title: 'FirstName',
      dataIndex: 'firstName',
      width: '10%',
      editable: true

      // render: (_, record) => `${record.firstName} ${record.lastName}`
    },
    {
      title: 'LastName',
      dataIndex: 'lastName',
      width: '10%',
      editable: true

      // render: (_, record) => `${record.firstName} ${record.lastName}`
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: '12%',
      editable: true,
      render: (_, record) => `${record.phoneNumber}`
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '20%',
      editable: true
    },
    {
      title: 'Created Date',
      dataIndex: 'created_date',
      width: '15%',
      editable: true,
      render: (text) => moment(text).format('DD-MM-YYYY')
    },
    {
      title: 'Action',
      width: '10%',
      dataIndex: 'action',
      fixed: 'right',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              // onClick={() => save(record.key)}
              style={{
                marginRight: 8
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div className="d-flex gap-3 justify-content-center">
            {/* <span>
              <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                <IconEdit />
              </Typography.Link>
            </span> */}
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => handleShow(record._id, record.email, record.lastName, record.firstName, record.phoneNumber)}
            >
              <IconEdit />
            </Typography.Link>
            <span>
              <Typography.Link >
                <IconTrash onClick={() =>handleShowModel(record._id)} />
              </Typography.Link>
            </span>
          </div>
        );
      }
    }
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  return (
    <>  {loader && (
      <Loader show={loader}/>
      
    )} 
    <MainCard title="Manage Technicians ">
      <div className="d-flex justify-content-end " style={{ position: 'relative', bottom: '10px' }}>
        {/* <Buttons>Download</Buttons> */}
        <Search
          onChange={handleInputChange}
          placeholder="Search by name"
          value={searchTerm}
          style={{ width: '150px', marginLeft: '20px' }}
        />
      </div>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel
          }}
          scroll={{
            x: 1500
          }}
        />
      </Form>
      <Modal className="modal d-flex align-items-center" show={Show} onHide={handleClose}>
        <Modal.Header className="modalhead" closeButton>
          <Modal.Title>Edit Technician</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalbody">
          <div>
            <>
              <Formik
                initialValues={{
                  id: idFetch,
                  firstName: lnamefetch,
                  lastName: fnamefetch,
                  email: emailfetch,
                  phoneNumber: phonefetch,
                  submit: null
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
                  // Add validation for other fields if necessary
                })}
                //onSubmit={onSubmit}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <div className="d-flex flex-row">
                      <div className="col-6 p-2">
                        <label htmlFor="firstName" className="">
                          FirstName
                        </label>
                        <Field
                          name="firstName" // Set name attribute to firstName
                          type="text"
                          className="newcompany form-control mt-3"
                          placeholder="Enter First Name"
                        />
                        <ErrorMessage name="firstName" component="div" className="text-danger mt-2" />
                      </div>
                      <div className="col-6 p-2">
                        <label htmlFor="lastName" className="">
                          LastName
                        </label>
                        <Field
                          name="lastName" // Set name attribute to lastName
                          type="text"
                          className="newcompany form-control mt-3"
                          placeholder="Enter Last Name"
                        />
                        <ErrorMessage name="lastName" component="div" className="text-danger mt-2" />
                      </div>
                    </div>
                    

                    <div className="d-flex flex-row ">
                      <div className="col-6 p-2">
                        <label htmlFor="email" className="">
                          Email Address
                        </label>
                        <Field name="email" type="email" className="newcompany form-control mt-3" placeholder="Enter Email Address" />
                        <ErrorMessage name="email" component="div" className="text-danger mt-2" />
                      </div>
                      <div className="col-6 p-2">
                        <label htmlFor="phoneNumber" className=" mb-3">
                          Phone Number
                        </label>
                        <PhoneInput country={'bh'} value={values.phoneNumber} onChange={(phone) => setFieldValue('phoneNumber', phone)} />
                      </div>
                    </div>
                    <div className="col-4 mt-4">
                      <div className="col-4 mt-4">
                        <button type="submit" onClick={() => onSubmit(values)} className="btn tech-btn">
                          Update
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          </div>
        </Modal.Body>
      </Modal>
      <Mudule
        modalTitle="Delete Technician"
        modalContent="Are you sure want to delete Technician?"
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
      />
      <ToastContainer />
    </MainCard>
    </>
  );
};

export default ManageTechnicianList;
