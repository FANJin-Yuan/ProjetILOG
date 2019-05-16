var buttonDownload = document.getElementById("downloadButton");
// buttonDownload.addEventListener('click', evt => {alert("test");});

buttonDownload.addEventListener('click', evt => {
    if (document.getElementById("inputName").value != "") {

        chrome.runtime.sendMessage({ method: "getAll" }, function (response) {
            dataUrl = response.all;
            var file = new Blob([dataUrl]);
            var a = document.createElement("a"), url = URL.createObjectURL(file);
            a.href = url;
            a.download = document.getElementById("inputName").value + ".csv";
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        });
    }
    else {
        alert("Veuillez rentrez un nom de fichier!")
    }
});

var buttonUpload = document.getElementById("buttonUpload");
buttonUpload.addEventListener('change', evt => {
    if (true) {
        var reader = new FileReader();
        reader.readAsText(buttonUpload.files[0], 'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            var content = readerEvent.target.result; // this is the content!
            chrome.runtime.sendMessage({ method: content, type: "input" }, function (response) {

                var table = document.getElementById("mytable");
                var lines = content.split(';');
                for (var i = 2; i < lines.length-1; i = i + 2) {
                    if (lines[i] != undefined && lines[i + 1] != undefined) {
                        table.insertRow(1).insertCell(0).innerHTML = lines[i];
                        if (lines[i + 1].length > 33) {
                            var str_url = '<a href="' + lines[i + 1] + '" target="_blank">' + lines[i + 1].substring(0, 30) + "...</a>"
                            table.rows[1].insertCell(1).innerHTML = str_url;
                        }
                        else
                            table.rows[1].insertCell(1).innerHTML = '<a href="' + lines[i + 1] + '" target="_blank">' + lines[i + 1] + "</a>";
                    }
                }
            });
        }
    }
});