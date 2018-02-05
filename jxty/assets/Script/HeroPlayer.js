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

    properties: {
                //主角跳跃高度
                jumpHeight: 0,
                //主角跳跃持续时间
                jumpTimes: 0,
                //掉落速度
                maxMoveSpeed: 0,
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
    var jumpUp = cc.moveBy(this.jumpTimes, cc.p(0, this.jumpHeight));
    //jumpUp.reverse();
    return jumpUp;
},
//掉落
setJumpDownAction: function(){
    //下落
    var jumpDown = cc.moveBy(this.jumpTimes, cc.p(0, - this.maxMoveSpeed));
    return jumpDown;
},
setJumpRunAction: function(){
    // 初始化跳跃动作
    this.jumpAction = this.setJumpUpAction();
    //掉落动作
    this.maxMoveSpeed = this.setJumpDownAction();
    //包装动作
    var seq = cc.sequence(this.jumpAction,this.maxMoveSpeed);
    this.node.runAction(seq);
},
//玩家不操作时，角色进行下坠
heroDownMove: function(){
    //下落
    var heroDown = cc.moveBy(0.8, cc.p(0, -5));
    return heroDown;
},
    // use this for initialization
    onLoad: function () {
       
        this.setJumpRunAction();
        
    },
        // called every frame, uncomment this function to activate update callback
        update: function (dt) {
            // cc.log("现在角色坐标：" + this.node.getPosition() );
            this.node.runAction(this.heroDownMove());//精灵移动
            
        },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    sdfds(){
        
    }
    // update (dt) {},
});
