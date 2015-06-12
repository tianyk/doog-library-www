angular.module('doog.angular.auth', ['ngCookies'])
    .provide('AuthTokenProvide', function() {
        this.refreshTokenURL = true;
        this.tokenName = 'access_token';
        this.refreshTokenName = 'refresh_token';

        this.$get = ['$http', '$window', '$cookies', function($http, $window, $cookies) {
            var Storage = function() {
                if (!(this instanceof Storage)) {
                    return new Storage();
                }
                this.localStorage = $window.localStorage;
                this.cookies = $cookies;
            }

            Storage.prototype.set = function(key, val, options) {
                if (this.localStorage) {
                    this.localStorage.setItem(key, val);
                    return;
                }

                this.cookies.put(key, val);
            }

            Storage.prototype.get = function(key) {
                var now = this.get('now');
                if (!now) now = new Date().getTime();

                if (this.localStorage) {
                    var val = this.localStorage.getItem(key);
                    var exp = this.localStorage.getItem(key + '_exp');
                    if (!exp || exp < now)
                        return val;
                    else
                        return;
                }
                return this.cookies.get(key);

            }

            Storage.prototype.remove = function(key) {
                if (this.localStorage) {
                    return this.localStorage.removeItem(key);
                }
                return this.cookies.remove(key);
            }

            function _getStorage() {
                return Storage();
            }

            function _refreshToken(fn) {
                fn(function(data) {
                    data = {
                        "access_token": "ACCESS_TOKEN",
                        "expires_in": 7200,
                        "refresh_token": "REFRESH_TOKEN"
                    };

                    var storage = this._getStorage();
                    storage.set(this.tokenName, data['access_token']);
                    storage.set(this.tokenName + '_exp', data['access_token']);
                    storage.set(this.refreshTokenName, data['refresh_token']);
                });
            }

            function getToken() {
                return _getStorage.get(this.tokenName);
            }

            return {
                getStorage: _getStorage,
                refreshToken: _refreshToken,
                getToken: getToken
            }
        }];


    })
    .config(['', function() {

    }])
