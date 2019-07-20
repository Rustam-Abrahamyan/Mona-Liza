"use strict";

let C = {
    m: document.querySelector(".canvas"),
    o: document.createElement("canvas")
};

let _ = {
    m: C.m.getContext("2d"),
    o: C.o.getContext("2d")
};

let d = {
        width: 0,
        height: 0
    },
    P = [];

function Particle(x, y) {

    this.c = "";
    this.s = 4 * Math.random() + 1;
    this._p = {x: x, y: y};
    this.p = {x: x, y: y};
    this.v = {x: 0, y: 0};
}

Particle.prototype.update = function () {
    let data = _.o.getImageData(this.p.x, this.p.y, 1, 1).data,
        theta = (data[0] + data[1] + data[2]) / 765 * 2 * Math.PI;
    this.c = "rgb(" + data[0] + "," + data[1] + "," + data[2] + ")";
    this.v.x = Math.cos(theta) * this.s;
    this.v.y = Math.sin(theta) * this.s;
    this._p.x = this.p.x;
    this._p.y = this.p.y;
    this.p.x += this.v.x;
    this.p.y += this.v.y;
};

function init() {
    let img = new Image();
    img.src = document.querySelector("img").src + "?particle=1";
    img.crossOrigin = "anonymous";
    img.onload = function () {
        d.w = img.width;
        d.h = img.height;
        C.m.width = C.o.width = d.w;
        C.m.height = C.o.height = d.h;
        C.m.style = "top: calc(50% - " + d.h * 0.5 + "px);left: calc(50% - " + d.w * 0.5 + "px);width: " + d.w + "px;height: " + d.h + "px;";
        _.o.drawImage(img, 0, 0);
        loop();
    };
}

function loop() {
    if (P.length < 1000) {
        P.push(new Particle(Math.random() * d.w, Math.random() * d.h));
    }
    for (let i = P.length - 1; i >= 0; i--) {
        let p = P[i];

        p.update();

        if (p.p.x > d.w || p.p.x < 0 || p.p.y > d.h || p.p.y < 0) {
            P.splice(i, 1);
        } else {
            _.m.globalCompositeOperation = "lighten";
            _.m.strokeStyle = p.c;
            _.m.beginPath();
            _.m.moveTo(p._p.x, p._p.y);
            _.m.lineTo(p.p.x, p.p.y);
            _.m.stroke();
            _.m.closePath();
        }
    }
    window.requestAnimationFrame(loop);
}

window.onload = init;
