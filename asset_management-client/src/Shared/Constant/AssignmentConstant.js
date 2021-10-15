import CommonConstant from './CommonConstant';

const AssignmentConstant = {
  assignmentId : 'No.', 
  assetCode : 'Asset Code',
  assetName : 'Asset Name',
  assigneeUserName : 'Assigned to',
  assignerUserName : 'Assigned By',
  assignmentDate : 'Assigned Date',
  assignmentState : 'State',
  PageIndexDefault: 1,
  PageSizeDefault: 10,
  GetListAssignmentURL: `${CommonConstant.Server}/api/admin/assignment/list`,
  GetAssignmentURL: `${CommonConstant.Server}/api/admin/assignment/`,
  GetAssignmentListByURL: `${CommonConstant.Server}/api/admin/assignment/list-by/`,
  DeleteAssignmentURL: `${CommonConstant.Server}/api/admin/assignment/`,
  EditAssignmentURL :`${CommonConstant.Server}/api/admin/assignment/update/`,
  CreateAssignmentURL : `${CommonConstant.Server}/api/admin/assignment/create`,
  GetListFilterAssignedDateURL: `${CommonConstant.Server}/api/admin/assignment/list-filter-date`,
  GetListFilterAssignmentStateURL:`${CommonConstant.Server}/api/admin/assignment/list-filter-state`
};

export default AssignmentConstant;