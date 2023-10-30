/*
* File Name / halloween.js
* Created Date / Oct 13, 2020
* Aurhor / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

/*
  Common Tool.
*/

class Tool {
  // random number.
  static randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  // random color rgb.
  static randomColorRGB() {
    return (
      "rgb(" +
      this.randomNumber(0, 255) +
      ", " +
      this.randomNumber(0, 255) +
      ", " +
      this.randomNumber(0, 255) +
      ")"
    );
  }
  // random color hsl.
  static randomColorHSL(saturation, lightness) {
    return (
      "hsl(" +
      this.randomNumber(0, 360) +
      ", " +
      saturation +
      "%, " +
      lightness +
      "%)"
    );
  }
  // gradient color.
  static gradientColor(ctx, cr, cg, cb, ca, x, y, r) {
    const col = cr + "," + cg + "," + cb;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(" + col + ", " + (ca * 1) + ")");
    g.addColorStop(0.5, "rgba(" + col + ", " + (ca * 0.5) + ")");
    g.addColorStop(1, "rgba(" + col + ", " + (ca * 0) + ")");
    return g;
  }
}

/*
  When want to use angle.
*/

class Angle {
  constructor(angle) {
    this.a = angle;
    this.rad = this.a * Math.PI / 180;
  }

  incDec(num) {
    this.a += num;
    this.rad = this.a * Math.PI / 180;
    return this.rad;
  }
}

/*
  When want to use controller.
*/

class Controller {
  constructor(id) {
    this.id = document.getElementById(id);
  }
  getVal() {
    return this.id.value;
  }
}

/*
  When want to use time.
*/

class Time {
  constructor(time) {
    this.startTime = time;
    this.lastTime;
    this.elapsedTime;
  }

  getElapsedTime() {
    this.lastTime = Date.now();
    this.elapsedTime = (this.startTime - this.lastTime) * -1;
    return this.elapsedTime;
  }
}

let canvas;

