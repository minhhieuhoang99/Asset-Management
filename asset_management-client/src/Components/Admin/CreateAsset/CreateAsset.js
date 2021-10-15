import {
  Layout,
  Form,
  Button,
  Select,
  Input,
  DatePicker,
  Radio,
  Divider,
} from "antd";
import moment from "moment-timezone";
import { Row, Col } from "antd";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../../../Shared/Constant/Context/CurrentUserContext"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CreateCategoryService } from "../../../Services/Admin/CategoryService";
import { GetCategoryListService } from "../../../Services/Admin/CategoryService";
import { CreateAssetService } from "../../../Services/Admin/AssetService";
import { CloseSquareOutlined, CheckSquareOutlined } from "@ant-design/icons";
import SecondHeaderContext from "../../../Shared/Constant/Context/SecondHeaderContext"
const { Content } = Layout;
const { Option } = Select;
const CreateAsset = () => {
  let history = useHistory();
  const dateFormat = "DD/MM/YYYY";
  const [visible, setVisible] = useState(false);
  const [change, setChange] = useState(true);
  // const [CategoryID, setCategoryID] = useState();
  const [categoryData, setCategoryData] = useState();
  const [form] = Form.useForm();
  // form.setFieldsValue({
  //   assetName: "Name Demo",
  // });
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { setSecondHeader } = useContext(SecondHeaderContext);
  const [categoryName, setCategoryName] = useState();
  const [categoryPrefix, setCategoryPrefix] = useState();
  const onCategoryNameChange = (event) => {
    setCategoryName(event.target.value);
  };
  const onCategoryPrefixChange = (event) => {
    setCategoryPrefix(event.target.value.split(' ').join(''));
  };

  // const addItem = () => {
  //   console.log('addItem');
  //   const { items, name, name1 } = this.state;
  //   this.setState({
  //     items: [...items, name || `New item ${index++}`],
  //     name: ''
  //   });
  // };

  const createCategory = () => {
    CreateCategoryService({
      categoryName: categoryName,
      categoryPrefix: categoryPrefix,
    })
      .then((res) => {
        console.log("data", res.data);

        // form.setFieldsValue({
        //   categoryId: result.categoryId,
        //   });
        setVisible(true);
      })
      .catch((err) => console.log(err));
  };

  const handleCancel = () => {
    history.push(`/list-asset`);
    setSecondHeader();
  };
  const handleChangeFalse = () => {
    setChange(false);
  };
  const handleChangeTrue = () => {
    setChange(true);
  };
  const [installedDate, setInstalledDate] = useState([]);
  const onFinish = (values) => {
    console.log(values);
    var iDate =moment.tz(installedDate,"Asia/Ho_Chi_Minh").format("MM/DD/YYYY");
    iDate = new Date(iDate).toDateString();
    console.log(moment.tz(installedDate,"Asia/Ho_Chi_Minh"));
    console.log(iDate);
    CreateAssetService({
      assetId: 0,
      assetCode: "null",
      assetName: values.assetName,
      specification: values.specification,
      categoryId: values.categoryId,
      location: currentUser.location,
      installedDate: iDate,
      state: values.state,
    })
      .then((res) => {
        console.log("data", res.data);
        history.push(`/list-asset/ok/${res.data.assetCode}`);
        setSecondHeader();
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = () => {
    console.log("Failed:");
  };

  useEffect(() => {
    (async () => {
      GetCategoryListService({
      })
        .then((res) => {
          setCategoryData(res.data);
          setVisible(false);
        })
        .catch((err) => console.log(err));
    })();
  }, [visible]);
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
        <h1>Create New Asset</h1>
        <Form.Item
          label="Name"
          name="assetName"
          rules={[
            {
              required: true,
              message: "Please input Name !",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Category"
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
            placeholder="Choose the category"
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                {!change ? (
                  <Button
                    onClick={handleChangeTrue}
                    style={{ paddingLeft: "10px" }}
                  >
                    Create New Category{" "}
                  </Button>
                ) : (
                  <div
                    style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}
                  >
                    <Form>
                      <Row>
                        <Col span={10}>
                          <Form.Item label="categoryName">
                            <Input
                              style={{ flex: "auto" }}
                              value={categoryName}
                              onChange={onCategoryNameChange}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item                   
                            label="categoryPrefix">
                            <Input
                              style={{ flex: "auto" }}
                              value={categoryPrefix}
                              onChange={onCategoryPrefixChange}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Form.Item>
                            <Link
                              style={{
                                flex: "none",
                                padding: "8px",
                                display: "block",
                                cursor: "pointer",
                              }}
                              onClick={createCategory}
                            >
                              <CheckSquareOutlined />
                            </Link>
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Form.Item>
                            {" "}
                            <Link
                              style={{
                                flex: "none",
                                padding: "8px",
                                display: "block",
                                cursor: "pointer",
                              }}
                              onClick={handleChangeFalse}
                            >
                              <CloseSquareOutlined />
                            </Link>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                )}
              </div>
            )}
          >
            {categoryData &&
              categoryData.length > 0 &&
              categoryData.map((item) => (
                <Option value={item.categoryId} key={item.categoryId}>
                  {item.categoryName}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Installed date"
          wrapperCol={{
            span: 24,
          }}
          name="installedDate"
          rules={[
            {
              required: true,
              message: "Please input Installed date !",
            },
          ]}
        >
          <DatePicker onChange={(newValue) => {setInstalledDate(newValue)}} placeholder={'DD/MM/YYYY'} format={dateFormat} />
        </Form.Item>
        <Form.Item name="specification" label="Specification">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="state"
          label="State"
          rules={[
            {
              required: true,
              message: "Please select your State!",
            },
          ]}
        >
          <Radio.Group>
            <Radio value={0}>Available</Radio>
            <Radio value={1}>Not available</Radio>
          </Radio.Group>
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
                    form.getFieldValue('assetName') === undefined || form.getFieldValue('categoryId') === undefined ||form.getFieldValue('installedDate') === undefined ||form.getFieldValue('state') === undefined ||
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
export default CreateAsset;
