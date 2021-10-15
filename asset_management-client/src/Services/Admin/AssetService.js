import AssetConstant from './../../Shared/Constant/AssetConstant';
import axios from 'axios';

export function GetListAssetService({ index, size }) {
  return axios.get(AssetConstant.GetListAssetURL, {
    params: {
      pageSize: size,
      pageIndex: index
    }
  });
}

export function CreateAssetService({ location,assetId ,assetCode,assetName, specification ,categoryId ,installedDate,state}) {
  return axios.post(AssetConstant.CreateAssetURL, {
    assetId: assetId,
    assetCode: assetCode,
    assetName: assetName,
    specification: specification,
    categoryId: categoryId,
    installedDate: installedDate,
    location: location,
    state: state,
  });
}

export function EditAssetService({ assetId ,assetCode,assetName, specification ,categoryId ,installedDate,state}) {
  return axios.put(`${AssetConstant.EditAssetURL}${assetCode}`, {
    assetId: assetId,
    assetCode: assetCode,
    assetName: assetName,
    specification: specification,
    categoryId: categoryId,
    installedDate: installedDate,
    state: state,
  });
}

export function DeleteAssetService({ code }) {
  return axios.delete(AssetConstant.DeleteAssetURL + code);
}

export function GetAssetService({ code }) {
  return axios.get(`${AssetConstant.GetAssetURL}${code}`);
};

export function GetAllAssetService() {
  return axios.get(AssetConstant.GetAllAssetURL);
}