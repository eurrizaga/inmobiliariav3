var UnidadCtrl = function($scope, DTOptionsBuilder, netService, $uibModal, toaster) {
    var auxUnidad;
    $scope.showUnidad = false;
    $scope.selected = [];
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
    $scope.nuevaUnidad = function(){
        $scope.abrirUnidad();  
    }
    $scope.abrirUnidad = function(u){
        if (u){
            $scope.selectedUnidad = u;
            auxUnidad = angular.copy(u);
            $scope.editMode = true;
        }
        else{
            $scope.selectedUnidad = {
                venta:true,
                alquiler: true
            };
            $scope.editMode = false;
        }
            
        $scope.showUnidad = true;
        /*
        var modalInstance = $uibModal.open({
            templateUrl: 'views/modals/propietario.html',
            controller: 'propietarioEditCtrl'
        });
        */
    }
    $scope.closeEdit = function(){
        $scope.selectedUnidad = angular.copy(auxUnidad);
        $scope.showUnidad = false;
        $scope.fUnidad.$setPristine();
    }
    $scope.saveUnidad = function(){
        console.log($scope.selectedUnidad);
        var success = function(result){
            toaster.pop({
                type: 'success',
                //title: 'Title example',
                body: 'Guardado con éxito.',
                showCloseButton: true,
                timeout: 600
            });
            if (!$scope.editMode){
                $scope.unidades.unshift($scope.selectedUnidad);
            }
            $scope.closeEdit();
            $scope.loading = false;
        }
        var failed = function(message){
            toaster.pop({
                type: 'error',
                //title: 'Title example',
                body: 'Error guardando unidad.',
                showCloseButton: true,
                timeout: 600
            });
            $scope.loading = false;
        }
        $scope.loading = true;
        if (!$scope.editMode){
            netService.post('unidad', $scope.selectedUnidad, success, failed);
        }
        else{
            netService.put('unidad', $scope.selectedUnidad, success, failed);   
        }
    }
    $scope.setTipoDoc = function(value){
        $scope.selectedUnidad.tipo_doc = value;
    }

    $scope.openModal = function(tipo){
        var modalInstance = $uibModal.open({
            template: '<dt-search loading="loading" config="dtconfig"></dt-search><div class="modal-footer"><button class="btn btn-default" ng-click="cancel()">Cancel</button></div>',
            //templateUrl: 'views/admin/propietario_search.html',
            controller: tipo + 'SelectCtrl'
        });
        modalInstance.result.then(function (selectedItem) {
          $scope.selected[tipo] = selectedItem;
          console.log($scope.selected[tipo]);
        }, function () {
          //$log.info('Modal dismissed at: ' + new Date());
        });
    
    }

    var init = function(){
        $scope.loading = true;
        netService.get('unidades', function(data){
            $scope.loading = false;
            $scope.unidades = data;
            $scope.dtconfig = {
                title: 'Listado de unidades',
                showCreate: true,
                createInfo: {
                    name: 'Nueva Unidad',
                    f: $scope.nuevaUnidad
                },
                operations: [{
                    'name': 'Editar',
                    'icon': 'fa-edit',
                    'function': $scope.abrirUnidad
                }],
                dataFormat: [
                    {
                        head: 'Código',
                        body: '{{ r.codigo }}'
                    },
                    {
                        head: 'Edificio',
                        body: '{{ r.edificio_nombre }}'
                    },
                    {
                        head: 'Propietario',
                        body: '{{ u.propietario_apellido }}, {{ u.propietario_nombre }}'
                    },
                    {
                        head: 'Tipo de Unidad',
                        body: '{{ u.tipo_unidad }}'
                    },
                    {
                        head: 'Venta',
                        body: '{{ u.hab_venta }}'
                    },
                    {
                        head: 'Alquiler',
                        body: '{{ u.hab_alquiler }}'
                    },
                    {
                        head: 'Carpeta',
                        body: '{{ u.carpeta }}'
                    },
                    {
                        head: 'Fecha de Ult. Op.',
                        body: '{{ u.fecha_ultima_op }}'
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

var propietarioSelectCtrl = function($scope, $uibModalInstance, netService) {
    var init = function(){
        $scope.loading = true;
        netService.get('propietarios', function(data){
            $scope.loading = false;
            $scope.propietarios = data;
            $scope.dtconfig = {
                title: 'Listado de propietarios',
                showCreate: false,
                operations: [{
                    'name': 'Seleccionar Propietario',
                    'icon': 'fa-check',
                    'function': function(p){
                        $uibModalInstance.close(p);
                    }
                }],
                dataFormat: [
                    {
                        head: 'Apellido',
                        body: '{{ r.apellido }}'
                    },
                    {
                        head: 'Nombre',
                        body: '{{ r.nombre }}'
                    },
                    {
                        head: 'Documento',
                        body: '{{ r.tipo_doc }} - {{ r.nro_doc }}'
                    },
                    {
                        head: 'Localidad',
                        body: '{{ r.localidad }}'
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

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

};
var edificioSelectCtrl = function($scope, $uibModalInstance, netService) {
    var init = function(){
        $scope.loading = true;
        netService.get('edificios', function(data){
            $scope.loading = false;
            $scope.edificios = data;
            $scope.dtconfig = {
                title: 'Listado de edificios',
                showCreate: false,
                createInfo: {
                    name: 'Nuevo Edificio',
                    f: $scope.nuevoEdificio
                },
                operations: [{
                    'name': 'Seleccionar edificio',
                    'icon': 'fa-check',
                    'function': function(p){
                        $uibModalInstance.close(p);
                    }
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
                        body: '<input icheck type="checkbox" ng-model="r.contiene_cochera"/>'
                    },
                    {
                        head: 'Departamento',
                        body: '<input icheck type="checkbox" ng-model="r.contiene_depto"/>'
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

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

};
angular
    .module('inmobiliaria')
    .controller('UnidadCtrl', UnidadCtrl)
    .controller('propietarioSelectCtrl', propietarioSelectCtrl)
    .controller('edificioSelectCtrl', edificioSelectCtrl)