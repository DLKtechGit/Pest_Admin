import http from "./Https";
const createServicesUrl = "services/createService";
const ListofServicesUrl = "services/getServices"
const DeleteServicesUrl = "services/deleteservices/"
const submitUrl = "task/subtionmail"


const createServices = (data) => {
    // console.log("dataserv------->",data);
    return http.Post(createServicesUrl, data);
}

const ListServices = (data) =>{
    return http.Get(ListofServicesUrl,data)
}

const DeleteService = (data)=>{
    // console.log("data-------============>",data);
    const deleteServicesUrl = `${DeleteServicesUrl}${data}`
   return http.Post(deleteServicesUrl,data)
}

const Submitemail = (data)=>{
    return http.Post(submitUrl,data)
}


export default {
    createServices: createServices,
    ListServices:ListServices,
    DeleteService:DeleteService,
    Submitemail:Submitemail,
};