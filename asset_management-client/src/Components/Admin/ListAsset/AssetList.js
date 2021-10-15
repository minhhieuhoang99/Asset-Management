import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Input, Button, Layout, Pagination, Modal } from 'antd';
import { FilterFilled } from '@ant-design/icons';
import styles from './AssetList.module.css'
import './AssetAntStyle.css'
import { Link, useLocation } from "react-router-dom";
import AssetConstant from './../../../Shared/Constant/AssetConstant';
import { GetListAssetService, GetAssetService, DeleteAssetService, GetAllAssetService } from './../../../Services/Admin/AssetService';
import { useLastLocation } from 'react-router-last-location';
import { Select } from 'antd';
import { GetCategoryListService } from './../../../Services/Admin/CategoryService';
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
const optionsstate = [{ label: 'Available', value: 'Available' }, { label: 'Not available', value: 'Not available' },
{ label: 'Assigned', value: 'Assigned' }, { label: 'Waiting', value: 'Waiting' }, { label: 'Recycled', value: 'Recycled' }];

const AssetList = () => {
  const { setSecondHeader } = useContext(SecondHeaderContext);
  const location = useLocation();
  const lastLocation = useLastLocation();
  const [modeOrder, setModeOrder] = useState({
    idOrder: 'DESC',
    nameOrder: 'DESC',
    categoryOrder: 'DESC',
    stateOrder: 'DESC',
  });
  const [filterstate, setFilterState] = useState([]);
  const [filtercategory, setFilterCategory] = useState([]);
  const [optioncategory, setOptionCategory] = useState();
  const [searchAsset, setSearchAsset] = useState();
  const [pageIndex, setPageIndex] = useState(AssetConstant.PageIndexDefault);
  const [pageSizeOld, setPageSizeOld] = useState(AssetConstant.PageSizeDefault);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDisableVisible, setIsModalDisableVisible] = useState(false);
  const [searchValue, setsearchValue] = useState('');
  const [total, setTotal] = useState(0);

  const selectStateProps = {
    suffixIcon: <FilterFilled />,
    style: {
      width: '100%',
    },
    mode: 'multiple',
    value: filterstate,
    options: optionsstate,
    onChange: (newValue) => {
      setFilterState(newValue);
    },
    placeholder: 'State',
    maxTagCount: 'responsive',
    showArrow: true
  };

  useEffect(() => {
    if (filterstate.length === 0 && total !== 0) {
      GetListAssetService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
        response.data.items.sort(function (a, b) {
          return (a.assetName).localeCompare(b.assetName);
        })
        response.data.items.forEach(element => {
          if (element.state === 0) {
            element.state = "Available";
          }
          if (element.state === 1) {
            element.state = "Not available";
          }
          if (element.state === 2) {
            element.state = "Assigned";
          }
        });
        setSearchAsset(response.data);
      })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
    else if (filterstate.length !== 0) {
      GetAllAssetService().then(function (response) {
        // handle success
        response.data.forEach(element => {
          switch (element.state) {
            case 0: element.state = 'Available'; break;
            case 1: element.state = 'Not available'; break;
            case 2: element.state = 'Assigned'; break;
            case 3: element.state = 'Waiting'; break;
            default: element.state = 'Recycled'; break;
          }
        })
        let data = response.data.filter(x => filterstate.includes(x.state));
        setTotal(data);
        setSearchAsset({ ...searchAsset, items: data.slice((pageIndex - 1) * pageSizeOld, pageIndex * pageSizeOld) });
      })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
  }, [filterstate]);

  useEffect(() => {
    if (filtercategory.length === 0 && total !== 0) {
      GetListAssetService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
        response.data.items.sort(function (a, b) {
          return (a.assetName).localeCompare(b.assetName);
        })
        response.data.items.forEach(element => {
          if (element.state === 0) {
            element.state = "Available";
          }
          if (element.state === 1) {
            element.state = "Not available";
          }
          if (element.state === 2) {
            element.state = "Assigned";
          }
        });
        setSearchAsset(response.data);
      })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
    else if (filtercategory.length !== 0) {
      GetAllAssetService().then(function (response) {
        // handle success
        response.data.forEach(element => {
          switch (element.state) {
            case 0: element.state = 'Available'; break;
            case 1: element.state = 'Not available'; break;
            case 2: element.state = 'Assigned'; break;
            case 3: element.state = 'Waiting'; break;
            default: element.state = 'Recycled'; break;
          }
        })
        let data = response.data.filter(x => filtercategory.includes(x.category.categoryId));
        setTotal(data);
        setSearchAsset({ ...searchAsset, items: data.slice((pageIndex - 1) * pageSizeOld, pageIndex * pageSizeOld) });
      })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
  }, [filtercategory]);

  const [asset, setAsset] = useState({
    assetCode: null,
    assetName: null,
    specification: null,
    location: null,
    category: { categoryPrefix: null },
    installedDate: null,
    state: null,
    assignmentList: [],
  });

  const showModal = (evt) => {
    GetAssetService({ code: evt.currentTarget.id }).then(function (response) {
      // handle success
      response.data.installedDate = `${response.data.installedDate.substring(8, 10)}/${response.data.installedDate.substring(5, 7)}/${response.data.installedDate.substring(0, 4)}`;
      if (response.data.state === 0) {
        response.data.state = "Available";
      }
      if (response.data.state === 1) {
        response.data.state = "Not available";
      }
      if (response.data.state === 2) {
        response.data.state = "Assigned";
      }
      setAsset(response.data);
      setIsModalVisible(true);
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDisableOk = () => {
    DeleteAssetService({ code: asset.assetCode }).then(function (response) {
      // handle success
      if (response.status === 200) {
        setSearchAsset({ ...searchAsset, items: searchAsset.items.filter(x => x.assetCode !== asset.assetCode) })
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
    GetAssetService({ code: evt.currentTarget.id }).then(function (response) {
      // handle success
      if (response.data.assignmentList.length === 0) {
        setAsset(response.data);
      }

      else {
        setAsset({ ...asset, state: null, assetCode: response.data.assetCode });
      }
      setIsModalDisableVisible(true);
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }

  useEffect(() => {
    let didCancel = false;
    if (searchValue !== '' || filtercategory.length !== 0 || filterstate.length !== 0) {
      setSearchAsset({ ...searchAsset, items: total.slice((pageIndex - 1) * pageSizeOld, pageIndex * pageSizeOld) });
    }
    else {
      GetListAssetService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
        // handle success
        if (!didCancel) {
          if (lastLocation !== null && location.pathname.includes('/list-asset/ok')) {
            response.data.items.forEach(element => {
              if (element.state === 0) {
                element.state = "Available";
              }
              if (element.state === 1) {
                element.state = "Not available";
              }
              if (element.state === 2) {
                element.state = "Assigned";
              }
            });
            if (lastLocation.pathname === '/create-asset') {
              GetAssetService({ code: location.pathname.split('/')[3] }).then(function (res) {
                // handle success
                if (res.data.state === 0) {
                  res.data.state = "Available";
                }
                if (res.data.state === 1) {
                  res.data.state = "Not available";
                }
                if (res.data.state === 2) {
                  res.data.state = "Assigned";
                }
                response.data.items = response.data.items.filter(x => x.assetCode !== res.data.assetCode);
                if (pageIndex === 1) {
                  response.data.items.unshift(res.data);
                }
                setSearchAsset(response.data);
              })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })
            } else if (lastLocation.pathname.includes('/edit-asset/')) {
              GetAssetService({ code: lastLocation.pathname.substring(12, lastLocation.pathname.length) }).then(function (res) {
                // handle success
                if (res.data.state === 0) {
                  res.data.state = "Available";
                }
                if (res.data.state === 1) {
                  res.data.state = "Not available";
                }
                if (res.data.state === 2) {
                  res.data.state = "Assigned";
                }
                response.data.items = response.data.items.filter(x => x.assetCode !== res.data.assetCode);
                if (pageIndex === 1) {
                  response.data.items.unshift(res.data);
                }
                setSearchAsset(response.data);
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
              return (a.assetName).localeCompare(b.assetName);
            });
            response.data.items.forEach(element => {
              if (element.state === 0) {
                element.state = "Available";
              }
              if (element.state === 1) {
                element.state = "Not available";
              }
              if (element.state === 2) {
                element.state = "Assigned";
              }
            });
            setSearchAsset(response.data);
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

  useEffect(() => {
    let didCancel = false;
    GetCategoryListService().then(function (response) {
      // handle success
      if (!didCancel) {
        let data = [];
        response.data.forEach(element => {
          data.push({
            label: element.categoryName,
            value: element.categoryId
          });
        });
        setOptionCategory(data);
      }
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
    return () => didCancel = true
  }, []);

  const handleChangePage = (page, pageSize) => {
    if (page !== pageIndex) {
      setPageIndex(page);
    }
    if (pageSize !== pageSizeOld) {
      setPageSizeOld(pageSize);
    }
  }

  const handleOrder = (evt) => {
    if (evt.currentTarget.id === 'code') {
      if (modeOrder.idOrder === 'ASC') {
        setModeOrder({ ...modeOrder, idOrder: 'DESC' });
        setSearchAsset({
          ...searchAsset, items: searchAsset.items.sort(function (a, b) {
            return (b.assetCode).localeCompare(a.assetCode);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, idOrder: 'ASC' });
        setSearchAsset({
          ...searchAsset, items: searchAsset.items.sort(function (a, b) {
            return (a.assetCode).localeCompare(b.assetCode);
          })
        });
      }
    }
    if (evt.currentTarget.id === 'name') {
      if (modeOrder.nameOrder === 'ASC') {
        setModeOrder({ ...modeOrder, nameOrder: 'DESC' });
        setSearchAsset({
          ...searchAsset, items: searchAsset.items.sort(function (a, b) {
            return (b.assetName).localeCompare(a.assetName);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, nameOrder: 'ASC' });
        setSearchAsset({
          ...searchAsset, items: searchAsset.items.sort(function (a, b) {
            return (a.assetName).localeCompare(b.assetName);
          })
        });
      }
    }
    if (evt.currentTarget.id === 'category') {
      if (modeOrder.categoryOrder === 'ASC') {
        setModeOrder({ ...modeOrder, categoryOrder: 'DESC' });
        setSearchAsset({
          ...searchAsset, items: searchAsset.items.sort(function (a, b) {
            return (b.category.categoryName).localeCompare(a.category.categoryName);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, categoryOrder: 'ASC' });
        setSearchAsset({
          ...searchAsset, items: searchAsset.items.sort(function (a, b) {
            return (a.category.categoryName).localeCompare(b.category.categoryName);
          })
        });
      }
    }
    if (evt.currentTarget.id === 'state') {
      if (modeOrder.stateOrder === 'ASC') {
        setModeOrder({ ...modeOrder, stateOrder: 'DESC' });
        setSearchAsset({
          ...searchAsset, items: searchAsset.items.sort(function (a, b) {
            return (b.state).localeCompare(a.state);
          })
        });
      } else {
        setModeOrder({ ...modeOrder, stateOrder: 'ASC' });
        setSearchAsset({
          ...searchAsset, items: searchAsset.items.sort(function (a, b) {
            return (a.state).localeCompare(b.state);
          })
        });
      }
    }
  }

  const handleSearch = (value) => {
    if (value !== '') {
      let filterValue = value.toUpperCase().trim();
      GetAllAssetService().then(function (response) {
        // handle success
        let data = response.data.filter(x => x.assetName.toUpperCase().includes(filterValue) || x.assetCode.toUpperCase().includes(filterValue));
        data.forEach(element => {
          switch (element.state) {
            case 0: element.state = 'Available'; break;
            case 1: element.state = 'Not available'; break;
            case 2: element.state = 'Assigned'; break;
            case 3: element.state = 'Waiting'; break;
            default: element.state = 'Recycled'; break;
          }
        });
        setTotal(data);
        setSearchAsset({ ...searchAsset, items: data.slice((pageIndex - 1) * pageSizeOld, pageIndex * pageSizeOld) });
        setsearchValue(filterValue);
      })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
    else {
      GetListAssetService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
        response.data.items.sort(function (a, b) {
          return (a.assetName).localeCompare(b.assetName);
        })
        response.data.items.forEach(element => {
          if (element.state === 0) {
            element.state = "Available";
          }
          if (element.state === 1) {
            element.state = "Not available";
          }
          if (element.state === 2) {
            element.state = "Assigned";
          }
        });
        setSearchAsset(response.data);
        setsearchValue('')
      })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
  }

  const SelectCategory = () => {
    if (optioncategory !== undefined) {

      const selectCategoryProps = {
        suffixIcon: <FilterFilled />,
        style: {
          width: '100%',
        },
        mode: 'multiple',
        value: filtercategory,
        options: optioncategory,
        onChange: (newValue) => {
          setFilterCategory(newValue);
        },
        placeholder: 'Category',
        maxTagCount: 'responsive',
        showArrow: true,
        optionFilterProp: 'label'
      };
      return (<Select {...selectCategoryProps} />)
    }
    else return '';
  }
  const EditAsset = () => {
    setSecondHeader("Edit-Asset");
  }
  const CreateAsset = () => {
    setSecondHeader("Create-Asset");
  }
  return (
    <Content className={styles.antLayoutContent}>
      <Row>
        <h2 className={styles.title}>Asset List</h2>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
        <Col span={5}>
          <Select {...selectStateProps} />
        </Col >
        <Col span={5}>
          <SelectCategory />
        </Col>
        <Col span={8}>
          <Search className={styles.radius} onSearch={handleSearch} />
        </Col>
        <Col span={6}>
          <Button className={styles.create}>
            <Link onClick={CreateAsset} to='/create-asset'>Create new Asset</Link>
          </Button>
        </Col>
      </Row>
      <br />
      {searchAsset !== undefined ?
        <>
          {asset !== null ?
            <Modal size='large' width={400} title="Asset Information" visible={isModalVisible} footer={null} onCancel={handleCancel} centered={true}>
              <table className={styles.tableModal}>
                <tr>
                  <td>Asset Code :</td>
                  <td>{asset.assetCode}</td>
                </tr>
                <tr>
                  <td>Asset Name :</td>
                  <td> {asset.assetName}</td>
                </tr>
                <tr>
                  <td> Asset Specification :</td>
                  <td> {asset.specification}</td>
                </tr>
                <tr>
                  <td>Asset Location :</td>
                  <td>{asset.location}</td>
                </tr>
                <tr>
                  <td>Asset Category :</td>
                  <td>{asset.category.categoryName}</td>
                </tr>
                <tr>
                  <td>Asset InstalledDate :</td>
                  <td>{asset.installedDate}</td>
                </tr>
                <tr>
                  <td>Asset State :</td>
                  <td>{asset.state}</td>
                </tr>
                {asset.assignmentList.length !== 0 ?
                  <tr>
                    <td>Id Assignment List : </td>
                    <td>{asset.assignmentList.map(asm => {
                      return (
                        <>{asm.asmId} </>
                      )
                    })}</td>
                  </tr>
                  : ''
                }
              </table>
            </Modal> : ''
          }

          <Modal title={asset.state !== null ? "Are you sure?" : "Cannot Delete Asset"} visible={isModalDisableVisible}
            onOk={handleDisableOk} onCancel={handleDisableCancel} centered={true} closable={asset.state !== null ? false : true}
            footer={null} style={{ height: '20', borderRadius: '20px', fontWeight: '30px' }} maskClosable={asset.state !== null ? false : true}>
            {
              asset.state !== null ?
                <>
                  <b style={{ marginLeft: '25%' }}>Do you want to delete this asset?</b>
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
                </> :
                <>
                  <b>Cannot delete the asset because it belongs to one or</b>
                  <br />
                  <b>more historical assignments.</b>
                  <br />
                  <b>If the asset is not able to be used anymore, please</b>
                  <br />
                  <b>update its state in</b> <Link to={`/edit-asset/${asset.assetCode}`} style={{ color: 'blue' }}>Edit Asset page</Link>
                </>
            }
          </Modal>

          <Row className={"Mango-table"}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th className={styles.borderTable} onClick={handleOrder} id="code">{AssetConstant.Code}
                    {modeOrder.idOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="name">{AssetConstant.Name}
                    {modeOrder.nameOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="category">{AssetConstant.Category}
                    {modeOrder.categoryOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderTable} onClick={handleOrder} id="state">{AssetConstant.State}
                    {modeOrder.stateOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                </tr>
              </thead>
              <tbody >
                {searchAsset.items.map(asset => {
                  return (
                    <tr key={asset.assetCode}>
                      <td className={styles.borderRow} onClick={showModal} id={asset.assetCode}>{asset.assetCode}</td>
                      <td></td>
                      <td className={styles.borderRow} onClick={showModal} id={asset.assetCode}>{asset.assetName}</td>
                      <td></td>
                      <td className={styles.borderRow} onClick={showModal} id={asset.assetCode}>{asset.category.categoryName}</td>
                      <td></td>
                      <td className={styles.borderRow} onClick={showModal} id={asset.assetCode}>{asset.state}</td>
                      <td></td>
                      <td>
                        {asset.state === "Assigned" ?
                          <>
                            <i className={`${styles.disabledIcon} bi bi-pencil-fill`}></i>
                            <i className={`${styles.disabledIcon} bi bi-x-circle`}></i>
                          </> :
                          <>
                            <Link onClick={EditAsset} to={`/edit-asset/${asset.assetCode}`}><i className="bi bi-pencil-fill"></i></Link>
                            <i className="bi bi-x-circle" onClick={showModalDisable} id={asset.assetCode}></i>
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
          <Row style={{ marginRight: '7%' }} justify="end">
            <Col>
              {searchValue !== '' || filtercategory.length !== 0 || filterstate.length !== 0
                ? < Pagination total={total.length} size="small" defaultCurrent={1} itemRender={itemRender} showSizeChanger={true} onChange={handleChangePage} />
                : < Pagination total={searchAsset.totalRecords} size="small" defaultCurrent={1} itemRender={itemRender} showSizeChanger={true} onChange={handleChangePage} />
              }
            </Col>
          </Row>
        </>
        : ''
      }

    </Content >
  );
};

export default AssetList;