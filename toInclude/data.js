/*
// Convert date as String to a date Object
// example : `TZID="Europe/Brussels":20190423T180000` -> Date object (2019,4,23,18,0,0)
*/
function convDateString(rawDate)
    {
        if (rawDate == undefined) return "undefined"
        stringDate = rawDate;
        if (rawDate.includes(":"))
            stringDate = rawDate.split(":")[1];
        return new Date(stringDate.substring(0,4), stringDate.substring(4,6), stringDate.substring(6,8), stringDate.substring(9,11), stringDate.substring(11,13), stringDate.substring(13,15));
    }

/*
// event Object
*/
const event =
    {
        set: function(data)
            {
                this.UID = data["UID"];
                this.SUMMARY = data["SUMMARY"];
                this.DESCRIPTION =  data["DESCRIPTION"];
                this.LOCATION =  data["LOCATION"];
                this.ATTENDEE =  data["ATTENDEE"];
                this.ORGANIZER =  data["ORGANIZER"];
                this.DTSTART =  convDateString(data["DTSTART"]);
                this.DTEND =  convDateString(data["DTEND"]);
                this.STATUS =  data["STATUS"];
            },

        toString: function()
            {
                  console.log(`${this.UID};${this.SUMMARY};${this.DESCRIPTION};${this.LOCATION};${this.ATTENDEE};${this.ORGANIZER};${this.DTSTART};${this.DTEND};${this.STATUS}`);
            }
    };

/*
// ICS Parser
// return array of events
*/
function parseICS(rawICS)
    {
        eventsArray = [];
        var events = rawICS.split("BEGIN:VEVENT");
        var dataToProcess = ["UID", "SUMMARY", "DESCRIPTION", "LOCATION", "ATTENDEE", "ORGANIZER", "DTSTART", "DTEND", "STATUS"]
        for (var i=0; i<events.length; i++) // for each event bloc
            {
                events[i] = events[i].split("\n");
                _data = {};
                for (var j=0; j<events[i].length; j++) // for each line
                    {
                        for (var k=0; k<dataToProcess.length; k++)
                            {
                                if (events[i][j].substring(0, dataToProcess[k].length) == dataToProcess[k] && _data[dataToProcess[k]] == undefined)
                                    {
                                        _data[dataToProcess[k]] = events[i][j].substring(dataToProcess[k].length +1);
                                    }
                            }
                    }
                // add object to array
                const ev = Object.create(event);
                ev.set(_data)
                eventsArray.push(ev);
            }
        return eventsArray;
    }

function init()
    {
        // test
        events = parseICS(cal);
        console.log(events);

        // test de la biblio
        /*
        new ical_parser("cal.ics", function(cal)
            {
        		events = cal.getEvents();
                console.log(events);
        	});
        */
    }

init();
