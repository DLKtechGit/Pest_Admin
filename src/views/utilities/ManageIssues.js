import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
// import Tables from 'ui-component/Tables/Tables';
import MainCard from 'ui-component/cards/MainCard';
import { Form, Input,Table } from 'antd';
import Search from 'ui-component/SearchFilter/Search';
import ApiAllIssues from '../../Services/Issues';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';

const CustomModal = ({ show, onHide, title, message }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const ManageIssues = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [issues, setIssues] = useState({});
    const tableRef = useRef(null);
    // console.log("issues", issues);
    useEffect(() => {
        getServiceData();
    }, []);

    // useEffect(() => {
    //     issues && issues?.map((data) => {
    //         console.log("data", data);
    //     })
    // }, [issues]);

    const handleInputChange = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        if (searchTerm === '') {
            getServiceData();
        } else {
            const filteredItems = data.filter((userdata) => userdata.serviceName.toLowerCase().includes(searchTerm.toLowerCase()));
            setData(filteredItems);
        }
    };

    console.log('data',data);

    const getServiceData = async () => {
        try {
            const serviceData = await ApiAllIssues.GetUserIssues();
            // console.log("serviceData", serviceData.data);
            const IssuesData = serviceData.data
            setIssues(IssuesData)
            const services = serviceData?.data?.map((service, index) => ({
                key: service._id,
                serviceName: service.issueDetails.description,
                technicianId: service.technicianId,
                priority: service.issueDetails.priority,
                technicianName: `${service.technicianDetails.firstName} ${service.technicianDetails.lastName}`,
                created_date: service.createdAt,
                serviceId: (index + 1).toString().padStart(3, '0'),
            }));
            const sortedData = services.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
            setData(sortedData);
        } catch (error) {
            console.error('Error fetching service data:', error);
            toast.error('Failed to fetch service data');
        }
    };

    const handleAlert = async (technicianId, issueId, priority) => {
        try {
            const response = await ApiAllIssues.UpdatePriority({
                technicianId: technicianId,
                issueId: issueId,
                priority: "Resolved"
            });
            const title = priority === 'Open' ? 'Open Issue' : 'Resolved Issue';
            const message = priority === 'Open' ? 'Do you want to mark this Issue as resolved?' : 'This issue has been resolved.';
            setModalContent({ title, message });
            setShowModal(true);
            getServiceData()
        } catch (error) {
            console.error("Error updating issue priority:", error);
            // Handle error here
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };


    const columns = [
        {
            title: 'S.No',
            dataIndex: 'serviceId',
            width: '2%',
            render: (_, __, index) => index + 1
        },
        {
            title: 'CreatedDate',
            dataIndex: 'created_date',
            width: '10%',
            render: (text) => moment(text).format('DD-MM-YYYY')
        },
        {
            title: 'Technician Name',
            dataIndex: 'technicianName',
            width: '8%',
        },
        {
            title: 'Issues',
            dataIndex: 'serviceName',
            width: '10%',
            onCell: () => ({ style: { whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis' } })
        },
        {
            title: 'Action',
            width: '8%',
            fixed: 'right',
            render: (_, record) => (
                <div className="d-flex justify-content-center">
                    <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleAlert(record.technicianId, record.key, record.priority)}
                    >
                        <button style={{fontSize:"14px"}} className={`btn ${record.priority === 'Open' ? 'btn-warning' : 'btn-success'}`}>
                            {record.priority === 'Open' ? 'Open' : 'Resolved'}
                        </button>
                    </span>
                </div>
            )
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
            })
        };
    });

    return (
        <>
            <MainCard title="Manage Issues List">
                <div className="d-flex justify-content-end" style={{ marginBottom: '10px' }}>
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
                            bordered
                            dataSource={data}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            pagination={false}
                            scroll={{
                                x: 1000
                              }}
                        />
                    </div>
                </Form>
            </MainCard>
            {/* <CustomModal
                show={showModal}
                onHide={handleCloseModal}
                title={modalContent.title}
                message={modalContent.message}
            /> */}
            <ToastContainer />
        </>
    );
};

// i want to add over flow on  the colum how can i add that 

export default ManageIssues;