angular.module('GeoTrouvetouServices', ['ES']).factory('geoTrouvetou', [
  '$http',
  'es',
  '$q',
  function ($http, es, $q) {
    var geoTrouvetou = {
        beautifull: function (doc, options) {
          options = options || {};
          options.full = options.full || false;
          doc.beautifullName = '';
          if (doc.fullClean) {
            doc.beautifullName = doc.fullClean;
          } else {
            if (doc.natureVoie) {
              var stop = [
                  'Voie provisoire',
                  'Lieu dit',
                  'Ensemble immobilier',
                  'Cit\xe9 '
                ];
              var ok = stop.indexOf(doc.natureVoie);
              if (ok === -1 || options.full === true) {
                doc.beautifullName = doc.natureVoie.trim() + ' ';
              } else {
                doc.beautifullName = '';
              }
            }
            if (doc.nameClean) {
              if (doc.namePrefix) {
                doc.beautifullName = doc.beautifullName + doc.namePrefix + doc.nameClean;
              } else {
                doc.beautifullName = doc.beautifullName + doc.nameClean;
              }
            } else {
              doc.beautifullName = doc.beautifullName + doc.name;
            }
          }
          return doc.beautifullName;
        },
        getCommune: function (doc, cb, options) {
          options = options || {};
          options.parent = doc.departement || doc.insee.slice(0, 2);
          es.get(doc.insee, 'commune', cb, options);
        },
        getList: function (ids, cb, options) {
          options = options || {};
          options.routing = ids[0].slice(0, 2);
          es.multiGet(ids, cb, options);
        },
        getDepartement: function (doc, cb, params) {
          es.get(doc.departement, 'departement', cb);
        },
        getVoie: function (doc, cb) {
          options = {
            parent: doc.insee || doc.id.slice(0, 5),
            routing: doc.departement || doc.id.slice(0, 2)
          };
          es.get(doc.id, 'voie', cb, options);
        },
        getType: function (id, cb, params) {
          es.get(id, '_all', cb, params);
        },
        getCommunes: function (parent, cb, data, params, filters) {
          data = data || {
            'from': 0,
            'size': 20,
            'sort': 'insee'
          };
          params = params || {};
          params.type = 'commune';
          data.query = {
            has_parent: {
              parent_type: 'departement',
              query: { term: { departement: parent.departement } }
            }
          };
          es.search(data, cb, params, filters);
        },
        getDepartements: function (cb, data, params, filters) {
          data = data || {
            'from': 0,
            'size': 20,
            'sort': ['departement']
          };
          params = params || {};
          params.type = 'departement';
          data.query = { 'match_all': {} };
          es.search(data, cb, params, filters);
        },
        getVoies: function (parent, cb, data, params, filters) {
          data = data || {
            'from': 0,
            'size': 20,
            'sort': ['id']
          };
          params = params || {};
          params.type = 'voie';
          data.query = {
            has_parent: {
              parent_type: 'commune',
              query: { term: { insee: parent.insee } }
            }
          };
          es.search(data, cb, params, filters);
        },
        getCP: function (doc, cb, data, params, filters) {
          data = data || {
            size: 20,
            from: 0
          };
          data.query = { 'prefix': { 'codePostal': doc.codePostal } };
          es.search(data, cb, params, filters);
        },
        getFull: function (doc, cb, options) {
          options = options || { type: 'voie' };
          switch (options.type) {
          case 'departement':
            geoTrouvetou.getDepartement(doc, function (data, status) {
              cb(data._source, status);
            });
            break;
          case 'commune':
            geoTrouvetou.getCommune(doc, function (commune, status) {
              geoTrouvetou.getFull(commune._source, function (dept, status) {
                commune._source.dept = dept;
                cb(commune._source, status);
              }, { 'type': 'departement' });
            });
            break;
          case 'voie':
            geoTrouvetou.getVoie(doc, function (voie, status) {
              geoTrouvetou.getFull(voie._source, function (commune, status) {
                voie._source.commune = commune;
                cb(voie._source, status);
              }, { 'type': 'commune' });
            });
            break;
          }
        },
        getCadastre: function (doc, cb, options) {
          var url = 'http://www.cadastre.gouv.fr/scpc/rechercherPlan.do?';
          options = options || {};
          options.type = options.type || 'voie';
          if (doc.natureVoie == 'Lieu dit') {
            url = url + 'lieuDit=' + doc.name + '&';
          } else {
            url = url + 'nomVoie=' + doc.name + '&';
          }
          url = url + 'ville=' + doc.commune.name + '&';
          url = url + 'codeDepartement=' + '0' + doc.departement;
          return url;
        },
        getOpenStreetMap: function (doc, cb, options) {
          var url = 'http://nominatim.openstreetmap.org/search/FR/';
          options = options || {};
          options.type = options.type || 'voie';
          if (typeof doc.commune !== 'undefined') {
            url = url + geoTrouvetou.beautifull(doc.commune.dept) + '/' + geoTrouvetou.beautifull(doc.commune) + '/' + geoTrouvetou.beautifull(doc);
          } else {
            if (typeof doc.dept !== 'undefined') {
              url = url + doc.dept.name + '/' + doc.name;
            } else {
              url = url + doc.name;
            }
          }
          $http({
            method: 'GET',
            params: {
              'format': 'jsonv2',
              'addressdetails': 1
            },
            url: url
          }).success(function (data) {
            if (data.length !== 0) {
              cb(data[0]);
            } else {
              cb(data);
            }
          });
        },
        bulk: function (body, options) {
          return es.bulk(body, options);
        },
        put: function (doc, params) {
          params = params || {
            'type': 'voie',
            'parent': doc.insee,
            'routing': doc.departement
          };
          var id;
          var deferred = $q.defer();
          switch (params.type) {
          case 'voie':
            id = doc.id;
            geoTrouvetou.getFull({ insee: doc.insee }, function (fullComm) {
              doc.voie_suggest = {
                'input': [
                  geoTrouvetou.beautifull(doc),
                  doc.name
                ],
                'output': geoTrouvetou.beautifull(doc) + ' - ' + geoTrouvetou.beautifull(fullComm) + ' - ' + fullComm.codePostal,
                'payload': { 'id': doc.id }
              };
              deferred.resolve(es.put(id, params.type, doc, params));
            }, { type: 'commune' });
            break;
          case 'commune':
            id = doc.insee;
            geoTrouvetou.getDepartement(doc, function (dept) {
              doc.commune_suggest = {
                'input': [
                  geoTrouvetou.beautifull(doc),
                  doc.name
                ],
                'output': geoTrouvetou.beautifull(doc) + ' - ' + geoTrouvetou.beautifull(dept),
                'payload': { 'id': doc.insee }
              };
              deferred.resolve(es.put(id, params.type, doc, params));
            });
            break;
          }
          return deferred.promise;
        },
        update: function (doc, update, params) {
          params = params || {
            'type': 'voie',
            'parent': doc.insee,
            'routing': doc.departement,
            refresh: true
          };
          data = {};
          var deferred = $q.defer();
          if (update.value) {
            switch (params.type) {
            case 'voie':
              geoTrouvetou.getFull(doc, function (docFull) {
                docFull[update.field] = update.value;
                data.doc = {};
                data.doc[update.field] = update.value;
                data.doc.voie_suggest = {
                  'input': [
                    geoTrouvetou.beautifull(docFull),
                    docFull.name
                  ],
                  'output': geoTrouvetou.beautifull(docFull) + ' - ' + geoTrouvetou.beautifull(docFull.commune) + ' - ' + docFull.commune.codePostal,
                  'payload': { 'id': docFull.id }
                };
                deferred.resolve(es.update(doc.id, 'voie', data, params));
              });
              break;
            case 'commune':
              geoTrouvetou.getFull(doc, function (docFull) {
                docFull[update.field] = update.value;
                data.doc = {};
                data.doc[update.field] = update.value;
                data.doc.commune_suggest = {
                  'input': [
                    geoTrouvetou.beautifull(docFull),
                    docFull.name
                  ],
                  'output': geoTrouvetou.beautifull(docFull) + ' - ' + geoTrouvetou.beautifull(docFull.dept) + ' - ' + docFull.codePostal,
                  'payload': { 'id': docFull.insee }
                };
                deferred.resolve(es.update(doc.insee, 'commune', data, params));
              }, { type: 'commune' });
              break;
            }
          } else {
            switch (params.type) {
            case 'voie':
              deferred.resolve(es.update(doc.id, params.type, { 'script': 'ctx._source.remove("' + update.field + '")' }, params));
              break;
            case 'commune':
              console.log({ 'script': 'ctx._source.remove("' + update.field + '")' });
              deferred.resolve(es.update(doc.insee, params.type, { 'script': 'ctx._source.remove("' + update.field + '")' }, params));
              break;
            }
          }
          return deferred.promise;
        },
        typeVoies: [
          'Abbaye ',
          'A\xe9rodrome ',
          'A\xe9rogare ',
          'Agglom\xe9ration ',
          'Aire ',
          'All\xe9e ',
          'Ancien chemin ',
          'Ancienne route ',
          'Angle ',
          'Arcade ',
          'Autoroute  ',
          'Avenue ',
          'Barri\xe8re ',
          'Bas chemin ',
          'Bastide ',
          'Bastion ',
          'Bassin ',
          'Berge ',
          'Bois ',
          'Boucle ',
          'Boulevard ',
          'Bourg ',
          'Bretelle ',
          'Butte ',
          'Cale ',
          'Camin ',
          'Camp ',
          'Camping ',
          'Canal ',
          'Carre ',
          'Carrefour ',
          'Carriera ',
          'Carri\xe8re ',
          'Caserne ',
          'Centre ',
          'Champ ',
          'Chasse ',
          'Ch\xe2teau ',
          'Chauss\xe9e ',
          'Chemin ',
          'Cheminement ',
          'Chemin communal ',
          'Chemin d\xe9partemental ',
          'Chemin rural ',
          'Chemin forestier ',
          'Chemin vicinal ',
          'Cit\xe9 ',
          'Clos ',
          'Contour ',
          'Corniche ',
          'Coron ',
          'Couloir ',
          'Cours ',
          'Coursive ',
          'C\xf4te ',
          'Croix ',
          'Darse ',
          'Descente ',
          'D\xe9viation ',
          'Digue ',
          'Domaine ',
          'Draille ',
          '\xc9cart ',
          '\xc9cluse ',
          'Embranchement ',
          'Emplacement ',
          'Enclave ',
          'Enclos ',
          'Escalier ',
          'Espace ',
          'Esplanade ',
          '\xc9tang ',
          'Faubourg ',
          'Ferme ',
          'Fond ',
          'Fontaine ',
          'For\xeat ',
          'Fosse ',
          'Galerie ',
          'Grand boulevard ',
          'Grand place ',
          'Grande rue ',
          'Gr\xe9ve ',
          'Habitation ',
          'Halage ',
          'Halle ',
          'Hameau ',
          'Hauteur ',
          'Hippodrome ',
          'Impasse ',
          'Jardin ',
          'Jet\xe9e ',
          'Lev\xe9e ',
          'Ligne ',
          'Lotissement ',
          'Maison ',
          'March\xe9 ',
          'Marina ',
          'Mont\xe9e ',
          'Morne ',
          'Nouvelle route ',
          'Parc ',
          'Parking ',
          'Parvis ',
          'Passage ',
          'Passerelle ',
          'Petit chemin ',
          'Petite all\xe9e ',
          'Petite avenue ',
          'Petite route ',
          'Petite rue ',
          'Phare ',
          'Piste ',
          'Placa ',
          'Place ',
          'Placette ',
          'Placis ',
          'Plage ',
          'Plaine ',
          'Plateau ',
          'Pointe ',
          'Porche ',
          'Porte ',
          'Poste ',
          'Poterne ',
          'Promenade ',
          'Quai ',
          'Quartier ',
          'Raccourci ',
          'Rampe ',
          'Ravine ',
          'Rempart ',
          'R\xe9sidence ',
          'Rocade ',
          'Rond-point ',
          'Rotonde ',
          'Route ',
          'Route d\xe9partementale ',
          'Route nationale ',
          'Rue ',
          'Ruelle ',
          'Ruellette ',
          'Ruette ',
          'Ruisseau ',
          'Sentier ',
          'Square ',
          'Stade ',
          'Terrain ',
          'Terrasse ',
          'Terre ',
          'Terre-plein ',
          'Tertre ',
          'Traboule ',
          'Traverse ',
          'Tunnel ',
          'Vall\xe9e ',
          'Venelle ',
          'Viaduc ',
          'Vieille route ',
          'Vieux chemin ',
          'Villa ',
          'Village ',
          'Ville ',
          'Voie communale ',
          'Voirie ',
          'Vo\xfbte ',
          'Voyeul ',
          'Zone artisanale ',
          'Zone d\'am\xe9nagement concert\xe9e ',
          'Zone industrielle '
        ],
        typeVoiesDetail: {
          'ABE ': 'Abbaye ',
          'AER ': 'A\xe9rodrome ',
          'AERG': 'A\xe9rogare ',
          'AGL ': 'Agglom\xe9ration ',
          'AIRE': 'Aire ',
          'ALL ': 'All\xe9e ',
          'ACH ': 'Ancien chemin ',
          'ART ': 'Ancienne route ',
          'ANGL': 'Angle ',
          'ARC ': 'Arcade ',
          'AUT ': 'Autoroute  ',
          'AV  ': 'Avenue ',
          'BRE ': 'Barri\xe8re ',
          'BCH ': 'Bas chemin ',
          'BSTD': 'Bastide ',
          'BAST': 'Bastion ',
          'BSN ': 'Bassin ',
          'BER ': 'Berge ',
          'BOIS': 'Bois ',
          'BCLE': 'Boucle ',
          'BD  ': 'Boulevard ',
          'BRG ': 'Bourg ',
          'BRTL': 'Bretelle ',
          'BUT ': 'Butte ',
          'CALE': 'Cale ',
          'CAMI': 'Camin ',
          'CAMP': 'Camp ',
          'CPG ': 'Camping ',
          'CAN ': 'Canal ',
          'CARR': 'Carre ',
          'CAR ': 'Carrefour ',
          'CAE ': 'Carriera ',
          'CARE': 'Carri\xe8re ',
          'CASR': 'Caserne ',
          'CTRE': 'Centre ',
          'CHP ': 'Champ ',
          'CHA ': 'Chasse ',
          'CHT ': 'Ch\xe2teau ',
          'CHS ': 'Chauss\xe9e ',
          'CHE ': 'Chemin ',
          'CHEM': 'Cheminement ',
          'CC  ': 'Chemin communal ',
          'CD  ': 'Chemin d\xe9partemental ',
          'CR  ': 'Chemin rural ',
          'CF  ': 'Chemin forestier ',
          'CHV ': 'Chemin vicinal ',
          'CITE': 'Cit\xe9 ',
          'CLOS': 'Clos ',
          'CTR ': 'Contour ',
          'COR ': 'Corniche ',
          'CORO': 'Coron ',
          'CLR ': 'Couloir ',
          'CRS ': 'Cours ',
          'CIVE': 'Coursive ',
          'COTE': 'C\xf4te ',
          'CRX ': 'Croix ',
          'DARS': 'Darse ',
          'DSC ': 'Descente ',
          'DEVI': 'D\xe9viation ',
          'DIG ': 'Digue ',
          'DOM ': 'Domaine ',
          'DRA ': 'Draille ',
          'ECA ': '\xc9cart ',
          'ECL ': '\xc9cluse ',
          'EMBR': 'Embranchement ',
          'EMP ': 'Emplacement ',
          'ENV ': 'Enclave ',
          'ENC ': 'Enclos ',
          'ESC ': 'Escalier ',
          'ESPA': 'Espace ',
          'ESP ': 'Esplanade ',
          'ETNG': '\xc9tang ',
          'FG  ': 'Faubourg ',
          'FRM ': 'Ferme ',
          'FD  ': 'Fond ',
          'FON ': 'Fontaine ',
          'FOR ': 'For\xeat ',
          'FOS ': 'Fosse ',
          'GAL ': 'Galerie ',
          'GBD ': 'Grand boulevard ',
          'GPL ': 'Grand place ',
          'GR  ': 'Grande rue ',
          'GREV': 'Gr\xe9ve ',
          'HAB ': 'Habitation ',
          'HLG ': 'Halage ',
          'HLE ': 'Halle ',
          'HAM ': 'Hameau ',
          'HTR ': 'Hauteur ',
          'HIP ': 'Hippodrome ',
          'IMP ': 'Impasse ',
          'JARD': 'Jardin ',
          'JTE ': 'Jet\xe9e ',
          'LEVE': 'Lev\xe9e ',
          'LIGN': 'Ligne ',
          'LOT ': 'Lotissement ',
          'MAIS': 'Maison ',
          'MAR ': 'March\xe9 ',
          'MRN ': 'Marina ',
          'MTE ': 'Mont\xe9e ',
          'MNE ': 'Morne ',
          'NTE ': 'Nouvelle route ',
          'PARC': 'Parc ',
          'PKG ': 'Parking ',
          'PRV ': 'Parvis ',
          'PAS ': 'Passage ',
          'PLE ': 'Passerelle ',
          'PCH ': 'Petit chemin ',
          'PTA ': 'Petite all\xe9e ',
          'PAE ': 'Petite avenue ',
          'PRT ': 'Petite route ',
          'PTR ': 'Petite rue ',
          'PHAR': 'Phare ',
          'PIST': 'Piste ',
          'PLA ': 'Placa ',
          'PL  ': 'Place ',
          'PTTE': 'Placette ',
          'PLCI': 'Placis ',
          'PLAG': 'Plage ',
          'PLN ': 'Plaine ',
          'PLT ': 'Plateau ',
          'PNT ': 'Pointe ',
          'PCHE': 'Porche ',
          'PTE ': 'Porte ',
          'POST': 'Poste ',
          'POT ': 'Poterne ',
          'PROM': 'Promenade ',
          'QUAI': 'Quai ',
          'QUA ': 'Quartier ',
          'RAC ': 'Raccourci ',
          'RPE ': 'Rampe ',
          'RVE ': 'Ravine ',
          'REM ': 'Rempart ',
          'RES ': 'R\xe9sidence ',
          'ROC ': 'Rocade ',
          'RPT ': 'Rond-point ',
          'RTD ': 'Rotonde ',
          'RTE ': 'Route ',
          'D   ': 'Route d\xe9partementale ',
          'N   ': 'Route nationale ',
          'RUE ': 'Rue ',
          'RLE ': 'Ruelle ',
          'RULT': 'Ruellette ',
          'RUET': 'Ruette ',
          'RUIS': 'Ruisseau ',
          'SEN ': 'Sentier ',
          'SQ  ': 'Square ',
          'STDE': 'Stade ',
          'TRN ': 'Terrain ',
          'TSSE': 'Terrasse ',
          'TER ': 'Terre ',
          'TPL ': 'Terre-plein ',
          'TRT ': 'Tertre ',
          'TRAB': 'Traboule ',
          'TRA ': 'Traverse ',
          'TUN ': 'Tunnel ',
          'VALL': 'Vall\xe9e ',
          'VEN ': 'Venelle ',
          'VIAD': 'Viaduc ',
          'VTE ': 'Vieille route ',
          'VCHE': 'Vieux chemin ',
          'VLA ': 'Villa ',
          'VGE ': 'Village ',
          'VIL ': 'Ville ',
          'VC  ': 'Voie communale ',
          'VOIR': 'Voirie ',
          'VOUT': 'Vo\xfbte ',
          'VOY ': 'Voyeul ',
          'ZA  ': 'Zone artisanale ',
          'ZAC ': 'Zone d\'am\xe9nagement concert\xe9e ',
          'ZI  ': 'Zone industrielle '
        }
      };
    return geoTrouvetou;
  }
]).directive('whenScrolled', function () {
  'use strict';
  return function (scope, elm, attr) {
    var raw = elm[0];
    elm.bind('scroll', function () {
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        scope.$apply(attr.whenScrolled);
      }
    });
  };
});