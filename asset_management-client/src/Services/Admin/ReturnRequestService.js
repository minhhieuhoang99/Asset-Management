import axios from 'axios';
import ReturnRequestConstant from '../../Shared/Constant/ReturnRequestConstant'

export function GetListReturnRequestService({index , size}){
  return axios.get(ReturnRequestConstant.GetListReturnRequestURL,{
    params: {
      pageSize: size,
      pageIndex: index
    }
  });
}

export function GetReturnRequestListByService({searchValue, size, index }){
   return axios.get(ReturnRequestConstant.GetReturnRequestListByURL, {
    params: {
      searchValue: searchValue,
      pageSize: size,
      pageIndex: index
    }
  });
}

export function GetListFilterReturnDateService({searchValue, size, index }){
  return axios.get(ReturnRequestConstant.GetListFilterReturnDateURL,{
    params: {
      searchValue: searchValue,
      pageSize: size, 
      pageIndex: index}
  })
}
export function GetListFilterReturnStateService({searchValue, size, index }){
 return axios.get(ReturnRequestConstant.GetListFilterReturnStateURL,{
   params: {
     searchValue: searchValue,
     pageSize: size, 
     pageIndex: index}
 })
}

export function RespondReturnRequest({code,id,respond}) {
  return axios.put(`${ReturnRequestConstant.RespondReturnRequest}${code}-${id}-${respond}`);
}

export function GetReturnRequestService({id}){
  return axios.get(`${ReturnRequestConstant.GetReturnRequestURL}${id}`);
}