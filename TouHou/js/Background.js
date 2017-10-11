(function(){

	var Background=window.Background=function(){
		this.stage="bg1_2";//舞台
		this.y=game.canvas1.height-256;
		this.speed=5;
	};
	Background.prototype.render=function(){
		
		for(var i=0;i<6;i++){
	    	game.ctx1.drawImage(game.images[this.stage],0,0,256,256,0,this.y-256*i,256,256);
	    	game.ctx1.drawImage(game.images[this.stage],0,0,256,256,256,this.y-256*i,256,256);
	    	game.ctx1.drawImage(game.images[this.stage],0,0,256,256,256,this.y-256*i,256,256);
		}
	    
	 
	}
	Background.prototype.update=function(){
		this.y+=this.speed;
		if(this.y>=game.canvas1.height-256+3*256){
			this.y=game.canvas1.height-256;
		}
	};
	Background.prototype.changeTu=function(name){
		this.stage=name;
	};

})();