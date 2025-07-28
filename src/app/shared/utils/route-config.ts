export class RouteConfig<p= void, q= void> {
  public pathFromRoot: string;

  constructor(public path: string, public parent?: RouteConfig<any, any>) {
    this.pathFromRoot = RouteConfig.getPathUntilRoot(this);
  }

  static getPathUntilRoot(node: RouteConfig<any, any>): string {
    let root = node;
    let path = node.path;

    while (root.parent) {
      root = root.parent;
      path = `${root.path}/${path}`;
    }
    return `/${path.replace(/^\//, '')}`;
  }

  url(data:{params?: any, queryParams?: any ,fragment?:any}={}): string {
    let pathFromRoot = this.pathFromRoot;

    if (data.params) {

      Object.keys(data.params).forEach((param) => {
        if (pathFromRoot.includes(`:${param}`)) {
          pathFromRoot = pathFromRoot.replace(`:${param}`, data.params[param]);
        }
      });
    }

    if (data.queryParams) {
      const queries = Object.keys(data.queryParams).reduce((list, query) => {
        if (data.queryParams[query]) {
          return list ? `${list}&${query}=${data.queryParams[query]}` : `${query}=${data.queryParams[query]}`
        }
        return list;
      }, '');

      pathFromRoot = `${pathFromRoot}?${queries}`;
    }

    if (data.fragment) {
      pathFromRoot = `${pathFromRoot}#${data.fragment}`;
    }

    return pathFromRoot;
  }
}
