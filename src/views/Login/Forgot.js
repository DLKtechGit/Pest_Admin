import React, { useState } from "react";
import "../../views/Login/Login.css";
import { UserOutlined } from '@ant-design/icons';
import { Button,Form, Input } from 'antd';
import pestlogo from '../../assets/images/pestlogo.png';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Apiservice from '../../Services/AdminLogin';
import Loader from "ui-component/Loader/Loader";

const Login = () => {

    const [email, setEmail] = useState('');
    const [loader,setLoader] = useState(false)
   
    const navigate = useNavigate();

    const onFinish = async () => {
        setLoader(true)
        try {
            let res = await Apiservice.ForgotPassword({
                email: email,
                
            });
            if(res.status === 200){
                toast('Reset password link succesfully sent to your email')
            }
           else{
            if(res.status===400){
                toast.error('Email is not exist')
            }
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
                                        <Input prefix={<UserOutlined className="site-form-item-icon" />} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
                                    </Form.Item>
                                   

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className="col-12 login-form-button">
                                           Get reset link
                                        </Button>
                                    </Form.Item>
                                    <Form.Item>
                                        <div className="login-form-forgot" >
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
