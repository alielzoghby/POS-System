import { RouteConfig } from './route-config';

export class RoutesUtil {
  static LandingPage = new RouteConfig('landing-page');

  // static Auth = new RouteConfig('auth');
  static Auth = new RouteConfig('auth');

  static AuthLogin = new RouteConfig('login', RoutesUtil.Auth);
  static AuthError = new RouteConfig('error', RoutesUtil.Auth);
  static AuthRegister = new RouteConfig('register', RoutesUtil.Auth);
  static AuthAccessDenied = new RouteConfig('access-denied', RoutesUtil.Auth);

  // static NotFound = new RouteConfig('not-found');
  static NotFound = new RouteConfig('not-found');

  // static Dashboard = new RouteConfig('dashboard');
  static Dashboard = new RouteConfig('dashboard');

  // static User = new RouteConfig('user');
  static User = new RouteConfig('user');
  static UserProfile = new RouteConfig<{ id: number }>('profile/:id', RoutesUtil.User);
  static UserList = new RouteConfig('list', RoutesUtil.User);

  // static Category = new RouteConfig('category');
  static Category = new RouteConfig('category');
  static CategoryList = new RouteConfig('list', RoutesUtil.Category);

  // static Product = new RouteConfig('product');
  static Product = new RouteConfig('product');
  static ProductList = new RouteConfig('list', RoutesUtil.Product);

  // Configuration
  static Configuration = new RouteConfig('Configuration');

  // static Voucher = new RouteConfig('voucher');
  static Voucher = new RouteConfig('voucher');
  static VoucherList = new RouteConfig('list', RoutesUtil.Voucher);

  //static Order = new RouteConfig('order');
  static Order = new RouteConfig('order');
  static OrderList = new RouteConfig('list', RoutesUtil.Order);

}
