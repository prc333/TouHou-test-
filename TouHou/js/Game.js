(function(){
	var Game=window.Game=function(){
		this.init();
		this.state="标题";//“标题”、“游戏”
		this.nanDu=1;//1,2,3
		this.frame=0;
		this.time=0;
		this.images={};
		this.loadImages();
		this.controlL=0;
		this.controlR=0;
		this.controlU=0;
		this.controlD=0;
		this.controlS=0;
		this.controlZ=0;
		this.playerBullets=[];
		this.enemys=[];
		this.enemyBullets=[];
		this.isZhenPing=false;
		this.bigJiGuangs=null;
		
	};
	Game.prototype.init=function(){
		this.canvas1=document.createElement("canvas");
		this.canvas2=document.createElement("canvas");
		this.canvas3=document.createElement("canvas");
		this.canvas4=document.createElement("canvas");
		this.canvas1.id="bg";
		this.canvas2.id="actor";
		this.canvas3.id="jiemian";
		this.canvas4.id="shuju";
		this.canvas1.width="512";
		this.canvas1.height="650";
		this.canvas2.width="512";
		this.canvas2.height="650";
		this.canvas3.width="512";
		this.canvas3.height="650";
		this.canvas4.width="250";
		this.canvas4.height="350";
		document.getElementById("app").appendChild(this.canvas1);
		document.getElementById("app").appendChild(this.canvas2);
		document.getElementById("app").appendChild(this.canvas3);
		document.getElementById("app").appendChild(this.canvas4);
		this.ctx1=this.canvas1.getContext("2d");
		this.ctx2=this.canvas2.getContext("2d");
		this.ctx3=this.canvas3.getContext("2d");
		this.ctx4=this.canvas4.getContext("2d");
		//audio
		this.biu=document.createElement("audio");
		this.biu.src="audio/biu.wav";
		document.getElementById("app").appendChild(this.biu);
		this.bgm=document.createElement("audio");
		this.bgm.src="audio/biaoti.mp3";
		this.bgm.setAttribute("loop", "loop");
		document.getElementById("app").appendChild(this.bgm);
		this.bgm.load();
		this.bgm.play();
		this.yinxiao=document.createElement("audio");
		this.yinxiao.src="audio/enemydie.wav";
		document.getElementById("app").appendChild(this.yinxiao);
		
		//title
		this.title=document.createElement("h3");
		this.title.className="title";
		this.title.innerHTML="东方project（仿）";
		document.getElementById("app").appendChild(this.title);
	};
	Game.prototype.loadImages=function(){
		var self=this;
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if(xhr.status>=200&&xhr.status<300||xhr.status==304){
					var obj=JSON.parse(xhr.responseText);
					var alr=0,all=obj.images.length;
					var image={};
					for(var i=0;i<all;i++){
						(function(i){
							image[i]=new Image();
							image[i].src=obj.images[i].src;
							image[i].onload=function(){
								alr++;
								self.images[obj.images[i].name]=image[i];
								if(alr == all){
									game.ctx3.clearRect(0,0,game.canvas3.width,game.canvas3.height);
									game.ctx3.fillStyle="#fff";
									game.ctx3.fillText("加载图片完成："+alr+"/"+all,200,200);
									game.run();
								}else{
									game.ctx3.clearRect(0,0,game.canvas3.width,game.canvas3.height);
									game.ctx3.fillStyle="#fff";
									game.ctx3.fillText("正在加载图片："+alr+"/"+all,200,200);
								}
							};
						})(i);
					}
				}
			}
		};
		xhr.open("get","loadJson.txt?x="+Math.random(),true);
		xhr.send(null);
	};
	Game.prototype.run=function(){
		var self=this;
		this.player=new Player();
		this.background=new Background();
		this.boss=null;
		this.gengXinCeMianBan();
		this.bindEvent();
		
		this.timer=requestAnimationFrame(self.mainLoop);
	};
	Game.prototype.mainLoop=function(){

		game.timer=requestAnimationFrame(game.mainLoop);
		

		
		//判断状态
		if(game.state == "标题"){

			game.ctx3.clearRect(0,0,game.canvas3.width,game.canvas3.height);
			game.ctx2.clearRect(0,0,game.canvas3.width,game.canvas3.height);
			game.ctx1.clearRect(0,0,game.canvas3.width,game.canvas3.height);
			game.ctx3.font="30px 微软雅黑";
			game.ctx3.fillStyle= game.nanDu==1?"#fff":"#888";
			game.ctx3.fillText("简单",200,200);
			game.ctx3.fillStyle= game.nanDu==2?"#fff":"#888";
			game.ctx3.fillText("普通",200,300);
			game.ctx3.fillStyle= game.nanDu==3?"#fff":"#888";
			game.ctx3.fillText("困难",200,400);

		}else if(game.state=="游戏"){
			//
			if(game.frame==0){
				game.bgm.src="audio/stage01.mp3";
				game.bgm.load();
				game.bgm.play();
			}
			//帧编号
			game.frame++;
			//时间
			game.frame%60==0 && game.time++;
			//清屏
			game.ctx2.clearRect(0,0,game.canvas2.width,game.canvas2.height);
			game.ctx1.clearRect(0,0,game.canvas2.width,game.canvas2.height);
			//control
			if(game.controlS==1){
				game.player.speedSlow();
			}else{
				game.player.speedNormal();
			}
			game.player.changTai();
			game.controlL && game.player.goLeft();
			game.controlR && game.player.goRight();
			game.controlU && game.player.goUp();
			game.controlD && game.player.goDown();
			//background
			game.background.update();
			game.background.render();
			//boss
			if(game.boss){
				game.boss.update();
				game.boss&&game.boss.render();
			}
			//player
			game.player.update();
			if(/*测试0&&*/game.player.wuDi && !game.player.isBoom){
				game.frame%10==0 && game.player.render();
			}else{
				game.player.render();
			}
			//bigjiguang
			game.bigJiGuangs && game.bigJiGuangs.update();
			game.bigJiGuangs && game.bigJiGuangs.render();

			//progress
			game.progress();
			//bullets
			for(var i=0;i<game.playerBullets.length;i++){
				game.playerBullets[i].update();
				game.playerBullets[i] && game.playerBullets[i].render();
			}
			for(var i=0;i<game.enemyBullets.length;i++){
				game.enemyBullets[i].update();
				game.enemyBullets[i] && game.enemyBullets[i].render();
			}

			//enemys
			for(var i=0;i<game.enemys.length;i++){
				game.enemys[i].update();
				game.enemys[i] && game.enemys[i].render();
			}
			
			//震屏
			game.isZhenPing && game.zhenPingFun();


		}



	};
	Game.prototype.bindEvent=function(){
		var self=this;
		document.onkeydown=function(event){
			if(self.state == "标题"){
				if(event.keyCode == 38){
					self.nanDu-=1;
					if(self.nanDu<1){
						self.nanDu=3;
					}
				}else if(event.keyCode==40){
					self.nanDu+=1;
					if(self.nanDu>3){
						self.nanDu=1;
					}
				}else if(event.keyCode==13){
					self.state="游戏";
					game.canvas3.style.display="none";
					game.gengXinCeMianBan();
				}
			}else if(self.state=="游戏"){
				// console.log(event.keyCode)
				if(event.keyCode == 37){
					game.controlL=1;
				}
				if(event.keyCode==38){
					game.controlU=1;
				}
				if(event.keyCode==39){
					game.controlR=1;
				}
				if(event.keyCode==40){
					game.controlD=1;
				}
				if(event.keyCode==16){
					game.controlS=1;
				}
				if(event.keyCode==90){
					game.controlZ=1;
				}
				if(event.keyCode==88 && !game.player.isBoom){
					game.player.baozha();
				}
			}
		};
		document.onkeyup=function(event){
			if(self.state=="游戏"){
				
				if(event.keyCode == 37){
					game.controlL=0;
				}
				if(event.keyCode==38){
					game.controlU=0;
				}
				if(event.keyCode==39){
					game.controlR=0;
				}
				if(event.keyCode==40){
					game.controlD=0;
				}
				if(event.keyCode==16){
					game.controlS=0;
				}
				if(event.keyCode==90){
					game.controlZ=0;
				}
			}
		};
	};
	Game.prototype.deletePlayerBullet=function(o){
		for(var i=game.playerBullets.length;i>=0;i--){
			if(game.playerBullets[i]===o){
				game.playerBullets.splice(i,1)
			}
		}
	};
	Game.prototype.deleteEnemyBullet=function(o){
		for(var i=game.enemyBullets.length;i>=0;i--){
			if(game.enemyBullets[i]===o){
				game.enemyBullets.splice(i,1)
			}
		}
	};
	Game.prototype.deleteEnemy=function(o){
		for(var i=game.enemys.length;i>=0;i--){
			if(game.enemys[i]===o){
				game.enemys.splice(i,1)
			}
		}
	};
	Game.prototype.progress=function(){
		if(game.frame == 180){
			for(var i=0;i<2*game.nanDu;i++){

				var x1=new Enemy(game.canvas2.width/(2*game.nanDu+1)*(i+1),-100,"type1");
				x1.moveTo(game.canvas2.width/(2*game.nanDu+1)*(i+1),100,100);
			}
			
		}
		if(game.frame == 480){
			for(var i=0;i<1*game.nanDu;i++){
				var x1=new Enemy(-200+50*(i+1),100,"type2");
				x1.moveTo(game.canvas2.width/2+50*(i+1),150,100);
			}
			for(var i=0;i<1*game.nanDu;i++){
				var x2=new Enemy(game.canvas2.width+200+50*(i+1),100,"type2");
				x2.moveTo(50*(i+1),150,100);
			}
			
		}
		if(game.frame == 780){
			for(var i=0;i<2*game.nanDu;i++){

				var x1=new Enemy(game.canvas2.width/(2*game.nanDu+1)*(i+1),-100,"type3");
				x1.moveTo(game.canvas2.width/(2*game.nanDu+1)*(i+1),100,100);
			}
		}
		if(game.frame == 1080){
			for(var i=0;i<3*game.nanDu;i++){
				var x1 = new Enemy(game.canvas2.width+game.canvas2.width/(3*game.nanDu+1)*(i+1),120,"type4");
				x1.moveTo(game.canvas2.width/(3*game.nanDu+1)*(i+1),120,100);
			}
		}
		if(game.frame == 1680){
			game.background.changeTu("stg4bg");
			game.bgm.src="audio/molisha.mp3";
			game.bgm.load();
			game.bgm.play();
			game.boss = new Boss(game.canvas2.width+100,-100,"魔理沙");
			game.boss.moveTo(game.canvas2.width/2,200,150);
		}
	};
	//更新侧面板数据
	Game.prototype.gengXinCeMianBan=function(){
		this.ctx4.clearRect(0,0,this.canvas4.width,this.canvas4.height);
		this.ctx4.fillStyle="#fff";
		this.ctx4.font="20px 微软雅黑";
		this.ctx4.fillText("人命:",20,50);
		for(var i=0;i<game.player.ming;i++){
			this.ctx4.drawImage(this.images.item,32,0,32,32,20+(i%5)*32,60+parseInt(i/5)*32,32,32);
		}
		this.ctx4.fillText("符卡:",20,150);
		for(var i=0;i<game.player.boom;i++){
			this.ctx4.drawImage(this.images.item,96,0,32,32,20+(i%5)*32,160+parseInt(i/5)*32,32,32);
		}
	};
	Game.prototype.qingLing=function(){
		this.state="标题";//“标题”、“游戏”
		this.nanDu=1;//1,2,3
		this.frame=0;
		this.time=0;
		this.controlL=0;
		this.controlR=0;
		this.controlU=0;
		this.controlD=0;
		this.controlS=0;
		this.controlZ=0;
		this.playerBullets=[];
		this.enemys=[];
		this.enemyBullets=[];
		this.boss=null;
		this.isZhenPing=false;
		this.bigJiGuangs=null;

		this.bgm.src="audio/biaoti.mp3";
		this.bgm.load();
		this.bgm.play();
	};
	Game.prototype.zhenPing=function(){
		game.isZhenPing=true;
		game.zhenPing_x=0;
		game.zhenPing_dx=2;
	};
	Game.prototype.zhenPingFun=function(){
		if(game.zhenPing_x>5){
			game.zhenPing_dx=-2;
		}
		if(game.zhenPing_x<-5){
			game.zhenPing_dx=2;
		}
		game.zhenPing_x+=game.zhenPing_dx;
		game.canvas2.style.left=game.zhenPing_x+"px";
	};
	Game.prototype.stopZhenPing=function(){
		game.isZhenPing=false;
		game.canvas2.style.left=0;
	};

})();