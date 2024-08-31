import http from "./Https";
const createTechnicianUrl = "technician/createTechnician";
const technicianListUrl = "technician/getTechnician";
const technicianTaskUrl = "task/getTasks"
const createTechnicianTaskUrl = "task/createTask"
const DeleteTechinicianUrl = 'technician/delete/'
const deletedTechnicianUrl = "technician/all/deletedTechnician"
const RestoreTechnicianUrl = "technician/delete/technician/"
const technicianCountUrl = "company/totalTechnician"
const StartTaskCountUrl = "task/start/taskcount"
const OngoingTaskCountUrl = "task/ongoing/taskcount"
const CompletedTaskCountUrl = "task/completed/taskcount"
const RegisterTechnicianUrl = "otherauth/technicianRegister"
const EditTechnicianUrl = "technician/editTechnician/"
const GetReportsURL = 'task/completedTaskDetails/';
const DeleteTasurl = 'task/delete/task'

const createTechnician = (data) => {
    // console.log("data------->",data);
    return http.Post(createTechnicianUrl, data);
}
const EditTechnician = (data) => {
    // console.log("data----------->",data);
    const EditTechnicianData = `${EditTechnicianUrl}${data.id}`
    return http.Post(EditTechnicianData, data)
}
const technicianList = (data) => {
    // console.log('technician list',data)
    return http.Get(technicianListUrl, data)
}


const DeleteTechinician = (data) => {
    let deleteTechnicisnUrl = `${DeleteTechinicianUrl}${data}`
    return http.Post(deleteTechnicisnUrl)
}

const DeletedTechnician = (data) => {
    return http.Get(deletedTechnicianUrl, data)
}

const RestoreTechnician = (data) => {
    const restoreTechnician = `${RestoreTechnicianUrl}${data}`
    return http.Post(restoreTechnician)
}

const TechnicianCount = (data) => {
    return http.Get(technicianCountUrl, data)
}

// =========================== Tasks ===========================

const technicianTask = (data) => {

    return http.Get(technicianTaskUrl, data)
}

const createTechnicianTask = (data) => {
    return http.Post(createTechnicianTaskUrl, data)
}

const StartTaskCount = (data) => {
    return http.Get(StartTaskCountUrl, data)
}

const OngoingTaskCount = (data) => {
    return http.Get(OngoingTaskCountUrl, data)

}

const CompletedTaskCount = (data) => {
    return http.Get(CompletedTaskCountUrl, data)
}

const RegisterTechnicican = (data) => {
    // const Register = `${RegisterTechnicianUrl}${data}`
    return http.Post(RegisterTechnicianUrl, data)
}

const GetReports = (data) => {     
    return http.Get(GetReportsURL,data); 
}
const deleteTask = (data)=>{
    return http.Post(DeleteTasurl,data)
}

export default {
    createTechnician: createTechnician,
    technicianList: technicianList,
    technicianTask: technicianTask,
    createTechnicianTask: createTechnicianTask,
    DeleteTechinician: DeleteTechinician,
    DeletedTechnician: DeletedTechnician,
    RestoreTechnician: RestoreTechnician,
    TechnicianCount: TechnicianCount,
    StartTaskCount: StartTaskCount,
    OngoingTaskCount: OngoingTaskCount,
    CompletedTaskCount: CompletedTaskCount,
    RegisterTechnicican: RegisterTechnicican,
    EditTechnician:EditTechnician,
    GetReports:GetReports,
    deleteTask:deleteTask

};