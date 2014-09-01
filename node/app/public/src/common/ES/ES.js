angular.module('ES', []).factory('es', [
  '$http',
  '$q',
  function ($http, $q) {
    var index = 'fantoir_base';
    var es = {
        status: function (cb, options) {
          var url = 'http://localhost:9200/_status';
          return $http({
            method: 'GET',
            url: url,
            params: options,
            cache: true
          }).success(function (data, status) {
            cb(data, status);
          }).error(function (data, status) {
            cb(data, status);
          });
        },
        isOk: function (cb) {
          es.status(function (data, status) {
            if (status == '200') {
              if (data._shards.total == data._shards.successful) {
                cb('success');
              } else {
                if (data._shards.total > data._shards.successful && data._shards.successful >= Object.keys(data.indices[index].shards).length) {
                  cb('warning');
                } else {
                  cb('danger');
                }
              }
            } else {
              cb('danger');
            }
          });
        },
        get: function (id, type, cb, params) {
          var url = 'http://localhost:9200/' + index + '/' + type + '/' + id;
          return $http({
            method: 'GET',
            url: url,
            params: params,
            cache: true
          }).success(cb).error(cb);
        },
        multiGet: function (ids, cb, params) {
          var url = 'http://localhost:9200/' + index + '/_mget';
          $http({
            method: 'POST',
            data: { 'ids': ids },
            url: url,
            params: params,
            cache: true
          }).success(cb).error(cb);
        },
        put: function (id, type, data, params) {
          var deferred = $q.defer();
          var url = 'http://localhost:9200/' + index + '/' + type + '/' + id;
          $http({
            method: 'POST',
            url: url,
            params: params,
            data: data,
            cache: false
          }).success(function (data, status) {
            deferred.resolve(data, status);
          }).error(function (data, status) {
            deferred.reject(data, status);
          });
          return deferred.promise;
        },
        update: function (id, type, data, params) {
          var deferred = $q.defer();
          var url = 'http://localhost:9200/' + index + '/' + type + '/' + id + '/_update';
          $http({
            method: 'POST',
            url: url,
            params: params,
            data: data,
            cache: false
          }).success(function (data, status) {
            deferred.resolve(data, status);
          }).error(function (data, status) {
            deferred.reject(data, status);
          });
          return deferred.promise;
        },
        search: function (data, cb, params, filters) {
          var url = 'http://localhost:9200/' + index + '/_search';
          if (filters) {
            var temp = {
                filtered: {
                  query: data.query,
                  filter: filters
                }
              };
            data.query = temp;
            temp = undefined;
          }
          $http({
            method: 'POST',
            url: url,
            params: params,
            data: data,
            cache: true
          }).success(function (data, status) {
            cb(data, status);
          });
        },
        suggest: function (text, type, data, params) {
          var deferred = $q.defer();
          data = data || {};
          params = params || {};
          params.type = type;
          data.suggest = {
            'text': text,
            'completion': { 'field': type + '_suggest' }
          };
          var url = 'http://localhost:9200/' + index + '/_suggest';
          $http({
            method: 'POST',
            url: url,
            params: params,
            data: data,
            cache: true
          }).success(function (data, status) {
            deferred.resolve(data, status);
          }).error(function (data, status) {
            deferred.reject(data, status);
          });
          return deferred.promise;
        },
        bulk: function (body, options) {
          var url = 'http://localhost:9200/fantoir_base/_bulk';
          return $http({
            method: 'POST',
            url: url,
            data: body,
            params: options,
            cache: true
          });
        }
      };
    return es;
  }
]);