import React, { useState, useEffect, useRef } from 'react';
import { Table, Popconfirm, Form } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import Buttons from 'ui-component/Button/Button';
import Search from 'ui-component/SearchFilter/Search';
import ApiCustomers from '../../Services/CustomerServices';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Modal from 'react-bootstrap/Modal';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  useMediaQuery,
  Select,
  MenuItem
} from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast, ToastContainer } from 'react-toastify';
import Loader from 'ui-component/Loader/Loader';

const CustomerListTable = () => {
  // let navigate = useNavigate();
  const [Show, setShow] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const tableRef = useRef(null);
  const theme = useTheme();
  // const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  // const customization = useSelector((state) => state.customization);
  const [showPassword, setShowPassword] = useState(false);
  const [namefetch, setNamefetch] = useState('');
  const [emailfetch, setEmailfetch] = useState('');
const [loader,setLoader] = useState(false)
  useEffect(() => {
    getCustomersList();
  }, []);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      getCustomersList();
    } else {
      const filteredItems = data.filter((userdata) => userdata.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setData(filteredItems);
    }
  };

  const isEditing = (record) => record.key === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const getCustomersList = async () => {
    setLoader(true)
    try {
      const getCustomers = await ApiCustomers.getCompany();
      const customerData = getCustomers.data.Results;

      // Sort the customerData array by the created_date in ascending order
      const sortedData = customerData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

      setData(sortedData);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
    finally{
      setLoader(false)
    }
  };

  const handleShow = async (_id, email, name) => {
    // console.log("id--------->",_id, email, name)
    setNamefetch(name);
    setEmailfetch(email);
    setShow(true);
  };

  const onSubmit = async (_id, { setErrors, setStatus, setSubmitting, resetForm }) => {
    setLoader(true)
    try {
      const response = await ApiCustomers?.RegisterCustomer(_id);
      console.log('response------>', response);
      if (response && response.status === 200) {
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        toast.success(response?.data?.message);
        setShow(false);
      } else {
        const errorMessage = response?.data?.message;
        setStatus({ success: false });
        setErrors({ submit: errorMessage });
        setSubmitting(false);
        toast.error(errorMessage);
        setShow(false);
      }
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err });
      setSubmitting(false);
      toast.error(err);
    }
    setLoader(false)
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div className="d-flex gap-3 justify-content-center">
            <span>
              <Button type="primary" onClick={() => handleShow(record._id, record.email, record.name)} className="tech-btn">
                Create Login
              </Button>
            </span>
          </div>
        );
      }
    }
  ];

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

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

  return (
    <>
  {loader && (
      <Loader show={loader}/>
      
    )} 
   
    <MainCard title="Customers List">
      <div className="d-flex justify-content-end " style={{ position: 'relative', bottom: '10px' }}>
        <Buttons onClick={downloadPDF}>Download</Buttons>
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
        </div>
      </Form>

      <Modal className="modal d-flex align-items-center" show={Show} onHide={handleClose}>
        <Modal.Header className="modalhead" closeButton>
          <Modal.Title>Create Login</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalbody">
          <div>
            <>
              <Formik
                initialValues={{
                  name: namefetch,
                  email: emailfetch,
                  password: '',
                  submit: null
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                  password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={onSubmit}
              >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={matchDownSM ? 0 : 2}>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          fullWidth
                          disabled // Add disabled attribute to make the field non-editable
                          label="Name"
                          margin="normal"
                          name="fname"
                          type="text"
                          value={namefetch} // Set the default value to namefetch
                          sx={{ ...theme.typography.customInput }}
                        />
                      </Grid>
                    </Grid>
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                      <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
                      <OutlinedInput
                        disabled
                        id="outlined-adornment-email-register"
                        type="email"
                        value={values.email} // Already set to values.email which will be updated with emailfetch
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                      {touched.email && errors.email && (
                        <FormHelperText error id="standard-weight-helper-text--register">
                          {errors.email}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
                      <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password-register"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        name="password"
                        label="Password"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          // changePassword(e.target.value);
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              size="large"
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        inputProps={{}}
                      />
                    </FormControl>

                    <Box sx={{ mt: 3, mb: 3 }}>
                      <AnimateButton>
                        <Button
                          className="tech-btn"
                          disableElevation
                          disabled={isSubmitting}
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                          color="secondary"
                        >
                          Create login
                        </Button>
                      </AnimateButton>
                    </Box>
                  </form>
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