class Canvas {
  constructor(bool) {
    // create canvas.
    this.canvas = document.createElement("canvas");
    // if on screen.
    if (bool === true) {
      this.canvas.style.display = 'block';
      this.canvas.style.top = 0;
      this.canvas.style.left = 0;
      document.getElementsByTagName("body")[0].appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.standard = this.width > this.height ? this.width : this.height * 1.5;
    // mouse infomation.
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 10;
    this.mouseZ = null;
    // ground
    this.ground;
    this.groundHeight = 100;
    // grave
    this.graves = [];
    this.graveSize = this.standard / 50;
    this.graveDist = 10;
    this.graveTime = null;
    this.graveBehavior = 1;
    // pumpkin
    this.pumpkin;
    this.pumpkinSize = this.standard / 9;
    this.pumpkinTime = null;
    this.pumpkinBehavior = 1;
    // text
    this.text;
    this.sentence = this.width > this.height ? 'Happy Halloween, Miss Guo.' : 'HALLOWEEN';
    this.textSize = this.standard / 4;
    this.fontSize = this.standard / 25;
    this.textTime = null;
    this.textBehavior = null;
    // house
    this.houses = [];
    this.houseSize = this.standard / 10;
    this.houseNum = 3;
    this.houseTime = null;
    this.houseBehavior = null;
    // spider
    this.spiders = [];
    this.spiderSize = this.standard / 80;
    this.spiderNum = 3;
    this.spiderTime = null;
    this.spiderBehavior = null;
    // shooting star
    this.pointX = this.width + 100;
    this.pointY = Tool.randomNumber(0, this.height / 10);
    this.starNum = 300;
    this.stars = [];
    this.starBehavior = null;
    this.v = {
      x: 0,
      y: 0
    };
  }
  
  // init, render, resize
  init() {
    // ground
    this.ground = new Ground(this.ctx, 0, this.height - this.groundHeight);
    // text
    this.text = new Text(this.ctx, this.width / 2, this.height / 8, this.textSize, this.fontSize, this.sentence);
    // grave
    let index = 0;
    for (let i = 50; i < this.width; i += this.graveDist) {
      const gap = Tool.randomNumber(30, 80);
      const g = new Grave(this.ctx, i, Tool.randomNumber(0, this.height / 2), this.graveSize, index);
      this.graves.push(g);
      i += gap;
      index++;
    }
    // pumpkin
    this.pumpkin = new Pumpkin(this.ctx, 0, 0, this.pumpkinSize);
    // house
    for (let i = 0; i < this.houseNum; i++) {
      const h = new House(this.ctx, this.width / (10 - i * 2), this.height - this.groundHeight, this.houseSize);
      this.houses.push(h);
    }
    // spider
    for (let i = 0; i < this.spiderNum; i++) {
      const s = new Spider(this.ctx, Tool.randomNumber(this.width - this.width / 3, this.width), Tool.randomNumber(50, this.height / 2), this.spiderSize);
      this.spiders.push(s);
    }
    // star
    for (let i = 0; i < this.starNum; i++) {
      const s = new Star(this.ctx, this.pointX, this.pointY);
      this.stars.push(s);
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    // grave
    for(let i = 0; i < this.graves.length; i++) {
      this.graves[i].render();
    }
    // house
    if (this.houseBehavior === 1) {
      for (let i = 0; i < this.houses.length; i++) {
        this.houses[i].render();
      }
    }
    // spider
    if (this.spiderBehavior === 1) {
      for (let i = 0; i < this.spiders.length; i++) {
        this.spiders[i].render();
      }
    }
    // pumpkin
    if (this.pumpkinBehavior >= 1) {
      this.pumpkin.render();
    }
    // star
    for(let i = 0; i < this.stars.length; i++) {
      this.stars[i].render();
    }
    // update points
    if (this.pointX < -canvas.width / 4) {
      this.graveBehavior = 2;
    }
    this.ground.render();
    // text
    if (this.textBehavior === 1) {
      this.text.render();
    }
    if (this.pumpkinBehavior === 5) {
      this.v.x += (this.mouseX - this.pointX) * 0.1;
      this.v.y += (this.mouseY - this.pointY) * 0.1;
      this.v.x *= 0.9;
      this.v.y *= 0.9;
      this.pointX += this.v.x;
      this.pointY += this.v.y;
    } else {
      this.pointX -= 10;
      this.pointY += 1;
    }
  }
  
  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    // ground
    this.ground;
    this.groundHeight = 100;
    // grave
    this.graves = [];
    this.graveSize = this.standard / 50;
    this.graveDist = 10;
    this.graveTime = null;
    this.graveBehavior = 1;
    // pumpkin
    this.pumpkin;
    this.pumpkinSize = this.standard / 9;
    this.pumpkinTime = null;
    this.pumpkinBehavior = 1;
    // text
    this.text;
    this.sentence = this.width > this.height ? 'HAPPY HALLOWEEN' : 'HALLOWEEN';
    this.textSize = this.standard / 4;
    this.fontSize = this.standard / 25;
    this.textTime = null;
    this.textBehavior = null;
    // house
    this.houses = [];
    this.houseSize = this.standard / 10;
    this.houseNum = 3;
    this.houseTime = null;
    this.houseBehavior = null;
    // spider
    this.spiders = [];
    this.spiderSize = this.standard / 80;
    this.spiderNum = 3;
    this.spiderTime = null;
    this.spiderBehavior = null;
    // shooting star
    this.pointX = this.width + 100;
    this.pointY = Tool.randomNumber(0, this.height / 10);
    this.starNum = 300;
    this.stars = [];
    this.starBehavior = null;
    this.v = {
      x: 0,
      y: 0
    };
    this.init();
  }
}

/*
  Ground class.
*/

class Ground {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.init(x, y);
  }

  init(x, y) {
    this.x = x;
    this.y = y;
    this.c = 'black';
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, canvas.width, canvas.height - this.y);
    ctx.restore();
  }

  render() {
    this.draw();
  }
}

/*
  House
*/

class House {
  constructor(ctx, x, y, s) {
    this.ctx = ctx;
    this.init(x, y, s);
  }

