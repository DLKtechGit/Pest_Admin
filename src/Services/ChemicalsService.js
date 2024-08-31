import http from "./Https";
const createChemicalsUrl = "chemicals/createChemicals";
const getChemicalsUrl = "chemicals/getChemicals"
const DeleteChemicalsUrl = "chemicals/deleteChemicals/"

const createChemicals = (data) => {
    // console.log("dataserv------->",data);
    return http.Post(createChemicalsUrl, data);
}

const GetChemicals = (data) =>{
    return http.Get(getChemicalsUrl,data)
}

const DeleteChemicals = (data)=>{
    // console.log("data-------============>",data);
    const deleteChemicalsData = `${DeleteChemicalsUrl}${data}`
   return http.Post(deleteChemicalsData,data)
}


export default {
    createChemicals: createChemicals,
    GetChemicals:GetChemicals,
    DeleteChemicals:DeleteChemicals
};