import React, { useState } from "react";
import "../../views/Login/Login.css";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import pestlogo from '../../assets/images/pestlogo.png';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Apiservice from '../../Services/AdminLogin';
import { useDispatch } from "react-redux";
import { setUserData } from "../../Redux/Action";
import Loader from "ui-component/Loader/Loader";

const Login = () => {
  const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loader,setLoader] = useState(false)

    const onFinish = async () => {
        setLoader(true)
        try {
            let res = await Apiservice.AdminChildLogin({
                email: email,
                password: password,
            });
            console.log("res-------------------->", res);
            dispatch(setUserData(res?.data?.admin));
            if (res?.data?.admin?.role === "childadmin") {
                toast.success("Child Admin Login Successfully");
                const role = res?.data?.admin?.role
                navigate('/admindashboard', { state: { role: role } });                
            } else if (res?.data?.admin?.role === "superadmin") {
                toast.success("Super Admin Login Successfully");
                const role = res?.data?.admin?.role
                navigate('/admindashboard', { state: { role: role } });
            } else {
                toast.error("Invalid role detected.");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while logging in.");
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
                                <div className='col-12 d-flex justify-content-center '>
                                    <img src={pestlogo} alt="logo" className='img-fluid LoginLogo mb-5' />
                                </div>
                                <Form
                                    name="normal_login"
                                    className="col-12 login-form"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={onFinish}
                                >
                                    <Form.Item
                                        className='loginInput'
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Email!',
                                            },
                                        ]}
                                    >
                                        <Input prefix={<UserOutlined className="site-form-item-icon" />} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Password!',
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined className="site-form-item-icon" />}
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Form.Item name="remember" valuePropName="checked" noStyle>
                                            <Checkbox>Remember me</Checkbox>
                                        </Form.Item>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className="col-12 login-form-button">
                                            Log in
                                        </Button>
                                    </Form.Item>
                                    {/* <Form.Item>
                                        <div className="login-form-forgot" >
                                            Forgot password?
                                        </div>
                                    </Form.Item> */}
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
