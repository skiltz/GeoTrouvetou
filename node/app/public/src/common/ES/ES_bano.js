angular.module('ES_bano', ['ui.bootstrap'])

.factory('bano', ['$http', '$q',
  function ($http, $q) {
    var index = "bano";
    var type = "addresse";
    var bano = {
      status: function (cb, options) {
        var url = 'http://localhost:9200/_status';
        return $http({
          method: 'GET',
          url: url,
          params: options,
          cache: true
        })
          .success(function (data, status) {
            cb(data, status);
          })
          .error(function (data, status) {
            cb(data, status);
          });

      },
      isOk: function (cb) {
        es.status(function (data, status) {
          if (status == "200") {
            if (data._shards.total == data._shards.successful) {
              cb("success");
            } else {
              if (data._shards.total > data._shards.successful && data._shards.successful >= Object.keys(data.indices[index].shards).length) {
                cb("warning");
              } else {
                cb("danger");
              }
            }
          } else {
            cb("danger");
          }
        });
      },
      /**
      get: get an element by id, type
      options: {
        parent : "12345"
      }

    **/
      get: function (id, cb, options) {
        var url = 'http://localhost:9200/' + index + '/' + type + '/' + id;
        return $http({
          method: 'GET',
          url: url,
          params: options,
          cache: true
        })
          .success(cb)
          .error(function (data, status) {
            cb(data, status);
          });
      },
      /**
      update : update a document in index
      id: id of document
      data : data will be posted
      options are params

    **/
      update: function (id, data, cb, options) {
        var url = 'http://localhost:9200/' + index + '/' + type + '/' + id + '/_update';
        // nedded???

        $http({
          method: 'POST',
          url: url,
          params: options,
          data: data,
          cache: false
        })
          .success(function (data) {
            cb(true);
          });
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
        console.log({
          data: data,
          params: params
        });
        console.log(JSON.stringify(data));
        $http({
          method: 'POST',
          url: url,
          params: params,
          data: data,
          cache: true
        })
          .success(function (data, status) {
            cb(data, status);
          });
      },
      bulk: function (body, options) {
        var url = 'http://localhost:9200/bano/_bulk';
        return $http({
          method: 'POST',
          url: url,
          data: body,
          params: options,
          cache: true
        });
      }


    };
    return bano;
  }
]);