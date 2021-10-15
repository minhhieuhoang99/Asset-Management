import { useContext } from 'react';
import CurrentUserContext from '../../../Shared/Constant/Context/CurrentUserContext';
import { Layout, Form, Button, Modal, Input, DatePicker, Radio, } from "antd";
import { Row, Col } from "antd";
import { useHistory } from "react-router-dom";
import styles from './CreateAssignment.module.css'
import radio from './CreateAssignment.css';
import React, { useState, useEffect } from "react";
import { GetAllUserService } from './../../../Services/Admin/UserService';
import { GetAllAssetService } from './../../../Services/Admin/AssetService';
import { GetCategoryListService } from './../../../Services/Admin/CategoryService';
import moment from 'moment-timezone';
import { CreateAssignmentService } from "../../../Services/Admin/AssignmentService";
import SecondHeaderContext from '../../../Shared/Constant/Context/SecondHeaderContext';
const { Search } = Input;

const { Content } = Layout;

const CreateAssignment = () => {
  moment.tz.setDefault("Asian/Vientine");
  let history = useHistory();
  const dateFormat = "DD/MM/YYYY";
  const today = new Date(moment().tz("Asia/Ho_Chi_Minh"));
  const [isModalErrorVisible, setIsModalErrorVisible] = useState(false);
  function disabledDate(current) {
    return moment.tz(current, "Asia/Ho_Chi_Minh").format("YYYY/MM/DD") < moment().tz("Asia/Ho_Chi_Minh").format("YYYY/MM/DD");

  }

  const [form] = Form.useForm();

  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const handleCancel = () => {
    history.push(`/list-assignment`);
    setSecondHeader();
  };
  const onFinish = (values) => {
    console.log("values", values);

    console.log('assignmentDate', moment(values.assignmentDate));

    CreateAssignmentService({
      assetCode: values.assetCode,
      assigneeCode: values.assigneeCode,
      assignerCode: currentUser.code, // nhận userCode của admin khi admin create asm
      note: values.note,
      AsmState: 1, // state waiting
      assignmentDate: values.assignmentDate.format("MM/DD/YYYY"),
    })
      .then((res) => {
        console.log("data", res.data);
        history.push(`/list-assignment/ok/${res.data.assignmentId}`);
        setSecondHeader();
        // window.location.replace(`/list-assignment`);
      })
      .catch((err) => {
        console.log(err);
        setIsModalErrorVisible(true);
      });
  };

  const onFinishFailed = () => {
    console.log("Failed:");
  };

  // assignee Code
  const [searchUser, setSearchUser] = useState();
  const [userData, setUserData] = useState({
    id: null,
    firstName: null,
    lastName: null,
    code: null,
    type: null,
  });
  const [isModalUserVisible, setIsModalUserVisible] = useState(false);

  const [userOrder, setUserOrder] = useState({
    codeOrder: 'DESC',
    fullnameOrder: 'DESC',
    stateOrder: 'DESC',
  });

  const handleOrderUser = (evt) => {
    if (evt.currentTarget.id === 'code') {
      if (userOrder.codeOrder === 'ASC') {
        setUserOrder({ ...userOrder, codeOrder: 'DESC' });
        setSearchUser(searchUser.sort(function (a, b) {
          return (b.code).localeCompare(a.code);
        }));
      } else {
        setUserOrder({ ...assetOrder, codeOrder: 'ASC' });
        setSearchUser(searchUser.sort(function (a, b) {
          return (a.code).localeCompare(b.code);
        }));
      }
    }
    if (evt.currentTarget.id === 'name') {
      if (userOrder.fullnameOrder === 'ASC') {
        setUserOrder({ ...userOrder, fullnameOrder: 'DESC' });
        setSearchUser(searchUser.sort(function (a, b) {
          return (`${b.firstName} ${b.lastName}`).localeCompare(`${a.firstName} ${a.lastName}`);
        }));
      } else {
        setUserOrder({ ...userOrder, fullnameOrder: 'ASC' });
        setSearchUser(searchUser.sort(function (a, b) {
          return (`${a.firstName} ${a.lastName}`).localeCompare(`${b.firstName} ${b.lastName}`);
        }));
      }
    }
    if (evt.currentTarget.id === 'type') {
      if (userOrder.stateOrder === 'ASC') {
        setUserOrder({ ...userOrder, stateOrder: 'DESC' });
        setSearchUser(searchUser.sort(function (a, b) {
          return b.stateOrder - a.stateOrder
        }));
      } else {
        setUserOrder({ ...userOrder, stateOrder: 'ASC' });
        setSearchUser(searchUser.sort(function (a, b) {
          return a.stateOrder - b.stateOrder
        }));
      }
    }
  }

  const showModalUser = () => {
    GetAllUserService({}).then(function (res) {
      setUserData(res.data.filter(x => x.code !== currentUser.code));
      setSearchUser(res.data.filter(x => x.code !== currentUser.code));
      setIsModalUserVisible(true);
    })
      .catch(function (error) {
      })
  };

  const handleSearchUser = (value) => {
    console.log("value", value);
    console.log("user", userData);
    if (userData !== undefined) {
      let filterValue = value.toUpperCase().trim();
      console.log(filterValue);
      GetAllUserService().then(function (response) {
        response.data = response.data.filter(x => x.code !== currentUser.code)
        setSearchUser(response.data.filter(x => x.code.includes(value) || x.firstName.toUpperCase().includes(filterValue)
          || x.lastName.toUpperCase().includes(filterValue)));
      })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  const [valueUser, setValueUser] = useState();
  const [valueUserCode, setValueUserCode] = useState();

  const onChangeUser = e => {
    setValueUserCode(e.target.value.split(' ')[0]);
    setValueUser(e.target.value);
  };

  const handleOkUser = () => {
    setIsModalUserVisible(false);
    console.log('checked', valueUserCode);
    form.setFieldsValue({ assigneeCode: valueUserCode });
  };
  const handleModalUserCancel = () => {
    setIsModalUserVisible(false);
    setValueUser(null);
    form.setFieldsValue({ assigneeCode: null });
    if (valueUserCode === undefined || valueUserCode !== undefined) {
      form.setFields([{
        name: 'assigneeCode',
        errors: [<b style={{ color: 'red' }}>Please select user</b>],
      }])
    }
  };

  //asset Code
  const [searchAsset, setSearchAsset] = useState();
  const [assetData, setAssetData] = useState(
    {
      assetId: null,
      assetCode: null,
      assetName: null,
      categoryId: null,
    });

  const [valueAsset, setValueAsset] = useState();
  const [valueAssetCode, setValueAssetCode] = useState();

  const [isModalAssetVisible, setIsModalAssetVisible] = useState(false);
  useEffect(() => {
    GetCategoryListService().then(function (response) {
      let data = [];
      response.data.forEach(element => {
        data.push({
          label: element.categoryName,
          value: element.categoryId
        });
      });
    }).catch(function (error) {
      console.log(error);
    })
  }, []);

  const showModalAsset = (evt) => {
    GetAllAssetService({ assetId: evt.currentTarget.id }).then(function (res) {
      setAssetData(res.data.filter(x => x.state === 0));
      setSearchAsset(res.data.filter(x => x.state === 0));
      setIsModalAssetVisible(true);
    })
      .catch(function (error) {
      })
  };

  const onChangeAsset = e => {
    setValueAssetCode(e.target.value.split(' ')[0]);
    setValueAsset(e.target.value);
  };

  const handleOkAsset = () => {
    setIsModalAssetVisible(false);
    console.log('valueAssetCode ', valueAssetCode);
    form.setFieldsValue({ assetCode: valueAssetCode });

  };
  const handleModalAssetCancel = () => {
    setIsModalAssetVisible(false);
    setValueAsset(null);
    form.setFieldsValue({ assetCode: null });
    console.log(valueAssetCode)
    if (valueAssetCode === undefined || valueAssetCode !== undefined) {
      form.setFields([{
        name: 'assetCode',
        errors: [<b style={{ color: 'red' }}>Please select asset</b>],
      }])
    }
  };

  // order asset
  const [assetOrder, setAssetOrder] = useState({
    codeOrder: 'DESC',
    nameOrder: 'DESC',
    categoryOrder: 'DESC',
  });

  const handleOrderAsset = (evt) => {
    if (evt.currentTarget.id === 'assetCode') {
      if (assetOrder.idOrder === 'ASC') {
        setAssetOrder({ ...assetOrder, codeOrder: 'DESC' });
        setSearchAsset(searchAsset.sort(function (a, b) {
          return (b.assetCode).localeCompare(a.assetCode);
        }));
      } else {
        setAssetOrder({ ...assetOrder, codeOrder: 'ASC' });
        setSearchAsset(searchAsset.sort(function (a, b) {
          return (a.assetCode).localeCompare(b.assetCode);
        }));
      }
    }
    if (evt.currentTarget.id === 'assetName') {
      if (assetOrder.nameOrder === 'ASC') {
        setAssetOrder({ ...assetOrder, nameOrder: 'DESC' });
        setSearchAsset(searchAsset.sort(function (a, b) {
          return (b.assetName).localeCompare(a.assetName);
        }));
      } else {
        setAssetOrder({ ...assetOrder, nameOrder: 'ASC' });
        setSearchAsset(searchAsset.sort(function (a, b) {
          return (a.assetName).localeCompare(b.assetName);
        }));
      }
    }
    if (evt.currentTarget.id === 'category') {
      if (assetOrder.categoryOrder === 'ASC') {
        setAssetOrder({ ...assetOrder, categoryOrder: 'DESC' });
        setSearchAsset(searchAsset.sort(function (a, b) {
          return (b.category.categoryName).localeCompare(a.category.categoryName);
        }));
      } else {
        setAssetOrder({ ...assetOrder, categoryOrder: 'ASC' });
        setSearchAsset(searchAsset.sort(function (a, b) {
          return (a.category.categoryName).localeCompare(b.category.categoryName);
        }));
      }
    }
  }

  const handleSearchAsset = (value) => {
    console.log("value", value);
    console.log("asset", assetData);
    if (assetData !== undefined) {
      let filterValue = value.toUpperCase().trim();
      console.log(filterValue);
      GetAllAssetService().then(function (response) {
        response.data = response.data.filter(x => x.state === 0);
        setSearchAsset(response.data.filter(x => x.assetCode.includes(value) || x.assetName.toUpperCase().includes(filterValue)));
      })
        .catch(function (error) {
          console.log(error);
        })
    }
  }
  const { setSecondHeader } = useContext(SecondHeaderContext);

  const handleErrorCancel = () => setIsModalErrorVisible(false);

  return (
    <Content className={styles.antLayoutContent}>
      <Modal title="Error when creating" visible={isModalErrorVisible}
        onCancel={handleErrorCancel} centered={true} closable={true}
        footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }} maskClosable={true}>
        {
          <>
            <b>There are some error when creating assignment</b>
            <br />
            <b>Please choose user or asset again</b>
          </>
        }
      </Modal>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 16,
        }}
        name="validate_other"
        form={form}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <h1>Create New Assignment</h1>
        <Form.Item
          label="User"
          name="assigneeCode"
          value={setValueUser}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please input Name !",
              whitespace: true,

            },
          ]}
        >

          <Input
            style={{ width: "100%" }}
            onClick={showModalUser}
            value={valueUser}
            suffix={<i onClick={showModalUser}
              value={valueUser} class="bi bi-search"></i>}
          />
          <Modal width={550} visible={isModalUserVisible}
            closable={false}
            centered
            footer={[
              <Button key="submit" style={{ backgroundColor: "red", width: 73 }} type="primary" onClick={handleOkUser}>
                Save
              </Button>,
              <Button key="back" style={{ marginRight: 50 , width: 73}} onClick={handleModalUserCancel}>
                Cancel
              </Button>,
            ]}

          >
            <Row>
              <Col span={8} style={{ textAlign: "center", fontWeight: "bold", color: "red", margin: 20 }}>Select User</Col>
              <Col span={8} offset={4} style={{marginTop: 20 }}>
                <Search onSearch={handleSearchUser} />
              </Col>
            </Row>
            <br></br>
            <Row>
              <table style={{ width: '100%' }}>
                <thead>
                  <div style={{ marginLeft: 50 }}>
                    <tr style={{ width: '100%' }} >
                      <th className={styles.borderTable} style={{ textAlign: "left" }} onClick={handleOrderUser} id="code">Code
                        {userOrder.codeOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                      <th></th>
                      <th className={styles.borderTable} style={{ textAlign: "left" }} onClick={handleOrderUser} id="name">FullName
                        {userOrder.fullnameOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                      <th></th>
                      <th className={styles.borderTable} style={{ textAlign: "left" }} onClick={handleOrderUser} id="type">Type
                        {userOrder.stateOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                    </tr>
                  </div>
                </thead>
                <tbody className={radio}>
                  {searchUser && searchUser.length > 0 && searchUser.map(user => {
                    return <div style={{ display: 'flex' }} className={radio}>
                      <Radio.Group className={styles.radio} value={valueUser} onChange={onChangeUser} >
                        <Radio className={styles.radio} style={{ marginTop: 5 }} value={`${user.code} ${user.firstName} ${user.lastName}`}>
                        </Radio>
                      </Radio.Group>
                      <tr style={{ width: '100%' }} key={user.id}>
                        <td className={styles.borderRow} style={{ textAlign: "left" }} value={user.id}> {user.code} </td>
                        <td></td>
                        <td className={styles.borderRow} style={{ textAlign: "left" }} >{`${user.firstName} ${user.lastName}`}</td>
                        <td></td>
                        <td className={styles.borderRow} style={{ textAlign: "left" }} >{user.type === 0 ? "Admin" : "Staff"}</td>
                      </tr>
                    </div>
                  })
                  }
                </tbody>
              </table>
            </Row>
          </Modal>

        </Form.Item>
        <Form.Item
          name="assetCode"
          label="Asset"
          value={setValueAsset}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please select your Type!",
              whitespace: false,
            },
          ]}
        >

          <Input
            style={{ width: "100%" }}
            onClick={showModalAsset}
            value={valueAsset}
            suffix={<i onClick={showModalAsset}
              value={valueAsset} class="bi bi-search"></i>}
          />
          <Modal width={550} visible={isModalAssetVisible}
            closable={false}
            centered
            footer={[
              <Button key="submit" style={{ backgroundColor: "red", width: 73 }} type="primary" onClick={handleOkAsset}>
                Save
              </Button>,
              <Button key="back" style={{ marginRight: 50, width: 73 }} onClick={handleModalAssetCancel}>
                Cancel
              </Button>,
            ]}
          >
            <Row>
              <Col span={8} style={{ textAlign: "center", fontWeight: "bold", color: "red", margin: 20 }}>Select Asset</Col>
              <Col span={8} offset={4} style={{marginTop: 20 }}>
                <Search onSearch={handleSearchAsset} />
              </Col>
            </Row>
            <br></br>
            <Row>
              <table style={{ width: '100%' }}>
                <thead>
                  <div style={{ marginLeft: 50 }}>
                    <tr style={{ width: '100%' }}>
                      <th className={styles.borderTable} style={{ textAlign: "left" }} onClick={handleOrderAsset} id="assetCode">Asset Code
                        {assetOrder.codeOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                      <th></th>
                      <th className={styles.borderTable} style={{ textAlign: "left" }} onClick={handleOrderAsset} id="assetName">Asset Name
                        {assetOrder.nameOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                      <th></th>
                      <th className={styles.borderTable} style={{ textAlign: "left" }} onClick={handleOrderAsset} id="category">Category
                        {assetOrder.categoryOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                    </tr>
                  </div>
                </thead>
                <tbody >
                  {searchAsset && searchAsset.length > 0 && searchAsset.map(asset => {
                    return <div style={{ display: 'flex' }} className={radio}>
                      <Radio.Group className={styles.radio} value={valueAsset} onChange={onChangeAsset} >
                        <Radio className={styles.radio} style={{ marginTop: 5 }} value={`${asset.assetCode} ${asset.assetName}`}>
                        </Radio>
                      </Radio.Group>
                      <tr style={{ width: '100%' }} key={asset.assetId}>
                        <td className={styles.borderRow} style={{ textAlign: "left" }}  value={asset.assetId}> {asset.assetCode} </td>
                        <td></td>
                        <td className={styles.borderRow} style={{ textAlign: "left" }}  >{`${asset.assetName}`}</td>
                        <td></td>
                        <td className={styles.borderRow} style={{ textAlign: "left" }}  >{asset.category.categoryName}</td>
                      </tr>

                    </div>
                  })
                  }
                </tbody>
              </table>
            </Row>
          </Modal>

        </Form.Item>

        <Form.Item
          label="Assigned date"
          wrapperCol={{
            span: 24,
          }}

          name="assignmentDate"
          rules={[

            () => ({
              validator(_, value) {
                const dateSelect = new Date(moment(value).tz("Asia/Ho_Chi_Minh"));
                console.log(dateSelect.toDateString())
                console.log(new Date(moment().tz("Asia/Ho_Chi_Minh")).toDateString());
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
        <Form.Item name="note" label="Note"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input.TextArea isFieldsTouched={true} />
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
                  style={{width: 73}}
                  type="primary"
                  htmlType="submit"
                  disabled={
                    form.getFieldValue('assigneeCode') === undefined || form.getFieldValue('assetCode') === undefined ||
                    form.getFieldsError().filter(({ errors }) => errors.length).length > 0
                  }
                >
                  Save
                </Button>
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item>
              <Button style={{width: 73}} danger onClick={() => handleCancel()}>
                Cancel
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Content>
  );
};
export default CreateAssignment;