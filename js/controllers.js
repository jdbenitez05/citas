'use strict';  

/* Controllers */ 

angular.module('app.controllers', ['pascalprecht.translate', 'ngCookies'])

  
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', 
    function(              $scope,   $translate,   $localStorage,   $window ) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: 'Citas',
        version: '1.1.0',
        // for chart colors 
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }
  }])

  .controller('TypeaheadDemoCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.selected = undefined;
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    // Any function returning a promise object can be used to load values asynchronously
    $scope.getLocation = function(val) {
      return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: val,
          sensor: false
        }
      }).then(function(res){
        var addresses = [];
        angular.forEach(res.data.results, function(item){
          addresses.push(item.formatted_address);
        });
        return addresses;
      });
    };
  }])

  // signin controller
  .controller('SigninFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
      $scope.authError = null;
      // Try to login
      $http.post('api/login', {email: $scope.user.email, password: $scope.user.password})
      .then(function(response) {
        if ( !response.data.user ) {
          $scope.authError = 'Email or Password not right';
        }else{
          $state.go('app.dashboard-v1');
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
  }])

  // signup controller
  .controller('SignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.signup = function() {
      $scope.authError = null;
      // Try to create
      $http.post('api/signup', {name: $scope.user.name, email: $scope.user.email, password: $scope.user.password})
      .then(function(response) {
        if ( !response.data.user ) {
          $scope.authError = response;
        }else{
          $state.go('app.dashboard-v1');
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
  }])


  // Nav Controller
  .controller('navController', ['$scope', function($scope){
   
    $scope.opciones = [
      //---------------------------------MENU GESTION CITAS-----------------------------     
      {
        id: 'cbascula',
        name: 'Gestion Citas',
        imgClass: 'fa fa-wrench fa-fw',
        
        subItems: [{
          name: "Gestionar Citas",
          id: 'listado'
         }
        ]
      },

      //--------------------------------------MENU MANTENIMIENTO---------------------------------
      {
        id: 'mantenimiento',
        name: 'Configuración',
        imgClass: 'fa fa-wrench fa-fw',
        
        subItems: [{
          name: "Sucursal",
          id: 'sucursales'
        }, {
          name: "Servicios",
          id: 'servicios'
        }, {
          name: "Empleados",
          id: 'empleados'
         } 
        ]
      },
    ];   
  }])



//**************************  SUCURSALES  ************************************
  .controller ('sucursalesCtrl', [
    '$scope',
    'DataSucursales', 
    function ($scope, $data, $dataEmpleados) {

      $scope.nuevo = false;
      $scope.sucursal = {};
      $scope.sucursalUD = {};
      $scope.TitleForm = "Registro";
      $scope.botonText = "Guardar";
      $scope.sucursales = 0;
      

      $data.get().then(function(data){
          $scope.sucursales = data.datos;
          if(!$scope.sucursales.length)
            $scope.sucursales = [];

          console.log($scope.sucursales.length);
      });

     

      $scope.nuevaSucursal = function(){
        $scope.cancelar();
        $scope.nuevo = !$scope.nuevo;
        $scope.TitleForm = "Registro";
        $scope.botonText = "Guardar";
      };

      $scope.cancelar = function(){
        $scope.TitleForm = "Registro";
        $scope.sucursal = {};
        $scope.myForm.$setPristine();
        $scope.nuevo = false;
      };

      $scope.deleteSucursal = function(pla){
        if(confirm("Esta seguro de que desea eliminar la sucursal: " + pla.NOMBRE)){
            $data.delete(pla.ID).then(function(result){
              if(result.status == 'success')
                $scope.sucursales = _.without($scope.sucursales, _.findWhere($scope.sucursales, {ID:pla.ID}));
              else
                alert('Error al intentar eliminar sucursal');
            });
        }
      };

      $scope.saveSucursal = function(){

        if($scope.sucursal.ID > 0){
          var status = 0;
         
          $data.put($scope.sucursal.ID, $scope.sucursal).then(function (result) {
            if(result.status != 'error'){
              $scope.sucursales = _.without($scope.sucursales, _.findWhere($scope.sucursales, {ID:$scope.sucursal.ID}));
              $scope.sucursalUD = angular.copy($scope.sucursal);
              $scope.sucursales.push($scope.sucursalUD);
              $scope.sucursal = {};
              $scope.cancelar();
            }else{
              alert('Error al actualizar Regitro');
            }
          });

        }
        else{
            $data.post($scope.sucursal).then(function(data){
            if(data.status == 'success'){
              var sucursal = angular.copy($scope.sucursal);
              sucursal.ID = data.data;
              $scope.sucursales.push(sucursal);
              $scope.sucursal = {};
              $scope.cancelar();
            }
            else
              alert(data.message);
          });
        }
      };

      $scope.EditarSucursal = function(pla){
        var newsucursal = angular.copy(pla);
        $scope.sucursalUD = pla;
        $scope.cancelar();
        $scope.nuevo = true;
        $scope.TitleForm = "Editar sucursal: " + newsucursal.NOMBRE;
        $scope.sucursal = newsucursal;

        // var index = _.indexOf($scope.empleados, _.findWhere($scope.empleados, {ID:$scope.sucursal.CLIENTE.ID}));
        // $scope.sucursal.CLIENTE = $scope.empleados[index];

        $scope.botonText = "Actualizar";
      }
           
    }
  ])


//**************************  SERVICIOS  ************************************
  .controller ('serviciosCtrl', [
    '$scope',
    'DataServicios', 
    function ($scope, $data, $dataEmpleados) {

      $scope.nuevo = false;
      $scope.servicio = {};
      $scope.servicioUD = {};
      $scope.TitleForm = "Registro";
      $scope.botonText = "Guardar";
      $scope.servicios = 0;
      

      $data.get().then(function(data){
          $scope.servicios = data.datos;
          if(!$scope.servicios.length)
            $scope.servicios = [];

          console.log($scope.servicios.length);
      });

     

      $scope.nuevaServicio = function(){
        $scope.cancelar();
        $scope.nuevo = !$scope.nuevo;
        $scope.TitleForm = "Registro";
        $scope.botonText = "Guardar";
      };

      $scope.cancelar = function(){
        $scope.TitleForm = "Registro";
        $scope.servicio = {};
        $scope.myForm.$setPristine();
        $scope.nuevo = false;
      };

      $scope.deleteServicio = function(pla){
               if(result.status == 'success')
                $scope.servicios = _.without($scope.servicios, _.findWhere($scope.servicios, {ID:pla.ID}));
              else
                alert('Error al intentar eliminar servicio');
      };

      $scope.saveServicio = function(){

        if($scope.servicio.ID > 0){
          var status = 0;
                 
          $data.put($scope.servicio.ID, $scope.servicio).then(function (result) {
            if(result.status != 'error'){
              $scope.servicioUD = angular.copy($scope.servicio);
              $scope.cancelar();
            }else{
              alert('Error al actualizar Regitro');
            }
          });

        }
        else{
            $data.post($scope.servicio).then(function(data){
            if(data.status == 'success'){
              var servicio = angular.copy($scope.servicio);
              servicio.ID = data.data;
              $scope.servicios.push(servicio);
              $scope.servicio = {};
              $scope.cancelar();
            }
            else
              alert(data.message);
          });
        }
      };

      $scope.EditarServicio = function(pla){
        var newservicio = angular.copy(pla);
        $scope.servicioUD = pla;
        $scope.cancelar();
        $scope.nuevo = true;
        $scope.TitleForm = "Editar servicio: " + newservicio.NOMBRE;
        $scope.servicio = newservicio;

        // var index = _.indexOf($scope.empleados, _.findWhere($scope.empleados, {ID:$scope.servicio.CLIENTE.ID}));
        // $scope.servicio.CLIENTE = $scope.empleados[index];

        $scope.botonText = "Actualizar";
      }
           
    }
  ])

 
//+++++++++++++++++++++++++EMPLEADOS++++++++++++++++++++++++++++++++++++++++++++++
  .controller ('empleadosCtrl', [
    '$scope',
    'DataEmpleados',
    // 'DataCiudades',
    function ($scope, $data, $dataCiudades) {

      $scope.nuevo = false;
      $scope.empleado = {};
      $scope.empleadoUD = {};
      $scope.TitleForm = "Registro";
      $scope.botonText = "Guardar";
      $scope.sucursales = 0;

      $dataCiudades.get().then(function(data){
          $scope.sucursales = data.datos;
      });

      $data.get().then(function(data){
          $scope.empleados = data.datos;
          if(!$scope.empleados.length)
            $scope.empleados = [];

          console.log($scope.empleados.length);
        });

      $scope.nuevoEmpleado = function(){
        $scope.cancelar();
        $scope.nuevo = !$scope.nuevo;
        $scope.TitleForm = "Registro";
        $scope.botonText = "Guardar";
      };

      $scope.cancelar = function(){
        $scope.TitleForm = "Registro";
        $scope.empleado = {};
        $scope.myForm.$setPristine();
        $scope.nuevo = false;
      };

      $scope.deleteEmpleado = function(emp){
              if(result.status == 'success')
                $scope.empleados = _.without($scope.empleados, _.findWhere($scope.empleados, {ID:emp.ID}));
              else
                alert('Error al intentar eliminar empleado');
      };

      $scope.saveEmpleado = function(){

        if($scope.empleado.ID > 0){
          var status = 0;
       
        $data.put($scope.empleado.ID, $scope.empleado).then(function (result) {
            if(result.status != 'error'){
              $scope.empleadoUD = angular.copy($scope.empleado);
              $scope.cancelar();
            }else{
              alert('Error al actualizar Regitro');
            }
          });

        }
        else{
         
          $data.post($scope.empleado).then(function(data){
            if(data.status == 'success'){
              var empleado = angular.copy($scope.empleado);
              empleado.ID = data.data;
              $scope.empleados.push(empleado);
              $scope.empleado = {};
             $scope.cancelar();
            }
            else
              alert(data.message);
          });
        }

      };

     $scope.EditarEmpleado = function(emp){
        var newEmpleado = angular.copy(emp);
        $scope.empleadoUD = emp;
        $scope.cancelar();
        $scope.nuevo = true;
        $scope.TitleForm = "Editar Empleado: " + newEmpleado.NOMBRE;
        $scope.empleado = newEmpleado;

        // var index = _.indexOf($scope.ciudades, _.findWhere($scope.ciudades, {ID:$scope.empleado.CIUDAD.ID}));
        // $scope.empleado.CIUDAD = $scope.ciudades[index];

        $scope.botonText = "Actualizar";
      }
           
       

    }
  ])
 


//++++++++++++++++++++++++++++   LOGIN    ++++++++++++++++++++++++++++++++++++++++
 .controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    $scope.doLogin = function (customer) {
        Data.post('login', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('dashboard');
            }
        });
    }
})


;