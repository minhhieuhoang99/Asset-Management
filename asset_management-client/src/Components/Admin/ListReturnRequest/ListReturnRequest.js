import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, Input, Button, Layout, Pagination, Modal } from 'antd';
import { FilterFilled } from '@ant-design/icons';
import styles from './ListReturnRequest.module.css'
import './ListReturnAntStyle.css'
import moment from "moment-timezone";
import ReturnRequestConstant from '../../../Shared/Constant/ReturnRequestConstant'
import {
  GetReturnRequestService,
  GetListReturnRequestService,
  GetListFilterReturnDateService,
  GetListFilterReturnStateService,
  GetReturnRequestListByService,
  RespondReturnRequest,
} from '../../../Services/Admin/ReturnRequestService'
import CurrentUserContext from '../../../Shared/Constant/Context/CurrentUserContext'
import { Select, DatePicker } from 'antd';
const { Search } = Input;
const { Content } = Layout;

function itemRender(current, type, originalElement) {
  if (type === 'prev') {
    return <Button size="small" style={{fontSize: '14px', marginRight: '10px'}} >Previous</Button>;
  }else if (type === 'next') {
    return <Button size="small" style={{fontSize: '14px', marginLeft: '8px',marginRight: '10px'}}>Next</Button>;
  }
  return originalElement;
}

const options = [{ label: 'Waiting for returning', value: 1 }, { label: 'Completed', value: 2 }];

