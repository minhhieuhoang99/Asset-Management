import axios from "axios";
import UserConstant from '../../Shared/Constant/UserConstant';

export function CreateUserService({ firstName, lastName, dob, joinDate, gender, type, userName, location, code }) {
  return axios.post(UserConstant.CreateUserURL, {
    firstName: firstName,
    lastName: lastName,
    dob: dob,
    location: location,
    joinDate: joinDate,
    code: code,
    gender: gender,
    userName: userName,
    type: type,
  });
}

export function GetListUserService({ index, size }) {
  return axios.get(UserConstant.GetListUserURL, {
    params: {
      pageSize: size,
      pageIndex: index
    }
  });
}


export function DisableUserService({ code }) {
  return axios.put(UserConstant.DisableUserURL + code);
}

export function GetUserService({ code }) {
  return axios.get(`${UserConstant.GetUserURL}${code}`);
};


export function EditUserService({ code, firstName, lastName, dob, joinDate, location, gender, userName, type }) {
  return axios.put(`${UserConstant.EditUserURL}${code}`, {
    code: code,
    firstName: firstName,
    lastName: lastName,
    dob: dob,
    joinDate: joinDate,
    location: location,
    gender: gender,
    userName: userName,
    type: type,
  });
}

export function GetAllUserService() {
  return axios.get(UserConstant.GetAllUserURL);
};
