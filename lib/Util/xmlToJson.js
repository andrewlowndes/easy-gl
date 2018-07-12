"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function xmlToJSON(xml) {
    if (xml.hasChildNodes()) {
        var allTextChildren = xml.childNodes.length === 1 && xml.childNodes.item(0).nodeType === Node.TEXT_NODE;
        if (allTextChildren) {
            var obj_1 = {};
            for (var i_1 = 0; i_1 < xml.childNodes.length; i_1++) {
                var item = xml.childNodes.item(i_1);
                obj_1[item.nodeName] = item.nodeValue;
            }
            return obj_1;
        }
        var elementChildNodes = [];
        for (var i_2 = 0; i_2 < xml.childNodes.length; i_2++) {
            var item = xml.childNodes.item(i_2);
            if (item.nodeType === Node.ELEMENT_NODE) {
                elementChildNodes.push(item);
            }
        }
        var allSameChildTag = true, commonNodeName = elementChildNodes[0].nodeName;
        for (var i_3 = 1; i_3 < elementChildNodes.length; i_3++) {
            var item = elementChildNodes[i_3];
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
        for (var i_4 = 0; i_4 < xml.attributes.length; i_4++) {
            var attr = xml.attributes.item(i_4);
            obj[attr.nodeName] = attr.nodeValue;
        }
        return obj;
    }
    return xml.nodeValue;
}
exports.xmlToJSON = xmlToJSON;
