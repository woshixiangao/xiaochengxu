cc.Class({
    extends: cc.Component,

    properties: {
        target: {//角色
            default: null,
            type: cc.Node
        },
        scene_1: cc.Node,//当前背景
        scene_2: cc.Node,//下一个背景
        scene_3: cc.Node,//结束场景
        button: cc.Button,
        ground: cc.Node,//底部障碍物 wall


        
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        var hero = this.target.getComponent('HeroControl');
        self.button.node.opacity=150;
        cc.director.setDisplayStats(false)//设置是否在左下角显示 FPS。
        self.scene_3.active = false;
        self.ground.active = true;
        self.button.node.on(cc.Node.EventType.TOUCH_START,function(event){
            // cc.log('FBUUTON:TOUCH_START');
            hero.touchTag='TOUCH_START';
        },self.node);
        self.button.node.on(cc.Node.EventType.TOUCH_END,function(event){
            // cc.log('FBUUTON:TOUCH_END');
            hero.herojump();
            hero.touchTag='TOUCH_END';
        },self.node);
    },

    update: function (dt) {
        // console.log('targetY:'+this.target.y+',scene_1Y:'+this.scene_1.y+',scene_2Y:'+this.scene_2.y)

        if (this.target.y >= 640) {

            this.scene_1.y -= (this.target.y - 640);
            this.scene_2.y -= (this.target.y - 640);
            this.target.y = 640;
            this.ground.active = false;//跳跃到指定高度隐藏底部wall障碍物
            
        }

        if(this.target.y <= -10){
            this.gameOver();
        }

        if (this.scene_1.y <= -1280) {
           this.changeScene(this.scene_1, this.scene_2);
           
        }

        if (this.scene_2.y <= -1280) {
            this.changeScene(this.scene_2, this.scene_1);
            
        }

    },

    changeScene: function (node_1, node_2) {
        node_1.y = node_2.y + node_2.height;
        var motion = node_1.getComponent('SceneControl');
        if (motion) {
            motion.changeColor();//修改背景色
            motion.layout();//障碍物布局
            var hero = this.target.getComponent('HeroControl');
            if(hero){
                var i = Math.floor( hero.getScore() / 20);
                cc.log("======================= "+ i);
                if(i >= 8){
                    i = 8;
                }
                for(var j = 0; j < i; ++j){
                    motion.addMoveP();
                }
            }
            
        }
    },

    gameOver: function(){
        this.scene_3.active = true;
    }

    
});
