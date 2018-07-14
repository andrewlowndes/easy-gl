"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createRenderer(startFunc, drawFunc) {
    var requestId, lastTime = 0, dt, requestObj = window;
    var tick = function (t) {
        requestId = requestObj.requestAnimationFrame(tick);
        dt = t - lastTime;
        lastTime = t;
        drawFunc(dt);
    };
    return {
        isPlaying: function () {
            return requestId !== null;
        },
        stop: function () {
            requestObj.cancelAnimationFrame(requestId);
            requestId = null;
        },
        start: function (renderObj) {
            requestObj = renderObj || requestObj;
            startFunc();
            requestId = requestObj.requestAnimationFrame(tick);
        }
    };
}
exports.createRenderer = createRenderer;
