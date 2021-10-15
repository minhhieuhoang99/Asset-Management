import ViewOwnASMConstant from './../../Shared/Constant/ViewOwnASMConstant';
import axios from 'axios';


export function GetOwnListAssignmentService({size, userCode, index }) {
  return axios.get(ViewOwnASMConstant.GetOwnListAssignmentURL, {
    params: {
      pageSize: size,
      userCode: userCode,
      pageIndex: index
    }
  });
}

export function GetOwnAssignmentService({ id }) {
    return axios.get(`${ViewOwnASMConstant.GetOwnAssignmentURL}${id}`);
  };
export function CreateReturnRequestService({id,code}){
  return axios.put(`${ViewOwnASMConstant.CreateReturnRequestURL}${id}-${code}`);
}

export function ResponseASMService({id, respond}){
  return axios.put(`${ViewOwnASMConstant.ResponseASMURL}${id}-${respond}`);
}