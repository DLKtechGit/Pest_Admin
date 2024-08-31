import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Modal } from 'antd';
import { Form, Input, InputNumber, Popconfirm, Typography, Button, Tooltip } from 'antd';
import Tables from 'ui-component/Tables/Tables';
import resetbtn from '../../assets/images/icons8-password-reset-48.png';
import ApiAuthCustomers from '../../Services/OrtherAuth';
// import ApiCustomers from '../../Services/';
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';
import Loader from 'ui-component/Loader/Loader';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  // record,
  // index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const ManageTechnici = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState('');
  const [editingKey, setEditingKey] = useState('');
  const [emailFetch, setEmailFetch] = useState('');
  const [reset, setReset] = useState('');
  const [loader,setLoader] = useState(false)

  const showModal = (email) => {
    console.log('email----------->', email);
    setEmailFetch(email);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  useEffect(() => {
    getTechnicianList();
  }, [reset]);

  const isEditing = (record) => record.key === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

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

  const getTechnicianList = async () => {
    setLoader(true)
    try {
      const getTechnician = await ApiAuthCustomers?.registeredTechnician();
    const technicianData = getTechnician?.data?.data;
    const sortedData = technicianData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

    setData(sortedData);
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoader(false)
    }
    
  };

  const onFinish = async (values) => {
    setLoader(true)
    try {
      const response = await ApiAuthCustomers.resetPwdTechnician({
        email: values?.email,
        password: values?.password,
        confirmpassword: values?.confirmpassword
      });
      // console.log("response------------>", response);
      setReset(response);
      toast.success('Password reset successful');
      handleOk();
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
    }
    finally{
      setLoader(false)
    }
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
      fixed: 'left',
      render: (_, record) => `${record.firstName} ${record.lastName}`
    },

    {
      title: 'Email',
      dataIndex: 'email',
      width: '20%',
      editable: true
    },

    {
      title: 'Password',
      dataIndex: 'password',
      width: '15%',
      editable: true // Not editable
    },
    {
      title: 'Role',
      dataIndex: 'role',
      width: '10%',
      editable: true // Not editable
    },

    {
      title: 'Created Date',
      dataIndex: 'created_date',
      width: '15%',
      render: (text) => moment(text).format('DD-MM-YYYY')
    },
    {
      title: 'Actions',
      width: '8%',
      dataIndex: 'actions',
      render: (_, record) => {
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
            <div style={{ cursor: 'pointer' }}>
              <Tooltip title="Click here for reset password">
                <Typography.Link onClick={() => showModal(record.email)}>
                  {' '}
                  <img style={{ width: '25px' }} src={resetbtn} alt="reser" />{' '}
                </Typography.Link>
              </Tooltip>
            </div>
          </div>
        );
      }
    }
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
  return (
    <>
    {loader && (
      <Loader show={loader}/>
      
    )} 
      <MainCard title="Manage Technician Login ">
        <Form
          form={form}
          onFinish={onFinish}
          //  initialValues={{ email: emailFetch }}
        >
          <Tables
            components={{
              body: {
                cell: EditableCell
              }
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel
            }}
          />
        </Form>
        <Modal visible={isModalOpen} onCancel={handleCancel} footer={null}>
          <h4 className="reset-title">Reset Password</h4>
          <Form form={form} onFinish={onFinish} initialValues={{ email: emailFetch }} className="formReset">
            <Form.Item
              name="email"
              placeholder={emailFetch}
              disabled
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email address!' }
              ]}
              className="forminput"
            >
              <Input placeholder="Email" disabled={true} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]} className="forminput">
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="confirmpassword"
              dependencies={['password']}
              className="forminput"
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('The two passwords do not match!');
                  }
                })
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <ToastContainer />
      </MainCard>
    </>
  );
};
export default ManageTechnici;
