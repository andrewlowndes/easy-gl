"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var loadFile_1 = require("./loadFile");
var dirname_1 = require("../Util/dirname");
var gl_matrix_1 = require("gl-matrix");
var loadMtl_1 = require("./loadMtl");
var regexp = {
    group: /\bg\s+([^\s]+)\b/,
    vertex: /\bv\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\b/,
    texCoord: /\bvt\s+([^\s]+)\s+([^\s]+)\b/,
    normal: /\bvn\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\b/,
    triangle: /\bf\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\b/,
    mtllib: /\bmtllib\s+(.*)\b/,
    usemtl: /\busemtl\s+(.*)\b/
};
var mapIndex = function (item) {
    return parseInt(item, 10) - 1;
};
function loadObj(url) {
    return __awaiter(this, void 0, void 0, function () {
        var urlDir, fileContents, fileLines, normals, texCoords, vertices, groups, positions, indices, currentObject, materials, vertexHash, maxX, maxY, maxZ, minX, minY, minZ, sizeX, sizeY, sizeZ, centerX, centerY, centerZ, size, downscaleFactor;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urlDir = dirname_1.dirname(url);
                    return [4, loadFile_1.loadFile(url)];
                case 1:
                    fileContents = _a.sent();
                    fileLines = fileContents.split("\n");
                    normals = [], texCoords = [], vertices = [], groups = {}, positions = [], indices = [];
                    currentObject = {
                        indices: []
                    }, materials = {}, vertexHash = {};
                    fileLines.forEach(function (objLine) { return __awaiter(_this, void 0, void 0, function () {
                        var matches, mtlFilename, _a, groupName, v1, v2, v3, u, v, v1, v2, v3, coordIndexes, matchIndex, maxIndex, coord, coordHash, coordIndex;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    matches = objLine.match(regexp.mtllib);
                                    if (!matches) return [3, 2];
                                    mtlFilename = urlDir + matches[1];
                                    _a = [{}, materials];
                                    return [4, loadMtl_1.loadMtl(mtlFilename)];
                                case 1:
                                    materials = __assign.apply(void 0, _a.concat([(_b.sent())]));
                                    return [2];
                                case 2:
                                    matches = objLine.match(regexp.usemtl);
                                    if (matches) {
                                        currentObject.material = matches[1];
                                        return [2];
                                    }
                                    matches = objLine.match(regexp.group);
                                    if (matches) {
                                        groupName = matches[1];
                                        currentObject = {
                                            name: groupName,
                                            indices: []
                                        };
                                        groups[groupName] = currentObject;
                                        return [2];
                                    }
                                    matches = objLine.match(regexp.vertex);
                                    if (matches) {
                                        v1 = parseFloat(matches[1]), v2 = parseFloat(matches[2]), v3 = parseFloat(matches[3]);
                                        positions.push(gl_matrix_1.vec3.fromValues(v1, v2, v3));
                                        return [2];
                                    }
                                    matches = objLine.match(regexp.texCoord);
                                    if (matches) {
                                        u = parseFloat(matches[1]), v = parseFloat(matches[2]);
                                        texCoords.push(gl_matrix_1.vec2.fromValues(u, v));
                                        return [2];
                                    }
                                    matches = objLine.match(regexp.normal);
                                    if (matches) {
                                        v1 = parseFloat(matches[1]), v2 = parseFloat(matches[2]), v3 = parseFloat(matches[3]);
                                        normals.push(gl_matrix_1.vec3.fromValues(v1, v2, v3));
                                        return [2];
                                    }
                                    matches = objLine.match(regexp.triangle);
                                    if (matches) {
                                        coordIndexes = [];
                                        for (matchIndex = 1, maxIndex = Math.min(4, matches.length); matchIndex < maxIndex; matchIndex++) {
                                            coord = matches[matchIndex].split('/').map(mapIndex), coordHash = coord.join('/');
                                            coordIndex = void 0;
                                            if (coordHash in vertexHash) {
                                                coordIndex = vertexHash[coordHash];
                                            }
                                            else {
                                                coordIndex = vertices.push(coord) - 1;
                                                vertexHash[coordHash] = coordIndex;
                                            }
                                            coordIndexes.push(coordIndex);
                                        }
                                        currentObject.indices = currentObject.indices.concat(coordIndexes);
                                        return [2];
                                    }
                                    return [2];
                            }
                        });
                    }); });
                    vertexHash = null;
                    maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE, maxZ = Number.MIN_VALUE, minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, minZ = Number.MAX_VALUE;
                    positions.forEach(function (pos) {
                        maxX = Math.max(maxX, pos[0]);
                        maxY = Math.max(maxY, pos[1]);
                        maxZ = Math.max(maxZ, pos[2]);
                        minX = Math.min(minX, pos[0]);
                        minY = Math.min(minY, pos[1]);
                        minZ = Math.min(minZ, pos[2]);
                    });
                    sizeX = maxX - minX, sizeY = maxY - minY, sizeZ = maxZ - minZ, centerX = sizeX / 2 + minX, centerY = sizeY / 2 + minY, centerZ = sizeZ / 2 + minZ;
                    positions.forEach(function (pos) {
                        pos[0] -= centerX;
                        pos[1] -= centerY;
                        pos[2] -= centerZ;
                    });
                    size = Math.max(sizeX, Math.max(sizeY, sizeZ)), downscaleFactor = 1 / size;
                    positions.forEach(function (pos) {
                        pos[0] *= downscaleFactor;
                        pos[1] *= downscaleFactor;
                        pos[2] *= downscaleFactor;
                    });
                    return [2, {
                            positions: positions,
                            normals: normals,
                            texCoords: texCoords,
                            vertices: vertices,
                            groups: groups,
                            materials: materials
                        }];
            }
        });
    });
}
exports.loadObj = loadObj;
