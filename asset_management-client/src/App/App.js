import {
  Switch,
  Route,
  HashRouter,
} from "react-router-dom";
import { UnlockOutlined } from "@ant-design/icons";
import { Form, Input, Button, Modal } from "antd";
import "antd/dist/antd.css";
import EditUserPage from "../Pages/Admin/EditUserPage";
import CreateAssetPage from "../Pages/Admin/CreateAssetPage";
import EditAsset from "../Pages/Admin/EditAssetPage";
import ListUserPage from './../Pages/Admin/ListUserPage';
import TestPage from "../Pages/Admin/TestPage";
import HomePage from "../Pages/Admin/HomeDemoPage";
import ListAssetPage from './../Pages/Admin/ListAssetPage';
import SideBar from "../Components/SideBar/SideBar";
import FooterNash from './../Components/Footer/Footer';
import { Layout } from 'antd';
import HeaderNash from './../Components/Header/Header';
import { Content } from "antd/lib/layout/layout";
import { LastLocationProvider } from 'react-router-last-location';
import { ChangePasswordService } from "../Services/Admin/Authentication";
import ListAssignmentPage from "../Pages/Admin/ListAssignmentPage";
import CreateAssignmentPage from "../Pages/Admin/CreateAssignmentPage";
import EditAssignmentPage from "../Pages/Admin/EditAssignmentPage";
import ListReturnRequestPage from "../Pages/Admin/ListReturnRequestPage";
import CurrentUserContext from "../Shared/Constant/Context/CurrentUserContext";
import CurrentHeaderContext from "../Shared/Constant/Context/CurrentHeaderContext";
import SecondHeaderContext from "../Shared/Constant/Context/SecondHeaderContext";
import Cookies from 'universal-cookie';
import './App.css';
import LoginPage from '../Pages/Admin/LoginPage';
import { useState } from 'react';
import { CookiesProvider } from "react-cookie";
import CreateUserPage from './../Pages/Admin/CreateUserPage';
import ReportPage from './../Pages/Admin/ReportPage';
const App = () => {
  const cookies = new Cookies();
  const initialValues = {
    token: cookies.get('token'),
    role: cookies.get('role'),
    location: cookies.get('location'),
    code: cookies.get('code'),
    firstLogin: cookies.get('firstLogin'),
    user: cookies.get('userName')
  }
  const [isModal1stVisible, setIsModal1stVisible] = useState(false);
  const [isModalSuccessVisible, setIsModalSuccesVisible] = useState(false);
  const [form1] = Form.useForm();
  const cookie = new Cookies();
  const role = cookie.get('role');
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  const [currentUser, setCurrentUser] = useState(initialValues)
  const [currentHeader, setCurrentHeader] = useState("Home");
  const [secondHeader, setSecondHeader] = useState();

  const handleOkFor1st = (values) => {

    if (role === 'Admin') {
      ChangePasswordService({
        userCode: cookie.get('code'),
        oldPassword: 'Admin123@123',
        newPassword: values.NewPassword
      })
        .then(function (response) {
          setIsModalSuccesVisible(true);
          setIsModal1stVisible(false);
          cookie.set('firstLogin', 'False', { maxAge: 604800 });
        }).catch(function (error) {
          console.log(error);
        })
    } if (role === 'User') {
      ChangePasswordService({
        userCode: cookie.get('code'),
        oldPassword: 'Staff123@123',
        newPassword: values.NewPassword
      })
        .then(function (response) {
          setIsModalSuccesVisible(true);
          setIsModal1stVisible(false);
          cookie.set('firstLogin', 'false', { maxAge: 604800 });
        }).catch(function (error) {
          console.log(error);
        })
    }
  };
  const handleCancel1stTime = () => {
    setIsModal1stVisible(false);
  };
  const handleClose = () => {
    window.location.replace("/");
    setIsModalSuccesVisible(false);
  }

  return (
    <HashRouter>

      <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
        <CookiesProvider>
          <CurrentHeaderContext.Provider value={{ currentHeader, setCurrentHeader }}>
            <SecondHeaderContext.Provider value={{ secondHeader, setSecondHeader }}>
              <LastLocationProvider>
                <Switch>
                  <Layout>

                    <HeaderNash />
                    <Content  style={{ overflow: 'auto',width: '100%' , left: 0 }} >
                      <Modal title="Change Password" visible={isModal1stVisible || cookie.get('firstLogin') === 'True'} closable={null} footer={null} centered={true}>

                        <Form
                          onFinish={handleOkFor1st}
                          onFinishFailed={handleCancel1stTime}
                          form={form1}
                        >
                          <p style={{ textAlign: "left", marginLeft: '15%', fontWeight: '600' }}>This is the first time you logged in.<br />You have to change your password to continue.</p>
                          <p></p>

                          <Form.Item
                            name="NewPassword"
                            values="NewPassword"
                            rules={[
                              {
                                required: true,
                                message: "Please input your New Password",
                              },
                              () => ({
                                validator(_, value) {
                                  if (value === 'Admin123@123' || value === 'Staff123@123') {

                                    return Promise.reject(
                                      new Error(
                                        "You can't change your password to the same password as default"
                                      )
                                    )
                                  } else {
                                    return Promise.resolve();
                                  }
                                }
                              }),
                              () => ({
                                validator(_, value) {
                                  if (strongRegex.test(value)) {
                                    return Promise.resolve();
                                  } else {
                                    return Promise.reject(
                                      new Error(
                                        "Require lowercase , uppercase , numeric and special Character and at least 8 characters "
                                      )
                                    );
                                  }
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              style={{ width: "70%", marginLeft: '15%' }}
                              placeholder="Enter your new password"
                              prefix={<UnlockOutlined />}
                            />
                          </Form.Item>
                          <Form.Item
                            shouldUpdate
                            className="submit"
                          >
                            {() => (
                              <Button
                                style={{borderRadius: '7px', marginLeft: '40%', backgroundColor: "red", color: "white" }}
                                danger
                                type="primary"
                                htmlType="submit"
                                disabled={
                                  !form1.isFieldsTouched(true) ||
                                  form1.getFieldsError().filter(({ errors }) => errors.length)
                                    .length > 0
                                }
                              >
                                Save
                              </Button>
                            )}
                          </Form.Item>
                        </Form>
                      </Modal>
                      <Modal centered={true} title="Change Password" visible={isModalSuccessVisible}  onCancel={handleClose} footer={null}>
                      <>
                            <b style={{ marginLeft:'18%'}}>Your password has been changed successfully</b>
                            <br />
                            <br />
                            <div style = {{padding : '10px', display: 'flex'}}>
                              <Button style={{marginLeft:"42%",borderRadius: '7px'}}  onClick={handleClose}>Close</Button>
                            </div>
                      </>
                      </Modal>
                      <Layout className="site-layout-background" >
                        {currentUser.role === 'Admin' ?
                          <>
                            <SideBar />
                            <Route exact path="/"><HomePage /></Route>
                            <Route path="/list-asset"><ListAssetPage /></Route>
                            <Route path="/create"><CreateUserPage /></Route>
                            <Route path="/edit/:code"><EditUserPage /></Route>
                            <Route path="/create-asset"><CreateAssetPage /></Route>
                            <Route path="/edit-asset/:code"><EditAsset /></Route>
                            <Route path="/list-user"><ListUserPage /></Route>
                            <Route path="/test"><TestPage /></Route>
                            <Route path="/list-assignment"><ListAssignmentPage /></Route>
                            <Route path="/create-assignment"><CreateAssignmentPage /></Route>
                            <Route path="/edit-assignment/:id"><EditAssignmentPage /></Route>
                            <Route path="/list-returnRequest"><ListReturnRequestPage /></Route>
                            <Route path="/list-report"><ReportPage /></Route>
                            <Route path="/login"><LoginPage /></Route>
                          </> :
                          <>
                            <SideBar />
                            <Route exact path="/"><HomePage /></Route>
                            <Route path="/login"><LoginPage /></Route></>
                        }
                      </Layout>

                    </Content>

                    <FooterNash />
                  </Layout>
                </Switch>
              </LastLocationProvider>
            </SecondHeaderContext.Provider>
          </CurrentHeaderContext.Provider>
        </CookiesProvider>
      </CurrentUserContext.Provider>

    </HashRouter>
  );
};

export default App;

