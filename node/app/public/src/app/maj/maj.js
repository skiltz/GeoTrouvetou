/*global angular */
angular.module('GeoTrouvetou.maj', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'leaflet-directive',
  'GeoTrouvetouServices',
  'ES_bano',
  'angularFileUpload',
  'angularMoment'
])

.config(['$stateProvider',
  function config($stateProvider) {
    $stateProvider.state('maj', {
      url: '/maj',
      views: {
        "main": {
          controller: 'majCtrl',
          templateUrl: 'maj/maj.tpl.html'
        }
      },
      data: {
        pageTitle: 'Mise à jour'
      }
    });

  }
])
  .controller('majCtrl', ['$scope', '$stateParams', 'geoTrouvetou', 'bano', '$q', '$http', '$upload', 'moment', '$timeout',
    function majCtrl($scope, $stateParams, geoTrouvetou, bano, $q, $http, $upload, moment, $timeout) {
      "use strict";
      $scope.bano_progress_value = 0;
      $scope.bano_progress_total = 0;
      $scope.bano2fantoir_progress_value = 0;
      $scope.bano2fantoir_progress_total = 0;
      /*
       * CSVtoArray (strData, strDelimiter)
         strData : String
         strDelimiter : optional String
         return Array
         /!\ Need to be redone! Loading a file as buffer then make array
       */
      var CSVtoArray = function (strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
          (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
          ),
          "gi"
        );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [
          []
        ];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {

          // Get the delimiter that was found.
          var strMatchedDelimiter = arrMatches[1];

          // Check to see if the given delimiter has a length
          // (is not the start of string) and if it matches
          // field delimiter. If id does not, then we know
          // that this delimiter is a row delimiter.
          if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
          ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

          }
          var strMatchedValue;

          // Now that we have our delimiter out of the way,
          // let's check to see which kind of value we
          // captured (quoted or unquoted).
          if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
              new RegExp("\"\"", "g"),
              "\""
            );

          } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];

          }


          // Now that we have our value string, let's add
          // it to the data array.
          arrData[arrData.length - 1].push(strMatchedValue);
        }

        // Return the parsed data.
        return (arrData);
      };

      /*
       * BANO
       */
      // TOO expensive!!!! 
      var Array2Adresse = (function () {
        var funcMemoized = function () {
          var cacheKey = JSON.stringify(Array.prototype.slice.call(arguments));
          var result;

          if (!funcMemoized.cache[cacheKey]) {
            result = {
              id: arguments[0][0],
              num: arguments[0][1],
              voie: arguments[0][2],
              codePostal: arguments[0][3],
              commune: arguments[0][4],
              source: arguments[0][5],
              geo: {
                lat: arguments[0][6],
                lon: arguments[0][7]
              }

            };
            // your expensive computation goes here
            // to reference the paramaters passed, use arguments[n]
            // eg.: result = arguments[0] + arguments[1];
            funcMemoized.cache[cacheKey] = result;
          }

          return funcMemoized.cache[cacheKey];
        };

        funcMemoized.cache = {};

        return funcMemoized;
      }());
      // TOO EXPENSIVE!!!
      var ArrayBano2Fantoir = (function () {
        var funcMemoized = function () {
          var cacheKey = JSON.stringify(Array.prototype.slice.call(arguments));
          var result;

          if (!funcMemoized.cache[cacheKey]) {
            result = {
              commune: {
                insee: arguments[0][0].slice(0, 5),
                codePostal: arguments[0][3],
                fullClean: arguments[0][4]
              },
              voie: {
                id: arguments[0][0].split('-')[0],
                insee: arguments[0][0].slice(0, 5),
                fullClean: arguments[0][2]
              }
            };
            // your expensive computation goes here
            // to reference the paramaters passed, use arguments[n]
            // eg.: result = arguments[0] + arguments[1];
            funcMemoized.cache[cacheKey] = result;
          }

          return funcMemoized.cache[cacheKey];
        };

        funcMemoized.cache = {};

        return funcMemoized;
      }());
      // TOO EXPENSIVE !!!
      var BANO2FANTOIR = (function () {
        var funcMemoized = function () {
          var cacheKey = JSON.stringify(Array.prototype.slice.call(arguments));
          var result;

          if (!funcMemoized.cache[cacheKey]) {
            result = {
              commune: {
                insee: arguments[0].id.slice(0, 5),
                fullClean: arguments[0].commune
              },
              voie: {
                id: arguments[0].id.split('-')[0],
                insee: arguments[0].id.slice(0, 5),
                fullClean: arguments[0].voie
              }
            };
            // your expensive computation goes here
            // to reference the paramaters passed, use arguments[n]
            // eg.: result = arguments[0] + arguments[1];
            funcMemoized.cache[cacheKey] = result;
          }

          return funcMemoized.cache[cacheKey];
        };

        funcMemoized.cache = {};

        return funcMemoized;
      }());

      var updateFantoirFormBanomakeNextRequest = function (data, current, docs, deferred) {
        if (deferred === undefined) {
          deferred = $q.defer();
        }
        var dcurr = data[current];
        //angular.forEach(data.docs, function (doc) {
        if (dcurr.found === true) {
          if (dcurr._source.fullClean === docs[dcurr._id].fullClean) {
            //console.log('is OK!');
            $timeout(function () {
              $scope.bano2fantoir_progress_value++;
              current++;
              if (current < Object.keys(docs).length - 1) {
                updateFantoirFormBanomakeNextRequest(data, current, docs, deferred);
              }
              // Resolve the promise otherwise.
              else {
                console.log("done");
                deferred.resolve(current);
              }
            }, 1);
          } else {
            dcurr._source.fullClean = docs[dcurr._id].fullClean;
            console.log(docs[dcurr._id].fullClean);
            var params = {
              'type': dcurr._type,
              'routing': dcurr._source.departement,
              'refresh': true
            };
            if (dcurr._parent) {
              params.parent = dcurr._parent;
            }
            var p = geoTrouvetou.update(dcurr._source, {
              field: 'fullClean',
              value: dcurr._source.fullClean
            }, params);
            p.then(function (res) {
              console.log('update!');
              $scope.bano2fantoir_progress_value++;
              current++;
              if (current < Object.keys(docs).length - 1) {
                updateFantoirFormBanomakeNextRequest(data, current, docs, deferred);
              }
              // Resolve the promise otherwise.
              else {
                console.log("done");
                deferred.resolve(current);
              }
            });
          }
        } else {
          console.log("/!\\ not in FANTOIR: " + dcurr._id);
          $scope.bano2fantoir_progress_value++;
          current++;
          if (current < Object.keys(docs).length - 1) {
            updateFantoirFormBanomakeNextRequest(data, current, docs, deferred);
          }
          // Resolve the promise otherwise.
          else {
            console.log("done");
            deferred.resolve(current);
          }
        }
        return deferred.promise;
      };

      function updateFantoirFormBano(docs) {
        var keys = Object.keys(docs);
        var def = $q.defer();
        keys.pop(); // remove the last one ("")

        geoTrouvetou.getList(keys, function (data, status) {
          //console.log(data);
          var deferred = $q.defer();
          var current = 0;
          //console.log(docs);
          updateFantoirFormBanomakeNextRequest(data.docs, current, docs).then(function () {
            console.log('ok');
            def.resolve('current');
          });
        });
        return def.promise;
      }

      function bulkify(bulk) {
        var bulk_body = '';
        angular.forEach(bulk, function (line) {
          var data = new Array2Adresse(line);
          if (data.id) {
            bulk_body = bulk_body + '{"index":{"_index":"bano","_type":"addresse","_id":"' + data.id + '" } }\n';
            bulk_body = bulk_body + JSON.stringify(data) + '\n';
          } else {
            //ligne vide
          }
        });
        return bano.bulk(bulk_body);
      }
      var chunkify = function (array, fn, chunk, current, deferred) {
        if (deferred === undefined) {
          deferred = $q.defer();
        }
        chunk = chunk || 1000;
        current = current || 0;
        //var temparray = [];
        var temparray = array.slice(current, current + chunk);
        fn(temparray).then(function () {
          current = current + chunk; // check next curent
          if (current < array.length - 1) {
            chunkify(array, fn, chunk, current, deferred);
          }
          // Resolve the promise otherwise.
          else {

            console.log("done");
            deferred.resolve(current);
          }
        });
        return deferred.promise;
      };

      var ReadBano = function (file) {
        var csv = new CSVtoArray(file.target.result);
        $scope.bano_progress_total = $scope.bano_progress_total + csv.length;
        chunkify(csv, function (chunk) {
          var deferred = $q.defer();
          bulkify(chunk).success(function (data) {
            $scope.bano_progress_value = $scope.bano_progress_value + chunk.length;
            deferred.resolve();
          }).error(function (data) {
            console.log(data);
          });
          return deferred.promise;

        }).then(function () {
          csv = null; // force GC to free old array
        });
      };

      var ReadBano2Fantoir = function (file) {
        var communes = {};
        var voies = {};

        var temparray = new CSVtoArray(file.target.result);

        console.log('Load OK');
        angular.forEach(temparray, function (line) {
          var fantoir = new ArrayBano2Fantoir(line);
          voies[fantoir.voie.id] = fantoir.voie;
          communes[fantoir.commune.insee] = fantoir.commune;
        });
        temparray = null;
        $scope.bano2fantoir_progress_total = $scope.bano2fantoir_progress_total + Object.keys(voies).length + Object.keys(communes).length - 2;
        //$scope.bano2fantoir_progress_total = $scope.bano2fantoir_progress_total +
        console.log("Communes");
        updateFantoirFormBano(communes).then(function () {
          communes = null;
          console.log("Voies");
          updateFantoirFormBano(voies).then(function () {
            voies = null;
          });
        }, function () {
          console.log('error');

        });
      };
      /*
       * FANTOIR
       */
      var isCommuneFantoir = (function () {
        var funcMemoized = function () {
          var cacheKey = JSON.stringify(Array.prototype.slice.call(arguments));
          //var result;

          if (!funcMemoized.cache[cacheKey]) {
            // your expensive computation goes here
            // to reference the paramaters passed, use arguments[n]
            // eg.: result = arguments[0] + arguments[1];
            //result = arguments[0] === ' ' ? true : false;
            funcMemoized.cache[cacheKey] = arguments[0] === ' ' ? true : false;
          }

          return funcMemoized.cache[cacheKey];
        };

        funcMemoized.cache = {};

        return funcMemoized;
      }());
      var Ligne2Fantoir = function (ligne, commune, departement) {
        var obj = {};
        if (commune) {
          obj = {
            departement: departement,
            insee: ligne.slice(0, 2) + ligne.slice(3, 6),
            name: ligne.slice(11, 41).trim(),
            date: moment(ligne.slice(81, 88), 'YYYYDDD').format('YYYY-MM-DD')
          };
          if (!isCommuneFantoir(ligne.charAt(73))) {
            obj.dateDel = moment(ligne.slice(74, 81), 'YYYYDDD').format('YYYY-MM-DD');
          }
          if (ligne.charAt(42) === 'N') {
            obj.rurale = true;
          }
        } else {
          obj = {
            id: departement + ligne.slice(3, 11),
            departement: departement,
            insee: departement + ligne.slice(3, 6),
            natureVoie: geoTrouvetou.typeVoiesDetail[ligne.slice(11, 15)],
            name: ligne.slice(15, 41).trim(),
            date: moment(ligne.slice(81, 88), 'YYYYDDD').format('YYYY-MM-DD')
          }; // TODO

          if (!isCommuneFantoir(ligne.charAt(73))) {
            obj.dateDel = moment(ligne.slice(74, 81), 'YYYYDDD').format('YYYY-MM-DD');
          }
          switch (ligne.charAt(108)) {
          case '1':
            obj.typeVoie = "Voie";
            break;
          case '2':
            obj.typeVoie = "Ensemble immobilier";
            break;
          case '3':
            obj.typeVoie = "Lieu dit";
            obj.natureVoie = "Lieu dit";
            break;
          case '4':
            obj.typeVoie = "Pseudo-voie";
            break;
          case '5':
            obj.typeVoie = "Voie Provisoire";
            break;
          }
          if (ligne.charAt(109) === '1') {
            obj.bati = true;
          }
          if (ligne.charAt(48) === '1') {
            obj.voiePrivee = true;
          }

        }

        return obj;
      };
      var compareFantoir = function (fantoir1, fantoir2) {

        var keys = ["name", "date", "dateDel", "rurale", "bati", "natureVoie", "typeVoie", "voiePrivee"];
        //Object.keys(fantoir1); // TODO : [name,date,dateDel,rurale,bati,natureVoie, typeVoie, voiePrivee] 
        var current = keys.length - 1;
        var diffKeys = [];
        while (current--) {
          // if (fantoir1[keys[current]] !== undefined || fantoir2[keys[current]] !== undefined) {
          if (fantoir1[keys[current]] !== undefined) {
            if (fantoir1[keys[current]] !== fantoir2[keys[current]]) {
              diffKeys.push(keys[current]);
            }
          }
          // }
        }
        return diffKeys;
      };
      var updateFantoir = function (file, departement, chunkSize, c) {
        var fileSize = file.size + 1;
        var load = function (evt) {
          //Need defer???
          if (evt.target.readyState == FileReader.DONE) {
            var fil1 = evt.target.result;
            var current = c;

            var nextline = function (fil, c, deferred) {
              if (deferred === undefined) {
                deferred = $q.defer();
              }

              if (fileSize >= c) {
                var line = fil.slice(c, c + chunkSize);
                //var line = evt.target.result;
                var commune = isCommuneFantoir(line.charAt(7));
                var obj = new Ligne2Fantoir(line, commune, departement);
                if (commune) {
                  geoTrouvetou.getCommune(obj, function (data, status) {
                    if (status == 200) {
                      var diff = compareFantoir(obj, data._source);
                      if (diff.length !== 0) {
                        console.log('update ' + diff[0] + ' ' + data._source[diff[0]] + ' -> ' + obj[diff[0]]);
                        // force gc
                        gc();

                        //UPDATE

                        angular.forEach(diff, function (key) {
                          geoTrouvetou.update(data._source, {
                            field: key,
                            value: obj[key]
                          }, {
                            'type': 'commune',
                            'parent': obj.departement,
                            'routing': obj.departement
                          });
                        });
                        $scope.fantoir_progress_value = c;
                        nextline(fil, c + chunkSize, deferred);
                      } else {
                        //nothing to do :)
                        $scope.fantoir_progress_value = c;
                        gc();
                        nextline(fil, c + chunkSize, deferred);
                      }
                    } else {
                      //Index!
                      // Tenter une récupe du CP via BANO?
                      // Lancer une alerte pour demander une MAJ BANO
                      console.log("put");
                      geoTrouvetou.put(obj, {
                        'type': 'commune',
                        'parent': obj.departement,
                        'routing': obj.departement
                      });
                      // force gc

                      gc();
                      $scope.fantoir_progress_value = c;
                      nextline(fil, c + chunkSize, deferred);
                    }
                  });
                } else {
                  //Voie
                  geoTrouvetou.getVoie(obj, function (data, status) {
                    //console.log(data);
                    //console.log(obj);

                    //console.log(status);
                    if (status == 200) {

                      var diff = compareFantoir(obj, data._source);
                      if (diff.length !== 0) {
                        //UPDATE
                        console.log('update ' + data.id + ' ' + diff[0] + ' ' + data._source[diff[0]] + ' -> ' + obj[diff[0]]);
                        angular.forEach(diff, function (key) {
                          if (data._source.doc) {
                            console.log(obj.id);
                            geoTrouvetou.update(obj, {
                              field: key,
                              value: obj[key]
                            }, {
                              'type': 'voie',
                              'parent': obj.insee,
                              'routing': obj.departement
                            });
                          } else {
                            geoTrouvetou.update(data._source, {
                              field: key,
                              value: obj[key]
                            }, {
                              'type': 'voie',
                              'parent': obj.insee,
                              'routing': obj.departement
                            });
                          }
                        });
                        // force gc

                        gc();
                        $scope.fantoir_progress_value = c;
                        nextline(fil, c + chunkSize, deferred);
                      } else {
                        //nothing to do :)
                        $scope.fantoir_progress_value = c;
                        //gc();
                        nextline(fil, c + chunkSize, deferred);
                      }
                    } else {
                      console.log("put");
                      geoTrouvetou.put(obj);
                      // force gc
                      gc();
                      $scope.fantoir_progress_value = c;
                      nextline(fil, c + chunkSize, deferred);
                      //Index!
                      // Lancer une alerte pour demander une MAJ BANO
                    }
                  });
                }
              } else {
                console.log("done");
                deferred.resolve(current);
              }
              return deferred.promise;
            };
            console.log('load OK');
            nextline(fil1, current);
          }

        };

        var reader = new FileReader();
        reader.onloadend = load;
        reader.readAsText(file);
        /*var process = function (fil, start) {
          $timeout(function () {

            var reader = new FileReader();
            var blob = fil.slice(start, start + chunkSize);
            reader.onload = load;
            reader.readAsText(blob);
            $scope.fantoir_progress_value = start;
          }, 1);
        };
        for (var i = 0; i < fileSize; i += chunkSize) {

          process(file, i);
        }
        /* */
      };
      var readFantoir = function (file) {
        //chunkSize = 151 bytes ? 150+Return 152 some times :/
        var chunkSize = 151;
        $scope.fantoir_progress_total = file.size - 1;
        var reader = new FileReader();
        reader.onloadend = function (evt) {
          if (evt.target.readyState == FileReader.DONE) {
            var departement;
            if (evt.target.result.charAt(2) === '0') {
              departement = evt.target.result.slice(0, 2);
            } else {
              departement = evt.target.result.slice(0, 3); // needed???
            }
            console.log(evt.target.result.split('\n')[0].length + 1);
            chunkSize = evt.target.result.split('\n')[0].length + 1;
            $scope.fantoir_progress_value = chunkSize;
            updateFantoir(file, departement, chunkSize, chunkSize);
          }
        };
        var blob = file.slice(0, 304);
        reader.readAsBinaryString(blob);

      };
      /*
       * ANGULAR
       */
      $scope.onFileSelectBano = function ($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
          var file = $files[i];
          var reader = new FileReader();
          reader.onloadend = ReadBano;
          reader.readAsText(file);
        }
      };
      $scope.onFileSelectBano2Fantoir = function ($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
          var file = $files[i];
          var reader = new FileReader();
          reader.onloadend = ReadBano2Fantoir;
          reader.readAsText(file);
        }
      };
      $scope.onFileSelectFantoir = function ($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {

          readFantoir($files[i]);

        }
      };
    }
  ]);