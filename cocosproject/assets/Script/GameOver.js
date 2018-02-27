cc.Class({
    extends: cc.Component,

    properties: {
       button: cc.Button,
       score_1: cc.Label,
       score_2: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        self.button.node.on(cc.Node.EventType.TOUCH_END,function(event){
            cc.director.loadScene("GameMain");
        },self.node);

        this.score_2.string = this.score_1.string;
    },

    start () {

    },

    // update (dt) {},
});
