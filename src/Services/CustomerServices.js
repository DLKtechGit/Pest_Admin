import http from "./Https";
const createCompanyUrl = "company/createCompany";
const getCompanysUrl = "company/getCompany/"
const DeleteCustomerUrl = "company/delete/customer/"
const EditCustomerUrl = "company/editCompany/"
const DeletedCustomersUrl = "company/getall/deletedcompany"
const RestoreCustomerUrl = "company/deletedcompany/restore/"
const RegisterCustomerUrl = "otherauth/register"
const customerCountUrl =  "company/totalcompany"


const createCompany = (data) => {
    return http.Post(createCompanyUrl, data);
}
const EditCustomer = (data) => {
    // console.log("data----------->",data);
    const EditCustomerData = `${EditCustomerUrl}${data.id}`
    return http.Post(EditCustomerData, data)
}

const getCompany = (data) => {
    return http.Get(getCompanysUrl, data)
}

const DeleteCustomer = (data) => {
    const deleteCustomer = `${DeleteCustomerUrl}${data}`
    return http.Post(deleteCustomer, data)
}

const DeletedCustomers = (data) => {
    return http.Get(DeletedCustomersUrl, data)
}

const RestoreCustomer = (data) => {
    const restoreCustomer = `${RestoreCustomerUrl}${data}`
    return http.Post(restoreCustomer, data)
}
const RegisterCustomer = (data) => {
    // const RegisterCustomer = `${RegisterCustomerUrl}${data}`
    return http.Post(RegisterCustomerUrl, data)
}

const CustomerCount = (data)=>{
   return http.Get(customerCountUrl,data)
}


export default {
    createCompany: createCompany,
    getCompany:getCompany,
    DeleteCustomer:DeleteCustomer,
    DeletedCustomers:DeletedCustomers,
    RestoreCustomer:RestoreCustomer,
    RegisterCustomer:RegisterCustomer,
    CustomerCount:CustomerCount,
    EditCustomer:EditCustomer
};