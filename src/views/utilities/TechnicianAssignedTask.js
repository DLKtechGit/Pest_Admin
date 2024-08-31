import React, { useState } from 'react';
// import { useNavigate } from 'react-router';
import Buttons from 'ui-component/Button/Button';
import { IconTrash } from '@tabler/icons';

import MainCard from 'ui-component/cards/MainCard';
import { Form, Button, Table } from 'antd';
import Search from 'ui-component/SearchFilter/Search';
import Apiservice from '../../Services/TechniciansService';
import { useEffect } from 'react';
import moment from 'moment';
import { DatePicker } from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';
import Loader from 'ui-component/Loader/Loader';
import { toast, ToastContainer } from 'react-toastify';

const TechnicianAssignedTask = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [loader, setLoader] = useState(false)
  const [date, setDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  console.log('data', data);

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

      const sortedTasks = mergedTasks.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      setDatas(sortedTasks);
      const ongoingTasks = sortedTasks.filter((task) => task.status === 'start' && task.isDelete === false);
      setData(ongoingTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    finally {
      setLoader(false)
    }
  };

  // ===================== my changes ================

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

  const handleDeleteTask = async (_id) => {
    setLoader(true)

    try {
      const confirmDelete = window.confirm('Do you want to delete the task?');
      if (!confirmDelete) {
        setLoader(false);
        return;
      }

      const deleteTask = await Apiservice.deleteTask(_id)
      if (deleteTask.status === 200) {
        toast.success('Task Deleted Successfully')
        getAllTasks()
      }
      else {
        toast.error('Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting technician:', error);
      toast.error('Failed to delete technician');
    }
    finally {
      setLoader(false)
    }
  }

  const handleDateChange = (date) => {
    console.log('date', date);
    setSelectedDate(moment(date).format("DD-MM-YYYY"));
  };

  const clearFilter = () => {
    setSelectedDate(null);
  };

  useEffect(() => {
    if (selectedDate === 'Invalid date') {
      clearFilter()
      getAllTasks()
    }
  }, [selectedDate])

  console.log('selectedDate', selectedDate);

  const filteredData = selectedDate ? data?.filter((task) => moment(task?.startDate).format('DD-MM-YYYY') === selectedDate) : data;

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

  // ================= my changes ==================
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
          render: (_, record) => (record.otherTechnicianName ? record.otherTechnicianName : '-')
        }
      ]
    },
    {
      title: 'Assigned Date',
      dataIndex: 'startDate',
      width: '7%',
      editable: true,
      render: (text) => moment(text).format('DD-MM-YYYY')

    },
    {
      title: 'QR Code Available',
      dataIndex: 'available',
      width: '10%',
      editable: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '6%',
      fixed: 'right',
      editable: true,
      render: () => <Button style={{ cursor: 'no-drop', backgroundColor: '#3B5888', color: 'white' }}>Yet to start</Button>
    },
    {
      title: 'Delete',
      dataIndex: 'action',
      width: '5%',
      fixed: 'right',
      editable: true,
      render: (_, record) => <Button>
        <IconTrash onClick={() => handleDeleteTask(record)} />
      </Button>
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
        title: col.title
      })
    };
  });
  return (
    <>
      {loader && (
        <Loader show={loader} />

      )}
      <MainCard title=" Assigned Tasks ">
        <div className="d-flex justify-content-end " style={{ position: 'relative', bottom: '10px' }}>
          <DatePicker
            style={{ width: '150px', height: '30px' }}
            placeholder="Search date"
            onChange={handleDateChange}
            format="dd-MM-yyyy"
          />
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
            pagination={{ pageSize: 20 }}
            scroll={{
              x: 1500
            }}
          />
        </Form>
        <ToastContainer />
      </MainCard>
    </>
  );
};
export default TechnicianAssignedTask;

// import React, { useState } from 'react';
// // import { useNavigate } from 'react-router';
// import Buttons from 'ui-component/Button/Button';
// import MainCard from 'ui-component/cards/MainCard';
// import { Form, Button, Table } from 'antd';
// import Search from 'ui-component/SearchFilter/Search';
// import Apiservice from '../../Services/TechniciansService'
// import { useEffect } from 'react';
// import moment from 'moment';

// const TechnicianAssignedTask = () => {
//   const [form] = Form.useForm();
//   const [data, setData] = useState([]);
//   const [datas, setDatas] = useState([]);

