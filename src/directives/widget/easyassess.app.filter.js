var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppFilter"] 
	= EasyAssess.app.directive("esAppFilter", function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:'<div class="input-group">'
				+ '<span class="input-group-addon" style="cursor:pointer;" uib-dropdown>'
				+ '<a uib-dropdown-toggle><span style="color:grey;" class="glyphicon glyphicon-chevron-down"><span ng-bind="selected.text"></span></span></a>'
				+ '<ul class="dropdown-menu" uib-dropdown-menu><li ng-repeat="option in esSearchOptions"><a ng-click="click(option)">{{option.text}}</a></li></ul>'
				+ '</span>'
				+ '<input ng-keydown="$event.key===\'Enter\'? search() : false" ng-model="keyword" type="text" placeholder="' + EasyAssess.lang.widgets.filter.inputKeywordText + '..." class="form-control" style="height:36px;">'
				+ '<span ng-click="search()" class="input-group-addon" style="cursor:pointer;"><span class="glyphicon glyphicon-search"></span></span>'
				+ '</div>',
		scope: {
			esSearchOptions:"="
		},
		link: function (scope) {
			scope.selected = scope.esSearchOptions.filter(function(option){
				return option.default;
			})[0];
			scope.click =function(option){
				scope.selected = option;
			};
			scope.search = function() {
				scope.$emit('$onSearch', {
					keyword: scope.keyword,
					by: scope.selected.value
				});
			};
		},
		controller: ["$scope", function($scope, $element, $attrs){
		}]
	}
});
