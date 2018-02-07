// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
// var HeroPlayer = require("HeroPlayer");
cc.Class({
    extends: cc.Component,

    properties: {
         // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
         player: {
            default: null,
            type: cc.Node
        },
        // bgsprite1 节点，用于背景移动
        bgsprite1: {
            default: null,
            type: cc.Node
        },
        // bgsprite2 节点，用于背景移动
        bgsprite2: {
            default: null,
            type: cc.Node
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        //背景音乐资源
        bgmusic:{
            default:null,
            type:cc.Node
        },
        //游戏音乐资源
        gameAudio:{
            default:null,
            url:cc.AudioClip
        },
        //游戏结束音乐资源
        gameOverAudio:{
            default:null,
            url:cc.AudioClip
        }
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

    // onLoad () {},
    onLoad: function () {
        //触摸监听
        this.setEventControl();
        // 初始化计分
        this.score = 0;
        //添加判断

        this.isMoving = true;
    },
    //积分更新
    gainScore:function(){
        this.score+=1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = "Score:"+ this.score.toString();  
        cc.sys.localStorage.setItem("ScoreDis" ,this.scoreDisplay.string);//本地存储      
    },
    start () {

    },
//事件监听
setEventControl: function(){
    var self = this;
    var hero = self.player.getComponent('HeroPlayer');//角色绑定控件
    var bg1 = self.bgsprite1.getComponent('bgMove');//角色绑定控件
    var bg2 = self.bgsprite2.getComponent('bgMove');//角色绑定控件
    var mus = self.bgmusic.getComponent('AudioScript');//音乐绑定控件
    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,     // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
        onTouchBegan: function (touch, event) {        //实现 onTouchBegan 事件回调函数
            var target = event.getCurrentTarget();    // 获取事件所绑定的 target
            
            // cc.log("点击节点："+ target);
            
            var locationInNode = target.convertToNodeSpace(touch.getLocation()); 
            
            cc.log("当前点击坐标"+locationInNode);
            mus.setCp(touch.getLocation())
        
            // mus.setCp(touch.getLocation());

            hero.node.runAction(hero.setJumpUpAction());//精灵移动
            //cc.log("跳跃：－－－－－－－－");
            

            
            
            return true;
        },
        onTouchMoved: function (touch, event) {            // 触摸移动时触发
            
        },
        onTouchEnded: function (touch, event) {            // 点击事件结束处理
            // cc.log("跳跃后角色坐标：" + self.player.getPosition() );
            if(self.player.getPositionY()>0){
                var height =self.player.getPositionY();
                self.player.setPositionY(height/2)
                self.gainScore()
                bg1.node.runAction(bg1.setMoveAction(height))
                bg2.node.runAction(bg2.setMoveAction(height))
            }
            
        },

    
    }, self.node)
},
setBgMoveCreate:function(){
    var overY=this.bgsprite1.getContentSize().height+200
    if(this.bgsprite1.getPositionY()  < -overY){
        this.bgsprite1.setPositionY(this.bgsprite2.getPositionY()+this.bgsprite2.getContentSize().height);
    }
    if(this.bgsprite2.getPositionY()  < -overY){
        this.bgsprite2.setPositionY(this.bgsprite1.getPositionY()+this.bgsprite1.getContentSize().height);
    }
    // if(this.bgsprite1.getPositionY()  < -500 ){
    //     this.bgsprite2.setPositionY(this.bgsprite1.getPositionY()+this.bgsprite1.getContentSize().height);
    // }
    // if(this.bgsprite2.getPositionY()  < -500 ){
    //     this.bgsprite1.setPositionY(this.bgsprite2.getPositionY()+this.bgsprite2.getContentSize().height);
    // }
},
gameOver:function(){
    cc.eventManager.removeAllListeners();//移除所有事件监听
    this.player.stopAllActions(); //停止 player 节点的跳跃动作
    cc.director.loadScene("GameOver");//切换场景到结束场景
    // cc.director.loadScene('MainScene')
    
},
update (dt) {
    var mus = this.bgmusic.getComponent('AudioScript');//音乐绑定控件
    this.setBgMoveCreate();
    if(this.player.getPositionY() <= -cc.view.getVisibleSize().height/2){
        this.unscheduleAllCallbacks();
        if(this.isMoving)
        {
            this.gameOver();
            this.isMoving = false;
        }
    }
    if(mus.isOpen){
        cc.log('恢复现在正在播放的所有音效')
        cc.audioEngine.resumeAllEffects()
    }else{
        cc.log('暂停现在正在播放的所有音效')
        cc.audioEngine.pauseAllEffects()
    }
    //gameOver判断 玩家坠落到屏幕底部游戏结束

    // console.log('bg1Y:'+this.bgsprite1.getPositionY())
    // console.log('bg2Y:'+this.bgsprite2.getPositionY())
},
});
