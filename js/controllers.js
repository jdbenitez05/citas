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
        id: 'citas',
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



//**************************  SUCURSALES ************************************
    .controller ('sucursalesCtrl', [
        '$scope',
        'DataSucursales', 
        function ($scope, $data) {

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
                            // $scope.sucursalUD = angular.copy($scope.sucursal);

                            var index = _.indexOf($scope.sucursales, _.findWhere($scope.sucursales, {ID:$scope.sucursal.ID}));
                            $scope.sucursales[index] = $scope.sucursal;
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

 
//**************************  EMPLEADOS  ************************************
    .controller ('empleadosCtrl', [
        '$scope',
        'DataEmpleados',
        'DataSucursales',
        function ($scope, $data, $dataSucursales) {

            $scope.nuevo = false;
            $scope.empleado = {};
            $scope.empleadoUD = {};
            $scope.TitleForm = "Registro";
            $scope.botonText = "Guardar";
            $scope.sucursales = 0;
            $scope.loadSucursales = true;

            $data.get().then(function(data){
                $scope.empleados = data.datos;
                if(!$scope.empleados.length)
                    $scope.empleados = [];

                console.log($scope.empleados.length);
            });

            $dataSucursales.get().then(function(data){
                $scope.sucursales = data.datos;
                if(!$scope.sucursales.length)
                    $scope.sucursales = [];
                $scope.loadSucursales = false;
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
                
                if(confirm("Esta seguro de que desea eliminar el empleado: " + emp.NOMBRES + " " + emp.APELLIDOS)){
                    $data.delete(emp.ID).then(function(result){
                        if(result.status == 'success')
                            $scope.empleados = _.without($scope.empleados, _.findWhere($scope.empleados, {ID:emp.ID}));
                        else
                            alert('Error al intentar eliminar empleado');
                    });
                }
            };

            $scope.saveEmpleado = function(){

                if($scope.empleado.ID > 0){
                    var status = 0;

                    $data.put($scope.empleado.ID, $scope.empleado).then(function (result) {
                        if(result.status != 'error'){
                            // $scope.empleadoUD = angular.copy($scope.empleado);
                            var index = _.indexOf($scope.empleados, _.findWhere($scope.empleados, {ID:$scope.empleado.ID}));
                            $scope.empleados[index] = $scope.empleado;
                            $scope.empleadoUD = {};
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
                $scope.TitleForm = "Editar Empleado: " + newEmpleado.NOMBRES + " " + newEmpleado.APELLIDOS;
                $scope.empleado = newEmpleado;

                var index = _.indexOf($scope.sucursales, _.findWhere($scope.sucursales, {ID:$scope.empleado.SUCURSAL.ID}));
                $scope.empleado.SUCURSAL = $scope.sucursales[index];

                $scope.botonText = "Actualizar";
            }
        }
    ])


//**************************  SERVICIOS  ************************************
    .controller ('serviciosCtrl', [
        '$scope',
        'DataServicios',
        'DataSucursales',
        function ($scope, $data, $dataSucursales) {

            $scope.nuevo = false;
            $scope.TitleForm = "Registro";
            $scope.servicio = {};
            $scope.servicioUD = {};
            $scope.botonText = "Guardar";
            $scope.sucursales = 0;
            $scope.loadSucursales = true;

            $data.get().then(function(data){
                $scope.servicios = data.datos;
                if(!$scope.servicios.length)
                    $scope.servicios = [];

                console.log($scope.servicios.length);
            });

            $dataSucursales.get().then(function(data){
                $scope.sucursales = data.datos;
                if(!$scope.sucursales.length)
                    $scope.sucursales = [];
                $scope.loadSucursales = false;
            });

            $scope.nuevoServicio = function(){
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

            $scope.deleteServicio = function(pro){
                if(confirm("Esta seguro de que desea eliminar el servicio: " + pro.NOMBRE)){
                    $data.delete(pro.ID).then(function(result){
                    if(result.status == 'success')
                        $scope.servicios = _.without($scope.servicios, _.findWhere($scope.servicios, {ID:pro.ID}));
                    else
                        alert('Error al intentar eliminar servicio');
                    });
                }
            }

            $scope.saveServicio = function(){

                if($scope.servicio.ID > 0){
                    var status = 0;

                    $data.put($scope.servicio.ID, $scope.servicio).then(function (result) {
                        if(result.status != 'error'){
                            // $scope.servicioUD = angular.copy($scope.servicio);
                            

                            var index = _.indexOf($scope.servicios, _.findWhere($scope.servicios, {ID:$scope.servicio.ID}));
                            $scope.servicios[index] = $scope.servicio;

                            $scope.servicioUD = {};
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

            $scope.EditarServicio = function(pro){
                var newServicio = angular.copy(pro);
                $scope.servicioUD = pro;
                $scope.cancelar();
                $scope.nuevo = true;
                $scope.TitleForm = "Editar Servicio: " + newServicio.NOMBRE;
                $scope.servicio = newServicio;


                var index = _.indexOf($scope.sucursales, _.findWhere($scope.sucursales, {ID:$scope.servicio.SUCURSAL.ID}));
                $scope.servicio.SUCURSAL = $scope.sucursales[index];

                $scope.botonText = "Actualizar";
            }

        }
    ])

//--------------------------  LOGIN       -----------------------------------
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

//--------------------------  CITAS       -----------------------------------
    app.controller('CitasCtrl', [
        '$scope',
        'DataCitas',
        'DataSucursales',
        'DataEmpleados',
        'DataServicios',
        function($scope, $data, $dataSucursales, $dataEmpleados, $dataServicios) {

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            $scope.nuevo = false;
            $scope.TitleForm = "Registro";
            $scope.botonText = "Guardar";
            
            $scope.events = [];
            $scope.calendarView = false;

            $scope.sucursal = {};
            $scope.sucursales = 0;
            $scope.loadSucursales = true;

            $scope.empleado = {}
            $scope.datEmpleados = 0;
            $scope.empleados = 0;
            $scope.loadEmpleados = true;

            $scope.servicio = {}
            $scope.datServicios = 0;
            $scope.servicios = 0;
            $scope.loadServicios = true;

            /* Carga de citas */
            $data.get().then(function(data){
                $scope.citas = data.datos;
                if(!$scope.citas.length)
                    $scope.citas = [];

                console.log($scope.citas.length);
            });

            /* Carga de sucursales */
            $dataSucursales.get().then(function(data){
                $scope.sucursales = data.datos;
                if(!$scope.sucursales.length)
                    $scope.sucursales = [];

                $scope.loadSucursales = false;
            });

            /* Carga de empleados */
            $dataEmpleados.get().then(function(data){
                $scope.empleados = data.datos;
                if(!$scope.empleados.length)
                    $scope.empleados = [];

                $scope.loadEmpleados = false;
            });

            /* Carga de Servicios */
            $dataServicios.get().then(function(data){
                $scope.servicios = data.datos;
                if(!$scope.servicios.length)
                    $scope.servicios = [];

                $scope.loadServicios = false;
            });

            $scope.citasViewChange = function(){

            }

            $scope.nuevaCita = function(){
                $scope.cancelar();
                $scope.nuevo = !$scope.nuevo;
                $scope.TitleForm = "Registro";
                $scope.botonText = "Guardar";
            }

            $scope.cancelar = function(){
                $scope.TitleForm = "Registro";
                $scope.cita = {};
                $scope.myForm.$setPristine();
                $scope.nuevo = false;
            }; 

            $scope.sucursalChange = function(){
                if($scope.sucursal != undefined){

                    // $scope.empleados =  _.where($scope.datEmpleados, {ID:$scope.sucursal.ID});

                    $scope.empleados = _.filter($scope.datEmpleados, function(emp) {
                        console.log(emp.SUCURSAL.ID);
                        return _.where(emp.SUCURSAL, {ID: $scope.sucursal.ID}).length > 0;
                    });

                    console.log($scope.empleados);
                    console.log('sucursalid:' + $scope.sucursal.ID);
                }else{
                    $scope.events = {};
                    console.log('Seleccione una sucursal');
                }
            };

            $scope.saveCita = function(){

                if($scope.cita.ID > 0){
                    var status = 0;

                    $data.put($scope.servicio.ID, $scope.servicio).then(function (result) {
                        if(result.status != 'error'){
                            // $scope.servicioUD = angular.copy($scope.servicio);
                            
                            var index = _.indexOf($scope.servicios, _.findWhere($scope.servicios, {ID:$scope.servicio.ID}));
                            $scope.servicios[index] = $scope.servicio;

                            $scope.servicioUD = {};
                            $scope.cancelar();

                        }else{
                            alert('Error al actualizar Regitro');
                        }
                    });
                }
                else{
                    $data.post($scope.cita).then(function(data){
                        if(data.status == 'success'){
                            var cita = angular.copy($scope.cita);
                            cita.ID = data.data;
                            $scope.citas.push(cita);
                            $scope.cita = {}; 
                            $scope.cancelar();
                        }
                        else
                            alert(data.message);
                    });
                }
            };

            $scope.events = [
                {title:'All Day Event', start: new Date(y, m, 1), className: ['b-l b-2x b-info'], location:'New York', info:'This a all day event that will start from 9:00 am to 9:00 pm, have fun!'},
                {title:'Dance class', start: new Date(y, m, 3), end: new Date(y, m, 4, 9, 30), allDay: false, className: ['b-l b-2x b-danger'], location:'London', info:'Two days dance training class.'},
                {title:'Game racing', start: new Date(y, m, 6, 16, 0), className: ['b-l b-2x b-info'], location:'Hongkong', info:'The most big racing of this year.'},
                {title:'Soccer', start: new Date(y, m, 8, 15, 0), className: ['b-l b-2x b-info'], location:'Rio', info:'Do not forget to watch.'},
                {title:'Family', start: new Date(y, m, 9, 19, 30), end: new Date(y, m, 9, 20, 30), className: ['b-l b-2x b-success'], info:'Family party'},
                {title:'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2), className: ['bg-success bg'], location:'HD City', info:'It is a long long event'},
                {title:'Play game', start: new Date(y, m, d - 1, 16, 0), className: ['b-l b-2x b-info'], location:'Tokyo', info:'Tokyo Game Racing'},
                {title:'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false, className: ['b-l b-2x b-primary'], location:'New York', info:'Party all day'},
                {title:'Repeating Event', start: new Date(y, m, d + 4, 16, 0), alDay: false, className: ['b-l b-2x b-warning'], location:'Home Town', info:'Repeat every day'},      
                {title:'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/', className: ['b-l b-2x b-primary']},
                {title:'Feed cat', start: new Date(y, m+1, 6, 18, 0), className: ['b-l b-2x b-info']}
            ];


            /* alert on dayClick */
            $scope.precision = 400;
            $scope.lastClickTime = 0;
            $scope.alertOnEventClick = function( date, jsEvent, view ){
                var time = new Date().getTime();
                if(time - $scope.lastClickTime <= $scope.precision){
                    $scope.events.push({
                        title: 'New Event',
                        start: date,
                        className: ['b-l b-2x b-info']
                    });
                }
                $scope.lastClickTime = time;
            };
            /* alert on Drop */
            $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
                $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
            };
            /* alert on Resize */
            $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view){
                $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
            };

            $scope.overlay = $('.fc-overlay');
            $scope.alertOnMouseOver = function( event, jsEvent, view ){
                $scope.event = event;
                $scope.overlay.removeClass('left right').find('.arrow').removeClass('left right top pull-up');
                var wrap = $(jsEvent.target).closest('.fc-event');
                var cal = wrap.closest('.calendar');
                var left = wrap.offset().left - cal.offset().left;
                var right = cal.width() - (wrap.offset().left - cal.offset().left + wrap.width());
                if( right > $scope.overlay.width() ) { 
                    $scope.overlay.addClass('left').find('.arrow').addClass('left pull-up')
                }else if ( left > $scope.overlay.width() ) {
                    $scope.overlay.addClass('right').find('.arrow').addClass('right pull-up');
                }else{
                    $scope.overlay.find('.arrow').addClass('top');
                }
                (wrap.find('.fc-overlay').length == 0) && wrap.append( $scope.overlay );
            }

            
    
            /* add custom event*/
            $scope.addEvent = function() {
                $scope.events.push({
                    title: 'New Event',
                    start: new Date(y, m, d),
                    className: ['b-l b-2x b-info']
                });
            };

            /* remove event */
            $scope.remove = function(index) {
                $scope.events.splice(index,1);
            };

            /* Change View */
            $scope.changeView = function(view, calendar) {
                $('.calendar').fullCalendar('changeView', view);
            };

            $scope.today = function(calendar) {
                $('.calendar').fullCalendar('today');
            };


            /* config object */
            $scope.uiConfig = {
                calendar:{
                    height: 450,
                    editable: true,
                    header:{
                        left: 'prev',
                        center: 'title',
                        right: 'next'
                    },
                    dayClick: $scope.alertOnEventClick,
                    eventDrop: $scope.alertOnDrop,
                    eventResize: $scope.alertOnResize,
                    eventMouseover: $scope.alertOnMouseOver
                }
            };

            /* event sources array*/
            $scope.eventSources = [$scope.events];

        }
    ]
);
