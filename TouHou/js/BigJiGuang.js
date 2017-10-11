(function(){
	var BigJiGuang=window.BigJiGuang=function(x,y,direction,maxWidth){
		this.x=x;
		this.y=y;
		this.direction=direction;
		this.width=10;
		this.dWidth=1;
		this.height=700;
		this.maxWidth=maxWidth;

		game.bigJiGuangs=this;
	};
	BigJiGuang.prototype.render=function(){
		game.ctx2.save();
		game.ctx2.translate(this.x,this.y);
		game.ctx2.rotate(this.direction);
		game.ctx2.globalAlpha=0.3;
		game.ctx2.drawImage(game.images["player01b"],0,0,256,128,-100,-this.width/2,this.height,this.width);
		game.ctx2.rotate(-Math.PI/2);
		game.ctx2.drawImage(game.images["bullet1"],240,1,16,14,-(this.width-20)/2,0,(this.width-20),this.height);
		game.ctx2.drawImage(game.images["bullet1"],240,1,16,14,-(this.width-20)/2,0,(this.width-20),this.height);
		game.ctx2.drawImage(game.images["bullet1"],240,1,16,14,-(this.width-20)/2,0,(this.width-20),this.height);
		game.ctx2.drawImage(game.images["bullet1"],240,1,16,14,-(this.width-20)/2,0,(this.width-20),this.height);
		game.ctx2.drawImage(game.images["bullet1"],240,1,16,14,-(this.width-20)/2,0,(this.width-20),this.height);
		game.ctx2.drawImage(game.images["bullet1"],240,1,16,14,-(this.width-20)/2,0,(this.width-20),this.height);
		game.ctx2.drawImage(game.images["bullet1"],240,1,16,14,-(this.width-20)/2,0,(this.width-20),this.height);
		game.ctx2.drawImage(game.images["bullet1"],240,1,16,14,-(this.width-10)/2,0,(this.width-10),this.height);
		game.ctx2.drawImage(game.images["bullet1"],240,1,16,14,-this.width/2,0,this.width,this.height);
	
		
		
		game.ctx2.restore();
	};
	BigJiGuang.prototype.update=function(){
		if(this.width>this.maxWidth){
			this.dWidth=-10;
		}
		this.width+=this.dWidth;
		if(this.width==50&&this.dWidth>0) game.zhenPing();
		if(this.width == this.maxWidth){
			game.stopZhenPing();
		}
		if(this.dWidth<0&&this.width<10){
			
			game.bigJiGuangs=null;
		}
		if(this.width>50){
			!game.player.wuDi && this.check();
		}
	};
	BigJiGuang.prototype.check=function(){
		var dj=Math.atan2(game.player.y-this.y,game.player.x-this.x);

		var djiao=dj-this.direction;
		var ds = Math.pow(Math.pow(game.player.x-this.x,2)+Math.pow(game.player.y-this.y,2),1/2);

		if(Math.abs(ds*Math.sin(djiao))<this.width*0.4){
			game.player.miss();
			game.player.reStart();
			
		}



	};


})();