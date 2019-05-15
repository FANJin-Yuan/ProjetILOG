alert("index:" + chrome.storage.local['index']);
var table = document.getElementById("mytable");
if (chrome.storage.local['index']) {
  var index = chrome.storage.local['index'];
  for (var i = 0; i < index; i++) {
    table.insertRow(1).insertCell(0).innerHTML = chrome.storage.local[i];
  }
}
table.insertRow(1).insertCell(0).innerHTML = "Fake_URL_1";
table.insertRow(1).insertCell(0).innerHTML = "Fake_URL_2";