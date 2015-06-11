;
angular.module('doog.library-www', ['ngRoute', 'ngResource', 'ngCookies'])
    .constant('LOGIN_URL', 'http://accounts.tykhome.com:3000/login/')
    .factory('HttpInterceptor', ['$q', '$location', '$log', function($q, $location, $log) {
        var interceptor = {
            'request': function(config) {
                config.headers["location"] = $location.absUrl();
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
    }])
    .factory('AuthInterceptor', ['$rootScope', '$q', '$cookies', '$location', '$window', '$timeout', '$log', 'LOGIN_URL', function($rootScope, $q, $cookies, $location, $window, $timeout, $log, LOGIN_URL) {
        return {
            request: function(config) {
                // delete $rootScope.errorKey;
                config.headers["location"] = $location.absUrl();
                config.headers = config.headers || {};
                $log.info('X-AUTH-TOKEN', $cookies.get('X-AUTH-TOKEN'));
                if ($cookies.get('X-AUTH-TOKEN')) {
                    config.headers['X-AUTH-TOKEN'] = $cookies.get('X-AUTH-TOKEN');
                    // config.headers['X-AUTH-EMAIL'] = $cookies.email;
                }
                return config;
            },
            responseError: function(response) {
                var status = response.status;

                // user is not authenticated -> redirect
                if (status === 401) {
                    var location = response.headers('location');

                    // if (location) location = encodeURI(location); // warn: encodeURI(null) === 'null'
                    if (location) location = encodeURIComponent(location); // warn: encodeURI(null) === 'null'
                    $window.location.href = LOGIN_URL + (!!location ? '?redirectURL=' + location : '')
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
    }])
    .factory('authService', ['$http', function($http) {
        var userRole = []; // obtained from backend
        var userRoleRouteMap = {
            'ROLE_ADMIN': ['/dashboard', '/about-us', '/authError'],
            'ROLE_USER': ['/usersettings', '/usersettings/personal', '/authError']
        };

        return {
            userLoggedIn: function() {
                return true;
            },
            userHasRole: function(role) {
                for (var j = 0; j < userRole.length; j++) {
                    if (role == userRole[j]) {
                        return true;
                    }
                }
                return false;
            },
            isUrlAccessibleForUser: function(route) {
                for (var i = 0; i < userRole.length; i++) {
                    var role = userRole[i];
                    var validUrlsForRole = userRoleRouteMap[role];
                    if (validUrlsForRole) {
                        for (var j = 0; j < validUrlsForRole.length; j++) {
                            if (validUrlsForRole[j] == route)
                                return true;
                        }
                    }
                }
                return false;
            }
        };
    }])
    // .config(['$cookiesProvider', function($cookiesProvider) {
    //     // $http.defaults.headers.common["X-AUTH-TOKEN"] = $cookies['AUTH-TOKEN'];
    // }])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.headers.common['x-Requested-With'] = 'XMLHttpRequest';
        // $httpProvider.interceptors.push('HttpInterceptor');
        $httpProvider.interceptors.push('AuthInterceptor');
    }])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        // html5路由模式
        // $locationProvider.html5Mode(true).hashPrefix('!');
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
    // .config(['$httpProvider', '$cacheFactory', function($httpProvider, $cacheFactory) {
    //     $httpProvider.defaults.cache = $cacheFactory('lru', {
    //         capacity: 100
    //     });
    // }])
    .run(['$rootScope', '$location', '$log', '$interval', 'AuthService', function($rootScope, $location, $log, $interval, AuthService) {
        var NProgressTimer;
        $rootScope.$on('page:fetch', function() {
            NProgress.remove();
            NProgress.start();

            $interval.cancel(NProgressTimer);
            NProgressTimer = $interval(function() {
                NProgress.inc();
            }, 500);
        });

        $rootScope.$on('page:change', function() {
            $interval.cancel(NProgressTimer);
            NProgress.done();
        });

        // route event
        $rootScope.$on('$routeChangeStart', function(evt, next, current) {
            $rootScope.$emit('page:fetch');

            // if (!authService.isUrlAccessibleForUser(next.originalPath))
            //     $location.path('/authError');

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
    }]);