  init(x, y, s) {
    this.a = new Angle(Tool.randomNumber(-5, 5));
    this.x = x;
    this.y = -20;
    this.yi = y + 20;
    this.r = Tool.randomNumber(s / 3, s);
    this.c = {
      b: 'black',
      y: 'yellow'
    };
    this.v = {
      y: 0
    };
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = this.c.b;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.a.rad);
    ctx.translate(-this.x, -this.y);
    // bottom
    ctx.fillRect(this.x - this.r / 2, this.y - this.r * 2, this.r, this.r * 2);
    // top
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.r * 3);
    ctx.lineTo(this.x + this.r, this.y - this.r * 2);
    ctx.lineTo(this.x - this.r, this.y - this.r * 2);
    ctx.closePath();
    ctx.fill();
    // window
    ctx.lineWidth = this.r / 10;
    ctx.fillStyle = this.c.y;
    ctx.fillRect(this.x - this.r / 3, this.y - this.r * 1.8, this.r / 1.5, this.r / 1.5);
    ctx.strokeStyle = this.c.b;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.r * 1.8);
    ctx.lineTo(this.x, this.y - this.r * 1.1);
    ctx.stroke();
    ctx.restore();
  }

  updatePosition() {
    this.v.y += (this.yi - this.y) * 0.3;
    this.v.y *= 0.8;
    this.y += this.v.y;
  }

  manageBehavior() {
    if (canvas.houseTime === null) canvas.houseTime = new Time(new Date());
    if (canvas.houseTime.getElapsedTime() > 400) {
      canvas.spiderBehavior = 1;
    }
  }

  render() {
    this.draw();
    this.updatePosition();
    this.manageBehavior();
  }
}

/*
  Spider
*/

class Spider {
  constructor(ctx, x, y, s) {
    this.ctx = ctx;
    this.init(x, y, s);
  }

  init(x, y, s) {
    this.a = new Angle(Tool.randomNumber(0, 360));
    this.x = x;
    this.y = -20;
    this.yi = y;
    this.r = Tool.randomNumber(s / 3, s);
    this.lw = this.r / 5;
    this.c = 'black';
    this.v = {
      y: 0
    };
  }

  drawSpider() {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.x, 0);
    ctx.rotate(0.3 * Math.sin(this.a.rad));
    ctx.translate(-this.x, 0);
    // body
    ctx.strokeStyle = this.c;
    ctx.fillStyle = this.c;
    ctx.lineWidth = this.lw; 
    ctx.beginPath();
    ctx.arc(this.x, this.y - this.r * 0.9, this.r, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x, this.y + this.r * 0.9, this.r, 0, Math.PI * 2, false);
    ctx.fill();
    // web
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, 0);
    ctx.stroke();
    // limbs top
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.quadraticCurveTo(this.x + this.r * 2, this.y, this.x + this.r * 2, this.y - this.r * 3); 
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.quadraticCurveTo(this.x - this.r * 2, this.y, this.x - this.r * 2, this.y - this.r * 3); 
    ctx.stroke();
    // limbs middle
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.quadraticCurveTo(this.x + this.r * 2, this.y, this.x + this.r * 3, this.y - this.r); 
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.quadraticCurveTo(this.x - this.r * 2, this.y, this.x - this.r * 3, this.y - this.r); 
    ctx.stroke();
    // limbs bottom
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.quadraticCurveTo(this.x + this.r * 2, this.y, this.x + this.r * 2, this.y + this.r * 3); 
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.quadraticCurveTo(this.x - this.r * 2, this.y, this.x - this.r * 2, this.y + this.r * 3); 
    ctx.stroke();
    ctx.restore();
  }
  
  updatePosition() {
    this.v.y += (this.yi - this.y) * 0.3;
    this.v.y *= 0.8;
    this.y += this.v.y;
  }
  
  manageBehavior() {
    if (canvas.spiderTime === null) canvas.spiderTime = new Time(new Date());
    if (canvas.spiderTime.getElapsedTime() > 400) {
      if (canvas.pumpkinBehavior === 1) canvas.pumpkinBehavior = 2;      
    }
  }

  render() {
    this.drawSpider();
    this.updatePosition();
    this.manageBehavior();
    this.a.incDec(1);
  }
}

/*
  Text
*/

class Text {
  constructor(ctx, x, y, s, fs, t) {
    this.ctx = ctx;
    this.init(x, y, s, fs, t);
  }

  init(x, y, s, fs, t) {
    this.a = new Angle(0);
    this.x = x;
    this.y = y;
    this.yi = canvas.height - canvas.groundHeight / 2; 
    this.r = 0;
    this.ri = s;
    this.c = 'black';
    this.s = fs;
    this.fs = 0;
    this.t = t;
    this.l = this.t.length - 1;
    this.rad = Math.PI / 1.5 / this.l;
    this.v = {
      y: 0,
      r: 0
    };
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.lineJoin = 'bevel';
    ctx.lineWidth = 10;
    ctx.strokeStyel = 'black';
    ctx.fillStyle = 'yellow';
    ctx.font = this.fs + 'px "arial black", sans-selif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText(this.t, this.x, this.y);
    ctx.fillText(this.t, this.x, this.y);
    ctx.restore();
  }

