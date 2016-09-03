var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppFullcalendar"]
    = EasyAssess.app.directive("esAppFullcalendar", function (moment,calendarConfig,esRequestService) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div>'
        +'<div class="row">'
        + '<div><h2 class="text-center">{{calendarTitle}}</h2></div>'
        +'    <div class="col-md-6 text-center">'
        +'        <div class="btn-group">'
        +'            <button class="btn btn-primary" mwl-date-modifier date="viewDate" decrement="calendarView" ng-click="updateForms()">'
        +'                向前'
        +'            </button>'
        +'            <button class="btn btn-default" mwl-date-modifier date="viewDate" set-to-today>'
        +'                Today'
        +'            </button>'
        +'            <button class="btn btn-primary" mwl-date-modifier date="viewDate" increment="calendarView" ng-click="updateForms()">'
        +'                向后'
        +'            </button>'
        +'        </div>'
        +'    </div>'
        +'    <br class="visible-xs visible-sm">'
        +'    <div class="col-md-6 text-center">'
        +'        <div ng-if ="false" class="btn-group">'
        +'            <label class="btn btn-primary" ng-model="calendarView" uib-btn-radio="\'year\'">Year</label>'
        +'            <label class="btn btn-primary" ng-model="calendarView" uib-btn-radio="\'month\'">Month</label>'
        +'            <label class="btn btn-primary" ng-model="calendarView" uib-btn-radio="\'week\'">Week</label>'
        +'        </div>'
        +'    </div>'
        +'</div>'
        + '<div class="row"><mwl-calendar events="events" view="calendarView" view-title="calendarTitle" view-date="viewDate" on-event-click="eventClicked(calendarEvent)"  cell-is-open="isCellOpen" cell-modifier="cellModifier(calendarCell)">'
        +'</mwl-calendar></div>'
        +'</div>',
        scope: {
            esDuration:"@",
            esStartDate:"@",
            esPlan:"=?"
        },
        controller: ["$scope", function ($scope) {
            $scope.calendarView = 'month';
            $scope.viewDate = new Date();
            $scope.isCellOpen = false;
            console.log($scope.esStartDate);
            var startDate = moment($scope.esStartDate);

            $scope.cellModifier = function(cell){
                var intervalDays= cell.date.diff(startDate,'days');
                if (intervalDays > 0 && (intervalDays % parseInt($scope.esDuration) == 0)){
                    console.log('in the cell');
                    cell.cssClass = 'selected-cell-calendar'
                }
            };

            $scope.eventClicked =function(event){
                $scope.$emit('clicked_form',event.formInfo);
            };

            $scope.updateForms = function(){
                _setFormsByCurrentMonth();
            };

            _setFormsByCurrentMonth()

            function _setFormsByCurrentMonth(){
                var startMonth = moment($scope.viewDate).startOf('month').format("YYYY-MM-DD");
                var endMonth = moment($scope.viewDate).endOf('month').format("YYYY-MM-DD");
                _getCurrentForms($scope.esPlan,startMonth,endMonth);
            }

            function _eventsCreator(forms){

                var events = forms.map(function(form){
                    var eventTemplate = {
                        title: '新答案',
                        color: calendarConfig.colorTypes.info,
                        draggable: false,
                        resizable: false
                    };
                    eventTemplate.startsAt = moment(form.date).toDate();
                    eventTemplate.formInfo = form;
                    return eventTemplate;
                });


                console.log(events);
                return events
            }



            function _getCurrentForms(planInfo,startDate,endDate){

                var url = EasyAssess.activeEnv['iqc']() + 'form/'+ planInfo.planId+'/' + planInfo.ministryId + '/list';
                esRequestService.esGet(url, {
                    startDate: startDate,
                    endDate:endDate
                }).then(function(data){
                    $scope.esDates = data.data.content;
                    $scope.events = _eventsCreator($scope.esDates);
                })

            }

        }]
    };
});


