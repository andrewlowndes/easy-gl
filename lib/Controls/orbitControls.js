"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = require("gl-matrix");
function orbitControls(viewMatrix, dom) {
    var pos = gl_matrix_1.vec3.create(), up = gl_matrix_1.vec3.fromValues(0.0, 1.0, 0.0), center = gl_matrix_1.vec3.fromValues(0.0, 0.0, 0.0), scaleAmount = 0.1, moveXAmount = 1.0, moveYAmount = 1.0, rotateAmount = Math.PI, startPos = gl_matrix_1.vec2.create(), newPos = gl_matrix_1.vec2.create(), diffPos = gl_matrix_1.vec2.create(), domSize = gl_matrix_1.vec2.fromValues(dom.clientWidth, dom.clientHeight), tempPos = gl_matrix_1.vec3.create(), tempCenter = gl_matrix_1.vec3.create(), dirVec = gl_matrix_1.vec3.create(), rightVec = gl_matrix_1.vec3.create(), rotateMat = gl_matrix_1.mat4.create(), moveRight = gl_matrix_1.vec3.create(), moveUp = gl_matrix_1.vec3.create(), moveOffset = gl_matrix_1.vec3.create(), moveStartFunc = function (e) {
        window.addEventListener('mousemove', moveFunc);
        window.addEventListener('mouseup', moveEndFunc);
        gl_matrix_1.vec2.set(startPos, e.pageX, e.pageY);
    }, moveFunc = function (e) {
        gl_matrix_1.vec2.set(newPos, e.pageX, e.pageY);
        gl_matrix_1.vec2.subtract(diffPos, newPos, startPos);
        gl_matrix_1.vec2.divide(diffPos, diffPos, domSize);
        gl_matrix_1.vec2.scale(diffPos, diffPos, rotateAmount);
        gl_matrix_1.vec3.copy(tempPos, pos);
        gl_matrix_1.vec3.copy(tempCenter, center);
        gl_matrix_1.vec3.negate(dirVec, pos);
        gl_matrix_1.vec3.cross(rightVec, dirVec, up);
        gl_matrix_1.vec3.normalize(rightVec, rightVec);
        if (e.buttons === 1) {
            gl_matrix_1.mat4.identity(rotateMat);
            gl_matrix_1.mat4.rotate(rotateMat, rotateMat, -diffPos[0], up);
            gl_matrix_1.mat4.rotate(rotateMat, rotateMat, -diffPos[1], rightVec);
            gl_matrix_1.vec3.transformMat4(tempPos, tempPos, rotateMat);
        }
        else if (e.buttons === 2) {
            gl_matrix_1.vec3.copy(moveRight, rightVec);
            gl_matrix_1.vec3.scale(moveRight, moveRight, moveXAmount * -diffPos[0]);
            gl_matrix_1.vec3.copy(moveUp, up);
            gl_matrix_1.vec3.scale(moveUp, moveUp, moveYAmount * diffPos[1]);
            gl_matrix_1.vec3.set(moveOffset, 0, 0, 0);
            gl_matrix_1.vec3.add(moveOffset, moveOffset, moveRight);
            gl_matrix_1.vec3.add(moveOffset, moveOffset, moveUp);
            gl_matrix_1.vec3.add(tempPos, tempPos, moveOffset);
            gl_matrix_1.vec3.add(tempCenter, tempCenter, moveOffset);
        }
        gl_matrix_1.mat4.lookAt(viewMatrix, tempPos, tempCenter, up);
    }, moveEndFunc = function () {
        window.removeEventListener('mousemove', moveFunc);
        window.removeEventListener('mouseup', moveEndFunc);
        gl_matrix_1.vec3.copy(pos, tempPos);
        gl_matrix_1.vec3.copy(center, tempCenter);
    }, zoom = function (e) {
        gl_matrix_1.vec3.scale(pos, pos, 1 + (e.deltaY > 0 ? scaleAmount : -scaleAmount));
        gl_matrix_1.mat4.lookAt(viewMatrix, pos, center, up);
    }, removeContextMenu = function (e) {
        e.preventDefault();
    };
    gl_matrix_1.mat4.getTranslation(pos, viewMatrix);
    gl_matrix_1.vec3.negate(pos, pos);
    dom.addEventListener('mousedown', moveStartFunc);
    dom.addEventListener('wheel', zoom);
    dom.addEventListener("contextmenu", removeContextMenu, false);
    return function () {
        dom.removeEventListener('mousedown', moveStartFunc);
        dom.removeEventListener('wheel', zoom);
        dom.removeEventListener("contextmenu", removeContextMenu);
        window.removeEventListener('mousemove', moveFunc);
        window.removeEventListener('mouseup', moveEndFunc);
    };
}
exports.orbitControls = orbitControls;
