import "antd/dist/antd.css";
import { useEffect, useState ,useContext} from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { GetAssetService } from "../../../Services/Admin/AssetService";
import { EditAssetService } from "../../../Services/Admin/AssetService";
import SecondHeaderContext from "../../../Shared/Constant/Context/SecondHeaderContext"
import { Layout, Form, Button, Select, Input, DatePicker, Radio } from "antd";
import moment from "moment";
import { Row, Col } from "antd";
const { Option } = Select;
const { Content } = Layout;

const EditUser = () => {
  let history = useHistory();
  const [form] = Form.useForm();
  const { setSecondHeader } = useContext(SecondHeaderContext);
  const { code } = useParams();
  const [asset, setAsset] = useState([]);
  const [category, setCategory] = useState([]);
  const handleCancel = () => {
    history.push(`/list-asset`);
    setSecondHeader();
  };

  const onFinishFailed = () => {
    console.log("Failed:");
  };
  const onFinish = (data) => {
    EditAssetService({
      assetId: 0,
      assetCode: code,
      assetName: data.assetName,
      specification: data.specification,
      categoryId: data.categoryId,
      installedDate: data.installedDate,
      state: data.state,
      location: "",
    })
      .then((res) => {
        console.log("onFinish");
        history.push(`/list-asset/ok`);
        setSecondHeader();
      })
      .catch((err) => console.log(err));
  };
  //  useEffect(() => {
  //     GetUserService(code)
  //     .then( (response)=>
  //     {
  //       setUser(response.data);
  //       console.log("response", response.data);
  //       console.log("data user", user);
  //       // handle success
  //       // history.push(`/books`);
  //     })
  //     .catch((error)=>{
  //       // handle error
  //       console.log(error);
  //     })
  //   }, [code]);

  console.log("category", category);
  const dateFormat = "DD/MM/YYYY";
  form.setFieldsValue({
    assetName: asset.assetName,
    specification: asset.specification,
    categoryId: asset.categoryId,
    installedDate: moment(asset.installedDate),
    state: asset.state,
    categoryName: category.categoryName,
  });

  useEffect(() => {
    (async () => {
      GetAssetService({ code })
        .then((res) => {
          setAsset(res.data);
          setCategory(res.data.category);
          console.log("data", res.data);
        })
        .catch((err) => console.log(err));
    })();
  }, [code]);

  console.log("asset", asset);
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
        <h1> Edit New Asset </h1>
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
          name="categoryName"
          label="Category Name"
          rules={[
            {
              required: true,
              message: "Please select your Type!",
            },
          ]}
        >
          <Select disabled placeholder="Please select a Type">
            {asset &&
              asset.length > 0 &&
              asset.map((item) => <Option> {item.category} </Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          style={{ display: "none" }}
          name="categoryId"
          label="Category Id"
          rules={[
            {
              required: true,
              message: "Please select your Type!",
            },
          ]}
        >
          <Select disabled placeholder="Please select a Type">
            <Option> </Option>
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
          <DatePicker placeholder={'DD/MM/YYYY'} format={dateFormat} />
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
            <Radio value={0}> Available </Radio>
            <Radio value={1}> Not available </Radio>
            <Radio value={3}> Waiting For Recycling </Radio>
            <Radio value={4}> Recycled </Radio>
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

export default EditUser;
