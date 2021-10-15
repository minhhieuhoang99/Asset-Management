import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Layout, Pagination } from 'antd';
import styles from './Report.module.css'
import ReportConstant from '../../../Shared/Constant/ReportConstant';
import { GetAllReportService, GetReportListService } from './../../../Services/Admin/ReportService';
import { saveAs } from 'file-saver';
import Excel from 'exceljs';
import moment from "moment-timezone";
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

const Report = () => {
  const workbook = new Excel.Workbook();
  const [modeOrder, setModeOrder] = useState({
    categoryOrder: 'DESC',
    totalOrder: 'DESC',
    assignedOrder: 'DESC',
    availableOrder: 'DESC',
    notAvailableOrder: 'DESC',
    waittingForRecyclingOrder: 'DESC',
    RecycledOrder: 'DESC',
  });
  const [pageIndex, setPageIndex] = useState(ReportConstant.PageIndexDefault);
  const [pageSizeOld, setPageSizeOld] = useState(ReportConstant.PageSizeDefault);
  const [reports, setReports] = useState();
  const [reportExport, setReportExport] = useState();

  const handleChangePage = (page, pageSize) => {
    if (page !== pageIndex) {
      setPageIndex(page);
    }
    if (pageSize !== pageSizeOld) {
      setPageSizeOld(pageSize);
    }
  }
  const columns = [
    { header: ReportConstant.CategoryTitle, key: 'categoryName' },
    { header: ReportConstant.TotalTitle, key: 'totalCount' },
    { header: ReportConstant.AssignedTitle, key: 'assignedCount' },
    { header: ReportConstant.AvailableTitle, key: 'availableCount' },
    { header: ReportConstant.NotAvailableTitle, key: 'notAvailableCount' },
    { header: ReportConstant.WaittingForRecyclingTitle, key: 'waitingCount' },
    { header: ReportConstant.RecycledTitle, key: 'recycledCount' }
  ];
  useEffect(() => {
    let didCancel = false;
    GetAllReportService().then(function (response) {
      // handle success
      if (!didCancel) {
        response.data.sort(function (a, b) {
          return (a.categoryName).localeCompare(b.categoryName);
        })
        setReportExport(response.data)
      }
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
    return () => didCancel = true
  }, []);

  useEffect(() => {
    let didCancel = false;
    GetReportListService({ index: pageIndex, size: pageSizeOld }).then(function (response) {
      // handle success
      if (!didCancel) {
        response.data.items.sort(function (a, b) {
          return (a.categoryName).localeCompare(b.categoryName);
        })
        setReports(response.data);
      }
    })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
    return () => didCancel = true
  }, [pageSizeOld, pageIndex]);

  const handleOrder = (evt) => {
    let data;
    if (evt.currentTarget.id === ReportConstant.CategoryTitle) {
      if (modeOrder.categoryOrder === 'ASC') {
        setModeOrder({ ...modeOrder, categoryOrder: 'DESC' });
        data = reports.items.sort(function (a, b) {
          return (b.categoryName).localeCompare(a.categoryName);
        });
      } else {
        setModeOrder({ ...modeOrder, categoryOrder: 'ASC' });
        data = reports.items.sort(function (a, b) {
          return (a.categoryName).localeCompare(b.categoryName);
        });
      }
    }
    if (evt.currentTarget.id === ReportConstant.TotalTitle) {
      if (modeOrder.totalOrder === 'ASC') {
        setModeOrder({ ...modeOrder, totalOrder: 'DESC' });
        data = reports.items.sort(function (a, b) {
          return b.totalCount - a.totalCount;
        });
      } else {
        setModeOrder({ ...modeOrder, totalOrder: 'ASC' });
        data = reports.items.sort(function (a, b) {
          return a.totalCount - b.totalCount;
        });
      }
    }
    if (evt.currentTarget.id === ReportConstant.AssignedTitle) {
      if (modeOrder.assignedOrder === 'ASC') {
        setModeOrder({ ...modeOrder, assignedOrder: 'DESC' });
        data = reports.items.sort(function (a, b) {
          return b.assignedCount - a.assignedCount;
        });
      } else {
        setModeOrder({ ...modeOrder, assignedOrder: 'ASC' });
        data = reports.items.sort(function (a, b) {
          return a.assignedCount - b.assignedCount;
        });
      }
    }
    if (evt.currentTarget.id === ReportConstant.AvailableTitle) {
      if (modeOrder.availableOrder === 'ASC') {
        setModeOrder({ ...modeOrder, availableOrder: 'DESC' });
        data = reports.items.sort(function (a, b) {
          return b.availableCount - a.availableCount;
        });
      } else {
        setModeOrder({ ...modeOrder, availableOrder: 'ASC' });
        data = reports.items.sort(function (a, b) {
          return a.availableCount - b.availableCount;
        });
      }
    }
    if (evt.currentTarget.id === ReportConstant.NotAvailableTitle) {
      if (modeOrder.notAvailableOrder === 'ASC') {
        setModeOrder({ ...modeOrder, notAvailableOrder: 'DESC' });
        data = reports.items.sort(function (a, b) {
          return b.notAvailableCount - a.notAvailableCount;
        });
      } else {
        setModeOrder({ ...modeOrder, notAvailableOrder: 'ASC' });
        data = reports.items.sort(function (a, b) {
          return a.notAvailableCount - b.notAvailableCount;
        });
      }
    }
    if (evt.currentTarget.id === ReportConstant.WaittingForRecyclingTitle) {
      if (modeOrder.waittingForRecyclingOrder === 'ASC') {
        setModeOrder({ ...modeOrder, waittingForRecyclingOrder: 'DESC' });
        data = reports.items.sort(function (a, b) {
          return b.waitingCount - a.waitingCount;
        });
      } else {
        setModeOrder({ ...modeOrder, waittingForRecyclingOrder: 'ASC' });
        data = reports.items.sort(function (a, b) {
          return a.waitingCount - b.waitingCount;
        });
      }
    }
    if (evt.currentTarget.id === ReportConstant.RecycledTitle) {
      if (modeOrder.recycledCount === 'ASC') {
        setModeOrder({ ...modeOrder, recycledCount: 'DESC' });
        data = reports.items.sort(function (a, b) {
          return b.recycledCount - a.recycledCount;
        });
      } else {
        setModeOrder({ ...modeOrder, recycledCount: 'ASC' });
        data = reports.items.sort(function (a, b) {
          return a.recycledCount - b.recycledCount;
        });
      }
    }
    setReports({ ...reports, items: data });
    // setReportExport({ ...reportExport, data });
  }

  const saveExcel = async () => {
    try {
      var today = new Date(moment().tz("Asia/Ho_Chi_Minh"));
      const fileName = `DataExport-${today.getUTCFullYear()}-${("0" + (today.getUTCMonth() + 1)).slice(-2)}-${("0" + today.getUTCDate()).slice(-2)} ${("0" + today.getHours()).slice(-2)}${("0" + today.getUTCMinutes()).slice(-2)}${("0" + today.getUTCSeconds()).slice(-2)}`;

      // creating one worksheet in workbook
      const worksheet = workbook.addWorksheet("asset report");

      // add worksheet columns
      // each columns contains header and its mapping key from data
      worksheet.columns = columns;

      // updated the font for first row.
      worksheet.getRow(1).font = { bold: true };

      // loop through all of the columns and set the alignment with width.
      worksheet.columns.forEach(column => {
        column.width = column.header.length + 5;
      });

      // loop through data and add each one to worksheet
      reportExport.forEach(singleData => {
        worksheet.addRow(singleData);
      });

      // write the content using writeBuffer
      const buf = await workbook.xlsx.writeBuffer();

      // download the processed file
      saveAs(new Blob([buf]), `${fileName}.xlsx`);
    } catch (error) {
      console.error('<<<ERRROR>>>', error);
      console.error('Something Went Wrong', error.message);
    } finally {
      // removing worksheet's instance to create new one
      workbook.removeWorksheet("asset report");
    }
  };



  return (
    <Content className={styles.antLayoutContent}>
      <Row>
        <h2 className={styles.title}>Report</h2>
      </Row>
      <Row justify="end">
        <Col xl={3} sm={24}>
          <Button className={styles.create} onClick={saveExcel}>Export</Button>
        </Col>
      </Row>
      <br />
      {reports !== undefined ?
        <>
          <Row className={"Mango-table"}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th className={styles.borderCategory} onClick={handleOrder} id={ReportConstant.CategoryTitle}>{ReportConstant.CategoryTitle}
                    {modeOrder.categoryOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>} </th>
                  <th></th>
                  <th className={styles.borderNumber} onClick={handleOrder} id={ReportConstant.TotalTitle}>{ReportConstant.TotalTitle}
                    {modeOrder.totalOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderNumber} onClick={handleOrder} id={ReportConstant.AssignedTitle}>{ReportConstant.AssignedTitle}
                    {modeOrder.assignedOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderNumber} onClick={handleOrder} id={ReportConstant.AvailableTitle}>{ReportConstant.AvailableTitle}
                    {modeOrder.availableOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderNumber} onClick={handleOrder} id={ReportConstant.NotAvailableTitle}>{ReportConstant.NotAvailableTitle}
                    {modeOrder.notAvailableOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                  <th></th>
                  <th className={styles.borderNumberWaitting} onClick={handleOrder} id={ReportConstant.WaittingForRecyclingTitle}>
                    {ReportConstant.WaittingForRecyclingTitle}
                    {modeOrder.waittingForRecyclingOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}
                  </th>
                  <th></th>
                  <th className={styles.borderNumber} onClick={handleOrder} id={ReportConstant.RecycledTitle}>{ReportConstant.RecycledTitle}
                    {modeOrder.RecycledOrder === 'DESC' ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-up-fill"></i>}</th>
                </tr>
              </thead>
              <tbody >
                {reports.items.map(report => {
                  return (
                    <tr key={report.categoryName} >
                      <td className={styles.borderRowCategory}>{report.categoryName}</td>
                      <td></td>
                      <td className={styles.borderRowNumber}>{report.totalCount}</td>
                      <td></td>
                      <td className={styles.borderRowNumber}>{report.assignedCount}</td>
                      <td></td>
                      <td className={styles.borderRowNumber}>{report.availableCount}</td>
                      <td></td>
                      <td className={styles.borderRowNumber}>{report.notAvailableCount}</td>
                      <td></td>
                      <td className={styles.borderRowNumberWaitting}>{report.waitingCount}</td>
                      <td></td>
                      <td className={styles.borderRowNumber}>{report.recycledCount}</td>
                    </tr>
                  )
                })
                }
              </tbody>
            </table>
          </Row>
          <Row style={{ marginRight: '7%' }} justify="end">
            <Col>
              <Pagination size={'small'} total={reports.totalRecords} defaultCurrent={1} itemRender={itemRender} showSizeChanger={true} onChange={handleChangePage} />
            </Col>
          </Row>
        </>
        : ''
      }
    </Content >
  );
};

export default Report;