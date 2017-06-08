var UnidadCtrl = function($scope, netService, $uibModal, toaster, DTOptionsBuilder, $rootScope, $window) {
    var auxUnidad;
    $scope.showUnidad = false;
    $scope.selected = [];
    $scope.nuevaUnidad = function(){
        $scope.abrirUnidad();  
    }
    $scope.abrirUnidad = function(u){
        if (u){
            var req = {
                id: u.id, 
                tipo_unidad: u.tipo_unidad,
            };
            $scope.loading = true;
            $scope.selected.edificio = {
                'nombre': u.nombre_edificio,
                'id': u.id_edificio
            }
            $scope.selected.propietario = {
                'apellido': u.propietario_apellido,
                'nombre': u.propietario_nombre,
                'id': u.id_propietario
            }
            netService.get('unidadInfo', req, function(response){
                $scope.selectedUnidad = u;
                for (var i in response[0]){
                    $scope.selectedUnidad[i] = response[0][i];
                }
                auxUnidad = angular.copy($scope.selectedUnidad);
                $scope.editMode = true;
                $scope.loading = false;
            }, function(response){
                toaster.pop({
                    type: 'error',
                    //title: 'Title example',
                    body: 'Error guardando unidad.',
                    showCloseButton: true,
                    timeout: 600
                });
                $scope.loading = false;
            });
                
        }
        else{
            $scope.selectedUnidad = {
                tipo_unidad:'d',
                hab_venta: false,
                hab_alquiler: true,

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
    $scope.abrirAutorizaciones = function(u){
        $scope.autorizarUnidad = true;
        $scope.loading = true;
        $scope.selectedUnidad = u;
        netService.get('autorizaciones', {'id_unidad': u.id}, function(response){
            $scope.loading = false;
            $scope.showAutorizaciones = true;
            $scope.autorizaciones = response;
        }, function(error){
            console.log(error);
        });
        
    }
    $scope.checkChange = function(){
        console.log('$scope.selectedUnidad.tipo_unidad')
    }
    var prevUnidad;
    $scope.$watch('selectedUnidad.tipo_unidad', function(){
        if ($scope.selectedUnidad && $scope.selectedUnidad.tipo_unidad){
            if ((prevUnidad != $scope.selectedUnidad.tipo_unidad) && (!$scope.editMode)){
                $scope.selected.edificio = {};
            }
            prevUnidad = $scope.selectedUnidad.tipo_unidad
        }
            
    }, true);

    $scope.closeEdit = function(){
        $scope.selectedUnidad = angular.copy(auxUnidad);
        $scope.showUnidad = false;
        $scope.showAutorizaciones = false;
        $scope.fUnidad.$setPristine();
    }
    
    $scope.setTipoDoc = function(value){
        $scope.selectedUnidad.tipo_doc = value;
    }
    $scope.openModal = function(tipo){
        var modalInstance = $uibModal.open({
            template: '<dt-search loading="loading" config="dtconfig"></dt-search><div class="modal-footer"><button class="btn btn-default" ng-click="cancel()">Cancel</button></div>',
            //templateUrl: 'views/admin/propietario_search.html',
            resolve: {
               tipo_unidad: function() {
                   return $scope.selectedUnidad.tipo_unidad
               }
            },
            controller: tipo + 'SelectCtrl'
        });
        modalInstance.result.then(function (selectedItem) {
          $scope.fUnidad.$setDirty();
          $scope.selected[tipo] = selectedItem;
          console.log($scope.selected[tipo]);
        }, function () {
          //$log.info('Modal dismissed at: ' + new Date());
        });
    
    }
    $scope.saveUnidad = function(){
        var success = function(result){
            toaster.pop({
                type: 'success',
                //title: 'Title example',
                body: 'Guardado con éxito.',
                showCloseButton: true,
                timeout: 600
            });
            $scope.selectedUnidad.hab_venta?$scope.selectedUnidad.hab_venta=true:$scope.selectedUnidad.hab_venta=false;
            $scope.selectedUnidad.hab_alquiler?$scope.selectedUnidad.hab_alquiler=true:$scope.selectedUnidad.hab_alquiler=false;
            $scope.unidades = [];
            $window.location.reload();

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
        $scope.selectedUnidad.hab_venta = + $scope.selectedUnidad.hab_venta;
        $scope.selectedUnidad.hab_alquiler = + $scope.selectedUnidad.hab_alquiler;
        $scope.selectedUnidad.id_propietario = $scope.selected.propietario.id;
        $scope.selectedUnidad.id_edificio = $scope.selected.edificio.id;
        if (!$scope.editMode){
            netService.post('unidad', $scope.selectedUnidad, success, failed);
        }
        else{
            netService.put('unidad', $scope.selectedUnidad, success, failed);   
        }
    }
    $scope.operation = {
        date: new Date(),
        range:{
            startDate: new Date(),
            endDate: new Date()
        }
    };
    $scope.saveAutorizacion = function(){
        $scope.loading = true;
        var offset = moment().utcOffset();
        var dateFrom = angular.copy($scope.operation.range.startDate);
        var dateTo = angular.copy($scope.operation.range.endDate);
        var req = {
            'unit': $scope.selectedUnidad.id,
            'date': $scope.operation.date,
            'from': moment(dateFrom).local().format('YYYY-MM-DD'),
            'to': moment(dateTo).local().format('YYYY-MM-DD')
        }
        netService.post('autorizacion', req, function(response){
            if (response.code == 1){
                $scope.autorizaciones.push({
                    'fecha_autorizacion': req.date,
                    'fecha_desde': req.from,
                    'fecha_hasta': req.to,
                    'id_unidad':$scope.selectedUnidad.id

                });
                toaster.pop({
                    type: 'success',
                    //title: 'Title example',
                    body: response.details,
                    showCloseButton: true,
                    timeout: 1500
                });
            }
            else{
                if (response.code === 0){
                    toaster.pop({
                        type: 'error',
                        //title: 'Title example',
                        body: response.details,
                        showCloseButton: true,
                        timeout: 1500
                    });
                }
            }
                
            $scope.loading = false;
            
        }, function(error){
            console.log(error);
            $scope.loading = false;
        });
    }
    $scope.eliminarAutorizacion = function(a, k){
        $scope.loading = true;
        var req = {
            'id_unidad': $scope.selectedUnidad.id, 
            'fecha_desde': a.fecha_desde,
            'fecha_hasta': a.fecha_hasta
        };
        netService.put('autorizacion', req, function(response){
            if (response.code == 1){
                $scope.autorizaciones.splice(k, 1);
                toaster.pop({
                    type: 'success',
                    //title: 'Title example',
                    body: response.details,
                    showCloseButton: true,
                    timeout: 1500
                });
            }
            else{
                if (response.code === 0){
                    toaster.pop({
                        type: 'error',
                        //title: 'Title example',
                        body: response.details,
                        showCloseButton: true,
                        timeout: 1500
                    });
                }
            }
            $scope.loading = false;
        }, function(error){
            console.log(error);
            $scope.loading = false;
        });
    }
    var init = function(){
        $scope.loading = true;
        $scope.dtext = [ 'csv', 'excel', 'pdf', 'print'];
        netService.get('unidades', null, function(data){
            $scope.loading = false;
            $scope.unidades = data;
            for (var i in data){
                Number(data[i].hab_venta)?data[i].hab_venta=true:data[i].hab_venta=false;
                Number(data[i].hab_alquiler)?data[i].hab_alquiler=true:data[i].hab_alquiler=false;
            }

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
                },{
                    'name': 'Autorizar',
                    'icon': 'fa-handshake-o',
                    'function': $scope.abrirAutorizaciones
                }],
                dataFormat: [
                    {
                        head: 'Código',
                        body: '{{ r.codigo }}'
                    },
                    {
                        head: 'Edificio',
                        body: '{{ r.nombre_edificio }}'
                    },
                    {
                        head: 'Propietario',
                        body: '{{ r.propietario_apellido }}, {{ r.propietario_nombre }}'
                    },
                    {
                        head: 'Tipo de Unidad',
                        body: '{{r.tipo_unidad | nameUnidad}}'
                    },
                    {
                        head: 'Venta',
                        body: '<input icheck type="checkbox" ng-model="r.hab_venta" ng-disabled="true"/>'
                    },
                    {
                        head: 'Alquiler',
                        body: '<input icheck type="checkbox" ng-model="r.hab_alquiler" ng-disabled="true"/>'
                    },
                    {
                        head: 'Carpeta',
                        body: '{{ r.carpeta }}'
                    },
                    {
                        head: 'Fecha de Ult. Op.',
                        body: '{{ r.fecha_ultima_op?(r.fecha_ultima_op | date: "dd/MM/yyyy"):"(ninguna)" }}'
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

var propietarioSelectCtrl = function($scope, tipo_unidad, $uibModalInstance, netService, DTOptionsBuilder) {
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDOM('<"html5buttons"B>lTfgitp')
        .withButtons([]);
    var init = function(){
        $scope.loading = true;
        netService.get('propietarios', null, function(data){
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
var edificioSelectCtrl = function($scope, tipo_unidad, $uibModalInstance, netService, DTOptionsBuilder) {
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDOM('<"html5buttons"B>lTfgitp')
        .withButtons([]);
    var init = function(){
        $scope.loading = true;
        var p = []
        if (tipo_unidad == 'd')
            p.push({
                'field': 'contiene_depto',
                'value': 1
            });
        else
            p.push({
                'field': 'contiene_cochera',
                'value': 1
            });
        netService.get('edificios', p, function(data){
            $scope.loading = false;
            $scope.edificios = data;
            for (var i in data){
                Number(data[i].contiene_cochera)?data[i].contiene_cochera=true:data[i].contiene_cochera=false;
                Number(data[i].contiene_depto)?data[i].contiene_depto=true:data[i].contiene_depto=false;
            }
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

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

};
angular
    .module('inmobiliaria')
    .controller('UnidadCtrl', UnidadCtrl)
    .controller('propietarioSelectCtrl', propietarioSelectCtrl)
    .controller('edificioSelectCtrl', edificioSelectCtrl)