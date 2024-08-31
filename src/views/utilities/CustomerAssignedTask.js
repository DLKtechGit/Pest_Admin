// import React, { useState } from 'react';
// // import { useNavigate } from 'react-router';
// import Buttons from 'ui-component/Button/Button';
// import MainCard from 'ui-component/cards/MainCard';
// import { Form, Button, Table } from 'antd';
// import Search from 'ui-component/SearchFilter/Search';
// import Apiservice from '../../Services/TechniciansService'
// import { useEffect } from 'react';
// import moment from 'moment';



// const CustomerAssignedTask = () => {
//   const [form] = Form.useForm();
//   const [data, setData] = useState('');
//   console.log('data=====>', data);
//   const [datas, setDatas] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     getAllTasks()
//   }, [])


//   const handleInputChange = (e) => {
//     const searchTerm = e.target.value;
//     setSearchTerm(searchTerm);
//     const filteredItems = data.filter((userdata) =>
//       userdata.startDate.includes(searchTerm)
//     );
//     setData(filteredItems);
//   };

//   // const getAllTasks = async () => {
//   //   const AllTask = await Apiservice.technicianTask()
//   //   const Tasks = AllTask.data.Results
//   //   const ongoingTasks = Tasks.filter(task => task.status === "start");
//   //   setData(ongoingTasks);

//   // }
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

//   const columns = [
//     {
//       title: 'S.No',
//       dataIndex: 'sNo',
//       width: '5%',
//       editable: true,
//       render: (_, __, index) => index + 1
//     },
//     {
//       title: 'Service ID',
//       dataIndex: '_id',
//       width: '10%',
//       editable: true
//     },
//     {
//       title: ' Customer Name',
//       dataIndex: 'companyName',
//       width: '13%',
//       editable: true
//     },
//     {
//       title: 'Service Name',
//       dataIndex: 'serviceName',
//       width: '15%',
//       editable: true
//     },
//     {
//       title: ' Technician Name',
//       children: [
//         {
//           title: 'Technician Name',
//           dataIndex: 'assignedTo',
//           width: '12%',
//           render: (_, record) => record.assignedTo && record.assignedTo.map(technician => `${technician.firstName} ${technician.lastName}`)
//         },
//         {
//           title: 'Technician-2',
//           dataIndex: 'technicianname2',
//           width: '12%',
//           editable: true
//         }
//       ]
//     },
    

//     {
//       title: 'Start Date',
//       dataIndex: 'startDate',
//       width: '10%',
//       editable: true,
//       render: (text) => moment(text).format('DD-MM-YYYY'),
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
//       <MainCard title=" Assigned Tasks  ">
//         <div className='d-flex justify-content-end ' style={{ position: 'relative', bottom: '10px' }} >
//           <Buttons>
//             Download
//           </Buttons>
//           <Search onChange={handleInputChange}
//             placeholder='Search by date'
//             value={searchTerm}
//             style={{ width: '150px', marginLeft: '20px' }}
//           />
//         </div>
//         <Form form={form} component={false}>
//           <Table

//             dataSource={data}
//             columns={mergedColumns}

//             pagination={{

//             }}
//             scroll={{
//               x: 2000,
//               y: 240,
//             }}
//           />
//         </Form>
//       </MainCard>
//     </>
//   );
// };
// export default CustomerAssignedTask;
