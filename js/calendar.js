function getDateOfTheWeekStart(_date)
    {
        return new Date(_date.getFullYear(), _date.getMonth(), _date.getDate() - _date.getDay(), 0, 0, 0);
    }

function getDateOfTheWeekEnd(_date)
    {
        return new Date(_date.getFullYear(), _date.getMonth(), _date.getDate() + (7-_date.getDay()), 23, 59, 59);
    }

function getYear(date)
    {
        if(typeof date === "undefined")
            {
                date = new Date();
            }
        return date.getFullYear();
    }

function getMonth(date)
    {
        if(typeof date === "undefined")
            {
                date = new Date();
            }
        return date.getMonth()+1;
    }

function getWeek(date)
    {
        if(typeof date === "undefined")
            {
                date = new Date();
            }
        let onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil( (((date - onejan) / 86400000) + onejan.getDay() + 1) / 7 );
    }

function getDayOfTheWeek(date)
    {
        if(typeof date === "undefined")
            {
                date = new Date();
            }
        return date.getDay();
    }

function getDayOfTheMonth(date)
    {
        if(typeof date === "undefined")
            {
                date = new Date();
            }
        return date.getDate();
    }


function fillWeeklyCalendar(events)
    {

        testDate = new Date (2013, 8, 5, 10, 10, 10);

        for (i = 0; i<events.length; i++)
            {
                console.log(events[i].DTSTART);
                console.log(events[i].DTEND);
                console.log(getDateOfTheWeekStart(testDate));
                console.log(getDateOfTheWeekEnd(testDate));

                if ((events[i].DTSTART < getDateOfTheWeekStart(testDate) && events[i].DTSTART > getDateOfTheWeekEnd(testDate)) || (events[i].DTEND > getDateOfTheWeekStart(testDate) && events[i].DTEND < getDateOfTheWeekEnd(testDate)))
                    {
                        console.log("dipslaying " + events[i].SUMMARY);
                        // Get jour et ajouter au bon svg une time frame voire l'etaler sur plusieurs jours
                    }
            }
    }
