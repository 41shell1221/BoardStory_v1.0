/**
 * engine/game.js v1.0.0
 * 
 * © 2022-2023 41shell_1221
 * 
 * 
 * You don't need to edit this program when you use it in your production.
 * 
 * If you want to use it, you can put the following in your main script;
 * const game = new Game();
 */

'use strict'

class Element {

  constructor(visible = true) {

    this.childObjectList = [];
    
    this.visible = visible;

    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    
    this.anchor_max = { x: 0, y: 0 };
    this.anchor_min = { x: 0, y: 0 };
    this.pivot = { x: 0, y: 0 };
    
    this.color = '#fff';
    this.outlineColor = '#fff';
    this.outlineWidth = 0;
    
    this.shadowColor = '#777';
    this.shadowBlur = 0;
    
    this.isPointerTarget = false;

    this.onPointerDown = false;
    this.onPointer = false;
    this.onPointerUp = false;
    
    this.isButton = false;
    this.secondColor = '#bbb';
    this.secondOutlineColor = '#000000';

    this.buttonSpeed = 10;

    this.buttonAnimation = 0;
  }

  _setPosition() {
    
    const parent = this.parent;

    if (this.anchor_max.x == this.anchor_min.x) {

      if (parent === null) {

        this._x = (this.x - this.pivot.x * this.w) * this.game.resolution;

      } else {

        this._x = parent._x + this.anchor_max.x * parent._w + (this.x - this.pivot.x * this.w) * this.game.resolution;
      }

      this._w = this.w * this.game.resolution;

    } else {

      let left;
      let right;

      if (parent === null) {

        left = this.x * this.game.resolution;
        right = -this.w * this.game.resolution;

      } else {

        left = parent._x + this.anchor_min.x * parent._w + this.x * this.game.resolution;
        right = parent._x + this.anchor_max.x * parent._w - this.w * this.game.resolution;
      }

      this._x = left;
      this._w = right - left;
    }

    if (this.anchor_max.y == this.anchor_min.y) {

      if (parent === null) {

        this._y = (this.y - this.pivot.y * this.h) * this.game.resolution;

      } else {

        this._y = parent._y + this.anchor_max.y * parent._h + (this.y - this.pivot.y * this.h) * this.game.resolution;
      }

      this._h = this.h * this.game.resolution;

    } else {

      let top;
      let bottom;

      if (parent === null) {

        top = this.y * this.game.resolution;
        bottom = - this.w * this.game.resolution;

      } else {

        top = parent._y + this.anchor_min.y * parent._h + this.y * this.game.resolution;
        bottom = parent._y + this.anchor_max.y * parent._h - this.h * this.game.resolution;
      }

      this._y = top;
      this._h = bottom - top;
    }


    if (this.isButton) {

      let newAnimationValue = 0;

      if (this.onPointer) {

        newAnimationValue = this.buttonAnimation + this.game.executeDeltaTime * this.buttonSpeed;
        if (newAnimationValue >= 1) this.buttonAnimation = 1;
        else this.buttonAnimation = newAnimationValue;

      } else {

        newAnimationValue = this.buttonAnimation - this.game.executeDeltaTime * this.buttonSpeed;
        if (newAnimationValue <= 0) this.buttonAnimation = 0;
        else this.buttonAnimation = newAnimationValue;

      }

      const _firstColor = this.game.color_hexToRgba(this.color);
      const _secondColor = this.game.color_hexToRgba(this.secondColor);

      let draw_color = {};

      for (let key in _firstColor) {

        draw_color[key] = Math.floor(this.game.numDistribute(_firstColor[key], _secondColor[key], this.buttonAnimation));
      }

      this._color = this.game.color_rgbaToHex(draw_color);

    } else {

      this._color = this.color;
    }
  }

  _mainLoop() {

    if (this.isPointerTarget && this.game.isPointerDown) {
      
      if (this._x < this.game._mouse_x && this.game._mouse_x < this._x + this._w && this._y < this.game._mouse_y && this.game._mouse_y < this._y + this._h) {
        
        this.game.pointerTargetObject = this;
      }
    }

    for (let childObject of this.childObjectList) {

      if (childObject.visible) {

        childObject._mainLoop();
      }
    }

    if (this.onPointerDown) this.onPointerDown = false;
    if (this.onPointer) this.onPointer = false;
    if (this.onPointerUp) this.onPointerUp = false;
  }

  addChildObject(object) {

    this.childObjectList.push(object);

    object.game = this.game;
    object.ctx = this.ctx;
    object.parent = this;

    return object;
  }
}


class Game extends Element {

