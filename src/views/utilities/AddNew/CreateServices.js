import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import ApiService from '../../../Services/AllServices';
import ApiServiceCategory from '../../../Services/Categoryservices';
import Select from "react-select";
import Loader from 'ui-component/Loader/Loader';

const CreateServices = () => {
  const [serviceName, setServiceNames] = useState([]);
  const [serviceImage, setServiceImage] = useState(null);
  const [error, setError] = useState('');
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [maincategory, setMaincategory] = useState('');
  const [loader,setLoader] = useState(false)

  useEffect(() => {
    handleGetcategory();
  }, []);

  const handleServiceImageChange = (e) => {
    setServiceImage(e.target.files[0]);
  };

  const handleGetcategory = async () => {
    setLoader(true)
    try {
      const res = await ApiServiceCategory.GetCateogry();
      const results = res.data.Results;
      console.log("result",results);
      const main = results.filter(data => data.categoryType === 'main'&& data.category ==="General Pest Control" );
      const sub = results.filter(data => data.categoryType === 'sub');
      setMainCategories(main);
      setSubCategories(sub);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    finally{
      setLoader(false)
    }
  };

  const handleMainCategoryChange = (selectedOption) => {
    setMaincategory(selectedOption.label)
  };

  const handleSubCategoryChange = (selectedOptions) => {
    const names = selectedOptions.map(option => option.label);
    setServiceNames(names);
  };

  const handleClick = async () => {
    setLoader(true)
    try {
      if (!maincategory) {
        setError('Service, Image, and Main Category are required');
        return;
      }

      const formData = new FormData();
      formData.append('serviceName', serviceName.join(',')); 
      // formData.append('serviceImage', serviceImage);
      formData.append('mainCategory', maincategory);

      const response = await ApiService.createServices(formData);
      if (response && response.status === 200) {
        // console.log("response", response);
        toast.success(response.data.message);
        setServiceImage(null);
        setMaincategory('');
        setServiceNames([]);
      } else if(response.status === 404) {
        toast.error('Service already exist.');
      }
      else if(response.status === 400) {
        toast.error('Please select service.');
      }
    } catch (error) {
      setError('Service Creation Failed');
      console.error('Error creating service:', error);
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
    <div className="Signin">
      <div className="d-flex flex-row">
        <div className="col-6 p-2">
          <label htmlFor="mainCategory" className="mt-3">
            Main Category
          </label>
          <Select
            className="mt-3"
            options={mainCategories.map(category => ({ value: category._id, label: category.category }))}
            onChange={handleMainCategoryChange}
          />
          {error && <div className="text-danger mt-2">{error}</div>}
        </div>
        <div className="col-6 p-2">
          <label htmlFor="subCategory" className="mt-3">
            Sub Category
          </label>
          <Select
            className="mt-3"
            options={subCategories.map(category => ({ value: category._id, label: category.category }))}
            onChange={handleSubCategoryChange}
            isMulti
          />
          {error && <div className="text-danger mt-2">{error}</div>}
        </div>
      </div>
      {/* <div className="col-6 p-2">
        <label htmlFor="serviceImage" className="mt-3">
          Service Image
        </label>
        <input
          type="file"
          id="serviceImage"
          onChange={handleServiceImageChange}
          className="form-control mt-3"
        />
        {error && <div className="text-danger mt-2">{error}</div>}
      </div> */}
      <div className="col-4 mt-4">
        <button type="button" onClick={handleClick} className="btn tech-btn">
          Create
        </button>
      </div>
      <ToastContainer />
    </div>
    </>
  );
};

export default CreateServices;
