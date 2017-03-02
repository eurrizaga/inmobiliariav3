/**
 * INSPINIA - Responsive Admin Theme
 *
 */


/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'INSPINIA | Responsive Admin Theme';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
}

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function(){
                element.metisMenu();

            });

            // Colapse menu in mobile mode after click on element
            var menuElement = $('#side-menu a:not([href$="\\#"])');
            menuElement.click(function(){
                if ($(window).width() < 769) {
                    $("body").toggleClass("mini-navbar");
                }
            });

            // Enable initial fixed sidebar
            if ($("body").hasClass('fixed-sidebar')) {
                var sidebar = element.parent();
                sidebar.slimScroll({
                    height: '100%',
                    railOpacity: 0.9,
                });
            }
        }
    };
}

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.children('.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            },
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                }
        }
    };
}

/**
 * iboxTools with full screen - Directive for iBox tools elements in right corner of ibox with full screen option
 */
function iboxToolsFullScreen($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools_full_screen.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.children('.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            };
            // Function for full screen
            $scope.fullscreen = function () {
                var ibox = $element.closest('div.ibox');
                var button = $element.find('i.fa-expand');
                $('body').toggleClass('fullscreen-ibox-mode');
                button.toggleClass('fa-expand').toggleClass('fa-compress');
                ibox.toggleClass('fullscreen');
                setTimeout(function() {
                    $(window).trigger('resize');
                }, 100);
            }
        }
    };
}

/**
 * minimalizaSidebar - Directive for minimalize sidebar
*/
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 200);
                } else if ($('body').hasClass('fixed-sidebar')){
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 100);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
}

function validate() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      //console.log(scope, elm, attrs, ctrl);
      /*
        "{
            'type': 'integer', 
            'minValue':0, 
            'maxValue':8, 
            'minLength': 2, 
            'maxLength': 10, 
            'compare': 'fieldName' 
        }"
        */
      var targetRE;
      try{
        var aux = attrs['validate'].replace(/'/g, '"');
        var targetRE = JSON.parse(aux);
      }
      catch(error){
        //Útil para ver cuando la directiva falló. No borrar.
        console.log("Couldn't parse " + attrs['name'] + " parameters.");
        ctrl.$setValidity("validate", true);
        return true;
      }
      
      ctrl.$validators.integer = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
            var required = (Boolean(attrs['ngRequired']) || (targetRE['required']));
            if ((!ctrl.$pristine) && (required)){
                ctrl.$errorMessage = 'Campo requerido';
                ctrl.$setValidity("validate", false);
                return false;
            }
            else{
              ctrl.$setValidity("validate", true);
              return true;
            }
        }

        //valid type
        switch (targetRE['type']){
            case 'integer':
                var INTEGER_REGEXP =  /^\-?\d+$/; 
                if (!INTEGER_REGEXP.test(modelValue)) {
                    ctrl.$setValidity("validate", false);
                    ctrl.$errorMessage = 'Número inválido';
                    return false;
                }
            break;
            case 'email': 
                var EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z]{1,9})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
                if (!EMAIL_REGEXP.test(modelValue)) {
                    ctrl.$setValidity("validate", false);
                    ctrl.$errorMessage = 'Correo inválido';
                    return false;
                }
            break;
            case 'phone':
                var PHONE_REGEXP = /[^0-9\(\)\+\-\s]+/;
                if (PHONE_REGEXP.test(modelValue)) {
                    ctrl.$setValidity("validate", false);
                    ctrl.$errorMessage = 'Teléfono inválido';
                    return false;
                }
            break;
            case 'date': 
                var DATE_REGEXP = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
                if (!DATE_REGEXP.test(modelValue)) {
                    ctrl.$setValidity("validate", false);
                    ctrl.$errorMessage = 'Fecha Inválida';
                    return false;
                }

            break;
            case 'password': 
                if (targetRE['compare']){
                    if (scope[targetRE['compare']] !== modelValue){
                        ctrl.$setValidity("validate", false);
                        ctrl.$errorMessage = 'Valores no coinciden';
                        return false;
                    }
                }
            break;
            default:break;
        }
        // min value
        if (((targetRE['minValue']) || (targetRE['minValue'] == 0)) && (!isNaN(targetRE['minValue']))){
            var minValue = Number(targetRE['minValue']);
            var value = Number(modelValue);
            if (value < minValue){
                ctrl.$setValidity("validate", false);
                ctrl.$errorMessage = 'Debe ser mayor o igual que ' + minValue;
                return false;
            }
        }
        // max value
        if (((targetRE['maxValue']) || (targetRE['maxValue'] == 0)) && (!isNaN(targetRE['maxValue']))){
            var maxValue = Number(targetRE['maxValue']);
            var value = Number(modelValue);
            if (value > maxValue){
                ctrl.$setValidity("validate", false);
                ctrl.$errorMessage = 'Debe ser menor o igual que ' + maxValue;
                return false;
            }   
        }
        //min length
        if ((targetRE['minLength']) || (targetRE['minLength'] == 0) && (!isNaN(targetRE['minLength']))){
            var minLength = Number(targetRE['minLength']);
            if (modelValue.length < minLength){
                ctrl.$setValidity("validate", false);
                ctrl.$errorMessage = 'Debe contener al menos ' + minLength + ' caracteres';
                return false;
            }
        }

        //max length
        if ((targetRE['maxLength']) || (targetRE['maxLength'] == 0) && (!isNaN(targetRE['maxLength']))){
            var maxLength = Number(targetRE['maxLength']);
            if (modelValue.length > maxLength){
                ctrl.$setValidity("validate", false);
                $translate(['validator.lessThan', 'validator.characters']).then(function (translation) {
                    ctrl.$errorMessage = 'Debe contener menos de ' + maxLength + ' caracteres';
                });
                return false;
            }
        }
        ctrl.$setValidity("validate", true);
        return true;
        
      };
    }
  };
}

function loader(){
    return{
        restrict: 'E',
        templateUrl: 'views/common/spinner.html'
    }
}

/**
 *
 * Pass all functions into module
 */
angular
    .module('inmobiliaria')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('iboxToolsFullScreen', iboxToolsFullScreen)
    .directive('validate', validate)
    .directive('loader', loader);