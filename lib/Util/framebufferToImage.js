"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function framebufferToImage(gl, framebuffer, width, height) {
    var data = new Uint8Array(width * height * 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var g = canvas.getContext('2d'), imageData = g.createImageData(width, height);
    imageData.data.set(data);
    g.putImageData(imageData, 0, 0);
    g.globalCompositeOperation = 'copy';
    g.scale(1, -1);
    g.translate(0, -height);
    g.drawImage(canvas, 0, 0);
    return canvas.toDataURL('image/png');
}
exports.framebufferToImage = framebufferToImage;
