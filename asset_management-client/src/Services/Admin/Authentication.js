import axios from "axios";
import AuthenticationConstant from "../../Shared/Constant/AuthenticationConstant";

export function LoginService({ user, password, remember }) {
  return axios.post(AuthenticationConstant.LoginURL, {
    userName: user,
    password: password,
    remember: remember,
  });
}

export function ChangePasswordService({ userCode, oldPassword,newPassword }) {
  return axios.post(AuthenticationConstant.ChangePasswordURL, {
    userCode: userCode,
    oldPassword: oldPassword,
    newPassword: newPassword,
  });
}

