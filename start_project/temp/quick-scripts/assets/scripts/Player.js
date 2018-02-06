(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Player.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7bbcf+zkb5O05GKQPXlzZhC', 'Player', __filename);
// scripts/Player.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    // properties: {
    //     // foo: {
    //     //     // ATTRIBUTES:
    //     //     default: null,        // The default value will be used only when the component attaching
    //     //                           // to a node for the first time
    //     //     type: cc.SpriteFrame, // optional, default is typeof default
    //     //     serializable: true,   // optional, default is true
    //     // },
    //     // bar: {
    //     //     get () {
    //     //         return this._bar;
    //     //     },
    //     //     set (value) {
    //     //         this._bar = value;
    //     //     }
    //     // },
    // },
    properties: {
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        }
    },
    setJumpAction: function setJumpAction() {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        var callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复，而且每次完成落地动作后调用回调来播放声音
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },
    playJumpSound: function playJumpSound() {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },
    setInputControl: function setInputControl() {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向加速
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                }
            },
            // 松开按键时，停止向该方向的加速
            onKeyReleased: function onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                }
            }
        }, self.node);
    },
    touchListener: function touchListener() {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //     5 可选event类型列表:
            //     6 
            //     7 cc.EventListener.TOUCH_ONE_BY_ONE (单点触摸)
            //     8 cc.EventListener.TOUCH_ALL_AT_ONCE (多点触摸)
            //     9 cc.EventListener.KEYBOARD (键盘)
            //    10 cc.EventListener.MOUSE (鼠标)
            //    11 cc.EventListener.ACCELERATION (加速计)
            //    12 cc.EventListener.CUSTOM (自定义)
            swallowTouches: true, // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞掉事件，不再向下传递。

            onTouchBegan: function onTouchBegan(touch, event) //实现 onTouchBegan 事件处理回调函数
            {
                var target = event.getCurrentTarget(); // 获取事件所绑定的 target, 通常是cc.Node及其子类 
                // 获取当前触摸点相对于按钮所在的坐标
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                console.log('======onTouchBegan====');
                console.log("onTouchBegansprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
                if (locationInNode.x > 0) {
                    self.accLeft = false;
                    self.accRight = true;
                }
                if (locationInNode.x < 0) {
                    self.accLeft = true;
                    self.accRight = false;
                }
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    // 判断触摸点是否在按钮范围内
                    console.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
                    target.opacity = 180;
                    return true;
                }
                return false;
            },
            onTouchMoved: function onTouchMoved(touch, event) //实现onTouchMoved事件处理回调函数, 触摸移动时触发
            {
                console.log('===onTouchMoved===');
                console.log(touch.getLocation());
                self.movePickedHitTile(touch.getLocation());
                return true;
            },

            onTouchEnded: function onTouchEnded(touch, event) // 实现onTouchEnded事件处理回调函数
            {
                this.accLeft = false;
                this.accRight = false;
                console.log('===onTouchEnded===');
                console.log(touch.getLocation());
                self.dropTile(touch.getLocation());
                return true;
            }
        }, self.node);
    },
    checkHit: function checkHit(event) {
        var target = event.getCurrentTarget(); // 获取事件所绑定的 target, 通常是cc.Node及其子类 
        // 获取当前触摸点相对于按钮所在的坐标
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {
            // 判断触摸点是否在按钮范围内
            console.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
            target.opacity = 180;
            return true;
        }
        return false;
    },
    onLoad: function onLoad() {
        // 初始化跳跃动作
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);
        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;

        // 初始化键盘输入监听
        this.setInputControl();
        this.touchListener();
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},

    update: function update(dt) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            //如果速度达到极限，使用最大速度与当前方向。
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;
        // console.log('======update=====')
        // console.log(this.node.x)
        if (this.node.x > 480) {
            // 加速度方向开关
            this.accLeft = false;
            this.accRight = false;
            this.node.x = this.node.x - 1;
            // 主角当前水平方向速度
            this.xSpeed = 0;
        }
        if (this.node.x < -480) {
            // 加速度方向开关
            this.accLeft = false;
            this.accRight = false;
            this.node.x = this.node.x + 1;
            // 主角当前水平方向速度
            this.xSpeed = 0;
        }
    },
    stopAllActions: function stopAllActions() {
        console.log('=======stopAllActions===');
    }
    // update (dt) {},

});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Player.js.map
        