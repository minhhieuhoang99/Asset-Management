import { Breadcrumb, Layout, Button, Modal, Form, Input, Menu, Dropdown } from "antd";
import "antd/dist/antd.css";
import "./Header.css";
import { Link, useHistory } from "react-router-dom";
import { useState,useContext } from "react";
import CurrentUserContext from '../../Shared/Constant/Context/CurrentUserContext';
import CurrentHeaderContext from "../../Shared/Constant/Context/CurrentHeaderContext";
import SecondHeaderContext from "../../Shared/Constant/Context/SecondHeaderContext";
import { ChangePasswordService } from '../../Services/Admin/Authentication'
import { UnlockOutlined } from "@ant-design/icons";
import { DownOutlined } from '@ant-design/icons';
import styles from './Header.module.css'
import Cookies from 'universal-cookie';
const { Header } = Layout;
const HeaderNash = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const {currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { currentHeader ,setCurrentHeader} = useContext(CurrentHeaderContext);
  const { secondHeader } = useContext(SecondHeaderContext);
  console.log(currentUser.location);
  console.log(currentUser.role)
  const cookies = new Cookies();
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  const [isModalLogoutVisible,setIsModalLogoutVisible] = useState(false);
  //Modal for changePassword
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalSuccessVisible, setIsModalSuccesVisible] = useState();
  const showModalChangePassword = () => {
    setIsModalVisible(true);
  }
  const [error, setError] = useState(true);
  const handleChange = (e) => e.target.value && setError(false);
  const handleOk = (values) => {
    ChangePasswordService({
      userCode: currentUser.code,
      oldPassword: values.OldPassword,
      newPassword: values.NewPassword
    })
      .then(function (response) {
        form.resetFields();
        setIsModalVisible(false);
        setIsModalSuccesVisible(true);
        handleLogoutOk();
        history.push('/login')
      }).catch(function (error) {
        if (error.response.data == "Password is incorrect") {
          setError('Old password is incorrect!');
          form.setFields([{
            name: 'OldPassword',
            errors: [<b style={{ color: 'red' }}>Old password is incorrect!</b>],
          }])
        };
      })
  }


  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };
  const handleClose = () => {
    setIsModalSuccesVisible(false);
  }
  const showLogOutModal = () => {
    setIsModalLogoutVisible(true);
  };
  const handleLogoutOk = () => {
    sessionStorage.removeItem('key');
    setCurrentUser({
      token: null,
      role: null,
      location: null,
      code: null,
      firstLogin: null,
      user: null
    });
    history.push('/login')
    cookies.remove('token');
    cookies.remove('code');
    cookies.remove('userName');
    cookies.remove('role');
    cookies.remove('token');
    cookies.remove('firstLogin');
    cookies.remove('location');
    setCurrentHeader("Home");
    console.log(currentUser)
    setIsModalLogoutVisible(false);
  }

  const handleLogoutCancel = () =>{
    setIsModalLogoutVisible(false);
  }
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <b><Link style={{ color: 'red' }} onClick={showModalChangePassword}>Change Password</Link></b>
      </Menu.Item>
      <Menu.Item key="1">
       <b><Link style={{ color: 'red' }} onClick={showLogOutModal}>Logout</Link></b>
      </Menu.Item>
    </Menu>
  ); 

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <Header className="header">
        <Modal title="Change Password" visible={isModalSuccessVisible} onCancel={handleClose} footer={null}>
          <>
          <b style={{marginLeft:"17%"}}>Your password has been changed successfully</b>
            <br />
            <br />
            <div className={styles.buttonGroup}>
              <Button style={{ marginLeft: "42%" }} className={styles.cancelButton} onClick={handleClose}>Close</Button>
            </div>
          </>
        </Modal>
        <Modal title="Are you sure?" visible={isModalLogoutVisible}
            onOk={handleLogoutOk} onCancel={handleLogoutCancel} centered={true} 
            footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }}>
            {
              <>
                <b style={{ marginLeft:'32%'}}>Do you want to log out?</b>
                <br />
                <br />
                <div className={styles.buttonGroup}>
                  <Button className={styles.create} 
                  style={{marginLeft: '25%',paddingLeft: '10px',paddingRight: '10px'}}
                  onClick={handleLogoutOk }>Log out</Button>
                  <Button className={styles.cancelButton} 
                  style={{  marginLeft: '20%'}}
                  onClick={handleLogoutCancel}>Cancel</Button>
                </div>
              </>
            }
          </Modal>
    <Modal title="Change Password" visible={isModalVisible} onOk={handleOk} closable={false} onCancel={handleCancel} centered={true}
      footer={null}>
      <Form
        form={form}
        wrapperCol={{
          span: 20,
        }}
        onFinish={handleOk}
        onFinishFailed={handleCancel}
      >
        <Form.Item
         style={{ textAlign: 'center', justifyContent: 'center'}}
          name="OldPassword"
          values="OldPassword"
          validateStatus={handleOk !== 'Password is incorrect' ? 'success' : 'Old Password is incorrect'}
          rules={[
            {
              required: true,
              message: "Please input your Old Password",
            },
          ]}

            >
              <Input.Password
                placeholder = "Old Password"
                onChange={handleChange}
                prefix={<UnlockOutlined />} />
            </Form.Item>

            <Form.Item
             style={{ textAlign: 'center', justifyContent: 'center'}}
              name="NewPassword"
              values="NewPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your New Password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue("OldPassword") !== value) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error(
                          "New Password and Old Password must not match!"
                        )
                      )
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
                          "Require lowercase , uppercase , numeric and special Character and at least 8 Characters"
                        )
                      );
                    }
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder = "New Password"
                prefix={<UnlockOutlined />}
              />
            </Form.Item>
            <Button onClick={handleCancel} 
            style={{ marginRight:'25%',marginLeft: '20%', color: "black", float: "right" }}>Cancel</Button>
            <Form.Item
              shouldUpdate
              className="submit"
              wrapperCol={{
                span: 16,
                offset: 21,
              }}
            >
              {() => (
                <Button
                  style={{ marginRight: '40%',paddingLeft: '20px', paddingRight: '20px', backgroundColor: "red", color: "white", float: "right" }}
                  danger
                  type="primary"
                  htmlType="submit"
                  disabled={
                    !form.isFieldsTouched(true) ||
                    form.getFieldsError().filter(({ errors }) => errors.length)
                      .length > 0
                  }
                >
                  Save
                </Button>
              )}
            </Form.Item>
          </Form>
        </Modal>

        <div className="logo" />
        <Breadcrumb>
          <Breadcrumb.Item>{currentHeader}</Breadcrumb.Item>
          <Breadcrumb.Item>{secondHeader}</Breadcrumb.Item>
          <Breadcrumb.Item style={{ float: 'right' }}>
            {currentUser.role ===null || currentUser.role === undefined?
              <Breadcrumb.Item ><Link style={{ color: 'white' }} to='/login'>Login</Link></Breadcrumb.Item>
              : <Dropdown overlay={menu}>
                <Breadcrumb.Item className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  Welcome {currentUser.user} <DownOutlined />
                </Breadcrumb.Item>
              </Dropdown>
            }
          </Breadcrumb.Item>
        </Breadcrumb>
      </Header>
    </CurrentUserContext.Provider>
  )
};

export default HeaderNash;