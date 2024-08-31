// import React, { useState, useRef } from 'react';
// import MainCard from 'ui-component/cards/MainCard';
// import { IconTrash } from '@tabler/icons';
// import { IconEdit } from '@tabler/icons';
// import { Input, InputNumber, Typography, Table, Modal, Form } from 'antd';
// import Buttons from 'ui-component/Button/Button';
// import Search from 'ui-component/SearchFilter/Search';
// import ApiAllCompanys from '../../Services/CustomerServices';
// import { useEffect } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import { useDispatch } from 'react-redux';
// import { storeDeletedCompany } from 'store/actions';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import moment from 'moment';
// import { Formik, Field, ErrorMessage } from "formik";
// import { Country, State, City } from 'country-state-city';
// import Select from 'react-select';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';

// const EditableCell = ({ editing, dataIndex, title, inputType, children, ...restProps }) => {
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

// const ManageCompanylist = () => {
//   const [form] = Form.useForm();
//   const [data, setData] = useState('');
//   const [editingKey, setEditingKey] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [deletedCompany, setDeletedCompany] = useState('');
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const tableRef = useRef(null);
//   const dispatch = useDispatch();
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [selectedState, setSelectedState] = useState(null);

//   useEffect(() => {
//     getAllCompanys();
//   }, [deletedCompany]);

//   const showModal = () => {
//     if (!isModalVisible) {
//       setIsModalVisible(true);
//     }
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     setEditingKey('');
//   };

//   const handleInputChange = (e) => {
//     const searchTerm = e.target.value;
//     setSearchTerm(searchTerm);
//     if (searchTerm === '') {
//       getAllCompanys();
//     }
//     const filteredItems = data.filter((userdata) => userdata.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));
//     setData(filteredItems);
//   };

//   // const isEditing = (record) => record._id === editingKey;

//   const edit = async (_id) => {
//     try {
//       const response = await ApiAllCompanys.getCompany(_id);
//       if (response && response.data) {
//         const record = response.data;
//         form.setFieldsValue({
//           name: record.name,
//           email: record.email,
//           address: record.address,
//           country: record.country,
//           state: record.state,
//           city: record.city,
//           phone: record.phoneNumber
//         });
//         setEditingKey(record._id);
//         showModal();
//       } else {
//         console.error('Failed to fetch record data or empty response');
//       }
//     } catch (error) {
//       console.error('Error while fetching record data:', error);
//     }
//   };

//   const cancel = () => {
//     setEditingKey('');
//   };

//   const initialValues = {
//     name: "",
//     email: "",
//     address: "",
//     country: "",
//     state: "",
//     city: "",
//     phone: ""
//   }

//   const handleClick = async (values) => {
//     try {
//       console.log("Form Values:", values);
//       const res = await ApiAllCompanys.createCompany(values);
//       if (res.status === 201) {
//         toast.success("New Customer Created Successfully");
//       } else {
//         toast.error("Customer Creation Failed");
//       }
//     } catch (error) {
//       console.error("Error creating customer:", error);
//       toast.error("An error occurred while creating the customer");
//     }
//   };

//   const getAllCompanys = async () => {
//     const AllCompanys = await ApiAllCompanys.getCompany();
//     const Companys = AllCompanys.data.Results;
//     setData(Companys);
//   };

//   const DeleteCompany = async (_id) => {
//     try {
//       const res = await ApiAllCompanys.DeleteCustomer(_id);
//       if (res.status === 200) {
//         toast.success('Customer Deleted Successfully');
//         dispatch(storeDeletedCompany(res.data)); // Assuming the deleted company data is in res.data
//         setDeletedCompany(res.data); // Assuming the deleted company data is set here
//       } else {
//         toast.error('Failed to Delete Customer');
//       }
//     } catch (error) {
//       console.error('Error Deleting Customer:', error);
//       toast.error('Error Deleting Customer');
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
//       width: '8%',
//       dataIndex: 'operation',
//       fixed: 'right',
//       render: (_, record) => (
//         <div className="d-flex justify-content-center gap-4  flex-row ">
//           <div>
//             <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record._id)}>
//               <IconEdit />
//             </Typography.Link>
//           </div>
//           <div className="d-flex justify-content-center">
//             <span style={{ cursor: 'pointer' }}>
//               <IconTrash onClick={() => DeleteCompany(record._id)} />
//             </span>
//           </div>
//         </div>
//       )
//     }
//   ];

 
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

