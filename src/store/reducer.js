// reducers.js

import { combineReducers } from 'redux';
import customizationReducer from './customizationReducer';
import { STORE_DELETED_COMPANY } from './actions';

const initialState = {
  deletedCompanies: []
  
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_DELETED_COMPANY:
      // console.log('storeddata==========>',STORE_DELETED_COMPANY);
      return {
        ...state,
        deletedCompanies: [...state.deletedCompanies, action.payload]
        
      };
    default:
      return state;
  }
};

// Merge rootReducer with customizationReducer using combineReducers
const reducer = combineReducers({
  customization: customizationReducer,
  root: rootReducer
});

export default reducer;
