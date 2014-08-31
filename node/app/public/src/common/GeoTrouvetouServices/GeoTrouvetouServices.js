angular.module( 'GeoTrouvetouServices', ['ES'] )

.factory( 'geoTrouvetou', function($http,es) {
  var geoTrouvetou = {
 
    beautifull : function(doc,options){
      options = options || {};
      options.full = options.full || false;
      if (doc.natureVoie) {
        var stop = ['Voie provisoire', 'Lieu dit', 'Ensemble immobilier', 'Cité '];
        var ok = stop.indexOf(doc.natureVoie);
        if ( ok === -1 || options.full===true) {
          doc.beautifullName = doc.natureVoie.trim() + ' ';
        }
        else {
          doc.beautifullName = '';
        }
      }
      else {
        doc.beautifullName= '';
      }
      if (doc.fullClean) {
        doc.beautifullName = doc.beautifullName + doc.fullClean;
      }
      else {
        if (doc.nameClean) {
          if (doc.namePrefix) {
            doc.beautifullName = doc.beautifullName + doc.namePrefix + doc.nameClean;
          }
          else {
            doc.beautifullName = doc.beautifullName + doc.nameClean;
          }
        }
        else {
          doc.beautifullName = doc.beautifullName + doc.name;
        }
      }
      return (doc.beautifullName);
    },
    getCommune : function(doc,cb,options) {
      parent = doc.departement || doc.insee.slice(0,2);
      es.get(doc.insee,'commune',function(data,status){
        cb(data,status);
      },{parent:parent});
      
    },
    getDepartement :function(doc,cb, params) {
      es.get(doc.departement,'departement',function(data,status){
        cb(data,status);
      });
    },
    getVoie : function(doc,cb) {
      options = {
        parent : doc.insee || doc.id.slice(0,5),
        routing : doc.departement || doc.id.slice(0,2)
      };
      es.get(doc.id,'voie',cb,options);
    },
    getCommunes : function(parent,cb,data,params){
      data = data || {"from": 0,"size": 20,"sort":"insee"};
      data.query = {
        has_parent : {
          parent_type : "departement",
          query : {
            term : {
              departement : parent.departement
            }
          }
        }
      };
      es.search(data,cb,params);
    },
    getDepartements : function(cb,data,params) {
      data = data || {"from": 0,"size": 20,"sort": "departement"};
      params = params ||{};
      params.type="departement";
      data.query = {
        "match_all": {}
      };
      es.search(data,cb,params);
    },
    getVoies : function(parent,cb,data,params) {
      data = data || {"from": 0,"size": 20,"sort":"id"};
      data.query = {
        has_parent : {
          parent_type : "commune",
          query : {
            term : {
              insee : parent.insee
            }
          }
        }
      };
      es.search(data,cb,params);
    },
    getCP : function(doc,cb,data,params) {
      data = data || {size:20,from:0};
      data.query = {
        "prefix": {
          "codePostal": doc.codePostal
        }
      };
      es.search(data,cb,params);

    },
    getFull : function(doc,cb,options) {
      options = options || {type : 'voie'};
      switch(options.type) {
      case 'departement' :
        geoTrouvetou.getDepartement(doc,function(data,status){
          cb(data._source,status);
        });
        break;
      case 'commune' :
        geoTrouvetou.getCommune(doc,function(commune,status){
          geoTrouvetou.getFull(commune._source,function(dept,status){
            commune._source.dept = dept;
            cb(commune._source,status);
          },{'type':'departement'});
        });
        break;
      case 'voie' :
        geoTrouvetou.getVoie(doc,function(voie,status){
          geoTrouvetou.getFull(voie._source,function(commune,status) {
            voie._source.commune = commune;
            cb(voie._source,status);
          },{'type':'commune'});
        });
        break;
      }
    },
    getCadastre : function(doc,cb,options){
      var url = 'http://www.cadastre.gouv.fr/scpc/rechercherPlan.do?';
      options = options || {};
      options.type = options.type || 'voie';
      if(doc.natureVoie == "Lieu dit") {
        url = url+'lieuDit='+doc.name +"&";
      }
      else {
        url = url+'nomVoie='+doc.name +"&";
      }
      url = url+'ville='+doc.commune.name + '&';
      url = url +'codeDepartement='+'0'+doc.departement;
      return (url);
      
    },
    getOpenStreetMap : function(doc,cb,options){
      var url = 'http://nominatim.openstreetmap.org/search/FR/';
      options = options || {};
      options.type = options.type || 'voie';
      if (typeof (doc.commune) !== 'undefined') {
      url = url + geoTrouvetou.beautifull(doc.commune.dept)+'/'+geoTrouvetou.beautifull(doc.commune)+'/'+geoTrouvetou.beautifull(doc);
      }
      else{
        if (typeof(doc.dept)  !== 'undefined'){
          url = url + doc.dept.name+'/'+doc.name;
        }
        else{
          url = url + doc.name;
        }
      }
      console.log(url);
      $http({
        method: 'GET',
        params: {'format':'jsonv2','addressdetails':1},
        url: url
      })
      .success(function (data) {
        console.log(data);
        if(data.length!==0){
          cb(data[0]);
        }
        else{
          cb(data);
        }
      });
      
    },
    update : function(doc,update,cb,options){
      options = options || {'type':'voie','parent':doc.insee,'routing':doc.departement,refresh:true};
      switch(options.type) {
      case 'voie' :
        var url = "http://localhost:9200/fantoir_base/voie/"+doc.id+"/_update?routing="+options.routing;
        geoTrouvetou.getFull(doc,function(docFull){
          docFull[update.field] = update.value;
          console.log(docFull);
          
            options.doc = {};
            options.doc[update.field] = update.value;
            options.doc.voie_suggest = {
              "input": [
                geoTrouvetou.beautifull(docFull)
              ],
              "output": geoTrouvetou.beautifull(docFull)+" - "+geoTrouvetou.beautifull(docFull.commune)+" - "+docFull.commune.codePostal,
              "payload": {
                "id": docFull.id
              }
            };
            $http({
              method: 'POST',
              url: url,
              data : options,
              cache: false
            })
            .success(function (data) {
              return true;
            });
          
          
        });
        break;
      }
    }
  };
  return geoTrouvetou;
})
.directive('whenScrolled', function () {
        "use strict";
        return function (scope, elm, attr) {
            var raw = elm[0];
            elm.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    scope.$apply(attr.whenScrolled);
                }
            });
        };
    })
;

