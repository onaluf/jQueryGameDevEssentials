var enemies = [];
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
        offsetx: 86
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
        offsetx: 138
    }),

}
    
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
        gf.setAnimation(div, anim.walk, true);
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

$(function() {
    gf.initialize({baseDiv: $("#mygame")});
    
    var levels = [
        {tiles: "level1.json", enemies: "level1.js"},
        {tiles: "level2.json", enemies: "level2.js"},
        {tiles: "level3.json", enemies: "level1.js"},
        {tiles: "level4.json", enemies: "level1.js"}
    ];
    
    var currentLevel = 0;
    
    var loadNextLevel = function(group){
        var level = levels[currentLevel++];
        // clear old level
        $("#level0").remove();
        $("#level1").remove();
        for(var i = 0; i < enemies.length; i++){
            enemies[i].div.remove();
        }
        enemies = [];
        
        // create the new level
        
        // first the tiles
        gf.importTiled(level.tiles, group, "level");
        
        // then the enemies
        $.getScript(level.enemies);
        /*$.getScript(level.enemies)
            .done(function(script, textStatus) {
              console.log( textStatus );
            })
            .fail(function(jqxhr, settings, exception) {
                console.log("fuck: "+exception);
            });*/
        
        // finaly return the div holdoing the tilemap
        return $("#level1");
    }
    
    var playerAnim = {
        stand: new gf.animation({
            url: "player.png",
            offsetx: 75
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
            offsetx: 900
        })
    };
    
    var backgroundFrontAnim = new gf.animation({
        url: "background_front.png"
    });
    var backgroundBackAnim = new gf.animation({
        url: "background_back.png"
    });
                 
    var tilemap, container;
    
    var player = new (function(){
        var acceleration = 9;
        var speed = 20;
        var status = "stand";
        var horizontalMove = 0;
        
        this.update = function () {
            if(status == "dead"){
                var newY = gf.y(this.div) + 2;
                if(newY > 480 + 93 - 100){
                    gf.x(this.div, 0);
                    gf.y(this.div, 0);
                    status = "stand";
                    gf.setAnimation(this.div, playerAnim.jump);
                } else {
                    gf.y(this.div, newY);
                }
                
            } else if (status == "finished") {
                tilemap         = loadNextLevel(group);
                gf.x(this.div, 0);
                gf.y(this.div, 0);
                status = "stand";
                gf.setAnimation(this.div, playerAnim.jump);
                
            } else {
                var delta = 30;
                speed = Math.min(100,Math.max(-100,speed + acceleration * delta / 100.0)); 
                var newY = gf.y(this.div) + speed * delta / 100.0;
                var newX = gf.x(this.div) + horizontalMove;
                var newW = gf.w(this.div);
                var newH = gf.h(this.div);            
                
                var collisions = gf.tilemapCollide(tilemap, {x: newX, y: newY, width: newW, height: newH});
                var i = 0;
                while (i < collisions.length > 0) {
                    var collision = collisions[i];
                    i++;
                    var collisionBox = {
                        x1: collision.x,
                        y1: collision.y,
                        x2: collision.x + collision.width,
                        y2: collision.y + collision.height
                    };
    
                    // react differently to each kind of tile
                    switch (collision.type) {
                        case 1:
                            // collision tiles
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
                            break;
                        case 2:
                            // deadly tiles
                            // collision tiles
                            var y = gf.intersect(newY, newY + newH, collisionBox.y1,collisionBox.y2);
                            var diffy = (y[0] === newY)? y[0]-y[1] : y[1]-y[0];
                            if(diffy > 40){
                                status = "dead";
                            }
                            break;
                        case 3: 
                            // end of level tiles
                            status = "finished"; 
                            break;
                    }
                    
                }
                if(newX < 0){
                    newX = 0;
                } /*else if (x > gf.w(tilemap)-gf.w(x)){
                    newX = gf.w(tilemap)-gf.w(x);
                }*/
                gf.x(this.div, newX);
                gf.y(this.div, newY);
                horizontalMove = 0;
            }
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
    
    
    var initialize = function() {
        $("#mygame").append("<div id='container' style='display: none; width: 640px; height: 480px;'>");
        container       = $("#container");
        backgroundBack  = gf.addSprite(container,"backgroundBack",{width: 640, height: 480});
        backgroundFront = gf.addSprite(container,"backgroundFront",{width: 640, height: 480});
        group           = gf.addGroup(container,"group");
        
        tilemap         = loadNextLevel(group);
        
        player.div      = gf.addSprite(group,"player",{width: 74, height: 93});
		
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
        
        
        var margin = {x: 200, y: (600-192)/2}; 
        var playerPos = {x: gf.x(player.div), y: gf.y(player.div)};
        
        var offset = margin.x-Math.min(Math.max(playerPos.x, margin.x), gf.w(tilemap)-640+margin.x); 
        gf.x(group, offset);
        $("#backgroundFront").css("background-position",""+(offset * 0.66)+"px 0px");
        $("#backgroundBack").css("background-position",""+(offset * 0.33)+"px 0px");
    };
    gf.addCallback(gameLoop, 30);
    
    $("#startButton").click(function() {
        gf.startGame(initialize);
    });
});