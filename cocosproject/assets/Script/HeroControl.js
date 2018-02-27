
cc.Class({
    extends: cc.Component,

    properties: {
        canvas: cc.Node,
        
        speed: cc.v2(0, 0),
        maxSpeed: cc.v2(2000, 2000),
        gravity: -1000,
        drag: 1000,
        direction: 0,//方向
        jumpSpeed: 360,//跳跃速度

        score: cc.Label,//分值对象
        fLabe: cc.Label,//初始速度
        _score: 0,//分值
        touchTag:'TOUCH_END'
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        self.setScore();
        self.canvas.on(cc.Node.EventType.TOUCH_START, function (event) {
            // cc.log('cc.Node.EventType.TOUCH_START')
            // self.touchTag='TOUCH_START';
            var touches = event.getTouches();
            var touchLoc = touches[0].getLocation();
            // cc.log("touch start ==> " + JSON.stringify(touchLoc));
            self.touchX = touchLoc.x;
            self.touchY = touchLoc.y;
            if (true) {
                if (self.touchX > 320) {
                    self.direction = 1;
                } else if (self.touchX < 320) {
                    self.direction = -1;
                } else {
                    self.direction = 0;
                }
            } else {
                if (!self.jumping) {
                    self.jumping = true;
                    self.speed.y = self.jumpSpeed;
                }
            }
        }, self.node);

        self.canvas.on(cc.Node.EventType.TOUCH_END, function (event) {
            // self.touchTag='TOUCH_END';
            // cc.log("touch end ==> ");
            self.direction = 0;
        }, self.node);

        // this.schedule(function(){
        //     cc.log('schedule')
        //     if (!self.jumping) {
        //         self.jumping = true;
        //         self.speed.y = self.jumpSpeed;
        //     }
        // },0.5);

        cc.eventManager.addListener({//键盘事件
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.onKeyPressed.bind(this),
            onKeyReleased: this.onKeyReleased.bind(this),
        }, this.node);


        cc.inputManager.setAccelerometerEnabled(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);

        this.collisionX = 0;
        this.collisionY = 0;

        this.prePosition = cc.v2();
        this.preStep = cc.v2();

        this.touchingNumber = 0;
    },
    destroy: function () {
        this._super();
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);
    },
    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },
    herojump:function (){
        var self = this;
                    if (!self.jumping) {
                self.jumping = true;
                // cc.log('jumpSpeed:'+self.jumpSpeed)
                self.speed.y = self.jumpSpeed;
            }
    },
    onKeyPressed: function (keyCode, event) {//键盘按下
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
                break;
        }
    },

    onKeyReleased: function (keyCode, event) {//松开按键
        switch (keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
            case cc.KEY.d:
            case cc.KEY.right:
                this.direction = 0;
                break;
        }
    },
    onDeviceMotionEvent: function(event){
        if(cc.sys.isMobile){
            // cc.log("=====" + event.acc.x);

            // if(event.acc.x >= 0){
            //     this.direction = 1;
            // }else{
            //     this.direction = -1
            // }
        }
        
        // if(event.acc.x >= 100){
        //     this.direction = 1;
        // }else if(event.acc.x <= -100){
        //     this.direction = -1
        // }
    },
    onCollisionEnter: function (other, self) {
//         /**
//  * 当碰撞产生的时候调用
//  * @param  {Collider} other 产生碰撞的另一个碰撞组件
//  * @param  {Collider} self  产生碰撞的自身的碰撞组件
//  */
cc.log('当碰撞产生的时候调用'+',other:'+other.node.group+',self:'+self.node.group);
        if (other.node.group === "platform" || other.node.group === "wall") {
            // this.node.color = cc.Color.RED;
            this.touchingNumber++;

            // 1st step 
            // get pre aabb, go back before collision
            var otherAabb = other.world.aabb;
            var otherPreAabb = other.world.preAabb.clone();

            var selfAabb = self.world.aabb;
            var selfPreAabb = self.world.preAabb.clone();

            // 2nd step
            // forward x-axis, check whether collision on x-axis
            selfPreAabb.x = selfAabb.x;
            otherPreAabb.x = otherAabb.x;

            if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
                if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
                    this.node.x = otherPreAabb.xMax - this.node.parent.x;
                    this.collisionX = -1;
                }
                else if (this.speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
                    this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
                    this.collisionX = 1;
                }

                this.speed.x = 0;
                other.touchingX = true;
                return;
            }

            // 3rd step
            // forward y-axis, check whether collision on y-axis
            selfPreAabb.y = selfAabb.y;
            otherPreAabb.y = otherAabb.y;

            if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
                if (this.speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                    this.node.y = otherPreAabb.yMax - this.node.parent.y;
                    this.jumping = false;
                    this.collisionY = -1;

                    this.speed.y = 0;
                    other.touchingY = true;
                }
                else if (this.speed.y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)) {
                    // this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y;
                    this.collisionY = 0;
                    // this.node.y = otherPreAabb.yMin + otherPreAabb.height;
                    other.touchingY = true;
                }
                
                // this.speed.y = 0;
                // other.touchingY = true;

               
            }
        }else if(other.node.group === "trigger"){
            // cc.log("=================== trigger");
            if(other.node.ok){
                this._score ++;
                this.setScore();
                other.node.ok = false;
            }
            

        }
    },

    onCollisionStay: function (other, self) {
//        /**
//  * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
//  * @param  {Collider} other 产生碰撞的另一个碰撞组件
//  * @param  {Collider} self  产生碰撞的自身的碰撞组件
//  */
cc.log('当碰撞产生后'+',other:'+other.node.group+',self:'+self.node.group)
        if (this.collisionY === -1) {
            if (other.node.group === 'platform') {
                var motion = other.node.getComponent('PlatformConfig');
                if (motion) {
                    this.node.x += motion._movedDiff;
                }
            }
        }
    },

    onCollisionExit: function (other, self) {
//         /**
//  * 当碰撞结束后调用
//  * @param  {Collider} other 产生碰撞的另一个碰撞组件
//  * @param  {Collider} self  产生碰撞的自身的碰撞组件
//  */
cc.log('当碰撞结束后'+',other:'+other.node.group+',self:'+self.node.group)
        this.touchingNumber--;
        if (this.touchingNumber === 0) {
            this.node.color = cc.Color.WHITE;
        }

        if (other.touchingX) {
            this.collisionX = 0;
            other.touchingX = false;
        }
        else if (other.touchingY) {
            other.touchingY = false;
            this.collisionY = 0;
            this.jumping = true;
        }
    },


    update: function (dt) {
        if(this.touchTag=='TOUCH_START'){
            if(this.jumpSpeed<1500){
                this.jumpSpeed+=15;
            }else{
                this.jumpSpeed=0;
            }
            
        }else{
            this.jumpSpeed=0;
        }
        this.setfLabe()
        // cc.log('touchTag:'+this.touchTag);
        if (this.collisionY === 0) {
            this.speed.y += this.gravity * dt;
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
        }

        if (this.direction === 0) {
            if (this.speed.x > 0) {
                this.speed.x -= this.drag * dt;
                if (this.speed.x <= 0) this.speed.x = 0;
            }
            else if (this.speed.x < 0) {
                this.speed.x += this.drag * dt;
                if (this.speed.x >= 0) this.speed.x = 0;
            }
        }
        else {
            this.speed.x += (this.direction > 0 ? 1 : -1) * this.drag * dt;
            if (Math.abs(this.speed.x) > this.maxSpeed.x) {
                this.speed.x = this.speed.x > 0 ? this.maxSpeed.x : -this.maxSpeed.x;
            }
        }

        if (this.speed.x * this.collisionX > 0) {
            this.speed.x = 0;
        }

        this.prePosition.x = this.node.x;
        this.prePosition.y = this.node.y;

        this.preStep.x = this.speed.x * dt;
        this.preStep.y = this.speed.y * dt;

        this.node.x += this.speed.x * dt;
        this.node.y += this.speed.y * dt;
    },

    setScore: function(){
        this.score.string = "分数：" + this._score;
    },
    setfLabe: function(){
        this.fLabe.string = "F：" + this.jumpSpeed;
    },
    getScore: function(){
        return this._score;
    }
});
