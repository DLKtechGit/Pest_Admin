import React, { useState, useEffect, useRef } from 'react';
import Tables from 'ui-component/Tables/Tables';
import MainCard from 'ui-component/cards/MainCard';
import { IconTrash } from '@tabler/icons';
import { Form, Input, InputNumber, Popconfirm, Typography } from 'antd';
import Buttons from 'ui-component/Button/Button';
import Search from 'ui-component/SearchFilter/Search';
import ApiAllServices from '../../Services/ChemicalsService';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
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
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ManageChemicalsLists = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loader,setLoader] = useState(false)
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
      const filteredItems = data.filter((userdata) =>
        userdata.chemicalsName.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
      const serviceData = await ApiAllServices.GetChemicals();
      const services = serviceData?.data?.Results.map((service, index) => ({
        ...service,
        key: service._id,
        serviceId: (index + 1).toString().padStart(3, '0'),
      }));
      const sortedData = services.sort((a,b)=> new Date(b.created_date) - new Date(a.created_date) )

      setData(sortedData);
    } catch (error) {
      console.error('Error fetching Chemicals data:', error);
      // Handle error here, e.g., display toast message
      toast.error('Failed to fetch Chemicals data');
    }
    finally{
      setLoader(false)
    }
  };

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
    const confirmDelete = window.confirm('Do you want to delete the chemicals?');
    if (!confirmDelete) {
      return; 
    }
  
    setLoader(true);
    try {
      const res = await ApiAllServices.DeleteChemicals(_id);
      if (res.status === 200) {
        toast.success('Chemicals Deleted Successfully');
        getServiceData();
      } else if (res.status === 404) {
        toast.error('Chemicals Not Found');
      } else {
        toast.error('An error occurred while deleting the Chemicals');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the Chemicals');
      console.error('DeleteChemicals Error:', error);
    } finally {
      setLoader(false);
    }
  };
  
  const columns = [
    {
      title: 'S.No',
      dataIndex: 'serviceId',
      width: '5%',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Chemicals Name',
      dataIndex: 'chemicalsName',
      width: '15%',
    },   
    {
      title: 'CreatedDate',
      dataIndex: 'created_date',
      width: '10%',
      render: (text) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Action',
      width: '8%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
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
      },
    },
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
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
    {loader && (
      <Loader show={loader}/>
      
    )} 
      <MainCard title="Manage Chemicals List">
        <div className="d-flex justify-content-end" style={{ marginBottom: '10px' }}>
          {/* <Buttons onClick={downloadPDF}>Download</Buttons> */}
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

export default ManageChemicalsLists;
