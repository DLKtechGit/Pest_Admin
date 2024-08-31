import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Country, State, City } from 'country-state-city';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ApiCustomer from '../../../Services/CustomerServices';
import { toast, ToastContainer } from 'react-toastify';
import Loader from 'ui-component/Loader/Loader';
import { useNavigate } from 'react-router';

const CreateNewCustomer = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    address: '',
    country: '',
    state: '',
    city: '',
    phoneNumber: ''
  };

  const handleClick = async (values) => {
    setLoader(true);
    console.log('Form Values:', values);
    await ApiCustomer.createCompany(values).then((res) => {
      if (res.status === 201) {
        toast.success('New Customer Created Successfully');

        setTimeout(() => {
          navigate('/customer-list/table');
        }, 1000);
      } else if (res.status === 409) {
        toast.error('Email already exist');
        window.location.reload();

      } else if (res.status === 400) {
        toast.error('Please fill all required field');
        window.location.reload();
      }
    });
    setLoader(false);
  };

  return (
    <>
      {loader && <Loader show={loader} />}
      <Formik
        initialValues={initialValues}
        // onSubmit={onSubmit}
        onSubmit={(values, actions) => {
          handleClick(values).then(() => {
            // console.log("valuesawdadadwad", values);
            actions.resetForm({
              values: {
                name: '',
                email: '',
                address: '',
                country: '',
                state: '',
                city: '',
                phoneNumber: ''
              }
            });
          });
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="d-flex flex-row">
              <div className="col-6 p-2">
                <label htmlFor="name" className="mt-3">
                  Customer Name
                </label>
                <Field name="name" type="text" className="newcompany form-control mt-3" placeholder="Enter Customer Name" />
                <ErrorMessage name="name" component="div" className="text-danger mt-2" />
              </div>
              <div className="col-6 p-2">
                <label htmlFor="address" className="mt-3">
                  Customer Address
                </label>
                <Field name="address" type="text" className="newcompany form-control mt-3" placeholder="Enter Customer Address" />
                <ErrorMessage name="address" component="div" className="text-danger mt-2" />
              </div>
            </div>

            <div className="d-flex flex-row">
              <div className="col-6 p-2">
                <label htmlFor="country" className="mt-3">
                  Country
                </label>
                <Select
                  className="mt-3"
                  options={Country.getAllCountries()}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.name}
                  value={Country.getAllCountries().find((country) => country.name === values.country)}
                  onChange={(selectedOption) => {
                    setFieldValue('country', selectedOption.name);
                    setSelectedCountry(selectedOption);
                  }}
                />
                <ErrorMessage name="country" component="div" className="text-danger mt-2" />
              </div>
              <div className="col-6 p-2">
                <label htmlFor="state" className="mt-3">
                  State
                </label>
                <Select
                  className="mt-3"
                  options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.name}
                  value={State.getStatesOfCountry(selectedCountry?.isoCode)?.find((state) => state.name === values.state)}
                  onChange={(selectedOption) => {
                    setFieldValue('state', selectedOption.name);
                    setSelectedState(selectedOption);
                  }}
                />
                <ErrorMessage name="state" component="div" className="text-danger mt-2" />
              </div>
            </div>

            <div className="d-flex flex-row">
              <div className="col-6 p-2">
                <label htmlFor="city" className="mt-3">
                  City
                </label>
                <Select
                  className="mt-3"
                  options={City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode)}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.name}
                  value={City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode)?.find((city) => city.name === values.city)}
                  onChange={(selectedOption) => setFieldValue('city', selectedOption.name)}
                />
                <ErrorMessage name="city" component="div" className="text-danger mt-2" />
              </div>
              <div className="col-6 p-2">
                <label htmlFor="phoneNumber" className="mt-3 mb-3">
                  Phone Number
                </label>
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
                  placeholder="Enter a Phone Number"
                />
              </div>
            </div>

            <div className="d-flex flex-row">
              <div className="col-6 p-2">
                <label htmlFor="email" className="mt-3">
                  Email Address
                </label>
                <Field name="email" type="email" className="newcompany form-control mt-3" placeholder="Enter Email Address" />
                <ErrorMessage name="email" component="div" className="text-danger mt-2" />
              </div>
            </div>

            <div className="col-4 mt-4">
              <button type="submit" className="btn tech-btn">
                Create
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateNewCustomer;
