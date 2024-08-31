// import React, { useState } from 'react';
// import MainCard from 'ui-component/cards/MainCard';
// import { Form, Popconfirm, Table, Typography } from 'antd';
// import { IconTrash } from '@tabler/icons';
// import ApiService from '../../Services/TechniciansService';


// const DeleteTechnician = () => {
//   const [form] = Form.useForm();
//   const [data, setData] = useState([]);
//   const [editingKey, setEditingKey] = useState('');

//   const isEditing = (record) => record.key === editingKey;

//   const cancel = () => {
//     setEditingKey('');
//   };

//   const save = async (key) => {
//     try {
//       const row = await form.validateFields();
//       const newData = [...data];
//       const index = newData.findIndex((item) => key === item.key);
//       if (index > -1) {
//         const item = newData[index];
//         newData.splice(index, 1, {
//           ...item,
//           ...row,
//         });
//         setData(newData);
//         setEditingKey('');
//       } else {
//         newData.push(row);
//         setData(newData);
//         setEditingKey('');
//       }
//     } catch (errInfo) {
//       console.log('Validate Failed:', errInfo);
//     }
//   };

//   const deleteTechnician = async (technicianId) => {
//     try {
//       // Call your API to delete technician with ID technicianId
//       // Example:
//       await ApiService.DeleteTechnician(technicianId);
//       // After successful deletion, remove the technician from the table
//       setData(data.filter((technician) => technician.key !== technicianId));
//     } catch (error) {
//       console.error('Error deleting technician:', error);
//     }
//   };

//   const columns = [
//     {
//       title: 'S.No',
//       dataIndex: 'sNo',
//       width: '5%',
//       editable: true,
//     },
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       width: '15%',
//       editable: true,
//     },
//     {
//       title: 'Phone',
//       dataIndex: 'phone',
//       width: '12%',
//       editable: true,
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       width: '15%',
//       editable: true,
//     },
//     {
//       title: 'Address',
//       dataIndex: 'address',
//       width: '20%',
//       editable: true,
//     },
//     {
//       title: 'Created Date',
//       dataIndex: 'createdDate',
//       width: '10%',
//       editable: true,
//     },
//    {
//       title: 'Operation',
//       width: '8%',
//       dataIndex: 'operation',
//       render: (_, record) => {
//         const editable = isEditing(record);
//         return editable ? (
//           <span>
//             <Typography.Link
//               onClick={() => save(record.key)}
//               style={{
//                 marginRight: 8,
//               }}
//             >
//               Save
//             </Typography.Link>
//             <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
//               <a>Cancel</a>
//             </Popconfirm>
//           </span>
//         ) : (
//           <div className='d-flex justify-content-center' >

//             {/* <span className='col-6'>
//           <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
//           <IconEdit />
//           </Typography.Link>
//           </span> */}
//             <span style={{ cursor: 'pointer' }}  >
//               < IconTrash onClick={() => handleDelete(record.key)} />
//             </span>
//           </div>
//         );
//       },
//     },
//     {
//       title: 'Delete',
//       width: '8%',
//       dataIndex: 'delete',
//       fixed:'right',
//       render: (_, record) => {
// <div className='d-flex justify-content-center' >
//             <span style={{ cursor: 'pointer' }}  >
//               <IconTrash onClick={() =>deleteTechnician(record._id)} />
//             </span>
//           </div>
//     }
//   }
    
//   ];


  

//   return (
//     <MainCard title="Delete Technician Login">
//       <Form form={form} component={false}>
//         <Table
//           components={{
//             body: {
//               cell: EditableCell,
//             },
//           }}
//           bordered
//           dataSource={data}
//           columns={columns}
//           rowClassName="editable-row"
//           pagination={false}
//         />
//       </Form>
//     </MainCard>
//   );
// };

// export default DeleteTechnician;
