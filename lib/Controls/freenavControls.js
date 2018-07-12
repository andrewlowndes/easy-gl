"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = require("gl-matrix");
function freenavControls(viewMatrix, dom) {
    var moveId;
    var right = gl_matrix_1.vec3.create(), up = gl_matrix_1.vec3.create(), forward = gl_matrix_1.vec3.create(), invViewMatrix = gl_matrix_1.mat4.create(), pos = gl_matrix_1.vec3.create(), negPos = gl_matrix_1.vec3.create(), moveVec = gl_matrix_1.vec3.create(), startPos = { x: 0, y: 0 }, deltaPos = { x: 0, y: 0 }, moveSpeed = 5, moveExtraVec = gl_matrix_1.vec3.create(), moveKeys = [
        {
            keys: [87],
            action: function (moveVec) {
                extractView();
                gl_matrix_1.vec3.scale(moveExtraVec, forward, moveSpeed);
                gl_matrix_1.vec3.add(moveVec, moveVec, moveExtraVec);
            }
        },
        {
            keys: [83],
            action: function (moveVec) {
                extractView();
                gl_matrix_1.vec3.scale(moveExtraVec, forward, -moveSpeed);
                gl_matrix_1.vec3.add(moveVec, moveVec, moveExtraVec);
            }
        },
        {
            keys: [65],
            action: function (moveVec) {
                extractView();
                gl_matrix_1.vec3.scale(moveExtraVec, right, moveSpeed);
                gl_matrix_1.vec3.add(moveVec, moveVec, moveExtraVec);
            }
        },
        {
            keys: [68],
            action: function (moveVec) {
                extractView();
                gl_matrix_1.vec3.scale(moveExtraVec, right, -moveSpeed);
                gl_matrix_1.vec3.add(moveVec, moveVec, moveExtraVec);
            }
        },
        {
            keys: [32],
            action: function (moveVec) {
                extractView();
                gl_matrix_1.vec3.scale(moveExtraVec, up, -moveSpeed);
                gl_matrix_1.vec3.add(moveVec, moveVec, moveExtraVec);
            }
        },
        {
            keys: [17, 67],
            action: function (moveVec) {
                extractView();
                gl_matrix_1.vec3.scale(moveExtraVec, up, moveSpeed);
                gl_matrix_1.vec3.add(moveVec, moveVec, moveExtraVec);
            }
        }
    ], moveKeysByKey = {}, moveKeyDown = [], moveKeyPressed = {}, extractPosition = function () {
        gl_matrix_1.mat4.invert(invViewMatrix, viewMatrix);
        gl_matrix_1.vec3.set(pos, invViewMatrix[12], invViewMatrix[13], invViewMatrix[14]);
        gl_matrix_1.vec3.negate(negPos, pos);
    }, extractView = function () {
        gl_matrix_1.vec3.set(right, viewMatrix[0], viewMatrix[4], viewMatrix[8]);
        gl_matrix_1.vec3.set(up, viewMatrix[1], viewMatrix[5], viewMatrix[9]);
        gl_matrix_1.vec3.set(forward, viewMatrix[2], viewMatrix[6], viewMatrix[10]);
    }, startMove = function (e) {
        startPos.x = e.pageX;
        startPos.y = e.pageY;
        extractPosition();
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
    }, move = function () {
        moveId = requestAnimationFrame(move);
        if (moveKeyDown.length) {
            gl_matrix_1.vec3.set(moveVec, 0, 0, 0);
            moveKeyDown.forEach(function (moveKey) {
                moveKey.action(moveVec);
            });
            gl_matrix_1.vec3.subtract(pos, pos, moveVec);
            gl_matrix_1.vec3.negate(negPos, pos);
            gl_matrix_1.mat4.translate(viewMatrix, viewMatrix, moveVec);
        }
    }, mouseMove = function (e) {
        deltaPos.x = (e.pageX - startPos.x) / dom.width;
        deltaPos.y = (e.pageY - startPos.y) / dom.height;
        extractView();
        gl_matrix_1.mat4.translate(viewMatrix, viewMatrix, pos);
        gl_matrix_1.mat4.rotateY(viewMatrix, viewMatrix, deltaPos.x * Math.PI);
        extractView();
        gl_matrix_1.mat4.rotate(viewMatrix, viewMatrix, deltaPos.y * Math.PI, right);
        gl_matrix_1.mat4.translate(viewMatrix, viewMatrix, negPos);
        startPos.x = e.pageX;
        startPos.y = e.pageY;
    }, mouseUp = function () {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
    }, keyDown = function (e) {
        if (!moveKeyPressed.hasOwnProperty(e.which) &&
            moveKeysByKey.hasOwnProperty(e.which) &&
            moveKeyDown.indexOf(moveKeysByKey[e.which]) < 0) {
            moveKeyPressed[e.which] = true;
            moveKeyDown.push(moveKeysByKey[e.which]);
        }
    }, keyUp = function (e) {
        if (moveKeyPressed.hasOwnProperty(e.which) &&
            moveKeysByKey.hasOwnProperty(e.which)) {
            delete moveKeyPressed[e.which];
            var obj = moveKeysByKey[e.which], index = moveKeyDown.indexOf(obj);
            if (index >= 0) {
                moveKeyDown.splice(index, 1);
            }
        }
    };
    moveKeys.forEach(function (moveKey) {
        moveKey.keys.forEach(function (key) {
            moveKeysByKey[key] = moveKey;
        });
    });
    moveId = requestAnimationFrame(move);
    dom.addEventListener('mousedown', startMove);
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    return function () {
        cancelAnimationFrame(moveId);
        dom.removeEventListener('mousedown', startMove);
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('keydown', keyDown);
        window.removeEventListener('keyup', keyUp);
    };
}
exports.freenavControls = freenavControls;
