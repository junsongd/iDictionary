 if(window.Cordova){
  window.cordova = window.Cordova;
} 
var ionicApp = angular.module('starter', ['ionic','ngCordova']);
var db = null; 
ionicApp.run(function($ionicPlatform,$ionicLoading, $cordovaSQLite) {
    $ionicPlatform.ready(function() {
      /**  if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }**/
        if(window.StatusBar) {
            StatusBar.styleDefault();
        } 
          if(window.cordova || window.Cordova) { 

             // var onImportSuccess = function(){
             //    window.console.log("onImportSuccess"); 
               
             // };
             // var onImportFail = function(){
             //    window.console.log("onImportFail"); 
             // };
             window.sqlitePlugin.importPrepopulatedDatabase({file: "dictionary.sqlite", "importIfExists": false});
              db =  window.sqlitePlugin.openDatabase({name: "dictionary.sqlite"});  
          }

     });
});
ionicApp.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $stateProvider 
  .state('app', {
    url: "/app",
    abstract: true, 
    templateUrl: "templates/menu.html", 
  })
  .state('app.home', {
    url: "/home",
    
     templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })
  .state('app.home_details', {
    url: "/details/:rowid:type", 
    templateUrl: 'templates/details.html',
    controller: 'detailsCtrl',
    cache: false 
  })
  .state('app.tutorial', {
    url: "/tutorial", 
    templateUrl: 'templates/tutorial.html',
    controller: 'tutorialCtrl',
    
  })  
  .state('app.favorites', {
    url: "/favorites", 
     templateUrl: 'templates/favorites.html',
    controller: 'favoritesCtrl'
  }); 
  $urlRouterProvider.otherwise("/app/home");
});
 
ionicApp.controller("appCtrl", function($scope, $ionicPlatform,$cordovaSQLite,Traductions,$cordovaSocialSharing,$cordovaEmailComposer) {
    
     $scope.shareApp = function() { 

        var message = "和你分享一部方便多功能通用词典" ; 
        var subject = "Share"; 
        $cordovaSocialSharing.share(message, subject, null, null); 
    };
    $scope.shareText = function(traduction) {  
        var message =  traduction.codeCn + " " + traduction.cn + " " + traduction.codePinyin + " " + traduction.pinyin + " " + traduction.codeEn + " " + traduction.en + " " + traduction.codeFr+ " " + traduction.fr  ;
        var subject = "Share"; 
        $cordovaSocialSharing.share(message, subject, null, null); 
    } 
     $scope.contactAuthor = function() { 

           var email = {
              to: 'yyn20071114@163.com',
              cc: '',
              bcc: [],
              attachments: [],
              subject: '',
              body: '',
              isHtml: true
            };

           $cordovaEmailComposer.open(email).then(null, function () {
             // user cancelled email
           }); 

     };
      $scope.contactDeveloper = function() {  
           var email = {
              to: 'junsong.dong@gmail.com',
              bcc: [],
              attachments: [],
              subject: '',
              body: '',
              isHtml: true
            };

           $cordovaEmailComposer.open(email).then(null, function () {
             // user cancelled email
           }); 

     };
      
});

ionicApp.controller("homeCtrl", function($scope, $ionicPlatform,$cordovaSQLite,$stateParams,Traductions) {
                    
     $scope.query = ""; 
   
     $scope.search = function() {
        if(window.cordova){
           Traductions.list($scope.query,function(traductions){ 
            $scope.traductions =  traductions; 
           }); 
        }else{ 
          $scope.traductions = []; 
          $scope.traductions =  [
             {
               id: 1,
               text: "zhí yuán aa 职员 clerk F.employé de bureau"
             },
             { id: 2,
               text: "aabq 顺其自然 Go with the flow F.Aller avec le courant"
             } 
          ]; 
        } 
    };
});
ionicApp.controller("detailsCtrl", function($scope, $ionicPlatform,$cordovaSQLite,$stateParams,Traductions,$ionicScrollDelegate) {
     $scope.traduction = {}; 
     $scope.classSetting= {
       isSelected : false
     }; 
     var type = $stateParams.type;
     if(type == "traduction"){
          Traductions.findTraduction($stateParams.rowid, function(traduction){
                 $scope.traduction = traduction;  
             });
     }else{
        Traductions.findFavoirte($stateParams.rowid, function(traduction){
                 $scope.traduction = traduction; 
          }); 
     } 
     $scope.setFavoris = function(traduction) { 
         setTimeout(function () { 
                 $scope.$apply(function () {
                       if($scope.traduction.isFavorite == 1){
                           $scope.deleteFavoris(traduction.rowid);
                           $scope.traduction.isFavorite = 0;  
                       }else{
                           $scope.addFavoris(traduction.rowid);
                           $scope.traduction.isFavorite = 1; 
                       } 
                 }); 
          }, 1000); 

     };
      $scope.addFavoris = function(rowid) {  
          Traductions.addFavoris(rowid);
     };
      $scope.deleteFavoris = function(rowid) {  
          Traductions.deleteFavoris(rowid);
     }; 
     $scope.isActive = function (isFavorite) { 
        return isFavorite === 1;
     };
});


