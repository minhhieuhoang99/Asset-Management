import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Input, Button, Layout, Pagination, Modal } from 'antd';
import { FilterFilled } from '@ant-design/icons';
import styles from './UserList.module.css'
import './UserListAntStyle.css'
import { DisableUserService, GetAllUserService, GetListUserService, GetUserService } from './../../../Services/Admin/UserService';
import UserConstant from '../../../Shared/Constant/UserConstant';
import { Link, useLocation } from "react-router-dom";
import { useLastLocation } from 'react-router-last-location';
import { Select } from 'antd';
import SecondHeaderContext from '../../../Shared/Constant/Context/SecondHeaderContext'
const { Search } = Input;
const { Content } = Layout;
function itemRender(current, type, originalElement) {
  if (type === 'prev') {
    return <Button size="small" style={{ fontSize: '14px', marginRight: '10px' }} >Previous</Button>;
  }
  if (type === 'next') {
    return <Button size="small" style={{ fontSize: '14px', marginLeft: '8px', marginRight: '10px' }}>Next</Button>;
  }
  return originalElement;
}
const options = [{ label: 'Admin', value: 0 }, { label: 'Staff', value: 1 }];

const UserList = () => {
  const { setSecondHeader } = useContext(SecondHeaderContext);
  const [value, setValue] = useState([]);
  const location = useLocation();
  const lastLocation = useLastLocation();
  const [modeOrder, setModeOrder] = useState({
    idOrder: 'DESC',
    nameOrder: 'DESC',
    dateOrder: 'DESC',
    typeOrder: 'DESC',
  });
  const [searchUser, setSearchUser] = useState();
  const [pageIndex, setPageIndex] = useState(UserConstant.PageIndexDefault);
  const [pageSizeOld, setPageSizeOld] = useState(UserConstant.PageSizeDefault);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDisableVisible, setIsModalDisableVisible] = useState(false);
  const [searchValue, setsearchValue] = useState('');
  const [user, setUser] = useState({
    firstName: null,
    lastName: null,
    dob: null,
    gender: null,
    location: null,
    code: null,
    username: null,
    type: null,
  });
  const [total, setTotal] = useState(0);

  const selectProps = {
    suffixIcon: <FilterFilled />,
    style: {
      width: '100%',
    },
    mode: 'multiple',
    value,
    options,
    onChange: (newValue) => {
      setValue(newValue);
    },
    placeholder: 'Type',
    maxTagCount: 'responsive',
    showArrow: true,
    optionFilterProp: 'label'
  };

  useEffect(() => {
    if (value.length === 0 && total !== 0) {
      GetListUserService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
        // handle success
        response.data.items.sort(function (a, b) {
          return (`${a.firstName} ${a.lastName}`).localeCompare(`${b.firstName} ${b.lastName}`);
        })
        setSearchUser(response.data);
      })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
    else if (value.length !== 0) {
      GetAllUserService().then(function (response) {
        // handle success
        let data = response.data.filter(x => x.isDisabled === true && value.includes(x.type));
        setSearchUser({ ...searchUser, items: data.slice((pageIndex - 1) * pageSizeOld, pageIndex * pageSizeOld) });
        setTotal(data);
      })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
  }, [value]);

  const showModal = (evt) => {
    GetUserService({ code: evt.currentTarget.id }).then(function (response) {
      // handle success
      response.data.dob = `${response.data.dob.substring(8, 10)}/${response.data.dob.substring(5, 7)}/${response.data.dob.substring(0, 4)}`;
      response.data.type = response.data.type === 0 ? 'Admin' : 'Staff';
      setUser(response.data);
      setIsModalVisible(true);
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  };

  const handleDisableOk = () => {
    DisableUserService({ code: user.code }).then(function (response) {
      // handle success
      if (response.status === 200) {
        setSearchUser({ ...searchUser, items: searchUser.items.filter(x => x.code !== user.code) })
        setIsModalDisableVisible(false);
      }
    })
      .catch(function (error) {
        // handle error
        console.log(error);
        setIsModalDisableVisible(false);
      })
  }

  const handleDisableCancel = () => {
    setIsModalDisableVisible(false);
  }

  const showModalDisable = evt => {
    GetUserService({ code: evt.currentTarget.id }).then(function (response) {
      // handle success
      if (response.data.assignmentList === undefined) {
        setUser(response.data);
      }
      else {
        var hasValidAssign = response.data.assignmentList.find(e =>
          e.asmState !== 2 && e.returnState !== 2);
        console.log(hasValidAssign);
        if (hasValidAssign === undefined) {
          setUser(response.data);
        }
        else {
          setUser(null);
        }
      }
      setIsModalDisableVisible(true);
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    let didCancel = false;
    if (value.length !== 0 || searchValue !== '') {
      setSearchUser({ ...searchUser, items: total.slice((pageIndex - 1) * pageSizeOld, pageIndex * pageSizeOld) });
    } else {
      GetListUserService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
        // handle success
        if (!didCancel) {
          if (lastLocation !== null && location.pathname.includes('/list-user/ok')) {
            if (lastLocation.pathname === '/create') {
              GetUserService({ code: location.pathname.split('/')[3] }).then(function (res) {
                // handle success
                response.data.items = response.data.items.filter(x => x.code !== res.data.code);
                if (pageIndex === 1) {
                  response.data.items.unshift(res.data);
                }
                setSearchUser(response.data);
              })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })

            } else if (lastLocation.pathname.includes('/edit/')) {
              GetUserService({ code: lastLocation.pathname.substring(6, lastLocation.pathname.length) }).then(function (res) {
                // handle success
                response.data.items = response.data.items.filter(x => x.code !== res.data.code);
                if (pageIndex === 1) {
                  response.data.items.unshift(res.data);
                }
                setSearchUser(response.data);
              })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })
            }
            setTotal(0);
          }
          else {
            response.data.items.sort(function (a, b) {
              return (`${a.firstName} ${a.lastName}`).localeCompare(`${b.firstName} ${b.lastName}`);
            });
            setSearchUser(response.data);
          }
        }
      })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
    return () => didCancel = true
  }, [pageSizeOld, pageIndex, lastLocation, location.pathname]);

  const handleChangePage = (page, pageSize) => {
    if (page !== pageIndex) {
      setPageIndex(page);
    }
    if (pageSize !== pageSizeOld) {
      setPageSizeOld(pageSize);
    }
  }

  const handleOrder = (evt) => {
    if (evt.currentTarget.id === 'id') {
      if (modeOrder.idOrder === 'ASC') {
        setModeOrder({ ...modeOrder, idOrder: 'DESC' });
        setSearchUser({
          ...searchUser, items: searchUser.items.sort(function (a, b) {
            return (b.code).localeCompare(a.code);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, idOrder: 'ASC' });
        setSearchUser({
          ...searchUser, items: searchUser.items.sort(function (a, b) {
            return (a.code).localeCompare(b.code);
          })
        });
      }
    }
    if (evt.currentTarget.id === 'name') {
      if (modeOrder.nameOrder === 'ASC') {
        setModeOrder({ ...modeOrder, nameOrder: 'DESC' });
        setSearchUser({
          ...searchUser, items: searchUser.items.sort(function (a, b) {
            return (`${b.firstName} ${b.lastName}`).localeCompare(`${a.firstName} ${a.lastName}`);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, nameOrder: 'ASC' });
        setSearchUser({
          ...searchUser, items: searchUser.items.sort(function (a, b) {
            return (`${a.firstName} ${a.lastName}`).localeCompare(`${b.firstName} ${b.lastName}`);
          })
        });
      }
    }
    if (evt.currentTarget.id === 'date') {
      searchUser.items.map(x => x.date = new Date(`${x.joinDate.substring(5, 7)},${x.joinDate.substring(8, 10)},${x.joinDate.substring(0, 4)}`));
      if (modeOrder.dateOrder === 'ASC') {
        setModeOrder({ ...modeOrder, dateOrder: 'DESC' });
        setSearchUser({
          ...searchUser, items: searchUser.items.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, dateOrder: 'ASC' });
        setSearchUser({
          ...searchUser, items: searchUser.items.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
          })
        });
      }
    }
    if (evt.currentTarget.id === 'type') {
      if (modeOrder.typeOrder === 'ASC') {
        setModeOrder({ ...modeOrder, typeOrder: 'DESC' });
        setSearchUser({
          ...searchUser, items: searchUser.items.sort(function (a, b) {
            return b.type - a.type;
          })
        });
      } else {
        setModeOrder({ ...modeOrder, typeOrder: 'ASC' });
        setSearchUser({
          ...searchUser, items: searchUser.items.sort(function (a, b) {
            return a.type - b.type;
          })
        });
      }
    }
  }

  const handleSearch = (value) => {
    if (value !== '') {
      let filterValue = value.toUpperCase().trim();
      GetAllUserService().then(function (response) {
        // handle success
        let data = response.data.filter(x => x.isDisabled === true && (x.code.toUpperCase().includes(value)
          || x.firstName.toUpperCase().includes(filterValue) || x.lastName.toUpperCase().includes(filterValue)));
        setSearchUser({ ...searchUser, items: data.slice((pageIndex - 1) * pageSizeOld, pageIndex * pageSizeOld) });
        setTotal(data);
        setsearchValue(filterValue);
      })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    } else {
      console.log(value === '')
      GetListUserService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
        // handle success
        response.data.items.sort(function (a, b) {
          return (`${a.firstName} ${a.lastName}`).localeCompare(`${b.firstName} ${b.lastName}`);
        })
        setSearchUser(response.data);
        setsearchValue('');
      })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
  }
  const CreateUser = () => {
    setSecondHeader("Create-User");
  }
  const EditUser = () => {
    setSecondHeader("Edit-User");
  }
  return (
    <Content className={styles.antLayoutContent}>
      <Row>
        <h2 className={styles.title}>User List</h2>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
        <Col span={5}>
          <Select {...selectProps} />
        </Col>
        <Col span={10}>
          <Search onSearch={handleSearch} />
        </Col>
        <Col span={4}></Col>
        <Col span={5}>
          <Button className={styles.create}>
            <Link onClick={CreateUser} to='/create'>Create new user</Link>
          </Button>
        </Col>
      </Row>
      <br />
      {searchUser !== undefined ?
        <>
          {user !== null ?
            <Modal width={350} title="User Information" visible={isModalVisible} footer={null} onCancel={handleCancel} centered={true}>
              <table className={styles.tableModal}>
                <tr>
                  <td>User Name :</td>
                  <td>{user.userName}</td>
                </tr>
                <tr>
                  <td>Full Name :</td>
                  <td> {`${user.firstName} ${user.lastName}`}</td>
                </tr>
                <tr>
                  <td>User Location :</td>
                  <td>{user.location}</td>
                </tr>
                <tr>
                  <td>User BirthDay :</td>
                  <td>{user.dob}</td>
                </tr>
                <tr>
                  <td>User Gender :</td>
                  <td>{user.gender}</td>
                </tr>
                <tr>
                  <td>User Type :</td>
                  <td>{user.type}</td>
                </tr>
              </table>
            </Modal> : ''
          }

          <Modal title={user !== null ? "Are you sure?" : "Can not disable user"} visible={isModalDisableVisible}
            onOk={handleDisableOk} onCancel={handleDisableCancel} centered={true} closable={user !== null ? false : true}
            footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }} maskClosable={user !== null ? false : true}>
            {
              user !== null ?
                <>
                  <b style={{ marginLeft: '25%' }}>Do you want to disable this user?</b>
                  <br />
                  <br />
                  <div className={styles.buttonGroup}>
                    <Button className={styles.create}
                      style={{ marginLeft: '22%' }}
                      onClick={handleDisableOk}>Disable</Button>
                    <Button className={styles.cancelButton}
                      style={{ marginLeft: '20%' }}
                      onClick={handleDisableCancel}>Cancel</Button>
                  </div>
                </> :
                <>
                  <b>There are valid assignments belonging to this user</b>
                  <br />
                  <b>Please close all assignments before disabling user</b>
                </>
            }
          </Modal>

          <Row className={"Mango-table"}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th className={styles.borderTable} onClick={handleOrder} id="id">{UserConstant.Code}
                    {modeOrder.idOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>} </th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="name">{UserConstant.FullName}
                    {modeOrder.nameOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable}>Username</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="date">{UserConstant.JoinDate}
                    {modeOrder.dateOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="type">{UserConstant.Type}
                    {modeOrder.typeOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                </tr>
              </thead>
              <tbody >
                {searchUser.items.map(user => {
                  return (
                    <tr key={user.code} >
                      <td className={styles.borderRow} onClick={showModal} id={user.code}>{user.code}</td>
                      <td></td>
                      <td className={styles.borderRow} onClick={showModal} id={user.code}>{`${user.firstName} ${user.lastName}`}</td>
                      <td></td>
                      <td className={styles.borderRow} onClick={showModal} id={user.code}>{user.userName}</td>
                      <td></td>
                      <td className={styles.borderRow} onClick={showModal} id={user.code}>
                        {`${user.joinDate.substring(8, 10)}/${user.joinDate.substring(5, 7)}/${user.joinDate.substring(0, 4)}`}
                      </td>
                      <td></td>
                      <td className={styles.borderRow} onClick={showModal} id={user.code}>{user.type === 0 ? "Admin" : "Staff"}</td>
                      <td></td>
                      <td>
                        <Link onClick={EditUser} to={`/edit/${user.code}`}><i className="bi bi-pencil-fill"></i></Link>
                        <i className="bi bi-x-circle" onClick={showModalDisable} id={user.code}></i>
                      </td>
                    </tr>
                  )
                })
                }
              </tbody>

            </table>

          </Row>
          <Row>

          </Row>
          <Row style={{ marginRight: '7%' }} justify="end">
            <Col>
              {value.length !== 0 || searchValue !== ''
                ? <Pagination size={'small'} total={total.length} defaultCurrent={1} itemRender={itemRender} showSizeChanger={true} onChange={handleChangePage} />
                : <Pagination size={'small'} total={searchUser.totalRecords} defaultCurrent={1} itemRender={itemRender} showSizeChanger={true} onChange={handleChangePage} />
              }
            </Col>
          </Row>
        </>
        : ''
      }

    </Content >
  );
};

export default UserList;