//     const fileName = 'CustomerData.pdf';
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
//       <MainCard title="Manage Customer">
//         <div className="d-flex justify-content-end " style={{ position: 'relative', bottom: '10px' }}>
//           <Buttons onClick={downloadPDF}>Download</Buttons>
//           <Search
//             onChange={handleInputChange}
//             placeholder="Search by name"
//             value={searchTerm}
//             style={{ width: '150px', marginLeft: '20px' }}
//           />
//         </div>
//         <div ref={tableRef}>
//           <Table
//             components={{
//               body: {
//                 cell: EditableCell
//               }
//             }}
//             bordered
//             dataSource={data}
//             columns={columns}
//             rowClassName="editable-row"
//             pagination={{
//               onChange: cancel
//             }}
//             scroll={{
//               x: 2000
//             }}
//           />
//         </div>
//         <Modal className='modal d-flex align-items-center' title="Edit Customer Details" visible={isModalVisible} onCancel={handleCancel} footer={null}>
//           <Formik
//             initialValues={initialValues}
//             onSubmit={(values, actions) => {
//               handleClick(values).then(() => {
//                 actions.resetForm({
//                   values: {
//                     name: "",
//                     email: "",
//                     address: "",
//                     country: "",
//                     state: "",
//                     city: "",
//                     phone: ""
//                   },
//                 });
//               });
//             }}
//           >
//             {({ values, setFieldValue }) => (
//               <Form>
//                 <div className="d-flex flex-row">
//                   <div className="col-6 p-2">
//                     <label htmlFor="name" className="mt-3">Customer Name</label>
//                     <Field
//                       name="name"
//                       type="text"
//                       className="newcompany form-control mt-3"
//                       placeholder='Enter Customer Name'
//                     />
//                     <ErrorMessage name="name" component="div" className="text-danger mt-2" />
//                   </div>
//                   <div className="col-6 p-2">
//                     <label htmlFor="address" className="mt-3">Customer Address</label>
//                     <Field
//                       name="address"
//                       type="text"
//                       className="newcompany form-control mt-3"
//                       placeholder='Enter Customer Address'
//                     />
//                     <ErrorMessage name="address" component="div" className="text-danger mt-2" />
//                   </div>
//                 </div>

//                 <div className="d-flex flex-row">
//                   <div className="col-6 p-2">
//                     <label htmlFor="country" className="mt-3">Country</label>
//                     <Select
//                       className='mt-3'
//                       options={Country.getAllCountries()}
//                       getOptionLabel={(option) => option.name}
//                       getOptionValue={(option) => option.name}
//                       value={Country.getAllCountries().find(country => country.name === values.country)}
//                       onChange={(selectedOption) => {
//                         setFieldValue("country", selectedOption.name);
//                         setSelectedCountry(selectedOption);
//                       }}
//                     />
//                     <ErrorMessage name="country" component="div" className="text-danger mt-2" />
//                   </div>
//                   <div className="col-6 p-2">
//                     <label htmlFor="state" className="mt-3">State</label>
//                     <Select
//                       className='mt-3'
//                       options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
//                       getOptionLabel={(option) => option.name}
//                       getOptionValue={(option) => option.name}
//                       value={State.getStatesOfCountry(selectedCountry?.isoCode)?.find(state => state.name === values.state)}
//                       onChange={(selectedOption) => {
//                         setFieldValue("state", selectedOption.name);
//                         setSelectedState(selectedOption);
//                       }}
//                     />
//                     <ErrorMessage name="state" component="div" className="text-danger mt-2" />
//                   </div>
//                 </div>

//                 <div className="d-flex flex-row">
//                   <div className="col-6 p-2">
//                     <label htmlFor="city" className="mt-3">City</label>
//                     <Select
//                       className='mt-3'
//                       options={City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode)}
//                       getOptionLabel={(option) => option.name}
//                       getOptionValue={(option) => option.name}
//                       value={City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode)?.find(city => city.name === values.city)}
//                       onChange={(selectedOption) => setFieldValue("city", selectedOption.name)}
//                     />
//                     <ErrorMessage name="city" component="div" className="text-danger mt-2" />
//                   </div>
//                   <div className="col-6 p-2">
//                     <label htmlFor="phoneNumber" className="mt-3 mb-3">Phone Number</label>
//                     <PhoneInput
//                       country={'bh'}
//                       value={values.phoneNumber}
//                       onChange={(phone) => setFieldValue("phoneNumber", phone)}
//                     />
//                   </div>
//                 </div>

//                 <div className="d-flex flex-row">
//                   <div className="col-6 p-2">
//                     <label htmlFor="email" className="mt-3">Email Address</label>
//                     <Field
//                       name="email"
//                       type="email"
//                       className="newcompany form-control mt-3"
//                       placeholder='Enter Email Address'
//                     />
//                     <ErrorMessage name="email" component="div" className="text-danger mt-2" />
//                   </div>
//                 </div>

//                 <div className="col-4 mt-4">
//                   <button type="submit" className='btn tech-btn'>Create</button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </Modal>
//       </MainCard>
//       <ToastContainer />
//     </>
//   );
// };

// export default ManageCompanylist;
