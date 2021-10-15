import CommonConstant from './CommonConstant';

const ReturnRequestConstant = {
  assignmentId : 'No.', 
  assetCode : 'Asset Code',
  assetName : 'Asset Name',
  requesterUserName : 'Requested By',
  assignmentDate : 'Assigned Date', 
  verifierUserName: "Accepted By",
  returnDate : "Returned Date", 
  returnState : "State",
  PageIndexDefault: 1,
  PageSizeDefault: 10,
  GetListReturnRequestURL: `${CommonConstant.Server}/api/admin/return-request/list`,
  GetReturnRequestListByURL : `${CommonConstant.Server}/api/admin/return-request/list-by/`,
  GetListFilterReturnDateURL:`${CommonConstant.Server}/api/admin/return-request/list-filter-date`,
  GetListFilterReturnStateURL:`${CommonConstant.Server}/api/admin/return-request/list-filter-state`,
  RespondReturnRequest : `${CommonConstant.Server}/api/admin/return-request/respond/`,
  GetReturnRequestURL : `${CommonConstant.Server}/api/admin/assignment/`,
};

export default ReturnRequestConstant;