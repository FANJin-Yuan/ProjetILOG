'use strict';

var file = 'fileDefaultText';
var eventsArray = [];
var currentEvent = {};

/**
 * Retrieves the correct ICS data input according to which button has been pressed
 * @Input: type
 * INPUT is the  HTML input
 * FILE_EXPLORER is the file explorer
 * EXAMPLE is the .ics file in the assets
 * @end: starts parsing retrieved content
 */
function importICS(type) {
  console.log('fire import');
  switch (type) {
    case 'INPUT':
      file = document.getElementById("icsInput").value;
      break;
    case 'EXAMPLE':
      file = ics;
      break;
  }
  parseICS(file);
}

/**
 * Reaction to file explorer use
 * @param {*} evt the file explorer file event
 * @end: starts import according to the content read
 */
function handleFileSelect(evt) {
  file = evt.target.files;

  //Check the support for the File API support 
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var fileSelected = document.getElementById('files');
    var fileTobeRead = fileSelected.files[0];
    var fileReader = new FileReader();
    fileReader.onload = function () {
      file = fileReader.result;
      importICS('FILE_EXPlORER');
    }
    fileReader.readAsText(fileTobeRead);
  }
}

/**
 * Returns a new eventsArray filtered
 * according to "startDate" and "endDate" inputs
 * Dates should be at dd/mm/yyyy format, otherwise they are ignored
 */
function dateFilter() {
  var events = eventsArray;
  // Simple checker for format
  function isDateOk(_date) {
    var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    if (_date.length == 10) {
      for (var i = 0; i < 10; i++) {
        if (i == 2 || i == 5) {
          if (_date[i] != "/") return false;
        }
        else {
          if (!(_date[i]) in numbers) return false;
        }
      }
      return true;
    }
    return false;
  }
  var startDate = document.getElementById("startDate").value;
  var endDate = document.getElementById("endDate").value;

  if (!(isDateOk(startDate)))
    var _startDate = new Date(1900, 1, 1, 0, 0, 0);
  else
    var _startDate = new Date(parseInt(startDate.substring(6, 10)), parseInt(startDate.substring(4, 6)) - 1, parseInt(startDate.substring(0, 2)), 0, 0, 0);
  if (!(isDateOk(endDate)))
    var _endDate = new Date(2100, 12, 31, 0, 0, 0);
  else
    var _endDate = new Date(parseInt(endDate.substring(6, 10)), parseInt(endDate.substring(4, 6)) - 1, parseInt(endDate.substring(0, 2)), 23, 59, 59);

  if (!(_startDate < _endDate))
    return false

  var filteredEvents = [];
  for (var i = 0; i < events.length; i++) {
    if (events[i].DTSTART != undefined && events[i].DTEND != undefined && events[i].DTSTART > _startDate && events[i].DTEND < _endDate)
      filteredEvents.push(events[i]);
  }
  return filteredEvents;
}

/**
 * Update the display with filters
 */
function updateWithFilter() {
  var filteredEvents = dateFilter();
  if (filteredEvents)
    displayEvents(filteredEvents);
}

/**
 * Convert date as String to a date Object
 * example : TZID="Europe/Brussels":20190423T180000 -> Date object (2019,4,23,18,0,0)
 * @param {*} rawDate string to convert
 * @return formatted Date
 */
function convDateString(rawDate) {
  if (rawDate == undefined) return "undefined"
  var stringDate = rawDate;
  if (rawDate.includes(":"))
    stringDate = rawDate.split(":")[1];
  return new Date(stringDate.substring(0, 4), stringDate.substring(4, 6) - 1, stringDate.substring(6, 8), stringDate.substring(9, 11), stringDate.substring(11, 13), stringDate.substring(13, 15));
}

/** 
* event Object
*/
const event =
{
  set: function (data) {
    this.UID = data["UID"];
    this.SUMMARY = data["SUMMARY"];
    this.DESCRIPTION = data["DESCRIPTION"];
    this.LOCATION = data["LOCATION"];
    this.ATTENDEE = data["ATTENDEE"];
    this.ORGANIZER = data["ORGANIZER"];
    this.DTSTART = convDateString(data["DTSTART"]);
    this.DTEND = convDateString(data["DTEND"]);
    this.STATUS = data["STATUS"];
    this.SOURCE = data["SOURCE"];
  },

  toString: function () {
    console.log(`${this.UID};${this.SUMMARY};${this.DESCRIPTION};${this.LOCATION};${this.ATTENDEE};${this.ORGANIZER};${this.DTSTART};${this.DTEND};${this.STATUS}`);
  }
};

/**
 * Parse function to convert .ics raw content into an array of events
 * @param {*} rawICS ras ics text content
 * @end: starts display function for events
 */
function parseICS(rawICS) {
  console.log('FIRE parseICS')
  eventsArray = []
  var events = rawICS.split("BEGIN:VEVENT");
  var dataToProcess = ["UID", "SUMMARY", "DESCRIPTION", "LOCATION", "ATTENDEE", "ORGANIZER", "DTSTART", "DTEND", "STATUS"]
  for (var i = 0; i < events.length; i++) // for each event bloc
  {
    events[i] = events[i].split("\n");
    var _data = {};
    for (var j = 0; j < events[i].length; j++) // for each line
    {
      for (var k = 0; k < dataToProcess.length; k++) {
        if (events[i][j].substring(0, dataToProcess[k].length) == dataToProcess[k] && _data[dataToProcess[k]] == undefined) {
          _data[dataToProcess[k]] = events[i][j].substring(dataToProcess[k].length + 1);
        }
      }
    }
    _data["SOURCE"] = events[i].join();
    // add object to array
    const ev = Object.create(event);
    ev.set(_data);
    if (i != 0)
      eventsArray.push(ev);
  }
  eventsArray = sortEvents(eventsArray);
  displayEvents(eventsArray);
}

