var index;
chrome.runtime.sendMessage({ method: "getIndex" }, function (response) {
  index = response.index;

  var table = document.getElementById("mytable");
  if (index != undefined) {
    for (var i = 0; i < index; i++) {
      chrome.runtime.sendMessage({ method: i, type: "url" }, function (response) {
        table.insertRow(0).insertCell(0).innerHTML = response.data.date;
        if (response.data.url.length > 33){
          var str_url = '<a href="' + response.data.url + '" target="_blank">' + response.data.url.substring(0,30) + "...</a>"
          table.rows[0].insertCell(1).innerHTML = str_url;
        }
        else 
          table.rows[0].insertCell(1).innerHTML = '<a href="' + response.data.url + '" target="_blank">' + response.data.url + "</a>";
      });
    }
  }
});