var PropietarioCtrl = function($scope, DTOptionsBuilder, netService, $uibModal, toaster) {
    var auxProp;
    $scope.showProp = false;
    $scope.nuevoPropietario = function(){
        $scope.abrirPropietario();  
    }
    $scope.abrirPropietario = function(prop){
        if (prop){
            $scope.selectedProp = prop;
            auxProp = angular.copy(prop);
            $scope.editMode = true;
        }
        else{
            $scope.selectedProp = {
                tipo_doc:"DNI",
                mailing: true
            };
            $scope.editMode = false;
        }
            
        $scope.showProp = true;
        /*
        var modalInstance = $uibModal.open({
            templateUrl: 'views/modals/propietario.html',
            controller: 'propietarioEditCtrl'
        });
        */
    }
    $scope.closeEdit = function(){
        $scope.selectedProp = angular.copy(auxProp);
        $scope.showProp = false;
        $scope.fProp.$setPristine();
    }
    $scope.saveProp = function(){
        console.log($scope.selectedProp);
        var success = function(result){
            toaster.pop({
                type: 'success',
                //title: 'Title example',
                body: 'Guardado con éxito.',
                showCloseButton: true,
                timeout: 600
            });
            if (!$scope.editMode){
                $scope.propietarios.unshift($scope.selectedProp);
            }
            $scope.closeEdit();
            $scope.loading = false;
        }
        var failed = function(message){
            toaster.pop({
                type: 'error',
                //title: 'Title example',
                body: 'Error guardando propietario.',
                showCloseButton: true,
                timeout: 600
            });
            $scope.loading = false;
        }
        $scope.loading = true;
        if (!$scope.editMode){
            netService.post('propietario', $scope.selectedProp, success, failed);
        }
        else{
            netService.put('propietario', $scope.selectedProp, success, failed);   
        }
    }
    $scope.setTipoDoc = function(value){
        $scope.selectedProp.tipo_doc = value;
    }

    var init = function(){
        $scope.loading = true;
        $scope.dtext = [ 'csv', 'excel', 'pdf', 'print'];
        netService.get('propietarios', null, function(data){
            $scope.loading = false;
            $scope.propietarios = data;
            $scope.dtconfig = {
                title: 'Listado de propietarios',
                showCreate: true,
                createInfo: {
                    name: 'Nuevo Propietario',
                    f: $scope.nuevoPropietario
                },
                operations: [{
                    'name': 'Editar',
                    'icon': 'fa-edit',
                    'function': $scope.abrirPropietario
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
        
};

var propietarioEditCtrl = function($scope, $uibModalInstance) {
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

};


angular
    .module('inmobiliaria')
    .controller('PropietarioCtrl', PropietarioCtrl)
    .controller('propietarioEditCtrl', propietarioEditCtrl)