import axios from 'axios';
import ReportConstant from './../../Shared/Constant/ReportConstant';

export function GetAllReportService() {
  return axios.get(ReportConstant.GetReportsURL);
}

export function GetReportListService({ index, size }) {
  return axios.get(ReportConstant.GetPagingReportsURL, {
    params: {
      pageSize: size,
      pageIndex: index
    }
  });
}