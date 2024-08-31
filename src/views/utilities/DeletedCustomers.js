// import React, { useState, useRef } from 'react';
// import Buttons from 'ui-component/Button/Button';
// import { Button } from 'antd';
// // import { useNavigate } from 'react-router';
// import MainCard from 'ui-component/cards/MainCard';
// import { Form, Input, InputNumber, Popconfirm, Typography, Table } from 'antd';
// import Search from 'ui-component/SearchFilter/Search';
// import ApiService from '../../Services/CustomerServices';
// import { useEffect } from 'react';

// import moment from 'moment';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { toast, ToastContainer } from 'react-toastify';
// import Loader from 'ui-component/Loader/Loader';

// const EditableCell = ({
//   editing,
//   dataIndex,
//   title,
//   inputType,
//   // record,
//   // index,
//   children,
//   ...restProps
// }) => {
//   const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
//   return (
//     <td {...restProps}>
//       {editing ? (
//         <Form.Item
//           name={dataIndex}
//           style={{
//             margin: 0
//           }}
//           rules={[
//             {
//               required: true,
//               message: `Please Input ${title}!`
//             }
//           ]}
//         >
//           {inputNode}
//         </Form.Item>
//       ) : (
//         children
//       )}
//     </td>
//   );
// };
// const DeletedCustomers = () => {
//   // let navigate = useNavigate()

//   const [form] = Form.useForm();
//   const [data, setData] = useState('');
//   const [restoreCustomers, setRestoreCustomers] = useState('');
//   const [editingKey, setEditingKey] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const tableRef = useRef(null);
//   const [loader,setLoader] = useState(false)

//   useEffect(() => {
//     getDeletedCustomers();
//   }, [restoreCustomers]);

//   const getDeletedCustomers = async () => {
//     setLoader(true)
//    try {
//     const res = await ApiService.DeletedCustomers();
//     console.log('res', res);
//     const DeletedCustomerList = res.data.data;
//     const sortedData = DeletedCustomerList.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

//     setData(sortedData);
//    } catch (error) {
//     console.log(error);
//    }
//    finally{
//     setLoader(false)

//    }
//   };

//   const RestoreCustomer = async (_id) => {
//     setLoader(true)
//     try {
//       const response = await ApiService.RestoreCustomer(_id);
//     console.log('ID===========>', response);
    
//     toast.success('Customer Restored Successfully');
//     setRestoreCustomers(response);
//     } catch (error) {
//       console.log(error);
//     }
//     finally{
//       setLoader(false)
//     }
   
//   };

//   const handleInputChange = (e) => {
//     const searchTerm = e.target.value;
//     setSearchTerm(searchTerm);
//     if (searchTerm === '') {
//       getDeletedCustomers();
//     } else {
//       const filteredItems = data.filter((userdata) => userdata.name.toLowerCase().includes(searchTerm.toLowerCase()));
//       setData(filteredItems);
//     }
//   };
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
//           ...row
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

//   const columns = [
//     {
//       title: 'S.No',
//       dataIndex: 'sNo',
//       width: '5%',
//       editable: true,
//       render: (_, record, index) => index + 1
//     },
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       width: '15%',
//       editable: true,
//       fixed: 'left'
//     },
//     {
//       title: 'Phone',
//       dataIndex: 'phoneNumber',
//       width: '12%',
//       editable: true
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       width: '20%',
//       editable: true
//     },
//     {
//       title: 'Country',
//       dataIndex: 'country',
//       width: '15%',
//       editable: true
//     },
//     {
//       title: 'State',
//       dataIndex: 'state',
//       width: '15%',
//       editable: true
//     },
//     {
//       title: 'City',
//       dataIndex: 'city',
//       width: '15%',
//       editable: true
//     },
//     {
//       title: 'Address',
//       dataIndex: 'address',
//       width: '15%',
//       editable: true
//     },
//     {
//       title: 'Created Date',
//       dataIndex: 'created_date',
//       width: '15%',
//       render: (text) => moment(text).format('DD-MM-YYYY')
//     },
//     {
//       title: 'Action',
//       width: '10%',
//       dataIndex: 'action',
//       fixed: 'right',
//       render: (_, record) => {
//         const editable = isEditing(record);
//         return editable ? (
//           <span>
//             <Typography.Link
//               onClick={() => save(record.key)}
//               style={{
//                 marginRight: 8
//               }}
//             >
//               Save
//             </Typography.Link>
//             <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
//               <a>Cancel</a>
//             </Popconfirm>
//           </span>
//         ) : (
//           <div className="d-flex gap-3 justify-content-center">
//             <span className="">
//               <Button type="primary" className="tech-btn" onClick={() => RestoreCustomer(record._id)}>
//                 Restore
//               </Button>
//             </span>
//           </div>
//         );
//       }
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
//         editing: isEditing(record)
//       })
//     };
//   });

//   // const getCustomers = async()=>{
//   //   const res = await ApiService.getCompany()
//   //   const Customers = res.data.Results
//   //   setData(Customers)
//   // }

//   const downloadPDF = () => {
//     const pdf = new jsPDF();

//     const formattedData = data.map((item, index) => ({
//       'S.No': index + 1,
//       Name: item.name,
//       Phone: item.phoneNumber,
//       Email: item.email,
//       Country: item.country,
//       State: item.state,
//       City: item.city,
//       Address: item.address,
//       'Created Date': moment(item.created_date).format('DD-MM-YYYY')
//     }));

//     const fileName = 'Customer-Deleted-Data.pdf';
//     const margin = { top: 0, right: 0, bottom: 0, left: 0 };

//     const content = {
//       startY: margin,
//       head: [['S.No', 'Name', 'Phone', 'Email', 'Country', 'State', 'City', 'Address', 'Created Date']],
//       body: []
//     };

//     const columnWidths = [];
//     Object.keys(formattedData[0]).forEach((key) => {
//       const maxLength = Math.max(...formattedData.map((item) => item[key].toString().length));
//       columnWidths.push({ columnWidth: maxLength > 25 ? 25 : maxLength + 12 });
//     });

//     formattedData.forEach((item) => {
//       content.body.push(Object.values(item));
//     });

//     pdf.autoTable({
//       ...content,
//       styles: { overflow: 'linebreak' },
//       columnStyles: columnWidths
//     });

//     pdf.save(fileName);
//   };

//   return (
//     <>
//      {loader && (
//       <Loader show={loader}/>
      
//     )} 
//       <MainCard title="  Restore Customers">
//         <div className="d-flex justify-content-end " style={{ position: 'relative', bottom: '10px' }}>
//           {/* <Buttons onClick={downloadPDF}>Download</Buttons> */}
//           <Search
//             onChange={handleInputChange}
//             placeholder="Search by name"
//             value={searchTerm}
//             style={{ width: '150px', marginLeft: '20px' }}
//           />
//         </div>
//         <Form form={form} component={false}>
//           <div ref={tableRef}>
//             <Table
//               components={{
//                 body: {
//                   cell: EditableCell
//                 }
//               }}
//               bordered
//               dataSource={data}
//               columns={mergedColumns}
//               rowClassName="editable-row"
//               pagination={{
//                 onChange: cancel
//               }}
//               scroll={{
//                 x: 2000
//               }}
//             />
//           </div>
//         </Form>
//       </MainCard>
//       <ToastContainer />
//     </>
//   );
// };
// export default DeletedCustomers;
