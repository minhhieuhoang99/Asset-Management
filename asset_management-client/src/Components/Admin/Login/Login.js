import "antd/dist/antd.css";
import{useContext} from"react"
import {ChangePasswordService} from '../../../Services/Admin/Authentication'
import { UnlockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Button, Checkbox,  Layout, Typography, Modal } from "antd";
import { useState } from "react";
import { LoginService } from '../../../Services/Admin/Authentication'
import styles from './Login.module.css';
import './LoginAntStyle.css';
import { useCookies } from 'react-cookie';
import Cookies from 'universal-cookie';
const { Content } = Layout;
const { Text } = Typography;
const Login = () => {
  const [currentUser, setCurrentUser] = useState();
  const [error, setError] = useState(true);
  const [userName, setUserName] = useState();
  const [password,setPassword] = useState();
  const [cookies, setCookie] = useCookies(['user']);
  const cookie = new Cookies();
  const role = cookie.get('role');
  console.log(role);
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  const onFinishFailed = (errorInfo) => {
    setError(errorInfo);
    console.log("Failed:", errorInfo);
  };
  console.log(currentUser);
  const handleChange = (e) => e.target.value && setError(false);
  const [form] = Form.useForm();
  const onFinish = (values) => {
    LoginService({ user: values.Username, password: values.Password, remember: values.Remember }).then((response) => {
     if(response.status === 200 && response.data.token !== null) {
      sessionStorage.setItem('key', '1'); 
      setCurrentUser({
        token: response.data.token,
        role: response.data.role,
        location: response.data.location,
        code: response.data.code,
        firstLogin: response.data.firstLogin,
        username: response.data.username,
      });
      form.resetFields();
      if (values.Remember === true ) {
        //cookies 
        setCookie('token', response.data.token,{maxAge :  604800}  );
        setCookie('role', response.data.role,{maxAge :  604800});
        setCookie('location', encodeURIComponent (response.data.location) ,{maxAge :  604800})
        setCookie('firstLogin', response.data.firstLogin,{maxAge :  604800});
        setCookie('code',response.data.code,{maxAge :  604800});
        setCookie('userName', response.data.userName,{maxAge :  604800});

      }else{
        setCookie('token', response.data.token);
        setCookie('role', response.data.role);
        setCookie('location', encodeURIComponent(response.data.location))
        setCookie('firstLogin', response.data.firstLogin);
        setCookie('code',response.data.code);
        setCookie('userName', response.data.userName);
      }
      window.location.replace("/");
      
    } else if(response.data.token === null){
      form.setFields([{
        name: 'Username',
        errors: [<b style={{color: 'red'}}>Couldn't find user</b> ],
      }])
    }
    }).catch((error) => { 
      form.resetFields();
      if (error.response.data === "UserName or Password is incorrect.") {
        setError('UserName or Password is incorrect');
        form.setFields([{
          name: 'Username',
          errors: [<b style={{color: 'red'}}>UserName or Password is incorrect.</b> ],
        }])
        form.setFields([{
          name: 'Password',
          errors: [<b style={{color: 'red'}}>UserName or Password is incorrect.</b> ],
        }])
      };
    })
  };

  const handleChangeUsername = (e) => {
       setUserName(e.target.value);
  }
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  }
  return (
  
  <Content className={styles.antLayoutContent}>
    <div className = {"div-login"}  >
      <h1 style={{ textAlign: 'center' }}>Login </h1>
      <Form
        form={form}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          style={{width:'70%',marginLeft:'15%', textAlign:'center',justifyContent: 'center'}}
          name="Username"
          value = {setUserName}
          rules={[
            {
              required: true,
              message: "Please input your Username!",
              whitespace: false
            },
          ]}
        >
          <Input placeholder="User Name" value={userName} onChange={handleChangeUsername} prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          style={{width:'70%',marginLeft:'15%', textAlign:'center',justifyContent: 'center'}}

          name="Password"
          values={setPassword}
          rules={[
            {
              required: true,
              message: "Please input your password!",
              whitespace : false
            },
          ]}
        >
          <Input.Password
           placeholder="Password" 
          onChange = {handleChangePassword}
            value = {password}
            prefix={<UnlockOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="Remember"
          valuePropName="checked"
          style = {{marginRight:'10%'}}
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Checkbox  ><Text style={{ color: 'red' }} strong>Remember me</Text></Checkbox>
        </Form.Item>

        <Form.Item
        style={{ textAlign: 'center' }}
    
        >
          <Button 
          disabled={
            (form.getFieldValue('Username') === undefined || form.getFieldValue('Username') === '')
            || (form.getFieldValue('Password') === undefined || form.getFieldValue('Password') === '')
            ||form.getFieldsError().filter(({ errors }) => errors.length).length > 0
          }
          
          className = {styles.create}
           htmlType="submit">
            Login
              </Button>
        </Form.Item>
        
      </Form>
    </div>
  </Content>)
}
export default Login;