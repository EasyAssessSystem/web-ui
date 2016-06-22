var EasyAssess = require('../../easyassess.application');
var MenuTemplate = require('../../data/menu.template');

EasyAssess.app.filter('esMenuFilter', function() {  
   return function(input, keyword, group) {  
	   var array = [];
       for(var i=0;i<input.length;i++){
           if(!keyword || keyword.length == 0){
               array.push(input[i]); 
           } else if (input[i].text.indexOf(keyword) != -1) {
        	   array.push(input[i]); 
        	   group.expanded = true;
           }
       }
       return array;
   };  
 });  


EasyAssess.directives["esAppMenu"] 
	= EasyAssess.app.directive("esAppMenu", function($timeout, $http, $state,$animate) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div class="es-app-sidebar-wrapper">'
                     +'<table><tr>'
                     +'<td>'
                     +'<div ng-hide="!showMenu" class="es-app-sidebar animate-show" style="height:700px;" ng-mouseleave="collapse()">'
                     + '<div class="es-app-seperator-line es-app-search-wrapper">'
                     +	'<div class="input-group">'
                     +		'<input ng-model="searchKeyword" type="text" placeholder="搜索功能..." class="form-control">'
                     + 		'<span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>'
                     +'	</div>'
                     + '</div>'
                     + '<div ng-show="isLoading" style="padding:20px 20px 20px 20px;"><es-spinner></es-spinner></div>'
                     + '<div ng-repeat="group in esMenu.items">'
                     +		'<div ng-click="toggle(group)" class="es-app-menu-group" align="center" ><span class="glyphicon {{group.icon}}" style="padding-right:20px;color:#00B312;"></span><span>{{group.text}}</span><div class="glyphicon {{arrowIcon(group)}}" style="float:right;"></div></div>'
                     + 		'<div class="es-app-menu-block" align="center" ng-show="expanded(group)">'
                     +			'<table style="width:100%;"><tr class="es-app-menu-item" ng-repeat="item in group.items| esMenuFilter:searchKeyword:group">'
                     +			   '<td><span class="glyphicon glyphicon-circle-arrow-right" style="font-size:12px;position:relative;left:50px;"></span></td><td><a style="position:relative;left:50px;" ng-click="activate(item)">{{item.text}}</a></td>'
                     +			'</tr></table>'
                     +		'</div>'
                     + '</div>'
                     +'</div>'
                     +'</td>'
                     +'<td valign="top">'
                     +'<div class="es-app-seperator-line"></div>'
                     + '<div ng-if="!showMenu" ng-mouseenter="collapse()" valign="middle" class="es-app-menu-handle"><span class="glyphicon glyphicon-chevron-right"></span></div>'
                     +'</td>'
                     +'</tr></table>'
                 +'</div>',
		scope: {

		},
		controller: ["$scope","$timeout", function($scope, $element, $attrs){
            $scope.showMenu = true;

			$scope.expanded = function(group) {
				return group.expanded;
			}

            $scope.collapse = function() {
                $scope.showMenu = !$scope.showMenu;
            }

			$scope.toggle = function(group) {
				if (group.expanded) {
					group.expanded = false;
				} else {
					group.expanded = true;
				}
			}
			
			$scope.arrowIcon = function(group) {
				return group.expanded ? 
						"glyphicon-chevron-down" : "glyphicon-chevron-right";
			} 
			
			$scope.activate = function(item) {
				EasyAssess.TaskManager.start(item.link, $state);
			}
			
			$scope.isLoading = true;
			$timeout(function() {
				$scope.isLoading = false;
				var menu = {
					items:[]
				};
				for (var i=0;i<MenuTemplate.items.length;i++) {
					var group = MenuTemplate.items[i];
					var items = [];
					for (var j=0;j<group.items.length;j++) {
						var item = group.items[j];
						var permission = EasyAssess.session.componentPermissionMap[item.link.split('.')[0]];
						if (!permission) continue;
						if (permission.usability) {
							items.push(item);
						}
					}
					if (items.length > 0) {
						menu.items.push({
							text: group.text,
							icon: group.icon,
							items: items,
							root: true
						});
					}
				}
				$scope.esMenu = menu;
             }, 700);
		}],
		link: function(scope,elem) {
			
		}
	}
});
