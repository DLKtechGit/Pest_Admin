import http from "./Https";
const resetPwdcustomerUrl = "otherauth/resetPassword";
const registeredCustomersUrl = "otherauth/GetregisteredCustomers";
const resetPwdTechnicianUrl = "otherauth/resetPassword/tech";
const registeredTechnicianUrl = "otherauth/getregisteredTechnician";
// const resetPwdTechnician = "otherauth/resetPassword/tech"

const resetPwdCustomer = (data) => {
    return http.Post(resetPwdcustomerUrl, data);
}
const registeredCustomer = (data) => {
    return http.Get(registeredCustomersUrl, data);
}
const resetPwdTechnician = (data) => {
    return http.Post(resetPwdTechnicianUrl, data);
}
const registeredTechnician = (data) => {
    return http.Get(registeredTechnicianUrl, data);
}

export default {
    resetPwdCustomer: resetPwdCustomer,
    registeredCustomer: registeredCustomer,
    resetPwdTechnician:resetPwdTechnician,
    registeredTechnician:registeredTechnician
}