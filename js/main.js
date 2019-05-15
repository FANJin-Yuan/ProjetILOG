'use strict';

var file = 'fileDefaultText';
var eventsArray = [];

/**
 * Retrieves the correct ICS data according to which button has been pressed
 * INPUT is the  HTML input
 * FILE_EXPLORER is the file explorer
 * EXAMPLE is the .ics file in the assets
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

function handleFileSelect(evt) {
  file = evt.target.files;

  //Check the support for the File API support 
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var fileSelected = document.getElementById('files');
      //Set the extension for the file 
      //Get the file object 
      var fileTobeRead = fileSelected.files[0];
      //Check of the extension match 
        //Initialize the FileReader object to read the 2file 
        var fileReader = new FileReader();
        fileReader.onload = function () {
          file = fileReader.result;
          importICS('FILE_EXPlORER');
        }
        fileReader.readAsText(fileTobeRead);
  }
}

/*
// Convert date as String to a date Object
// example : `TZID="Europe/Brussels":20190423T180000` -> Date object (2019,4,23,18,0,0)
*/
function convDateString(rawDate) {
  if (rawDate == undefined) return "undefined"
  var stringDate = rawDate;
  if (rawDate.includes(":"))
    stringDate = rawDate.split(":")[1];
  return new Date(stringDate.substring(0, 4), stringDate.substring(4, 6), stringDate.substring(6, 8), stringDate.substring(9, 11), stringDate.substring(11, 13), stringDate.substring(13, 15));
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
  },

  toString: function () {
    console.log(`${this.UID};${this.SUMMARY};${this.DESCRIPTION};${this.LOCATION};${this.ATTENDEE};${this.ORGANIZER};${this.DTSTART};${this.DTEND};${this.STATUS}`);
  }
};