ionicApp.controller("favoritesCtrl", function($scope, $ionicPlatform,$cordovaSQLite,$stateParams,Traductions) {
     $scope.$on('$ionicView.enter', function () {
        if(window.cordova || window.Cordova) { 

             // var onImportSuccess = function(){
             //    window.console.log("onImportSuccess"); 
               
             // };
             // var onImportFail = function(){
             //    window.console.log("onImportFail"); 
             // };
            db =  window.sqlitePlugin.openDatabase({name: "dictionary.sqlite"});  
         }
          if(window.cordova){
            Traductions.getFavoris(function(traductions){ 
                    $scope.favorites =  traductions; 
            }); 
         }
           $scope.listCanSwipe = true;
           $scope.delete = function(index,item){
              $scope.favorites.splice(index, 1);
              Traductions.deleteFavoris(item.rowid); 
           }            
    });
   
    
}); 
ionicApp.controller("tutorialCtrl", function($scope, $ionicPlatform,$cordovaSQLite,$stateParams,Traductions) {
     $scope.$on('$ionicView.enter', function () {
      
    }); 
});
 
ionicApp.factory('Traductions', function($cordovaSQLite) {
  var cachedDataFavoirte; 
  var cachedDataTraduction;
  if(!window.cordova){
    cachedData = [
             {
               id: 1,
               text: "zhí yuán aa 职员 clerk F.employé de bureau"
             },
             { id: 2,
               text: "aabq 顺其自然 Go with the flow F.Aller avec le courant"
             } 
          ]; 
  } 

  function getTraduction( keywords, callback) {
        var traductions =[];  
        if(keywords.trim() !== ""){
              var query = "SELECT rowid,codeCn,cn,codePinyin,pinyin,codeEn,en,codeFr,fr,isFavorite  FROM iDictionary  WHERE codeCn LIKE ('%" + keywords  + "%')"
                        + " OR " +  "cn LIKE ('%" + keywords  + "%')"  
                        + " OR " +  "codePinyin LIKE ('%" + keywords  + "%')"
                        + " OR " +  "pinyin LIKE ('%" + keywords  + "%')"
                        + " OR " +  "codeEn LIKE ('%" + keywords  + "%')"
                        + " OR " +  "en LIKE ('%" + keywords  + "%')"
                        + " OR " +  "codeFr LIKE ('%" + keywords  + "%')"
                        + " OR " +  "fr LIKE ('%" + keywords  + "%') limit 50";
                $cordovaSQLite.execute(db, query, []).then(function(res) {
                       var obj = {};
                        traductions =[]; 
                       if(res.rows.length > 0) {
                          for(var i = 0; i < res.rows.length; i++) {
                               obj = {};
                               var traduction = res.rows.item(i);
                              console.log("SELECTED -> " + traduction); 
                              obj.id = i;
                              obj.rowid = traduction.rowid; 
                              obj.codeCn = traduction.codeCn; 
                              obj.cn = traduction.cn; 
                              obj.codePinyin = traduction.codePinyin; 
                              obj.pinyin = traduction.pinyin; 
                              obj.codeEn = traduction.codeEn;
                              obj.en = traduction.en; 
                              obj.codeFr = traduction.codeFr; 
                              obj.fr = traduction.fr;
                              obj.isFavorite = traduction.isFavorite;  
                              traductions.push(obj);
                          }
                      } else {
                          console.log("No results found");
                      }  
                      cachedDataTraduction = traductions;
                      callback(traductions);  
                  }, function (err) {
                      console.error(err);
               }); 

        }
         
  }

    function getFavoris(callback) { 
           
        var favorites =[];  
              var query = "SELECT rowid,codeCn,cn,codePinyin,pinyin,codeEn,en,codeFr,fr,isFavorite  FROM iDictionary  WHERE isFavorite = 1"
                      
                $cordovaSQLite.execute(db, query, []).then(function(res) {
                       var obj = {};
                        traductions =[]; 
                       if(res.rows.length > 0) {
                          for(var i = 0; i < res.rows.length; i++) {
                               obj = {};
                               var traduction = res.rows.item(i);
                              console.log("SELECTED -> " + traduction); 
                              obj.id = i;
                              obj.rowid = traduction.rowid; 
                              obj.codeCn = traduction.codeCn; 
                              obj.cn = traduction.cn; 
                              obj.codePinyin = traduction.codePinyin; 
                              obj.pinyin = traduction.pinyin; 
                              obj.codeEn = traduction.codeEn;
                              obj.en = traduction.en; 
                              obj.codeFr = traduction.codeFr; 
                              obj.fr = traduction.fr;
                              obj.isFavorite = traduction.isFavorite;  
                              favorites.push(obj);
                          }
                      } else {
                          console.log("No results found");
                      }  
                      cachedDataFavoirte = favorites; 
                      callback(favorites);  
                  }, function (err) {
                      console.error(err);
               }); 

    }
   function addFavoris(rowid) { 
                var query = "UPDATE iDictionary SET isFavorite = 1  WHERE rowid = ?";
                 
                $cordovaSQLite.execute(db, query, [rowid])
                  .then(function(res){
                     console.log("setFavoris success");

                  },
                  function(err){ 
                  console.log("setFavoris Error");
                  })

    } 
    function deleteFavoris(rowid) { 
                var query = "UPDATE iDictionary SET isFavorite = 0  WHERE rowid = ?";
                $cordovaSQLite.execute(db, query, [rowid])
                  .then(function(res){
                     console.log("deleteFavoris success");
                  },
                  function(err){ 
                  console.log("deleteFavoris Error");
                  })  
    }
  return {
    getFavoris : getFavoris, 
    addFavoris : addFavoris,
    deleteFavoris : deleteFavoris,
    list: getTraduction,
    findFavoirte: function(rowid, callback) {
      console.log(rowid);
      var traduction = cachedDataFavoirte.filter(function(traduction) {
        return traduction.rowid == rowid;
      })[0];
      callback(traduction);
    },
     findTraduction: function(rowid, callback) {
      console.log(rowid);
      var traduction = cachedDataTraduction.filter(function(traduction) {
        return traduction.rowid == rowid;
      })[0];
      callback(traduction);
    }
  };
  
});
 