Calendar = {
    callPage: function(url, method, data, callback) {
        var fs = Npm.require('fs');
        var certificate = fs.readFileSync(Properties.GOOGLE_CERTIFICATE_PATH);

        auth(certificate, {
                iss : Properties.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                scope : 'https://www.googleapis.com/auth/calendar'
            },
            Meteor.bindEnvironment(function(error, accessToken) {
                if(error){
                    return callback(error);
                }

                if(url.indexOf("?") === -1)
                    var token = "?access_token=" + accessToken;
                else
                    var token = "&access_token=" + accessToken;

                var dataField = {};
                if(data)
                    dataField = { data: data };

                HTTP.call(method, url + token, dataField, callback);
            }, function(error) {
                callback(error);
            })
        );
    },
    getPage: function(url, callback) {
        Calendar.callPage(url, "GET", undefined, callback);
    },
    postPage: function(url, data, callback) {
        Calendar.callPage(url, "POST", data, callback);
    },
    deletePage: function(url, callback) {
        Calendar.callPage(url, "DELETE", undefined, callback);
    },
    watch: function(data, callback) {
        //Example of data:
        /*
            https://developers.google.com/google-apps/calendar/v3/reference/calendarList/watch
            {
                "id": "123123",
                "token": "abc",
                "type": "web_hook",
                "address": "http://81.216.205.74:3000/calendar",
            }
        */
        Calendar.postPage("https://www.googleapis.com/calendar/v3/users/me/calendarList/watch", data, function(error, result) {
            if(error) {
                callback(error, undefined);
            } else {
                callback(error, result.data);
            }
        });
    },
    addCalendar: function(calendarName, callback) {
        Calendar.postPage("https://www.googleapis.com/calendar/v3/calendars",
            {
                summary: calendarName
            },
            function(error, result) {
                if(error) {
                    callback(error, undefined);
                } else {
                    callback(error, result.data);
                }
            }
        );
    },
    deleteCalendar: function(calendarId, callback) {
        Calendar.deletePage("https://www.googleapis.com/calendar/v3/calendars/" + calendarId,
            function(error, result) {
                if(error) {
                    callback(error, undefined);
                } else {
                    callback(error, result.data);
                }
            }
        );
    },
    listCalendars: function(callback) {
        Calendar.getPage("https://www.googleapis.com/calendar/v3/users/me/calendarList",
            function(error, result) {
                if(error) {
                    callback(error, undefined);
                } else {
                    callback(error, result.data);
                }
            }
        );
    },
    deleteAccess: function(calendarId, ruleId, callback) {
        Calendar.deletePage("https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/acl/" + ruleId,
            function(error, result){
                if(error) {
                    callback(error, undefined);
                } else {
                    callback(error, result.data);
                }
            }
        );
    },
    listAccess: function(calendarId, callback) {
        Calendar.getPage("https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/acl", function(error, result) {
            if(error) {
                callback(error, undefined);
            } else {
                callback(error, result.data);
            }
        });
    },
    setAccess: function(calendarId, email, role, callback) {
        // https://developers.google.com/google-apps/calendar/v3/reference/acl/insert
        Calendar.postPage("https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/acl",
            {
                "role": role,
                "scope":
                    {
                        "type": "user",
                        "value": email
                    }

            },
            function(error, result) {
                if(error) {
                    callback(error, undefined);
                } else {
                    callback(error, result.data);
                }
            }
        );
    },
    addEvent: function(calendarId, eventName, startDate, endDate, callback) {
        Calendar.postPage("https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events",
            {
                "summary": eventName,
                "end": {
                            "dateTime": endDate
                       },
                "start": {
                            "dateTime": startDate
                         }
            },
            function(error, result) {
                if(error) {
                    callback(error, undefined);
                } else {
                    callback(error, result.data);
                }
            }
        );
    },
    getEvents: function(calendarId, callback) {
        Calendar.getPage("https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events", function(error, result) {
            if(error) {
                callback(error, undefined);
            } else {
                callback(error, result.data);
            }
        });
    },
    getEventsByInterval: function(calendarId, dateStart, dateEnd, callback) {
        var timeZone = "Europe/Stockholm";

        Calendar.getPage("https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events?timeMin=" + encodeURIComponent(moment(dateStart).format()) + "&timeMax=" + encodeURIComponent(moment(dateEnd).format()) + "&timeZone=" + timeZone + "&singleEvents=true", function(error, result) {
            if(error) {
                callback(error, undefined);
            } else {
                callback(error, result.data);
            }
        });
    }
}
