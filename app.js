;
var AngularDemoModule = angular.module('doog.library-www', ['ngRoute', 'ngResource']);
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
    .config(['$httpProvider', function($httpProvider) {
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