  /**
   * @param {number} resolution
   */
  constructor(resolution = 1.0) {

    super();

    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');

    this.game = this;
    this.parent = null;

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.resolution = resolution;

    this.font = window.getComputedStyle(document.body).fontFamily;

    this.temp_unixTimestamp = new Date().getTime();

    if (window.ontouchstart === null) {

      canvas.addEventListener('touchstart', function(e) {
        
        getPointerPos.call(this, e.changedTouches[0]);
        this.isPointerDown = true;
        this.isPointer = true;
        
      }.bind(this));
      
      canvas.addEventListener('touchmove', function(e) { getPointerPos.call(this, e.changedTouches[0]); }.bind(this));
      
      canvas.addEventListener('touchend', function(e) {
        
        getPointerPos.call(this, e.changedTouches[0]);
        this.isPointerUp = true;
        this.isPointer = false;
        
      }.bind(this));

    } else {

      canvas.addEventListener('mousedown', function(e) {
        
        getPointerPos.call(this, e);
        this.isPointerDown = true;
        this.isPointer = true; }.bind(this));
      
      canvas.addEventListener('mousemove', function(e) { getPointerPos.call(this, e); }.bind(this));
      
      canvas.addEventListener('mouseup', function(e) {
        
        getPointerPos.call(this, e);
        this.isPointerUp = true;
        this.isPointer = false;
        
      }.bind(this));
    }

    function getPointerPos(e) {

      const clientRect = canvas.getBoundingClientRect();

      this.mouse_x = e.clientX - clientRect.left;
      this.mouse_y = e.clientY - clientRect.top;

      this._mouse_x = this.mouse_x * this.resolution;
      this._mouse_y = this.mouse_y * this.resolution;
    }

    this.mouse_x = 0;
    this.mouse_y = 0;

    this.isPointerDown = false;
    this.isPointerUp = false;
    this.isPointer = false;
    
    this.isFontLoaded = false;
  }


  _start() {

    this.window_resize();
    this._mainLoop();
  }


  _mainLoop() {

    if (!this.isFontLoaded) {
      
      this.ctx.font = 20 * this.game.resolution + 'px ' + this.game.font;
      this.ctx.measureText('a');
  
      if (document.fonts.status == 'loaded') {
      
        this.isFontLoaded = true;  
      }
    }
    
    if (this.isFontLoaded) {
      
      if (this.w != window.innerWidth || this.h != window.innerHeight) {

        this.window_resize();
      }

      super._setPosition();

      this.executeDeltaTime = (new Date().getTime() - this.temp_unixTimestamp) / 1000;
      this.temp_unixTimestamp = new Date().getTime();

      this.ctx.clearRect(0, 0, this._w, this._h);

      this.main();

      if (this.isPointerDown) this.pointerTargetObject = null;

      super._mainLoop();

      if (this.pointerTargetObject !== null) {

        if (this.isPointerDown) this.pointerTargetObject.onPointerDown = true;
        if (this.isPointer) this.pointerTargetObject.onPointer = true;
        if (this.isPointerUp) this.pointerTargetObject.onPointerUp = true;
      }

      if (this.isPointerDown) this.isPointerDown = false;
      if (this.isPointerUp) this.isPointerUp = false;
    }

    requestAnimationFrame(this._mainLoop.bind(this));
  }

  main() {};

  window_resize() {

    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.canvas.width = this.w * this.resolution;
    this.canvas.height = this.h * this.resolution;
    
    this.canvas.style.width = this.w;
    this.canvas.style.height = this.h;
  }

  /**
   * @param {Scene} scene
   */
  addScene(scene) {

    return super.addChildObject(scene);

  }

  addChildObject(obj) {};
  
  /**
   * @param {number} deg
   */
  degToRad(deg) {

    return deg * Math.PI / 180;
  }

  /**
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   */
  color_rgbaToHex(r, g, b, a = 255) {

    function d2h(d) { return ('0' + d.toString(16)).slice(-2) }

    return '#' + d2h(r) + d2h(g) + d2h(b) + d2h(a);

  }

  /**
   * @param {object} rgba
   */
  color_rgbaToHex(rgba) {

    function d2h(d) { return ('0' + d.toString(16)).slice(-2) }

    return '#' + d2h(rgba['r']) + d2h(rgba['g']) + d2h(rgba['b']) + d2h(rgba['a']);

  }

  /**
   * @param {string} hex
   */
  color_hexToRgba(hex) {

    hex = hex.slice(1);

    if (hex.length <= 4) {

      let nHex = '';

      for (let char of hex.split('')) {

        nHex += (char + char);
      }

      hex = nHex;
    }

    if (hex.length == 6) {

      hex += 'ff';
    }

    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: parseInt(hex.slice(6, 8), 16)
    }
  }

  /**
   * @param {number} start
   * @param {number} end
   * @param {number} ratio
   */
  numDistribute(start, end, ratio) {

    return start + (end - start) * ratio;

  }
}


class Scene extends Element {

  constructor(visible = true) {

    super(visible);

    this.anchor_max = { x: 1, y: 1 };
    
    this.color = '#fff0'
  }

  _mainLoop() {

    super._setPosition();
    
    this.ctx.fillStyle = this._color;
    this.ctx.fillRect(this._x, this._y, this._w, this._h);

    super._mainLoop();
  }
}


class Rectangle extends Element {

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {string} color
   */
  constructor(x, y, w, h, color) {

    super();

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.color = color;
  }

