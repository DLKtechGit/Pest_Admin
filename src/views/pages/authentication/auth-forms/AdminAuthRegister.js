import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
  IconButton
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import adminApi from "../../../../Services/AdminLogin"
import Loader from "ui-component/Loader/Loader";

const AdminAuthRegister = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  console.log("userData", userData);

  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
    setLoader(true);
    try {
      // Make API call
      const response = await adminApi.AdminLogin(values);
      console.log("response", response.data.message);
      // Check if request was successful
      if (response && response.status === 200) {
        // Reset form
        resetForm();

        // Handle success
        setStatus({ success: true });
        setSubmitting(false);

        // Show success toast message
        toast.success(response?.data?.message);
      } else {
        // Handle error
        const errorMessage = response?.data?.message;
        setStatus({ success: false });
        setErrors({ submit: errorMessage });
        setSubmitting(false);

        // Show error toast message
        toast.error(errorMessage);
      }
    } catch (err) {
      // Handle network error or other unexpected errors
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit: err });
      setSubmitting(false);

      // Show error toast message
      toast.error(err);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      {loader && <Loader show={loader} />}
      <div style={{height:'400px'}}>
    
      <Formik 
      
        initialValues={{
          email: '',
          password: '',
          role: 'childadmin', 
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
          role: Yup.string().required('Role is required')
        })}
        onSubmit={onSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form className="mt-5"  noValidate onSubmit={handleSubmit}>
            {userData.role === "superadmin" ? ( // Check if user role is superAdmin
              <>
                <FormControl className="mt-4" fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-email-register"
                    type="email"
                    value={values.email}
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
                    onChange={handleChange}
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
                    className='selectrole'
                  >
                    <MenuItem value="childadmin">Child Admin</MenuItem>
                  </Select>
                  {touched.role && errors.role && (
                    <FormHelperText error id="standard-weight-helper-text--register">
                      {errors.role}
                    </FormHelperText>
                  )}
                </FormControl> */}

                <Box sx={{ mt: 2 }}>
                  <Button className='tech-btn' disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                    Create login
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="body1" color="textSecondary">
                This feature is only available for superAdmin.
              </Typography>
            )}
          </form>
        )}
      </Formik>
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminAuthRegister;


// this is my code i need some changes i want to defaultly select the role on child admin on the select option dont want to select from thje option defaulty on the childadmin please give me code for that  