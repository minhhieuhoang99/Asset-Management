import CommonConstant from './CommonConstant';

const ViewOwnASMConstant = {
  assignmentId : 'No.', 
  assetCode : 'Asset Code',
  assetName : 'Asset Name',
  assigneeUserName : 'Assigned to',
  assignerUserName : 'Assigned By',
  assignmentDate : 'Assigned Date',
  assignmentState : 'State',
  PageIndexDefault: 1,
  PageSizeDefault: 10,
  GetOwnListAssignmentURL: `${CommonConstant.Server}/api/user/assignment/list`,
  GetOwnAssignmentURL: `${CommonConstant.Server}/api/user/assignment/`,
  CreateReturnRequestURL : `${CommonConstant.Server}/api/user/create-return/`,
  ResponseASMURL: `${CommonConstant.Server}/api/user/respond/`
};

export default ViewOwnASMConstant;