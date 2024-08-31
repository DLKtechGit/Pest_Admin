import http from "./Https";
const GetIssuesUrl = "issuesApi/getIssues"
const UpdatePriorityUrl = "issuesApi/update-priority"

const GetUserIssues = (data) =>{
    return http.Get(GetIssuesUrl,data)
}
const UpdatePriority = (data) =>{
    return http.Post(UpdatePriorityUrl,data)
}

export default {
    GetUserIssues:GetUserIssues,
    UpdatePriority:UpdatePriority
};