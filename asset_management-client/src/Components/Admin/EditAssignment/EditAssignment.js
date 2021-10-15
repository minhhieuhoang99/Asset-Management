import "antd/dist/antd.css";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { GetAllUserService } from './../../../Services/Admin/UserService';
import { GetAllAssetService } from './../../../Services/Admin/AssetService';
import { GetCategoryListService } from './../../../Services/Admin/CategoryService';
import { GetAssignmentService } from "../../../Services/Admin/AssignmentService";
import { EditAssignmentService } from "../../../Services/Admin/AssignmentService";
import CurrentUserContext from "../../../Shared/Constant/Context/CurrentUserContext"
import { Layout, Form, Button, Input, DatePicker, Select, } from "antd";
import SecondHeaderContext from "../../../Shared/Constant/Context/SecondHeaderContext"
import { Row, Col } from "antd";

import moment from 'moment-timezone';

const { Content } = Layout;
const { Option } = Select;

const EditAssignment = () => {
  const { setSecondHeader } = useContext(SecondHeaderContext);
  moment.tz.setDefault("Asian/Vientine");
  let history = useHistory();
  const dateFormat = "DD/MM/YYYY";
  const today = new Date();
  const [form] = Form.useForm();
  function disabledDate(current) {
    return moment.tz(current, "Asia/Ho_Chi_Minh").format("YYYY/MM/DD") < moment().tz("Asia/Ho_Chi_Minh").format("YYYY/MM/DD");

  }

  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const { id } = useParams();
  console.log("assignmentId:", id);

  const [assignment, setAssignment] = useState([]);
  const [assignee, setAssignee] = useState([]);

  const handleCancel = () => {
    history.push(`/list-assignment`);
    setSecondHeader();
  };

  const onFinishFailed = () => {
    console.log("Failed:");
  };

  const onFinish = (values) => {
    console.log("values", values);
    EditAssignmentService({
      assignmentId: id,
      assetCode: values.assetCode.split(' ')[0],
      assigneeCode: values.assigneeCode.split(' ')[0],
      assignerCode: currentUser.code,
      note: values.note,
      assignmentDate: values.assignmentDate.format("MM/DD/YYYY"),
    })
      .then((res) => {
        console.log("data", res.data);
        history.push(`/list-assignment/ok/${id}`);
        setSecondHeader();
      })
      .catch((err) => console.log(err));
  };



  const [userData, setUserData] = useState({
    id: null,
    firstName: null,
    lastName: null,
    code: null,
    type: null,
  });
  const [isModalUserVisible, setIsModalUserVisible] = useState(true);

  useEffect(() => {
    GetAllUserService({}).then(function (res) {
      setUserData(res.data.filter(x => x.code !== currentUser.code));
      setIsModalUserVisible(false);
    })
      .catch(function (error) {
      })
  }, [isModalUserVisible]);

  const [assetData, setAssetData] = useState(
    {
      assetId: null,
      assetCode: null,
      assetName: null,
      categoryId: null,
    });

  const [isModalAssetVisible, setIsModalAssetVisible] = useState(false);

  useEffect(() => {
    GetAllAssetService({}).then(function (res) {
      setAssetData(res.data.filter(x => x.state === 0));
      setIsModalAssetVisible(false);
    })
      .catch(function (error) {
      })
  }, [isModalAssetVisible]);

  // useEffect(() => {
  //   GetCategoryListService().then(function (response) {
  //       let data = [];
  //       response.data.forEach(element => {
  //         data.push({
  //           label: element.categoryName,
  //           value: element.categoryId
  //         });
  //       });
  //     }).catch(function (error) {
  //       console.log(error);
  //     })
  // }, []);

  console.log('assignment', assignment);
  console.log('assignmentname', assignment.assetName);
  console.log('assignerUserName', assignee.firstName + ' ' + assignee.lastName);
  console.log('assignmentDate', moment(assignment.assignmentDate));
  console.log("asset", assetData);

  form.setFieldsValue({
    assigneeCode: assignee.code + ' - ' + assignee.firstName + ' ' + assignee.lastName,
    assetCode: assignment.assetCode + ' - ' + assignment.assetName,
    note: assignment.note,
    assignmentDate: moment(assignment.assignmentDate),

  });

  useEffect(() => {
    (async () => {
      GetAssignmentService({ id })
        .then((res) => {
          setAssignment(res.data);
          setAssignee(res.data.assigneeUserName)
          console.log("data", res.data);
          console.log("user", res.data.assigneeUserName);
        })
        .catch((err) => console.log(err));
    })();
  }, [id]);

  console.log("userData", userData);

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
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <h1>Edit Assignment</h1>
        <Form.Item
          label="User"
          name="assigneeCode"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please input Name !",
            },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            hasFeedback
            showSearch
            optionFilterProp="children"
            filterSort={(optionA, optionB) =>
              optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
            }
          >
            {userData &&
              userData.length > 0 &&
              userData.map((item) => (
                <Option value={item.code} key={item.code} title={`${item.code} - ${item.userName} - ${item.firstName} ${item.lastName}`}>
                  {`${item.code} - ${item.firstName} ${item.lastName}`}
                </Option>
              ))}
          </Select>

        </Form.Item>
        <Form.Item
          name="assetCode"
          label="Asset"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please select your Type!",
            },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            hasFeedback
            showSearch
            optionFilterProp="children"
            filterSort={(optionA, optionB) =>
              optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
            }
          >
            {assetData &&
              assetData.length > 0 &&
              assetData.map((item) => (
                <Option value={item.assetCode} key={item.assetCode} title={`${item.assetCode} - ${item.assetName}`}>
                  {`${item.assetCode} - ${item.assetName}`}
                </Option>
              ))}
          </Select>

        </Form.Item>

        <Form.Item
          label="Assigned date"
          wrapperCol={{
            span: 24,
          }}

          name="assignmentDate"
          rules={[
            {
              required: true,
              message: "Please input Installed date !",
            },
            () => ({
              validator(_, value) {
                const dateSelect = new Date(moment(value).tz("Asia/Ho_Chi_Minh"));
                if (dateSelect.getDate() >= today.getDate()
                  || dateSelect.getMonth() > today.getMonth()
                  || dateSelect.getFullYear() > today.getFullYear()
                  || dateSelect.toDateString() === new Date(moment().tz("Asia/Ho_Chi_Minh")).toDateString()) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    " Select current or future date only! "
                  )
                );
              },
            }),
          ]}
        >
          <DatePicker
            utcOffset={0}
            defaultValue={moment()}
            format={dateFormat}
            disabledDate={disabledDate}
          />
        </Form.Item>


        <Form.Item name="note" label="Note">
          <Input.TextArea />
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
                  style={{
                    backgroundColor: '#CF2338',
                    color: 'white',
                    width: 73
                  }}
                  
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
              <Button
                style={{width: 73}}
                danger onClick={() => handleCancel()}>
                Cancel
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Content>
  );
};

export default EditAssignment;
