cc.Class({
    extends: cc.Component,

    properties: {
        items: [],
        item: cc.Prefab,//障碍物
    },

    // use this for initialization
    onLoad: function () {
 
        for (var i = 0; i < 10; i++) {
            var item = cc.instantiate(this.item);//实例化
            this.node.addChild(item);
            this.items.push(item);
        }

        this.layout();//布局障碍物
        this.changeColor();//背景色
    },

    layout: function () {
        var posY = -522;
        for (var i = 0; i < this.items.length; ++i) {
            this.items[i].y = posY;
            this.items[i].x = 26 * (10 - Math.random() * 20);
            posY += 128;
            var motion = this.items[i].getComponent('PlatformConfig');
            if(motion){
                motion.setTrigger(true);
            }
        }
    },

    changeColor: function(){
        var c = [];
        for (var j = 0; j < 3; ++j) {
            var f = 50 * (Math.random() * 4 + 1);
            c.push(Math.floor(f));
        }
        this.node.color = new cc.Color(c[0], c[1], c[2]);
    },

    changePosY: function(y){
        this.node.y = y;
    },

    addMoveP: function(){//第0-8个障碍物添加移动
        var num = Math.random() * 8;
        for (var i = 0; i < this.items.length; ++i) {
            if(Math.floor(num) == i){
                var motion = this.items[i].getComponent('PlatformConfig');
                if(!motion.isMove){
                   motion.setMove(true);
                }else {
                    this.addMoveP();
                }
            }
        }
    }
});
