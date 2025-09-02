import { environment } from '../../../environments/environment';
import { URLSegment } from './url-segment.enum';

export class ApiConstant {
  static URL_BASE = environment.base_url + environment.api_prefix;
  static LOGIN = ApiConstant.URL_BASE + URLSegment.Auth + 'login';

  static GET_USER = ApiConstant.URL_BASE + URLSegment.Users + '{id}';
  static GET_USERS = ApiConstant.URL_BASE + URLSegment.Users;
  static ADD_USER = ApiConstant.URL_BASE + URLSegment.Users;
  static UPDATE_USER = ApiConstant.URL_BASE + URLSegment.Users + '{id}';

  static GET_LOOKUP = ApiConstant.URL_BASE + URLSegment.Lookups + '{type}';

  static GET_ALL_NOTIFICATIONS = ApiConstant.URL_BASE + URLSegment.User + 'notification';
  static GET_NOTIFICATION_BY_ID = ApiConstant.URL_BASE + URLSegment.User + 'notification/' + '{id}';
  static MARK_ALL_AS_READ = ApiConstant.URL_BASE + URLSegment.User + 'notification';

  static GET_CATEGORY = ApiConstant.URL_BASE + URLSegment.Categories + '{id}';
  static GET_CATEGORY_LIST = ApiConstant.URL_BASE + URLSegment.Categories;
  static ADD_CATEGORY = ApiConstant.URL_BASE + URLSegment.Categories;
  static UPDATE_CATEGORY = ApiConstant.URL_BASE + URLSegment.Categories + '{id}';
  static DELETE_CATEGORY = ApiConstant.URL_BASE + URLSegment.Categories + '{id}';

  static GET_PRODUCT = ApiConstant.URL_BASE + URLSegment.Products + '{id}';
  static GET_PRODUCT_LIST = ApiConstant.URL_BASE + URLSegment.Products;
  static ADD_PRODUCT = ApiConstant.URL_BASE + URLSegment.Products;
  static UPDATE_PRODUCT = ApiConstant.URL_BASE + URLSegment.Products + '{id}';
  static DELETE_PRODUCT = ApiConstant.URL_BASE + URLSegment.Products;
  static CREATE_SUB_PRODUCT = ApiConstant.URL_BASE + URLSegment.Products + 'create-sub-product';

  static GET_CONFIGURATION = ApiConstant.URL_BASE + URLSegment.Configuration;
  static UPDATE_CONFIGURATION = ApiConstant.URL_BASE + URLSegment.Configuration;

  static GET_VOUCHERS = ApiConstant.URL_BASE + URLSegment.Vouchers;
  static CREATE_VOUCHER = ApiConstant.URL_BASE + URLSegment.Vouchers;
  static UPDATE_VOUCHER = ApiConstant.URL_BASE + URLSegment.Vouchers + '{id}';
  static DELETE_VOUCHER = ApiConstant.URL_BASE + URLSegment.Vouchers + '{id}';

  static CREATE_ORDER = ApiConstant.URL_BASE + URLSegment.Orders + 'with-products/';
  static GET_ORDER = ApiConstant.URL_BASE + URLSegment.Orders + '{id}';
  static GET_ORDERS = ApiConstant.URL_BASE + URLSegment.Orders;
  static UPDATE_ORDER = ApiConstant.URL_BASE + URLSegment.Orders + '{id}';
  static DELETE_ORDER = ApiConstant.URL_BASE + URLSegment.Orders + '{id}';
}
