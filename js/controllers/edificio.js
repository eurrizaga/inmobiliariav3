var EdificioCtrl = function($scope, DTOptionsBuilder, netService, $uibModal, toaster) {
    var auxUnidad;
    $scope.showUnidad = false;
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
                tipo_doc:"DNI",
                mailing: true
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
        $scope.fProp.$setPristine();
    }
    $scope.saveProp = function(){
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
                $scope.propietarios.unshift($scope.selectedUnidad);
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

    var init = function(){
        $scope.loading = true;
        netService.get('unidades', function(data){
            $scope.loading = false;
            $scope.unidades = data;
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