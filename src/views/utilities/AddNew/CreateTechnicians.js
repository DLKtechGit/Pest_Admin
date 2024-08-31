import React from 'react';
import { Formik, Field, Form, ErrorMessage } from "formik";
// import { Country, State, City } from 'country-state-city';
// import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ApiTechnician from "../../../Services/TechniciansService";
import { toast } from 'react-toastify';
import Loader from 'ui-component/Loader/Loader';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const CreateTechnicians = () => {
    // const [selectedCountry, setSelectedCountry] = useState(null);
    // const [selectedState, setSelectedState] = useState(null);
    const[loader,setLoader] = useState(false)
    const navigate = useNavigate()

    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        // address: "",
        // country: "",
        // state: "",
        // city: "",
        phoneNumber: ""
    }

    const handleClick = async (values) => {
setLoader(true)
        await ApiTechnician.createTechnician(values).then((res) => {
            // console.log("res------------------------------", res.status);
            if (res.status === 201) {
                toast.success("Technician Created Successfully")
                setTimeout(() => {
                    navigate('/utils/util/technician/table')
                }, 1000);
            } else if (res.status === 409) {

                toast.error('Email already Exist');
              }
              else {
                toast.error('Please fill all required field')
              }
        });
        setLoader(false)
    }

    return (
        <>
        
        {loader && (
      <Loader show={loader}/>
      
    )} 
        <Formik
            initialValues={initialValues}
            // onSubmit={onSubmit}
            onSubmit={(values, actions) => {
                handleClick(values).then(() => {
                    // console.log("valuesawdadadwad", values);
                    actions.resetForm({
                        values: {
                            firstName: "",
                            lastName: "",
                            email: "",
                            // address: "",
                            // country: "",
                            // state: "",
                            // city: "",
                            phoneNumber: ""
                        },
                    });
                });
            }}
        >
            {({ values, setFieldValue }) => (
                <Form>
                    <div className="d-flex flex-row">
                        <div className="col-6 p-2">
                            <label htmlFor="firstName" className="mt-3">First Name</label>
                            <Field
                                name="firstName"
                                type="text"
                                className="form-control mt-3"
                                placeholder='Enter First Name'
                            />
                            <ErrorMessage name="firstName" component="div" className="text-danger mt-2" />
                        </div>
                        <div className="col-6 p-2">
                            <label htmlFor="lastName" className="mt-3">Last Name</label>
                            <Field
                                name="lastName"
                                type="text"
                                className="form-control mt-3"
                                placeholder='Enter Last Name'
                            />
                            <ErrorMessage name="lastName" component="div" className="text-danger mt-2" />
                        </div>
                    </div>

                    <div className="d-flex flex-row">
                        <div className="col-6 p-2">
                            <label htmlFor="Email" className="mt-3">Email Address</label>
                            <Field
                                name="email"
                                type="email"
                                className="form-control mt-3"
                                placeholder='Enter Email Address'
                            />
                            <ErrorMessage name="email" component="div" className="text-danger mt-2" />
                        </div>
                        <div className="col-6 p-2">
                            <label htmlFor="phoneNumber" className="mt-3 mb-3">Phone Number</label>
                            <PhoneInput
                                prefix="+"
                                countryCodeEditable={false}
                                country={'bh'} // Use 'defaultCountry' instead of 'country'
                                value={values.phoneNumber}
                                onChange={(phone) => {
                                    if (!phone.startsWith('+')) {
                                        phone = '+' + phone;
                                    }
                                    setFieldValue('phoneNumber', phone);
                                }}
                                placeholder='Enter a Phone Number'
                            />
                            {/* <PhoneInput
                                country={'bh'}
                                value={values.phoneNumber}
                                onChange={(phone) => setFieldValue("phoneNumber", phone)}
                            /> */}
                        </div>
                        {/* <div className="col-6 p-2">
                            <label htmlFor="address" className="mt-3">Address</label>
                            <Field
                                name="address"
                                type="text"
                                className="form-control mt-3"
                                placeholder='Enter Technician Address'
                            />
                            <ErrorMessage name="address" component="div" className="text-danger mt-2" />
                        </div> */}
                    </div>


                    {/* <div className="d-flex flex-row">
                        <div className="col-6 p-2">
                            <label htmlFor="country" className="mt-3">Country</label>
                            <Select
                                className='mt-3'
                                options={Country.getAllCountries()}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.name}
                                value={Country.getAllCountries().find(country => country.name === values.country)}
                                onChange={(selectedOption) => {
                                    setFieldValue("country", selectedOption.name);
                                    setSelectedCountry(selectedOption);
                                }}
                            />
                            <ErrorMessage name="country" component="div" className="text-danger mt-2" />
                        </div>
                        <div className="col-6 p-2">
                            <label htmlFor="state" className="mt-3">State</label>
                            <Select
                                className='mt-3'
                                options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.name}
                                value={State.getStatesOfCountry(selectedCountry?.isoCode)?.find(state => state.name === values.state)}
                                onChange={(selectedOption) => {
                                    setFieldValue("state", selectedOption.name);
                                    setSelectedState(selectedOption);
                                }}
                            />
                            <ErrorMessage name="state" component="div" className="text-danger mt-2" />
                        </div>
                    </div> */}

                    <div className="d-flex flex-row">
                        {/* <div className="col-6 p-2">
                            <label htmlFor="city" className="mt-3">City</label>
                            <Select
                                className='mt-3'
                                options={City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode)}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.name}
                                value={City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode)?.find(city => city.name === values.city)}
                                onChange={(selectedOption) => setFieldValue("city", selectedOption.name)}
                            />
                            <ErrorMessage name="city" component="div" className="text-danger mt-2" />
                        </div> */}

                    </div>

                    <div className="col-4 mt-4">
                        <button type="submit" className='btn tech-btn'>Create</button>
                    </div>
                </Form>
            )}
        </Formik>
    </>
    );
};

export default CreateTechnicians;