import AssignmentConstant from './../../Shared/Constant/AssignmentConstant';
import axios from 'axios';


export function GetListAssignmentService({ index, size }) {
  return axios.get(AssignmentConstant.GetListAssignmentURL, {
    params: {
      pageSize: size,
      pageIndex: index
    }
  });
}

export function CreateAssignmentService({ assetCode ,assigneeCode,assignerCode, note ,assignmentDate,AsmState}) {
  return axios.post(AssignmentConstant.CreateAssignmentURL, {
    assetCode: assetCode,
    assigneeCode: assigneeCode,
    assignerCode: assignerCode,
    note: note,
    assignmentDate: assignmentDate,
    AsmState: AsmState,
  });
}

export function EditAssignmentService({assignmentId,assetCode ,assigneeCode,assignerCode, note ,assignmentDate}) {
  return axios.put(`${AssignmentConstant.EditAssignmentURL}${assignmentId}`, {
    assignmentId: assignmentId,
    assetCode: assetCode,
    assigneeCode: assigneeCode,
    assignerCode: assignerCode,
    note: note,
    assignmentDate: assignmentDate,
  });
}


export function DeleteAssignmentService({ id }) {
    return axios.delete(AssignmentConstant.DeleteAssignmentURL+id);
}

export function GetAssignmentService({ id }) {
    return axios.get(`${AssignmentConstant.GetAssignmentURL}${id}`);
  };
   
  export function GetAssignmentListByService({searchValue, size, index }){
    return axios.get(AssignmentConstant.GetAssignmentListByURL, {
     params: {
       searchValue: searchValue,
       pageSize: size,
       pageIndex: index
     }
   });
 }


 export function GetListFilterAssignedDateService({searchValue, size, index }){
   return axios.get(AssignmentConstant.GetListFilterAssignedDateURL,{
     params: {
       searchValue: searchValue,
       pageSize: size, 
       pageIndex: index}
   })
 }
 export function GetListFilterAssignmentStateService({searchValue, size, index }){
  return axios.get(AssignmentConstant.GetListFilterAssignmentStateURL,{
    params: {
      searchValue: searchValue,
      pageSize: size, 
      pageIndex: index}
  })
}