import React, { useState, useEffect, useRef } from 'react';
import Tables from 'ui-component/Tables/Tables';
import MainCard from 'ui-component/cards/MainCard';
import { IconTrash } from '@tabler/icons';
import { Form, Input, InputNumber, Popconfirm, Typography } from 'antd';
import Search from 'ui-component/SearchFilter/Search';
import ApiAllServices from '../../Services/AllServices';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
import Loader from 'ui-component/Loader/Loader';


const EditableCell = ({ editing, dataIndex, title, inputType, children, ...restProps }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[{ required: true, message: `Please Input ${title}!` }]}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ManageserviceLists = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const tableRef = useRef(null);
  const [loader,setLoader] = useState(false)

  useEffect(() => {
    getServiceData();
  }, []);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      getServiceData();
    } else {
      const filteredItems = data.filter((userdata) => userdata.serviceName.toLowerCase().includes(searchTerm.toLowerCase()));
      setData(filteredItems);
    }
  };

  const isEditing = (record) => record.key === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const getServiceData = async () => {
  setLoader(true)
    try {
      const serviceData = await ApiAllServices.ListServices();
      const services = serviceData?.data?.Results.map((service, index) => ({
        ...service,
        key: service._id,
        serviceId: (index + 1).toString().padStart(3, '0'),
        serviceImage: `http://localhost:4000/uploads/${service.serviceImage}`
      }));
      const sortedData = services.sort((a,b)=> new Date(b.created_date) - new Date(a.created_date) )
      setData(sortedData);
    } catch (error) {
      console.error('Error fetching service data:', error);
      toast.error('Failed to fetch service data');
    }
    finally{
      setLoader(false)
    }
  };
  console.log('data', data);
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
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

  const DeleteService = async (_id) => {
    setLoader(true);
    try {
      const confirmDelete = window.confirm('Do you want to delete the service?');
      if (!confirmDelete) {
        setLoader(false);
        return; 
      }
  
      const res = await ApiAllServices.DeleteService(_id);
      if (res.status === 200) {
        toast.success('Service Deleted Successfully');
        // Refresh data after deletion
        getServiceData();
      } else if (res.status === 404) {
        toast.error('Service Not Found');
      } else {
        toast.error('An error occurred while deleting the service');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the service');
      console.error('DeleteService Error:', error);
    } finally {
      setLoader(false);
    }
  };
  
  
  const columns = [
    {
      title: 'S.No',
      dataIndex: 'serviceId',
      width: '5%',
      render: (_, __, index) => index + 1
    },
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      width: '15%',
      render: (serviceName) => (
        <>
          {serviceName.map((service, index) => (
            <div key={index} style={{textAlign:"left"}}>{index+1}. {service}</div>
          ))}
        </>
      )
    },
    // {
    //   title: 'Service Image',
    //   dataIndex: 'serviceImage',
    //   width: '15%',
    //   render: (serviceImage) => (
    //     <img
    //       src={serviceImage}
    //       alt="Service"
    //       style={{ width: '100px', height: 'auto' }}
    //     />
    //   ),
    // },
    
    {
      title: 'CreatedDate',
      dataIndex: 'created_date',
      width: '10%',
      render: (text) => moment(text).format('DD-MM-YYYY')
    },
    {
      title: 'Action',
      width: '8%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div className="d-flex justify-content-center">
            <span style={{ cursor: 'pointer' }}>
              <IconTrash onClick={() => DeleteService(record.key)} />
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
    <>

{loader && (
      <Loader show={loader}/>
      
    )} 

      <MainCard title="Manage Service List">
        <div className="d-flex justify-content-end" style={{ marginBottom: '10px' }}>
          <Search
            onChange={handleInputChange}
            placeholder="Search by name"
            value={searchTerm}
            style={{ width: '150px', marginLeft: '20px' }}
          />
        </div>
        <Form form={form} component={false}>
          <div ref={tableRef}>
            <Tables
              components={{ body: { cell: EditableCell } }}
              bordered
              dataSource={data}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={false}
              scroll={{ y: 500 }}
            />
          </div>
        </Form>
      </MainCard>
      <ToastContainer />
    </>
  );
};

export default ManageserviceLists;
