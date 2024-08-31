import React, { useState, useEffect, useRef } from 'react';
import { Table, Popconfirm, Form } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import Buttons from 'ui-component/Button/Button';
import Search from 'ui-component/SearchFilter/Search';
import ApiAllCompanys from '../../Services/CustomerServices';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Modal from "react-bootstrap/Modal";
// import { useTheme } from '@mui/material/styles';
import {
  Button,
  Typography,
} from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik, Field, ErrorMessage } from "formik";
import { toast, ToastContainer } from 'react-toastify';
import { Country, State, City } from 'country-state-city';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


const CustomerListTable = () => {
  // let navigate = useNavigate();
  const [Show, setShow] = useState(false)
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const tableRef = useRef(null);
  const [namefetch, setNamefetch] = useState('')
  const [emailfetch, setEmailfetch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [_idFetch, set_IdFetch] = useState(null);
  // const [formValues, setFormValues] = useState(null);
  // console.log("Form Values in State:", formValues);

  useEffect(() => {
    getAllCompanies();
  }, []);


  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      getAllCompanies();
    } else {
      const filteredItems = data.filter((userdata) => userdata.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setData(filteredItems);
    }
  };

  const isEditing = (record) => record.key === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const getAllCompanies = async () => {
    try {
      const AllCompanies = await ApiAllCompanys.getCompany();
      const Companies = AllCompanies?.data?.Results;
      setData(Companies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleShow = async (_id, email, name) => {
    // console.log("id--------->",_id, email, name)
    set_IdFetch(_id)
    setNamefetch(name)
    setEmailfetch(email)
    setShow(true)
  }

  const onSubmit = async(values) => {
    console.log("Form Values:", values,"_idFetch",_idFetch);
    // Store the form values in state or perform other actions
    const response = await ApiAllCompanys.EditCustomer(values,_idFetch)
    console.log("response",response);
    toast.success("Form submitted successfully!");
  };



  const handleClose = () => {
    setShow(false)
  }

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sNo',
      width: '5%',
      editable: true,
      render: (_, record, index) => index + 1
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '15%',
      editable: true,
      fixed: 'left'
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
      title: 'Country',
      dataIndex: 'country',
      width: '15%',
      editable: true
    },
    {
      title: 'State',
      dataIndex: 'state',
      width: '15%',
      editable: true
    },
    {
      title: 'City',
      dataIndex: 'city',
      width: '15%',
      editable: true
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: '15%',
      editable: true
    },
    {
      title: 'Created Date',
      dataIndex: 'created_date',
      width: '15%',
      render: (text) => moment(text).format('DD-MM-YYYY')
    },
    {
      title: 'Action',
      width: '10%',
      dataIndex: 'action',
      fixed: 'right',
      render: (_, record) => {
        // console.log("record",record);
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
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
            <span>
              <Button type="primary" onClick={() => handleShow(record._id, record.email, record.name)} className="tech-btn">
                Edit
              </Button>
            </span>
          </div>
        );
      }
    }
  ];


  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    const formattedData = data.map((item, index) => ({
      'S.No': index + 1,
      Name: item.name,
      Phone: item.phoneNumber,
      Email: item.email,
      Country: item.country,
      State: item.state,
      City: item.city,
      Address: item.address,
      'Created Date': moment(item.created_date).format('DD-MM-YYYY')
    }));
    const fileName = 'CustomerData.pdf';
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const content = {
      startY: margin,
      head: [['S.No', 'Name', 'Phone', 'Email', 'Country', 'State', 'City', 'Address', 'Created Date']],
      body: []
    };
    const columnWidths = [];
    Object.keys(formattedData[0]).forEach((key) => {
      const maxLength = Math.max(...formattedData.map((item) => item[key].toString().length));
      columnWidths.push({ columnWidth: maxLength > 25 ? 25 : maxLength + 12 });
    });
    formattedData.forEach((item) => {
      content.body.push(Object.values(item));
    });
    pdf.autoTable({
      ...content,
      styles: { overflow: 'linebreak' },
      columnStyles: columnWidths
    });
    pdf.save(fileName);
  };

  return (
    <MainCard title="Customers List">
      <div className="d-flex justify-content-end " style={{ position: 'relative', bottom: '10px' }}>
        <Buttons onClick={downloadPDF}>Download</Buttons>
        <Search
          onChange={handleInputChange}
          placeholder="Search by name"
          value={searchTerm}
          style={{ width: '150px', marginLeft: '20px' }}
        />
      </div>
      <Form form={form} component={false}>
        <div ref={tableRef}>
          <Table
            components={{
              body: {
                // cell: EditableCell,
              }
            }}
            bordered
            dataSource={data}
            columns={columns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel
            }}
            scroll={{
              x: 2000
            }}
          />
        </div>
      </Form>

      <Modal className="modal d-flex align-items-center" show={Show} onHide={handleClose}>
        <Modal.Header className="modalhead" closeButton>
          <Modal.Title>Create Login</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalbody" >
          <div>
            <>
              <Formik
                initialValues={{
                  _id: '', // Add _id field to store the id of the record
                  name: namefetch,
                  email: emailfetch,
                  address: '',
                  country: '',
                  state: '',
                  city: '',
                  phoneNumber: '',
                  submit: null
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                  // Add validation for other fields if necessary
                })}              
              >
                {({ values, setFieldValue }) => (
                  <Form >
                    <div className="d-flex flex-row">
                      <div className="col-6 p-2">
                        <label htmlFor="name" className="mt-3">Customer Name</label>
                        <Field
                          name="name"
                          type="text"
                          className="newcompany form-control mt-3"
                          placeholder='Enter Customer Name'
                        />
                        <ErrorMessage name="name" component="div" className="text-danger mt-2" />
                      </div>
                      <div className="col-6 p-2">
                        <label htmlFor="address" className="mt-3">Customer Address</label>
                        <Field
                          name="address"
                          type="text"
                          className="newcompany form-control mt-3"
                          placeholder='Enter Customer Address'
                        />
                        <ErrorMessage name="address" component="div" className="text-danger mt-2" />
                      </div>
                    </div>

                    <div className="d-flex flex-row">
                      <div className="col-6 p-2">
                        <label htmlFor="country" className="">Country</label>
                        <Select
                          className='mt-3'
                          options={Country.getAllCountries()}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.name}
                          value={Country.getAllCountries().find(country => country.name === values.country)}
                          onChange={(selectedOption) => {
                            setFieldValue("country", selectedOption.name);
                            setSelectedCountry(selectedOption);
                          }}
                        />
                        <ErrorMessage name="country" component="div" className="text-danger mt-2" />
                      </div>
                      <div className="col-6 p-2">
                        <label htmlFor="state" className="">State</label>
                        <Select
                          className='mt-3'
                          options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.name}
                          value={State.getStatesOfCountry(selectedCountry?.isoCode)?.find(state => state.name === values.state)}
                          onChange={(selectedOption) => {
                            setFieldValue("state", selectedOption.name);
                            setSelectedState(selectedOption);
                          }}
                        />
                        <ErrorMessage name="state" component="div" className="text-danger mt-2" />
                      </div>
                    </div>

                    <div className="d-flex flex-row">
                      <div className="col-6 p-2">
                        <label htmlFor="city" className="">City</label>
                        <Select
                          className='mt-3'
                          options={City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode)}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.name}
                          value={City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode)?.find(city => city.name === values.city)}
                          onChange={(selectedOption) => setFieldValue("city", selectedOption.name)}
                        />
                        <ErrorMessage name="city" component="div" className="text-danger mt-2" />
                      </div>
                      <div className="col-6 p-2">
                        <label htmlFor="phoneNumber" className=" mb-3">Phone Number</label>
                        <PhoneInput
                          country={'bh'}
                          value={values.phoneNumber}
                          onChange={(phone) => setFieldValue("phoneNumber", phone)}
                        />
                      </div>
                    </div>

                    <div className="d-flex ">
                      <div className="col-12 p-2">
                        <label htmlFor="email" className="">Email Address</label>
                        <Field
                          name="email"
                          type="email"
                          className="newcompany form-control mt-3"
                          placeholder='Enter Email Address'
                        />
                        <ErrorMessage name="email" component="div" className="text-danger mt-2" />
                      </div>
                    </div>
                    <div className="col-4 mt-4">
                      <div className="col-4 mt-4">
                        <button type="submit" onClick={() => onSubmit(values,_idFetch)} className='btn tech-btn'>Update</button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </MainCard >
  );
};

export default CustomerListTable;
