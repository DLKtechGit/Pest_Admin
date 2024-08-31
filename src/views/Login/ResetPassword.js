import React, { useState } from 'react';
import '../../views/Login/Login.css';
import { LockOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import pestlogo from '../../assets/images/pestlogo.png';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
// import Apiservice from '../../Services/AdminLogin';
import Https from 'Services/Https';
import Loader from 'ui-component/Loader/Loader';

const Login = () => {
  let navigate = useNavigate();
  const { randomString, expirationTimestmpa } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loader,setLoader] = useState(false)

  const onFinish = async () => {
    setLoader(true)
    try {
      let res = await Https.Post(`adminauth/reset/password/${randomString}/${expirationTimestmpa}`, {
        newPassword,
        confirmPassword
      });
      if (res.status === 401) {
        toast.error('password and Confirm Password dosn`t match')
      } else if (res.status === 200) {
        toast.success('Password Reset Successfully');
      } else {
        toast.error('Somthing went wrong');
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while logging in.');
    }
    finally{
      setLoader(false)
    }
  };

  return (
    <>
    
    {loader && (
      <Loader show={loader}/>
      
    )} 
    <section className="login-block">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="auth-box">
              <div className="card-block login-form-box checkout-page-style">
                <div className="col-12 d-flex justify-content-center ">
                  <img src={pestlogo} alt="logo" className="img-fluid LoginLogo mb-5" />
                </div>
                <Form
                  name="normal_login"
                  className="col-12 login-form"
                  initialValues={{
                    remember: true
                  }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="Newpassword"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Password!'
                      }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    name="Confirmpassword"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Password!'
                      }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="col-12 login-form-button">
                      Reset Password
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <div className="login-form-forgot">
                      Remember your password ? <a> Ligin</a>
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
    </>
  );
};

export default Login;
