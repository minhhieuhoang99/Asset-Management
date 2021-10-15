import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, Row, Col, Button, Layout, Pagination, Modal } from 'antd';
import styles from './ViewOwnASM.module.css';
import ViewOwnASMConstant from '../../Shared/Constant/ViewOwnASMConstant';
import { UnlockOutlined } from "@ant-design/icons";
import { GetOwnAssignmentService, GetOwnListAssignmentService, CreateReturnRequestService, ResponseASMService } from '../../Services/Admin/ViewOwnService'
import './AntStyle.css'
import currentUserContext from '../../Shared/Constant/Context/CurrentUserContext'
import { ChangePasswordService } from '../../Services/Admin/Authentication'
import Cookies from 'universal-cookie';
const { Content } = Layout;
const ViewOwnASM = () => {

  const { currentUser, setCurrentUser } = useContext(currentUserContext);
  const [value, setValue] = useState([]);
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
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState();
  const [isDeclineModalVisible, setIsDeclineModalVisible] = useState();
  const [pageIndex, setPageIndex] = useState(ViewOwnASMConstant.PageIndexDefault);
  const [pageSizeOld, setPageSizeOld] = useState(ViewOwnASMConstant.PageSizeDefault);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalReturnVisible, setIsModalReturnVisible] = useState(false);
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

  function itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <Button size="small" style={{ fontSize: '14px', marginRight: '10px' }} >Previous</Button>;
    }
    if (type === 'next') {
      return <Button size="small" style={{ fontSize: '14px', marginLeft: '8px', marginRight: '10px' }}>Next</Button>;
    }
    return originalElement;
  }
  useEffect(() => {
    let didCancel = false;
    GetOwnListAssignmentService({ userCode: currentUser.code, index: pageIndex, size: pageSizeOld }).then(function (response) {
      // handle success
      response.data.items.sort(function (a, b) {
        return (`${a.assetName}`).localeCompare(`${b.assetName}`)
      })
      setAssignments(response.data);
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
  const showModal = (evt) => {
    GetOwnAssignmentService({ id: evt.currentTarget.id }).then(function (response) {
      // handle success
      response.data.assignmentDate = `${response.data.assignmentDate.substring(8, 10)}/${response.data.assignmentDate.substring(5, 7)}/${response.data.assignmentDate.substring(0, 4)}`;
      if (response.data.assignmentState === 1) {
        response.data.assignmentState = "Accepted";
      }
      setAssignment(response.data);
      if (response.data.assignmentState === "Accepted") {
        setIsModalVisible(true);
      }
      else {
        setIsModalVisible(false);
      }
      console.log(response.data);
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOrder = (evt) => {
    //Sort by No. ------------------------
    if (evt.currentTarget.id === 'assignmentId') {
      if (modeOrder.assignmentIdOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assignmentIdOrder: 'DESC' });
        setAssignments({
          ...assignments, items: assignments.items.sort(function (a, b) {
            return b.assignmentId - a.assignmentId;
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assignmentIdOrder: 'ASC' });
        setAssignments({
          ...assignments, items: assignments.items.sort(function (a, b) {
            return a.assignmentId - b.assignmentId;
          })
        });
      }
    }
    if (evt.currentTarget.id === 'assignmentDate') {
      if (modeOrder.assignmentDateOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assignmentDateOrder: 'DESC' });
        setAssignments({
          ...assignments, items: assignments.items.sort(function (a, b) {
            return new Date(b.assignmentDate) - new Date(a.assignmentDate);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assignmentDateOrder: 'ASC' });
        setAssignments({
          ...assignments, items: assignments.items.sort(function (a, b) {
            return new Date(a.assignmentDate) - new Date(b.assignmentDate);
          })
        });
      }
    }
    //sort by Asset Code---------------------
    if (evt.currentTarget.id === 'assetCode') {
      if (modeOrder.assetCodeOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assetCodeOrder: 'DESC' });
        setAssignments({
          ...assignments, items: assignments.items.sort(function (a, b) {
            return (b.assetCode).localeCompare(a.assetCode);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assetCodeOrder: 'ASC' });
        setAssignments({
          ...assignments, items: assignments.items.sort(function (a, b) {
            return (a.assetCode).localeCompare(b.assetCode);
          })
        });
      }
    }
    //sort by Asset Name-----------------
    if (evt.currentTarget.id === 'assetName') {
      if (modeOrder.assetNameOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assetNameOrder: 'DESC' });
        setAssignments({
          ...assignments, items: assignments.items.sort(function (a, b) {
            return (b.assetName).localeCompare(a.assetName);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assetNameOrder: 'ASC' });
        setAssignments({
          ...assignments, items: assignments.items.sort(function (a, b) {
            return (a.assetName).localeCompare(b.assetName);
          })
        });
      }
    }
    //sort by Assigned to staff -----------------
    if (evt.currentTarget.id === 'assigneeUserName') {
      if (modeOrder.assigneeUserNameOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assigneeUserNameOrder: 'DESC' });
        setAssignments({
          ...assignments, items: assignments.items.sort(function (a, b) {
            return (b.assigneeUserName.userName).localeCompare(a.assigneeUserName.userName);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assigneeUserNameOrder: 'ASC' });
        setAssignments({
          ...assignments, items: assignments.items.sort(function (a, b) {
            return (a.assigneeUserName.userName).localeCompare(b.assigneeUserName.userName);
          })
        });
      }
    }
    //sort by Assigned by admin ------------------
    if (evt.currentTarget.id === 'assignerUserName') {
      if (modeOrder.assignerUserNameOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assignerUserNameOrder: 'DESC' });
        setAssignments({
          ...assignments, items: assignments.items.sort(function (a, b) {
            return (b.assignerUserName.userName).localeCompare(a.assignerUserName.userName);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assignerUserNameOrder: 'ASC' });
        setAssignments({...assignments, items: assignments.items.sort(function (a, b)  {
          return (a.assignerUserName.userName).localeCompare(b.assignerUserName.userName);
        })
      });
      }
    }


    if (evt.currentTarget.id === 'assignmentState') {
      if (modeOrder.assignmentStateOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assignmentStateOrder: 'DESC' });
        setAssignments({
          ...assignments, items: assignments.items.sort(function (a, b) {
            return b.assignmentState - a.assignmentState;
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assignmentStateOrder: 'ASC' });
        setAssignments({
          ...assignments, items: assignments.items.sort(function (a, b) {
            return a.assignmentState - b.assignmentState;
          })
        });
      }
    }
  }


  const showReturnModal = (evt) => {
    GetOwnAssignmentService({ id: evt.currentTarget.id }).then(function (response) {
      // handle success
      setAssignment({ ...assignment, assignmentId: response.data.assignmentId, returnState: response.data.returnState });
      setIsModalReturnVisible(true);
      console.log(assignment);
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
  const showAcceptModal = (evt) => {
    GetOwnAssignmentService({ id: evt.currentTarget.id }).then(function (response) {
      setAssignment(response.data);
      setIsAcceptModalVisible(true);
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }
  const handleAcceptOk = () => {
    ResponseASMService({ id: assignment.assignmentId, respond: "Accepted" }).then(function (response) {
      setIsAcceptModalVisible(false);
      window.location.reload();
    }).catch(function (error) {
      // handle error
      console.log(error);
      setIsAcceptModalVisible(false);
    })

  }
  const handleAcceptCancel = () => {
    setIsAcceptModalVisible(false);
  }

  const showDeclineModal = (evt) => {
    GetOwnAssignmentService({ id: evt.currentTarget.id }).then(function (response) {
      setAssignment(response.data);
      setIsDeclineModalVisible(true);
      console.log(response.data);
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }
  const handleDeclineOk = () => {
    ResponseASMService({ id: assignment.assignmentId, respond: "Declined" }).then(function (response) {
      setIsDeclineModalVisible(false);
      window.location.reload();
    }).catch(function (error) {
      // handle error
      console.log(error);
      setIsDeclineModalVisible(false);
    })
  }
  const handleDeclineCancel = () => {
    setIsDeclineModalVisible(false);
  }
  return (
    <Content className={styles.antLayoutContent}>
      <Row>
        <h2 className={styles.title}>My Assignment</h2>
      </Row>
      <br />
      {assignments !== undefined ?
        <>
          {assignment !== null ?
            <Modal title="Assignment Information" visible={isModalVisible} footer= {null} onCancel={handleCancel} centered={true} width={400}>
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
          <Modal title={assignment.returnState === 0 ? "Are you sure?" : "Can't create return request"}
            visible={isModalReturnVisible}
            onOk={handleReturnOk} onCancel={handleReturnCancel} centered={true}
            footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }}>

            {assignment.returnState === 0 ?
              <>
                <b style={{ marginLeft:'12%'}}>Do you want to create a returning request for this Asset?</b>
                <br />
                <br />
                <div className={styles.buttonGroup}>
                  <Button style={{ marginLeft:'26%'}} className={styles.create} onClick={handleReturnOk}>Yes</Button>
                  <Button style={{ marginLeft:'22%'}} className={styles.cancelButton} onClick={handleReturnCancel}>No</Button>
                </div>
              </>
              :
              <>
                <b>Return request for this assignment is already created </b>
                <br />
                <b>Please check and try again</b>
              </>
            }
          </Modal>
          <Modal title="Are you sure?" visible={isAcceptModalVisible}
            onOk={handleAcceptOk} onCancel={handleAcceptCancel} centered={true}
            footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }}
            maskClosable={assignment.assignmentState !== 1 ? false : true}>
            {
              <>
                <b style={{ marginLeft:'22%'}}>Do you want to accept this assignment?</b>
                <br />
                <br />
                <div className={styles.buttonGroup}>
                  <Button style={{ marginLeft:'22%'}} className={styles.create} onClick={handleAcceptOk}>Accept</Button>
                  <Button style={{ marginLeft:'22%'}} className={styles.cancelButton} onClick={handleAcceptCancel}>Cancel</Button>
                </div>
              </>
            }
          </Modal>
          <Modal title="Are you sure?" visible={isDeclineModalVisible} onOk={handleDeclineOk}
            onCancel={handleDeclineCancel} centered={true}
            maskClosable={assignment.assignmentState !== 1 ? false : true}
            footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }} >
            {
              <>
                <b style={{ marginLeft:'21%'}}>Do you want to decline this assignment?</b>
                <br />
                <br />
                <div className={styles.buttonGroup}>
                  <Button style={{ marginLeft:'22%'}} className={styles.create} onClick={handleDeclineOk}>Decline</Button>
                  <Button style={{ marginLeft:'22%'}} className={styles.cancelButton} onClick={handleDeclineCancel}>Cancel</Button>
                </div>
              </>
            }
          </Modal>
          <Row className = {"Mango-table"}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th className={styles.borderTable} onClick={handleOrder} id="assignmentId">{ViewOwnASMConstant.assignmentId}
                    {modeOrder.assignmentIdOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>} </th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assetCode">{ViewOwnASMConstant.assetCode}
                    {modeOrder.assetCodeOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assetName">{ViewOwnASMConstant.assetName}
                    {modeOrder.assetNameOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assigneeUserName">{ViewOwnASMConstant.assigneeUserName}
                    {modeOrder.assigneeUserNameOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assignerUserName">{ViewOwnASMConstant.assignerUserName}
                    {modeOrder.assignerUserNameOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assignmentDate">{ViewOwnASMConstant.assignmentDate}
                    {modeOrder.assignmentDateOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assignmentState">{ViewOwnASMConstant.assignmentState}
                    {modeOrder.assignmentStateOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                </tr>
              </thead>
              <tbody >
                {assignments.items.map(assignment => {
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
                      <td className={styles.borderRow} onClick={showModal} id={assignment.assignmentId}>
                        {assignment.assignmentState === 0 ? "Waiting for acceptance"
                          : (assignment.assignmentState === 1 ? 'Accepted' : 'Decline')}</td>
                      <td></td>
                      <td>
                        {assignment.assignmentState === 1 || assignment.assignmentState === 3 ?
                          <>
                            <i className={`${styles.disabledIcon} bi bi-check2-circle`} ></i>
                            <i className={`${styles.disabledIcon}  bi bi-x-circle`}></i>
                            {assignment.returnState === 0 ?
                              <i className={` bi bi-arrow-counterclockwise`} onClick={showReturnModal} id={assignment.assignmentId}></i>
                              :
                              <i className={`${styles.disabledIcon} bi bi-arrow-counterclockwise`} id={assignment.assignmentId}></i>
                            }
                          </> :
                          <>
                            <i className="bi bi-check2-circle" onClick={showAcceptModal} id={assignment.assignmentId}></i>
                            <i className="bi bi-x-circle" onClick={showDeclineModal} id={assignment.assignmentId}></i>
                            <i className={`${styles.disabledIcon} bi bi-arrow-counterclockwise`} id={assignment.assignmentId}></i>
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
          <Row style={{ marginRight: '6%' }} justify="end">
            <Col>
              <Pagination total={assignments.totalRecords} size='small' defaultCurrent={1} itemRender={itemRender} showSizeChanger={true} onChange={handleChangePage} />
            </Col>
          </Row>
        </> : ''

      }
    </Content>
  );
}

export default ViewOwnASM;