var EdificioCtrl = function($scope, DTOptionsBuilder, netService, $uibModal, toaster) {
    var auxUnidad;
    $scope.showEdificio = false;
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDOM('<"html5buttons"B>lTfgitp')
        .withButtons([
            {extend: 'copy'},
            {extend: 'csv'},
            {extend: 'excel', title: 'ExampleFile'},
            {extend: 'pdf', title: 'ExampleFile'},

            {extend: 'print',
                customize: function (win){
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');

                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }
        ]);
    $scope.nuevoEdificio = function(){
        $scope.abrirEdificio();  
    }
    $scope.abrirEdificio = function(u){
        if (u){
            $scope.selectedEdificio = u;
            auxUnidad = angular.copy(u);
            $scope.editMode = true;
        }
        else{
            $scope.selectedEdificio = {
                nombre:"",
                direccion:"",
                observaciones:"",
                contiene_cochera: false,
                contiene_depto: true
            };
            $scope.editMode = false;
        }
            
        $scope.showEdificio = true;
    }
    $scope.closeEdit = function(){
        $scope.selectedEdificio = angular.copy(auxUnidad);
        $scope.showEdificio = false;
        $scope.fEdificio.$setPristine();
    }
    $scope.saveEdificio = function(){
        var success = function(result){
            $scope.selectedEdificio.contiene_cochera?$scope.selectedEdificio.contiene_cochera=true:$scope.selectedEdificio.contiene_cochera=false;
            $scope.selectedEdificio.contiene_depto?$scope.selectedEdificio.contiene_depto=true:$scope.selectedEdificio.contiene_depto=false;
            toaster.pop({
                type: 'success',
                //title: 'Title example',
                body: 'Guardado con éxito.',
                showCloseButton: true,
                timeout: 600
            });
            $window.location.reload();
        }
        var failed = function(message){
            toaster.pop({
                type: 'error',
                //title: 'Title example',
                body: 'Error guardando edificio.',
                showCloseButton: true,
                timeout: 600
            });
            $scope.loading = false;
        }
        $scope.loading = true;
        $scope.selectedEdificio.contiene_cochera = + $scope.selectedEdificio.contiene_cochera;
        $scope.selectedEdificio.contiene_depto = + $scope.selectedEdificio.contiene_depto;
        if (!$scope.editMode){
            netService.post('edificio', $scope.selectedEdificio, success, failed);
        }
        else{
            netService.put('edificio', $scope.selectedEdificio, success, failed);   
        }
    }
    $scope.setTipoDoc = function(value){
        $scope.selectedEdificio.tipo_doc = value;
    }

    var init = function(){
        $scope.loading = true;
        $scope.dtext = [ 'csv', 'excel', 'pdf', 'print'];
        netService.get('edificios', null, function(data){
            for (var i in data){
                Number(data[i].contiene_cochera)?data[i].contiene_cochera=true:data[i].contiene_cochera=false;
                Number(data[i].contiene_depto)?data[i].contiene_depto=true:data[i].contiene_depto=false;
            }
            $scope.loading = false;
            $scope.edificios = data;
            $scope.dtconfig = {
                title: 'Listado de edificios',
                showCreate: true,
                createInfo: {
                    name: 'Nuevo Edificio',
                    f: $scope.nuevoEdificio
                },
                operations: [{
                    'name': 'Editar',
                    'icon': 'fa-edit',
                    'function': $scope.abrirEdificio
                }],
                dataFormat: [
                    {
                        head: 'Nombre',
                        body: '{{ r.nombre }}'
                    },
                    {
                        head: 'Dirección',
                        body: '{{ r.direccion }}'
                    },
                    {
                        head: 'Cochera',
                        body: '<input icheck type="checkbox" ng-model="r.contiene_cochera" ng-disabled="true"/>'
                    },
                    {
                        head: 'Departamento',
                        body: '<input icheck type="checkbox" ng-model="r.contiene_depto" ng-disabled="true"/>'
                    },
                    {
                        head: 'Acciones',
                        body: '<a ng-repeat="op in config.operations" href="" ng-click="op.function(r)" title="{{op.name}}"><i class="fa text-navy" ng-class="op.icon"></i></a>'
                    }
                ],
                dataSrc: data
            }
        })
    }
    init();
        
};

var edificioEditCtrl = function($scope, $uibModalInstance) {
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

};


angular
    .module('inmobiliaria')
    .controller('EdificioCtrl', EdificioCtrl)
    .controller('edificioEditCtrl', edificioEditCtrl)
