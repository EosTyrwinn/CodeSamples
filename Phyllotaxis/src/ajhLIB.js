"use strict";
console.log("ajhLIB loaded");

(function () {
    let ajhLIB = {
        dtr(degrees) {
            return degrees * (Math.PI / 180);
        },

        //Takes in the requirements to draw a circle and draws it
        drawCircle(ctx, x, y, radius, color) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },

        //Clears the screen
        cls(ctx) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        },

        //Sets the color for drawing
        colorMode(n, aDegrees, colorModeDraw) {
            if (colorModeDraw == "rgb1") {
                return `rgb(${n % 256},0,255)`;
            } else if (colorModeDraw == "rgb2") {
                return `rgb(${aDegrees % 256},0,255)`;
            } else if (colorModeDraw == "hls1") {
                return `hsl(${aDegrees % 360},100%,50%)`;
            } else if (colorModeDraw == "hls2") {
                return `hsl(${n / 5 % 360},100%,50%)`;
            } else if (colorModeDraw == "black"){
                return "black";
            }
        }
    };

    //Makes surwe the IIFE Loaded
    if (window) {
        window["ajhLIB"] = ajhLIB;
    } else {
        throw "'window' not defined";
    }
})();