import { SALES_MODULE_ACCESS } from '../constants';

const initialState = {
    salesModuleAccess1: ''
}

export const ModuleAccessReducers = (state = initialState, action) => {
    //console.log('reducer', action.payload)
  switch (action.type) {
    case SALES_MODULE_ACCESS:
       
            return {
              salesModuleAccess1: action.payload,
              
            };
            
           
    default:
      return state;
  }
       
}

