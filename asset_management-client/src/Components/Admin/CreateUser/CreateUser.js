import "antd/dist/antd.css";
import "./CreateUser.css";
import moment from "moment-timezone";
import { useState, useContext } from 'react'
import { useHistory } from "react-router-dom";
import { CreateUserService } from "../../../Services/Admin/UserService";
import { Layout, Form, Button, Select, Input, DatePicker, Radio } from "antd";
import { Row, Col } from "antd";
import CurrentUserContext from '../../../Shared/Constant/Context/CurrentUserContext';
import SecondHeaderContext from '../../../Shared/Constant/Context/SecondHeaderContext'
const { Option } = Select;
const { Content } = Layout;
const CreateUser = () => {
  const { setSecondHeader } = useContext(SecondHeaderContext);
  const dateFormat = "DD/MM/YYYY";
  let history = useHistory();
  const [form] = Form.useForm();
  const onFinishFailed = () => {
    console.log("Failed:");
  };
  const handleCancel = () => {
    history.push(`/list-user`);
    setSecondHeader();
  };
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [joinDate, setJoinDate] = useState([]);
  const [dob, setDob] = useState([]);
  const onFinish = (values) => {
    var jDate =moment.tz(joinDate,"Asia/Ho_Chi_Minh").format("MM/DD/YYYY");
    jDate = new Date(jDate).toDateString();
    console.log(moment.tz(joinDate,"Asia/Ho_Chi_Minh"));
    console.log(jDate);
    var dobDate =moment.tz(dob,"Asia/Ho_Chi_Minh").format("MM/DD/YYYY");
    dobDate = new Date(dobDate).toDateString();
    console.log(moment.tz(dob,"Asia/Ho_Chi_Minh"));
    console.log(dobDate);
    CreateUserService({
      firstName: values.firstName.split(' ').join(''),
      lastName: values.lastName,
      dob: dobDate,
      joinDate: jDate,
      gender: values.gender,
      type: values.type,
      location: currentUser.location,
      code: "null",
      userName: "null",
    }).then(function (response) {
      console.log(response);
      setSecondHeader();
      history.push(`/list-user/ok/${response.data.code}`);
    });
  };
  return (
    <Content>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 16,
        }}
        name="validate_other"
        // initialValues={{
        //   "input-number": 3,
        //   "checkbox-group": ["A", "B"],
        //   rate: 3.5,
        // }}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <h1>Create New User</h1>
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: "First name is required. Please input First Name!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: " Last Name is required. Please input Last Name!",
              whitespace: true,
            },
          ]}
        >
          <Input />
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
              message: "Date of Birth is required. Should be a valid date in dd/mm/yyyy format",
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
          <DatePicker onChange={(newValue) => {setDob(newValue)}} placeholder={'DD/MM/YYYY'} format={dateFormat} />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Gender"
          rules={[
            {
              required: true,
              message: "Gender is required. Please select your Gender! ",
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
              message: "Joined Date is required. Should be a valid date in dd/mm/yyyy format",
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
            //       new Error("Can't join if user is under 18. Please select a different date")
            //     );
            //   },
            // }),
          ]}
        >
          <DatePicker onChange={(newValue) => {setJoinDate(newValue)}} placeholder={'DD/MM/YYYY'} format={dateFormat} />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Type is required. Please select your Type",
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

export default CreateUser;
