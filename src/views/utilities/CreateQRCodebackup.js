import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import FileSaver from 'file-saver';
import { DatePicker } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
// import ApiAllServices from '../../Services/AllServices';
import ApiAllCompanies from '../../Services/CustomerServices';
import ApiQrcode from '../../Services/Qrcode';
import { toast, ToastContainer } from 'react-toastify';
function App() {
  const [qrTitle, setQrTitle] = useState('');
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [format, setFormat] = useState('png');
  const [startDate, setStartDate] = useState(null);
  const [qrDetails, setQrDetails] = useState([]);
  const [Allcompany, setAllCompany] = useState([]);
  const [customerName, setCompany] = useState('');
  const [serviceName, setServiceName] = useState("-");

  const [qrImage, setImageUrl] = useState('');

  useEffect(() => {
    getAllCompanies();
    // getAllServices();
  }, []);

  const CreateQrcodes = async () => {
    try {
      if (!qrTitle || !width || !format || !height || !startDate || !customerName || !serviceName) {
        toast.error('Missing some required data.');
      } else {
        await ApiQrcode.CreateQrcode({
          qrTitle,
          width,
          format,
          height,
          startDate,
          customerName,
          serviceName,
          qrImage
        });
        toast.success('QR code created successfully.');
      }
    } catch (error) {
      console.error('Error creating QR code:', error.message);
      toast.error('Failed to create QR code. Please try again later.');
    }
  };

  const generateQRCode = () => {
    const combinedData = `QR Title: ${qrTitle}\nCustomer Name: ${customerName}\nDate: ${startDate ? startDate.format('YYYY-MM-DD') : ''
      }`;

    if (format !== 'svg' && combinedData.trim() !== '') {
      return <QRCode value={combinedData} size={width} level="H" />;
    } else if (format === 'svg' && combinedData.trim() !== '') {
      return <QRCode value={combinedData} size={width} level="H" renderAs={'svg'} />;
    } else {
      return <div></div>;
    }
  };
  const createObjectURL = (blob) => {
    return window.URL.createObjectURL(blob);
  };

  const handleDownload = () => {
    const combinedData = `QR Title ${qrTitle}\nCustomer Name: ${customerName} Service Name: ${serviceName}\nDate: ${startDate ? startDate.format('YYYY-MM-DD') : ''
      }`;

    if (format !== 'svg' && combinedData.trim() !== '') {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            FileSaver.saveAs(blob, `qrcode.${format}`);
            setQrDetails([...qrDetails, { serviceTitle: qrDetails, date: startDate.format('YYYY-MM-DD') }]);
            // Convert blob object to URL string
            const imageUrl = createObjectURL(blob);
            // Store URL string in state
            setImageUrl(imageUrl);
            // Store URL string in database or perform any other necessary operation
            // Example: saveImageUrlToDatabase(imageUrl);
            CreateQrcodes();
          }
        });
      }
    } else {
      const svgString = document.querySelector('.qrcode svg').outerHTML;
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      FileSaver.saveAs(blob, 'qrcode.svg');
      const imageUrl = createObjectURL(blob);
      setImageUrl(imageUrl);
    }
  };


  const handlecompanyChange = (e) => {
    // console.log("e--------------->", e.target.value);
    setCompany(e.target.value);
  };

  const getAllCompanies = async () => {
    try {
      const response = await ApiAllCompanies.getCompany();
      setAllCompany(response.data.Results);
    } catch (error) {
      console.error('Error fetching companies:', error);
      // Add error handling logic here
    }
  };

  const handleToggleChange = (e) => {
    const toggleValue = e.target.checked ? 'Rodent Pro' : '-';
    // console.log("Toggle Value:", toggleValue);
    setServiceName(toggleValue);
  };

  // console.log("showSignaturePad", showSignaturePad)


  return (
    <MainCard title="Create QR code ">
      <div className="container mt-2">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="mb-4">
              <label htmlFor="data" className="form-label">
                QR Title :
              </label>
              <input type="text" className="form-control" value={qrTitle} onChange={(e) => setQrTitle(e.target.value)} />
            </div>

            <div className=" mb-4 ">
              <label htmlFor="data" className="form-label">
                Customer Name :
              </label>
              <select
                onChange={handlecompanyChange}
                value={customerName}
                className="form-select col-12 "
                aria-label="Default select example"
              >
                <option>Select Customer</option>
                {Allcompany && Allcompany.map((item, index) => {
                  console.log("itemdata", item);
                  return (
                    <option key={index} value={`${item._id}`}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-start">
                <label htmlFor="data" className="form-label">
                  Create Rodent Pro QR Code
                </label>
                <input
                  type="checkbox"
                  id="toggle"
                  value="Rodent"
                  onChange={handleToggleChange}
                />
                <label className="label" htmlFor="toggle"> </label>
              </div>
              {/* <label htmlFor="data" className="form-label">
                Service Name :
              </label>
              <select onChange={handleservicechange} value={serviceName} className="form-select" aria-label="Default select example">
                <option>Select Service</option>
                {Allservices &&
                  Allservices.map((item, index) => (
                    <option key={index} value={item.serviceName}>
                      {item.serviceName}
                    </option>
                  ))}
              </select> */}
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="form-label">
                Select Date:
              </label>
              <DatePicker className="form-control" value={startDate} onChange={(date) => setStartDate(date)} />
            </div>
            {/* <div className="mb-4">
              <label htmlFor="time" className="form-label">
                Select Time:
              </label>
              <TimePicker className="form-control" value={time} onChange={(value) => setTime(value)} />
            </div> */}
            <div className="mb-4">
              <label htmlFor="width" className="form-label">
                Width:
              </label>
              <input type="text" className="form-control" value={width} onChange={(e) => setWidth(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="height" className="form-label">
                Height:
              </label>
              <input type="text" className="form-control" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="format" className="form-label">
                Format:
              </label>
              <select className="form-select" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="png">.png</option>
                <option value="svg">.svg</option>
                <option value="jpg">.jpg</option>
              </select>
            </div>
            <button className=" btn tech-btn w-100" onClick={handleDownload}>
              Submit & Download QR Code
            </button>
          </div>
          <div className="col-12 col-md-6">
            <div className="qrcode">{generateQRCode()}</div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </MainCard>
  );
}

export default App;