/*
// ICS Parser
// return array of events
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
    // add object to array
    const ev = Object.create(event);
    ev.set(_data)
    eventsArray.push(ev);
  }
  console.log('eventsArray', eventsArray);
  writeDataToDiv();
}

function writeDataToDiv() {
  console.log('FIRE writeDatatoDiv');
}

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
UID:88836523-f7b1-46a0-9b9b-a84160ab0bb1
SUMMARY:COU	Production du logiciel 1 CT
LOCATION:A15N
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190423T083000
DTEND;TZID="Europe/Brussels":20190423T100000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T095311Z
DTSTAMP:20190415T095311Z
SEQUENCE:3
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:d7e8da39-49b2-4ae4-a4e8-291bdf87cea2
SUMMARY:COU	Production du logiciel 2 CT
LOCATION:A15N
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190423T101500
DTEND;TZID="Europe/Brussels":20190423T114500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T095318Z
DTSTAMP:20190415T095318Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:0059c847-6640-41f5-9ea9-854cb8ff9913
SUMMARY:Travail personnel
LOCATION:b12s@telecom-lille.fr\; "TP info B13S" <b13s@telecom-lille.fr>
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b12s@
 telecom-lille.fr
ATTENDEE;CN=TP info B13S;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b13s@telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190423T130000
DTEND;TZID="Europe/Brussels":20190423T143000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T091529Z
DTSTAMP:20190415T091529Z
SEQUENCE:4
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:f715201a-a12c-46ce-a800-742de2426b43
SUMMARY:TP Production du logiciel 1 CT
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP Production du
  logiciel 1 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telec
 om-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr>\; b12s@tel
 ecom-lille.fr [MODIFIÉ]\nRessources : "TP info B13S" <b13s@telecom-lille.fr>
 \; b12s@telecom-lille.fr \nHeure: Mardi 23 Avril 2019\, 14:45:00 - 16:15:00 
 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*
 ~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Product
 ion du logiciel 1 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle
 @telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr>\; "T
 P info B12S" <b12s@telecom-lille.fr> \nRessources : "TP info B13S" <b13s@tel
 ecom-lille.fr>\; b12s@telecom-lille.fr \nHeure: Mardi 23 Avril 2019\, 14:45:
 00 - 16:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*
 ~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B13S" <b13s@telecom-lille.fr>\; b12s@telecom-lille.fr
ATTENDEE;CN=TP info B13S;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b13s@telecom-lille.fr
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b12s@
 telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190423T144500
DTEND;TZID="Europe/Brussels":20190423T161500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T095328Z
DTSTAMP:20190415T095328Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:18dfd13d-2b73-40d9-89d6-518ebb6457e4
SUMMARY:TP Production du logiciel 2 CT
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : TP Productio
 n du logiciel 2 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@t
 elecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr>\; b12s
 @telecom-lille.fr \nRessources : "TP info B13S" <b13s@telecom-lille.fr>\; b1
 2s@telecom-lille.fr \nHeure: Mardi 23 Avril 2019\, 16:30:00 - 18:00:00 GMT +
 01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nL
 a réunion suivante a été modifiée :\n\nSujet : TP Production du logiciel 1 \
 nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> 
 \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr>\; b12s@telecom-lille.fr
  [MODIFIÉ]\nRessources : "TP info B13S" <b13s@telecom-lille.fr>\; b12s@telec
 om-lille.fr \nHeure: Mardi 23 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Br
 uxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\
 nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Production du logici
 el 1 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lill
 e.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr>\; "TP info B12S" 
 <b12s@telecom-lille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr
 >\; b12s@telecom-lille.fr \nHeure: Mardi 23 Avril 2019\, 14:45:00 - 16:30:00
  GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~
 *\n\n\n
LOCATION:"TP info B13S" <b13s@telecom-lille.fr>\; b12s@telecom-lille.fr
ATTENDEE;CN=TP info B13S;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b13s@telecom-lille.fr
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b12s@
 telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190423T163000
DTEND;TZID="Europe/Brussels":20190423T180000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T095337Z
DTSTAMP:20190415T095337Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:00a4b165-0f34-4b8d-8ab0-b5bec9aa9cde
SUMMARY:COU	Class loaders CT
DESCRIPTION:\n
X-ALT-DESC;FMTTYPE=text/html:<html><body id='htmlmode'></body></html>
LOCATION:A15N
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190424T083000
DTEND;TZID="Europe/Brussels":20190424T100000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T095234Z
DTSTAMP:20190415T095234Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:50d8f398-9279-482b-9bcf-6d4d01307924
SUMMARY:COU	Réflexion - Beans CT
DESCRIPTION:\n
X-ALT-DESC;FMTTYPE=text/html:<html><body id='htmlmode'></body></html>
LOCATION:A15N
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190424T101500
DTEND;TZID="Europe/Brussels":20190424T114500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T095243Z
DTSTAMP:20190415T095243Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:7ece80ef-d5b5-48f2-8197-699db18a6561
SUMMARY:TP JNI 1 CT
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP JNI 1 CT \nOr
 ganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\
 nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources : "T
 P info B13S" <b13s@telecom-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHeur
 e: Mercredi 24 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copen
 hague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réun
 ion ci-dessous :\n\nSujet : TP JNI 1 CT \nOrganisateur: "Christophe TOMBELLE
 " <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@
 telecom-lille.fr>\; b12s@telecom-lille.fr \nRessources : "TP info B13S" <b13
 s@telecom-lille.fr>\; b12s@telecom-lille.fr \nHeure: Mercredi 24 Avril 2019\
 , 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \
 n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP
  Production du logiciel 1 \nOrganisateur: "Christophe TOMBELLE" <christophe.
 tombelle@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.
 fr>\; b12s@telecom-lille.fr [MODIFIÉ]\nRessources : "TP info B13S" <b13s@tel
 ecom-lille.fr>\; b12s@telecom-lille.fr \nHeure: Mardi 23 Avril 2019\, 14:45:
 00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n
  \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSuje
 t : TP Production du logiciel 1 \nOrganisateur: "Christophe TOMBELLE" <chris
 tophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-
 lille.fr>\; "TP info B12S" <b12s@telecom-lille.fr> \nRessources : "TP info B
 13S" <b13s@telecom-lille.fr>\; b12s@telecom-lille.fr \nHeure: Mardi 23 Avril
  2019\, 14:45:00 - 16:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Par
 is\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:b02n@telecom-lille.fr
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b02n@
 telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190424T130000
DTEND;TZID="Europe/Brussels":20190424T143000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T093401Z
DTSTAMP:20190415T093401Z
SEQUENCE:4
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:013a1737-8b5b-48a4-9be4-7a0d55f9b17e
SUMMARY:TP JNI 2 CT
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : TP JNI 2 CT 
 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr>
  \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr>\; b12s@telecom-lille.f
 r \nRessources : "TP info B13S" <b13s@telecom-lille.fr>\; b12s@telecom-lille
 .fr \nHeure: Mercredi 24 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxell
 es\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle deman
 de de réunion ci-dessous :\n\nSujet : TP JNI 1 CT \nOrganisateur: "Christoph
 e TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B1
 3S" <b13s@telecom-lille.fr>\; b12s@telecom-lille.fr \nRessources : "TP info 
 B13S" <b13s@telecom-lille.fr>\; b12s@telecom-lille.fr \nHeure: Mercredi 24 A
 vril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\,
  Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\n
 Sujet : TP Production du logiciel 1 \nOrganisateur: "Christophe TOMBELLE" <c
 hristophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@tele
 com-lille.fr>\; b12s@telecom-lille.fr [MODIFIÉ]\nRessources : "TP info B13S"
  <b13s@telecom-lille.fr>\; b12s@telecom-lille.fr \nHeure: Mardi 23 Avril 201
 9\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [
 MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous
  :\n\nSujet : TP Production du logiciel 1 \nOrganisateur: "Christophe TOMBEL
 LE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13
 s@telecom-lille.fr>\; "TP info B12S" <b12s@telecom-lille.fr> \nRessources : 
 "TP info B13S" <b13s@telecom-lille.fr>\; b12s@telecom-lille.fr \nHeure: Mard
 i 23 Avril 2019\, 14:45:00 - 16:30:00 GMT +01:00 Bruxelles\, Copenhague\, Ma
 drid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b02n@
 telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190424T144500
DTEND;TZID="Europe/Brussels":20190424T161500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T093435Z
DTSTAMP:20190415T093435Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:6dbf5bd7-2d03-4cec-b9e6-8fc6d501da91
SUMMARY:COU	IHM Java SWT CT
DESCRIPTION:\n
X-ALT-DESC;FMTTYPE=text/html:<html><body id='htmlmode'></body></html>
LOCATION:A15N
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190424T163000
DTEND;TZID="Europe/Brussels":20190424T180000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T095304Z
DTSTAMP:20190415T095304Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:65fea256-8b4a-4dc0-ae7b-59a4939584ae
SUMMARY:TP Class loaders CT
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP Class loaders
  CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille
 .fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessour
 ces : "TP info B13S" <b13s@telecom-lille.fr>\; b02n@telecom-lille.fr [MODIFI
 É]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, 
 Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de
  réunion ci-dessous :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christ
 ophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info
  B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRe
 ssources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avril 20
 19\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\
 n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:b02n@telecom-lille.fr
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b02n@
 telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190425T083000
DTEND;TZID="Europe/Brussels":20190425T100000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T093616Z
DTSTAMP:20190415T093616Z
SEQUENCE:3
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:b4a790bb-1e5c-4ee0-86c2-dada672545f1
SUMMARY:TP Réflexion CT
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP Class loaders
  CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille
 .fr> \n\nEndroit : b02n@telecom-lille.fr [MODIFIÉ]\nRessources : b02n@teleco
 m-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +
 01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nL
 a réunion suivante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganis
 ateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndr
 oit : "TP info B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources : "TP inf
 o B13S" <b13s@telecom-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Je
 udi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, 
 Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-d
 essous :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE
 " <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B12S" <b12s@
 telecom-lille.fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "T
 P info B13S" <b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avril 2019\, 08:30:00
  - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*
 ~*~*~*~*~*~*\n\n\n
LOCATION:b02n@telecom-lille.fr
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b02n@
 telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190425T101500
DTEND;TZID="Europe/Brussels":20190425T114500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T094514Z
DTSTAMP:20190415T094514Z
SEQUENCE:0
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:9556bffe-bdb2-4df1-bfe6-35d0ce1c55a7
SUMMARY:TP SWT 2 CT
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : TP	SWT 1 \nO
 rganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n
 \nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeu
 re: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenha
 gue\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunio
 n ci-dessous :\n\nSujet : TP Réflexion CT \nOrganisateur: "Christophe TOMBEL
 LE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.
 fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 10:15
 :00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~
 *~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Class 
 loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@teleco
 m-lille.fr> \n\nEndroit : b02n@telecom-lille.fr [MODIFIÉ]\nRessources : b02n
 @telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:0
 0 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*
 ~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Class loaders CT \n
 Organisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \
 n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources : 
 "TP info B13S" <b13s@telecom-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHe
 ure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenh
 ague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réuni
 on ci-dessous :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe T
 OMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B12S"
  <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRessourc
 es : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avril 2019\, 0
 8:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n
 *~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:b02n@telecom-lille.fr
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b02n@
 telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190425T144500
DTEND;TZID="Europe/Brussels":20190425T161500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T094631Z
DTSTAMP:20190415T094631Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:b38eb898-8d96-4a6d-9508-768490fbadb8
SUMMARY:TP SWT 1 CT
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP SWT 2 CT [MOD
 IFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lill
 e.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.
 fr \nHeure: Jeudi 25 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\,
  Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle
  demande de réunion ci-dessous :\n\nSujet : TP	SWT 1 \nOrganisateur: "Christ
 ophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@tel
 ecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2
 019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris
 \n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSu
 jet : TP Réflexion CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tomb
 elle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b0
 2n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 10:15:00 - 11:45:00 GMT +
 01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nL
 a réunion suivante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganis
 ateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndr
 oit : b02n@telecom-lille.fr [MODIFIÉ]\nRessources : b02n@telecom-lille.fr [M
 ODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxell
 es\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion sui
 vante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: "Chris
 tophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP inf
 o B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources : "TP info B13S" <b13s
 @telecom-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 
 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Pari
 s\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nS
 ujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe
 .tombelle@telecom-lille.fr> \n\nEndroit : "TP info B12S" <b12s@telecom-lille
 .fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "TP info B13S" 
 <b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 G
 MT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\
 n\n\n
LOCATION:b02n@telecom-lille.fr
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b02n@
 telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190425T130000
DTEND;TZID="Europe/Brussels":20190425T143000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T094649Z
DTSTAMP:20190415T094649Z
SEQUENCE:0
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:7dc50f3c-e7ef-46ff-a539-485f008c63fa
SUMMARY:ILOG
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : ILOG \nOrgan
 isateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEn
 droit : "TP info B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@teleco
 m-lille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: M
 ardi 23 Avril 2019\, 08:00:00 - 13:00:00 GMT +01:00 Bruxelles\, Copenhague\,
  Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:b12s@telecom-lille.fr\; "TP info B13S" <b13s@telecom-lille.fr>
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b12s@
 telecom-lille.fr
ATTENDEE;CN=TP info B13S;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b13s@telecom-lille.fr
ATTENDEE;CN=ch.mahdi.96@gmail.com;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PAR
 TSTAT=DECLINED;X-NUM-GUESTS=0:mailto:ch.mahdi.96@gmail.com
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190423T080000
DTEND;TZID="Europe/Brussels":20190423T130000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T094903Z
DTSTAMP:20190415T094903Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:e184cf60-cb09-41e1-8416-dd0773664613
SUMMARY:COU Langages de script GV
DESCRIPTION:\n
X-ALT-DESC;FMTTYPE=text/html:<html><body id='htmlmode'></body></html>
LOCATION:A15N
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190426T083000
DTEND;TZID="Europe/Brussels":20190426T100000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T095222Z
DTSTAMP:20190415T095222Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:605d6221-bcaa-42bb-84e9-4116b58869d0
SUMMARY:COU IHM Java JFace CT
DESCRIPTION:\n
X-ALT-DESC;FMTTYPE=text/html:<html><body id='htmlmode'></body></html>
LOCATION:A15N
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190426T101500
DTEND;TZID="Europe/Brussels":20190426T114500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190415T095213Z
DTSTAMP:20190415T095213Z
SEQUENCE:0
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:b47c4fbe-eb1e-4231-ba7f-34056640ea5a
SUMMARY:COU UML 1 ER B13S
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : COU UML 1 ER
  A15N \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lil
 le.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "
 TP info B02N" <b02n@telecom-lille.fr> \nHeure: Vendredi 26 Avril 2019\, 13:0
 0:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*
 ~*~*~*~*~*~*~*~*\n\n\n
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190426T130000
DTEND;TZID="Europe/Brussels":20190426T143000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190423T161917Z
DTSTAMP:20190423T161917Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:07430882-6257-4617-a003-0f3f5b5c5276
SUMMARY:COU UML 2 ER B13S
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : COU UML 2 ER
  A15N \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lil
 le.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "
 TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Vendredi 26 Av
 ril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, 
 Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\
 n\nSujet : COU UML 1 ER A15N \nOrganisateur: "Christophe TOMBELLE" <christop
 he.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lil
 le.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> \nHeure: Vendre
 di 26 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, M
 adrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190426T144500
DTEND;TZID="Europe/Brussels":20190426T161500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190423T162047Z
DTSTAMP:20190423T162047Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:661f4c70-6a06-4ed0-b456-af95e059efd1
SUMMARY:COU Programmation générique 1 GV salle A15N
DESCRIPTION:\n
X-ALT-DESC;FMTTYPE=text/html:<html><body id='htmlmode'></body></html>
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190429T101500
DTEND;TZID="Europe/Brussels":20190429T114500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150034Z
DTSTAMP:20190425T150034Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:f2ed103a-eba1-4029-b62a-171da6b231af
SUMMARY:COU Programmation générique 2 GV salle A15N
DESCRIPTION:\n
X-ALT-DESC;FMTTYPE=text/html:<html><body id='htmlmode'></body></html>
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190429T130000
DTEND;TZID="Europe/Brussels":20190429T143000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150045Z
DTSTAMP:20190425T150045Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:7727a4bf-e6d5-42e0-8368-789a6545f699
SUMMARY:TP Programmation générique 2 GV salle B02N
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP Programmation
  générique 2 GV [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.t
 ombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.f
 r> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHe
 ure: Lundi 29 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenh
 ague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été
  modifiée :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Chri
 stophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP in
 fo B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom
 -lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 16:30:00 - 18:00:00
  GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~
 *~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Progra
 mmation générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tom
 belle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr>
  \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeur
 e: Lundi 29 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhag
 ue\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion
  ci-dessous :\n\nSujet : TP SWT 1 CT \nOrganisateur: "Christophe TOMBELLE" <
 christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \n
 Ressources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 -
  14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*
 ~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP SWT 2 CT [M
 ODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-li
 lle.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lill
 e.fr \nHeure: Jeudi 25 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles
 \, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvel
 le demande de réunion ci-dessous :\n\nSujet : TP	SWT 1 \nOrganisateur: "Chri
 stophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@t
 elecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril
  2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Par
 is\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\n
 Sujet : TP Réflexion CT \nOrganisateur: "Christophe TOMBELLE" <christophe.to
 mbelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : 
 b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 10:15:00 - 11:45:00 GMT
  +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\
 nLa réunion suivante a été modifiée :\n\nSujet : TP Class loaders CT \nOrgan
 isateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEn
 droit : b02n@telecom-lille.fr [MODIFIÉ]\nRessources : b02n@telecom-lille.fr 
 [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxe
 lles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion s
 uivante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: "Chr
 istophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP i
 nfo B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources : "TP info B13S" <b1
 3s@telecom-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avri
 l 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Pa
 ris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\
 nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christop
 he.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B12S" <b12s@telecom-lil
 le.fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "TP info B13S
 " <b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00
  GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~
 *\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190429T163000
DTEND;TZID="Europe/Brussels":20190429T180000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150102Z
DTSTAMP:20190425T150102Z
SEQUENCE:3
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:7894512c-cca9-49d0-b0d3-6b45c2875f67
SUMMARY:TP Programmation générique 1 GV salle B02N
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : TP Programma
 tion générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombel
 le@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \n
 Ressources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: 
 Lundi 29 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\
 , Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modi
 fiée :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christoph
 e TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B0
 2N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lill
 e.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 16:30:00 - 18:00:00 GMT 
 +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*
 ~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Programmati
 on générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle
 @telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRe
 ssources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lu
 ndi 29 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, 
 Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-d
 essous :\n\nSujet : TP SWT 1 CT \nOrganisateur: "Christophe TOMBELLE" <chris
 tophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nResso
 urces : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:3
 0:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~
 *~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP SWT 2 CT [MODIFI
 É]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.f
 r> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr 
 \nHeure: Jeudi 25 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Co
 penhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle de
 mande de réunion ci-dessous :\n\nSujet : TP	SWT 1 \nOrganisateur: "Christoph
 e TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@teleco
 m-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019
 \, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n 
 \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet
  : TP Réflexion CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombell
 e@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@
 telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 10:15:00 - 11:45:00 GMT +01:
 00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa r
 éunion suivante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganisate
 ur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit
  : b02n@telecom-lille.fr [MODIFIÉ]\nRessources : b02n@telecom-lille.fr [MODI
 FIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\
 , Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivan
 te a été modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christop
 he TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B
 02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources : "TP info B13S" <b13s@te
 lecom-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 201
 9\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n
  \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSuje
 t : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.to
 mbelle@telecom-lille.fr> \n\nEndroit : "TP info B12S" <b12s@telecom-lille.fr
 >\; "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "TP info B13S" <b1
 3s@telecom-lille.fr> \nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT 
 +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n
 \n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190429T144500
DTEND;TZID="Europe/Brussels":20190429T161500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150058Z
DTSTAMP:20190425T150058Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:46dd9436-9b3a-467f-ab39-71dbca5f304f
SUMMARY:COU Programmation fonctionnelle 1 GV salle A15N
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP Programmation
  générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@t
 elecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRess
 ources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lund
 i 29 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Ma
 drid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réun
 ion ci-dessous :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: 
 "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "
 TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@te
 lecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 13:00:00 - 14:
 30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*
 ~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP SWT 1 CT \n
 Organisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \
 n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHe
 ure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenh
 ague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été
  modifiée :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\nOrganisateur: "Christophe TOMB
 ELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lill
 e.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 14:
 45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ
 ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nS
 ujet : TP	SWT 1 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@t
 elecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@tel
 ecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 
 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvell
 e demande de réunion ci-dessous :\n\nSujet : TP Réflexion CT \nOrganisateur:
  "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : 
 b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25
  Avril 2019\, 10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid
 \, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n
 \nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christo
 phe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr [MODIFIÉ]
 \nRessources : b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\,
  08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n
 \n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP 
 Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@
 telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [MODI
 FIÉ]\nRessources : "TP info B13S" <b13s@telecom-lille.fr>\; b02n@telecom-lil
 le.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00
  Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvel
 le demande de réunion ci-dessous :\n\nSujet : TP Class loaders CT \nOrganisa
 teur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndro
 it : "TP info B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telecom-l
 ille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Jeud
 i 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Ma
 drid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190430T083000
DTEND;TZID="Europe/Brussels":20190430T100000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150113Z
DTSTAMP:20190425T150113Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:152bb4ff-32ea-4c16-9292-213ce3c48bf0
SUMMARY:COU Programmation fonctionnelle 2 GV salle A15N
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : COU Programm
 ation fonctionnelle 2 GV A15N \nOrganisateur: "Christophe TOMBELLE" <christo
 phe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-li
 lle.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> \nHeure: Mardi
  30 Avril 2019\, 10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Mad
 rid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dess
 ous :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christophe
  TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02
 N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille
 .fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 14:45:00 - 16:15:00 GMT +
 01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nL
 a réunion suivante a été modifiée :\n\nSujet : TP Programmation générique 1 
 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.
 fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP 
 info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 20
 19\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris 
 [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessou
 s :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christophe T
 OMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N"
  <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.f
 r> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 13:00:00 - 14:30:00 GMT +01
 :00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNou
 velle demande de réunion ci-dessous :\n\nSujet : TP SWT 1 CT \nOrganisateur:
  "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : 
 b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25
  Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid
 \, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n
 \nSujet : TP SWT 2 CT [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christ
 ophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessou
 rces : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 14:45:00 - 16:15
 :00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*
 ~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP	SWT
  1 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.
 fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr
  \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, C
 openhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de 
 réunion ci-dessous :\n\nSujet : TP Réflexion CT \nOrganisateur: "Christophe 
 TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-
 lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\,
  10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n
 \n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP 
 Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@
 telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr [MODIFIÉ]\nRessources 
 : b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 1
 0:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*
 ~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Class loaders
  CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille
 .fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessour
 ces : "TP info B13S" <b13s@telecom-lille.fr>\; b02n@telecom-lille.fr [MODIFI
 É]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, 
 Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de
  réunion ci-dessous :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christ
 ophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info
  B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRe
 ssources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avril 20
 19\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\
 n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190430T101500
DTEND;TZID="Europe/Brussels":20190430T114500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150121Z
DTSTAMP:20190425T150121Z
SEQUENCE:3
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:07c3f1af-696c-416c-9ce2-bb219f06ef5b
SUMMARY:TP Programmation fonctionnelle 1 GV salle B02N
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : TP Programma
 tion fonctionnelle 1 GV B02N \nOrganisateur: "Christophe TOMBELLE" <christop
 he.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lil
 le.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) 
 \nHeure: Mardi 30 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Co
 penhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de r
 éunion ci-dessous :\n\nSujet : TP Programmation générique 1 GV \nOrganisateu
 r: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit 
 : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n
 @telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 14:45:00 - 
 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~
 *~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Programmatio
 n générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@
 telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRes
 sources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lun
 di 29 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, M
 adrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réu
 nion ci-dessous :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur:
  "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : 
 "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@t
 elecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 13:00:00 - 14
 :30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~
 *~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP SWT 1 CT \
 nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> 
 \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nH
 eure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copen
 hague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a ét
 é modifiée :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\nOrganisateur: "Christophe TOM
 BELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lil
 le.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 14
 :45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFI
 É]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\n
 Sujet : TP	SWT 1 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@
 telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@te
 lecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00
  Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvel
 le demande de réunion ci-dessous :\n\nSujet : TP Réflexion CT \nOrganisateur
 : "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit :
  b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 2
 5 Avril 2019\, 10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madri
 d\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\
 n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christ
 ophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr [MODIFIÉ
 ]\nRessources : b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\
 , 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \
 n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP
  Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle
 @telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [MOD
 IFIÉ]\nRessources : "TP info B13S" <b13s@telecom-lille.fr>\; b02n@telecom-li
 lle.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:0
 0 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouve
 lle demande de réunion ci-dessous :\n\nSujet : TP Class loaders CT \nOrganis
 ateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndr
 oit : "TP info B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telecom-
 lille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Jeu
 di 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, M
 adrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190430T130000
DTEND;TZID="Europe/Brussels":20190430T143000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150129Z
DTSTAMP:20190425T150129Z
SEQUENCE:5
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:538532f5-0aa7-4caa-8272-5585e137f320
SUMMARY:Travail personnel salle B02N
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : Travail pers
 onnel B02N \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@teleco
 m-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessource
 s : "TP info B02N" <b02n@telecom-lille.fr> \nHeure: Mardi 30 Avril 2019\, 14
 :45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*
 ~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP
  Programmation générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christo
 phe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-li
 lle.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N)
  \nHeure: Lundi 29 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, C
 openhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante 
 a été modifiée :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: 
 "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "
 TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@te
 lecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 16:30:00 - 18:
 00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*
 ~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP P
 rogrammation générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christoph
 e.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lill
 e.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \
 nHeure: Lundi 29 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Cop
 enhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de ré
 union ci-dessous :\n\nSujet : TP SWT 1 CT \nOrganisateur: "Christophe TOMBEL
 LE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.
 fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00
 :00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~
 *~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP SWT 2 
 CT [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telec
 om-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom
 -lille.fr \nHeure: Jeudi 25 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Brux
 elles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nN
 ouvelle demande de réunion ci-dessous :\n\nSujet : TP	SWT 1 \nOrganisateur: 
 "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b
 02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 
 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\
 , Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous 
 :\n\nSujet : TP Réflexion CT \nOrganisateur: "Christophe TOMBELLE" <christop
 he.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessourc
 es : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 10:15:00 - 11:45:0
 0 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*
 ~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Class loaders CT \n
 Organisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \
 n\nEndroit : b02n@telecom-lille.fr [MODIFIÉ]\nRessources : b02n@telecom-lill
 e.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 
 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réun
 ion suivante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur:
  "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : 
 "TP info B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources : "TP info B13S
 " <b13s@telecom-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25
  Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid
 \, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous
  :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <chr
 istophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B12S" <b12s@teleco
 m-lille.fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "TP info
  B13S" <b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:
 00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*
 ~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190430T144500
DTEND;TZID="Europe/Brussels":20190430T161500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150135Z
DTSTAMP:20190425T150135Z
SEQUENCE:3
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:096866b7-5f78-4870-a6e2-b3c1e24fbff1
SUMMARY:Travail personnel salle B02N
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : Travail personne
 l B02N [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@t
 elecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRess
 ources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Mard
 i 30 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Ma
 drid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-des
 sous :\n\nSujet : Travail personnel CT B02N \nOrganisateur: "Christophe TOMB
 ELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b
 02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> 
 \nHeure: Mardi 30 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Co
 penhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de r
 éunion ci-dessous :\n\nSujet : TP Programmation générique 1 GV \nOrganisateu
 r: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit 
 : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n
 @telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 14:45:00 - 
 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~
 *~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Programmatio
 n générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@
 telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRes
 sources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lun
 di 29 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, M
 adrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réu
 nion ci-dessous :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur:
  "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : 
 "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@t
 elecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 13:00:00 - 14
 :30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~
 *~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP SWT 1 CT \
 nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> 
 \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nH
 eure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copen
 hague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a ét
 é modifiée :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\nOrganisateur: "Christophe TOM
 BELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lil
 le.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 14
 :45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFI
 É]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\n
 Sujet : TP	SWT 1 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@
 telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@te
 lecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00
  Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvel
 le demande de réunion ci-dessous :\n\nSujet : TP Réflexion CT \nOrganisateur
 : "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit :
  b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 2
 5 Avril 2019\, 10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madri
 d\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\
 n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christ
 ophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr [MODIFIÉ
 ]\nRessources : b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\
 , 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \
 n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP
  Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle
 @telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [MOD
 IFIÉ]\nRessources : "TP info B13S" <b13s@telecom-lille.fr>\; b02n@telecom-li
 lle.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:0
 0 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouve
 lle demande de réunion ci-dessous :\n\nSujet : TP Class loaders CT \nOrganis
 ateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndr
 oit : "TP info B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telecom-
 lille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Jeu
 di 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, M
 adrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190430T163000
DTEND;TZID="Europe/Brussels":20190430T180000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150142Z
DTSTAMP:20190425T150142Z
SEQUENCE:4
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:27f0fb7e-5978-4809-b422-2d038312bbf7
SUMMARY:COU Design Patterns 1 CT salle A15N
DESCRIPTION:\n
X-ALT-DESC;FMTTYPE=text/html:<html><body id='htmlmode'></body></html>
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190502T083000
DTEND;TZID="Europe/Brussels":20190502T100000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150149Z
DTSTAMP:20190425T150149Z
SEQUENCE:3
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:dd235245-27a9-4fbe-a907-b4edb9ae4d5d
SUMMARY:COU Design Patterns 2 CT salle A15N
DESCRIPTION:\n
X-ALT-DESC;FMTTYPE=text/html:<html><body id='htmlmode'></body></html>
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190502T101500
DTEND;TZID="Europe/Brussels":20190502T114500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150154Z
DTSTAMP:20190425T150154Z
SEQUENCE:3
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:0ac04c85-6db4-4e29-ba49-3c73184ca19f
SUMMARY:TP Design Patterns 2 CT salle B02N
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : TP Design Pa
 tterns 2 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telec
 om-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessourc
 es : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Jeudi 2 
 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, 
 Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\
 n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christophe TOMBE
 LLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b0
 2n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (
 TP info B02N) \nHeure: Lundi 29 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 
 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réun
 ion suivante a été modifiée :\n\nSujet : TP Programmation générique 1 GV \nO
 rganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n
 \nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B
 02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 1
 6:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIF
 IÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\
 nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christophe TOMBELL
 E" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n
 @telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP
  info B02N) \nHeure: Lundi 29 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Br
 uxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle 
 demande de réunion ci-dessous :\n\nSujet : TP SWT 1 CT \nOrganisateur: "Chri
 stophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@t
 elecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril
  2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Par
 is\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSuje
 t : TP SWT 2 CT [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.t
 ombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources :
  b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 14:45:00 - 16:15:00 GM
 T +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*
 ~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP	SWT 1 \nO
 rganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n
 \nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeu
 re: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenha
 gue\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunio
 n ci-dessous :\n\nSujet : TP Réflexion CT \nOrganisateur: "Christophe TOMBEL
 LE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.
 fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 10:15
 :00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~
 *~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Class 
 loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@teleco
 m-lille.fr> \n\nEndroit : b02n@telecom-lille.fr [MODIFIÉ]\nRessources : b02n
 @telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:0
 0 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*
 ~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Class loaders CT \n
 Organisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \
 n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources : 
 "TP info B13S" <b13s@telecom-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHe
 ure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenh
 ague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réuni
 on ci-dessous :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe T
 OMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B12S"
  <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRessourc
 es : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avril 2019\, 0
 8:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n
 *~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190502T144500
DTEND;TZID="Europe/Brussels":20190502T161500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150217Z
DTSTAMP:20190425T150217Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:bd2af575-125b-4760-85bc-fcaa0430767c
SUMMARY:TP Design Patterns 1 CT salle B02N
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : TP Design Pa
 tterns 1 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telec
 om-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessourc
 es : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Jeudi 2 
 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, 
 Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\
 n\nSujet : TP Design Patterns 2 CT \nOrganisateur: "Christophe TOMBELLE" <ch
 ristophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telec
 om-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info 
 B02N) \nHeure: Jeudi 2 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\,
  Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande d
 e réunion ci-dessous :\n\nSujet : TP Programmation générique 1 GV \nOrganisa
 teur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndro
 it : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b
 02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 14:45:00
  - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*
 ~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Programma
 tion générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombel
 le@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \n
 Ressources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: 
 Lundi 29 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\
 , Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de 
 réunion ci-dessous :\n\nSujet : TP Programmation générique 1 GV \nOrganisate
 ur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit
  : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02
 n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 13:00:00 -
  14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*
 ~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP SWT 1 C
 T \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.f
 r> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr 
 \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Co
 penhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a
  été modifiée :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\nOrganisateur: "Christophe 
 TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-
 lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\,
  14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MOD
 IFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\
 n\nSujet : TP	SWT 1 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombel
 le@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n
 @telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01
 :00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNou
 velle demande de réunion ci-dessous :\n\nSujet : TP Réflexion CT \nOrganisat
 eur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroi
 t : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeud
 i 25 Avril 2019\, 10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Ma
 drid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée
  :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <chr
 istophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr [MODI
 FIÉ]\nRessources : b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 20
 19\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\
 n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet :
  TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombe
 lle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [
 MODIFIÉ]\nRessources : "TP info B13S" <b13s@telecom-lille.fr>\; b02n@telecom
 -lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +0
 1:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNo
 uvelle demande de réunion ci-dessous :\n\nSujet : TP Class loaders CT \nOrga
 nisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nE
 ndroit : "TP info B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telec
 om-lille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: 
 Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\
 , Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190502T130000
DTEND;TZID="Europe/Brussels":20190502T143000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150214Z
DTSTAMP:20190425T150214Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:30a99567-162b-469f-a052-19bf10eaa8e6
SUMMARY:TP JFace 1 CT salle B02N
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP JFace 1 CT B0
 2N [MODIFIÉ]\nOrganisateur: christophe.tombelle@telecom-lille.fr \nEnvoyé pa
 r: "Valérie DELATTRE" <valerie.delattre@imt-lille-douai.fr> \n\nEndroit : "T
 P info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@tel
 ecom-lille.fr> (TP info B02N) \nHeure: Vendredi 3 Mai 2019\, 08:30:00 - 10:0
 0:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~
 *~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP JFace 1 CT B12S 
 B13S [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@tel
 ecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessou
 rces : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Vendre
 di 3 Mai 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madr
 id\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-desso
 us :\n\nSujet : Travail Personnel \nOrganisateur: "Christophe TOMBELLE" <chr
 istophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@teleco
 m-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> \nHeure: V
 endredi 3 Mai 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\,
  Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-
 dessous :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christ
 ophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info
  B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-l
 ille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 14:45:00 - 16:15:00 G
 MT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\
 n\nLa réunion suivante a été modifiée :\n\nSujet : TP Programmation génériqu
 e 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-li
 lle.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : 
 "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avri
 l 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Pa
 ris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-de
 ssous :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christop
 he TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B
 02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lil
 le.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 13:00:00 - 14:30:00 GMT
  +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\
 nNouvelle demande de réunion ci-dessous :\n\nSujet : TP SWT 1 CT \nOrganisat
 eur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroi
 t : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeud
 i 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Ma
 drid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée
  :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <ch
 ristophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRe
 ssources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 14:45:00 - 1
 6:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*
 ~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP
 	SWT 1 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-li
 lle.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lill
 e.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles
 \, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande
  de réunion ci-dessous :\n\nSujet : TP Réflexion CT \nOrganisateur: "Christo
 phe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@tele
 com-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 20
 19\, 10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\
 n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet :
  TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombe
 lle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr [MODIFIÉ]\nRessour
 ces : b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00
  - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*
 ~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Class loa
 ders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-l
 ille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRes
 sources : "TP info B13S" <b13s@telecom-lille.fr>\; b02n@telecom-lille.fr [MO
 DIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelle
 s\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demand
 e de réunion ci-dessous :\n\nSujet : TP Class loaders CT \nOrganisateur: "Ch
 ristophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP 
 info B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telecom-lille.fr> 
 \nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avri
 l 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Pa
 ris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190503T083000
DTEND;TZID="Europe/Brussels":20190503T100000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150201Z
DTSTAMP:20190425T150201Z
SEQUENCE:3
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:1b5331b8-8831-418f-93ba-b1fe454720c6
SUMMARY:TP JFace 2 CT salle B02N
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : TP JFace 2 C
 T B02N \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-li
 lle.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : 
 "TP info B02N" <b02n@telecom-lille.fr> \nHeure: Vendredi 3 Mai 2019\, 10:15:
 00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*
 ~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190503T101500
DTEND;TZID="Europe/Brussels":20190503T114500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150207Z
DTSTAMP:20190425T150207Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:a3400d77-7258-4583-93de-fa133f4a0f69
SUMMARY:TP Scripting applicatif 1 CT salle B02N
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : TP Scripting
  applicatif 1 CT B02N \nOrganisateur: "Christophe TOMBELLE" <christophe.tomb
 elle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> 
 \nRessources : "TP info B02N" <b02n@telecom-lille.fr> \nHeure: Vendredi 3 Ma
 i 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Pa
 ris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190503T130000
DTEND;TZID="Europe/Brussels":20190503T143000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150224Z
DTSTAMP:20190425T150224Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:5a82149d-ae6c-48a9-875e-6037fdc7b270
SUMMARY:TP Scripting applicatif 2 CT salle B02N
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP Scripting app
 licatif 2 CT B02N [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe
 .tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille
 .fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \n
 Heure: Vendredi 3 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Cope
 nhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réu
 nion ci-dessous :\n\nSujet : TP Programmation fonctionnelle 1 GV \nOrganisat
 eur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroi
 t : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b0
 2n@telecom-lille.fr> (TP info B02N) \nHeure: Vendredi 3 Mai 2019\, 14:45:00 
 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~
 *~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Progra
 mmation générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tom
 belle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr>
  \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeur
 e: Lundi 29 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhag
 ue\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été m
 odifiée :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christ
 ophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info
  B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-l
 ille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 16:30:00 - 18:00:00 G
 MT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~
 *~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Programm
 ation générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombe
 lle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \
 nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure:
  Lundi 29 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague
 \, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion c
 i-dessous :\n\nSujet : TP SWT 1 CT \nOrganisateur: "Christophe TOMBELLE" <ch
 ristophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRe
 ssources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 1
 4:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*
 ~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP SWT 2 CT [MOD
 IFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lill
 e.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.
 fr \nHeure: Jeudi 25 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\,
  Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle
  demande de réunion ci-dessous :\n\nSujet : TP	SWT 1 \nOrganisateur: "Christ
 ophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@tel
 ecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2
 019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris
 \n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSu
 jet : TP Réflexion CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tomb
 elle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b0
 2n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 10:15:00 - 11:45:00 GMT +
 01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nL
 a réunion suivante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganis
 ateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndr
 oit : b02n@telecom-lille.fr [MODIFIÉ]\nRessources : b02n@telecom-lille.fr [M
 ODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxell
 es\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion sui
 vante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: "Chris
 tophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP inf
 o B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources : "TP info B13S" <b13s
 @telecom-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 
 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Pari
 s\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nS
 ujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe
 .tombelle@telecom-lille.fr> \n\nEndroit : "TP info B12S" <b12s@telecom-lille
 .fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "TP info B13S" 
 <b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 G
 MT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\
 n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190503T144500
DTEND;TZID="Europe/Brussels":20190503T161500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150231Z
DTSTAMP:20190425T150231Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:9a484c95-978b-4e1b-8ea8-e219aedfe637
SUMMARY:ILOG Qroc 1 Amphi CHAPPE
LOCATION:"amphi-chappe" <amphi-chappe@telecom-lille.fr>
ATTENDEE;CN=amphi-chappe;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:amphi-chappe@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190506T100000
DTEND;TZID="Europe/Brussels":20190506T120000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190425T150341Z
DTSTAMP:20190425T150341Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:48423e41-7cc6-42d7-9d24-2e162251a616
SUMMARY:TP Programmation fonctionnelle 3 GV salle B02N
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : TP Programma
 tion fonctionnelle 3 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.to
 mbelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr
 > \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeu
 re: Lundi 6 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague
 \, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion c
 i-dessous :\n\nSujet : TP Programmation fonctionnelle 1 GV \nOrganisateur: "
 Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "T
 P info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@tel
 ecom-lille.fr> (TP info B02N) \nHeure: Vendredi 3 Mai 2019\, 14:45:00 - 16:1
 5:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~
 *~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Programmatio
 n générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@
 telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRes
 sources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lun
 di 29 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, M
 adrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifié
 e :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christophe T
 OMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N"
  <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.f
 r> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 16:30:00 - 18:00:00 GMT +01
 :00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~
 *~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Programmation 
 générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@te
 lecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nResso
 urces : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi
  29 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Mad
 rid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dess
 ous :\n\nSujet : TP SWT 1 CT \nOrganisateur: "Christophe TOMBELLE" <christop
 he.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessourc
 es : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:0
 0 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*
 ~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\
 nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> 
 \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nH
 eure: Jeudi 25 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copen
 hague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle deman
 de de réunion ci-dessous :\n\nSujet : TP	SWT 1 \nOrganisateur: "Christophe T
 OMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-l
 ille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 
 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\
 n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : 
 TP Réflexion CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@t
 elecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@tel
 ecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 10:15:00 - 11:45:00 GMT +01:00 
 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réun
 ion suivante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur:
  "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : 
 b02n@telecom-lille.fr [MODIFIÉ]\nRessources : b02n@telecom-lille.fr [MODIFIÉ
 ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, C
 openhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante 
 a été modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe 
 TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N
 " <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources : "TP info B13S" <b13s@telec
 om-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\,
  08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n
 \n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet :
  TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombe
 lle@telecom-lille.fr> \n\nEndroit : "TP info B12S" <b12s@telecom-lille.fr>\;
  "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "TP info B13S" <b13s@
 telecom-lille.fr> \nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01
 :00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190506T144500
DTEND;TZID="Europe/Brussels":20190506T161500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083415Z
DTSTAMP:20190429T083415Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:ebf7e88f-cdbd-437f-ba25-09d8ac39a12d
SUMMARY:TP Programmation fonctionnelle 2 GV salle B02N
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : TP Programma
 tion fonctionnelle 2 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.to
 mbelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr
 > \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeu
 re: Lundi 6 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague
 \, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion c
 i-dessous :\n\nSujet : TP Programmation fonctionnelle 3 GV \nOrganisateur: "
 Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "T
 P info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@tel
 ecom-lille.fr> (TP info B02N) \nHeure: Lundi 6 Mai 2019\, 14:45:00 - 16:15:0
 0 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*
 ~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Programmation f
 onctionnelle 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle
 @telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRe
 ssources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Ve
 ndredi 3 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, 
 Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-d
 essous :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christo
 phe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info 
 B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-li
 lle.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 14:45:00 - 16:15:00 GM
 T +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n
 \nLa réunion suivante a été modifiée :\n\nSujet : TP Programmation générique
  1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lil
 le.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "
 TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril
  2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Par
 is [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-des
 sous :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christoph
 e TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B0
 2N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lill
 e.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 13:00:00 - 14:30:00 GMT 
 +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n
 Nouvelle demande de réunion ci-dessous :\n\nSujet : TP SWT 1 CT \nOrganisate
 ur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit
  : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi
  25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Mad
 rid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée 
 :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <chr
 istophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRes
 sources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 14:45:00 - 16
 :15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~
 *~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP	
 SWT 1 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lil
 le.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille
 .fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\
 , Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande 
 de réunion ci-dessous :\n\nSujet : TP Réflexion CT \nOrganisateur: "Christop
 he TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telec
 om-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 201
 9\, 10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n
  \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : 
 TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombel
 le@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr [MODIFIÉ]\nRessourc
 es : b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 
 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~
 *~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Class load
 ers CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-li
 lle.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRess
 ources : "TP info B13S" <b13s@telecom-lille.fr>\; b02n@telecom-lille.fr [MOD
 IFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles
 \, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande
  de réunion ci-dessous :\n\nSujet : TP Class loaders CT \nOrganisateur: "Chr
 istophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP i
 nfo B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telecom-lille.fr> \
 nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avril
  2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Par
 is\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190506T130000
DTEND;TZID="Europe/Brussels":20190506T143000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083412Z
DTSTAMP:20190429T083412Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:20abb6de-6e26-4f5b-aad4-cc580508b0d9
SUMMARY:TP Programmation fonctionnelle 4 GV salle B02N
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP Programmation
  fonctionnelle 4 GV [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christop
 he.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lil
 le.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) 
 \nHeure: Lundi 6 Mai 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copen
 hague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réun
 ion ci-dessous :\n\nSujet : TP Programmation fonctionnelle 3 GV \nOrganisate
 ur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit
  : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02
 n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 6 Mai 2019\, 16:30:00 - 18
 :00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~
 *~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Programmat
 ion fonctionnelle 3 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tom
 belle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr>
  \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeur
 e: Lundi 6 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\
 , Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci
 -dessous :\n\nSujet : TP Programmation fonctionnelle 1 GV \nOrganisateur: "C
 hristophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP
  info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@tele
 com-lille.fr> (TP info B02N) \nHeure: Vendredi 3 Mai 2019\, 14:45:00 - 16:15
 :00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*
 ~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Programmation
  générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@t
 elecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRess
 ources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lund
 i 29 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Ma
 drid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée
  :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christophe TO
 MBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" 
 <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr
 > (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:
 00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*
 ~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Programmation g
 énérique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@tel
 ecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessou
 rces : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 
 29 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madr
 id\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-desso
 us :\n\nSujet : TP SWT 1 CT \nOrganisateur: "Christophe TOMBELLE" <christoph
 e.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessource
 s : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00
  GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~
 *\n\nLa réunion suivante a été modifiée :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\n
 Organisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \
 n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHe
 ure: Jeudi 25 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenh
 ague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demand
 e de réunion ci-dessous :\n\nSujet : TP	SWT 1 \nOrganisateur: "Christophe TO
 MBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-li
 lle.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 1
 3:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n
 *~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : T
 P Réflexion CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@te
 lecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@tele
 com-lille.fr \nHeure: Jeudi 25 Avril 2019\, 10:15:00 - 11:45:00 GMT +01:00 B
 ruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réuni
 on suivante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: 
 "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b
 02n@telecom-lille.fr [MODIFIÉ]\nRessources : b02n@telecom-lille.fr [MODIFIÉ]
 \nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Co
 penhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a
  été modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe T
 OMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N"
  <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources : "TP info B13S" <b13s@teleco
 m-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 
 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\
 n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : 
 TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombel
 le@telecom-lille.fr> \n\nEndroit : "TP info B12S" <b12s@telecom-lille.fr>\; 
 "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "TP info B13S" <b13s@t
 elecom-lille.fr> \nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:
 00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190506T163000
DTEND;TZID="Europe/Brussels":20190506T180000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083418Z
DTSTAMP:20190429T083418Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:072185f5-1c05-4200-b5e3-96db2fc6ce67
SUMMARY:COU Tests 1 DP salle A15N
DESCRIPTION:\n
X-ALT-DESC;FMTTYPE=text/html:<html><body id='htmlmode'></body></html>
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190507T083000
DTEND;TZID="Europe/Brussels":20190507T100000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083429Z
DTSTAMP:20190429T083429Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:eb00ea2e-3c7a-4377-9289-6b7dac9c904e
SUMMARY:COU Tests 2 DP salle A15N
DESCRIPTION:\n
X-ALT-DESC;FMTTYPE=text/html:<html><body id='htmlmode'></body></html>
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190507T101500
DTEND;TZID="Europe/Brussels":20190507T114500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083436Z
DTSTAMP:20190429T083436Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:7a6297ab-7214-4ce5-89c4-badb1a34ed40
SUMMARY:COU Injection de dépendances GV salle A15N
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : COU Injection de
  dépendances GV A15N [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christo
 phe.tombelle@telecom-lille.fr> \n\nEndroit : b12s@telecom-lille.fr\; "TP inf
 o B13S" <b13s@telecom-lille.fr> [MODIFIÉ]\nRessources : b12s@telecom-lille.f
 r\; "TP info B13S" <b13s@telecom-lille.fr> [MODIFIÉ]\nHeure: Mardi 7 Mai 201
 9\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n
  \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSuje
 t : TP JUnit 1 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle
 @telecom-lille.fr> \n\nEndroit : "TP info B12S" <b12s@telecom-lille.fr>\; "T
 P info B13S" <b13s@telecom-lille.fr> \nRessources : "TP info B13S" <b13s@tel
 ecom-lille.fr> \nHeure: Mardi 7 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:00 Br
 uxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle 
 demande de réunion ci-dessous :\n\nSujet : TP Design Patterns 1 CT \nOrganis
 ateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndr
 oit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <
 b02n@telecom-lille.fr> (TP info B02N) \nHeure: Jeudi 2 Mai 2019\, 13:00:00 -
  14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*
 ~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Design 
 Patterns 2 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@tel
 ecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessou
 rces : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Jeudi 
 2 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\
 , Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous 
 :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christophe TOM
 BELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <
 b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr>
  (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:0
 0 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa ré
 union suivante a été modifiée :\n\nSujet : TP Programmation générique 1 GV \
 nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> 
 \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info
  B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\,
  16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MOD
 IFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\
 n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christophe TOMBE
 LLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b0
 2n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (
 TP info B02N) \nHeure: Lundi 29 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 
 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvell
 e demande de réunion ci-dessous :\n\nSujet : TP SWT 1 CT \nOrganisateur: "Ch
 ristophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n
 @telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avr
 il 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, P
 aris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSu
 jet : TP SWT 2 CT [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe
 .tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources
  : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 14:45:00 - 16:15:00 
 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*
 ~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP	SWT 1 \
 nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> 
 \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nH
 eure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copen
 hague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réun
 ion ci-dessous :\n\nSujet : TP Réflexion CT \nOrganisateur: "Christophe TOMB
 ELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lill
 e.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 10:
 15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~
 *~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Clas
 s loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@tele
 com-lille.fr> \n\nEndroit : b02n@telecom-lille.fr [MODIFIÉ]\nRessources : b0
 2n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00
 :00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*
 ~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Class loaders CT 
 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr>
  \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources 
 : "TP info B13S" <b13s@telecom-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\n
 Heure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Cope
 nhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réu
 nion ci-dessous :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe
  TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B12
 S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRessou
 rces : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avril 2019\,
  08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n
 \n*~*~*~*~*~*~*~*~*~*\n\n\n
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190507T130000
DTEND;TZID="Europe/Brussels":20190507T143000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083441Z
DTSTAMP:20190429T083441Z
SEQUENCE:5
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:62b66ee3-9cae-4ce0-b352-fb4d5ce9bae7
SUMMARY:TP Injection de dépendances 1 GV salles B12S et B13S
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP Injection de 
 dépendances 1 GV B12S B13S [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <c
 hristophe.tombelle@telecom-lille.fr> \n\nEndroit : b12s@telecom-lille.fr\; "
 TP info B13S" <b13s@telecom-lille.fr> \nRessources : b12s@telecom-lille.fr\;
  "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Mardi 7 Mai 2019\, 14:45:00
  - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*
 ~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP JUnit
  2 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lil
 le.fr> \n\nEndroit : b12s@telecom-lille.fr\; "TP info B13S" <b13s@telecom-li
 lle.fr> \nRessources : b12s@telecom-lille.fr\; "TP info B13S" <b13s@telecom-
 lille.fr> \nHeure: Mardi 7 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxell
 es\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle deman
 de de réunion ci-dessous :\n\nSujet : TP JUnit 1 CT \nOrganisateur: "Christo
 phe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info 
 B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRes
 sources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Mardi 7 Mai 2019\,
  13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n
 \n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet :
  TP Design Patterns 1 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.t
 ombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.f
 r> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHe
 ure: Jeudi 2 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhagu
 e\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion 
 ci-dessous :\n\nSujet : TP Design Patterns 2 CT \nOrganisateur: "Christophe 
 TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N
 " <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.
 fr> (TP info B02N) \nHeure: Jeudi 2 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:0
 0 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouve
 lle demande de réunion ci-dessous :\n\nSujet : TP Programmation générique 1 
 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.
 fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP 
 info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 20
 19\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\
 n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet :
  TP Programmation générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <chri
 stophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom
 -lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B0
 2N) \nHeure: Lundi 29 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\
 , Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvell
 e demande de réunion ci-dessous :\n\nSujet : TP Programmation générique 1 GV
  \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr
 > \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP in
 fo B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019
 \, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n 
 \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet
  : TP SWT 1 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@te
 lecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@tele
 com-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 B
 ruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réuni
 on suivante a été modifiée :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\nOrganisateur:
  "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : 
 b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25
  Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid
 \, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion 
 ci-dessous :\n\nSujet : TP	SWT 1 \nOrganisateur: "Christophe TOMBELLE" <chri
 stophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRess
 ources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:
 30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*
 ~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Réflexion C
 T \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.f
 r> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr 
 \nHeure: Jeudi 25 Avril 2019\, 10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Co
 penhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a
  été modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe T
 OMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-l
 ille.fr [MODIFIÉ]\nRessources : b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeud
 i 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Ma
 drid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée
  :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <chr
 istophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@teleco
 m-lille.fr> [MODIFIÉ]\nRessources : "TP info B13S" <b13s@telecom-lille.fr>\;
  b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10
 :00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~
 *~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Class load
 ers CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-li
 lle.fr> \n\nEndroit : "TP info B12S" <b12s@telecom-lille.fr>\; "TP info B13S
 " <b13s@telecom-lille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.
 fr> \nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\
 , Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:b12s@telecom-lille.fr\; "TP info B13S" <b13s@telecom-lille.fr>
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b12s@
 telecom-lille.fr
ATTENDEE;CN=TP info B13S;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b13s@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190507T144500
DTEND;TZID="Europe/Brussels":20190507T161500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083536Z
DTSTAMP:20190429T083536Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:0264b10f-00a7-4e12-90e8-a94a6bbbbc07
SUMMARY:TP Injection de dépendances 2 GV salles B12S et B13S
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP Injection de 
 dépendances 2 GV B12S B13S [MODIFIÉ]\nOrganisateur: christophe.tombelle@tele
 com-lille.fr \nEnvoyé par: "Valérie DELATTRE" <valerie.delattre@imt-lille-do
 uai.fr> \n\nEndroit : b12s@telecom-lille.fr\; "TP info B13S" <b13s@telecom-l
 ille.fr> \nRessources : b12s@telecom-lille.fr\; "TP info B13S" <b13s@telecom
 -lille.fr> \nHeure: Mardi 7 Mai 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxel
 les\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion su
 ivante a été modifiée :\n\nSujet : TP Injection de dépendances 2 GVB12 B13S 
 [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-
 lille.fr> \n\nEndroit : b12s@telecom-lille.fr\; "TP info B13S" <b13s@telecom
 -lille.fr> \nRessources : b12s@telecom-lille.fr\; "TP info B13S" <b13s@telec
 om-lille.fr> \nHeure: Mardi 7 Mai 2019\, 16:30:00 - 18:00:00 GMT +01:00 Brux
 elles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle de
 mande de réunion ci-dessous :\n\nSujet : TP JUnit 3 CT \nOrganisateur: "Chri
 stophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b12s@t
 elecom-lille.fr\; "TP info B13S" <b13s@telecom-lille.fr> \nRessources : b12s
 @telecom-lille.fr\; "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Mardi 7 
 Mai 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, 
 Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\
 n\nSujet : TP JUnit 2 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.t
 ombelle@telecom-lille.fr> \n\nEndroit : b12s@telecom-lille.fr\; "TP info B13
 S" <b13s@telecom-lille.fr> \nRessources : b12s@telecom-lille.fr\; "TP info B
 13S" <b13s@telecom-lille.fr> \nHeure: Mardi 7 Mai 2019\, 14:45:00 - 16:15:00
  GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~
 *\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP JUnit 1 CT \nOrg
 anisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\n
 Endroit : "TP info B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@tele
 com-lille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure:
  Mardi 7 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, 
 Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-d
 essous :\n\nSujet : TP Design Patterns 1 CT \nOrganisateur: "Christophe TOMB
 ELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b
 02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> 
 (TP info B02N) \nHeure: Jeudi 2 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:00 Br
 uxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle 
 demande de réunion ci-dessous :\n\nSujet : TP Design Patterns 2 CT \nOrganis
 ateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndr
 oit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <
 b02n@telecom-lille.fr> (TP info B02N) \nHeure: Jeudi 2 Mai 2019\, 14:45:00 -
  16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*
 ~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Program
 mation générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tomb
 elle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> 
 \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure
 : Lundi 29 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhagu
 e\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été mo
 difiée :\n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christo
 phe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info 
 B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-li
 lle.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 16:30:00 - 18:00:00 GM
 T +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*
 ~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Programma
 tion générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombel
 le@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \n
 Ressources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: 
 Lundi 29 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\
 , Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci
 -dessous :\n\nSujet : TP SWT 1 CT \nOrganisateur: "Christophe TOMBELLE" <chr
 istophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRes
 sources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14
 :30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~
 *~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP SWT 2 CT [MODI
 FIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille
 .fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.f
 r \nHeure: Jeudi 25 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, 
 Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle 
 demande de réunion ci-dessous :\n\nSujet : TP	SWT 1 \nOrganisateur: "Christo
 phe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@tele
 com-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 20
 19\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\
 n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSuj
 et : TP Réflexion CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombe
 lle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02
 n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 10:15:00 - 11:45:00 GMT +0
 1:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa
  réunion suivante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganisa
 teur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndro
 it : b02n@telecom-lille.fr [MODIFIÉ]\nRessources : b02n@telecom-lille.fr [MO
 DIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelle
 s\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suiv
 ante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christ
 ophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info
  B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources : "TP info B13S" <b13s@
 telecom-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2
 019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris
 \n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSu
 jet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.
 tombelle@telecom-lille.fr> \n\nEndroit : "TP info B12S" <b12s@telecom-lille.
 fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "TP info B13S" <
 b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GM
 T +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n
 \n\n
LOCATION:b12s@telecom-lille.fr\; "TP info B13S" <b13s@telecom-lille.fr>
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b12s@
 telecom-lille.fr
ATTENDEE;CN=TP info B13S;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b13s@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190507T163000
DTEND;TZID="Europe/Brussels":20190507T180000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083541Z
DTSTAMP:20190429T083541Z
SEQUENCE:3
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
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
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP Refactorisati
 on 1 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-l
 ille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources :
  "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Jeudi 9 Mai 
 2019\, 10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Pari
 s [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dess
 ous :\n\nSujet : TP Refactorisation 1 CT \nOrganisateur: "Christophe TOMBELL
 E" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n
 @telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> \nH
 eure: Jeudi 9 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhag
 ue\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion
  ci-dessous :\n\nSujet : TP JUnit 1 CT \nOrganisateur: "Christophe TOMBELLE"
  <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B12S" <b12s@t
 elecom-lille.fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "TP
  info B13S" <b13s@telecom-lille.fr> \nHeure: Mardi 7 Mai 2019\, 13:00:00 - 1
 4:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*
 ~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Design Pa
 tterns 1 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telec
 om-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessourc
 es : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Jeudi 2 
 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, 
 Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\
 n\nSujet : TP Design Patterns 2 CT \nOrganisateur: "Christophe TOMBELLE" <ch
 ristophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telec
 om-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info 
 B02N) \nHeure: Jeudi 2 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\,
  Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande d
 e réunion ci-dessous :\n\nSujet : TP Programmation générique 1 GV \nOrganisa
 teur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndro
 it : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b
 02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 14:45:00
  - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*
 ~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Programma
 tion générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombel
 le@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \n
 Ressources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: 
 Lundi 29 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\
 , Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de 
 réunion ci-dessous :\n\nSujet : TP Programmation générique 1 GV \nOrganisate
 ur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit
  : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02
 n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 13:00:00 -
  14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*
 ~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP SWT 1 C
 T \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.f
 r> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr 
 \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Co
 penhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a
  été modifiée :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\nOrganisateur: "Christophe 
 TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-
 lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\,
  14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MOD
 IFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\
 n\nSujet : TP	SWT 1 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombel
 le@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n
 @telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01
 :00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNou
 velle demande de réunion ci-dessous :\n\nSujet : TP Réflexion CT \nOrganisat
 eur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroi
 t : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeud
 i 25 Avril 2019\, 10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Ma
 drid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée
  :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <chr
 istophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr [MODI
 FIÉ]\nRessources : b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 20
 19\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\
 n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet :
  TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombe
 lle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [
 MODIFIÉ]\nRessources : "TP info B13S" <b13s@telecom-lille.fr>\; b02n@telecom
 -lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +0
 1:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNo
 uvelle demande de réunion ci-dessous :\n\nSujet : TP Class loaders CT \nOrga
 nisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nE
 ndroit : "TP info B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telec
 om-lille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: 
 Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\
 , Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
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
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP Refactorisati
 on 2 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-l
 ille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources :
  "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Jeudi 9 Mai 
 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Pari
 s [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dess
 ous :\n\nSujet : TP Refactorisation 2 CT \nOrganisateur: "Christophe TOMBELL
 E" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n
 @telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP
  info B02N) \nHeure: Jeudi 9 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxe
 lles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle dem
 ande de réunion ci-dessous :\n\nSujet : TP Refactorisation 1 CT \nOrganisate
 ur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit
  : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02
 n@telecom-lille.fr> \nHeure: Jeudi 9 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:
 00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouv
 elle demande de réunion ci-dessous :\n\nSujet : TP JUnit 1 CT \nOrganisateur
 : "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit :
  "TP info B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@telecom-lille
 .fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Mardi 7 
 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, 
 Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\
 n\nSujet : TP Design Patterns 1 CT \nOrganisateur: "Christophe TOMBELLE" <ch
 ristophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telec
 om-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info 
 B02N) \nHeure: Jeudi 2 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\,
  Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande d
 e réunion ci-dessous :\n\nSujet : TP Design Patterns 2 CT \nOrganisateur: "C
 hristophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP
  info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@tele
 com-lille.fr> (TP info B02N) \nHeure: Jeudi 2 Mai 2019\, 14:45:00 - 16:15:00
  GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~
 *\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Programmation gé
 nérique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@tele
 com-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessour
 ces : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 2
 9 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madri
 d\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\
 n\nSujet : TP Programmation générique 1 GV \nOrganisateur: "Christophe TOMBE
 LLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b0
 2n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (
 TP info B02N) \nHeure: Lundi 29 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:00 
 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\
 n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Programmation géné
 rique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@teleco
 m-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessource
 s : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 
 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\
 , Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous 
 :\n\nSujet : TP SWT 1 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.t
 ombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources :
  b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GM
 T +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n
 \nLa réunion suivante a été modifiée :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\nOrg
 anisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\n
 Endroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure
 : Jeudi 25 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhagu
 e\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande d
 e réunion ci-dessous :\n\nSujet : TP	SWT 1 \nOrganisateur: "Christophe TOMBE
 LLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille
 .fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:0
 0:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*
 ~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP R
 éflexion CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telec
 om-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom
 -lille.fr \nHeure: Jeudi 25 Avril 2019\, 10:15:00 - 11:45:00 GMT +01:00 Brux
 elles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion 
 suivante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: "Ch
 ristophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n
 @telecom-lille.fr [MODIFIÉ]\nRessources : b02n@telecom-lille.fr [MODIFIÉ]\nH
 eure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copen
 hague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a ét
 é modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMB
 ELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b
 02n@telecom-lille.fr> [MODIFIÉ]\nRessources : "TP info B13S" <b13s@telecom-l
 ille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:
 30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~
 *~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP 
 Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@
 telecom-lille.fr> \n\nEndroit : "TP info B12S" <b12s@telecom-lille.fr>\; "TP
  info B13S" <b13s@telecom-lille.fr> \nRessources : "TP info B13S" <b13s@tele
 com-lille.fr> \nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 
 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
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
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : Travail Personne
 l \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.f
 r> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP i
 nfo B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Jeudi 9 Mai 2019\,
  14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MOD
 IFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\
 n\nSujet : Travail Personnel \nOrganisateur: "Christophe TOMBELLE" <christop
 he.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lil
 le.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) 
 \nHeure: Jeudi 9 Mai 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copen
 hague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réun
 ion ci-dessous :\n\nSujet : Travail Personnel \nOrganisateur: "Christophe TO
 MBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" 
 <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr
 > \nHeure: Vendredi 3 Mai 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, 
 Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de
  réunion ci-dessous :\n\nSujet : TP Programmation générique 1 GV \nOrganisat
 eur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroi
 t : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b0
 2n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 14:45:00 
 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~
 *~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Programmat
 ion générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombell
 e@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nR
 essources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: L
 undi 29 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\,
  Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de r
 éunion ci-dessous :\n\nSujet : TP Programmation générique 1 GV \nOrganisateu
 r: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit 
 : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n
 @telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 13:00:00 - 
 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~
 *~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP SWT 1 CT
  \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr
 > \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \
 nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Cop
 enhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a 
 été modifiée :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\nOrganisateur: "Christophe T
 OMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-l
 ille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 
 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODI
 FIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n
 \nSujet : TP	SWT 1 \nOrganisateur: "Christophe TOMBELLE" <christophe.tombell
 e@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@
 telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:
 00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouv
 elle demande de réunion ci-dessous :\n\nSujet : TP Réflexion CT \nOrganisate
 ur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit
  : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi
  25 Avril 2019\, 10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Mad
 rid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée 
 :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <chri
 stophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr [MODIF
 IÉ]\nRessources : b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 201
 9\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n
  \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : 
 TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombel
 le@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> [M
 ODIFIÉ]\nRessources : "TP info B13S" <b13s@telecom-lille.fr>\; b02n@telecom-
 lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01
 :00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNou
 velle demande de réunion ci-dessous :\n\nSujet : TP Class loaders CT \nOrgan
 isateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEn
 droit : "TP info B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b13s@teleco
 m-lille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: J
 eudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\,
  Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
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
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : TP JUnit 1 C
 T \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.f
 r> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP i
 nfo B02N" <b02n@telecom-lille.fr> \nHeure: Vendredi 10 Mai 2019\, 08:30:00 -
  10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*
 ~*~*~*~*~*\n\n\n
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
BEGIN:VEVENT
UID:d0a3cc79-8281-4537-a205-e238aa6f11d4
SUMMARY:TP JUnit 3 CT salle B02N
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP JUnit 3 CT B0
 2N [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telec
 om-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessourc
 es : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Vendredi
  10 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madri
 d\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessou
 s :\n\nSujet : TP Injection de dépendances 2 GV \nOrganisateur: "Christophe 
 TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N
 " <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.
 fr> (TP info B02N) \nHeure: Vendredi 10 Mai 2019\, 13:00:00 - 14:30:00 GMT +
 01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nN
 ouvelle demande de réunion ci-dessous :\n\nSujet : TP Programmation fonction
 nelle 2 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@teleco
 m-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessource
 s : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 6 M
 ai 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, P
 aris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n
 \nSujet : TP Programmation fonctionnelle 3 GV \nOrganisateur: "Christophe TO
 MBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" 
 <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr
 > (TP info B02N) \nHeure: Lundi 6 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:00 
 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvell
 e demande de réunion ci-dessous :\n\nSujet : TP Programmation fonctionnelle 
 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lill
 e.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "T
 P info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Vendredi 3 Mai 
 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Pari
 s\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nS
 ujet : TP Programmation générique 1 GV \nOrganisateur: "Christophe TOMBELLE"
  <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@t
 elecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP i
 nfo B02N) \nHeure: Lundi 29 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Brux
 elles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion 
 suivante a été modifiée :\n\nSujet : TP Programmation générique 1 GV \nOrgan
 isateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEn
 droit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N"
  <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 16:30
 :00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\
 n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSuj
 et : TP Programmation générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <
 christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@tel
 ecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP inf
 o B02N) \nHeure: Lundi 29 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxel
 les\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle dema
 nde de réunion ci-dessous :\n\nSujet : TP SWT 1 CT \nOrganisateur: "Christop
 he TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telec
 om-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 201
 9\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n
  \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : 
 TP SWT 2 CT [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombe
 lle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02
 n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 14:45:00 - 16:15:00 GMT +0
 1:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*
 ~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP	SWT 1 \nOrgan
 isateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEn
 droit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: 
 Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\
 , Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci
 -dessous :\n\nSujet : TP Réflexion CT \nOrganisateur: "Christophe TOMBELLE" 
 <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \
 nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 10:15:00 
 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~
 *~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP Class load
 ers CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-li
 lle.fr> \n\nEndroit : b02n@telecom-lille.fr [MODIFIÉ]\nRessources : b02n@tel
 ecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GM
 T +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n
 \nLa réunion suivante a été modifiée :\n\nSujet : TP Class loaders CT \nOrga
 nisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nE
 ndroit : "TP info B02N" <b02n@telecom-lille.fr> [MODIFIÉ]\nRessources : "TP 
 info B13S" <b13s@telecom-lille.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHeure:
  Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague
 \, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion c
 i-dessous :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBE
 LLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B12S" <b1
 2s@telecom-lille.fr>\; "TP info B13S" <b13s@telecom-lille.fr> \nRessources :
  "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Jeudi 25 Avril 2019\, 08:30
 :00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~
 *~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190510T130000
DTEND;TZID="Europe/Brussels":20190510T143000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083636Z
DTSTAMP:20190429T083636Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:5fad930f-104f-42df-b426-7433045d4d27
SUMMARY:TP JUnit 2 CT salle B02N
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : TP JUnit 2 CT B0
 2N [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telec
 om-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessourc
 es : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Vendredi
  10 Mai 2019\, 10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madri
 d\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessou
 s :\n\nSujet : TP Injection de dépendances 1 GV \nOrganisateur: "Christophe 
 TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N
 " <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.
 fr> (TP info B02N) \nHeure: Vendredi 10 Mai 2019\, 10:15:00 - 11:45:00 GMT +
 01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nN
 ouvelle demande de réunion ci-dessous :\n\nSujet : TP Injection de dépendanc
 es 2 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-l
 ille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources :
  "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Vendredi 10 
 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, 
 Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\
 n\nSujet : TP Programmation fonctionnelle 2 GV \nOrganisateur: "Christophe T
 OMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N"
  <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.f
 r> (TP info B02N) \nHeure: Lundi 6 Mai 2019\, 13:00:00 - 14:30:00 GMT +01:00
  Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvel
 le demande de réunion ci-dessous :\n\nSujet : TP Programmation fonctionnelle
  3 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lil
 le.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "
 TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 6 Mai 20
 19\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\
 n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSuj
 et : TP Programmation fonctionnelle 1 GV \nOrganisateur: "Christophe TOMBELL
 E" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n
 @telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP
  info B02N) \nHeure: Vendredi 3 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:00 Br
 uxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle 
 demande de réunion ci-dessous :\n\nSujet : TP Programmation générique 1 GV \
 nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> 
 \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info
  B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\,
  14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n
 \n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : TP 
 Programmation générique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christop
 he.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lil
 le.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) 
 \nHeure: Lundi 29 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bruxelles\, Co
 penhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle de
 mande de réunion ci-dessous :\n\nSujet : TP Programmation générique 1 GV \nO
 rganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n
 \nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B
 02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avril 2019\, 1
 3:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n
 *~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : T
 P SWT 1 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@teleco
 m-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-
 lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxe
 lles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion s
 uivante a été modifiée :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\nOrganisateur: "Ch
 ristophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n
 @telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avr
 il 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, P
 aris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-d
 essous :\n\nSujet : TP	SWT 1 \nOrganisateur: "Christophe TOMBELLE" <christop
 he.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessourc
 es : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:0
 0 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*
 ~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Réflexion CT \n
 Organisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \
 n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHe
 ure: Jeudi 25 Avril 2019\, 10:15:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenh
 ague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été
  modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBE
 LLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille
 .fr [MODIFIÉ]\nRessources : b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25
  Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid
 \, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n
 \nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELLE" <christo
 phe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-li
 lle.fr> [MODIFIÉ]\nRessources : "TP info B13S" <b13s@telecom-lille.fr>\; b02
 n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:
 00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~
 *~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Class loaders 
 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.
 fr> \n\nEndroit : "TP info B12S" <b12s@telecom-lille.fr>\; "TP info B13S" <b
 13s@telecom-lille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> 
 \nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Co
 penhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190510T101500
DTEND;TZID="Europe/Brussels":20190510T114500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083630Z
DTSTAMP:20190429T083630Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:e305743f-107f-48b9-a35a-dde1760ba29b
SUMMARY:Travail Personnel salle B02N
DESCRIPTION:Nouvelle demande de réunion ci-dessous :\n\nSujet : Travail Pers
 onnel \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lil
 le.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "
 TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Vendredi 10 Ma
 i 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Pa
 ris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSuj
 et : Travail Personnel \nOrganisateur: "Christophe TOMBELLE" <christophe.tom
 belle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr>
  \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeur
 e: Jeudi 9 Mai 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\
 , Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de 
 réunion ci-dessous :\n\nSujet : Travail Personnel \nOrganisateur: "Christoph
 e TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B0
 2N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lill
 e.fr> (TP info B02N) \nHeure: Jeudi 9 Mai 2019\, 16:30:00 - 18:00:00 GMT +01
 :00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNou
 velle demande de réunion ci-dessous :\n\nSujet : Travail Personnel \nOrganis
 ateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndr
 oit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources : "TP info B02N" <
 b02n@telecom-lille.fr> \nHeure: Vendredi 3 Mai 2019\, 08:30:00 - 10:00:00 GM
 T +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n
 \nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Programmation génér
 ique 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom
 -lille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources
  : "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 A
 vril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\,
  Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\n
 Sujet : TP Programmation générique 1 GV \nOrganisateur: "Christophe TOMBELLE
 " <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n@
 telecom-lille.fr> \nRessources : "TP info B02N" <b02n@telecom-lille.fr> (TP 
 info B02N) \nHeure: Lundi 29 Avril 2019\, 16:30:00 - 18:00:00 GMT +01:00 Bru
 xelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\n
 Nouvelle demande de réunion ci-dessous :\n\nSujet : TP Programmation génériq
 ue 1 GV \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-l
 ille.fr> \n\nEndroit : "TP info B02N" <b02n@telecom-lille.fr> \nRessources :
  "TP info B02N" <b02n@telecom-lille.fr> (TP info B02N) \nHeure: Lundi 29 Avr
 il 2019\, 13:00:00 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, P
 aris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n
 \nSujet : TP SWT 1 CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tomb
 elle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b0
 2n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:00 - 14:30:00 GMT +
 01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nL
 a réunion suivante a été modifiée :\n\nSujet : TP SWT 2 CT [MODIFIÉ]\nOrgani
 sateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEnd
 roit : b02n@telecom-lille.fr \nRessources : b02n@telecom-lille.fr \nHeure: J
 eudi 25 Avril 2019\, 14:45:00 - 16:15:00 GMT +01:00 Bruxelles\, Copenhague\,
  Madrid\, Paris [MODIFIÉ]\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de r
 éunion ci-dessous :\n\nSujet : TP	SWT 1 \nOrganisateur: "Christophe TOMBELLE
 " <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@telecom-lille.fr
  \nRessources : b02n@telecom-lille.fr \nHeure: Jeudi 25 Avril 2019\, 13:00:0
 0 - 14:30:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~
 *~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Réfl
 exion CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-
 lille.fr> \n\nEndroit : b02n@telecom-lille.fr \nRessources : b02n@telecom-li
 lle.fr \nHeure: Jeudi 25 Avril 2019\, 10:15:00 - 11:45:00 GMT +01:00 Bruxell
 es\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion sui
 vante a été modifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: "Chris
 tophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b02n@te
 lecom-lille.fr [MODIFIÉ]\nRessources : b02n@telecom-lille.fr [MODIFIÉ]\nHeur
 e: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhag
 ue\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été m
 odifiée :\n\nSujet : TP Class loaders CT \nOrganisateur: "Christophe TOMBELL
 E" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B02N" <b02n
 @telecom-lille.fr> [MODIFIÉ]\nRessources : "TP info B13S" <b13s@telecom-lill
 e.fr>\; b02n@telecom-lille.fr [MODIFIÉ]\nHeure: Jeudi 25 Avril 2019\, 08:30:
 00 - 10:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*
 ~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : TP Cla
 ss loaders CT \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@tel
 ecom-lille.fr> \n\nEndroit : "TP info B12S" <b12s@telecom-lille.fr>\; "TP in
 fo B13S" <b13s@telecom-lille.fr> \nRessources : "TP info B13S" <b13s@telecom
 -lille.fr> \nHeure: Jeudi 25 Avril 2019\, 08:30:00 - 10:00:00 GMT +01:00 Bru
 xelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B02N" <b02n@telecom-lille.fr>
ATTENDEE;CN=TP info B02N;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02n@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190510T144500
DTEND;TZID="Europe/Brussels":20190510T161500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190429T083639Z
DTSTAMP:20190429T083639Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:1ce53f6c-c6cd-4e1f-b225-25fb19a4b007
SUMMARY:ILOG Qroc 2 Amphi CHAPPE
LOCATION:"amphi-chappe" <amphi-chappe@telecom-lille.fr>
ATTENDEE;CN=amphi-chappe;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:amphi-chappe@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190513T100000
DTEND;TZID="Europe/Brussels":20190513T120000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190426T125827Z
DTSTAMP:20190426T125827Z
SEQUENCE:1
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:3404dd9a-c10e-4d42-9d04-2e6c2a21c348
SUMMARY:Projet ILOG
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : Projet ILOG \nOr
 ganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\
 nEndroit : "TP info B13S" <b13s@telecom-lille.fr> [MODIFIÉ]\nRessources : "T
 P info B13S" <b13s@telecom-lille.fr> (TP info B13S) \nHeure: Lundi 13 Mai 20
 19\, 13:00:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\
 n \nInvités: b02s@telecom-lille.fr \n\n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion s
 uivante a été modifiée :\n\nSujet : Projet ILOG \nOrganisateur: "Christophe 
 TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : b13s@telecom-
 lille.fr [MODIFIÉ]\nRessources : "TP info B13S" <b13s@telecom-lille.fr> [MOD
 IFIÉ]\nHeure: Lundi 13 Mai 2019\, 13:00:00 - 18:00:00 GMT +01:00 Bruxelles\,
  Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivant
 e a été modifiée :\n\nSujet : Projet ILOG [MODIFIÉ]\nOrganisateur: "Christop
 he TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B
 02S" <b02s@telecom-lille.fr> [MODIFIÉ]\nRessources : "TP info B02S" <b02s@te
 lecom-lille.fr> (TP info B02S) \nHeure: Lundi 13 Mai 2019\, 13:00:00 - 18:00
 :00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*
 ~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : Projet \nOrganis
 ateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndr
 oit : b02s@telecom-lille.fr \nRessources : "TP info B02S" <b02s@telecom-lill
 e.fr> \nHeure: Lundi 13 Mai 2019\, 13:00:00 - 18:00:00 GMT +01:00 Bruxelles\
 , Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B13S" <b13s@telecom-lille.fr>\; "TP info B02S" <b02s@telec
 om-lille.fr>
ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b02s@telecom-lille.fr
ATTENDEE;CN=TP info B13S;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b13s@telecom-lille.fr
ATTENDEE;CN=TP info B02S;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b02s@telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190513T130000
DTEND;TZID="Europe/Brussels":20190513T180000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190503T125318Z
DTSTAMP:20190503T125318Z
SEQUENCE:5
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:1884e7f1-01dd-43dc-9495-d681af34a66e
SUMMARY:Projet ILOG salle C02N
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : Projet ILOG [MOD
 IFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lill
 e.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "T
 P info B13S" <b13s@telecom-lille.fr> (TP info B13S) \nHeure: Mardi 14 Mai 20
 19\, 13:00:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\
 n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSuj
 et : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telec
 om-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr> \nRessourc
 es : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Mardi 14 Mai 2019\, 13:
 00:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~
 *~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : Pro
 jet \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille
 .fr> \n\nEndroit : b02s@telecom-lille.fr \nRessources : "TP info B02S" <b02s
 @telecom-lille.fr> \nHeure: Lundi 13 Mai 2019\, 13:00:00 - 18:00:00 GMT +01:
 00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B13S" <b13s@telecom-lille.fr>
ATTENDEE;CN=TP info B13S;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b13s@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190514T130000
DTEND;TZID="Europe/Brussels":20190514T180000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190509T085445Z
DTSTAMP:20190509T085445Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:f739ce6a-6d5c-4255-809d-804de4246550
SUMMARY:Projet ILOG
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : Projet \nOrganis
 ateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndr
 oit : b12s@telecom-lille.fr\; "TP info B13S" <b13s@telecom-lille.fr> [MODIFI
 É]\nRessources : "TP info B13S" <b13s@telecom-lille.fr> [MODIFIÉ]\nHeure: Ma
 rdi 14 Mai 2019\, 08:30:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Ma
 drid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-des
 sous :\n\nSujet : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.t
 ombelle@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.f
 r> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> (TP info B13S) \nHe
 ure: Mardi 14 Mai 2019\, 08:30:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhag
 ue\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion
  ci-dessous :\n\nSujet : Projet \nOrganisateur: "Christophe TOMBELLE" <chris
 tophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-
 lille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Mar
 di 14 Mai 2019\, 13:00:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Mad
 rid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dess
 ous :\n\nSujet : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.to
 mbelle@telecom-lille.fr> \n\nEndroit : b02s@telecom-lille.fr \nRessources : 
 "TP info B02S" <b02s@telecom-lille.fr> \nHeure: Lundi 13 Mai 2019\, 13:00:00
  - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*
 ~*~*~*~*~*~*\n\n\n
LOCATION:b12s@telecom-lille.fr\; "TP info B13S" <b13s@telecom-lille.fr>
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b12s@
 telecom-lille.fr
ATTENDEE;CN=TP info B13S;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b13s@telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190514T083000
DTEND;TZID="Europe/Brussels":20190514T114500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190503T124652Z
DTSTAMP:20190503T124652Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:b53398b1-55a2-449b-ba37-ed0a192d68dd
SUMMARY:Projet ILOG salle A14N
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : Projet ILOG [MOD
 IFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lill
 e.fr> \n\nEndroit : "TP info B12S" <b12s@telecom-lille.fr> [MODIFIÉ]\nRessou
 rces : "TP info B12S" <b12s@telecom-lille.fr> (TP info B12S) \nHeure: Mercre
 di 15 Mai 2019\, 13:00:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Mad
 rid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dess
 ous :\n\nSujet : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.to
 mbelle@telecom-lille.fr> \n\nEndroit : b12s@telecom-lille.fr \nRessources : 
 "TP info B12S" <b12s@telecom-lille.fr> \nHeure: Mercredi 15 Mai 2019\, 13:00
 :00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~
 *~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : Proje
 t \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.f
 r> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "TP i
 nfo B13S" <b13s@telecom-lille.fr> \nHeure: Mardi 14 Mai 2019\, 13:00:00 - 18
 :00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~
 *~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : Projet \nOrga
 nisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\nE
 ndroit : b02s@telecom-lille.fr \nRessources : "TP info B02S" <b02s@telecom-l
 ille.fr> \nHeure: Lundi 13 Mai 2019\, 13:00:00 - 18:00:00 GMT +01:00 Bruxell
 es\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B12S" <b12s@telecom-lille.fr>
ATTENDEE;CN=TP info B12S;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b12s@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190515T130000
DTEND;TZID="Europe/Brussels":20190515T180000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190509T085514Z
DTSTAMP:20190509T085514Z
SEQUENCE:3
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:9e78a968-a99b-4c12-9f51-dfd3ca470516
SUMMARY:Projet ILOG salle C02N
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : Projet ILOG [MOD
 IFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lill
 e.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "T
 P info B13S" <b13s@telecom-lille.fr> (TP info B13S) \nHeure: Jeudi 16 Mai 20
 19\, 08:30:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\
 n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSuj
 et : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telec
 om-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr> \nRessourc
 es : "TP info B13S" <b13s@telecom-lille.fr> (TP info B13S) \nHeure: Jeudi 16
  Mai 2019\, 08:30:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\,
  Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :
 \n\nSujet : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.tombell
 e@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr> \nR
 essources : "TP info B13S" <b13s@telecom-lille.fr> (TP info B13S) \nHeure: M
 ardi 14 Mai 2019\, 08:30:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, M
 adrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-de
 ssous :\n\nSujet : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.
 tombelle@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.
 fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Mardi 14 
 Mai 2019\, 13:00:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, 
 Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\
 n\nSujet : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle
 @telecom-lille.fr> \n\nEndroit : b02s@telecom-lille.fr \nRessources : "TP in
 fo B02S" <b02s@telecom-lille.fr> \nHeure: Lundi 13 Mai 2019\, 13:00:00 - 18:
 00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*
 ~*~*~*\n\n\n
LOCATION:"TP info B13S" <b13s@telecom-lille.fr>
ATTENDEE;CN=TP info B13S;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b13s@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190516T083000
DTEND;TZID="Europe/Brussels":20190516T114500
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190509T085541Z
DTSTAMP:20190509T085541Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:69b2836a-2003-46a5-88a7-9f634a9dce2c
SUMMARY:Projet ILOG salle C02N
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : Projet ILOG [MOD
 IFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lill
 e.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "T
 P info B13S" <b13s@telecom-lille.fr> (TP info B13S) \nHeure: Jeudi 16 Mai 20
 19\, 13:00:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\
 n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSuj
 et : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telec
 om-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr> \nRessourc
 es : "TP info B13S" <b13s@telecom-lille.fr> (TP info B13S) \nHeure: Jeudi 16
  Mai 2019\, 13:00:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\,
  Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :
 \n\nSujet : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.tombell
 e@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr> \nR
 essources : "TP info B13S" <b13s@telecom-lille.fr> (TP info B13S) \nHeure: J
 eudi 16 Mai 2019\, 08:30:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, M
 adrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-de
 ssous :\n\nSujet : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.
 tombelle@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.
 fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> (TP info B13S) \nH
 eure: Mardi 14 Mai 2019\, 08:30:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenha
 gue\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunio
 n ci-dessous :\n\nSujet : Projet \nOrganisateur: "Christophe TOMBELLE" <chri
 stophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom
 -lille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Ma
 rdi 14 Mai 2019\, 13:00:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Ma
 drid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-des
 sous :\n\nSujet : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.t
 ombelle@telecom-lille.fr> \n\nEndroit : b02s@telecom-lille.fr \nRessources :
  "TP info B02S" <b02s@telecom-lille.fr> \nHeure: Lundi 13 Mai 2019\, 13:00:0
 0 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~
 *~*~*~*~*~*~*\n\n\n
LOCATION:"TP info B13S" <b13s@telecom-lille.fr>
ATTENDEE;CN=TP info B13S;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEP
 TED:mailto:b13s@telecom-lille.fr
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190516T130000
DTEND;TZID="Europe/Brussels":20190516T180000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190509T085544Z
DTSTAMP:20190509T085544Z
SEQUENCE:2
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:791cc030-e926-42da-aac7-1b826690d2ae
SUMMARY:Présentation des projets ILOG
DESCRIPTION:La réunion suivante a été modifiée :\n\nSujet : Présentation des
  projets - [MODIFIÉ]\nOrganisateur: "Christophe TOMBELLE" <christophe.tombel
 le@telecom-lille.fr> \n\nEndroit : b01n@telecom-lille.fr [MODIFIÉ]\nRessourc
 es : b01n@telecom-lille.fr [MODIFIÉ]\nHeure: Vendredi 17 Mai 2019\, 08:30:00
  - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris [MODIFIÉ]\n \
 n\n*~*~*~*~*~*~*~*~*~*\n\nLa réunion suivante a été modifiée :\n\nSujet : Pr
 ésentation des projets - Amphi ??? [MODIFIÉ]\nOrganisateur: "Christophe TOMB
 ELLE" <christophe.tombelle@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b
 13s@telecom-lille.fr> \nRessources : "TP info B13S" <b13s@telecom-lille.fr> 
 (TP info B13S) \nHeure: Vendredi 17 Mai 2019\, 08:30:00 - 11:45:00 GMT +01:0
 0 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouve
 lle demande de réunion ci-dessous :\n\nSujet : Présentation des projets \nOr
 ganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lille.fr> \n\
 nEndroit : "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "TP info B1
 3S" <b13s@telecom-lille.fr> (TP info B13S) \nHeure: Vendredi 17 Mai 2019\, 0
 8:30:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n
 *~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSujet : P
 rojet \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telecom-lil
 le.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr> \nRessources : "
 TP info B13S" <b13s@telecom-lille.fr> (TP info B13S) \nHeure: Jeudi 16 Mai 2
 019\, 08:30:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris
 \n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSu
 jet : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@tele
 com-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr> \nRessour
 ces : "TP info B13S" <b13s@telecom-lille.fr> (TP info B13S) \nHeure: Mardi 1
 4 Mai 2019\, 08:30:00 - 11:45:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\
 , Paris\n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous 
 :\n\nSujet : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.tombel
 le@telecom-lille.fr> \n\nEndroit : "TP info B13S" <b13s@telecom-lille.fr> \n
 Ressources : "TP info B13S" <b13s@telecom-lille.fr> \nHeure: Mardi 14 Mai 20
 19\, 13:00:00 - 18:00:00 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\
 n \n\n*~*~*~*~*~*~*~*~*~*\n\nNouvelle demande de réunion ci-dessous :\n\nSuj
 et : Projet \nOrganisateur: "Christophe TOMBELLE" <christophe.tombelle@telec
 om-lille.fr> \n\nEndroit : b02s@telecom-lille.fr \nRessources : "TP info B02
 S" <b02s@telecom-lille.fr> \nHeure: Lundi 13 Mai 2019\, 13:00:00 - 18:00:00 
 GMT +01:00 Bruxelles\, Copenhague\, Madrid\, Paris\n \n\n*~*~*~*~*~*~*~*~*~*
 \n\n\n
LOCATION:b01n@telecom-lille.fr
ATTENDEE;CUTYPE=RESOURCE;ROLE=NON-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:b01n@
 telecom-lille.fr
ORGANIZER;CN=Christophe TOMBELLE:mailto:christophe.tombelle@telecom-lille.fr
DTSTART;TZID="Europe/Brussels":20190517T083000
DTEND;TZID="Europe/Brussels":20190517T180000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190503T124828Z
DTSTAMP:20190503T124828Z
SEQUENCE:4
BEGIN:VALARM
ACTION:DISPLAY
TRIGGER;RELATED=START:-PT15M
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
BEGIN:VEVENT
UID:a5fc1d9e-389d-48b8-b0bc-cec69beaf0e8
SUMMARY:FERIE
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;VALUE=DATE:20190501
DTEND;VALUE=DATE:20190502
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-ALLDAYEVENT:TRUE
X-MICROSOFT-CDO-INTENDEDSTATUS:FREE
TRANSP:TRANSPARENT
LAST-MODIFIED:20190426T121644Z
DTSTAMP:20190426T121644Z
SEQUENCE:0
END:VEVENT
BEGIN:VEVENT
UID:8d1c9324-45fe-482b-8d91-b438aaff7496
SUMMARY:LANGUES LV2 Chinois salle E002S - FLE salle A11N - ALL Gr1 salle E10
 2S - Gr2 salle E003S/ESP Gr1 salle E001S - Gr2 Salle E101S
ORGANIZER;SENT-BY="mailto:valerie.delattre@imt-lille-douai.fr":mailto:christ
 ophe.tombelle@telecom-lille.fr
X-MS-OLK-SENDER:mailto:valerie.delattre@imt-lille-douai.fr
DTSTART;TZID="Europe/Brussels":20190515T083000
DTEND;TZID="Europe/Brussels":20190515T100000
STATUS:CONFIRMED
CLASS:PUBLIC
X-MICROSOFT-CDO-INTENDEDSTATUS:BUSY
TRANSP:OPAQUE
LAST-MODIFIED:20190506T081442Z
DTSTAMP:20190506T081442Z
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;