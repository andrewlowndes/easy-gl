"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createContext(canvas, opts, extensions) {
    var gl;
    var pixelRatio = window.devicePixelRatio || 1, updateSize = function () {
        canvas.width = pixelRatio * canvas.clientWidth;
        canvas.height = pixelRatio * canvas.clientHeight;
    };
    try {
        gl = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
        if (extensions) {
            extensions.forEach(function (extension) {
                if (!gl.getSupportedExtensions().indexOf(name) || !gl.getExtension(extension)) {
                    console.log('Could not enable extension: ' + extension);
                }
            });
        }
        updateSize();
        window.addEventListener('resize', updateSize);
    }
    catch (e) { }
    if (!gl) {
        throw new Error("Could not initialise WebGL");
    }
    return gl;
}
exports.createContext = createContext;
