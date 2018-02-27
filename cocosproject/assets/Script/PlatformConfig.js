cc.Class({
    extends: cc.Component,

    properties: {
        speed: 10,//速度
        distance: 200,
        trigger: cc.Node,
        isMove: false,
    },

    // use this for initialization
    onLoad: function () {
        this._movedDistance = this.distance / 2;
        this._direction = 1;//移动方向
        this._movedDiff = 0;
        this.trigger.ok = true;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        if(!this.isMove){
            return;
        }

        var d = this.speed * this._direction * dt;
        
        var movedDistance = this._movedDistance + Math.abs(d);
        this._movedDistance += Math.abs(d);
        
        if (movedDistance > this.distance) {
            d = this.distance - this._movedDistance;
            this._movedDistance = 0;
            this._direction *= -1;
        }
        else {
            this._movedDistance = movedDistance;
        }
        
        this.node.x += d;//更新位置
        this._movedDiff = d;
    },
    setTrigger: function(bool){//设置显示隐藏
        this.trigger.ok = bool;
    },
    setMove: function(bool){//设置移动
        this.isMove = bool;
    }
});
