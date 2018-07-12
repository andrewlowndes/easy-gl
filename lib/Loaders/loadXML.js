"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xmlToJson_1 = require("../Util/xmlToJson");
function loadXML(url) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.overrideMimeType("text/xml");
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                resolve(xmlToJson_1.xmlToJSON(request.responseXML));
            }
        };
        request.send();
    });
}
exports.loadXML = loadXML;
