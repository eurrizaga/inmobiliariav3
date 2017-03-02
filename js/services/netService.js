(function () {
var netService = function(){
	return {msg: 'hola'};
}
angular.module('inmobiliaria').factory('netService', netService)
})();