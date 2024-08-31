import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import ApiService from '../../../Services/ChemicalsService';
import Loader from 'ui-component/Loader/Loader';

const CreateChemicals = () => {
  const [chemicalsName, setChemicalName] = useState('');
  const [error, setError] = useState('');
  const [loader,setLoader] = useState(false)

  const handleServiceChange = (e) => {
    setChemicalName(e.target.value);
  };

  const handleClick = async () => {
    setLoader(true)
    try {
      if (!chemicalsName) {
        setError('Chemical Name is required');
        return;
      }
      const response = await ApiService.createChemicals({chemicalsName:chemicalsName});
      if (response && response.status === 200) {
        // console.log("response", response);
        toast.success("New Chemicals created Successfully");
        setChemicalName('');
      } else {
        toast.error('Chemical already exist.');
      }
    } catch (error) {
      setError('Chemical Name Creation Failed');
      console.error('Error creating Chemical Name:', error);
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
          <label htmlFor="chemicalsName" className="mt-3">
            Chemical Name
          </label>
          <input
            name="chemicalsName"
            type="text"
            value={chemicalsName}
            onChange={handleServiceChange}
            className="form-control mt-3"
            placeholder="Enter a Chemical"
          />
          {error && <div className="text-danger mt-2">{error}</div>}
        </div>      
      </div>
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

export default CreateChemicals;
