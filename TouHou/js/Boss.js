(function(){
	var bossType={
		"魔理沙":{
			"daTu":"face_st04b",
			"xiaoTu":"stg4benm",
			"faSheBg":"eff04_b",
			"width":64,
			"height":85,
			"pandingR":55,
			"y":0,
			"圆环角度":0
		}
	};
	var Boss=window.Boss=function(x,y,type){
		this.x=x;
		this.y=y;
		this.frame=0;
		this.isMove=false;
		this.faShe=false;
		this.step=0;//0-8
		this.type=type;
		this.data=bossType[this.type];
		this.bulletDirection=0;

		this.f=0;
		this.dx=0;
		this.dy=0;
	};
	Boss.prototype.render=function(){
		if(this.faShe){
			if(this.type== "魔理沙"){
				//背景
				game.ctx1.drawImage(game.images[this.data.faSheBg],0,0,255,255,0,0,game.canvas2.width,game.canvas2.height);
				for(var i=0;i<6;i++){
			    	game.ctx1.drawImage(game.images["eff04_bb"],0,0,256,256,0,bossType["魔理沙"].y+256*i,256,256);
			    	game.ctx1.drawImage(game.images["eff04_bb"],0,0,256,256,256,bossType["魔理沙"].y+256*i,256,256);	
				}
				//圆环
				for(var i=0;i<6.28;i+=0.1){
					game.ctx1.save();
					game.ctx1.translate(this.x,this.y);
					game.ctx1.rotate(this.data["圆环角度"]+i);
					game.ctx1.translate(200,0);
					game.ctx1.drawImage(game.images["etama3"],32,0,15,24,-7.5,-12,30,24);
					game.ctx1.restore();
				}
				//

			}
		}
		game.ctx2.drawImage(game.images[this.data.xiaoTu],(this.step%4)*this.data.width,parseInt(this.step/4)*this.data.height,this.data.width,this.data.height,this.x-this.data.width/2,this.y-this.data.height/2,this.data.width,this.data.height);

	};
	Boss.prototype.update=function(){
		this.frame++;

		if(this.isMove){
			game.frame % 20 == 0 && (this.step = (++this.step)%4 +4);
			if(this.f>0){
				this.x+=this.dx;
				this.y+=this.dy;
				this.f--;
			}else{
				this.isMove=false;
			}
		}else{
			game.frame % 20 == 0 && (this.step = (++this.step)%4);
		}
		if(this.type == "魔理沙"){
			if(this.faShe){
				bossType["魔理沙"].y--;
				if(bossType["魔理沙"].y<-3*256){
					bossType["魔理沙"].y=0;
				}
				bossType["魔理沙"]["圆环角度"]-=10;
			}
			//子弹发射控制
			//第一阶段
			this.frame == 200 && (this.faShe = true);
			if(this.frame >= 200 && this.frame <1400){
				this.bulletDirection-=0.01;
				var dt= game.nanDu == "简单"? 15:10;
				for(var i=0;i<6.28;i+=1.26){
					(this.frame%dt == 0 && this.frame%(dt*2)!=0) && new Bullet(this.x,this.y,this.bulletDirection+i,"红星大");
					(this.frame%dt == 0 && this.frame%(dt*2) ==0) && new Bullet(this.x,this.y,this.bulletDirection+i,"蓝星大");
				}
				for(var i=0;i<10*game.nanDu;i++){
					this.frame%(dt*20)==0 && new Bullet(30*Math.random(),Math.random()*game.canvas2.height,0.5,"黄星小");
					this.frame%(dt*20)==0 && new Bullet(game.canvas2.width-30*Math.random(),Math.random()*game.canvas2.height,Math.PI-0.5,"绿星小");
				}
			}
			this.frame == 1400 && (this.faShe = false);
			//第二阶段
			if(this.frame == 1540){
				this.moveTo(game.canvas2.width/2,game.canvas2.height/2,100);
				
			}
			this.frame == 1640 && (this.faShe = true);
			if(this.frame == 1641){
				var jiaoDu_s2=0;
				this.arr=["绿","黄","蓝","紫","红"];
				for(var i=0;i<40;i++){
					var x=this.x+100*Math.cos(jiaoDu_s2);
					var y=this.y+100*Math.sin(jiaoDu_s2);
					var fangxiang=Math.atan2(this.y-y,this.x-x);
					new Bullet(x,y,fangxiang,this.arr[parseInt(i/8)]+"星小");
					jiaoDu_s2+=2*Math.PI/40;
				}
				this.bulletDirection_s2=0;
			}
			if(this.frame >= 1640 && this.frame <2840){
				this.arr=["绿","黄","蓝","紫","红"];
				if(this.frame%30==0){
					this.bulletDirection_s2-=0.1;
					for(var i=0;i<6.28;i+=1.26){
						new Bullet(this.x,this.y,this.bulletDirection_s2+i,this.arr[parseInt(i/1.26)]+"星小");
						new Bullet(this.x,this.y,-this.bulletDirection_s2+i,this.arr[parseInt(i/1.26)]+"星小");
					}	
				}
				if(this.frame%100==0){
					var jiaoDu_s2=0;
					for(var i=0;i<40;i++){
						var x=this.x+100*Math.cos(jiaoDu_s2);
						var y=this.y+100*Math.sin(jiaoDu_s2);
						var fangxiang=Math.atan2(this.y-y,this.x-x);
						new Bullet(x,y,fangxiang,this.arr[parseInt(i/8)]+"星小");
						jiaoDu_s2+=2*Math.PI/40;
					}
				}
			}
			this.frame == 2840 && (this.faShe = false);
			if(this.frame == 2980){
				this.moveTo(game.canvas2.width/2,200,100);
			}
			//第三阶段
			this.frame == 3080 && (this.faShe = true);
			if(this.frame == 3080 ){
				(this.bulletDirection= 0);
				this.temp_s3=0;
			}
			if(this.frame>=3080 && this.frame<4280){
				if(this.frame%100==0 && this.frame%200!=0){
					var jiaodu=Math.atan2(game.player.y-this.y,game.player.x-this.x);
					this.arr=["红","黄","绿","紫","蓝"];
					for(var i=0;i<6.28;i+=1.26){
						
						new Bullet(this.x+300*Math.cos(jiaodu+0.5+i),this.y+300*Math.sin(jiaodu+0.5+i),jiaodu+0.5+i,"魔理沙的小激光"+this.arr[i/1.26],this.x,this.y,300,-0.01);	
					}	
				}
				if(this.frame%100==0 && this.frame%200==0){
					var jiaodu=Math.atan2(game.player.y-this.y,game.player.x-this.x);
					this.arr=["红","黄","绿","紫","蓝"];
					for(var i=0;i<6.28;i+=1.26){
						
						new Bullet(this.x+300*Math.cos(jiaodu-0.5+i),this.y+300*Math.sin(jiaodu-0.5+i),jiaodu-0.5+i,"魔理沙的小激光"+this.arr[i/1.26],this.x,this.y,300,0.01);	
					}	
				}

				if(this.frame%15==0 ){
					this.arr=["红","黄","绿","紫","蓝"];
					
					this.bulletDirection+=0.1;
					for(var i=0;i<6.28;i+=1.26){
						new Bullet(this.x,this.y,this.bulletDirection+i,this.arr[this.temp_s3]+"星大");
						new Bullet(this.x,this.y,-this.bulletDirection+i,this.arr[this.temp_s3]+"星大");
						
					}
					this.temp_s3= ++this.temp_s3%5;

				}
				if(this.frame%100==0){
					this.arr=["红","黄","绿","紫","蓝"];
					for(var i=0;i<6.28;i+=1.26){
						var _s3_x=100*Math.cos(i)+this.x;
						var _s3_y=100*Math.sin(i)+this.y;
						var jiaodu=Math.atan2(game.player.y-_s3_y,game.player.x-_s3_x);
						new Bullet(_s3_x,_s3_y,jiaodu,this.arr[parseInt(Math.random()*5)]+"星小");
					}
				}
			}
			this.frame == 4280 && (this.faShe = false);
			//第四阶段
			if(this.frame == 4520){
				this.moveTo(game.canvas2.width*0.618,100,100);
				this.temp_s4=0;
				this.tempj_s4=0;
			}
			this.frame == 4520 && (this.faShe = true);
			if(this.frame>=4520&&this.frame <= 5720){
				if(this.frame%400 == 0){
					var jiaodu_s4=Math.atan2(game.player.y-this.y,game.player.x-this.x);
					new BigJiGuang(this.x,this.y,jiaodu_s4,250);

				}
				if(this.frame%20==0){
					for(var i=0;i<10;i++){
						new Bullet(this.x,this.y,i*2*Math.PI/10,this.arr[this.temp_s4]+"星大")
					}
					
					new Bullet(this.x,this.y,this.tempj_s4,this.arr[this.temp_s4]+"星小")
					this.temp_s4= ++this.temp_s4%5;
					this.tempj_s4+=0.25;

				}

				if(this.frame == 5120){
					this.moveTo(this.x-100,this.y,100);
				}
			}
			
			this.frame == 5720 && (this.faShe = false);
			//第五阶段
			if(this.frame == 5920){
				this.moveTo(game.canvas2.width/2,200,100);
				this.tempJ_s4=0;
			}
			this.frame == 6020 && (this.faShe = true);
			if(this.frame>=6020 &&this.frame < 7220 ){
				if(this.frame%300 <= 200 &&this.frame%20==0){
					var dj=Math.atan2(game.player.y-this.y,game.player.x-this.x);
					new Bullet(this.x,this.y,dj,"黄星小");
					new Bullet(this.x,this.y,dj+0.1,"黄星小");
					new Bullet(this.x,this.y,dj-0.1,"黄星小");
				}
				if(/*this.frame%300 <= 200 &&*/this.frame%5==0){
					new Bullet(this.x,this.y,this.tempJ_s4,"黄星小");
					new Bullet(this.x,this.y,-this.tempJ_s4,"黄星小");
					this.tempJ_s4+=0.5;
					
				}
				if(this.frame%300 == 0){
					var dj=Math.atan2(game.player.y-this.y,game.player.x-this.x);
					new Bullet(this.x+300*Math.cos(dj+0.8),this.y+300*Math.sin(dj+0.8),dj+0.8,"魔理沙的小激光黄",this.x,this.y,300,-0.01);
					new Bullet(this.x+300*Math.cos(dj-0.8),this.y+300*Math.sin(dj-0.8),dj-0.8,"魔理沙的小激光黄",this.x,this.y,300,0.01);
				}
			}
			this.frame == 7220 && (this.faShe = false);
			//第六阶段
			this.frame == 7520 && (this.faShe = true);
			if(this.frame==7520){
				this.tempJ_s6=0;
			}
			if(this.frame>=7520&&this.frame<11120){
				if(this.frame%15==0&&this.frame%30!=0){
					for(var i=0;i<6;i++){
						new Bullet(this.x,this.y,this.tempJ_s6+i*2*Math.PI/6,"红星大")
					}
					this.tempJ_s6+=0.5;
				}
				if(this.frame%15==0&&this.frame%30==0){
					for(var i=0;i<6;i++){
						new Bullet(this.x,this.y,this.tempJ_s6+i*2*Math.PI/6,"蓝星大")
					}
					this.tempJ_s6+=0.5;
				}
				if(this.frame%600 == 0){
					var jiaodu_s6=Math.atan2(game.player.y-this.y,game.player.x-this.x);
					new BigJiGuang(this.x,this.y,jiaodu_s6,400);
				}

				if(this.frame ==8720 ){
					this.moveTo(this.x-100,this.y-100,100);
				}
				if(this.frame ==9920 ){
					this.moveTo(this.x+200,this.y,100);
				}
			}

			this.frame == 11120 && (this.faShe = false);
			if(this.frame>11420){
				game.ctx2.drawImage(game.images["face_st04b"],game.canvas2.width-256,0);
				game.ctx2.fillStyle="#fff";
				game.ctx2.font="30px 微软雅黑";
				game.ctx2.fillText("哇，第一次见到真么厉害的“人类”呢!",10,50);
			}
			if(this.frame == 12020){
				game.state="标题";
				game.canvas3.style.display="block";
				game.qingLing();
				game.player.qingLing();
				game.ctx4.clearRect(0,0,game.canvas4.width,game.canvas4.height);
			}
		}
	};
	Boss.prototype.moveTo=function(x,y,f){
		this.dx=(x-this.x)/f;
		this.dy=(y-this.y)/f;
		this.f=f;
		this.isMove=true;
	};


})();