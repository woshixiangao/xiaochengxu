// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var com = require("Common");
cc.Class({
    extends: cc.Component,

    properties: {
                jumpDuration:0,
                //主角跳跃高度
                jumpHeight: 0,
                //主角跳跃持续时间
                jumpTimes: 0,
                fG:0,
                //掉落速度
                maxMoveSpeed: 0,
                moveleft:false,
                moveright:false,
                MoveXSpeed:0,
                fString: {
                    default: null,
                    type: cc.Label
                },
                // foo: {
                //     // ATTRIBUTES:
                //     default: null,        // The default value will be used only when the component attaching
                //                           // to a node for the first time
                //     type: cc.SpriteFrame, // optional, default is typeof default
                //     serializable: true,   // optional, default is true
                // },
                // bar: {
                //     get () {
                //         return this._bar;
                //     },
                //     set (value) {
                //         this._bar = value;
                //     }
                // },
    },
//跳跃
setJumpUpAction: function(){
    // 跳跃上升
    var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight));
    //jumpUp.reverse();
    return jumpUp;
},
setJump: function()
{
    
    // com.moveY='up';
    // com.stratY=Math.round(this.node.y);
    // console.log('jumpHeight:'+this.jumpHeight)
    // var setjupheight=this.jumpHeight
    // var actionBy= cc.jumpBy(this.jumpDuration, cc.p(0,0),600, 1);
    // return actionBy;
    // this.node.runAction(actionBy);
},
setJumpAction: function () {
    var self = this;
    // 跳跃上升
    var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
    // 下落
    var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
    var actionCallbackFunction = cc.callFunc(function(){
        cc.log("Action Callback Function");
        com.moveY='down'
}, this);
    var actionFinishCallbackFunction = cc.callFunc(function(){
        cc.log("Action Finish Callback Function");
        com.moveY='static'
}, this);
    var actionArray = [];
    actionArray.push(jumpUp);
    actionArray.push(actionCallbackFunction);
    actionArray.push(jumpDown);
    actionArray.push(actionFinishCallbackFunction);
    // 跳跃
    this.node.runAction(cc.sequence(actionArray));
    },
//掉落
setJumpDownAction: function(){
    //下落
    var jumpDown = cc.moveBy(this.jumpTimes, cc.p(0, - this.maxMoveSpeed));
    return jumpDown;
},
// setJumpRunAction: function(){
//     // 初始化跳跃动作
//     this.jumpAction = this.setJumpUpAction();
//     //掉落动作
//     this.maxMoveSpeed = this.setJumpDownAction();
//     //包装动作
//     var seq = cc.sequence(this.jumpAction,this.maxMoveSpeed);
//     this.node.runAction(seq);
// },
//玩家不操作时，角色进行下坠
heroDownMove: function(){
    //下落
    var heroDown = cc.moveBy(0.8, cc.p(0, -5));
    return heroDown;
},
//玩家不操作时，角色进行左移动
heroDownLeft: function(){
    var heroDown = cc.moveBy(0.8, cc.p(-5,0));
    return heroDown;
},
//玩家不操作时，角色进行右移动
heroDownRight: function(){
    var heroDown = cc.moveBy(0.8, cc.p(5,0));
    return heroDown;
},
    // use this for initialization
    onLoad: function () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        this.node.group=11;
        //初始化跳跃动作
// this.jumpAction = this.setJumpAction();
        console.log('====onLoad===')
        // console.log(com)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        // this.setJumpRunAction();
        
    },
        // called every frame, uncomment this function to activate update callback
        update: function (dt) {
            // var mass = rigidbody.getMass(); 
            // var velocity = rigidbody.linearVelocity;
            // console.log('mass:'+mass+',velocity:'+velocity)
            // console.log("角色方向：" + com.moveY+'，playerY:'+this.node.y)
            // console.log('CC_DEBUG :'+CC_DEBUG)
            if(com.moveY=='down'){
                // this.node.y=100;
            }
            // if(this.node.y!=-380){
            //     cc.log("现在角色坐标：" + this.node.y );
            // }
            
            
            // cc.log("现在角色坐标：" + this.node.getPosition() );
            // this.node.runAction(this.heroDownMove());//精灵移动
            // console.log('moveleft:'+this.moveleft)
            // console.log('moveright:'+this.moveright)
            // console.log(com.TouchTage)
            if(this.moveleft&&this.node.x>-200){
                this.node.x-=this.MoveXSpeed;
                // this.node.runAction(this.heroDownLeft())
            }
            if(this.moveright&&this.node.x<200){
                this.node.x+=this.MoveXSpeed;
                // this.node.runAction(this.heroDownRight())
            }
            if(com.TouchTage=='TouchBegan'||com.TouchTage=='TouchMoved'){

                this.jumpHeight+=this.fG;
                this.fString.string = "F:"+ this.jumpHeight;
                if(this.jumpHeight>750){
                    this.jumpHeight=0
                }
            }
            if(com.TouchTage=='TouchEnded'){
                this.jumpHeight=0;
                this.fString.string = "F:"+ this.jumpHeight;
                // var moveYint=Math.round(this.node.y)-Math.round(com.stratY)
                // cc.log("现在角色坐标差值：" + moveYint+",jumpHeight:" + this.jumpHeight+'nodeY:'+this.node.y);
                // cc.log("角色方向：" + com.moveY );
            }

        },
    // LIFE-CYCLE CALLBACKS:
    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    countAttock(){
        cc.log("扣除血量")
    },
    onKeyDown: function (event) {
        // console.log('======onKeyDown=====');
        console.log(event.keyCode);
        switch(event.keyCode) {
            case 37:
                this.moveleft=true;
                // console.log('release a key=left');
                break;
            case 39:
                this.moveright=true;
                // console.log('release a key=right');
                break;
        }
    },
    onCollisionEnter: function (other, self) {
        console.log('on collision enter333');
    },
    onKeyUp: function (event) {
        // console.log('======onKeyDown=====');
        console.log(event.keyCode);
        switch(event.keyCode) {
            case 37:
                this.moveleft=false;
                // console.log('release a key=left');
                break;
            case 39:
                this.moveright=false;
                // console.log('release a key=right');
                break;
        }
    },

    start () {

    },

});
