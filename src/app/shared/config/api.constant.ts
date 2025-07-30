import { environment } from '../../../environments/environment';
import { URLSegment } from './url-segment.enum';

export class ApiConstant {
  static URL_BASE = environment.base_url + environment.api_prefix;
  static LOGIN = ApiConstant.URL_BASE + URLSegment.Auth + 'login';

  static UPDATE_PASSWORD =
    ApiConstant.URL_BASE + URLSegment.User + URLSegment.Auth + 'add-password';
  static ADD_USER = ApiConstant.URL_BASE + URLSegment.User + 'register';
  static UPDATE_USER = ApiConstant.URL_BASE + URLSegment.User;
  static RESET_PASSWORD = ApiConstant.URL_BASE + URLSegment.User + 'update-password';

  static GET_LOOKUP = ApiConstant.URL_BASE + URLSegment.Lookups + '{type}';

  static GET_ALL_NOTIFICATIONS = ApiConstant.URL_BASE + URLSegment.User + 'notification';
  static GET_NOTIFICATION_BY_ID = ApiConstant.URL_BASE + URLSegment.User + 'notification/' + '{id}';
  static MARK_ALL_AS_READ = ApiConstant.URL_BASE + URLSegment.User + 'notification';
}
