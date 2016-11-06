
//********************************EMPLEADOS***************************************
    app.factory("DataEmpleados", ['$http', '$location',
        function ($http, $q, $location) {

            var serviceBase = 'api/empleados/';

            var obj = {};

            obj.get = function () {
                return $http.get(serviceBase).then(function (results) {
                    return results.data;
                });
            };
            obj.post = function (object) {
               
                return $http.post(serviceBase, object).then(function (results) {
                    return results.data;
                });
            };
            obj.put = function (q, object) {
                return $http.put(serviceBase + q, object).then(function (results) {
                    return results.data;
                });
            };
            obj.delete = function (q) {
                return $http.delete(serviceBase + q).then(function (results) {
                    return results.data;
                });
            };
            return obj;
        }
    ]);

//***********************************SUCURSALES**********************************
    app.factory("DataSucursales", ['$http', '$location',
        function ($http, $q, $location) {

            var serviceBase = 'api/sucursales/';

            var obj = {};

            obj.get = function () {
                return $http.get(serviceBase).then(function (results) {
                    return results.data;
                });
            };
            obj.post = function (object) {
               
                return $http.post(serviceBase, object).then(function (results) {
                    return results.data;
                });
            };
            obj.put = function (q, object) {
                return $http.put(serviceBase + q, object).then(function (results) {
                    return results.data;
                });
            };
            obj.delete = function (q) {
                return $http.delete(serviceBase + q).then(function (results) {
                    return results.data;
                });
            };
            return obj;
    }]);

//***********************************SERIVICIOS************************************
    app.factory("DataServicios", ['$http', '$location',
        function ($http, $q, $location) {

            var serviceBase = 'api/servicios/';

            var obj = {};

            obj.get = function () {
                return $http.get(serviceBase).then(function (results) {
                    return results.data;
                });
            };
            obj.post = function (object) {
               
                return $http.post(serviceBase, object).then(function (results) {
                    return results.data;
                });
            };
            obj.put = function (q, object) {
                return $http.put(serviceBase + q, object).then(function (results) {
                    return results.data;
                });
            };
            obj.delete = function (q) {
                return $http.delete(serviceBase + q).then(function (results) {
                    return results.data;
                });
            };
            return obj;
    }]);   