//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     getAllTasks();
//   }, []);

//   const getAllTasks = async () => {
//     try {
//       const AllTask = await Apiservice.technicianTask();
//       const Tasks = AllTask.data.Results;
//       const mergedTasks = Tasks.reduce((acc, curr) => {
//         acc.push(...curr.technicians[0]?.tasks);
//         return acc;
//       }, []);
//       setDatas(mergedTasks);
//       const ongoingTasks = mergedTasks.filter(task => task.status === "start");
//       setData(ongoingTasks);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const searchTerm = e.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     if (searchTerm === '') {
//       getAllTasks();
//     } else {
//       const filteredItems = data.filter((task) => {
//         const startDate = moment(task.startDate).format('DD-MM-YYYY').toLowerCase();
//         return startDate.includes(searchTerm);
//       });
//       setData(filteredItems);
//     }
//   };

//   const columns = [
//     {
//       title: 'S.No',
//       dataIndex: 'sNo',
//       width: '3%',
//       editable: true,
//       render: (_, __, index) => index + 1
//     },
//     {
//       title: 'Service Name',
//       dataIndex: 'QrCodeCategory',
//       width: '8%',
//       render: (QrCodeCategory) => (
//         <>
//           {QrCodeCategory.map((serviceName, index) => (
//             <div key={index} style={{ textAlign: "left" }}>
//               <div key={index} className="mb-2">
//                 <div>
//                   <div className="fonts13 textLeft" style={{ fontWeight: "700" }}>
//                     {serviceName.category} :
//                   </div>
//                   {serviceName.subCategory.map((subItem, subIndex) => (
//                     <div key={subIndex} className="d-flex flex-row justify-content-between align-items-center">
//                       <div className="d-flex align-items-center fonts13 textLeft">
//                         {subIndex + 1}. {subItem}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </>
//       )
//     },
//     {
//       title: ' Customer Name',
//       dataIndex: 'companyName',
//       width: '8%',
//       editable: true
//     },
//     {
//       title: ' Technician Name',
//       children: [
//         {
//           title: 'Technician Name',
//           dataIndex: 'assignedTo',
//           width: '8%',
//           render: (_, record) => (
//             record.technicianDetails &&
//             `${record.technicianDetails.firstName} ${record.technicianDetails.lastName}`
//           )
//         },
//         {
//           title: 'Technician-2',
//           dataIndex: 'otherTechnicianName',
//           width: '8%',
//           editable: true,
//           render: (_, record) => record.otherTechnicianName ? record.otherTechnicianName : '-'
//         }
//       ]
//     },
//     {
//       title: 'Assigned Date',
//       dataIndex: 'startDate',
//       width: '7%',
//       editable: true,
//       render: (text) => moment(text).format('DD-MM-YYYY'),
//     },
//     {
//       title: 'Qr Code Available',
//       dataIndex: 'available',
//       width: '10%',
//       editable: true
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       width: '8%',
//       fixed: 'right',
//       editable: true,
//       render: () => (
//         <Button style={{ cursor: 'no-drop', backgroundColor: '#3B5888', color: 'white' }}   >
//           Yet to start
//         </Button>
//       )
//     }
//   ];
//   const mergedColumns = columns.map((col) => {
//     if (!col.editable) {
//       return col;
//     }
//     return {
//       ...col,
//       onCell: (record) => ({
//         record,
//         inputType: col.dataIndex === 'age' ? 'number' : 'text',
//         dataIndex: col.dataIndex,
//         title: col.title,

//       })
//     };
//   });
//   return (
//     <>
//       <MainCard title=" Assigned Tasks ">
//         <div className='d-flex justify-content-end ' style={{ position: 'relative', bottom: '10px' }} >
//           {/* <Buttons>
//             Download
//           </Buttons> */}
//           <Search onChange={handleInputChange}
//             placeholder='Search by date'
//             value={searchTerm}
//             style={{ width: '150px', marginLeft: '20px' }}
//           />
//         </div>
//         <Form form={form} component={false}>
//           <Table
//             bordered
//             dataSource={data}
//             columns={mergedColumns}
//             pagination={{ pageSize: 20 }}
//             scroll={{
//               x: 1500,
//             }}
//           />
//         </Form>
//       </MainCard>
//     </>
//   );
// };
// export default TechnicianAssignedTask;