/**
 * Sort events by date (chchronologically)
 * @param {*} events 
 * @return updated sorted events
 */
function sortEvents(events) {
  return events.sort((a, b) => { return a.DTSTART > b.DTSTART });
}

/**
 * Format date to a displayable format
 * @param {*} date 
 * @return Formated String representing the input date
 */
function formatDate(date) {
  try {
    var monthNames = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre"];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }
  catch
  {
    return "undefined";
  }

}

/**
 * Format hour to a displayable format
 * @param {*} date 
 * @return Formated String representing the input date hour
 */
function formatHour(date) {
  try {
    function addZero(i) { if (i < 10) { i = "0" + i; } return i; }
    var h = addZero(date.getHours());
    var m = addZero(date.getMinutes());
    var s = addZero(date.getSeconds());
    return h + ":" + m + ":" + s;
  }
  catch
  {
    return "undefined";
  }
}

/**
 * Fills events div with material cards
 * @param {*} events events to idsplay
 */
function displayEvents(events) {
  console.log('FIRE displayEvents');
  var innerCalendar = "";
  var previousDate = 0;
  for (var i = 0; i < events.length; i++) {
    currentEvent = events[i];
    if (previousDate !== currentEvent.DTSTART.getDate()) {
      innerCalendar += `<div class="eventHeader"> ${formatDate(currentEvent.DTSTART)} </div>`;
    }
    previousDate = currentEvent.DTSTART.getDate();


    innerCalendar += `
    <div class="demo-card-event mdl-card mdl-shadow--2dp">
      <div class="mdl-card__title mdl-card--expand">
        <h4>
          ${currentEvent.SUMMARY}<br>
          ${formatHour(currentEvent.DTSTART)} to ${formatHour(currentEvent.DTEND)} (${formatDate(currentEvent.DTEND)})<br>
        </h4>
      </div>
    <div class="mdl-card__actions mdl-card--border">
      <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="copyToClipboard(currentEvent)">
        Copy .ics
      </a>
    <div class="mdl-layout-spacer"></div>
    <i class="material-icons">event</i>
    </div>
    </div> 
    `;

  }
  document.getElementById("calendar").innerHTML = innerCalendar;
}

/**
 * Evaluates the custom textarea content
 * @end: displays the filtered events
 */
function applyCustom() {
  console.log('Fire apply custom');
  eval(document.getElementById("custom").value);
  displayEvents(eventsArray);
}

/**
 * Copies an event code into clipboard
 * @param {*} str string to put in clipboard
 */
function copyToClipboard(str) {
  const el = document.createElement('textarea');
  el.value = str.SOURCE;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

//Example data
var ics = `BEGIN:VCALENDAR
X-WR-CALNAME:ILOG
X-WR-CALID:3a239bef-087f-43c4-a363-35c8831b3d05:35109
PRODID:Zimbra-Calendar-Provider
VERSION:2.0
METHOD:PUBLISH
BEGIN:VTIMEZONE
TZID:Europe/Brussels
BEGIN:STANDARD
DTSTART:16010101T030000
TZOFFSETTO:+0100
TZOFFSETFROM:+0200
RRULE:FREQ=YEARLY;WKST=MO;INTERVAL=1;BYMONTH=10;BYDAY=-1SU
TZNAME:CET
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:16010101T020000
TZOFFSETTO:+0200
TZOFFSETFROM:+0100
RRULE:FREQ=YEARLY;WKST=MO;INTERVAL=1;BYMONTH=3;BYDAY=-1SU
TZNAME:CEST
END:DAYLIGHT
END:VTIMEZONE
BEGIN:VEVENT
UID:70ebdb2d-2336-44bd-a4ff-52cbc0851d3a
SUMMARY:COU Refactorisation DP salle A15N
DESCRIPTION:\n
X-ALT-DESC;FMTTYPE=text/html:<html><body id='htmlmode'></body></html>
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190509T083000
DTEND;TZID="Europe/Brussels":20190509T100000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083552Z
DTSTAMP:20190429T083552Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:4ef49dc9-ba93-43d5-98c3-f828082e9bde
SUMMARY:TP Refactorisation 1 CT salle B02N
DESCRIPTION:La réunion suivante a été modifiée :
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190509T101500
DTEND;TZID="Europe/Brussels":20190509T114500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083604Z
DTSTAMP:20190429T083604Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:e062f16e-8b20-47a1-9639-68eed5d1e221
SUMMARY:TP Refactorisation 2 CT salle B02N
DESCRIPTION:La réunion suivante a été modifiée :
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190509T130000
DTEND;TZID="Europe/Brussels":20190509T143000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083615Z
DTSTAMP:20190429T083615Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:2a84f686-e86a-493a-bf11-ea01925eb9a7
SUMMARY:Travail Personnel salle B02N
DESCRIPTION:La réunion suivante a été modifiée :
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190509T144500
DTEND;TZID="Europe/Brussels":20190509T161500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083618Z
DTSTAMP:20190429T083618Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:13cfae99-cd4d-4c90-b73b-01f55cd43e34
SUMMARY:TP JUnit 1 CT salle B02N
DESCRIPTION:Nouvelle demande de réunion ci-dessous :
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190510T083000
DTEND;TZID="Europe/Brussels":20190510T100000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083623Z
DTSTAMP:20190429T083623Z
SEQUENCE:3
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT

END:VCALENDAR`;