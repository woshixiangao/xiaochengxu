require=function e(t,i,o){function n(c,h){if(!i[c]){if(!t[c]){var r="function"==typeof require&&require;if(!h&&r)return r(c,!0);if(s)return s(c,!0);var a=new Error("Cannot find module '"+c+"'");throw a.code="MODULE_NOT_FOUND",a}var d=i[c]={exports:{}};t[c][0].call(d.exports,function(e){var i=t[c][1][e];return n(i||e)},d,d.exports,e,t,i,o)}return i[c].exports}for(var s="function"==typeof require&&require,c=0;c<o.length;c++)n(o[c]);return n}({GameMain:[function(e,t,i){"use strict";cc._RF.push(t,"ff3bfR/ALRJe7p5sxzxx4IM","GameMain"),cc.Class({extends:cc.Component,properties:{target:{default:null,type:cc.Node},scene_1:cc.Node,scene_2:cc.Node,scene_3:cc.Node,button:cc.Button,ground:cc.Node},onLoad:function(){var e=this,t=this.target.getComponent("HeroControl");cc.director.setDisplayStats(!1),e.scene_3.active=!1,e.ground.active=!0,e.button.node.on(cc.Node.EventType.TOUCH_START,function(e){cc.log("FBUUTON:TOUCH_START"),t.touchTag="TOUCH_START"},e.node),e.button.node.on(cc.Node.EventType.TOUCH_END,function(e){cc.log("FBUUTON:TOUCH_END"),t.herojump(),t.touchTag="TOUCH_END"},e.node)},update:function(e){this.target.y>=640&&(this.scene_1.y-=this.target.y-640,this.scene_2.y-=this.target.y-640,this.target.y=640,this.ground.active=!1),this.target.y<=-10&&this.gameOver(),this.scene_1.y<=-1280&&this.changeScene(this.scene_1,this.scene_2),this.scene_2.y<=-1280&&this.changeScene(this.scene_2,this.scene_1)},changeScene:function(e,t){e.y=t.y+t.height;var i=e.getComponent("SceneControl");if(i){i.changeColor(),i.layout();var o=this.target.getComponent("HeroControl");if(o){var n=Math.floor(o.getScore()/20);cc.log("======================= "+n),n>=8&&(n=8);for(var s=0;s<n;++s)i.addMoveP()}}},gameOver:function(){this.scene_3.active=!0}}),cc._RF.pop()},{}],GameOver:[function(e,t,i){"use strict";cc._RF.push(t,"47ca6X8IclHBoKHbLCE0C1g","GameOver"),cc.Class({extends:cc.Component,properties:{button:cc.Button,score_1:cc.Label,score_2:cc.Label},onLoad:function(){var e=this;e.button.node.on(cc.Node.EventType.TOUCH_END,function(e){cc.director.loadScene("GameMain")},e.node),this.score_2.string=this.score_1.string},start:function(){}}),cc._RF.pop()},{}],HeroControl:[function(e,t,i){"use strict";cc._RF.push(t,"913dflOgNRFtY2vFX3w4sqo","HeroControl"),cc.Class({extends:cc.Component,properties:{canvas:cc.Node,speed:cc.v2(0,0),maxSpeed:cc.v2(2e3,2e3),gravity:-1e3,drag:1e3,direction:0,jumpSpeed:360,score:cc.Label,fLabe:cc.Label,_score:0,touchTag:"TOUCH_END"},onLoad:function(){var e=this;e.setScore(),e.canvas.on(cc.Node.EventType.TOUCH_START,function(t){cc.log("cc.Node.EventType.TOUCH_START");var i=t.getTouches()[0].getLocation();e.touchX=i.x,e.touchY=i.y,e.touchX>320?e.direction=1:e.touchX<320?e.direction=-1:e.direction=0},e.node),e.canvas.on(cc.Node.EventType.TOUCH_END,function(t){e.direction=0},e.node),cc.eventManager.addListener({event:cc.EventListener.KEYBOARD,onKeyPressed:this.onKeyPressed.bind(this),onKeyReleased:this.onKeyReleased.bind(this)},this.node),cc.inputManager.setAccelerometerEnabled(!0),cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION,this.onDeviceMotionEvent,this),this.collisionX=0,this.collisionY=0,this.prePosition=cc.v2(),this.preStep=cc.v2(),this.touchingNumber=0},destroy:function(){this._super(),cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION,this.onDeviceMotionEvent,this),cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyPressed,this),cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyReleased,this)},onEnable:function(){cc.director.getCollisionManager().enabled=!0,cc.director.getCollisionManager().enabledDebugDraw=!0},onDisable:function(){cc.director.getCollisionManager().enabled=!1,cc.director.getCollisionManager().enabledDebugDraw=!1},herojump:function(){var e=this;e.jumping||(e.jumping=!0,e.speed.y=e.jumpSpeed)},onKeyPressed:function(e,t){switch(e){case cc.KEY.a:case cc.KEY.left:this.direction=-1;break;case cc.KEY.d:case cc.KEY.right:this.direction=1;break;case cc.KEY.w:case cc.KEY.up:this.jumping||(this.jumping=!0,this.speed.y=this.jumpSpeed)}},onKeyReleased:function(e,t){switch(e){case cc.KEY.a:case cc.KEY.left:case cc.KEY.d:case cc.KEY.right:this.direction=0}},onDeviceMotionEvent:function(e){cc.sys.isMobile},onCollisionEnter:function(e,t){if("platform"===e.node.group||"wall"===e.node.group){this.touchingNumber++;var i=e.world.aabb,o=e.world.preAabb.clone(),n=t.world.aabb,s=t.world.preAabb.clone();if(s.x=n.x,o.x=i.x,cc.Intersection.rectRect(s,o))return this.speed.x<0&&s.xMax>o.xMax?(this.node.x=o.xMax-this.node.parent.x,this.collisionX=-1):this.speed.x>0&&s.xMin<o.xMin&&(this.node.x=o.xMin-s.width-this.node.parent.x,this.collisionX=1),this.speed.x=0,void(e.touchingX=!0);s.y=n.y,o.y=i.y,cc.Intersection.rectRect(s,o)&&(this.speed.y<0&&s.yMax>o.yMax?(this.node.y=o.yMax-this.node.parent.y,this.jumping=!1,this.collisionY=-1,this.speed.y=0,e.touchingY=!0):this.speed.y>0&&s.yMin<o.yMin&&(this.collisionY=0,e.touchingY=!0))}else"trigger"===e.node.group&&e.node.ok&&(this._score++,this.setScore(),e.node.ok=!1)},onCollisionStay:function(e,t){if(-1===this.collisionY&&"platform"===e.node.group){var i=e.node.getComponent("PlatformConfig");i&&(this.node.x+=i._movedDiff)}},onCollisionExit:function(e){0===--this.touchingNumber&&(this.node.color=cc.Color.WHITE),e.touchingX?(this.collisionX=0,e.touchingX=!1):e.touchingY&&(e.touchingY=!1,this.collisionY=0,this.jumping=!0)},update:function(e){"TOUCH_START"==this.touchTag&&this.jumpSpeed<1500?this.jumpSpeed+=15:this.jumpSpeed=0,this.setfLabe(),cc.log("touchTag:"+this.touchTag),0===this.collisionY&&(this.speed.y+=this.gravity*e,Math.abs(this.speed.y)>this.maxSpeed.y&&(this.speed.y=this.speed.y>0?this.maxSpeed.y:-this.maxSpeed.y)),0===this.direction?this.speed.x>0?(this.speed.x-=this.drag*e,this.speed.x<=0&&(this.speed.x=0)):this.speed.x<0&&(this.speed.x+=this.drag*e,this.speed.x>=0&&(this.speed.x=0)):(this.speed.x+=(this.direction>0?1:-1)*this.drag*e,Math.abs(this.speed.x)>this.maxSpeed.x&&(this.speed.x=this.speed.x>0?this.maxSpeed.x:-this.maxSpeed.x)),this.speed.x*this.collisionX>0&&(this.speed.x=0),this.prePosition.x=this.node.x,this.prePosition.y=this.node.y,this.preStep.x=this.speed.x*e,this.preStep.y=this.speed.y*e,this.node.x+=this.speed.x*e,this.node.y+=this.speed.y*e},setScore:function(){this.score.string="分数："+this._score},setfLabe:function(){this.fLabe.string="F："+this.jumpSpeed},getScore:function(){return this._score}}),cc._RF.pop()},{}],PlatformConfig:[function(e,t,i){"use strict";cc._RF.push(t,"2cdeaE6gztJ9LFvhATHkvL1","PlatformConfig"),cc.Class({extends:cc.Component,properties:{speed:10,distance:200,trigger:cc.Node,isMove:!1},onLoad:function(){this._movedDistance=this.distance/2,this._direction=1,this._movedDiff=0,this.trigger.ok=!0},update:function(e){if(this.isMove){var t=this.speed*this._direction*e,i=this._movedDistance+Math.abs(t);this._movedDistance+=Math.abs(t),i>this.distance?(t=this.distance-this._movedDistance,this._movedDistance=0,this._direction*=-1):this._movedDistance=i,this.node.x+=t,this._movedDiff=t}},setTrigger:function(e){this.trigger.ok=e},setMove:function(e){this.isMove=e}}),cc._RF.pop()},{}],SceneControl:[function(e,t,i){"use strict";cc._RF.push(t,"eddb3EfJNBJx6oDDGmgi157","SceneControl"),cc.Class({extends:cc.Component,properties:{items:[],item:cc.Prefab},onLoad:function(){for(var e=0;e<10;e++){var t=cc.instantiate(this.item);this.node.addChild(t),this.items.push(t)}this.layout(),this.changeColor()},layout:function(){for(var e=-522,t=0;t<this.items.length;++t){this.items[t].y=e,this.items[t].x=26*(10-20*Math.random()),e+=128;var i=this.items[t].getComponent("PlatformConfig");i&&i.setTrigger(!0)}},changeColor:function(){for(var e=[],t=0;t<3;++t){var i=50*(4*Math.random()+1);e.push(Math.floor(i))}this.node.color=new cc.Color(e[0],e[1],e[2])},changePosY:function(e){this.node.y=e},addMoveP:function(){for(var e=8*Math.random(),t=0;t<this.items.length;++t)if(Math.floor(e)==t){var i=this.items[t].getComponent("PlatformConfig");i.isMove?this.addMoveP():i.setMove(!0)}}}),cc._RF.pop()},{}],WallConfig:[function(e,t,i){"use strict";cc._RF.push(t,"fdd70X+lkpH4pgXDATaZ9Q5","WallConfig");var o=cc.Enum({Left:0,Right:1,Top:2,Bottom:3});cc.Class({extends:cc.Component,properties:{type:{default:o.Left,type:o},width:5},start:function(){var e=this.getComponent(cc.BoxCollider);if(e){var t=this.node,i=this.type,n=cc.winSize.width,s=cc.winSize.height,c=this.width;i===o.Left?(t.height=s,t.width=c):i===o.Right?(t.height=s,t.width=c):i===o.Top?(t.width=n,t.height=c,t.x=n/2,t.y=s):i===o.Bottom&&(t.width=n,t.height=c,t.x=n/2,t.y=0),e.size=t.getContentSize()}}}),cc._RF.pop()},{}]},{},["GameMain","GameOver","HeroControl","PlatformConfig","SceneControl","WallConfig"]);