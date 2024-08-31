import React, { useState, useEffect } from 'react';
import Buttons from 'ui-component/Button/Button';
import MainCard from 'ui-component/cards/MainCard';
import { Table, Form, Button } from 'antd';
import Search from 'ui-component/SearchFilter/Search';
import Apiservice from '../../Services/TechniciansService';
import moment from 'moment';
const CustomerCompletedTask = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllTasks();
  }, []);

  // const getAllTasks = async () => {
  //   const AllTask = await Apiservice.technicianTask();
  //   const Tasks = AllTask.data.Results;
  //   const completedTasks = Tasks.filter(task => task.status === "completed");
  //   setData(completedTasks);
  // };

  const getAllTasks = async () => {
    try {
      const AllTask = await Apiservice.technicianTask();
      const Tasks = AllTask.data.Results;
      const mergedTasks = Tasks.reduce((acc, curr) => {
        acc.push(...curr.technicians[0]?.tasks);
        return acc;
      }, []);
      const completedTasks = mergedTasks.filter(task => task.status === "completed");
      setData(completedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    // No need for search functionality as we're not implementing search
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sNo',
      width: '5%',
      render: (_, __, index) => index + 1
    },
    {
      title: 'Service ID',
      dataIndex: '_id',
      width: '10%',
    },
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      width: '15%',
    },
    {
      title: 'Customer Name',
      dataIndex: 'companyName',
      width: '13%',
    },
    {
      title: 'Technician Name',
      children: [
        {
          title: 'Technician Name',
          dataIndex: 'assignedTo',
          width: '10%',
          render: (_, record) => record.assignedTo && record.assignedTo.map(technician => `${technician.firstName} ${technician.lastName}`)
        },
        {
          title: 'Technician-2',
          dataIndex: 'technicianname2',
          width: '10%',
        }
      ]
    },
  
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      width: '10%',
      render: (text) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Start Time',
      dataIndex: 'starttime',
      width: '10%',
      render: (text) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: 'End Time',
      dataIndex: 'endtime',
      width: '11%',
      render: (text) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '10%',
      fixed: 'right',
      render: () => <Button style={{ cursor: 'no-drop', backgroundColor: '#21A063', color: 'white' }}>Completed</Button>
    }
  ];

  return (
    <MainCard title=" Completed Tasks ">
      <div className='d-flex justify-content-end' style={{ position: 'relative', bottom: '10px' }}>
        <Buttons>
          Download
        </Buttons>
        <Search
          onChange={handleInputChange}
          value={searchTerm}
          style={{ width: '150px', marginLeft: '20px' }}
        />
      </div>
      <Form form={form} component={false}>
        <Table
          dataSource={data}
          columns={columns}
          pagination={{}}
          scroll={{
            x: 2000,
          }}
        />
      </Form>
    </MainCard>
  );
};

export default CustomerCompletedTask;
