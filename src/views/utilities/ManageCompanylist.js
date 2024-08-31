import React, { useState, useEffect, useRef } from 'react';
import { Table, Form, Typography } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import Buttons from 'ui-component/Button/Button';
import Search from 'ui-component/SearchFilter/Search';
import ApiAllCompanys from '../../Services/CustomerServices';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Modal from 'react-bootstrap/Modal';
import * as Yup from 'yup';
import { Formik, Field, ErrorMessage } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import { Country, State, City } from 'country-state-city';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { IconTrash } from '@tabler/icons';
import { IconEdit } from '@tabler/icons';
import Loader from 'ui-component/Loader/Loader';
import Mudule from 'ui-component/module/Mudule';

const CustomerListTable = () => {
  const [Show, setShow] = useState(false);
  const [idFetch, setIdFetch] = useState(false);
  const [deletedCompany, setDeletedCompany] = useState('');
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const tableRef = useRef(null);
  const [namefetch, setNamefetch] = useState('');
  const [emailfetch, setEmailfetch] = useState('');
  const [phoneFetch, setPhonefetch] = useState('');
  const [addressFetch, setAddressfetch] = useState('');
  const [countryFetch, setCountryfetch] = useState('');
  const [stateFetch, setStatefetch] = useState('');
  const [cityFetch, setCityfetch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customerId, setCustomerId] = useState('');

  useEffect(() => {
    getAllCompanies();
  }, [deletedCompany]);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      getAllCompanies();
    } else {
      const filteredItems = data.filter((userdata) => userdata.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setData(filteredItems);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCustomerId('');
  };

  const handleShowModel = (_id) => {
    setShowModal(true);
    setCustomerId(_id);
  };

  console.log('cusId', customerId);

  const isEditing = (record) => record.key === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const getAllCompanies = async () => {
    setLoader(true);
    try {
      const AllCompanies = await ApiAllCompanys.getCompany();
      const Companies = AllCompanies?.data?.Results;
      const sortedData = Companies.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

      setData(sortedData);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoader(false);
    }
  };

  const handleShow = async (_id, email, name, phoneNumber, address, city, state, country) => {
    setIdFetch(_id);
    setNamefetch(name);
    setEmailfetch(email);
    setPhonefetch(phoneNumber);
    setAddressfetch(address);
    setCityfetch(city);
    setStatefetch(state);
    setCountryfetch(country);

    const selectedCountry = Country.getAllCountries().find((c) => c.name === country);
    const selectedState = State.getStatesOfCountry(selectedCountry?.isoCode).find((s) => s.name === state);

    setSelectedCountry(selectedCountry);
    setSelectedState(selectedState);

    setShow(true);
  };

  const onSubmit = async (values) => {
    setLoader(true);
    try {
      const res = await ApiAllCompanys.EditCustomer(values);
      console.log('res:', res);
      toast.success(res.data.message);
      setShow(false);
      getAllCompanies();
    } catch (error) {
      toast.error(error);
    } finally {
      setLoader(false);
    }
  };

  const handleConfirmModal = async () => {
    const _id = customerId;
    setLoader(true);
    try {
      const res = await ApiAllCompanys.DeleteCustomer(_id);
      if (res.status === 200) {
        toast.success('Customer Deleted Successfully');
        setDeletedCompany(res.data);
      } else {
        console.error('Failed to delete customer:');
        toast.error('Failed to Delete Customer');
      }
    } catch (error) {
      console.error('Error Deleting Customer:', error);
      toast.error('Error Deleting Customer');
    } finally {
      setLoader(false);
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sNo',
      width: '5%',
      editable: true,
      render: (_, record, index) => index + 1
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '15%',
      editable: true,
      fixed: 'left'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: '12%',
      editable: true,
      render: (_, record) => `${record.phoneNumber}`
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '20%',
      editable: true
    },
    {
      title: 'Country',
      dataIndex: 'country',
      width: '15%',
      editable: true
    },
    {
      title: 'State',
      dataIndex: 'state',
      width: '15%',
      editable: true
    },
    {
      title: 'City',
      dataIndex: 'city',
      width: '15%',
      editable: true
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: '15%',
      editable: true
    },
    {
      title: 'Created Date',
      dataIndex: 'created_date',
      width: '15%',
      render: (text) => moment(text).format('DD-MM-YYYY')
    },
    {
      title: 'Action',
      width: '10%',
      dataIndex: 'action',
      fixed: 'right',
      render: (_, record) => {
        // console.log("record",record);
        const editable = isEditing(record);
        return editable ? (
          <span></span>
        ) : (
          <div className="d-flex justify-content-center gap-4  flex-row ">
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() =>
                handleShow(
                  record._id,
                  record.email,
                  record.name,
                  record.phoneNumber,
                  record.address,
                  record.city,
                  record.state,
                  record.country
                )
              }
            >
              <IconEdit />
            </Typography.Link>
            <div className="d-flex justify-content-center">
              <span style={{ cursor: 'pointer' }}>
                <IconTrash onClick={() => handleShowModel(record._id)} />
              </span>
            </div>
          </div>
        );
      }
    }
  ];

  const downloadPDF = () => {
    const pdf = new jsPDF();

    const formattedData = data.map((item, index) => ({
      'S.No': index + 1,
      Name: item.name,
      Phone: item.phoneNumber,
      Email: item.email,
      Country: item.country,
      State: item.state,
      City: item.city,
      Address: item.address,
      'Created Date': moment(item.created_date).format('DD-MM-YYYY')
    }));

    const fileName = 'CustomerData.pdf';
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };

    const content = {
      startY: margin,
      head: [['S.No', 'Name', 'Phone', 'Email', 'Country', 'State', 'City', 'Address', 'Created Date']],
      body: []
    };

    const columnWidths = [];
    Object.keys(formattedData[0]).forEach((key) => {
      const maxLength = Math.max(...formattedData.map((item) => item[key].toString().length));
      columnWidths.push({ columnWidth: maxLength > 25 ? 25 : maxLength + 12 });
    });

    formattedData.forEach((item) => {
      content.body.push(Object.values(item));
    });

    pdf.autoTable({
      ...content,
      styles: { overflow: 'linebreak' },
      columnStyles: columnWidths
    });

    pdf.save(fileName);
  };
  console.log('fetched', stateFetch);

  return (
    <>
      {loader && <Loader show={loader} />}

      <MainCard title="Manage Customers">
        <div className="d-flex justify-content-end " style={{ position: 'relative', bottom: '10px' }}>
          {/* <Buttons onClick={downloadPDF}>Download</Buttons> */}
          <Search
            onChange={handleInputChange}
            placeholder="Search by name"
            value={searchTerm}
            style={{ width: '150px', marginLeft: '20px' }}
          />
        </div>
        <Form form={form} component={false}>
          <div ref={tableRef}>
            <Table
              components={{
                body: {
                  // cell: EditableCell,
                }
              }}
              bordered
              dataSource={data}
              columns={columns}
              rowClassName="editable-row"
              pagination={{
                onChange: cancel
              }}
              scroll={{
                x: 2000
              }}
            />
            <Mudule
              modalTitle="Delete Customer"
              modalContent="Are you sure want to delete customer?"
              show={showModal}
              onClose={handleCloseModal}
              onConfirm={handleConfirmModal}
            />
          </div>
        </Form>

        <Modal className="editmodal d-flex align-items-center" show={Show} onHide={handleClose}>
          <Modal.Header className="modalhead" closeButton>
            <Modal.Title>Edit Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modalbody">
            <div>
              <>
                <Formik
                  initialValues={{
                    id: idFetch,
                    name: namefetch,
                    email: emailfetch,
                    phoneNumber: phoneFetch,
                    address: addressFetch,
                    country: countryFetch,
                    state: stateFetch,
                    city: cityFetch,
                    submit: null
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
                  })}
                  onSubmit={onSubmit}
                >
                  {({ values, setFieldValue }) => (
                    <Form>
                      <div className="d-flex flex-row">
                        <div className="col-6 p-2">
                          <label htmlFor="name" className="mt-3">
                            Customer Name
                          </label>
                          <Field name="name" type="text" className="newcompany form-control mt-3" placeholder="Enter Customer Name" />
                          <ErrorMessage name="name" component="div" className="text-danger mt-2" />
                        </div>
                        <div className="col-6 p-2">
                          <label htmlFor="address" className="mt-3">
                            Customer Address
                          </label>
                          <Field name="address" type="text" className="newcompany form-control mt-3" placeholder="Enter Customer Address" />
                          <ErrorMessage name="address" component="div" className="text-danger mt-2" />
                        </div>
                      </div>

                      <div className="d-flex flex-row">
                        <div className="col-6 p-2">
                          <label htmlFor="country" className="">
                            Country
                          </label>
                          <Select
                            className="mt-3"
                            options={Country.getAllCountries().map((country) => ({
                              value: country.name,
                              label: country.name,
                              isoCode: country.isoCode
                            }))}
                            value={selectedCountry ? { value: selectedCountry.name, label: selectedCountry.name } : null}
                            onChange={(option) => {
                              setFieldValue('country', option.value);
                              const country = Country.getAllCountries().find((c) => c.name === option.value);
                              setSelectedCountry(country);
                              setSelectedState(null);
                              setFieldValue('state', '');
                              setFieldValue('city', '');
                            }}
                            isClearable
                          />
                          <ErrorMessage name="country" component="div" className="text-danger mt-2" />
                        </div>
                        <div className="col-6 p-2">
                          <label htmlFor="state" className="">
                            State
                          </label>
                          <Select
                            className="mt-3"
                            options={
                              selectedCountry
                                ? State.getStatesOfCountry(selectedCountry.isoCode).map((state) => ({
                                    value: state.name,
                                    label: state.name,
                                    isoCode: state.isoCode
                                  }))
                                : []
                            }
                            value={selectedState ? { value: selectedState.name, label: selectedState.name } : null}
                            onChange={(option) => {
                              setFieldValue('state', option.value);
                              const state = State.getStatesOfCountry(selectedCountry.isoCode).find((s) => s.name === option.value);
                              setSelectedState(state);
                              setFieldValue('city', '');
                            }}
                            isClearable
                            isDisabled={!selectedCountry}
                          />
                          <ErrorMessage name="state" component="div" className="text-danger mt-2" />
                        </div>
                      </div>

                      <div className="d-flex flex-row">
                        <div className="col-6 p-2">
                          <label htmlFor="city" className="">
                            City
                          </label>
                          <Select
                            className="mt-3"
                            options={
                              selectedState
                                ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode).map((city) => ({
                                    value: city.name,
                                    label: city.name
                                  }))
                                : []
                            }
                            value={values.city ? { value: values.city, label: values.city } : null}
                            onChange={(option) => setFieldValue('city', option.value)}
                            isClearable
                            isDisabled={!selectedState}
                          />
                          <ErrorMessage name="city" component="div" className="text-danger mt-2" />
                        </div>
                        <div className="col-6 p-2">
                          <label htmlFor="phoneNumber" className=" mb-3">
                            Phone Number
                          </label>
                          <PhoneInput country={'bh'} value={values.phoneNumber} onChange={(phone) => setFieldValue('phoneNumber', phone)} />
                        </div>
                      </div>

                      <div className="d-flex ">
                        <div className="col-12 p-2">
                          <label htmlFor="email" className="">
                            Email Address
                          </label>
                          <Field name="email" type="email" className="newcompany form-control mt-3" placeholder="Enter Email Address" />
                          <ErrorMessage name="email" component="div" className="text-danger mt-2" />
                        </div>
                      </div>
                      <div className="col-4 mt-4">
                        <div className="col-4 mt-4">
                          <button type="submit" onClick={() => onSubmit(values)} className="btn tech-btn">
                            Update
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </>
            </div>
          </Modal.Body>
        </Modal>
        <ToastContainer />
      </MainCard>
    </>
  );
};

export default CustomerListTable;
