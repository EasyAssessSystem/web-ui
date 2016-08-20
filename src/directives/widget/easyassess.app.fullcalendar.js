var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppFullcalendar"]
    = EasyAssess.app.directive("esAppFullcalendar", function (moment,calendarConfig) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div>'
        +'<div class="row">'
        + '<div><h2 class="text-center">{{calendarTitle}}</h2></div>'
        +'    <div class="col-md-6 text-center">'
        +'        <div class="btn-group">'
        +'            <button class="btn btn-primary" mwl-date-modifier date="viewDate" decrement="calendarView">'
        +'                向前'
        +'            </button>'
        +'            <button class="btn btn-default" mwl-date-modifier date="viewDate" set-to-today>'
        +'                Today'
        +'            </button>'
        +'            <button class="btn btn-primary" mwl-date-modifier date="viewDate" increment="calendarView">'
        +'                向后'
        +'            </button>'
        +'        </div>'
        +'    </div>'
        +'    <br class="visible-xs visible-sm">'
        +'    <div class="col-md-6 text-center">'
        +'        <div class="btn-group">'
        +'            <label class="btn btn-primary" ng-model="calendarView" uib-btn-radio="\'year\'">Year</label>'
        +'            <label class="btn btn-primary" ng-model="calendarView" uib-btn-radio="\'month\'">Month</label>'
        +'            <label class="btn btn-primary" ng-model="calendarView" uib-btn-radio="\'week\'">Week</label>'
        +'        </div>'
        +'    </div>'
        +'</div>'
        + '<div class="row"><mwl-calendar events="events" view="calendarView" view-title="calendarTitle" view-date="viewDate" on-event-click="eventClicked(calendarEvent)" on-event-times-changed="eventTimesChanged(calendarEvent); calendarEvent.startsAt = calendarNewEventStart; calendarEvent.endsAt = calendarNewEventEnd" cell-is-open="isCellOpen" cell-modifier="cellModifier(calendarCell)">'
        +'</mwl-calendar></div>'
        +'</div>',
        scope: {
            esDuration:"@",
            esStartDate:"@",
            esDates:"="
        },
        controller: ["$scope", function ($scope) {

            $scope.calendarView = 'month';
            $scope.viewDate = new Date();
            $scope.events = _eventsCreator($scope.esDates);
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

            function _eventsCreator(forms){
                var actions = [{
                    onClick: function(args) {
                        $scope.$emit('clicked_form',args.calendarEvent.formInfo);
                    }
                }];


                var events = forms.map(function(form){
                    var eventTemplate = {
                        title: 'selected form',
                        color: calendarConfig.colorTypes.info,
                        draggable: false,
                        resizable: false,
                        actions: actions
                    };
                    eventTemplate.startsAt = moment(form.date).toDate();
                    eventTemplate.formInfo = form.formInfo;
                    return eventTemplate;
                });

                return events
            }
        }]
    };
});


