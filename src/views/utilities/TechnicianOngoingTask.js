import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
import Buttons from 'ui-component/Button/Button';
import MainCard from 'ui-component/cards/MainCard';
import { Form, Button, Table, Tooltip } from 'antd';
import Search from 'ui-component/SearchFilter/Search';
import Mudule from 'ui-component/module/Mudule';
import Apiservice from '../../Services/TechniciansService';
import moment from 'moment';
import { DatePicker } from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';
import Loader from 'ui-component/Loader/Loader';

const TechnicianOngoingTask = () => {
  const [Show, setShow] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState('');
  const [date, setDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [datas, setDatas] = useState([]);
  const [loader,setLoader] = useState(false)
  

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleConfirm = () => {
    setShow(false);
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const getAllTasks = async () => {
    setLoader(true)
    try {
      const AllTask = await Apiservice.technicianTask();
      const Tasks = AllTask.data.Results;
      const mergedTasks = Tasks.reduce((acc, curr) => {
        acc.push(...curr.technicians[0]?.tasks);
        return acc;
      }, []);
      const ongoingTasks = mergedTasks.filter((task) => task.status === 'ongoing');
      const sortedTasks = ongoingTasks.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      setData(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    finally{
      setLoader(false)
    }
  };
  console.log('data', data);

  // const handleInputChange = (e) => {
  //   const searchTerm = e.target.value.toLowerCase();
  //   setSearchTerm(searchTerm);
  //   if (searchTerm === '') {
  //     getAllTasks();
  //   } else {
  //     const filteredItems = data.filter((task) => {
  //       const startDate = moment(task.startDate).format('DD-MM-YYYY').toLowerCase();
  //       return startDate.includes(searchTerm);
  //     });
  //     setData(filteredItems);
  //   }
  // };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const clearFilter = () => {
    setSelectedDate(null);
  };

  const filteredData = selectedDate ? data.filter((task) => moment(task.startDate).isSame(selectedDate, 'day')) : data;

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      getAllTasks();
    } else {
      const filteredItems = data.filter((userdata) => userdata.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
      setData(filteredItems);
    }
  };


  const CustomTooltip = () => (
    <Tooltip title="Click Here to manually complete the task !">
      <Button onClick={handleShow} style={{ backgroundColor: '#21A063', color: 'white' }}>
        Completed
      </Button>
    </Tooltip>
  );

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sNo',
      width: '3%',
      editable: true,
      render: (_, __, index) => index + 1
    },
    {
      title: 'Service Name',
      dataIndex: 'QrCodeCategory',
      width: '8%',
      render: (QrCodeCategory, record) => (

        <>

          {/* const QrCodeCategory = task.QrCodeCategory;
              const noqrcodeService = task.noqrcodeService;
              
              console.log('noqrcodeService',noqrcodeService);

              const serviceList = QrCodeCategory.length > 0 ? QrCodeCategory : noqrcodeService; */}

          {QrCodeCategory && QrCodeCategory.length > 0 ? (
            <>
              {QrCodeCategory.map((serviceName, index) => (
                <div key={index} className="mb-2">
                  <div>
                    <div className="fonts13 textLeft" style={{ fontWeight: '700',textAlign: 'left' }}>
                      {serviceName.category} :
                    </div>
                    {serviceName.subCategory.map((subItem, subIndex) => (
                      <div key={subIndex} className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex align-items-center fonts13 textLeft">
                          {subIndex + 1}. {subItem}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ textAlign: 'left' }}>
              {record?.noqrcodeService?.map((serviceName, index) => (
                <div key={index} className="mb-2">
                  <div>
                    <div className="fonts13 textLeft" style={{ fontWeight: '700' }}>
                      {serviceName.category} :
                    </div>
                  </div>
                </div>
              ))}

              {QrCodeCategory?.length !=2 && record.serviceName && QrCodeCategory[0]?.category !="General Pest Control" &&(
                <div className="mb-2">
                  {record.serviceName.map((data, index) => (
                    <div key={index} className="d-flex flex-row justify-content-between align-items-center">
                      <div className="d-flex align-items-center fonts13 textLeft">
                        {index + 1}. {data}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'left' }}>
              {record?.noqrcodeService && (
                <>
                <div  className="mb-2">
                  <div>
                    <div className="fonts13 textLeft" style={{ fontWeight: '700' }}>
                      {record?.noqrcodeService[0]?.category} :
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  {record?.noqrcodeService[0]?.subCategory.map((data, index) => (
                    <div key={index} className="d-flex flex-row justify-content-between align-items-center">
                      <div className="d-flex align-items-center fonts13 textLeft">
                        {index + 1}. {data}
                      </div>
                    </div>
                  ))}
                </div>
                </>
                
              )}

              {/* {record.serviceName && (
                <div className="mb-2">
                  {record.serviceName.map((data, index) => (
                    <div key={index} className="d-flex flex-row justify-content-between align-items-center">
                      <div className="d-flex align-items-center fonts13 textLeft">
                        {index + 1}. {data}
                      </div>
                    </div>
                  ))}
                </div>
              )} */}
            </div>
          )}
        </>
      )
    },
    {
      title: ' Customer Name',
      dataIndex: 'companyName',
      width: '8%',
      editable: true
    },

    {
      title: ' Technician Name',
      children: [
        {
          title: 'Technician Name',
          dataIndex: 'assignedTo',
          width: '8%',
          render: (_, record) => record.technicianDetails && `${record.technicianDetails.firstName} ${record.technicianDetails.lastName}`
        },
        {
          title: 'Technician-2',
          dataIndex: 'otherTechnicianName',
          width: '8%',
          editable: true,
          render: (_, record) => record.otherTechnicianName ? record.otherTechnicianName : '-'
        }
      ]
    },
    {
      title: 'Details',
      dataIndex: 'assignedTo',
      width: '6%',
      render: (_, record) => {
        const startDate = record.technicianStartDate;
        const startTime = record.technicianStartTime;
        return (
          <>
            <div style={{ textAlign: "left" }}><span style={{ fontWeight: "600" }}>Assigned Date :</span> {moment(record.startDate).format('DD-MM-YYYY')}</div>
            <div style={{ textAlign: "left" }}><span style={{ fontWeight: "600" }}>Start Date :</span> {startDate}</div>
            <div style={{ textAlign: "left" }}><span style={{ fontWeight: "600" }}>Start Time :</span> {startTime}</div>
          </>
        );
      }
    },
    {
      title: 'QR Code Available',
      dataIndex: 'available',
      width: '10%',
      editable: true
    },
    {
      title: 'Pause Reason',
      dataIndex: 'pauseReason',
      width: '12%'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '5%',
      editable: true,
      fixed: 'right',
      render: () => <Button style={{ cursor: 'no-drop', backgroundColor: '#E0D730', color: 'white' }}>Ongoing</Button>
    },
    // {
    //   title: 'Action',
    //   dataIndex: 'action',
    //   width: '5%',
    //   editable: true,
    //   fixed: 'right',
    //   render: () => (
    //     // <Button style={{ backgroundColor: '#E0D730', color: 'white' }}>Completed</Button>
    //     <CustomTooltip />
    //   )
    // }
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
        title: col.title
      })
    };
  });
  return (
    <>
    {loader && (
      <Loader show={loader}/>
      
    )} 
      <MainCard title=" Ongoing Tasks ">
        <div className="d-flex justify-content-end " style={{ position: 'relative', bottom: '10px' }}>
          {/* <Buttons>Download</Buttons> */}
          <DatePicker style={{ width: '150px', height: '30px' }} placeholder="Search date" onChange={handleDateChange} format="dd-MM-yyyy" />
        <Search
          onChange={handleInputChange}
          placeholder="Search Customer"
          value={searchTerm}
          style={{ width: '150px', height: '35px', marginLeft: '20px' }}
        />
        </div>
        <Form form={form} component={false}>
          <Table
            bordered
            dataSource={filteredData}
            columns={mergedColumns}
            pagination={{}}
            scroll={{
              x: 2000
            }}
          />
        </Form>
        <Mudule
          show={Show}
          modalTitle={'Task Complete Manually'}
          modalContent={'Are you sure you want to Complete the task manually  ?'}
          onClose={handleClose}
          onConfirm={handleConfirm}
        ></Mudule>
      </MainCard>
    </>
  );
};
export default TechnicianOngoingTask;