const ListReturnRequest = () => {
  const {currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [value, setValue] = useState([]);
  const [filterstate, setFilterState] = useState([]);
  const [pageIndex, setPageIndex] = useState(ReturnRequestConstant.PageIndexDefault);
  const [pageSizeOld, setPageSizeOld] = useState(ReturnRequestConstant.PageSizeDefault);
  const [isModalCompleteVisible, setIsModalCompleteVisible] = useState(false);
  const [isModalCancelVisible, setIsModalCancelVisible] = useState(false);
  const [returnID,setReturnID]= useState();
  const [isModalAlreadyCompleted, setIsModalAlreadyCompleted] = useState(false);
  const [returnRequests, setReturnRequests] = useState({
    assignmentId: null,
    assetCode: null,
    assetName: null,
    requesterUserName: { userName: null },
    assignmentDate: null,
    verifierUserName: { userName: null },
    returnDate: null,
    returnState: null,
  });
  const [searchReturnRequest, setSearchReturnRequest] = useState();
  const [modeOrder, setModeOrder] = useState({
    assignmentIdOrder: 'DESC',
    assetCodeOrder: 'DESC',
    assetNameOrder: 'DESC',
    requesterUserNameOrder: 'DESC',
    verifierUserNameOrder: 'DESC',
    assignmentDateOrder: 'DESC',
    returnStateOrder: 'DESC',
    returnDateOrder:'DESC',
  });
  const [returnRequest, setReturnRequest] = useState({
    assignmentId: null,
    assetCode: null,
    assetName: null,
    requesterUserName: { userName: null },
    assignmentDate: null,
    verifierUserName: { userName: null },
    returnDate: null,
    returnState: null,
  })

  useEffect(() => {
    let didCancel = false;
    GetListReturnRequestService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
      if (!didCancel) {
        response.data.items.sort(function (a, b) {
          return (`${a.assetName}`).localeCompare(`${b.assetName}`)
        })
        setReturnRequests(response.data);
        setSearchReturnRequest(response.data);
      }
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
    return () => didCancel = true
  }, [pageSizeOld, pageIndex]);
  const selectProps = {
    suffixIcon: <FilterFilled />,
    style: {
      width: '100%',
    },
    optionFilterProp: 'label',
    mode: 'multiple',
    value: filterstate,
    options: options,
    onChange: (newValue) => {
      setFilterState(newValue);
    },
    placeholder: 'State',
    maxTagCount: 'responsive',
    showArrow: true
  };
  useEffect(() => {
    if (returnRequests !== undefined) {
      console.log(filterstate)
      if (filterstate.length === 0) {
        GetListReturnRequestService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
          response.data.items.sort(function (a, b) {
            return (`${a.assetName}`).localeCompare(`${b.assetName}`)
          })
          setReturnRequests(response.data);
          setSearchReturnRequest(response.data);
        })
      }
      else if(filterstate.length > 0) {
        GetListFilterReturnStateService({ searchValue: filterstate, size: pageSizeOld, index: pageIndex }).then(function (response) {
          console.log(filterstate);
          setReturnRequests(response.data);
          setSearchReturnRequest(response.data);
        })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
      }
    }
  }, [filterstate, pageSizeOld, pageIndex])

  const handleChangePage = (page, pageSize) => {
    if (page !== pageIndex) {
      setPageIndex(page);
    }
    if (pageSize !== pageSizeOld) {
      setPageSizeOld(pageSize);
    }
  }
  
  const [filterDate, setFilterDate] = useState();

  useEffect(() => {
    if (returnRequests !== undefined) { 
     
      if (filterDate === undefined || filterDate === null) {
        GetListReturnRequestService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
          setReturnRequests(response.data);
          setSearchReturnRequest(response.data);
        })
      } else {
        var date = new Date(moment(filterDate).tz("Asia/Ho_Chi_Minh").format("MM/DD/YYYY")).toDateString();
        GetListFilterReturnDateService({ searchValue: date, size: pageSizeOld, index: pageIndex }).then(function (response) {
          setReturnRequests(response.data);
          setSearchReturnRequest(response.data);
        }).catch(function (error) {
          // handle error
          console.log(error);
        })
      }
    }
  }, [filterDate, pageSizeOld, pageIndex])


  const handleOrder = (evt) => {
    //Sort by No. ------------------------
    if (evt.currentTarget.id === 'assignmentId') {
      if (modeOrder.assignmentIdOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assignmentIdOrder: 'DESC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return b.assignmentId - a.assignmentId;
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assignmentIdOrder: 'ASC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return a.assignmentId - b.assignmentId;
          })
        });
      }
    }
    //sort by assignedDate
    if (evt.currentTarget.id === 'assignmentDate') {
      //searchReturnRequest.map(x => x.Date = new Date(`${x.assignmentDate.substring(5, 7)},${x.assignmentDate.substring(8, 10)},${x.assignmentDate.substring(0, 4)}`));
      if (modeOrder.assignmentDateOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assignmentDateOrder: 'DESC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return new Date(b.assignmentDate) - new Date(a.assignmentDate);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assignmentDateOrder: 'ASC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return new Date(a.assignmentDate) - new Date(b.assignmentDate);
          })
        });
      }
    }
    //sort by Return Date
    if (evt.currentTarget.id === 'returnDate') {
      // searchReturnRequest.map(x => x.Date = new Date(`${x.returnDate.substring(5, 7)},${x.returnDate.substring(8, 10)},${x.returnDate.substring(0, 4)}`));
      if (modeOrder.returnDateOrder === 'ASC') {
        setModeOrder({ ...modeOrder, returnDateOrder: 'DESC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return new Date(b.assignmentDate) - new Date(a.returnDate);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, returnDateOrder: 'ASC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return new Date(a.assignmentDate) - new Date(b.returnDate);
          })
        });
      }
    }
    //sort by Asset Code---------------------
    if (evt.currentTarget.id === 'assetCode') {
      if (modeOrder.assetCodeOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assetCodeOrder: 'DESC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return (b.assetCode).localeCompare(a.assetCode);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assetCodeOrder: 'ASC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return (a.assetCode).localeCompare(b.assetCode);
          })
        });
      }
    }
    //sort by Asset Name-----------------
    if (evt.currentTarget.id === 'assetName') {
      if (modeOrder.assetNameOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assetNameOrder: 'DESC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return (b.assetName).localeCompare(a.assetName);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, assetNameOrder: 'ASC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return (a.assetName).localeCompare(b.assetName);
          })
        });
      }
    }
    //sort by Assigned to staff -----------------
    if (evt.currentTarget.id === 'requesterUserName') {
      if (modeOrder.requesterUserNameOrder === 'ASC') {
        setModeOrder({ ...modeOrder, requesterUserNameOrder: 'DESC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return (b.requesterUserName.userName).localeCompare(a.requesterUserName.userName);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, requesterUserNameOrder: 'ASC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return (a.requesterUserName.userName).localeCompare(b.requesterUserName.userName);
          })
        });
      }
    }
    //sort by Assigned by admin ------------------
    if (evt.currentTarget.id === 'verifierUserName') {
      if (modeOrder.verifierUserNameOrder === 'ASC') {
        setModeOrder({ ...modeOrder, verifierUserNameOrder: 'DESC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            if(a.verifierUserName === null && !b.verifierUserName=== null)
            {
              return 0;
            }else if(a.verifierUserName=== null)
            {
              return -1;
            }else if(b.verifierUserName=== null)
            {
              return -1;
            }else if(a.verifierUserName !== null && !b.verifierUserName !== null){
            return (b.verifierUserName.userName).localeCompare(a.verifierUserName.userName);
            }
          })
        });
      } else {
        setModeOrder({ ...modeOrder, verifierUserNameOrder: 'ASC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            if(a.verifierUserName === null && !b.verifierUserName=== null)
            {
              return 0;
            }else if(a.verifierUserName=== null)
            {
              return -1;
            }else if(b.verifierUserName=== null)
            {
              return -1;
            }else if(a.verifierUserName !== null && !b.verifierUserName !== null){
            return (a.verifierUserName.userName).localeCompare(b.verifierUserName.userName);
            }
          })
        });
      }
    }


    if (evt.currentTarget.id === 'returnState') {
      if (modeOrder.returnStateOrder === 'ASC') {
        setModeOrder({ ...modeOrder, returnStateOrder: 'DESC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return b.returnState - a.returnState;
          })
        });
      } else {
        setModeOrder({ ...modeOrder, returnStateOrder: 'ASC' });
        setSearchReturnRequest({
          ...searchReturnRequest, items: searchReturnRequest.items.sort(function (a, b) {
            return a.returnState - b.returnState;
          })
        });
      }
    }
  }
  const handleSearch = (value) => {
    if (returnRequests !== undefined) {
      let filterValue = value.toLowerCase().trim();
      if (value.length !== 0) {
        GetReturnRequestListByService({ searchValue: filterValue, size: pageSizeOld, index: pageIndex }).then(function (response) {
          setReturnRequests(response.data);
          setSearchReturnRequest(response.data);
        }).catch(function (error) {
          // handle error
          console.log(error);
        })
      } else if(value.length === 0) {
        GetListReturnRequestService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
          response.data.items.sort(function (a, b) {
            return (`${a.assetName}`).localeCompare(`${b.assetName}`)
          })
          setReturnRequests(response.data);
          setSearchReturnRequest(response.data);
        })
      }
    }
  }

  const showModalComplete = (evt) => {
    GetReturnRequestService({id : evt.currentTarget.id}).then(function (response) {
      setReturnID(response.data.assignmentId);
      setIsModalCompleteVisible(true);
      setReturnRequest({...returnRequest, assignmentId: response.data.assignmentId, returnState: response.data.returnState });
    }).catch(function (error) {
      setIsModalAlreadyCompleted(true)
      console.log(error);
    })
  }

  const handleCompleteOk = (evt) => {
    RespondReturnRequest({ code:currentUser.code, id: returnID, respond : "Completed"}).then(function (response) {
      setIsModalCompleteVisible(false);
      setReturnID(null);
      window.location.reload();
    }).catch(function (error) {
      // handle error
      console.log(error);
      setIsModalCompleteVisible(false);
      setReturnID(null);
    })
  };

  const handleCompleteCancel = () => {
    setIsModalCompleteVisible(false);
  };
  const showModalCancel = (evt) => {
    GetReturnRequestService({id : evt.currentTarget.id}).then(function (response) {
      setReturnID(response.data.assignmentId);
      setIsModalCancelVisible(true);
      setReturnRequest({...returnRequest, assignmentId: response.data.assignmentId, returnState: response.data.returnState });
    }).catch(function (error) {
      setIsModalAlreadyCompleted(true)
      console.log(error);
    })
  }
  const handleCancelOk = (evt) => {
    RespondReturnRequest({ code:currentUser.code, id: returnID, respond : "Cancel"}).then(function (response) {
      setIsModalCompleteVisible(false);
      setReturnID(null);
      window.location.reload();
    }).catch(function (error) {
      // handle error
      console.log(error);
      setIsModalCompleteVisible(false);
      setReturnID(null);
    })
  }
  const handleCancel = () => {
    setIsModalCancelVisible(false);
  }
  const handleAlreadyCompleteCancel =()=>{
    setIsModalAlreadyCompleted(false)
  }
  return (
    <Content className={styles.antLayoutContent}>
      <Modal title={(returnRequest.returnState !== 0)?"Are you sure?":"Error!"} visible={isModalCancelVisible}
        onOk={handleCancelOk} onCancel={handleCancel} centered={true}
        footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }}>
        {returnRequest.returnState !== 0 ?
          <>
            <b style={{ marginLeft:'19%'}}>Do you want to cancel this returning request?</b>
            <br />
            <br />
            <div className={styles.buttonGroup}>
              <Button className={styles.create}
              style={{marginLeft: '25%'}}
              onClick={handleCancelOk}>Yes</Button>
              <Button className={styles.cancelButton}
              style={{  marginLeft: '20%'}}
              onClick={handleCancel}>Cancel</Button>
            </div>
          </>:
          <> <b style={{fontSize: '15px',margin:'5%'}}>This returning request is already cancelled </b></>
        }
      </Modal>
      <Modal title={returnRequest.returnState === 1?"Are you sure?":"Error!"} visible={isModalCompleteVisible}
        onOk={handleCompleteOk} onCancel={handleCompleteCancel} centered={true}
        footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }}>
        {returnRequest.returnState ===1?
          <>
            <b style={{ marginLeft:'9%'}}>Do you want to mark this returning request as 'Completed'?</b>
            <br />
            <br />
            <div className={styles.buttonGroup}>
              <Button className={styles.create}
              style={{marginLeft: '25%'}}
              onClick={handleCompleteOk}>Yes</Button>
              <Button className={styles.cancelButton}
              style={{  marginLeft: '20%'}}
              onClick={handleCompleteCancel}>Cancel</Button>
            </div>
          </>:
          <>
              <b style={{fontSize: '15px',margin:'5%'}}>This returning request is already cancelled</b>
          </>
        }
      </Modal>
      <Modal title="Error!"
      onCancel={handleAlreadyCompleteCancel} centered={true} visible={isModalAlreadyCompleted}
      footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }}>
          {<>
              <b style={{fontSize: '15px',margin:'5%'}}>This returning request is already completed</b>
          </>}
        </Modal>
      <Row>
        <h2 className={styles.title}>Return Request List</h2>
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
            format="DD/MM/YYYY"
            placeholder="Return Date" />
        </Col>
        <Col span={4}></Col>
        <Col span={10}>
          <Search className={styles.radius} onSearch={handleSearch} />
        </Col>
      </Row>
      <br />
      {searchReturnRequest !== undefined ?
        <>
          <Row className = {"Mango-table"}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th className={styles.borderNo} onClick={handleOrder} id="assignmentId">{ReturnRequestConstant.assignmentId}
                    {modeOrder.assignmentIdOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>} </th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assetCode">{ReturnRequestConstant.assetCode}
                    {modeOrder.assetCodeOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assetName">{ReturnRequestConstant.assetName}
                    {modeOrder.assetNameOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="requesterUserName">{ReturnRequestConstant.requesterUserName}
                    {modeOrder.requesterUserNameOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="assignmentDate">{ReturnRequestConstant.assignmentDate}
                    {modeOrder.assignmentDateOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="verifierUserName">{ReturnRequestConstant.verifierUserName}
                    {modeOrder.verifierUserNameOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="returnDate">{ReturnRequestConstant.returnDate}
                    {modeOrder.returnDateOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="returnState">{ReturnRequestConstant.returnState}
                    {modeOrder.returnStateOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                </tr>
              </thead>
              <tbody >
                {searchReturnRequest.items.map(returnRequest => {
                  return (
                    <tr key={returnRequest.assignmentId} >
                      <td className={styles.borderRowNo} id={returnRequest.assignmentId}>{returnRequest.assignmentId}</td>
                      <td></td>
                      <td className={styles.borderRow} id={returnRequest.assignmentId}>{returnRequest.assetCode}</td>
                      <td></td>
                      <td className={styles.borderRow} id={returnRequest.assignmentId}>{returnRequest.assetName}</td>
                      <td></td>
                      <td className={styles.borderRow} id={returnRequest.assignmentId}>{returnRequest.requesterUserName.userName}</td>
                      <td></td>
                      <td className={styles.borderRow} id={returnRequest.assignmentId}>
                        {`${returnRequest.assignmentDate.substring(8, 10)}/${returnRequest.assignmentDate.substring(5, 7)}/${returnRequest.assignmentDate.substring(0, 4)}`}
                      </td>
                      <td></td>
                      <td className={styles.borderRow} id={returnRequest.assignmentId}>{returnRequest.verifierUserName === null ? "" : returnRequest.verifierUserName.userName}</td>
                      <td></td>
                      <td className={styles.borderRow} id={returnRequest.assignmentId}>
                        {`${returnRequest.returnDate.substring(8, 10)}/${returnRequest.returnDate.substring(5, 7)}/${returnRequest.returnDate.substring(0, 4)}`}
                      </td>
                      <td></td>
                      <td className={styles.borderRow} id={returnRequest.assignmentId}>{returnRequest.returnState === 1 ? 'Waiting for returning' : 'Completed'}</td>
                      <td></td>
                      <td>
                        {returnRequest.returnState === 1 ?
                          <>
                            <i className="bi bi-check2-circle" onClick={showModalComplete} id={returnRequest.assignmentId}></i>
                            <i className="bi bi-x-circle" onClick={showModalCancel} id={returnRequest.assignmentId}></i>
                          </>
                          :
                          <>
                            <i className={`${styles.disabledIcon} bi bi-check2-circle`}></i>
                            <i className={`${styles.disabledIcon} bi bi-x-circle`} ></i>
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
          <Row  justify = "end">
          <Col>
            <Pagination total={returnRequests.totalRecords} size='small' defaultCurrent={1} itemRender={itemRender} showSizeChanger={true} onChange={handleChangePage} />
          </Col>
          </Row>
        </> : ''
      }

    </Content>
  )
}
export default ListReturnRequest;