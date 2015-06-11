## 权限设计

### 问题
1. 登录登出
2. 接口权限
    1. 接口返回401
    2. 接口返回4xx
    3. 接口返回5xx
3. 页面访问授权


### 解决方案
1. 登录，登录成功后台返回Token。Token放置到cookie中，退出时销毁Token。
2. 使用HTTPIntercept，在Request中设置请求头`X-AUTH-TOKEN'`携带Token。
    1. 跳转到登陆界面，为了保证登陆成功后能跳转回来，需要发送请求时把当前页面放置到请求头中location，响应时再放到响应头中反回来。如果是401，就去跳转到登陆页，取到响应头中的location作为redirectURL。
    2. 数据校验信息
    3. 
3. 在`$routeChangeStart`做拦截，检查登陆、权限