  /*
  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(212 * Math.PI / 180);
    ctx.translate(-this.x, -this.y);
    for (let i = 0; i < this.t.length; i++) {
      ctx.save();
      ctx.lineJoin = 'bevel';
      ctx.lineWidth = 10;
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'yellow';
      ctx.font = this.fs + 'px "arial black", sans-selif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let x = Math.cos(this.rad * i) * this.r + this.x;
      let y = Math.sin(this.rad * i) * this.r + this.y;
      ctx.translate(x, y);
      ctx.rotate(this.rad * i + 90 * Math.PI / 180);
      ctx.strokeText(this.t[i], 0, 0);
      ctx.fillText(this.t[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }
  */

  elasticity() {
    this.v.r += (this.s - this.fs) * 0.3;
    this.v.r *= 0.8;
    this.fs += this.v.r;
  }

  updatePosition() {
    this.v.y += (this.yi - this.y) * 0.3;
    this.v.y *= 0.8;
    this.y += this.v.y;
  }

  render() {
    this.draw();
    this.elasticity();
    this.a.incDec(0.5);
    if (canvas.textTime === null) canvas.textTime = new Time(new Date());
    if (canvas.textTime.getElapsedTime() > 400) {
      canvas.pumpkinBehavior = 4;
      this.updatePosition();
    }
    if (canvas.textTime.getElapsedTime() > 800) {
      canvas.pumpkinBehavior = 5;
    }
  }
}

/*
  Star - Grave
*/

class Grave {
  constructor(ctx, x, y, s, i) {
    this.ctx = ctx;
    this.init(x, y, s, i);
  }

  init(x, y, s, i) {
    this.behavior = 1;
    // star
    this.a = new Angle(Tool.randomNumber(0, 360));
    // grave
    this.a1 = new Angle(Tool.randomNumber(-10, 10));
    this.x = x;
    this.y = y;
    this.i = i;
    this.r = 0;
    this.maxR = Tool.randomNumber(s / 8, s);
    this.c = {
      b: 'black',
      y: 'yellow'
    };
    this.v = {
      x: 0,
      y: 10,
      r: 0
    };
    this.h = Tool.randomNumber(s / 10, s);
    this.lw = Tool.randomNumber(5, 10);
    this.rad = Math.PI / 5 * 4; // ???
  }

  drawStar() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = this.c.y;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.a.rad);
    ctx.translate(-this.x, -this.y);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      let x = Math.cos(this.rad * i) * this.r + this.x;
      let y = Math.sin(this.rad * i) * this.r + this.y;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawGrave() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = this.c;
    ctx.lineWidth = this.lw;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.a1.rad);
    ctx.translate(-this.x, -this.y);
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y - this.r * 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x - this.r, this.y - this.r * 4);
    ctx.lineTo(this.x + this.r, this.y - this.r * 4);
    ctx.stroke();
    ctx.restore();
  }

  updatePosition() {
    this.y += this.v.y;
    if (this.y > canvas.height - canvas.groundHeight) {
      this.r = 0;
      this.y = canvas.height - canvas.groundHeight;
      this.behavior = 2;
    }
  }

  elasticity() {
    this.v.r += (this.maxR - this.r) * 0.3;
    this.v.r *= 0.8;
    this.r += this.v.r;
  }
  
  render() {
    if (this.behavior === 1 && canvas.graveBehavior === 1) {
      this.drawStar();
      this.elasticity();
    }
    if (this.behavior === 1 && canvas.graveBehavior === 2) {
      this.drawStar();
      this.updatePosition();
    }
    if (this.behavior === 2) {
      this.drawGrave();
      this.elasticity();
      if (canvas.graveTime === null) canvas.graveTime = new Time(new Date());
      if (canvas.graveTime.getElapsedTime() > 800) canvas.houseBehavior = 1;
    }
  }
}

/*
  Moon - Pumpkin 
*/

class Pumpkin {
  constructor(ctx, x, y, s) {
    this.ctx = ctx;
    this.init(x, y, s);
  }

  init(x, y, s) {
    this.a = new Angle(0);
    this.x = x;
    this.y = y;
    this.r = 0;
    this.mr = 0;
    this.maxR = s;
    this.c = {
      f: 'rgb(254, 109, 5)',
      l: 'rgb(255, 153, 0)',
      e: 'black',
      g: 'gray',
      w: 'white',
      y: 'yellow'
    };
    this.v = {
      x: 0,
      y: 0,
      r: 0
    };
  }

