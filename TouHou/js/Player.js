;(function(){
	var Player=window.Player=function(){
		this.x=200;
		this.y=400;
		this.width=32;
		this.height=48;
		this.pandingR=5;
		this.step=0;//0-7
		this.stateLCR=0;//0center,1left,2right
		this.speed=5;
		this.ming=3;//ming
		this.boom=3;//boom
		this.baoJiaoDu=0;
		this.isBoom=false;
		this.wuDi=true;//测试
		this.jiLuF=0;


		
	};
	Player.prototype.render=function(){
		// if(this.speed==1){
			
		// 	game.ctx2.drawImage(game.images.eff_sloweffect,64,0,64,64,this.x-32,this.y-32,64,64);
		// }
		if(this.isBoom){
			game.ctx2.save();
			game.ctx2.translate(this.x,this.y);
			game.ctx2.rotate(this.baoJiaoDu);
			game.ctx2.drawImage(game.images.etama4,-128,-128);
			game.ctx2.restore();
		}
		game.ctx2.drawImage(game.images.player,this.step*this.width,this.stateLCR*this.height,this.width,this.height,this.x-this.width/2,this.y-this.height/2,this.width,this.height);

		if(this.speed==1){
			game.ctx2.drawImage(game.images.eff_sloweffect,0,0,64,64,this.x-32,this.y-32,64,64);
			game.ctx2.drawImage(game.images.player,81,145,15,15,this.x-15,this.y-15-20,15,15);
			game.ctx2.drawImage(game.images.player,81,145,15,15,this.x,this.y-15-20,15,15);
			game.controlZ == 1 && game.frame % 10 ==0 && new Bullet(this.x-6,this.y-20,-Math.PI/2,"player");
			game.controlZ == 1 && game.frame % 10 ==0 && new Bullet(this.x+6,this.y-20,-Math.PI/2,"player");
		}else{
			game.ctx2.drawImage(game.images.player,81,145,15,15,this.x-35,this.y-7.5,15,15);
			game.ctx2.drawImage(game.images.player,81,145,15,15,this.x+20,this.y-7.5,15,15);
			game.controlZ == 1 && game.frame % 10 ==0 && new Bullet(this.x-20,this.y,-Math.PI/2,"player");
			game.controlZ == 1 && game.frame % 10 ==0 && new Bullet(this.x+20,this.y,-Math.PI/2,"player");
		}

	};	
	Player.prototype.update=function(){
		if(this.isBoom){
			this.baoJiaoDu+=0.02;
		}
		if(game.frame == this.jiLuF){
			this.wuDi=false;
			this.isBoom=false;
		}
		game.frame%10==0 && this.step++;
		if(this.stateLCR==0){
			if(this.step>7) this.step=0;
		}else{
			if(this.step>7) this.step=7;
		}
	};
	Player.prototype.speedSlow=function(){
		this.speed=1;
	};
	Player.prototype.speedNormal=function(){
		this.speed=5;
	};
	Player.prototype.goUp=function(){
		this.y-=this.speed;
		if(this.y<this.height/2){
			this.y=this.height/2;
		}
	};
	Player.prototype.goDown=function(){
		this.y+=this.speed;
		if(this.y>game.canvas2.height-this.height/2){
			this.y=game.canvas2.height-this.height/2;
		}
	};
	Player.prototype.goLeft=function(){
		this.x-=this.speed;
		this.stateLCR=1;
		if(this.x<this.width/2){
			this.x=this.width/2;
		}
	};
	Player.prototype.goRight=function(){
		this.x+=this.speed;
		this.stateLCR=2;
		if(this.x>game.canvas2.width-this.width/2){
			this.x=game.canvas2.width-this.width/2;
		}
	};
	Player.prototype.changTai=function(){
		
		this.stateLCR=0;
	};
	Player.prototype.miss=function(){
		this.ming--;
		this.boom=3;
		game.gengXinCeMianBan();
		game.biu.load();
		game.biu.play();
	};
	Player.prototype.reStart=function(){
		if(this.ming>=0){
			this.x=game.canvas2.width/2;
			this.y=game.canvas2.height-100;
			this.wuDi=true;
			this.jiLuF=game.frame+180;
			game.enemyBullets=[];
			
		}else{
			game.state="标题";
			game.canvas3.style.display="block";
			game.qingLing();
			game.player.qingLing();
			game.ctx4.clearRect(0,0,game.canvas4.width,game.canvas4.height);
		}
		
	};
	Player.prototype.baozha=function(){
		if(this.boom <=0 ) return;
		this.boom--;
		game.gengXinCeMianBan();
		game.enemyBullets=[];
		this.wuDi=true;
		this.jiLuF=game.frame+180;
		this.isBoom=true;
		this.baoJiaoDu=0;
	};
	Player.prototype.qingLing=function(){
		this.x=200;
		this.y=400;
		this.step=0;//0-7
		this.stateLCR=0;//0center,1left,2right
		this.speed=5;
		this.ming=3;//ming
		this.boom=3;//boom
		this.baoJiaoDu=0;
		this.isBoom=false;
		this.wuDi=false;
		this.jiLuF=0;
	};


})();