'use strict';

var file = 'fileDefaultText';
var eventsArray = [];
var currentEvent = {};

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

function dateFilter()
	{
		var events = eventsArray;
		function isDateOk(_date)
			{
				var numbers = ['1','2','3','4','5','6','7','8','9']
				if (_date.length == 10)
					{
						for (var i =0; i<10; i++)
							{
								if (i==2 || i==5)
									{
										if (_date[i] != "/") return false;
									}
								else 
									{
										if (!(_date[i]) in numbers) return false
									}
							}
						return true
					}
				return false
			}
		var startDate = document.getElementById("startDate").value;
		var endDate = document.getElementById("endDate").value;
		if (!(isDateOk(startDate) && isDateOk(endDate)))
			return false
		var _startDate = new Date(parseInt(startDate.substring(6, 10)), parseInt(startDate.substring(4, 6))-1, parseInt(startDate.substring(0, 2)), 0, 0, 0);
		var _endDate = new Date(parseInt(endDate.substring(6, 10)), parseInt(endDate.substring(4, 6))-1, parseInt(endDate.substring(0, 2)), 23, 59, 59);
		if (!(_startDate < _endDate))
			return false
		
		var filteredEvents = [];
		for (var i =0; i<events.length; i++)
			{
				if (events[i].DTSTART != undefined && events[i].DTEND != undefined && events[i].DTSTART > _startDate && events[i].DTEND < _endDate)
					filteredEvents.push(events[i]);
			}
		console.log(filteredEvents);
		return filteredEvents;
	}

function updateWithFilter()
	{
		var filteredEvents = dateFilter();
		displayEvents(filteredEvents);
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
  return new Date(stringDate.substring(0, 4), stringDate.substring(4, 6)-1, stringDate.substring(6, 8), stringDate.substring(9, 11), stringDate.substring(11, 13), stringDate.substring(13, 15));
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

/*
// ICS Parser
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

function sortEvents(events)
    {
        return events.sort((a, b) => {return a.DTSTART > b.DTSTART});
    }

function formatDate(date)
    {
		try 
			{
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

function formatHour(date)
    {
		try 
			{
				function addZero(i){if (i < 10) {i = "0" + i;} return i;}
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

function displayEvents(events)
    {
      console.log('FIRE displayEvents');
        var innerCalendar = "";
        var previousDate = 0;
        for (var i =0; i < events.length; i++)
            {
              currentEvent = events[i];
                if( previousDate !== currentEvent.DTSTART.getDate()) {
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

    function applyCustom(){
      console.log('Fire apply custom');
      eventsArray.filter( e => e.SUMMARY === "FERIE" );
      console.log(eventsArray);
      var test = `console.log('testfuction')`;
      eval(test);
    }


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