  _mainLoop() {

    super._setPosition();
    
    if (this.shadowBlur > 0) {
      
      this.ctx.shadowColor = this.shadowColor;
      this.ctx.shadowBlur = this.shadowBlur * this.game.resolution;
    }

    this.ctx.fillStyle = this._color;
    this.ctx.fillRect(this._x, this._y, this._w, this._h);

    if (this.shadowBlur > 0) this.ctx.shadowBlur = 0;

    if (this.outlineWidth > 0) {

      this.ctx.rect(this._x, this._y, this._w, this._h);
      this.ctx.lineWidth = this.outlineWidth;
      this.ctx.strokeStyle = this.outlineColor;

      this.ctx.stroke();
    }

    super._mainLoop();
  }
}


class RoundedRectangle extends Element {

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {number} radius
   * @param {string} color
   */
  constructor(x, y, w, h, radius, color) {

    super();

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.r = radius;

    this.color = color;
  }

  _mainLoop() {

    super._setPosition();

    this._r = [];
    if (typeof this.r == 'number') {

      for (let i = 0; i < 4; i++) this._r.push(this.r * this.game.resolution);
    
    } else {
      
      for (let r of this.r) this._r.push(r * this.game.resolution);
    }

    if (this.shadowBlur > 0) {

      this.ctx.shadowColor = this.shadowColor;
      this.ctx.shadowBlur = this.shadowBlur * this.game.resolution;
    }

    this.ctx.beginPath();
    this.ctx.arc(this._x + this._w - this._r[2], this._y + this._h - this._r[2], this._r[2], 0, this.game.degToRad(90));
    this.ctx.lineTo(this._x + this._r[3], this._y + this._h);
    this.ctx.arc(this._x + this._r[3], this._y + this._h - this._r[3], this._r[3], this.game.degToRad(90), this.game.degToRad(180))
    this.ctx.lineTo(this._x, this._y + this._r[0]);
    this.ctx.arc(this._x + this._r[0], this._y + this._r[0], this._r[0], this.game.degToRad(180), this.game.degToRad(-90));
    this.ctx.lineTo(this._x + this._w - this._r[1], this._y);
    this.ctx.arc(this._x + this._w - this._r[1], this._y + this._r[1], this._r[1], this.game.degToRad(-90), 0)
    
    this.ctx.closePath();

    this.ctx.fillStyle = this._color;
    this.ctx.fill();

    if (this.shadowBlur > 0) this.ctx.shadowBlur = 0;

    if (this.outlineWidth > 0) {

      this.ctx.lineWidth = this.outlineWidth;
      this.ctx.strokeStyle = this.outlineColor;

      this.ctx.stroke();
    }

    super._mainLoop();
  }
}


class Sprite extends Element {

  /**
   * @param {string} src
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  constructor(src, x, y, w, h) {

    super();

    this.src = src;

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

  }

  _mainLoop() {

    super._setPosition();

    const img = new Image();
    img.src = this.src;
    this.ctx.drawImage(img, this._x, this._y, this._w, this._h);

    super._mainLoop();

  }
}


class Text extends Element {

  /**
   * @param {string} text
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {number} size
   * @param {string} color
   */
  constructor(text, x, y, w, h, size, color) {

    super();

    this.text = text;

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.size = size;
    this.color = color;
    
    this.TEXTALIGN = Object.freeze({
      
      START: Symbol(0),
      CENTER: Symbol(1),
      END: Symbol(2)
    });
    
    this.TEXTBASELINE = Object.freeze({
      
      TOP: Symbol(0),
      MIDDLE: Symbol(1),
      BOTTOM: Symbol(2)
    });

    this.textAlign = this.TEXTALIGN.START;
    this.textBaseline = this.TEXTBASELINE.MIDDLE;
  }

  _mainLoop() {

    this.ctx.font = this.size * this.game.resolution + 'px ' +  this.game.font;

    super._setPosition();
    
    let text_x = 0;
    let text_y = 0;
    
    switch (this.textAlign) {
      
      case this.TEXTALIGN.START:
        this._textAlign = 'start';
        text_x = this._x;
        break;
      
      case this.TEXTALIGN.CENTER:
        this._textAlign = 'center';
        text_x = this._x + 0.5 * this._w;
        break;
        
      case this.TEXTALIGN.END:
        this._textAlign = 'end';
        text_x = this._x + this._w;
        break;
    }
    
    switch (this.textBaseline) {
      
      case this.TEXTBASELINE.TOP:
        this._textBaseline = 'top';
        text_y = this._y;
        break;
        
      case this.TEXTBASELINE.MIDDLE:
        this._textBaseline = 'middle';
        text_y = this._y + 0.5 * this._h;
        break;
        
      case this.TEXTBASELINE.END:
        this._textBaseline = 'end';
        text_y = this._y + this._h;
        break;
    }

    this.ctx.fillStyle = this._color;
    this.ctx.textAlign = this._textAlign;
    this.ctx.textBaseline = this._textBaseline;
    this.ctx.fillText(this.text, text_x, text_y);

    if (this.outlineWidth > 0) {

      this.ctx.lineWidth = this.outlineWidth;
      this.ctx.strokeStyle = this.outlineColor;
      this.ctx.strokeText(this.text, text_x, text_y);
    }

    super._mainLoop();
  }
}