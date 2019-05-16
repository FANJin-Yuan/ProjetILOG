Number.prototype.padLeft = function (base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
}
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
    var d = new Date,
        dformat = [(d.getDate() + 1).padLeft(),
        d.getMonth().padLeft(),
        d.getFullYear()].join('/') + ' ' +
            [d.getHours().padLeft(),
            d.getMinutes().padLeft()].join(':');
    chrome.storage.local[index] = { date: dformat, url: evt.url };

}, {
        //filtre les urls non http ou https
        url: [{ schemes: ["http", "https"] }]
    });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getIndex")
        sendResponse({ index: chrome.storage.local['index'] });

    else if (request.method == "getAll") {
        index = chrome.storage.local['index'];
        str_all = "dateTime;url;";
        for (var i = 0; i < index; i++) {
            str_all += "\n" + chrome.storage.local[i].date + ";" + chrome.storage.local[i].url + ";";
        }
        sendResponse({ all: str_all });
    }
    else if (request.type == "url")
        sendResponse({ data: chrome.storage.local[request.method] });
    else if (request.type == "input") {
        try {
            var lines = request.method.split(';');

            //Update Storage
            if (!chrome.storage.local['index']) {
                chrome.storage.local['index'] = 0;
            }
            for (var i = 2; i < lines.length-1; i = i + 2) {
                var index = chrome.storage.local['index'];
                chrome.storage.local['index']++;
                chrome.storage.local[index] = { date: lines[i].replace('\n',''), url: lines[i + 1].replace('\n','') };
            }
            sendResponse();
        }catch {
                alert("Fichier invalide");
        }
    }
});
