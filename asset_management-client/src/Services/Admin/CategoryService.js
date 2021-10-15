import axios from 'axios';
import CategoryConstant from './../../Shared/Constant/CategoryConstant';

export function GetCategoryListService() {
  return axios.get(CategoryConstant.GetListCategoryURL);
};

export function CreateCategoryService({ categoryName , categoryPrefix}) {
  return axios.post(CategoryConstant.CreateCategoryURL, {
    categoryName: categoryName,
    categoryPrefix: categoryPrefix,
  });
}