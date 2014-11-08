angular.module('GeoTrouvetouServices', ['ES'])

.factory('geoTrouvetou', ['$http', 'es', '$q',

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
            var stop = ['Voie provisoire', 'Lieu dit', 'Ensemble immobilier', 'Cité '];
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
        return (doc.beautifullName);
      },
      getCommune: function (doc, cb, options) {
        options = options || {};
        options.parent = doc.departement || doc.insee.slice(0, 2); // TODO: Fix for 97X
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
          "from": 0,
          "size": 20,
          "sort": "insee"
        };
        params = params || {};
        params.type = "commune";
        data.query = {
          has_parent: {
            parent_type: "departement",
            query: {
              term: {
                departement: parent.departement
              }
            }
          }
        };
        es.search(data, cb, params, filters);
      },
      getDepartements: function (cb, data, params, filters) {
        data = data || {
          "from": 0,
          "size": 20,
          "sort": ["departement"]
        };
        params = params || {};
        params.type = "departement";
        data.query = {
          "match_all": {}
        };
        es.search(data, cb, params, filters);
      },
      getVoies: function (parent, cb, data, params, filters) {
        data = data || {
          "from": 0,
          "size": 20,
          "sort": ["id"]
        };
        params = params || {};
        params.type = "voie";
        data.query = {
          has_parent: {
            parent_type: "commune",
            query: {
              term: {
                insee: parent.insee
              }
            }
          }
        };
        es.search(data, cb, params, filters);
      },
      getCP: function (doc, cb, data, params, filters) {
        data = data || {
          size: 20,
          from: 0
        };
        data.query = {
          "prefix": {
            "codePostal": doc.codePostal
          }
        };
        es.search(data, cb, params, filters);
      },
      getFull: function (doc, cb, options) {
        options = options || {
          type: 'voie'
        };
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
            }, {
              'type': 'departement'
            });
          });
          break;
        case 'voie':
          geoTrouvetou.getVoie(doc, function (voie, status) {
            geoTrouvetou.getFull(voie._source, function (commune, status) {
              voie._source.commune = commune;
              cb(voie._source, status);
            }, {
              'type': 'commune'
            });
          });
          break;
        }
      },
      getCadastre: function (doc, cb, options) {
        var url = 'http://www.cadastre.gouv.fr/scpc/rechercherPlan.do?';
        options = options || {};
        options.type = options.type || 'voie';
        if (doc.natureVoie == "Lieu dit") {
          url = url + 'lieuDit=' + doc.name + "&";
        } else {
          url = url + 'nomVoie=' + doc.name + "&";
        }
        url = url + 'ville=' + doc.commune.name + '&';
        url = url + 'codeDepartement=' + '0' + doc.departement;
        return (url);
      },
      getOpenStreetMap: function (doc, cb, options) {
        var url = 'http://nominatim.openstreetmap.org/search/FR/';
        options = options || {};
        options.type = options.type || 'voie';
        if (typeof (doc.commune) !== 'undefined') {
          url = url + geoTrouvetou.beautifull(doc.commune.dept) + '/' + geoTrouvetou.beautifull(doc.commune) + '/' + geoTrouvetou.beautifull(doc);
        } else {
          if (typeof (doc.dept) !== 'undefined') {
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
        })
          .success(function (data) {
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
          geoTrouvetou.getFull({
            insee: doc.insee
          }, function (fullComm) {
            doc.voie_suggest = {
              "input": [
                geoTrouvetou.beautifull(doc), doc.name
              ],
              "output": geoTrouvetou.beautifull(doc) + " - " + geoTrouvetou.beautifull(fullComm) + " - " + fullComm.codePostal,
              "payload": {
                "id": doc.id
              }
            };
            deferred.resolve(es.put(id, params.type, doc, params));
          }, {
            type: 'commune'
          });
          break;
        case 'commune':
          id = doc.insee; // Need Bano!!!
          geoTrouvetou.getDepartement(doc, function (dept) {
            doc.commune_suggest = {
              "input": [
                geoTrouvetou.beautifull(doc), doc.name
              ],
              "output": geoTrouvetou.beautifull(doc) + " - " + geoTrouvetou.beautifull(dept),
              "payload": {
                "id": doc.insee
              }
              //{"script":"if(ctx._source.containsKey(\"fullClean\")){if(ctx._source.fullClean != fullClean){ctx._source.fullClean = fullClean} else { ctx.op = \"none\" }} else {ctx._source.fullClean = fullClean}","params":{"fullClean":"Rue des Aigrettes"}}
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
                "input": [
                  geoTrouvetou.beautifull(docFull), docFull.name
                ],
                "output": geoTrouvetou.beautifull(docFull) + " - " + geoTrouvetou.beautifull(docFull.commune) + " - " + docFull.commune.codePostal,
                "payload": {
                  "id": docFull.id
                }
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
                "input": [
                  geoTrouvetou.beautifull(docFull), docFull.name
                ],
                "output": geoTrouvetou.beautifull(docFull) + " - " + geoTrouvetou.beautifull(docFull.dept) + " - " + docFull.codePostal,
                "payload": {
                  "id": docFull.insee
                }
                //{"script":"if(ctx._source.containsKey(\"fullClean\")){if(ctx._source.fullClean != fullClean){ctx._source.fullClean = fullClean} else { ctx.op = \"none\" }} else {ctx._source.fullClean = fullClean}","params":{"fullClean":"Rue des Aigrettes"}}
              };
              deferred.resolve(es.update(doc.insee, 'commune', data, params));

            }, {
              type: 'commune'
            });
            break;
          }
        } else {
          switch (params.type) {
          case 'voie':
            deferred.resolve(es.update(doc.id, params.type, {
              "script": "ctx._source.remove(\"" + update.field + "\")"
            }, params));
            break;
          case 'commune':
            console.log({
              "script": "ctx._source.remove(\"" + update.field + "\")"
            });
            deferred.resolve(es.update(doc.insee, params.type, {
              "script": "ctx._source.remove(\"" + update.field + "\")"
            }, params));
            break;
          }
        }

        return deferred.promise;
      },
      typeVoies: [
        "Abbaye ",
        "Aérodrome ",
        "Aérogare ",
        "Agglomération ",
        "Aire ",
        "Allée ",
        "Ancien chemin ",
        "Ancienne route ",
        "Angle ",
        "Arcade ",
        "Autoroute  ",
        "Avenue ",
        "Barrière ",
        "Bas chemin ",
        "Bastide ",
        "Bastion ",
        "Bassin ",
        "Berge ",
        "Bois ",
        "Boucle ",
        "Boulevard ",
        "Bourg ",
        "Bretelle ",
        "Butte ",
        "Cale ",
        "Camin ",
        "Camp ",
        "Camping ",
        "Canal ",
        "Carre ",
        "Carrefour ",
        "Carriera ",
        "Carrière ",
        "Caserne ",
        "Centre ",
        "Champ ",
        "Chasse ",
        "Château ",
        "Chaussée ",
        "Chemin ",
        "Cheminement ",
        "Chemin communal ",
        "Chemin départemental ",
        "Chemin rural ",
        "Chemin forestier ",
        "Chemin vicinal ",
        "Cité ",
        "Clos ",
        "Contour ",
        "Corniche ",
        "Coron ",
        "Couloir ",
        "Cours ",
        "Coursive ",
        "Côte ",
        "Croix ",
        "Darse ",
        "Descente ",
        "Déviation ",
        "Digue ",
        "Domaine ",
        "Draille ",
        "Écart ",
        "Écluse ",
        "Embranchement ",
        "Emplacement ",
        "Enclave ",
        "Enclos ",
        "Escalier ",
        "Espace ",
        "Esplanade ",
        "Étang ",
        "Faubourg ",
        "Ferme ",
        "Fond ",
        "Fontaine ",
        "Forêt ",
        "Fosse ",
        "Galerie ",
        "Grand boulevard ",
        "Grand place ",
        "Grande rue ",
        "Gréve ",
        "Habitation ",
        "Halage ",
        "Halle ",
        "Hameau ",
        "Hauteur ",
        "Hippodrome ",
        "Impasse ",
        "Jardin ",
        "Jetée ",
        "Levée ",
        "Ligne ",
        "Lotissement ",
        "Maison ",
        "Marché ",
        "Marina ",
        "Montée ",
        "Morne ",
        "Nouvelle route ",
        "Parc ",
        "Parking ",
        "Parvis ",
        "Passage ",
        "Passerelle ",
        "Petit chemin ",
        "Petite allée ",
        "Petite avenue ",
        "Petite route ",
        "Petite rue ",
        "Phare ",
        "Piste ",
        "Placa ",
        "Place ",
        "Placette ",
        "Placis ",
        "Plage ",
        "Plaine ",
        "Plateau ",
        "Pointe ",
        "Porche ",
        "Porte ",
        "Poste ",
        "Poterne ",
        "Promenade ",
        "Quai ",
        "Quartier ",
        "Raccourci ",
        "Rampe ",
        "Ravine ",
        "Rempart ",
        "Résidence ",
        "Rocade ",
        "Rond-point ",
        "Rotonde ",
        "Route ",
        "Route départementale ",
        "Route nationale ",
        "Rue ",
        "Ruelle ",
        "Ruellette ",
        "Ruette ",
        "Ruisseau ",
        "Sentier ",
        "Square ",
        "Stade ",
        "Terrain ",
        "Terrasse ",
        "Terre ",
        "Terre-plein ",
        "Tertre ",
        "Traboule ",
        "Traverse ",
        "Tunnel ",
        "Vallée ",
        "Venelle ",
        "Viaduc ",
        "Vieille route ",
        "Vieux chemin ",
        "Villa ",
        "Village ",
        "Ville ",
        "Voie communale ",
        "Voirie ",
        "Voûte ",
        "Voyeul ",
        "Zone artisanale ",
        "Zone d'aménagement concertée ",
        "Zone industrielle "
      ],
      typeVoiesDetail: {
        "ABE ": "Abbaye ",
        "AER ": "Aérodrome ",
        "AERG": "Aérogare ",
        "AGL ": "Agglomération ",
        "AIRE": "Aire ",
        "ALL ": "Allée ",
        "ACH ": "Ancien chemin ",
        "ART ": "Ancienne route ",
        "ANGL": "Angle ",
        "ARC ": "Arcade ",
        "AUT ": "Autoroute  ",
        "AV  ": "Avenue ",
        "BRE ": "Barrière ",
        "BCH ": "Bas chemin ",
        "BSTD": "Bastide ",
        "BAST": "Bastion ",
        "BSN ": "Bassin ",
        "BER ": "Berge ",
        "BOIS": "Bois ",
        "BCLE": "Boucle ",
        "BD  ": "Boulevard ",
        "BRG ": "Bourg ",
        "BRTL": "Bretelle ",
        "BUT ": "Butte ",
        "CALE": "Cale ",
        "CAMI": "Camin ",
        "CAMP": "Camp ",
        "CPG ": "Camping ",
        "CAN ": "Canal ",
        "CARR": "Carre ",
        "CAR ": "Carrefour ",
        "CAE ": "Carriera ",
        "CARE": "Carrière ",
        "CASR": "Caserne ",
        "CTRE": "Centre ",
        "CHP ": "Champ ",
        "CHA ": "Chasse ",
        "CHT ": "Château ",
        "CHS ": "Chaussée ",
        "CHE ": "Chemin ",
        "CHEM": "Cheminement ",
        "CC  ": "Chemin communal ",
        "CD  ": "Chemin départemental ",
        "CR  ": "Chemin rural ",
        "CF  ": "Chemin forestier ",
        "CHV ": "Chemin vicinal ",
        "CITE": "Cité ",
        "CLOS": "Clos ",
        "CTR ": "Contour ",
        "COR ": "Corniche ",
        "CORO": "Coron ",
        "CLR ": "Couloir ",
        "CRS ": "Cours ",
        "CIVE": "Coursive ",
        "COTE": "Côte ",
        "CRX ": "Croix ",
        "DARS": "Darse ",
        "DSC ": "Descente ",
        "DEVI": "Déviation ",
        "DIG ": "Digue ",
        "DOM ": "Domaine ",
        "DRA ": "Draille ",
        "ECA ": "Écart ",
        "ECL ": "Écluse ",
        "EMBR": "Embranchement ",
        "EMP ": "Emplacement ",
        "ENV ": "Enclave ",
        "ENC ": "Enclos ",
        "ESC ": "Escalier ",
        "ESPA": "Espace ",
        "ESP ": "Esplanade ",
        "ETNG": "Étang ",
        "FG  ": "Faubourg ",
        "FRM ": "Ferme ",
        "FD  ": "Fond ",
        "FON ": "Fontaine ",
        "FOR ": "Forêt ",
        "FOS ": "Fosse ",
        "GAL ": "Galerie ",
        "GBD ": "Grand boulevard ",
        "GPL ": "Grand place ",
        "GR  ": "Grande rue ",
        "GREV": "Gréve ",
        "HAB ": "Habitation ",
        "HLG ": "Halage ",
        "HLE ": "Halle ",
        "HAM ": "Hameau ",
        "HTR ": "Hauteur ",
        "HIP ": "Hippodrome ",
        "IMP ": "Impasse ",
        "JARD": "Jardin ",
        "JTE ": "Jetée ",
        "LEVE": "Levée ",
        "LIGN": "Ligne ",
        "LOT ": "Lotissement ",
        "MAIS": "Maison ",
        "MAR ": "Marché ",
        "MRN ": "Marina ",
        "MTE ": "Montée ",
        "MNE ": "Morne ",
        "NTE ": "Nouvelle route ",
        "PARC": "Parc ",
        "PKG ": "Parking ",
        "PRV ": "Parvis ",
        "PAS ": "Passage ",
        "PLE ": "Passerelle ",
        "PCH ": "Petit chemin ",
        "PTA ": "Petite allée ",
        "PAE ": "Petite avenue ",
        "PRT ": "Petite route ",
        "PTR ": "Petite rue ",
        "PHAR": "Phare ",
        "PIST": "Piste ",
        "PLA ": "Placa ",
        "PL  ": "Place ",
        "PTTE": "Placette ",
        "PLCI": "Placis ",
        "PLAG": "Plage ",
        "PLN ": "Plaine ",
        "PLT ": "Plateau ",
        "PNT ": "Pointe ",
        "PCHE": "Porche ",
        "PTE ": "Porte ",
        "POST": "Poste ",
        "POT ": "Poterne ",
        "PROM": "Promenade ",
        "QUAI": "Quai ",
        "QUA ": "Quartier ",
        "RAC ": "Raccourci ",
        "RPE ": "Rampe ",
        "RVE ": "Ravine ",
        "REM ": "Rempart ",
        "RES ": "Résidence ",
        "ROC ": "Rocade ",
        "RPT ": "Rond-point ",
        "RTD ": "Rotonde ",
        "RTE ": "Route ",
        "D   ": "Route départementale ",
        "N   ": "Route nationale ",
        "RUE ": "Rue ",
        "RLE ": "Ruelle ",
        "RULT": "Ruellette ",
        "RUET": "Ruette ",
        "RUIS": "Ruisseau ",
        "SEN ": "Sentier ",
        "SQ  ": "Square ",
        "STDE": "Stade ",
        "TRN ": "Terrain ",
        "TSSE": "Terrasse ",
        "TER ": "Terre ",
        "TPL ": "Terre-plein ",
        "TRT ": "Tertre ",
        "TRAB": "Traboule ",
        "TRA ": "Traverse ",
        "TUN ": "Tunnel ",
        "VALL": "Vallée ",
        "VEN ": "Venelle ",
        "VIAD": "Viaduc ",
        "VTE ": "Vieille route ",
        "VCHE": "Vieux chemin ",
        "VLA ": "Villa ",
        "VGE ": "Village ",
        "VIL ": "Ville ",
        "VC  ": "Voie communale ",
        "VOIR": "Voirie ",
        "VOUT": "Voûte ",
        "VOY ": "Voyeul ",
        "ZA  ": "Zone artisanale ",
        "ZAC ": "Zone d'aménagement concertée ",
        "ZI  ": "Zone industrielle "
      }
    };
    return geoTrouvetou;
  }
])
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
  });