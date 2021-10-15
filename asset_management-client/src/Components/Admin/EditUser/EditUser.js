import "antd/dist/antd.css";
import "./EditUser.js";
import { useEffect, useState , useContext} from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { EditUserService } from "../../../Services/Admin/UserService";
import { GetUserService } from "../../../Services/Admin/UserService";
import { Layout, Form, Button, Select, Input, DatePicker, Radio,Modal } from "antd";
import moment from "moment";
import { Row, Col } from "antd";
import CurrentUserContext from "../../../Shared/Constant/Context/CurrentUserContext"
import SecondHeaderContext from "../../../Shared/Constant/Context/SecondHeaderContext"
const { Option } = Select;
const { Content } = Layout;

const EditUser = () => {
  const { setSecondHeader } = useContext(SecondHeaderContext);
  const {currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [isFirstLog,setIsFirstLog] = useState(false);
  let history = useHistory();
  const [form] = Form.useForm();
  const { code } = useParams();
  const [user, setUser] = useState([]);
   
  const handleCancel = () => {
    history.push(`/list-user`);
    setSecondHeader();
  };

  const onFinishFailed = () => {
    console.log("Failed:");
  };

  const onFinish = (data) => {
    EditUserService({
      code: code,
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      joinDate: data.joinDate,
      location: data.location,
      gender: data.gender,
      userName: data.userName,
      type: data.type,
    })
      .then((res) => {
        console.log("onFinish");
        history.push(`/list-user/ok`);
        setSecondHeader();
      })
      .catch(function (error) {
        setIsFirstLog(true);
        console.log(error);
      })
  };
  const handleEditFalseCancel = () => {
    setIsFirstLog(false);
  };
  const dateFormat = "DD/MM/YYYY";
  form.setFieldsValue({
    firstName: user.firstName,
    lastName: user.lastName,
    dob: moment(user.dob),
    gender: user.gender,
    joinDate: moment(user.joinDate),
    type: user.type,
  });

  useEffect(() => {
    (async () => {
      GetUserService({ code })
        .then((res) => {
          setUser(res.data);
          console.log("data", res.data);
        })
        .catch((err) => console.log(err));
    })();
  }, [code]);

  console.log("user", user);
  return (
    <Content>
        <Modal title="Can't edit user" visible={isFirstLog}
            onCancel={handleEditFalseCancel} centered={true}
            footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }}>
            <b style={{ marginLeft: '12%' }}>User need to complete "First login process" to edit role</b>
          </Modal>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 16,
        }}
        form={form}
        name="validate_other"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <h1>Edit User</h1>
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: "Please input First Name !",
              whitespace: true,
            },
          ]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: "Please input Last Name !",
              whitespace: true,
            },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          wrapperCol={{
            span: 24,
          }}
          name="dob"
          rules={[
            {
              required: true,
              message: "Please input Date of Birth !",
            },
            () => ({
              validator(_, value) {
                var today = new Date();
                console.log(value.year());
                var temp = today.getFullYear() - value.year();
                if (temp > 18) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("User is under 18. Please select a different date")
                );
              },
            }),
          ]}
        >
          <DatePicker placeholder={'DD/MM/YYYY'} format={dateFormat} />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Gender"
          rules={[
            {
              required: true,
              message: "Please select your Type!",
            },
          ]}
        >
          <Radio.Group>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Joined Date"
          wrapperCol={{
            span: 24,
          }}
          name="joinDate"
          rules={[
            {
              required: true,
              message: "Please input Joined Date !",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue("dob") < value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error(
                    "Joined date is not later than Date of Birth. Please select a different date"
                  )
                );
              },
            }),
            () => ({
              validator(_, value) {
                if (value.day() === 0 || value.day() === 6) {
                  return Promise.reject(
                    new Error(
                      "Joined date is Saturday or Sunday. Please select a different date"
                    )
                  );
                }
                return Promise.resolve();
              },
            }),
            // () => ({
            //   validator(_, value) {
            //     var today = new Date();
            //     console.log(value.year());
            //     var temp = today.getFullYear() - value.year();
            //     if (temp > 18) {
            //       return Promise.resolve();
            //     }
            //     return Promise.reject(
            //       new Error("Joined date ( User is still under 18). Please select a different date")
            //     );
            //   },
            // }),
          ]}
        >
          <DatePicker placeholder={'DD/MM/YYYY'} format={dateFormat} />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please select your Type!",
            },
          ]}
        >
          <Select placeholder="Please select a Type">
            <Option value={0}>Admin</Option>
            <Option value={1}>Staff</Option>
          </Select>
        </Form.Item>

        <Row>
          <Col span={18}>
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
          </Col>
          <Col span={6}>
            <Form.Item>
              <Button danger onClick={() => handleCancel()}>
                Cancel
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Content>
  );
};

export default EditUser;
