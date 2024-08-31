import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import ApiService from '../../../Services/Categoryservices';
import Select from "react-select";
import Loader from 'ui-component/Loader/Loader';

const CreateCategory = () => {
    const [category, setCategory] = useState('');
    const [serviceImage, setServiceImage] = useState(null);
    const [categoryType, setCategoryType] = useState( { value: 'sub', label: 'Sub Category' });
    const [error, setError] = useState('');
    const [loader,setLoader] = useState(false)

    const handleServiceChange = (e) => {
        setCategory(e.target.value);
    };

    const handleCategoryTypeChange = (selectedOption) => {
        setCategoryType(selectedOption);
    };

    const handleClick = async () => {
        setLoader(true)
        try {
            if (!category.trim()) {
                setError('category Name are required');
                return;
            }

            const response = await ApiService.createCateogry({category,categoryType:categoryType.value});
            if (response && response.status === 200) {
                // console.log("response", response);
                toast.success("category Created Successfully")
                setCategory('');
                window.location.reload();
            } else {
                toast.error('Failed to create category. Please try again.');
            }
        } catch (error) {
            setError('category Creation Failed');
            console.error('Error creating category:', error);
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
                {/* <div className="col-6 p-2">
                    <label htmlFor="categoryType" className="mt-3">
                        Sub Category
                    </label>
                    <Select
                        className="mt-3"
                        value={categoryType}
                        onChange={handleCategoryTypeChange}
                        options={[
                            { value: 'sub', label: 'Sub Category' }
                        ]}
                    />
                </div> */}
                <div className="col-6 p-2">
                    <label htmlFor="category" className="mt-3">
                       Sub Category
                    </label>
                    <input
                        name="category"
                        type="text"
                        value={category}
                        onChange={handleServiceChange}
                        className="form-control mt-3"
                        placeholder={`Enter a Sub Category`}
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
    )
}

export default CreateCategory;
