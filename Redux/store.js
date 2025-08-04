import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { AllOrganizationReducers } from './Reducers/AllOrganizationReducers';
import { LoginReducer } from './Reducers/AuthReducers';
import { AutocompleteCategoryReducers } from './Reducers/AutocompleteCategoryReducers';
import { AutocompleteBrandReducers } from './Reducers/AutocompleteBrandReducers';
import { AllSalesOrderReducers } from './Reducers/SalesOrderReducers';
import { SearchCustomerReducers } from './Reducers/SearchCustomerReducers';
import { VerificationReducer } from './Reducers/VerificationReducers';
import { CartReducer } from "./Reducers/CartReducers";
import { AddressReducer } from './Reducers/AddressReducers';
import { SalesOrderSubmitReducers } from './Reducers/SalesOrderSubmitReducers';
import { GlobalDataReducer } from './Reducers/GlobalDataReducers';
import { SassLoginReducer } from './Reducers/SassLoginReducers';
import { AllWorkOrdersReducers } from './Reducers/WorkOrderReducers';
import { WorkOrderSearchReducers } from './Reducers/WorkOrderSearchReducers';
import { ModuleAccessReducers } from './Reducers/ModuleAccessReducers';
import { SalesQuoteSubmitReducers } from './Reducers/SalesQuoteSubmitReducers';
import { SearchLeadCompanyReducers } from './Reducers/LeadSubmitReducers';
import { salesQuoteReducers } from './Reducers/SalesQuoteReducers'
import { ResourceUpdateReducers } from './Reducers/ResourceUpdateReducer';
import { ResourceTransactionsReducers } from './Reducers/ResourceTransactionsReducers'
import { SalesOrderCartReducer } from './Reducers/SalesOrderCartReducers';
import { DeliveryReducer } from './Delivery/DeliveryReducers';
// import versionCheckMiddleware from './Middleware/versionCheckMiddleware';

const reducers = combineReducers({
    LoginReducer:LoginReducer,
    Verify: VerificationReducer,
    SassLogin: SassLoginReducer,
    GlobalDataReducer:GlobalDataReducer,
    AllSalesOrders: AllSalesOrderReducers,
    AllOrganization:AllOrganizationReducers,
    SearchCustomer:SearchCustomerReducers,
    AutocompleteCategoryReducers:AutocompleteCategoryReducers,
    AutocompleteBrandReducers:AutocompleteBrandReducers,
    CartReducer:CartReducer,
    SalesOrderCartReducer:SalesOrderCartReducer,
    AddressReducer: AddressReducer,
    SalesOrderSubmitReducers:SalesOrderSubmitReducers,
    AllWorkOrdersReducers:AllWorkOrdersReducers,
    WorkOrderSearchReducers:WorkOrderSearchReducers,
    ModuleAccessReducers:ModuleAccessReducers,
    SalesQuoteSubmitReducers: SalesQuoteSubmitReducers,
    SearchLead: SearchLeadCompanyReducers,
    AllSalesQuote:salesQuoteReducers,
    ResourceUpdate: ResourceUpdateReducers,
    ResourceTransaction: ResourceTransactionsReducers,
    DeliveryReducer: DeliveryReducer
})


const store = createStore(reducers, applyMiddleware(thunk));

export default store;