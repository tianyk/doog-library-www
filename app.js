;
var AngularDemoModule = angular.module('doog.library-www', ['ngRoute', 'ngResource', 'ngCookies']);
AngularDemoModule
    .factory('HttpInterceptor', function($q) {
        var interceptor = {
            'request': function(config) {
                // 成功的请求方法
                return config; // 或者 $q.when(config);
            },
            'response': function(response) {
                // 响应成功
                return response; // 或者 $q.when(config);
            },
            'requestError': function(rejection) {
                // 请求发生了错误，如果能从错误中恢复，可以返回一个新的请求或promise
                return rejection; // 或新的promise
                // 或者，可以通过返回一个rejection来阻止下一步
                // return $q.reject(rejection);
            },
            'responseError': function(rejection) {
                // 请求发生了错误，如果能从错误中恢复，可以返回一个新的响应或promise
                return rejection; // 或新的promise
                // 或者，可以通过返回一个rejection来阻止下一步
                // return $q.reject(rejection);
            }
        };
        return interceptor;
    })
    .factory('AuthInterceptor', function($rootScope, $q, $cookies, $location, $timeout) {
        return {
            request: function(config) {
                delete $rootScope.errorKey;

                config.headers = config.headers || {};
                if ($cookies.authenticationToken && $cookies.email) {
                    config.headers['X-AUTH-TOKEN'] = $cookies.authenticationToken;
                    config.headers['X-AUTH-EMAIL'] = $cookies.email;
                }
                return config;
            },
            responseError: function(response) {
                var status = response.status;

                // user is not authenticated -> redirect
                if (status === 401) {
                    $rootScope.errorKey = 'global.errors.unauthorized';
                    $timeout(function() {
                        $location.path('/');
                    }, 3000);

                    // ignore form validation errors because there are handled in the specific controller
                } else if (status !== 0 && angular.isUndefined(response.data.errors)) {

                    // server error
                    if (response.data.text) {
                        $rootScope.errorKey = response.data.text;
                    } else {
                        $rootScope.showErrorMsg = true; // general error message
                        $timeout(function() {
                            $rootScope.showErrorMsg = false;
                        }, 5000);
                    }
                }

                return $q.reject(response);
            }
        };
    })
    // .config(['$cookiesProvider', function($cookiesProvider) {
    //     // $http.defaults.headers.common["X-AUTH-TOKEN"] = $cookies['AUTH-TOKEN'];
    // }])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
        $httpProvider.interceptors.push('HttpInterceptor');
    }])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/app/views/home.html',
            controller: 'HomeController'
        }).when('/login', {
            templateUrl: '/app/views/login.html',
            controller: 'LoginController'
        }).when('/help', {
            templateUrl: '/app/views/help.html',
            controller: 'HelpController'
        }).when('/not-found', {
            templateUrl: '/app/views/not_found.html',
            controller: 'NotFoundController'
        }).otherwise({
            redirectTo: '/'
        });
    }])
    .config(['$httpProvider', '$cacheFactory', function($httpProvider, $cacheFactory) {
        $httpProvider.defaults.cache = $cacheFactory('lru', {
            capacity: 100
        });
    }])
    .run(function($rootScope, $location, $log, AuthService) {
        var NProgressTimer;
        $rootScope.$on('page:fetch', function() {
            NProgress.remove();
            NProgress.start();

            clearInterval(NProgressTimer);
            NProgressTimer = setInterval(function() {
                NProgress.inc();
            }, 500);
        });

        $rootScope.$on('page:change', function() {
            clearInterval(NProgressTimer);
            NProgress.done();
        });

        // route event
        $rootScope.$on('$routeChangeStart', function(evt, next, current) {
            $rootScope.$emit('page:fetch');

            $log.info('$routeChangeStart');
            // 如果用户未登录
            if (!AuthService.userLoggedIn()) {
                if (next.templateUrl === "login.html") {
                    // 已经转向登录路由因此无需重定向
                } else {
                    $location.path('/login');
                }
            }
        });

        $rootScope.$on('$routeChangeSuccess', function(evt, next, previous) {
            $rootScope.$emit('page:change');
            $log.info('$routeChangeSuccess');
        });

        $rootScope.$on('$routeChangeError', function(current, previous, rejection, error) {
            $rootScope.$emit('page:change');
            $log.error(previous.templateUrl);
            $location.path('/home');
        });

        $rootScope.$on('doog.say', function(evt, data) {
            $log.info(evt.name + ' ' + data);
            $rootScope.$broadcast('doge.say', 'GO');
            $rootScope.$emit('root:say');
        });
    });
