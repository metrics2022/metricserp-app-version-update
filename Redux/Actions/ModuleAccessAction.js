import { SALES_MODULE_ACCESS } from '../constants';


export const ModuleAccessAction = (payload)=> {
    
    //console.log("sales",payload)
    return{
        type:SALES_MODULE_ACCESS,
        payload
        
    }
}



