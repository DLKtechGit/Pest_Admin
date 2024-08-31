import http from "./Https";
const AdminLoginUrl = "adminauth/registeradmin";
const AdminchildLoginUrl = "adminauth/login/admin";
const GetAllAdminsUrl = "adminauth/getAllAdmins";
const DeleteAdminUrl = "adminauth/admindelete/";
const AdminCountUrl = "adminauth/admin/count"
const AdminForgotPasswordUrl = "adminauth/forgot"
const ResetPasswordUrl = "/adminauth/reset/password/:randomString/:expirationTimestmpa"

const AdminLogin = (data) => {
    // console.log("dataserv------->", data);
    return http.Post(AdminLoginUrl, data);
}
const AdminChildLogin = (data) => {
    // console.log("dataserv------->", data);
    return http.Post(AdminchildLoginUrl, data);
}
const GetAdmins = (data) => {
    return http.Get(GetAllAdminsUrl, data)
}
const AdminDelete = (data) => {
    // console.log("dataserv------->", data);
    const deleteAdminUrl = `${DeleteAdminUrl}${data}`
    return http.Post(deleteAdminUrl, data)
}

const AdminCount = (data)=>{
    return http.Get(AdminCountUrl,data)
}

const ForgotPassword = (data)=>{
    return http.Post(AdminForgotPasswordUrl,data)
}
const ResetPassword = (data)=>{
    return http.Post(ResetPasswordUrl,data)
}

export default {
    AdminLogin: AdminLogin,
    GetAdmins: GetAdmins,
    AdminDelete: AdminDelete,
    AdminCount:AdminCount,
    AdminChildLogin:AdminChildLogin,
    ForgotPassword:ForgotPassword,
    ResetPassword:ResetPassword
};