  drawMoon() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = this.c.y;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  }
  
  drawPumpkin() {
    const ctx = this.ctx;
    ctx.save();
    // hat
    ctx.strokeStyle = this.c.e;
    ctx.fillStyle = this.c.e;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y - this.r * 0.8, this.r * 1.8, this.r * 0.5, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.x - this.r * 0.8, this.y - this.r);
    ctx.lineTo(this.x, this.y - this.r * 2);
    ctx.lineTo(this.x + this.r * 0.8, this.y - this.r);
    ctx.closePath();
    ctx.fill();
    // frame
    ctx.fillStyle = this.c.f;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.r);
    ctx.bezierCurveTo(this.x + this.r, this.y + this.r, this.x + this.r * 1.3, this.y + this.r * 0.4, this.x + this.r * 1.3, this.y);
    ctx.bezierCurveTo(this.x + this.r * 1.3, this.y - this.r * 0.4, this.x + this.r, this.y - this.r, this.x, this.y - this.r);
    ctx.bezierCurveTo(this.x - this.r, this.y - this.r, this.x - this.r * 1.3, this.y - this.r * 0.4, this.x - this.r * 1.3, this.y);
    ctx.bezierCurveTo(this.x - this.r * 1.3, this.y + this.r * 0.4, this.x - this.r, this.y + this.r, this.x, this.y + this.r);
    ctx.closePath();
    ctx.fill();
    if (ctx.isPointInPath(canvas.mouseX, canvas.mouseY) && canvas.pumpkinBehavior === 5) {
      canvas.pumpkinBehavior = 4;
    }
    ctx.clip();
    // pattern
    ctx.strokeStyle = this.c.l;
    ctx.lineWidth = this.r / 5;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.r / 1.5, this.r * 1.5, 0, 0, Math.PI * 2, false);
    ctx.stroke();
    // nose
    ctx.fillStyle = this.c.e;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.r / 8);
    ctx.lineTo(this.x + this.r / 8, this.y + this.r / 8);
    ctx.lineTo(this.x - this.r / 8, this.y + this.r / 8);
    ctx.closePath();
    ctx.fill();
    // eyes
    canvas.pumpkinBehavior === 4 ? this.drawEyes2() : this.drawEyes();
    // mouth
    ctx.beginPath();
    ctx.moveTo(this.x + this.r, this.y + this.r * 0.2);
    ctx.quadraticCurveTo(this.x, this.y + this.r * 1.2, this.x - this.r, this.y + this.r * 0.2);
    ctx.quadraticCurveTo(this.x, this.y + this.r * 0.5, this.x + this.r, this.y + this.r * 0.2);
    ctx.closePath();
    ctx.fill();
    // mask
    if (canvas.pumpkinBehavior === 5) this.drawMask();
    ctx.restore();
  }

  drawEyes() {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(this.x + this.r / 2, this.y - this.r / 2);
    ctx.lineTo(this.x + this.r / 2 + this.r / 3, this.y - this.r / 2 + this.r / 3);
    ctx.lineTo(this.x + this.r / 2 - this.r / 3, this.y - this.r / 2 + this.r / 3);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.x - this.r / 2, this.y - this.r / 2);
    ctx.lineTo(this.x - this.r / 2 + this.r / 3, this.y - this.r / 2 + this.r / 3);
    ctx.lineTo(this.x - this.r / 2 - this.r / 3, this.y - this.r / 2 + this.r / 3);
    ctx.closePath();
    ctx.fill();
  }
  
  drawEyes2() {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.x + this.r / 2, this.y - this.r / 3);
    ctx.scale(1, Math.sin(this.a.rad));
    ctx.translate(-this.x - this.r / 2, -this.y + this.r / 3);
    ctx.beginPath();
    ctx.arc(this.x + this.r / 2, this.y - this.r / 3, this.r / 10, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x - this.r / 2, this.y - this.r / 3, this.r / 10, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  }

  drawMask() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = this.c.e;
    ctx.beginPath();
    ctx.fillRect(this.x - this.mr, this.y, this.mr * 2, this.mr * 0.8);
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.c.g;
    ctx.beginPath();
    ctx.moveTo(this.x - this.mr * 0.9, this.y);
    ctx.lineTo(this.x - this.mr * 0.9, this.y + this.mr * 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + this.mr * 0.9, this.y);
    ctx.lineTo(this.x + this.mr * 0.9, this.y + this.mr * 0.8);
    ctx.stroke();
    // string
    ctx.strokeStyle = this.c.e;
    ctx.lineWidth = this.mr / 20;
    ctx.beginPath();
    ctx.moveTo(this.x + this.mr, this.y);
    ctx.lineTo(this.x + this.mr + this.mr, this.y - this.mr);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x - this.mr, this.y);
    ctx.lineTo(this.x - this.mr - this.mr, this.y - this.mr);
    ctx.stroke();
    // text
    ctx.fillStyle = this.c.w;
    ctx.font = this.maxR / 6 + 'px "arial black", sans-selif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TRICK or TREAT', this.x, this.y + this.mr * 0.4);
    ctx.restore();
  }

  elasticity() {
    this.v.r += (this.maxR - this.r) * 0.3;
    this.v.r *= 0.8;
    this.r += this.v.r;
  }

  maskElasticity() {
    this.v.r += (this.maxR - this.mr) * 0.3;
    this.v.r *= 0.9;
    this.mr += this.v.r;
  }

  updatePosition() {
    this.v.x = canvas.width / 2 - this.x;
    this.v.y = canvas.height / 2 - this.y;
    if (this.v.x < 3 && this.v.y < 3) {
      this.r = 0;
      canvas.pumpkinTime = null;
      canvas.pumpkinBehavior = 3;
    }
    this.v.x /= 10;
    this.v.y /= 10;
    this.x += this.v.x;
    this.y += this.v.y;
  }

  render() {
    // moon
    if (canvas.pumpkinBehavior === 1) {
      this.drawMoon();
      this.elasticity();
    }
    // move
    if (canvas.pumpkinBehavior === 2) {
      this.drawMoon();
      this.elasticity();
      this.updatePosition();
    }
    // pumpkin
    if (canvas.pumpkinBehavior === 3) {
      this.drawPumpkin();
      this.elasticity();
      if (canvas.pumpkinTime === null) canvas.pumpkinTime = new Time(new Date());
      if (canvas.pumpkinTime.getElapsedTime() > 400) {
        canvas.textBehavior = 1;
      }
    }
    // wear mask
    if (canvas.pumpkinBehavior >= 4) {
      this.drawPumpkin();
      this.maskElasticity();
    }
    this.a.incDec(20);
  }
}

