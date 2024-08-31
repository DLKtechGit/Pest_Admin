import React, { useState, useEffect } from 'react';
import Buttons from 'ui-component/Button/Button';
import MainCard from 'ui-component/cards/MainCard';
import { Table, Form } from 'antd';
import Search from 'ui-component/SearchFilter/Search';
import Apiservice from '../../Services/TechniciansService';
import moment from 'moment';
import { Button } from '@mui/material';
import { DatePicker } from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';
import Loader from 'ui-component/Loader/Loader';


const ManageReports = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  console.log('data', data);
  const [date, setDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ChemicalName, setChemicalName] = useState('');
  const [loader,setLoader] = useState(false)

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
      const completedTasks = mergedTasks.filter((task) => task.status === 'completed');
      // const sortedTasks = completedTasks.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      const sortedTasks = completedTasks.reverse()
      setData(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    finally{
      setLoader(false)
    }
  };

  

  console.log('data', data);

  const openPdf = (pdfData) => {
    const newWindow = window.open();
    newWindow.document.write(`<iframe src="data:application/pdf;base64,${pdfData}" style="width:100%; height:100%;" frameborder="0"></iframe>`);
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sNo',
      width: '5%',
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
      title: 'Customer Name',
      dataIndex: 'companyName',
      width: '10%'
    },
    {
      title: ' Technician Name',
      title: 'Technician Name',
      dataIndex: 'assignedTo',
      width: '10%',
      render: (_, record) => record.technicianDetails && `${record.technicianDetails.firstName} ${record.technicianDetails.lastName}`
    },
    {
      title: 'Details',
      dataIndex: 'assignedTo',
      width: '12%',
      render: (_, record) => {
        const startDate = record.technicianStartDate;
        const startTime = record.technicianStartTime;
        const endTime = record.endTime;
        return (
          <>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontWeight: '600' }}>Assigned Date :</span> {moment(record.startDate).format('DD-MM-YYYY')}
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontWeight: '600' }}>Completed Date :</span> {startDate}
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontWeight: '600' }}>Start Time :</span> {startTime}
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontWeight: '600' }}>End Time :</span> {record.completedDetails.endTime
              }
            </div>
          </>
        );
      }
    },
    {
      title: 'Action',
      width: '10%',
      dataIndex: 'action',
      fixed: 'right',
      render: (_, record) => {
        return (
          <div className="d-flex gap-3 justify-content-center">
            <span>
              <Button type="primary" onClick={() => openPdf(record.pdf)} className="tech-btn">
                View PDF
              </Button>
            </span>
          </div>
        );
      }
    }
  ];


  const handleDateChange = (date) => {
    console.log('date',date);
    setSelectedDate(date);
  };

  const clearFilter = () => {
    setSelectedDate(null);
  };

  const filteredData = selectedDate ? data.filter((task) => moment(task.startDate).isSame(selectedDate, 'day')) : data;

  console.log('filtereddtata',filteredData);

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

  return (
    <>   {loader && (
      <Loader show={loader}/>
      
    )} 
    <MainCard title="Reports">
      <div className="d-flex justify-content-end" style={{ position: 'relative', bottom: '10px' }}>
        {/* <Buttons>Download</Buttons> */}
        <DatePicker style={{ width: '150px', height: '30px' }} placeholder="Search date" onChange={handleDateChange} format="dd-MM-yyyy" />
        <Search
          onChange={handleInputChange}
          placeholder="Search Customer"
          value={searchTerm}
          style={{ width: '150px', height: '35px', marginLeft: '20px' }}
        />      </div>
      <Form form={form} component={false}>
        <Table bordered dataSource={filteredData} columns={columns} pagination={{}} />
      </Form>
    </MainCard>
    </>
  );
};

export default ManageReports;
