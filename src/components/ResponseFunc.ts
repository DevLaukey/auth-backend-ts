export default function ReponseData(dataPassed:{
    status:number,
    messsage:string,
    token?:any
}){
    return {
        ...dataPassed.status && { status : dataPassed.status},
        ...dataPassed.messsage && { message : dataPassed.messsage},
        ...dataPassed.token && { token : dataPassed.token}
    }
}