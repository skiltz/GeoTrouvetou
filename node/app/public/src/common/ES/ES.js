angular.module( 'ES', [] )

.factory( 'es', function($http) {
  index = "fantoir_base";
  var es = {
    status : function(cb,options) {
      var url = 'http://localhost:9200/_status';
      return $http({
        method: 'GET',
        url: url,
        params: options,
        cache: true
      })
      .success(function (data,status) {
        cb(data,status);
      })
      .error(function (data,status){
        cb(data,status);
      })
      ;

    },
    isOk : function(cb){
      es.status(function(data,status){
        if (status=="200") {
          if (data._shards.total == data._shards.successful) {
            cb("success");
          }
          else {
            if (data._shards.total > data._shards.successful && data._shards.successful >= Object.keys(data.indices[index].shards).length) {
              cb("warning");
            }
            else {
              cb("danger");
            }
          }
        }
        else {
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
    get : function(id,type,cb,options) {
      var url = 'http://localhost:9200/'+ index +'/'+ type +'/'+id;
      return $http({
        method: 'GET',
        url: url,
        params: options,
        cache: true
      })
      .success(cb)
      .error(function (data,status){
        cb(data,status);
      })
      ;
    },
    /**
      update : update a document in index
      id: id of document
      type : type of document
      data : data will be posted
      options are params

    **/
    update : function(id,type,data,cb,options){
      var url = 'http://localhost:9200/'+ index +'/'+ type +'/'+id+'/_update';
      // nedded???
      if (options.routing){
        url = url + '?routing='+options.routing;
      }
      $http({
        method: 'POST',
        url: url,
        params : options,
        data : data,
        cache: false
      })
      .success(function (data) {
        cb(true);
      });
    },
    search : function(data,cb,params){
      var url = 'http://localhost:9200/'+ index +'/_search';
      $http({
        method: 'POST',
        url: url,
        params : params,
        data : data,
        cache: true
      })
      .success(function (data,status) {
        cb(data,status);
      });
    },
    suggest : function(text,type,cb,data,params){
      data = data || {};
      params = params || {};
      params.type = type;
      data.suggest = {
        "text": text,
        "completion": {
          "field": type + '_suggest'
        }
      };
      var url = 'http://localhost:9200/'+ index +'/_suggest';
      $http({
        method: 'POST',
        url: url,
        params : params,
        data : data,
        cache: true
      })
      .success(cb);
    }


  };
  return es;
})
;