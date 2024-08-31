import React, { useState } from 'react';
import { Popconfirm, Typography } from 'antd';
import { IconTrash } from '@tabler/icons';
import MainCard from 'ui-component/cards/MainCard';
import { Form, Input, InputNumber, Table, } from 'antd';
import Buttons from 'ui-component/Button/Button';
import ApiQrcode from '../../Services/Qrcode';
// import { useNavigate } from 'react-router';
import Search from 'ui-component/SearchFilter/Search';
import { toast, ToastClassName, ToastContainer } from 'react-toastify'
import { useEffect } from 'react';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import Loader from 'ui-component/Loader/Loader';


const EditableCell = ({ editing, dataIndex, title, inputType, children, ...restProps }) => {
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

const DeleteQrCode = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState('');
  // console.log('data', data);
  const [editingKey, setEditingKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteQrcode, setDeleteQrcode] = useState('')
  const [selectedQrcode, setSelectedQrcode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [qrcodeDetails, setQrcodeDetails] = useState([])
  const [qrAllDetails, setQrAllDetails] = useState('')
  const [selectedOption, setSelectedOption] = useState(null);
  const [titleId, settitleId] = useState('')
  const [deletedQrcode, setDeletedQrcode] = useState('')
  const [qrcodeId, setQrcodeId] = useState('')
const [loader,setLoader] = useState(false)

  useEffect(() => {
    const qrcodeids = qrAllDetails._id
    setQrcodeId(qrcodeids)
  }, [qrAllDetails])


  useEffect(() => {
    getQrcodes();
  }, [deleteQrcode, deletedQrcode]);


  useEffect(() => {
    if (qrcodeDetails) {
      console.log('qrcodeDetails', qrcodeDetails);
    }
  }, [qrcodeDetails]);

  const handleClose = () => setShow(false);
  const handleShow = (QrcodeDetails) => {
    setQrcodeDetails(QrcodeDetails.titles, () => {
      console.log('qrcodeDetails', qrcodeDetails);
    });
    setQrAllDetails(QrcodeDetails, () => {
    });

    setShow(true);
  };


  const handleOptionChange = (selectedOption) => {
    setSelectedOption(selectedOption);

    const selectedQrTitle = selectedOption && selectedOption.label;
    const selectedQrCode = qrcodeDetails.find(detail => detail.title === selectedQrTitle);

    if (selectedQrCode) {
      const selectedQrCodeId = selectedQrCode._id;
      settitleId(selectedQrCodeId)
    }
  };

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      getQrcodes();
    } else {
      const filteredItems = data.filter((userdata) => userdata.qrTitle.toLowerCase().includes(searchTerm.toLowerCase()));
      setData(filteredItems);
    }
  };



  const getQrcodes = async () => {
    setLoader(true)
    try {
      const allQrcode = await ApiQrcode.GetQrcodes();
      const Qrcodes = allQrcode.data.data;
      const sortedData = Qrcodes.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  
      setData(sortedData);
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoader(false)
    }
   
  };

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


  const handleDeleteQrcode = async (qrcodeId) => {
    setLoader(true)
    try {
      const deletedQrcode = await ApiQrcode.DeletedQrcode(qrcodeId)
    setShow(false)
    toast.success("QR code Deleted successfully")
    setDeleteQrcode(deletedQrcode)
    window.location.reload();
    } catch (error) {
      console.log(error);
    }
finally{
  setLoader(false)
}
    


  };

  const deleteQrTitle = async () => {
    setLoader(true)
    try {
      const res = await ApiQrcode.detleteQrTitle({ qrId: qrAllDetails._id, titleId: titleId })
      setShow(false)
      setDeletedQrcode(res.data.data)
      toast.success('QR Code deleted Sucessfully ')

    } catch (error) {
      toast.error(error)
    }
    finally{
      setLoader(false)
    }
  }

  const columns = [
    {
      title: 'SNo',
      dataIndex: 'sNo',
      width: '5%',
      editable: true,
      render: (_, __, index) => index + 1
    },
    {
      title: 'QR Title',
      dataIndex: 'qrTitle',
      width: '15%',
      editable: true,
      fixed: 'left',
    },
    {
      title: 'ServiceName',
      dataIndex: 'serviceName',
      width: '12%',
      editable: true,
      render: (_, record) => `${record.serviceName}`
    },
    {
      title: 'CustomerName',
      dataIndex: 'customerName',
      width: '20%',
      editable: true
    },
    {
      title: "No.of QR Codes",
      dataIndex: '',
      width: '10%',
      render: (_, record) => record.titles.length

    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      width: '15%',
      editable: true,
      render: (text) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Qr code Format',
      dataIndex: 'format',
      width: '15%',
      editable: true
    },
    {
      title: 'Width',
      dataIndex: 'width',
      width: '15%',
      editable: true
    },
    {
      title: 'Height',
      dataIndex: 'height',
      width: '15%',
      editable: true
    },
    {
      title: 'Created Date',
      dataIndex: 'created_date',
      width: '15%',
      editable: true,
      render: (text) => moment(text).format('DD-MM-YYYY')
    },
    {
      title: 'Action',
      width: '10%',
      dataIndex: 'action',
      fixed: 'right',
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
            <span>
              <Typography.Link onClick={() => handleShow(record)}>
                <IconTrash />
              </Typography.Link>
            </span>
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

  const options = qrcodeDetails && qrcodeDetails.map((detail, index) => ({
    value: index + 1,
    label: detail.title // Assuming qrdetails is an array of strings
  }));

  return (

    <>
    
    {loader && (
      <Loader show={loader}/>
      
    )} 
    <MainCard title="Manage QR Code ">
      <div className="d-flex justify-content-end " style={{ position: 'relative', bottom: '10px' }}>
        {/* <Buttons>Download</Buttons> */}
        <Search
          onChange={handleInputChange}
          placeholder="Search QR title"
          value={searchTerm}
          style={{ width: '150px', marginLeft: '20px' }}
        />
      </div>
      <Form form={form} component={false}>
        <Table
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
          scroll={{
            x: 2000
          }}
        />
      </Form>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete QR code</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className='d-flex justify-content-center flex-column'>
            {qrAllDetails && <div>
              <h6>QR Title : {qrAllDetails.qrTitle} </h6>
              <h6>Service Name : {qrAllDetails.serviceName} </h6>
              <h6>Customer Name : {qrAllDetails.customerName} </h6>
            </div>}
            <p className='pt-3'> Do you want to delete QR codes? Select here and delete</p>
            <Select
              className='seletec-title'
              options={options}
              styles={{
                menu: (provided, state) => ({
                  ...provided,
                  position: 'relative', // Position relative to the modal
                  zIndex: '9999' // Ensure it appears on top of other elements
                })
              }}
              required
              isSearchable={true}
              placeholder="Select QR Details"
              onChange={handleOptionChange} />

          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleDeleteQrcode(qrcodeId)}>
            Delete All
          </Button>
          <Button variant="danger" onClick={deleteQrTitle} disabled={!selectedOption}>
            Delete selected QR
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </MainCard>

</>

  );
};

export default DeleteQrCode;

