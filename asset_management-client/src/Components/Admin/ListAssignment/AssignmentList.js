import React, { useEffect, useContext, useState } from 'react';
import { Row, Col, Input, Button, Layout, Pagination, Modal } from 'antd';
import { FilterFilled } from '@ant-design/icons';
import styles from './AssignmentList.module.css'
import './AssignmentAntStyle.css'
import { Link, useLocation, useParams } from "react-router-dom";
import AssignmentConstant from './../../../Shared/Constant/AssignmentConstant';
import {
  GetListAssignmentService,
  GetListFilterAssignmentStateService,
  GetListFilterAssignedDateService,
  GetAssignmentService,
  GetAssignmentListByService,
  DeleteAssignmentService
} from './../../../Services/Admin/AssignmentService';
import SecondHeaderContext from '../../../Shared/Constant/Context/SecondHeaderContext';
import { CreateReturnRequestService } from './../../../Services/Admin/ViewOwnService';
import { Select, DatePicker } from 'antd';
import { useLastLocation } from 'react-router-last-location';
import { format } from 'date-fns';
import CurrentUserContext from '../../../Shared/Constant/Context/CurrentUserContext'
import moment from "moment-timezone";
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
const optionsstate = [{ label: 'Waiting for acceptance', value: 0 }, { label: 'Accepted', value: 1 }, { label: 'Decline', value: 2 }];

