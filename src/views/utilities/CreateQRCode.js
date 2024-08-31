
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import FileSaver from 'file-saver';
import { DatePicker } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import ApiAllCompanies from '../../Services/CustomerServices';
import ApiQrcode from '../../Services/Qrcode';
import { toast, ToastContainer } from 'react-toastify';
import Select from "react-select";
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import ApiAllServices from '../../Services/Categoryservices';
import moment from 'moment';
import dayjs from 'dayjs';

function App() {
  const [qrTitle, setQrTitle] = useState('');
  const [width, setWidth] = useState(150);
  const [height, setHeight] = useState(1);
  const [format, setFormat] = useState('png');
  const [startDate, setStartDate] = useState(dayjs());
  const [customerName, setCompany] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [qrDetails, setQrDetails] = useState([]);
  const [Allcompany, setAllCompany] = useState([]);
  const [numQRCodes, setNumQRCodes] = useState(0);
  const [qrImage, setImageUrl] = useState('');
  const [titles, setTitle] = useState([])
  const [customerId, setCustomerId] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [category, setCategory] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')

  useEffect(() => {
    getAllCompanies();
    getCategoryData();
  }, []);

  useEffect(() => {
    if (titles.length > 0) {
      CreateQrcodes();
      console.log(titles);
    }

  }, [titles])

  const getAllCompanies = async () => {
    try {
      const response = await ApiAllCompanies.getCompany();
      const registeredCompanies = response.data.Results;
      setAllCompany(registeredCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };
  const getCategoryData = async () => {
    try {
      const serviceData = await ApiAllServices.GetCateogry();
      const mainCategories = serviceData?.data?.Results.filter(service => service.categoryType === 'main');
      // console.log("mainCategorserviceDataies",serviceData.data.Results);

      const services = mainCategories.map((service, index) => ({
        ...service,
        key: service._id,
      }));
      setCategory(services);
    } catch (error) {
      console.error('Error fetching service data:', error);
      toast.error('Failed to fetch service data');
    }
  };
  const handlecompanyChange = (selectedOption) => {
    if (selectedOption) {
      setCompany(selectedOption.label);
      const customer = Allcompany.find(company => company.name === selectedOption.label);
      if (customer) {
        setCustomerId(customer._id);
      }
    } else {
      setCompany('');
      setCustomerId('');
    }
    // Update the customerName state
    setSelectedCustomer(selectedOption);
  };



  const handleCategoryChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    if (selectedOption) {
      setServiceName(selectedOption.label);
      if (selectedOption.label === 'General Pest Control') {
        setNumQRCodes(1);
      } else {
        setNumQRCodes(0);
      }
    }
  };

    const handleNumQRCodesChange = (e) => {

    setNumQRCodes(e.target.value)
  
  };


  const createObjectURL = (blob) => {
    return window.URL.createObjectURL(blob);
  };

  const generateQRCode = (index) => {
    const combinedData = `QR Title: ${qrTitle}${index}\nService Name: ${serviceName}\nCustomer Name: ${customerName}`;

    if (format !== 'svg' && combinedData.trim() !== '') {
      return <QRCode value={combinedData} size={width} level="H" />;
    } else if (format === 'svg' && combinedData.trim() !== '') {
      return <QRCode value={combinedData} size={width} level="H" renderAs={'svg'} />;
    } else {
      return <div></div>;
    }
  };


  const handleDownload = async () => {
    if(!startDate || !customerName || !qrTitle || !category || numQRCodes == 0)
    {
      toast.error("All fields are required");
    }
    else
    {
      let qrCodeTitles = [];
      for (let i = 1; i <= numQRCodes; i++) {
        const qrCodeTitle = `${qrTitle}${i}`;
        const data = {}
        data.title = qrCodeTitle
        qrCodeTitles.push(data)
      }
      setTitle(prevState => [...prevState, ...qrCodeTitles]);
    }
  };


  const CreateQrcodes = async () => {
    try {
      const res = await ApiQrcode.CreateQrcode({
        qrTitle,
        titles,
        width,
        format,
        height,
        customerId,
        startDate,
        customerName,
        serviceName,
        numQRCodes
      });
  
      if (res.status === 400 || res.status === 409) {
        toast.error("Qrcode already exists or fill all required fields.");
        resetFields();
      } else {
        let qrCodeTitles = [];
        for (let i = 1; i <= numQRCodes; i++) {
          const qrCodeTitle = `${qrTitle}${i}`;
          qrCodeTitles.push({ title: qrCodeTitle });
  
          // Adding a slight delay to avoid concurrency issues
          await new Promise(resolve => setTimeout(resolve, 100)); 
  
          if (format !== 'svg') {
            const canvas = document.getElementById('qrcode_' + i)?.querySelector('canvas');
            if (canvas) {
              canvas.toBlob(async (blob) => {
                if (blob) {
                  FileSaver.saveAs(blob, `${qrCodeTitle}.${format}`);
                  console.log(`Downloaded ${qrCodeTitle}.${format}`);
                }
              });
            }
          } else {
            const svgElement = document.querySelector(`#qrcode_${i} .qrcode svg`);
            if (svgElement) {
              const svgString = svgElement.outerHTML;
              const blob = new Blob([svgString], { type: 'image/svg+xml' });
              FileSaver.saveAs(blob, `${qrCodeTitle}.svg`);
              console.log(`Downloaded ${qrCodeTitle}.svg`);
            }
          }
        }
        toast.success('QR codes created and downloaded successfully.');
        resetFields();
      }
    } catch (error) {
      console.error('Error creating QR codes:', error.message);
      toast.error('Failed to create QR codes. Please try again later.');
    }
  };


  const resetFields = () => {
    setQrTitle('');
    setCompany('');
    setCategory('');
    setStartDate(dayjs());
    setWidth(150);
    setHeight(1);
    setSelectedCustomer('');
    setNumQRCodes('');
    setServiceName('');
    setSelectedOption('');
    getCategoryData();
    setTitle([]);
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };

  return (
    <MainCard title="Create QR Code">
      <div className="container mt-2">
        <div className="row">
          <div className="col-12">
            <div className="col-12 d-flex flex-row ">
              <div className="col-6 mb-3 p-2">
                <label htmlFor="qrTitle" className="form-label">
                  QR Title:
                </label>
                <input type="text" id="qrTitle" className="form-control" value={qrTitle} onChange={(e) => setQrTitle(e.target.value)} />
              </div>
              <div className="col-6 mb-3 p-2">
                <label htmlFor="customerName" className="form-label">
                  Customer Name:
                </label>
                <Select
                  options={Allcompany && Allcompany.map(company =>
                    ({ value: company.name, label: company.name }))}
                  onChange={handlecompanyChange}
                  value={selectedCustomer}
                  isSearchable={true}
                />

              </div>
            </div>
            <div className="col-12 d-flex flex-row mb-3">
              <div className="col-6 p-2 d-flex flex-column justify-content-start">
                <label htmlFor="data" className="form-label">
                  Select Category
                </label>
                <Select
                  options={category && category.map(category => ({ value: category.key, label: category.category, _id: category._id }))}
                  onChange={handleCategoryChange}
                  value={selectedOption}
                  isSearchable={true}
                />
              </div>
              <div className="col-6 p-2">
                <label htmlFor="startDate" className="form-label">
                  Select Date:
                </label>
                <DatePicker
                  className="form-control"
                  id="startDate"
                  value={startDate}
                  disabledDate={disabledDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
            </div>
            <div className="col-12 d-flex flex-row mb-3">
              <div className='col-6 p-2'>
                <label htmlFor="width" className="form-label">
                  Width:
                </label>
                <input type="text" className="form-control"
                  value={width} onChange={(e) => setWidth(e.target.value)}
                  placeholder='Ex: 300'
                />
              </div>
              <div className="col-6 p-2">
                <label htmlFor="height" className="form-label">
                  Height:
                </label>
                <input type="text" disabled className="form-control"
                  placeholder='Ex: 300'
                  value={height} onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 d-flex flex-row mb-3">
              <div className='col-6 p-2'>
                <label htmlFor="format" className="form-label">
                  Format:
                </label>
                <select className="form-select" value={format} onChange={(e) => setFormat(e.target.value)} id="format">
                  <option value="png">.png</option>
                  <option value="svg">.svg</option>
                  <option value="jpg">.jpg</option>
                </select>
              </div>
              <div className="col-6 p-2">
                <label htmlFor="numQRCodes" className="form-label">
                  Number of QR Codes:
                </label>
                <input type="number" className="form-control" id="numQRCodes" min={0} value={numQRCodes} onChange={handleNumQRCodesChange} disabled={serviceName === 'General Pest Control'} />
              </div>
            </div>
            <div className='col-12 d-flex justify-content-center'>
              <div className='col-4'>
                <button className=" btn tech-btn w-100" onClick={handleDownload}>
                  Submit & Download QR Codes
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className='d-flex flex-row justify-content-evenly mt-5'>
          <Container>
            <Row xs={4} md={4} lg={6} className='gap-4 d-flex justify-content-center'>
              {Array.from({ length: numQRCodes }, (_, i) => i + 1).map((index) => (
                <div className="col-12 card p-2">
                  <div id={`${'qrcode_'}${index}`} className="qrcode">{generateQRCode(index)}</div>
                  <hr />
                  <div className="card-body d-flex justify-content-center p-0 mb-2">
                    <p className="card-text" style={{ fontWeight: "600" }}>{qrTitle}{index}</p>
                  </div>
                </div>
              ))}
            </Row>
          </Container>
        </div>
      </div>
      <ToastContainer />
    </MainCard >
  );
}

export default App;













