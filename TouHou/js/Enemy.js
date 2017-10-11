(function(){
	var enemyTypes={
		"type1":{//小敌人圆形弹幕
			"width":40,
			"height":28,
			"px":4,
			"py":2,
			"dpx":48
		},
		"type2":{//中敌人跟踪
			"width":40,
			"height":28,
			"px":4,
			"py":97,
			"dpx":48
		},
		"type3":{//大敌人转圈圆形弹幕
			"width":64,
			"height":64,
			"px":0,
			"py":448,
			"dpx":64
		},
		"type4":{//小敌人随机弹幕
			"width":40,
			"height":28,
			"px":4,
			"py":2,
			"dpx":48
		}
	}
	var Enemy=window.Enemy=function(x,y,type){
		this.x=x;
		this.y=y;
		this.dx=0;
		this.dy=0;
		this.f=0;
		this.owenFrame=0;
		this.type=type;
		if(this.type=="type3"){
			this.jiaodu=0;
		}
		this.step=0;
		game.enemys.push(this);
	};
	Enemy.prototype.render=function(){
		game.ctx2.drawImage(game.images.enemy,enemyTypes[this.type].px+enemyTypes[this.type].dpx*this.step,enemyTypes[this.type].py,enemyTypes[this.type].width,enemyTypes[this.type].height,this.x-enemyTypes[this.type].width/2,this.y-enemyTypes[this.type].height/2,enemyTypes[this.type].width,enemyTypes[this.type].height);
	};
	Enemy.prototype.update=function(){
		if(this.f==game.frame){
			this.dx=0;
			this.dy=0;
		}
		this.x+=this.dx;
		this.y+=this.dy;
		game.frame%10== 0 && this.step++;
		if(this.step>3){
			this.step=0;
		}
		if(this.type == "type1"){
			if(game.frame%40==0){
				for(var i=0;i<10*game.nanDu;i++){
					new Bullet(this.x,this.y,i*2*Math.PI/(10*game.nanDu),"小圆1");
				}
			}
		}else if(this.type == "type2"){
			if(game.frame%30 == 0){
				new Bullet(this.x,this.y,Math.atan2(game.player.y-this.y,game.player.x-this.x),"长椭1");
			}
		}else if(this.type == "type3"){
			if(game.frame%3==0){
				this.jiaodu+=4;
				new Bullet(this.x,this.y,this.jiaodu*Math.PI/180,"小米1");
			}
		}else if(this.type == "type4"){
			if(this.owenFrame>=100 && this.owenFrame<=100+10*game.nanDu){
				new Bullet(parseInt(Math.random()*100)+this.x-50,parseInt(Math.random()*100)+this.y+14,Math.PI/2,"小小圆1");
			}
			this.y++;
		}
		//前五秒无敌
		this.owenFrame++;
		if(this.owenFrame>=300){
			//被player子弹击中
			for(var i=game.playerBullets.length-1;i>=0;i--){
				if(Math.abs(this.x-game.playerBullets[i].x)<(enemyTypes[this.type].width+12)/2 && Math.abs(this.y-game.playerBullets[i].y+27.5)<(enemyTypes[this.type].height+55)/2){
					game.deleteEnemy(this);
					game.deletePlayerBullet(game.playerBullets[i]);
					game.yinxiao.load();
					game.yinxiao.play();
				}
			}	
		}

		//goDie 出下边界或者撞自机
		if(this.y>game.canvas2.height+enemyTypes[this.type].height/2){
			this.goDie();
		}
		if(Math.abs(this.x-game.player.x)<enemyTypes[this.type].width/2+game.player.pandingR&&Math.abs(this.y-game.player.y)<enemyTypes[this.type].height/2+game.player.pandingR){
			this.goDie();
			game.player.miss();
			game.player.reStart();
		}

	};
	Enemy.prototype.moveTo=function(x,y,f){
		this.f=game.frame+f;
		
		this.dx=(x-this.x)/f;
		this.dy=(y-this.y)/f;

	};
	Enemy.prototype.goDie=function(){
		game.deleteEnemy(this);

	};
})();