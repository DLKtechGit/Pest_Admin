import React, { useState, useEffect, useRef } from 'react';
import { Table, Popconfirm, Form } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import Buttons from 'ui-component/Button/Button';
import Search from 'ui-component/SearchFilter/Search';
import ApiTechnician from '../../Services/TechniciansService';
import ApiTechnicianLogin from '../../Services/CustomerServices';
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

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
// import useScriptRef from 'hooks/useScriptRef';
// import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast, ToastContainer } from 'react-toastify';
import Loader from 'ui-component/Loader/Loader';

const TechnicianListTable = () => {
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
    getTechnicianList();
  }, []);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      getTechnicianList();
    } else {
      const filteredItems = data.filter((userdata) => userdata.firstName.toLowerCase().includes(searchTerm.toLowerCase()));
      setData(filteredItems);
    }
  };

  const isEditing = (record) => record.key === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const getTechnicianList = async () => {
    setLoader(true)
    try {
      const getTechnician = await ApiTechnician.technicianList();
    const TechnicianData = getTechnician?.data?.Results;
    const listTechnician = TechnicianData.filter((tech) => tech.deleted === false);
    const sortedData = listTechnician.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

    setData(sortedData);
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoader(false)
    }
    
  };

  const handleShow = async (_id, email, firstName, lastName) => {
    // console.log("id--------->",_id, email, name)
    const name = firstName + lastName;
    setNamefetch(name);
    setEmailfetch(email);
    setShow(true);
  };

  const onSubmit = async (_id, { setErrors, setStatus, setSubmitting, resetForm }) => {
    setLoader(true)
    try {
      const response = await ApiTechnicianLogin.RegisterCustomer(_id);
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
      }
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err });
      setSubmitting(false);
      toast.error(err);
    }
    finally{
      setLoader(false)
    }
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
      width: '3%',
      editable: true,
      render: (_, record, index) => index + 1
    },
    {
      title: 'FirstName',
      dataIndex: 'firstName',
      width: '8%',
      editable: true
      // fixed: 'left',
      // render: (_, record) => `${record.firstName} ${record.lastName}`
    },
    {
      title: 'LastName',
      dataIndex: 'lastName',
      width: '8%',
      editable: true
      // fixed: 'left',
      // render: (_, record) => `${record.firstName} ${record.lastName}`
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: '10%',
      editable: true,
      render: (_, record) => `${record.phoneNumber}`
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '10%',
      editable: true
    },
    // {
    //   title: 'Country',
    //   dataIndex: 'country',
    //   width: '15%',
    //   editable: true
    // },
    // {
    //   title: 'State',
    //   dataIndex: 'state',
    //   width: '15%',
    //   editable: true
    // },
    // {
    //   title: 'City',
    //   dataIndex: 'city',
    //   width: '15%',
    //   editable: true
    // },
    // {
    //   title: 'Address',
    //   dataIndex: 'address',
    //   width: '15%',
    //   editable: true
    // },
    {
      title: 'Created Date',
      dataIndex: 'created_date',
      width: '8%',
      render: (text) => moment(text).format('DD-MM-YYYY')
    },
    {
      title: 'Action',
      width: '5%',
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
              <Button
                type="primary"
                onClick={() => handleShow(record._id, record.email, record.firstName, record.lastName)}
                className="tech-btn"
              >
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
    const pdf = new jsPDF('p', 'mm', 'a4'); // Create PDF document
  
    const formattedData = data.map((item, index) => ({
      'S.No': index + 1,
      FirstName: item.firstName,
      LastName: item.lastName,
      Phone: item.phoneNumber,
      Email: item.email,
      'Created Date': moment(item.created_date).format('DD-MM-YYYY')
    }));
  
    const columns = [
      { header: 'S.No', dataKey: 'S.No' },
      { header: 'FirstName', dataKey: 'FirstName' },
      { header: 'LastName', dataKey: 'LastName' },
      { header: 'Phone', dataKey: 'Phone' },
      { header: 'Email', dataKey: 'Email' },
      { header: 'Created Date', dataKey: 'Created Date' }
    ];
  
    pdf.autoTable({
      head: [columns.map(col => col.header)],
      body: formattedData.map(item => columns.map(col => item[col.dataKey])),
      theme: 'striped',
      margin: { top: 10 },
      styles: {
        cellPadding: 2,
        fontSize: 10
      },
      columnStyles: {
        // Example: set column width if needed
        0: { cellWidth: 10 }, // S.No column
        1: { cellWidth: 30 }, // FirstName column
        // Add more as needed
      }
    });
  
    pdf.save('TechnicianData.pdf');
  };
  
  return (
    <>
     {loader && (
      <Loader show={loader}/>
      
    )} 
    
    <MainCard title="Technician List">
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
              x: 1500
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

                    {/* <FormControl fullWidth error={Boolean(touched.role && errors.role)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-role-register">Role</InputLabel>
              <Select
                id="outlined-adornment-role-register"
                value={values.role}
                name="role"
                onBlur={handleBlur}
                onChange={handleChange}
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="Technician">Technician</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
                
              </Select>
              {touched.role && errors.role && (
                <FormHelperText error id="standard-weight-helper-text--register">
                  {errors.role}
                </FormHelperText>
              )}
            </FormControl> */}

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

export default TechnicianListTable;
