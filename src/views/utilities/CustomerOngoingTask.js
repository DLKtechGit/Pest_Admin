import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
import Buttons from 'ui-component/Button/Button';
import MainCard from 'ui-component/cards/MainCard';
import { Form, Button, Table, Tooltip } from 'antd';
import Search from 'ui-component/SearchFilter/Search';
import Mudule from 'ui-component/module/Mudule';
import Apiservice from '../../Services/TechniciansService'
import moment from 'moment';


const CustomerOngoingTask = () => {
  const [Show, setShow] = useState(false)
  const [form] = Form.useForm();
  const [data, setData] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleShow = () => {
    setShow(true)
  }

  const handleClose = () => {
    setShow(false)
  }

  const handleConfirm = () => {
    setShow(false)
  }

  useEffect(() => {
    getAllTasks()
  }, [])

  // const getAllTasks = async () => {
  //   const allTasks = await Apiservice.technicianTask();
  //   const tasks = allTasks.data.Results;

  //   const ongoingTasks = tasks.filter(task => task.status === "ongoing");
  //   setData(ongoingTasks);
  // };
  const getAllTasks = async () => {
    try {
      const AllTask = await Apiservice.technicianTask();
      const Tasks = AllTask.data.Results;
      const mergedTasks = Tasks.reduce((acc, curr) => {
        acc.push(...curr.technicians[0]?.tasks);
        return acc;
      }, []);
      const ongoingTasks = mergedTasks.filter(task => task.status === "ongoing");
      setData(ongoingTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const filteredItems = data.filter((userdata) =>
      userdata.serviceName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    );
    setData(filteredItems);
  };

  const CustomTooltip = () => (
    <Tooltip title="Click Here to manually complete the task !">
      <Button onClick={handleShow} style={{ backgroundColor: '#21A063', color: 'white' }}>Completed</Button>
    </Tooltip>
  );

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sNo',
      width: '5%',
      editable: true,
      render: (_, __, index) => index + 1
    },
    {
      title: 'Service ID',
      dataIndex: '_id',
      width: '10%',
      editable: true
    },
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      width: '15%',
      editable: true
    },
    {
      title: ' Customer Name',
      dataIndex: 'companyName',
      width: '13%',
      editable: true
    },
    {
      title: ' Technician Name',
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
          editable: true
        }
      ]
    },
    

    {
      title: 'Start Date',
      dataIndex: 'startDate',
      width: '10%',
      editable: true,
      render: (text) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '5%',
      editable: true,
      fixed: 'right',
      render: () =>
        <Button style={{ cursor: 'no-drop', backgroundColor: '#E0D730', color: 'white' }}>Ongoing</Button>

    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '5%',
      editable: true,
      fixed: 'right',
      render: () => (

        // <Button style={{ backgroundColor: '#E0D730', color: 'white' }}>Completed</Button>
        <CustomTooltip />
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

      })
    };
  });
  return (
    <>
      <MainCard title=" Ongoing Tasks ">
        <div className='d-flex justify-content-end ' style={{ position: 'relative', bottom: '10px' }} >
          <Buttons>
            Download
          </Buttons>
          <Search onChange={handleInputChange}
            placeholder='Search by date'
            value={searchTerm}
            style={{ width: '150px', marginLeft: '20px' }}
          />
        </div>
        <Form form={form} component={false}>
          <Table
            dataSource={data}
            columns={mergedColumns}
            pagination={{
            }}
            scroll={{
              x: 2000,
            }}
          />
        </Form>
        <Mudule
          show={Show}
          modalTitle={'Task Complete Manually'}
          modalContent={'Are you sure you want to Complete the task manually  ?'}
          onClose={handleClose}
          onConfirm={handleConfirm}
        >

        </Mudule>
      </MainCard>
    </>
  );
};
export default CustomerOngoingTask;
