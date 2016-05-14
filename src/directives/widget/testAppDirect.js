var testModule = require('../testApp');

testModule.app.directive('myTest',function(ngDialog){
	alert('Hello');
	return{
		template:"This is a testing driective",
		controller:function(){
			alert('hi');
			console.log(ngDialog);
		}
	};
})