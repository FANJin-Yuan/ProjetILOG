'use strict';

// File explorer use detection
document.getElementById('files').addEventListener('change', handleFileSelect, false);

/**
 * Retrieves the correct ICS data according to which button has been pressed
 * INPUT is the  HTML input
 * FILE_EXPLORER is the file explorer
 * EXAMPLE is the .ics file in the assets
 */
function importICS(type) {
    switch (type) {
        case 'INPUT':
            console.log('Fire INPUT importICS');
            return document.getElementById("icsInput").value;

        case 'FILE_EXPLORER':
            console.log('Fire CLIPBOARD importICS');
            //TODO
            return '';
        case 'EXAMPLE':
            console.log('Fire EXAMPLE importICS');

            break;
    }
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
  }
