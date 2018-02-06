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
        times:0,//控制时间
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

    // LIFE-CYCLE CALLBACKS:

    //当前节点世界坐标系下的范围包围盒

    moveRight:function(){
        // var seq =cc.repeatForever(
        //     cc.sequence(
        //         cc.moveBy(this.times,cc.p(-240,0)),cc.moveBy(this.times,cc.p(240,0))
        //     )
        // )
        // this.node.runAction(seq)
        var seq = cc.repeatForever(cc.sequence(cc.moveBy(this.times,-240,0), cc.moveBy(this.times, 240,0)));
        this.node.runAction(seq);
    },
    onLoad () {
        this.moveRight()
    },
    start () {

    },
    noteBox:function(){
        return this.node.getBoundingBoxToWorld()
    },
    update (dt) {
        var _label=cc.find('MainScene/hero').getComponent('HeroPlayer');
        //障碍物碰撞框
        if(cc.rectIntersectsRect(_label.node.getBoundingBoxToWorld(), this.noteBox())){
            cc.eventManager.removeAllListeners();//移除所有事件监听
        }
    },
});
