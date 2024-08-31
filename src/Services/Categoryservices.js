import http from "./Https";
const createCateogryUrl = "category/createServiceCategory";
const getCategoryUrl = "category/getCategory";
const deleteCategoryUrl = "category/deleteCategory/";

const createCateogry = (data) => {
    // console.log("dataserv------->",data);
    return http.Post(createCateogryUrl, data);
}

const GetCateogry = (data) =>{
    return http.Get(getCategoryUrl,data)
}

const DeleteCategory = (data)=>{
    // console.log("data-------============>",data);
    const deleteCategoryUrlData = `${deleteCategoryUrl}${data}`
   return http.Post(deleteCategoryUrlData,data)
}

export default {
    createCateogry: createCateogry,   
    GetCateogry:GetCateogry,
    DeleteCategory:DeleteCategory
};