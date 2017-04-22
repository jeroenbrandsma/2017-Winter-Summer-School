var express = require('express');
var router = express.Router();
var calendarFunctions = require.main.require('./config/calendar/calendarRESTFunctions.js');


router.post('/calendar/event', function(request, response) {
    var summary = request.body.title;
    var location = "Nettelbosje 2, 9747 AC Groningen";
    var ssid = request.body.ssid;
    var start = request.body.date + 'T' + request.body.startHour + ':' + request.body.startMinute + ':00.000Z';
    var end = request.body.date + 'T' + request.body.endHour + ':' + request.body.endMinute + ':00.000Z';

    console.log("Posting event: " + summary + " for school " + ssid + " starting at " + start + " and ending at " + end);
    var event = calendarFunctions.insertCalendarEvent(summary, ssid, location, start, end);
    response.redirect('/main');
});

router.get('/calendar/event', function(request, response) {
    var params = request.query;
    if (params.hasOwnProperty('week') && !isNaN(params.week)) {
        calendarFunctions.listCalendarWeekEvents(parseInt(params.week), function(data) {
            if (params.hasOwnProperty('rendered') && params.rendered == 'true') {
                response.render('partials/schedule.ejs', {schedule: JSON.parse(data)});
            } else {
                response.send(data);
            }
        });
    } else if (params.hasOwnProperty('startDate') && params.hasOwnProperty('endDate')) {
        calendarFunctions.listCalendarEvents(params.startDate, params.endDate, function(data) {
            response.send(data);
        });
    } else {
        console.error('calendar-event.js: received an invalid get request\n');
    }
});

module.exports = router;