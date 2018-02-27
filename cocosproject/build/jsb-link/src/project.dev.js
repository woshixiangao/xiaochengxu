require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = "function" == typeof require && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f;
      }
      var l = n[o] = {
        exports: {}
      };
      t[o][0].call(l.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, l, l.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof require && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  GameMain: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ff3bfR/ALRJe7p5sxzxx4IM", "GameMain");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        target: {
          default: null,
          type: cc.Node
        },
        scene_1: cc.Node,
        scene_2: cc.Node,
        scene_3: cc.Node,
        ground: cc.Node
      },
      onLoad: function onLoad() {
        this.scene_3.active = false;
        this.ground.active = true;
      },
      update: function update(dt) {
        if (this.target.y >= 640) {
          this.scene_1.y -= this.target.y - 640;
          this.scene_2.y -= this.target.y - 640;
          this.target.y = 640;
          this.ground.active = false;
        }
        this.target.y <= -10 && this.gameOver();
        this.scene_1.y <= -1280 && this.changeScene(this.scene_1, this.scene_2);
        this.scene_2.y <= -1280 && this.changeScene(this.scene_2, this.scene_1);
      },
      changeScene: function changeScene(node_1, node_2) {
        node_1.y = node_2.y + node_2.height;
        var motion = node_1.getComponent("SceneControl");
        if (motion) {
          motion.changeColor();
          motion.layout();
          var hero = this.target.getComponent("HeroControl");
          if (hero) {
            var i = Math.floor(hero.getScore() / 20);
            cc.log("======================= " + i);
            i >= 8 && (i = 8);
            for (var j = 0; j < i; ++j) motion.addMoveP();
          }
        }
      },
      gameOver: function gameOver() {
        this.scene_3.active = true;
      }
    });
    cc._RF.pop();
  }, {} ],
  GameOver: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "47ca6X8IclHBoKHbLCE0C1g", "GameOver");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        button: cc.Button,
        score_1: cc.Label,
        score_2: cc.Label
      },
      onLoad: function onLoad() {
        var self = this;
        self.button.node.on(cc.Node.EventType.TOUCH_END, function(event) {
          cc.director.loadScene("GameMain");
        }, self.node);
        this.score_2.string = this.score_1.string;
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  HeroControl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "913dflOgNRFtY2vFX3w4sqo", "HeroControl");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        canvas: cc.Node,
        speed: cc.v2(0, 0),
        maxSpeed: cc.v2(2e3, 2e3),
        gravity: -1e3,
        drag: 1e3,
        direction: 0,
        jumpSpeed: 360,
        score: cc.Label,
        _score: 0
      },
      onLoad: function onLoad() {
        var self = this;
        self.setScore();
        self.canvas.on(cc.Node.EventType.TOUCH_START, function(event) {
          var touches = event.getTouches();
          var touchLoc = touches[0].getLocation();
          cc.log("touch start ==> " + JSON.stringify(touchLoc));
          self.touchX = touchLoc.x;
          self.touchY = touchLoc.y;
          self.touchX > 320 ? self.direction = 1 : self.touchX < 320 ? self.direction = -1 : self.direction = 0;
        }, self.node);
        self.canvas.on(cc.Node.EventType.TOUCH_END, function(event) {
          cc.log("touch end ==> ");
          self.direction = 0;
        }, self.node);
        this.schedule(function() {
          if (!self.jumping) {
            self.jumping = true;
            self.speed.y = self.jumpSpeed;
          }
        }, .5);
        cc.eventManager.addListener({
          event: cc.EventListener.KEYBOARD,
          onKeyPressed: this.onKeyPressed.bind(this),
          onKeyReleased: this.onKeyReleased.bind(this)
        }, this.node);
        cc.inputManager.setAccelerometerEnabled(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
        this.collisionX = 0;
        this.collisionY = 0;
        this.prePosition = cc.v2();
        this.preStep = cc.v2();
        this.touchingNumber = 0;
      },
      destroy: function destroy() {
        this._super();
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);
      },
      onEnable: function onEnable() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
      },
      onDisable: function onDisable() {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
      },
      onKeyPressed: function onKeyPressed(keyCode, event) {
        switch (keyCode) {
         case cc.KEY.a:
         case cc.KEY.left:
          this.direction = -1;
          break;

         case cc.KEY.d:
         case cc.KEY.right:
          this.direction = 1;
          break;

         case cc.KEY.w:
         case cc.KEY.up:
          if (!this.jumping) {
            this.jumping = true;
            this.speed.y = this.jumpSpeed;
          }
        }
      },
      onKeyReleased: function onKeyReleased(keyCode, event) {
        switch (keyCode) {
         case cc.KEY.a:
         case cc.KEY.left:
         case cc.KEY.d:
         case cc.KEY.right:
          this.direction = 0;
        }
      },
      onDeviceMotionEvent: function onDeviceMotionEvent(event) {
        cc.sys.isMobile && cc.log("=====" + event.acc.x);
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        if ("platform" === other.node.group || "wall" === other.node.group) {
          this.touchingNumber++;
          var otherAabb = other.world.aabb;
          var otherPreAabb = other.world.preAabb.clone();
          var selfAabb = self.world.aabb;
          var selfPreAabb = self.world.preAabb.clone();
          selfPreAabb.x = selfAabb.x;
          otherPreAabb.x = otherAabb.x;
          if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this.speed.x < 0 && selfPreAabb.xMax > otherPreAabb.xMax) {
              this.node.x = otherPreAabb.xMax - this.node.parent.x;
              this.collisionX = -1;
            } else if (this.speed.x > 0 && selfPreAabb.xMin < otherPreAabb.xMin) {
              this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
              this.collisionX = 1;
            }
            this.speed.x = 0;
            other.touchingX = true;
            return;
          }
          selfPreAabb.y = selfAabb.y;
          otherPreAabb.y = otherAabb.y;
          if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) if (this.speed.y < 0 && selfPreAabb.yMax > otherPreAabb.yMax) {
            this.node.y = otherPreAabb.yMax - this.node.parent.y;
            this.jumping = false;
            this.collisionY = -1;
            this.speed.y = 0;
            other.touchingY = true;
          } else if (this.speed.y > 0 && selfPreAabb.yMin < otherPreAabb.yMin) {
            this.collisionY = 0;
            other.touchingY = true;
          }
        } else if ("trigger" === other.node.group && other.node.ok) {
          this._score++;
          this.setScore();
          other.node.ok = false;
        }
      },
      onCollisionStay: function onCollisionStay(other, self) {
        if (-1 === this.collisionY && "platform" === other.node.group) {
          var motion = other.node.getComponent("PlatformConfig");
          motion && (this.node.x += motion._movedDiff);
        }
      },
      onCollisionExit: function onCollisionExit(other) {
        this.touchingNumber--;
        0 === this.touchingNumber && (this.node.color = cc.Color.WHITE);
        if (other.touchingX) {
          this.collisionX = 0;
          other.touchingX = false;
        } else if (other.touchingY) {
          other.touchingY = false;
          this.collisionY = 0;
          this.jumping = true;
        }
      },
      update: function update(dt) {
        if (0 === this.collisionY) {
          this.speed.y += this.gravity * dt;
          Math.abs(this.speed.y) > this.maxSpeed.y && (this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y);
        }
        if (0 === this.direction) {
          if (this.speed.x > 0) {
            this.speed.x -= this.drag * dt;
            this.speed.x <= 0 && (this.speed.x = 0);
          } else if (this.speed.x < 0) {
            this.speed.x += this.drag * dt;
            this.speed.x >= 0 && (this.speed.x = 0);
          }
        } else {
          this.speed.x += (this.direction > 0 ? 1 : -1) * this.drag * dt;
          Math.abs(this.speed.x) > this.maxSpeed.x && (this.speed.x = this.speed.x > 0 ? this.maxSpeed.x : -this.maxSpeed.x);
        }
        this.speed.x * this.collisionX > 0 && (this.speed.x = 0);
        this.prePosition.x = this.node.x;
        this.prePosition.y = this.node.y;
        this.preStep.x = this.speed.x * dt;
        this.preStep.y = this.speed.y * dt;
        this.node.x += this.speed.x * dt;
        this.node.y += this.speed.y * dt;
      },
      setScore: function setScore() {
        this.score.string = "分数：" + this._score;
      },
      getScore: function getScore() {
        return this._score;
      }
    });
    cc._RF.pop();
  }, {} ],
  PlatformConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2cdeaE6gztJ9LFvhATHkvL1", "PlatformConfig");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        speed: 10,
        distance: 200,
        trigger: cc.Node,
        isMove: false
      },
      onLoad: function onLoad() {
        this._movedDistance = this.distance / 2;
        this._direction = 1;
        this._movedDiff = 0;
        this.trigger.ok = true;
      },
      update: function update(dt) {
        if (!this.isMove) return;
        var d = this.speed * this._direction * dt;
        var movedDistance = this._movedDistance + Math.abs(d);
        this._movedDistance += Math.abs(d);
        if (movedDistance > this.distance) {
          d = this.distance - this._movedDistance;
          this._movedDistance = 0;
          this._direction *= -1;
        } else this._movedDistance = movedDistance;
        this.node.x += d;
        this._movedDiff = d;
      },
      setTrigger: function setTrigger(bool) {
        this.trigger.ok = bool;
      },
      setMove: function setMove(bool) {
        this.isMove = bool;
      }
    });
    cc._RF.pop();
  }, {} ],
  SceneControl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eddb3EfJNBJx6oDDGmgi157", "SceneControl");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        items: [],
        item: cc.Prefab
      },
      onLoad: function onLoad() {
        for (var i = 0; i < 10; i++) {
          var item = cc.instantiate(this.item);
          this.node.addChild(item);
          this.items.push(item);
        }
        this.layout();
        this.changeColor();
      },
      layout: function layout() {
        var posY = -522;
        for (var i = 0; i < this.items.length; ++i) {
          this.items[i].y = posY;
          this.items[i].x = 26 * (10 - 20 * Math.random());
          posY += 128;
          var motion = this.items[i].getComponent("PlatformConfig");
          motion && motion.setTrigger(true);
        }
      },
      changeColor: function changeColor() {
        var c = [];
        for (var j = 0; j < 3; ++j) {
          var f = 50 * (4 * Math.random() + 1);
          c.push(Math.floor(f));
        }
        this.node.color = new cc.Color(c[0], c[1], c[2]);
      },
      changePosY: function changePosY(y) {
        this.node.y = y;
      },
      addMoveP: function addMoveP() {
        var num = 8 * Math.random();
        for (var i = 0; i < this.items.length; ++i) if (Math.floor(num) == i) {
          var motion = this.items[i].getComponent("PlatformConfig");
          motion.isMove ? this.addMoveP() : motion.setMove(true);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  WallConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fdd70X+lkpH4pgXDATaZ9Q5", "WallConfig");
    "use strict";
    var WallType = cc.Enum({
      Left: 0,
      Right: 1,
      Top: 2,
      Bottom: 3
    });
    cc.Class({
      extends: cc.Component,
      properties: {
        type: {
          default: WallType.Left,
          type: WallType
        },
        width: 5
      },
      start: function start() {
        var collider = this.getComponent(cc.BoxCollider);
        if (!collider) return;
        var node = this.node;
        var type = this.type;
        var width = cc.winSize.width;
        var height = cc.winSize.height;
        var wallWidth = this.width;
        if (type === WallType.Left) {
          node.height = height;
          node.width = wallWidth;
        } else if (type === WallType.Right) {
          node.height = height;
          node.width = wallWidth;
        } else if (type === WallType.Top) {
          node.width = width;
          node.height = wallWidth;
          node.x = width / 2;
          node.y = height;
        } else if (type === WallType.Bottom) {
          node.width = width;
          node.height = wallWidth;
          node.x = width / 2;
          node.y = 0;
        }
        collider.size = node.getContentSize();
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "GameMain", "GameOver", "HeroControl", "PlatformConfig", "SceneControl", "WallConfig" ]);