chrome.webNavigation.onCommitted.addListener(evt => {
    // Filter out any sub-frame related navigation event
    if (evt.frameId !== 0) {
        return;
    }
    if (!chrome.storage.local['index']) {
        chrome.storage.local['index'] = 0;
    }
    var index = chrome.storage.local['index'];
    chrome.storage.local['index']++;
    chrome.storage.local[index] = evt.url;
    
    //display historique en direct :
   /*var str = "";
    for (var i = 0; i <= index ; i++){
        str += "index:" + i + " url:" + chrome.storage.local[i] + "\n"
    }
    alert(str);*/
}, {
    //filtre les urls non http ou https
    url: [{schemes: ["http", "https"]}]
});
