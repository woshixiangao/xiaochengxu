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
        //是否开启音乐、默认开启
        isOpen:true,
        //游戏音乐资源
        gameAudio:{
            default:null,
            url:cc.AudioClip
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
    onLoad:function(){
        this.isOpen=true;//开启音乐
        cc.audioEngine.playMusic ( this.gameAudio, true );        
    },
    //检查音乐开启状态
    checkMusic:function(){
        return isOpen;
    },
    //获取点击坐标
    setCp:function(pos){
        var rec = cc.rectContainsPoint(this.node.getBoundingBoxToWorld(),pos) ;
        if(rec){
                        //检查音乐开启状态
                        //如果音乐开启了则关闭音乐和音效
                        if(this.isOpen){
                         //if (cc.audioEngine.isMusicPlaying()) {
                            cc.audioEngine.pauseMusic();//暂停正在播放音乐
                            cc.log("暂停正在播放音乐");
                            //this.node.addChild("Texture/menu_music_off.png");
                            this.isOpen = false;
                            }
                        else {
                          // cc.log("music is not playing");
                          cc.audioEngine.resumeMusic ();//恢复背景音乐
                          cc.log("恢复背景音乐");
                          this.isOpen = true;
                         }
                          
                    }
            
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
