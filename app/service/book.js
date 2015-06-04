;
angular.module('doog.library-www').factory('BookService', ['$resource', function($resource) {
    return $resource('/app/data/books.json', {
        id: "@Id"
    }, {
        // 新书
        express: {
            url: '/app/data/books-express.json',
            isArray: true,
            params: {
                q: '宫崎骏'
            }
        },
        // 热榜
        popular: {
            url: '/app/data/books-express.json',
            isArray: true,
            params: {
                q: '宫崎骏'
            }
        }
    });
}]);
