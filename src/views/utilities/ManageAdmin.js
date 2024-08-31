import React, { useState, useRef } from 'react';
import Tables from 'ui-component/Tables/Tables';
import MainCard from 'ui-component/cards/MainCard';
import { IconTrash } from '@tabler/icons';
import { Form, Input, InputNumber, Popconfirm, Typography } from 'antd';
import Buttons from 'ui-component/Button/Button';
import Search from 'ui-component/SearchFilter/Search';
import AdminApi from '../../Services/AdminLogin';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Loader from 'ui-component/Loader/Loader';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
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

const ManageAdmin = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState('');
  const [editingKey, setEditingKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletedservice, setdeletedService] = useState('');
  const [loader,setLoader] = useState(false)
  const tableRef = useRef(null);
  const userData = JSON.parse(localStorage.getItem('userData'));
  console.log("userData", userData);

  useEffect(() => {
    getAllAdmins();
  }, [deletedservice]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      getAllAdmins()
    }
    else {
      const filteredItems = data.filter((userdata) => userdata.email.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));
      setData(filteredItems);
    }
  };

  const isEditing = (record) => record.key === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const getAllAdmins = async () => {
    setLoader(true)
    const AdminData = await AdminApi.GetAdmins();
    // console.log("service=============>",AdminData);
    const Admins = AdminData?.data?.Results.map((service, index) => ({
      ...service,
      key: service._id,
      serviceId: (index + 1).toString().padStart(3, '0') // Generate sequential short IDs like "001", "002", ...
    }));
const sortedData = Admins.sort((a,b)=> new Date(b.created_date) - new Date(a.created_date) )
    setData(sortedData);
    setLoader(false)
  };

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

  const DeleteAdmins = async (_id) => {
    setLoader(true);
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete ?');
      if (!confirmDelete) {
        setLoader(false);
        return; 
      }
      const res = await AdminApi.AdminDelete(_id);
      if (res && res.status === 200) {
        toast.success("Admin Deleted Successfully");
        setdeletedService(res.data);
      } else {
        // Error occurred or service not found
        toast.error("Failed to delete Admin");
      }
    } catch (error) {
      // Handle network or server error
      console.error("Error deleting Admin:", error);
      toast.error("Failed to delete Admin");
    }
    finally{
      setLoader(false)
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
      title: 'Role',
      dataIndex: 'role',
      width: '10%',
      editable: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '15%',
      editable: false // Not editable
    },
    {
      title: 'Password',
      dataIndex: 'password',
      width: '15%',
      editable: false // Not editable
    },
    {
      title: 'CreatedDate',
      dataIndex: 'created_date',
      width: '10%',
      editable: true,
      render: (text) => moment(text).format('DD-MM-YYYY')
    },
    {
      title: 'Action',
      width: '8%',
      dataIndex: 'operation',
      render: (_, record) => {
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
          record.role === 'childadmin' && (
          <div className="d-flex justify-content-center">
            <span style={{ cursor: 'pointer' }}>
              <IconTrash  onClick={() => DeleteAdmins(record._id)} />
                {console.log('record',record)
                }
            </span>
          </div>
          )
        
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
    <>
 {loader && (
      <Loader show={loader}/>
      
    )} 
        <MainCard title="Manage Child Admins">
          {
            userData.role === "superadmin" ? (
              <>
                <div className="d-flex justify-content-end " style={{ position: 'relative', bottom: '10px' }}>
                  <Search
                    onChange={handleInputChange}
                    placeholder="Search by email"
                    value={searchTerm}
                    style={{ width: '150px', marginLeft: '20px' }}
                  />
                </div>
                <Form form={form} component={false}>
                  <div ref={tableRef}>
                    <Tables
                      components={{
                        body: {
                          cell: EditableCell
                        }
                      }}
                      bordered
                      dataSource={data}
                      columns={mergedColumns}
                      rowClassName="editable-row"
                      pagination={false}
                      scroll={{ y: 500 }}
                    />
                  </div>
                </Form>
              </>
            ) : (
              <Typography variant="body1" color="textSecondary" className='d-flex justify-content-center' style={{color:"grey"}}>
                This feature is only available for superAdmin.
              </Typography>
            )
          }
        </MainCard>
        <ToastContainer />
   

    </>
  );
};

export default ManageAdmin;