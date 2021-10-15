import CommonConstant from './CommonConstant';

const AssetConstant = {
  Code: 'Asset Code',
  Name: 'Asset Name',
  Category: 'Category',
  State: 'State',
  PageIndexDefault: 1,
  PageSizeDefault: 10,
  EditAssetURL :`${CommonConstant.Server}/Asset/api/asset/update/`,
  CreateAssetURL : `${CommonConstant.Server}/Asset/api/asset/create`,
  GetListAssetURL: `${CommonConstant.Server}/Asset/api/asset/list`,
  GetAssetURL: `${CommonConstant.Server}/Asset/api/asset/`,
  DeleteAssetURL: `${CommonConstant.Server}/Asset/api/asset/delete/`,
  GetAllAssetURL: `${CommonConstant.Server}/Asset/api/asset/listAll`,
};

export default AssetConstant;