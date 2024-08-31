import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import 'react-country-state-city/dist/react-country-state-city.css';
import CreateServices from './AddNew/CreateServices';
import CreateNewCompany from './AddNew/CreateNewCustomer';
import CreateTechnicians from './AddNew/CreateTechnicians';
import CreateChemicals from './AddNew/CreateChemicals';
import CreateCategory from './AddNew/CreateCategory';

const AddTaskDetials = () => {
  return (
    <>
      <MainCard title="Add New">
      <div>
          <h6>
            <FontAwesomeIcon icon={faCaretDown} /> &nbsp; Create Category
          </h6>
          <CreateCategory />
        </div>
        <hr style={{ margin: '40px 0px 40px 0px' }} />
        <div>
          <h6>
            <FontAwesomeIcon icon={faCaretDown} /> &nbsp; Create Service
          </h6>
          <CreateServices />
        </div>
        <hr style={{ margin: '40px 0px 40px 0px' }} />
        <div>
          <h6>
            <FontAwesomeIcon icon={faCaretDown} /> &nbsp; Create Customer
          </h6>
          <CreateNewCompany />
          <hr style={{ margin: '40px 0px 40px 0px' }} />
          <div id='tech'>
            <h6>
              <FontAwesomeIcon icon={faCaretDown} /> &nbsp; Create Technician
            </h6>
            <CreateTechnicians  />           
          </div>
          <hr style={{ margin: '40px 0px 40px 0px' }} />
          <div>
            <h6>
              <FontAwesomeIcon icon={faCaretDown} /> &nbsp; Create Chemical
            </h6>
            <CreateChemicals />           
          </div>
        </div>
      </MainCard>
    </>
  );
};

export default AddTaskDetials;
