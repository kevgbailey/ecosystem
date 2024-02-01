import React from 'react';
import Environment from './Environment';
import Sketch from 'react-p5';

class Box {
    constructor(p5, kind) {
        this.kind = kind;
        if (this.kind == 'land') {
            this.color = p5.color(p5.random(99, 110), p5.random(219, 230), p5.random(65, 70));
        } else if (this.kind == 'food') {
           this.color = p5.color(247, 15, 2);
        }
    }

    drawBox(p5, x, y, w, h) {
        p5.fill(this.color);
        p5.noStroke();
        p5.rect(x, y, w, h);
    }
}

export default Box;