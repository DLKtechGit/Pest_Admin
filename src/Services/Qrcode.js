import http from "./Https";
const CreateQrcodeUrl = "qrcode/createQr"
const GetQrcodeUrl = "qrcode/getQrcode"
const DeletedQrcodeUrl = "qrcode/deleteQrcode/"
const TotalQrcodeUrl = "qrcode/totalQrcodes"
const getQrcodeByIdUrl = "qrcode/getQrcodeById/"
const deleteQrTitleUrl = "qrcode/deleteTitle"


const CreateQrcode = (data)=>{
    return http.Post(CreateQrcodeUrl,data)
}
const GetQrcodes = (data) => {
    return http.Get(GetQrcodeUrl, data);
}

const DeletedQrcode = (data) => {
    const deletQrcodes = `${DeletedQrcodeUrl}${data}`
    return http.Post(deletQrcodes, data)
}
const GetTotalQrcodes = (data) => {
    return http.Get(TotalQrcodeUrl, data);
}

const getQrcodeById = (data)=>{
    const QrcodeById = `${getQrcodeByIdUrl}${data}`
    return http.Get(QrcodeById,data)
}

const detleteQrTitle = (data)=>{
    return http.Post(deleteQrTitleUrl,data)
}

export default{
    CreateQrcode:CreateQrcode,
    GetQrcodes:GetQrcodes,
    DeletedQrcode:DeletedQrcode,
    GetTotalQrcodes:GetTotalQrcodes,
    getQrcodeById:getQrcodeById,
    detleteQrTitle:detleteQrTitle,
}