function convDateString(rawDate)
    {
        var stringDate = rawDate.split(":")[1];
        return new Date(stringDate.substring(0,4), stringDate.substring(4,6), stringDate.substring(6,8), stringDate.substring(9,11), stringDate.substring(11,13), stringDate.substring(13,15));
    }

const event =
    {
        SUMMARY: false,
        DTSTART: false,
        DTEND: false,
        LOCATION: false,
        DESCRIPTION: false,
        STATUS: false,
        SEQUENCE: false,

        set: function(SUMMARY, DTSTART, DTEND, LOCATION, DESCRIPTION, STATUS, SEQUENCE)
            {
                this.SUMMARY = SUMMARY;
                this.DTSTART = convDateString(DTSTART);
                this.DTEND = convDateString(DTEND);
                this.LOCATION = LOCATION;
                this.DESCRIPTION = DESCRIPTION;
                this.STATUS = STATUS;
                this.SEQUENCE = SEQUENCE;
            },

        toString: function()
            {
                  console.log(`${this.SUMMARY};${this.DTSTART};${this.DTEND};${this.LOCATION};${this.DESCRIPTION};${this.STATUS};${this.SEQUENCE}`);
            }
    };

function init()
    {
        const ev1 = Object.create(event);
        var Start1 = "TZID=America/New_York:20130802T103400";
        var End1 = "TZID=America/New_York:20130802T110400";
        ev1.set("Access-A-Ride Pickup", Start1, End1, "1000 Broadway Brooklyn", "Access-A-Ride trip to 900 Jay St. Brooklyn", "CONFIRMED", 3);

        const ev2 = Object.create(event);
        var Start2 = "TZID=America/New_York:20130802T173400";
        var End2 = "TZID=America/New_York:20130802T180400";
        ev2.set("groceries", Start2, End2, "nowhere", "blablabla", "CONFIRMED", 3);

        var events = [];
        events.push(ev1);
        events.push(ev2);
        return events;
    }

events = init();
fillWeeklyCalendar(events);
