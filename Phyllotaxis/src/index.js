"use strict";
console.log("index.js Loaded");

"use strict";
const canvasWidth = 900, canvasHeight = 900;
let ctx;
let num;
let x = 0, y = 0, n = 0;
let x2 = 0, y2 = 0, x3 = 0, y3 = 0, x4 = 0, y4 = 0, x5 = 0, y5 = 0, x6 = 0, y6 = 0, x7 = 0, y7 = 0, x8 = 0, y8 = 0, x9 = 0, y9 = 0;
let colorModeDraw = "rgb1";
let a, r;
let angle = 50;
let radius = 4;
let divergence = 137.5;
let c = 5;
let fps = 120;

window.onload = init;

function init() {
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    document.querySelector("#divControl").onchange = (e) => { 
        divergence = e.target.value; 
        document.querySelector("#divNum").innerHTML = divergence;
    };
    document.querySelector("#divNum").innerHTML = document.querySelector("#divControl").value;
    document.querySelector("#dotSpace").onchange = (e) => { 
        c = e.target.value; 
        document.querySelector("#spaceNum").innerHTML = c;
    };
    document.querySelector("#spaceNum").innerHTML = document.querySelector("#dotSpace").value;
    document.querySelector("#dotSize").onchange = (e) => { 
        radius = e.target.value; 
        document.querySelector("#dotNum").innerHTML = radius;
    };
    document.querySelector("#dotNum").innerHTML = document.querySelector("#dotSize").value;
    document.querySelector("#speed").onchange = (e) => { 
        if (!isNaN(e.target.value)) { 
            fps = e.target.value; 
        } 
    };
    document.querySelector("#reset").onclick = (e) => { reset(); };
    document.querySelector("#num").onchange = (e) => { num = e.target.value; reset(); };
    num = document.querySelector("#num").value;
    let colors = document.querySelectorAll("input[name='colorMode']");
    colors.forEach(ele => { ele.onchange = (e) => { colorModeDraw = e.target.value; } });
    ajhLIB.cls(ctx);
    loop();
}

function loop() {
    //Loop
    setTimeout(loop, 1000 / fps);

    //Calculate needed numbers
    a = n * ajhLIB.dtr(divergence);
    r = c * Math.sqrt(n);
    let aDegrees = n * angle;
    let color = ajhLIB.colorMode(n, aDegrees, colorModeDraw);

    //Get x and y and draw
    x = r * Math.cos(a) + canvasWidth / 2;
    y = r * Math.sin(a) + canvasHeight / 2;
    ajhLIB.drawCircle(ctx, x, y, radius, color);

    //Calculate x and y and draw for all additional circles
    if (num >= 2) {
        x2 = r * Math.cos(a) + canvasWidth / 4;
        y2 = r * Math.sin(a) + canvasHeight / 4;
        ajhLIB.drawCircle(ctx, x2, y2, radius, color);

        if(num >= 3){
            x3 = r * Math.cos(a) + 3*(canvasWidth / 4);
            y3 = r * Math.sin(a) + 3*(canvasHeight / 4);
            ajhLIB.drawCircle(ctx, x3, y3, radius, color);

            if(num >= 4){
                x4 = r * Math.cos(a) + canvasWidth / 4;
                y4 = r * Math.sin(a) + 3*(canvasHeight / 4);
                ajhLIB.drawCircle(ctx, x4, y4, radius, color);

                if(num >= 5){
                    x5 = r * Math.cos(a) + 3*(canvasWidth / 4);
                    y5 = r * Math.sin(a) + canvasHeight / 4;
                    ajhLIB.drawCircle(ctx, x5, y5, radius, color);

                    if(num >= 6){
                        x6 = r * Math.cos(a) + canvasWidth / 4;
                        y6 = r * Math.sin(a) + canvasHeight / 2;
                        ajhLIB.drawCircle(ctx, x6, y6, radius, color);

                        if(num >= 7){
                            x7 = r * Math.cos(a) + 3*(canvasWidth / 4);
                            y7 = r * Math.sin(a) + canvasHeight / 2;
                            ajhLIB.drawCircle(ctx, x7, y7, radius, color);

                            if(num >= 8){
                                x8 = r * Math.cos(a) + canvasWidth / 2;
                                y8 = r * Math.sin(a) + canvasHeight / 4;
                                ajhLIB.drawCircle(ctx, x8, y8, radius, color);

                                if(num >= 9){
                                    x9 = r * Math.cos(a) + canvasWidth / 2;
                                    y9 = r * Math.sin(a) + 3*(canvasHeight / 4);
                                    ajhLIB.drawCircle(ctx, x9, y9, radius, color);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    n++;
}

//Resets the screen
function reset() {
    ajhLIB.cls(ctx);
    x = 0;
    y = 0;
    n = 0;
}