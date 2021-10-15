import CommonConstant from './CommonConstant';
const UserConstant = {
  Location: 'Location',
  FName: 'First Name',
  LName: 'Last Name',
  Dob: 'Date of Birth',
  JoinDate: 'Joined Date',
  Gender: 'Gender',
  Code: 'Staff Code',
  UserName: 'User Name ',
  FullName: 'Full Name',
  AdminType: 'Admin',
  NormalType: 'Normal',
  Type: 'Type',
  CreateUserURL: `${CommonConstant.Server}/Admin/api/user/create`,
  GetListUserURL: `${CommonConstant.Server}/Admin/api/user/list`,
  DisableUserURL: `${CommonConstant.Server}/Admin/api/user/Disable/`,
  PageIndexDefault: 1,
  PageSizeDefault: 10,
  GetUserURL: `${CommonConstant.Server}/Admin/api/user/Code?code=`,
  EditUserURL: `${CommonConstant.Server}/Admin/api/user/update/`,
  GetAllUserURL: `${CommonConstant.Server}/Admin/api/user/listAll`
};

export default UserConstant;