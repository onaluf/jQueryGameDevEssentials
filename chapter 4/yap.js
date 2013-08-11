$(function() {
    var playerAnim = {
        stand: new gf.animation({
            url: "player.png",
            offset: 75
        }),
        walk:  new gf.animation({
            url:    "player.png",
            offset: 150,
            width:  75, 
            numberOfFrames: 10,
            rate: 90
        }),
        jump:  new gf.animation({
            url: "player.png",
            offset: 900
        })
    };
    var slimeAnim = {
    	stand: new gf.animation({
            url: "slime.png"
        }),
        walk: new gf.animation({
            url: "slime.png",
            width:  43, 
            numberOfFrames: 2,
            rate: 90
        }),
        dead: new gf.animation({
            url: "slime.png",
            offset: 86
        }),
    
    }
    var flyAnim = {
    	stand: new gf.animation({
            url: "fly.png"
        }),
        walk: new gf.animation({
            url: "fly.png",
            width:  69, 
            numberOfFrames: 2,
            rate: 90
        }),
        dead: new gf.animation({
            url: "fly.png",
            offset: 138
        }),
    
    }
    var tiles = [
        new gf.animation({
            url: "tiles.png"
        }),
        new gf.animation({
            url: "tiles.png",
            offset: 70
        }),
        new gf.animation({
            url: "tiles.png",
            offset: 140
        }),
        new gf.animation({
            url: "tiles.png",
            offset: 210
        }),
        new gf.animation({
            url: "tiles.png",
            offset: 280
        }),
        new gf.animation({
            url: "tiles.png",
            offset: 350
        }),
        new gf.animation({
            url: "tiles.png",
            offset: 490
        }),
    ];
    
    var backgroundFrontAnim = new gf.animation({
        url: "background_front.png"
    });
    var backgroundBackAnim = new gf.animation({
        url: "background_back.png"
    });

    var level = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 2, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7],
                 [5, 5, 5, 5, 5, 6, 6, 5, 5, 5, 5, 6, 6, 6, 5, 5, 5, 6, 6, 5, 5, 5, 5, 5, 5, 5, 6, 6, 5, 5, 5, 5, 6, 6, 6, 5, 5, 5, 6, 6, 5, 5]];
                 
    var tilemap, container;
    
    var player = new (function(){
        var acceleration = 9;
        var speed = 20;
        var status = "stand";
        var horizontalMove = 0;
        
        this.update = function () {
        	var delta = 30;
            speed = Math.min(100,Math.max(-100,speed + acceleration * delta / 100.0)); 
            var newY = gf.y(this.div) + speed * delta / 100.0;
            var newX = gf.x(this.div) + horizontalMove;
            var newW = gf.width(this.div);
            var newH = gf.height(this.div);            
            
            var collisions = gf.tilemapCollide(tilemap, {x: newX, y: newY, width: newW, height: newH});
            var i = 0;
            while (i < collisions.length > 0) {
                var collision = collisions[i];
                i++;
                var collisionBox = {
                    x1: gf.x(collision),
                    y1: gf.y(collision),
                    x2: gf.x(collision) + gf.width(collision),
                    y2: gf.y(collision) + gf.height(collision)
                };
                
                var x = gf.intersect(newX, newX + newW, collisionBox.x1,collisionBox.x2);
                var y = gf.intersect(newY, newY + newH, collisionBox.y1,collisionBox.y2);
                
                var diffx = (x[0] === newX)? x[0]-x[1] : x[1]-x[0];
                var diffy = (y[0] === newY)? y[0]-y[1] : y[1]-y[0];
                if (Math.abs(diffx) > Math.abs(diffy)){
                    // displace along the y axis
                     newY -= diffy;
                     speed = 0;
                     if(status=="jump" && diffy > 0){
                         status="stand";
                         gf.setAnimation(this.div, playerAnim.stand);
                     }
                } else {
                    // displace along the x axis
                    newX -= diffx;
                }
                //collisions = gf.tilemapCollide(tilemap, {x: newX, y: newY, width: newW, height: newH});
            }
            gf.x(this.div, newX);
            gf.y(this.div, newY);
            horizontalMove = 0;
        };
        
        this.left = function (){
            switch (status) {
                case "stand":
                    gf.setAnimation(this.div, playerAnim.walk, true);
                    status = "walk";
                    horizontalMove -= 7;
                    break;
                case "jump":
                    horizontalMove -= 5;
                    break;
                case "walk":
                    horizontalMove -= 7;
                    break;
            }
            gf.transform(this.div, {flipH: true});
        };
        
        this.right = function (){
            switch (status) {
                case "stand":
                    gf.setAnimation(this.div, playerAnim.walk, true);
                    status = "walk";
                    horizontalMove += 7;
                    break;
                case "jump":
                    horizontalMove += 5;
                    break;
                case "walk":
                    horizontalMove += 7;
                    break;
            }
            gf.transform(this.div, {flipH: false});
        };
        
        this.jump  = function (){
            switch (status) {
                case "stand":
                case "walk":
                    status = "jump";
                    speed = -60;
                    gf.setAnimation(this.div, playerAnim.jump);
                    break;
            }
        };
        
        this.idle  = function (){
            switch (status) {
                case "walk":
                    status = "stand";
                    gf.setAnimation(this.div, playerAnim.stand);
                    break;
            }
        };
    });
    
    var Slime = function() {
    	
        this.init = function(div, x1, x2, anim) {
			this.div = div;
			this.x1 = x1;
			this.x2 = x2;
			this.anim = anim;
	    	this.direction = 1;
	    	this.speed     = 5;
	    	this.dead      = false;
	    	
	    	gf.transform(div, {flipH: true});
	    	gf.setAnimation(div, anim.walk);
    	};
        
    	this.update = function(){
    		if(this.dead){
    			this.dies();
    		} else {
	    		var position = gf.x(this.div);
	    		if (position < this.x1){
	    			this.direction = 1;
	    			gf.transform(this.div, {flipH: true});
	    		}
	    		if (position > this.x2){
	    			this.direction = -1;
	    			gf.transform(this.div, {flipH: false});
	    		}
	    		gf.x(this.div, gf.x(this.div) + this.direction * this.speed);
    		}
    	}
    	this.kill = function(){
    		this.dead = true;
    		gf.setAnimation(this.div, this.anim.dead);
    	}
    	this.dies = function(){}
    };
    var Fly = function() {}
    Fly.prototype = new Slime();
    Fly.prototype.dies = function(){
		gf.y(this.div, gf.y(this.div) + 5);
	}
    
    var enemies = [];

    var initialize = function() {
        $("#mygame").append("<div id='container' style='display: none; width: 640px; height: 480px;'>");
        container       = $("#container");
        backgroundBack  = gf.addSprite(container,"backgroundBack",{width: 640, height: 480});
        backgroundFront = gf.addSprite(container,"backgroundFront",{width: 640, height: 480});
        group           = gf.addGroup(container,"group");
        tilemap         = gf.addTilemap(group, "level", {tileWidth: 70, tileHeight: 70, width: 42, height: 7, map: level, animations: tiles});
        player.div      = gf.addSprite(group,"player",{width: 74, height: 93});
		
		var fly1   = new Fly();
		fly1.init(
			gf.addSprite(group,"fly1",{width: 69, height: 31, x: 280, y: 220}),
			280, 490,
			flyAnim
		);
		enemies.push(fly1);
		
		var slime1 = new Slime();
		slime1.init(
			gf.addSprite(group,"slime1",{width: 43, height: 28, x: 980, y: 392}),
			980, 1140,
			slimeAnim
		);
		enemies.push(slime1);
		
		var slime2 = new Slime();
		slime2.init(
			gf.addSprite(group,"slime2",{width: 43, height: 28, x: 1960, y: 392}),
			1960, 2200,
			slimeAnim
		);
		enemies.push(slime2);

        gf.setAnimation(player.div, playerAnim.stand);
        gf.setAnimation(backgroundBack, backgroundBackAnim);
        gf.setAnimation(backgroundFront, backgroundFrontAnim);
        
        $("#startButton").remove();
        container.css("display", "block");
    }
    
    var gameLoop = function() {
        
        var idle = true;
        if(gf.keyboard[37]){ //left arrow
            player.left();
            idle = false;
        }
        if(gf.keyboard[38]){ //up arrow
            player.jump();
            idle = false;
        }
        if(gf.keyboard[39]){ //right arrow
            player.right();
            idle = false;
        }
        if(idle){
            player.idle();
        }
        
        player.update();
        for (var i = 0; i < enemies.length; i++){
        	enemies[i].update();
        	if (gf.spriteCollide(player.div, enemies[i].div)){
        		enemies[i].kill();
        	}
        }
        
        
        var margin = 200;
        var playerPos = gf.x(player.div);
        if(playerPos > 200) {
            gf.x(group, 200 - playerPos);
            $("#backgroundFront").css("background-position",""+(200 * 0.66 - playerPos * 0.66)+"px 0px");
            $("#backgroundBack").css("background-position",""+(200 * 0.33 - playerPos * 0.33)+"px 0px");
        }
    };
    gf.addCallback(gameLoop, 30);
    
    $("#startButton").click(function() {
        gf.startGame(initialize);
    });
});