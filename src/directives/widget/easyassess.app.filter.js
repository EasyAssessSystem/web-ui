var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppFilter"] 
	= EasyAssess.app.directive("esAppFilter", function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:'<div class="input-group">'
				+ '<span class="input-group-addon" style="cursor:pointer;">'
				+ '<a dropdown-menu="options" dropdown-model="selected" dropdown-disabled="dropdownsDisabled" dropdown-item-label="text">'
				+ '<table><tr><td><span class="glyphicon glyphicon-chevron-down"></span></td><td><span ng-bind="selected.text" style="padding-left:5px;"></td></tr></table></span>'
				+ '</a>'
				+ '</span>'
				+ '<input ng-model="keyword" type="text" placeholder="输入关键字..." class="form-control">'
				+ '<span ng-click="search()" class="input-group-addon" style="cursor:pointer;"><span class="glyphicon glyphicon-search"></span></span>'
				+ '</div>',
		scope: {
			
		},
		controller: ["$scope", function($scope, $element, $attrs){
			$scope.options = [
				{
				    text: 'Field 1',
				    value: 'field_1'
				},
				{
				    text: 'Field 2',
				    value: 'field_2'
				},          
			];
				
			$scope.selected = {};
			
			$scope.search = function() {
				 $scope.$emit('$onSearch', {
					 keyword: $scope.keyword,
					 by: $scope.selected.value
				 });
			}
		}]
	}
});
