"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loadFile(url) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.overrideMimeType("text/plain");
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                resolve(request.responseText);
            }
        };
        request.send();
    });
}
exports.loadFile = loadFile;
