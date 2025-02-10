export const filterDepartment = (department:any)=>{
    return department.split(" ").map((word:string)=>word[0].toUpperCase()).join("")
}