const AssignmentList = () => {

  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { id } = useParams();
  const [value, setValue] = useState([]);
  const location = useLocation();
  const lastLocation = useLastLocation();
  const [assignments, setAssignments] = useState();
  const [modeOrder, setModeOrder] = useState({
    assignmentIdOrder: 'DESC',
    assetCodeOrder: 'DESC',
    assetNameOrder: 'DESC',
    assigneeUserNameOrder: 'DESC',
    assignerUserNameOrder: 'DESC',
    assignmentDateOrder: 'DESC',
    assignmentStateOrder: 'DESC'
  });
  const dateFormat = "DD/MM/YYYY";
  const placeholder = "Assigned Date";
  const [filterstate, setFilterState] = useState([]);
  const [searchAssignment, setSearchAssignment] = useState();
  const [pageIndex, setPageIndex] = useState(AssignmentConstant.PageIndexDefault);
  const [pageSizeOld, setPageSizeOld] = useState(AssignmentConstant.PageSizeDefault);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDisableVisible, setIsModalDisableVisible] = useState(false);
  const [isModalReturnVisible, setIsModalReturnVisible] = useState(false);
  const [isAlreadyDisableModal, setIsAlreadyDisableModal] = useState(false);
  const [assignment, setAssignment] = useState({
    assignmentId: null,
    assetCode: null,
    assetName: null,
    assigneeUserName: { userName: null },
    assignerUserName: { userName: null },
    assignmentDate: null,
    assignmentState: null,
    returnState: null,
  });
  const selectProps = {
    suffixIcon: <FilterFilled />,
    style: {
      width: '100%',
    },
    mode: 'multiple',
    optionFilterProp: 'label',
    value: filterstate,
    options: optionsstate,
    onChange: (newValue) => {
      setFilterState(newValue);
      // setIsSearchOrSort(true);
    },
    placeholder: 'Assignment State',
    maxTagCount: 'responsive',
    showArrow: true
  };

  useEffect(() => {
    if (assignments !== undefined) {
      const stateString = filterstate;
      if (stateString.length === 0) {
        GetListAssignmentService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
          response.data.items.sort(function (a, b) {
            return (`${a.assetName}`).localeCompare(`${b.assetName}`)
          })
          setAssignments(response.data);
          setSearchAssignment(response.data);
        })
      }
      else {
        for (var i = 1; i <= filterstate.length; i++) {
          GetListFilterAssignmentStateService({ searchValue: stateString, size: pageSizeOld, index: pageIndex }).then(function (response) {
            setAssignments(response.data);
            setSearchAssignment(response.data);
          })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
        }
      }
    }
  }, [filterstate, pageSizeOld, pageIndex]);

  const [filterDate, setFilterDate] = useState([]);

  useEffect(() => {
    if (assignments !== undefined) { 
      if (filterDate === null) {
        GetListAssignmentService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
          setAssignments(response.data);
          setSearchAssignment(response.data);
        })
      } else {
        var date =moment.tz(filterDate,"Asia/Ho_Chi_Minh").format("MM/DD/YYYY");
        date = new Date(date).toDateString();
        console.log(moment.tz(filterDate,"Asia/Ho_Chi_Minh"));
        console.log(date);
        GetListFilterAssignedDateService({ searchValue: date, size: pageSizeOld, index: pageIndex }).then(function (response) {
          setSearchAssignment(response.data);
          setAssignments(response.data)
        }).catch(function (error) {
          // handle error
          console.log(error);
        })
      }
    }
  }, [filterDate, pageSizeOld, pageIndex])

  const showModal = (evt) => {
    GetAssignmentService({ id: evt.currentTarget.id }).then(function (response) {
      // handle success
      response.data.assignmentDate = `${response.data.assignmentDate.substring(8, 10)}/${response.data.assignmentDate.substring(5, 7)}/${response.data.assignmentDate.substring(0, 4)}`;
      if (response.data.assignmentState === 0) {
        response.data.assignmentState = "Waiting for acceptance";
      }
      if (response.data.assignmentState === 1) {
        response.data.assignmentState = "Accepted";
      }
      if (response.data.assignmentState === 2) {
        response.data.assignmentState = "Decline";
      }
      setAssignment(response.data);
      setIsModalVisible(true);
      console.log(response.data);
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  };

  const handleDisableOk = () => {
    DeleteAssignmentService({ id: assignment.assignmentId }).then(function (response) {
      // handle success
      if (response.status === 200) {
        const dataAfterDelete = searchAssignment.items.filter(x => x.assignmentId !== assignment.assignmentId);
        console.log(dataAfterDelete)
        setSearchAssignment({ ...searchAssignment, items: dataAfterDelete })
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
    setIsAlreadyDisableModal(false);
    setIsModalDisableVisible(false);
  }

  const showModalDisable = evt => {
    GetAssignmentService({ id: evt.currentTarget.id }).then(function (response) {
      // handle success
      setAssignment({ ...assignment, assignmentId: response.data.assignmentId,assignmentState: response.data.assignmentState  });
      console.log(assignment)
      setIsModalDisableVisible(true);
    })
      .catch(function (error) {
        setIsAlreadyDisableModal(true);
        console.log(error);
      })
  }
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    let didCancel = false;
    GetListAssignmentService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
      // handle success
      if (!didCancel) {
        if (lastLocation !== null && location.pathname.includes('/list-assignment/ok')) {
          if (lastLocation.pathname === '/create-assignment') {
            const newestItemId = location.pathname.substring(20);
            GetAssignmentService({ id: newestItemId }).then((res) => {
              if (pageIndex === 1) {
                response.data.items.unshift(res.data); console.log(response.data.items)
              };
              if (pageIndex === response.data.pageCount && res.data.assignmentId === response.data.items[response.data.items.length - 1].assignmentId) {
                response.data.items.pop();
              }
              setAssignments(response.data);
              setSearchAssignment(response.data);
            })
            // response.data.items.unshift(response.data.items.pop());
          } else if (lastLocation.pathname.includes('/edit-assignment/')) {
            const editedItemId = location.pathname.substring(20)
            GetAssignmentService({ id: editedItemId }).then((respon) => {
              if (pageIndex === 1) {
                let asmDuplicateId =  respon.data.assignmentId
                for(let i = 1 ; i <= response.data.items.length ; i++) {
                   response.data.items = response.data.items.filter(x=>x.assignmentId !== asmDuplicateId);
                   response.data.items.unshift(respon.data);
                   setAssignments(response.data);
                   setSearchAssignment(response.data);
                }
                
              } else {
                for (let i = 1; i <= response.data.pageCount; i++) {
                  response.data.items = response.data.items.filter(x => x.assignmentId !== respon.data.assignmentId)
                  setAssignments(response.data);
                  setSearchAssignment(response.data);
                }
              }
              setAssignments(response.data);
              setSearchAssignment(response.data);
            })
          }
        } else {
          response.data.items.sort(function (a, b) {
            return (`${a.assetName}`).localeCompare(`${b.assetName}`)
          })
          setAssignments(response.data);
          setSearchAssignment(response.data);
        }
      }
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
    return () => didCancel = true
  }, [pageSizeOld, pageIndex]);

  const handleChangePage = (page, pageSize) => {
    if (page !== pageIndex) {
      setPageIndex(page);
    }
    if (pageSize !== pageSizeOld) {
      setPageSizeOld(pageSize);
    }
  }

  const handleOrder = (evt) => {

    //Sort by No. ------------------------
    if (evt.currentTarget.id === 'assignmentId') {

      if (modeOrder.assignmentIdOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assignmentIdOrder: 'DESC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return b.assignmentId - a.assignmentId;
          })
        });
        console.log(searchAssignment.items)
      } else {
        setModeOrder({ ...modeOrder, assignmentIdOrder: 'ASC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return a.assignmentId - b.assignmentId;
          })
        });
      }
    }
    if (evt.currentTarget.id === 'assignmentDate') {
      // searchAssignment..map(x => x.assignmentDate = new Date(`${x.assignmentDate.substring(5, 7)},${x.assignmentDate.substring(8, 10)},${x.assignmentDate.substring(0, 4)}`));
      if (modeOrder.assignmentDateOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assignmentDateOrder: 'DESC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return new Date(b.assignmentDate) - new Date(a.assignmentDate);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assignmentDateOrder: 'ASC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return new Date(a.assignmentDate) - new Date(b.assignmentDate);
          })
        });
      }
    }
    //sort by Asset Code---------------------
    if (evt.currentTarget.id === 'assetCode') {
      if (modeOrder.assetCodeOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assetCodeOrder: 'DESC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return (b.assetCode).localeCompare(a.assetCode);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assetCodeOrder: 'ASC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return (a.assetCode).localeCompare(b.assetCode);
          })
        });
      }
    }
    //sort by Asset Name-----------------
    if (evt.currentTarget.id === 'assetName') {
      if (modeOrder.assetNameOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assetNameOrder: 'DESC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return (b.assetName).localeCompare(a.assetName);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assetNameOrder: 'ASC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return (a.assetName).localeCompare(b.assetName);
          })
        });
      }
    }
    //sort by Assigned to staff -----------------
    if (evt.currentTarget.id === 'assigneeUserName') {
      if (modeOrder.assigneeUserNameOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assigneeUserNameOrder: 'DESC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return (b.assigneeUserName.userName).localeCompare(a.assigneeUserName.userName);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assigneeUserNameOrder: 'ASC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return (a.assigneeUserName.userName).localeCompare(b.assigneeUserName.userName);
          })
        });
      }
    }
    //sort by Assigned by admin ------------------
    if (evt.currentTarget.id === 'assignerUserName') {
      if (modeOrder.assignerUserNameOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assignerUserNameOrder: 'DESC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return (b.assignerUserName.userName).localeCompare(a.assignerUserName.userName);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assignerUserNameOrder: 'ASC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return (a.assignerUserName.userName).localeCompare(b.assignerUserName.userName);
          })
        });
      }
    }


    if (evt.currentTarget.id === 'assignmentState') {
      if (modeOrder.assignmentStateOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assignmentStateOrder: 'DESC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return b.assignmentState - a.assignmentState;
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assignmentStateOrder: 'ASC' });
        setSearchAssignment({
          ...searchAssignment, items: searchAssignment.items.sort(function (a, b) {
            return a.assignmentState - b.assignmentState;
          })
        });
      }
    }
  }
  
  const handleSearch = (value) => {
    if (assignments !== undefined) {
      let filterValue = value.toLowerCase().trim();
      if (value.length !== 0) {
        GetAssignmentListByService({ searchValue: filterValue, size: pageSizeOld, index: pageIndex }).then(function (response) {
          setAssignments(response.data)
          setSearchAssignment(response.data)
          // setIsSearchOrSort(false);
        }).catch(function (error) {
          // handle error
          console.log(error);
        })
      } else {
        GetListAssignmentService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
          setAssignments(response.data);
          setSearchAssignment(response.data);
        })
      }

    }
  }
  const showReturnModal = (evt) => {
    GetAssignmentService({ id: evt.currentTarget.id }).then(function (response) {
      // handle success
      setAssignment({ ...assignment, assignmentId: response.data.assignmentId, returnState : response.data.returnState});
      setIsModalReturnVisible(true);
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }
  const handleReturnOk = () => {
    CreateReturnRequestService({ id: assignment.assignmentId, code: currentUser.code }).then(function (response) {
      setIsModalReturnVisible(false);
      window.location.reload();
    }).catch(function (error) {
      // handle error
      console.log(error);
      setIsModalReturnVisible(false);
    })
  }
  const handleReturnCancel = () => {
    setIsModalReturnVisible(false);
  }
  const { setSecondHeader } = useContext(SecondHeaderContext);
  const CreateAsm = () => {
    setSecondHeader("Create-Assignment");
  }
  const EditAsm = () => {
    setSecondHeader("Edit-Assignment");
  }
  return (
    <Content className={styles.antLayoutContent}>
        <Modal title={(assignment.assignmentState === 0||assignment.assignmentState === 2)? "Are you sure?" : "Can't disable assigment"} visible={isModalDisableVisible}
            onOk={handleDisableOk} onCancel={handleDisableCancel} centered={true}
            footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }}
          >
            {
              assignment.assignmentState === 1 ?
              <>
                <b style={{ marginLeft: '11%' }}>This assignments is already accepted and can't be disabled</b>
              </> :
             <>
                  <b style={{ marginLeft: '21%' }}>Do you want to delete this Assignment?</b>
                  <br />
                  <br />
                  <div className={styles.buttonGroup}>
                    <Button className={styles.create}
                      style={{ marginLeft: '22%' }}
                      onClick={handleDisableOk}>Delete</Button>
                    <Button className={styles.cancelButton}
                      style={{ marginLeft: '20%' }}
                      onClick={handleDisableCancel}>Cancel</Button>
                  </div>
                </>
            }
          </Modal>

          <Modal title="Can't disable assignment" visible={isAlreadyDisableModal}
            onCancel={handleDisableCancel} centered={true}
            footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }}>
            <b style={{ marginLeft: '25%' }}>This assignments is already deleted</b>
          </Modal>

      <Modal title={assignment.returnState === 0 ? "Are you sure?" : "Can't create return request"} visible={isModalReturnVisible}
        centered={true} onCancel={handleReturnCancel}
        footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }}>
        {assignment.returnState === 0 ? <>
          <b style={{ marginLeft: '12%' }}>Do you want to create a returning request for this Asset?</b>
          <br />
          <br />
          <div className={styles.buttonGroup}>
            <Button className={styles.create}
              style={{ marginLeft: '27%' }}
              onClick={handleReturnOk}>Yes</Button>
            <Button className={styles.cancelButton}
              style={{ marginLeft: '20%' }}
              onClick={handleReturnCancel}>No</Button>
          </div>
        </> :
          <>
            <b>Return request for this assignment is already created </b>
            <br />
            <b>Please check and try again</b>
          </>
        }
      </Modal>
      <Row>
        <h2 className={styles.title}>Assignment List</h2>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={5}>
          <Select {...selectProps} />
        </Col>
        <br />
        <Col span={5}>
          <DatePicker
            onChange={
              (newValue) => {
                setFilterDate(newValue)
              }
            }
            format={dateFormat}
            placeholder={placeholder} />
        </Col>
        <Col span={8} >
          <Search className={styles.radius} onSearch={handleSearch} />
        </Col>
        <Col span={6}>
          <Button className={styles.create}>
            <Link onClick={CreateAsm} to='/create-assignment'>Create new assignment</Link>
          </Button>
        </Col>
      </Row>
      <br />
      {searchAssignment !== undefined ?
        <>
          {assignment.items !== null ?
            <Modal
              className="modalAsm"
              width={400}
              title="Detailed Assignment Information"
              visible={isModalVisible}
              onCancel={handleCancel}
              footer={null}
              centered={true}>
              <table className={styles.tableModal}>
                <tr>
                  <td>No. :</td>
                  <td>{assignment.assignmentId}</td>
                </tr>
                <tr>
                  <td>Asset Code :</td>
                  <td> {assignment.assetCode}</td>
                </tr>
                <tr>
                  <td>Asset Name :</td>
                  <td>{assignment.assetName}</td>
                </tr>
                <tr>
                  <td>Assigned To :</td>
                  <td>{assignment.assigneeUserName.userName}</td>
                </tr>
                <tr>
                  <td>Assigned by :</td>
                  <td>{assignment.assignerUserName.userName}</td>
                </tr>
                <tr>
                  <td>Assigned Date :</td>
                  <td>{assignment.assignmentDate}</td>
                </tr>
                <tr>
                  <td>State :</td>
                  <td>{assignment.assignmentState}</td>
                </tr>
              </table>
            </Modal> : ''
          }
          <Row className = {"Mango-table"}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th className={styles.borderTable} onClick={handleOrder} id="assignmentId">{AssignmentConstant.assignmentId}
                    {modeOrder.assignmentIdOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>} </th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assetCode">{AssignmentConstant.assetCode}
                    {modeOrder.assetCodeOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assetName">{AssignmentConstant.assetName}
                    {modeOrder.assetNameOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assigneeUserName">{AssignmentConstant.assigneeUserName}
                    {modeOrder.assigneeUserNameOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assignerUserName">{AssignmentConstant.assignerUserName}
                    {modeOrder.assignerUserNameOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assignmentDate">{AssignmentConstant.assignmentDate}
                    {modeOrder.assignmentDateOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assignmentState">{AssignmentConstant.assignmentState}
                    {modeOrder.assignmentStateOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                </tr>
              </thead>
              <tbody >
                {searchAssignment.items.map(assignment => {
                  return (
                    <tr key={assignment.assignmentId} >
                      <td className={styles.borderRow} onClick={showModal} id={assignment.assignmentId}>{assignment.assignmentId}</td>
                      <td></td>
                      <td className={styles.borderRow} onClick={showModal} id={assignment.assignmentId}>{`${assignment.assetCode}`}</td>
                      <td></td>
                      <td className={styles.borderRow} onClick={showModal} id={assignment.assignmentId}>{assignment.assetName}</td>
                      <td></td>
                      <td className={styles.borderRow} onClick={showModal} id={assignment.assignmentId}>{assignment.assigneeUserName.userName}</td>
                      <td></td>
                      <td className={styles.borderRow} onClick={showModal} id={assignment.assignmentId}>{assignment.assignerUserName.userName}</td>
                      <td></td>
                      <td className={styles.borderRow} onClick={showModal} id={assignment.assignmentId}>
                        {`${assignment.assignmentDate.substring(8, 10)}/${assignment.assignmentDate.substring(5, 7)}/${assignment.assignmentDate.substring(0, 4)}`}
                      </td>
                      <td></td>
                      <td className={styles.borderRow} onClick={showModal} id={assignment.assignmentId}>{assignment.assignmentState === 0 ? "Waiting for acceptance" : (assignment.assignmentState === 1 ? "Accepted" : "Declined")}</td>
                      <td></td>
                      <td>
                        {assignment.assignmentState === 1 ?
                          <>
                            <i className={`${styles.disabledIcon} bi bi-pencil-fill`}></i>
                            <i className={`${styles.disabledIcon} bi bi-x-circle`}></i>
                            {assignment.returnState === 0 ?
                              <i className={` bi bi-arrow-counterclockwise`} onClick={showReturnModal} id={assignment.assignmentId}></i>
                              :
                              <i className={`${styles.disabledIcon} bi bi-arrow-counterclockwise`} id={assignment.assignmentId}></i>
                            }
                          </> :
                          <>
                            {assignment.assignmentState !== 2 ?
                              <Link onClick={EditAsm} to={`/edit-assignment/${assignment.assignmentId}`}><i className="bi bi-pencil-fill"></i></Link>
                              : <i className={`${styles.disabledIcon} bi bi-pencil-fill`}></i>}
                            <i className="bi bi-x-circle" onClick={showModalDisable} id={assignment.assignmentId}></i>
                            <i className={`${styles.disabledIcon} bi bi-arrow-counterclockwise`} ></i>
                          </>
                        }
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
          <Row style={{ marginRight: '3%' }} justify="end">
            <Col>
              <Pagination total={assignments.totalRecords} size='small' defaultCurrent={1} itemRender={itemRender} showSizeChanger={true} onChange={handleChangePage} />
            </Col>
          </Row>
        </> : ''

      }
    </Content>
  );
}

export default AssignmentList;