/*
  Shooting Star class.
*/

class Star {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.init(x, y);
  }

  init(x, y) {
    this.a = new Angle(0);
    this.x = canvas.pointX || x;
    this.y = canvas.pointY || y;
    this.lw = 1;
    this.l = Tool.randomNumber(0, 100);
    this.ga = Math.random() * Math.random();
    this.rad = Math.PI * 2 / 8;
    this.r = Tool.randomNumber(5, 20);
    this.v = {
      x: Math.cos(Tool.randomNumber(0, 360) * Math.PI / 180) * Math.random() * 2,
      y: Math.sin(Tool.randomNumber(0, 360) * Math.PI / 180) * Math.random() * 2 
    };
    this.c = {
      y: 'yellow'
    };
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.lineWidth = this.lw;
    ctx.globalAlpha = this.ga;
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'hsl(' + Math.sin(this.a.rad) * 360  + ', 80%, 60%)';
    for (var i = 1; i < 9; i++) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(Math.cos(this.rad * i) * this.r + this.x, Math.sin(this.rad * i) * this.r + this.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  updatePosition() {
    this.a.incDec(1);
    this.v.y += 0.05;
    this.x += this.v.x;
    this.y += this.v.y;
  }

  updateParams() {
    this.l -= 1;
    if (this.l < 0) {
      this.init(canvas.pointX, canvas.pointY);
    }
  }

  render() {
    this.draw();
    this.updatePosition();
    this.updateParams();
  }
}

(function () {
  "use strict";
  window.addEventListener("load", function () {
    canvas = new Canvas(true);
    canvas.init();
    
    function render() {
      window.requestAnimationFrame(function () {
        canvas.render();
        render();
      });
    }
    
    render();

    // event
    window.addEventListener("resize", function() {
      canvas.resize();
    }, false);

    canvas.canvas.addEventListener('mousemove', function(e) {
      canvas.mouseX = e.clientX;
      canvas.mouseY = e.clientY;
    }, false);

    canvas.canvas.addEventListener('touchmove', function(e) {
      const touch = e.targetTouches[0];
      canvas.mouseX = touch.pageX;
      canvas.mouseY = touch.pageY;
    }, false);

  });
})();
