import React, { useState, useEffect, useRef } from 'react';
import Tables from 'ui-component/Tables/Tables';
import MainCard from 'ui-component/cards/MainCard';
import { IconTrash } from '@tabler/icons';
import { Form, Input, InputNumber, Popconfirm, Typography } from 'antd';
import Buttons from 'ui-component/Button/Button';
import Search from 'ui-component/SearchFilter/Search';
import ApiAllServices from '../../Services/Categoryservices';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
import Loader from 'ui-component/Loader/Loader';

const ManageCategoryLists = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loader, setLoader] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    getServiceData();
  }, []);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      getServiceData();
    } else {
      const filteredItems = data.filter((userdata) => userdata.category.toLowerCase().includes(searchTerm.toLowerCase()));
      setData(filteredItems);
    }
  };

  const isEditing = (record) => record.key === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const getServiceData = async () => {
    setLoader(true);
    try {
      const serviceData = await ApiAllServices.GetCateogry();
      const services = serviceData?.data?.Results.map((service, index) => ({
        ...service,
        key: service._id,
        serviceId: (index + 1).toString().padStart(3, '0'),
        serviceImage: `http://localhost:4000/uploads/${service.serviceImage}`
      }));
      const orderdData = services.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setData(orderdData);
    } catch (error) {
      console.error('Error fetching service data:', error);
      toast.error('Failed to fetch service data');
    } finally {
      setLoader(false);
    }
  };

  const DeleteService = async (key) => {
    setLoader(true);
    try {
      const confirmDelete = window.confirm('Do you want to delete the category?');
      if (!confirmDelete) {
        setLoader(false);
        return; 
      }
  
      const res = await ApiAllServices.DeleteCategory(key);
      if (res.status === 200) {
        toast.success('Category Deleted Successfully');
        getServiceData();
      } else if (res.status === 404) {
        toast.error('Category Not Found');
      } else {
        toast.error('An error occurred while deleting the Category');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the Category');
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
      title: 'Category Name',
      dataIndex: 'category',
      width: '15%'
    },
    {
      title: 'Category Type',
      dataIndex: 'categoryType',
      width: '15%',
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1)
    },

    {
      title: 'CreatedDate',
      dataIndex: 'created_date',
      width: '10%',
      render: (text) => moment(text).format('DD-MM-YYYY')
    },
    {
      title: 'Action',
      width: '8%',
      render: (
        _,
        record // Add parentheses to return JSX element
      ) => (
        <div className="d-flex justify-content-center">
          <span style={{ cursor: 'pointer' }}>
            <IconTrash onClick={() => DeleteService(record.key)} />
          </span>
        </div>
      )
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
      {loader && <Loader show={loader} />}
      <MainCard title="Manage Category List">
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
              components={{}}
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

export default ManageCategoryLists;
