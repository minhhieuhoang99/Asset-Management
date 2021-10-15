import CommonConstant from './CommonConstant';
const ReportConstant = {
  CategoryTitle: 'Category',
  TotalTitle: 'Total',
  AssignedTitle: 'Assigned',
  AvailableTitle: 'Available',
  NotAvailableTitle: 'Not Available',
  WaittingForRecyclingTitle: 'Waitting for recycling',
  RecycledTitle: 'Recycled',
  GetReportsURL: `${CommonConstant.Server}/api/report`,
  GetPagingReportsURL: `${CommonConstant.Server}/Report/api/report/list`,
  PageIndexDefault: 1,
  PageSizeDefault: 10,
};

export default ReportConstant;