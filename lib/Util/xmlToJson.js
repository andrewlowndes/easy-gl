"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function xmlToJSON(xml) {
    if (xml.hasChildNodes()) {
        var allTextChildren = xml.childNodes.length === 1 && xml.childNodes.item(0).nodeType === Node.TEXT_NODE;
        if (allTextChildren) {
            var obj_1 = {};
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                obj_1[item.nodeName] = item.nodeValue;
            }
            return obj_1;
        }
        var elementChildNodes = [];
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            if (item.nodeType === Node.ELEMENT_NODE) {
                elementChildNodes.push(item);
            }
        }
        var allSameChildTag = true, commonNodeName = elementChildNodes[0].nodeName;
        for (var i = 1; i < elementChildNodes.length; i++) {
            var item = elementChildNodes[i];
            if (item.nodeName !== commonNodeName) {
                allSameChildTag = false;
                break;
            }
        }
        if (xml.childNodes.length > 1 && allSameChildTag) {
            var arr = [];
            for (var i = 0; i < elementChildNodes.length; i++) {
                var item = elementChildNodes[i];
                arr.push(xmlToJSON(item));
            }
            return arr;
        }
        var obj = {};
        for (var i = 0; i < elementChildNodes.length; i++) {
            var item = elementChildNodes[i];
            var nodeName = item.nodeName;
            if (nodeName in obj) {
                if (!Array.isArray(obj[nodeName].push)) {
                    obj[nodeName] = [obj[nodeName]];
                }
                obj[nodeName].push(xmlToJSON(item));
            }
            else {
                obj[nodeName] = xmlToJSON(item);
            }
        }
        return obj;
    }
    if (xml.nodeType === Node.ELEMENT_NODE) {
        var obj = {};
        for (var i = 0; i < xml.attributes.length; i++) {
            var attr = xml.attributes.item(i);
            obj[attr.nodeName] = attr.nodeValue;
        }
        return obj;
    }
    return xml.nodeValue;
}
exports.xmlToJSON = xmlToJSON;
