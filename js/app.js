/**
 * INSPINIA - Responsive Admin Theme
 *
 */
(function () {
    angular.module('inmobiliaria', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
    ])
    .factory('netService', function($http){
        var urlBE = '/urrizagaBE/';
        var get = function(info, params, cb, cb2){
            $http({
                method: 'post',
                url: urlBE,
                data: {
                    operation: 'get',
                    target: info,
                    params: params
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                console.log(response);
                cb(response.data);
            }, function(response){
                cb2(response.data);
            });
        }
        var post = function(target, data, cb, cb2){
            $http({
                method: 'post',
                url: urlBE,
                data: {
                    operation: 'post',
                    target: target,
                    data: data
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                cb(response.data);
            }, function(response){
                cb2(response);
            });
        }
        var put = function(target, data, cb, cb2){
            $http({
                method: 'post',
                url: urlBE,
                data: {
                    operation: 'put',
                    target: target,
                    data: data
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                console.log(response.data);
                cb(response.data);
            }, function(response){
                console.log(response);
                cb2(response);
            });
        }
        return {
            get: get,
            post: post,
            put: put
        };
    })
    .filter('nameUnidad', function() {
      return function(input) {
        var out;
        switch (input){
            case 'c': out = 'Cochera'; break;
            case 'd': out = 'Departamento'; break;
            case 'k': out = 'Casa'; break;
            case 't': out = 'Terreno'; break;
        }
        return out;
      };
    })
})();

