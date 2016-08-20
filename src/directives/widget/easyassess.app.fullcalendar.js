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
        +'                Previous'
        +'            </button>'
        +'            <button class="btn btn-default" mwl-date-modifier date="viewDate" set-to-today>'
        +'                Today'
        +'            </button>'
        +'            <button class="btn btn-primary" mwl-date-modifier date="viewDate" increment="calendarView">'
        +'                Next'
        +'            </button>'
        +'        </div>'
        +'    </div>'
        +'    <br class="visible-xs visible-sm">'
        +'    <div class="col-md-6 text-center">'
        +'        <div class="btn-group">'
        +'            <label class="btn btn-primary" ng-model="calendarView" uib-btn-radio="\'year\'">Year</label>'
        +'            <label class="btn btn-primary" ng-model="calendarView" uib-btn-radio="\'month\'">Month</label>'
        +'            <label class="btn btn-primary" ng-model="calendarView" uib-btn-radio="\'week\'">Week</label>'
        +'            <label class="btn btn-primary" ng-model="calendarView" uib-btn-radio="\'day\'">Day</label>'
        +'        </div>'
        +'    </div>'
        +'</div>'
        + '<div class="row"><mwl-calendar events="events" view="calendarView" view-title="calendarTitle" view-date="viewDate" on-event-click="eventClicked(calendarEvent)" on-event-times-changed="eventTimesChanged(calendarEvent); calendarEvent.startsAt = calendarNewEventStart; calendarEvent.endsAt = calendarNewEventEnd" cell-is-open="isCellOpen" day-view-start="06:00" day-view-end="22:59" day-view-split="30">'
        +'</mwl-calendar></div>'
        +'</div>',
        scope: {
            esDuration:"=",
            esDates:"="
        },
        controller: ["$scope", function ($scope) {
            moment.locale('zh-cn');
            calendarConfig.dateFormatter = 'moment';
            $scope.calendarView = 'month';
            $scope.viewDate = new Date();
            var actions = [{
                label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
                onClick: function(args) {
                    alert.show('Edited', args.calendarEvent);
                }
            }, {
                label: '<i class=\'glyphicon glyphicon-remove\'></i>',
                onClick: function(args) {
                    alert.show('Deleted', args.calendarEvent);
                }
            }];
            $scope.events = [
                {
                    title: 'An event',
                    color: calendarConfig.colorTypes.warning,
                    startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
                    endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
                    draggable: true,
                    resizable: true,
                    actions: actions
                }, {
                    title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
                    color: calendarConfig.colorTypes.info,
                    startsAt: moment().subtract(1, 'day').toDate(),
                    endsAt: moment().add(5, 'days').toDate(),
                    draggable: true,
                    resizable: true,
                    actions: actions
                }, {
                    title: 'This is a really long event title that occurs on every year',
                    color: calendarConfig.colorTypes.important,
                    startsAt: moment().startOf('day').add(7, 'hours').toDate(),
                    endsAt: moment().startOf('day').add(19, 'hours').toDate(),
                    recursOn: 'year',
                    draggable: true,
                    resizable: true,
                    actions: actions
                }
            ];

            $scope.isCellOpen = false;
            


        }]
    };
});


