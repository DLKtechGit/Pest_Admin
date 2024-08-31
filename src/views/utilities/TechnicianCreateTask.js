import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button, Form, Input, InputNumber, Table } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import Search from 'ui-component/SearchFilter/Search';
import ApiTechnician from '../../Services/TechniciansService';
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

const TechnicianCreateTask = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loader,setLoader] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    getAllTechnicians();
  }, []);

  const getAllTechnicians = async () => {
    setLoader(true)
    try {
      const response = await ApiTechnician.technicianList();
      setData(response.data.Results);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      // Add error handling mechanism, e.g., display error message
    }
    setLoader(false)
  };

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      getAllTechnicians();
    } else {
      const filteredItems = data.filter((userdata) => userdata.firstName.toLowerCase().includes(searchTerm.toLowerCase()));
      setData(filteredItems);
    }
  };

  const handleCreateTask = (record) => {
    const { _id } = record;
    navigate(`/create/Task-model/${_id}`, { state: { data: record } });
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sNo',
      width: '5%',
      editable: true,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '15%',
      editable: true,
      fixed: 'left',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      width: '12%',
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '20%',
      editable: true,
    },
  
    {
      title: 'Created Date',
      dataIndex: 'created_date',
      width: '15%',
      render: (text) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Action',
      width: '10%',
      dataIndex: 'action',
      fixed: 'right',
      render: (_, record) => (
        <div className="d-flex justify-content-center">
          <div style={{ cursor: 'pointer' }}>
            <Button
              className="tech-btn"
              type="primary"
              onClick={() => handleCreateTask(record)}
            >
              Create Task
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      inputType: col.dataIndex === 'age' ? 'number' : 'text',
      dataIndex: col.dataIndex,
      title: col.title,
    }),
  }));

  return (
    <>
     {loader && (
      <Loader show={loader}/>
      
    )} 
    <MainCard title="Create Task">
      <div className="d-flex justify-content-end mb-4">
        <button
          id="add-cus"
          type="submit"
          onClick={() => navigate('/add/details/#tech')}
          className="btn btn-primary"
        >
          Add Technician
        </button>
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
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ pageSize: 20 }}         
        />
      </Form>
    </MainCard>
    </>
  );
};

export default TechnicianCreateTask;
