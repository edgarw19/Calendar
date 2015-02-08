angular.module('clock', [])

.directive('clock', function(){
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, el, attrs, ngModel){
			scope.$watch(attrs.ngModel, function(value){
				if (value){
					console.log("value changed, new value is: " + value);
					el.val(value);
				}
			});
			el.clockpicker({
				donetext: 'OK',
				twelvehour: true,
				autoclose: true
			});
		}
	};
});