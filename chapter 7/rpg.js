$(function() {
	var name;
	var initialPlayerPos = {};
	gf.initialize({baseDiv: $("#mygame"), width: 800, height: 600});
    
    // Manage account (login, create, continue)
    // configure buttons
    $("#login-create").click(function(e){
    	$("#login").hide(0);
    	$("#create").show(0);
    	e.preventDefault();;
    });
    $("#login-login").click(function(e){
    	$.getJSON(
    		"login.php",
    		{
    			name: $("#login-name").val(),
    			pw: $("#login-pw").val()
    		},
    		function(json,status){
    			if (json.success){
    				name = $("#login-name").val();
    				initialPlayerPos.x   = json.x;
	    			initialPlayerPos.y   = json.y
	    			initialPlayerPos.dir = json.dir;
    				gf.startGame(initialize);
    			} else {
    				alert("No such user or wrong password!");
    			    $("#login-pw").val("");
    			}
    		}
    	)
    	e.preventDefault();;
    });
    $("#session-continue").click(function(e){
    	gf.startGame(initialize);
    	e.preventDefault();;
    });
    $("#session-logout").click(function(e){
    	$.getJSON("logout.php");
    	$("#session").hide(0);
    	$("#login").show(0);
    	e.preventDefault();;
    });
    $("#create-cancel").click(function(e){
    	$("#create").hide(0);
    	$("#login").show(0);
    	e.preventDefault();;
    });
    $("#create-create").click(function(e){
    	$.getJSON(
    		"createUser.php",
    		{
    			name: $("#create-name").val(),
    			pw: $("#create-pw").val()
    		},
    		function(json,status){
    			if (json.success){
    				name = $("#create-name").val();
    				initialPlayerPos.x   = json.x;
	    			initialPlayerPos.y   = json.y
	    			initialPlayerPos.dir = json.dir;
    				$("#create").hide(0);
    				gf.startGame(initialize);
    			} else {
    				alert("Name already taken!");
    			}
    		}
    	)
    	e.preventDefault();;
    });
    
    // Probe session state
    $.getJSON(
    	"session.php",
    	function(json){
    		if(json.connected){
    			name = json.name;
    			initialPlayerPos.x   = json.x;
    			initialPlayerPos.y   = json.y
    			initialPlayerPos.dir = json.dir;
    			$("#session-name").html(name);
    			$("#session").show(0);
    		} else {
    			$("#login").show(0);
    		}
    	}
    );
    
    
    var playerAnim = {
        stand: {
            side: new gf.animation({
                      url: "player/platearmor.png",
                      offsety: 256
                  }),
            up:   new gf.animation({
                      url: "player/platearmor.png",
                      offsety: 640
                  }),
            down: new gf.animation({
                      url: "player/platearmor.png",
                      offsety: 1024
                  }),
        },
        walk: {
            side: new gf.animation({
                      url: "player/platearmor.png",
                      offsety: 128,
                      width:  128, 
                      numberOfFrames: 4,
                      rate: 150
                  }),
            up:   new gf.animation({
                      url: "player/platearmor.png",
                      offsety: 512,
                      width:  128, 
                      numberOfFrames: 4,
                      rate: 150
                  }),
            down: new gf.animation({
                      url: "player/platearmor.png",
                      offsety: 896,
                      width:  128, 
                      numberOfFrames: 4,
                      rate: 150
                  }),
        },
        strike: {
            side: new gf.animation({
                      url: "player/platearmor.png",
                      offsety: 0,
                      width:  128, 
                      numberOfFrames: 5,
                      rate: 60
                  }),
            up:   new gf.animation({
                      url: "player/platearmor.png",
                      offsety: 384,
                      width:  128, 
                      numberOfFrames: 5,
                      rate: 60
                  }),
            down: new gf.animation({
                      url: "player/platearmor.png",
                      offsety: 768,
                      width:  128, 
                      numberOfFrames: 5,
                      rate: 60
                  }),
        }
    };
    var weaponAnim = {
        stand: {
            side: new gf.animation({
                      url: "player/sword2.png",
                      offsety: 384
                  }),
            up:   new gf.animation({
                      url: "player/sword2.png",
                      offsety: 960
                  }),
            down: new gf.animation({
                      url: "player/sword2.png",
                      offsety: 1536
                  }),
        },
        walk: {
            side: new gf.animation({
                      url: "player/sword2.png",
                      offsety: 192,
                      width:  192, 
                      numberOfFrames: 4,
                      rate: 150
                  }),
            up:   new gf.animation({
                      url: "player/sword2.png",
                      offsety: 768,
                      width:  192, 
                      numberOfFrames: 4,
                      rate: 150
                  }),
            down: new gf.animation({
                      url: "player/sword2.png",
                      offsety: 1344,
                      width:  192, 
                      numberOfFrames: 4,
                      rate: 150
                  }),
        },
        strike: {
            side: new gf.animation({
                      url: "player/sword2.png",
                      offsety: 0,
                      width:  192, 
                      numberOfFrames: 5,
                      rate: 60
                  }),
            up:   new gf.animation({
                      url: "player/sword2.png",
                      offsety: 576,
                      width:  192, 
                      numberOfFrames: 5,
                      rate: 60
                  }),
            down: new gf.animation({
                      url: "player/sword2.png",
                      offsety: 1152,
                      width:  192, 
                      numberOfFrames: 5,
                      rate: 60
                  }),
        }
    };
    
    var skeletonAnim = {
        stand : {
            side: new gf.animation({
                      url: "enemies/skeleton2.png",
                      offsety: 384,
                      width:  192, 
                      numberOfFrames: 2,
                      rate: 600
                  }),
            up:   new gf.animation({
                      url: "enemies/skeleton2.png",
                      offsety: 960,
                      width:  192, 
                      numberOfFrames: 2,
                      rate: 600
                  }),
            down: new gf.animation({
                      url: "enemies/skeleton2.png",
                      offsety: 1536,
                      width:  192, 
                      numberOfFrames: 2,
                      rate: 600
                  }),
        },
        strike:{
            side: new gf.animation({
                      url: "enemies/skeleton2.png",
                      offsety: 0,
                      width:  192, 
                      numberOfFrames: 3,
                      rate: 60
                  }),
            up:   new gf.animation({
                      url: "enemies/skeleton2.png",
                      offsety: 576,
                      width:  192, 
                      numberOfFrames: 3,
                      rate: 60
                  }),
            down: new gf.animation({
                      url: "enemies/skeleton2.png",
                      offsety: 1152,
                      width:  192, 
                      numberOfFrames: 3,
                      rate: 60
                  }),
        }
    };
    var ogreAnim = {
        stand : {
            side: new gf.animation({
                      url: "enemies/ogre.png",
                      offsety: 384,
                      width:  192, 
                      numberOfFrames: 2,
                      rate: 600
                  }),
            up:   new gf.animation({
                      url: "enemies/ogre.png",
                      offsety: 960,
                      width:  192, 
                      numberOfFrames: 2,
                      rate: 600
                  }),
            down: new gf.animation({
                      url: "enemies/ogre.png",
                      offsety: 1536,
                      width:  192, 
                      numberOfFrames: 2,
                      rate: 600
                  }),
        },
        strike:{
            side: new gf.animation({
                      url: "enemies/ogre.png",
                      offsety: 0,
                      width:  192, 
                      numberOfFrames: 3,
                      rate: 60
                  }),
            up:   new gf.animation({
                      url: "enemies/ogre.png",
                      offsety: 576,
                      width:  192, 
                      numberOfFrames: 3,
                      rate: 60
                  }),
            down: new gf.animation({
                      url: "enemies/ogre.png",
                      offsety: 1152,
                      width:  192, 
                      numberOfFrames: 3,
                      rate: 60
                  }),
        }
    };
    
    var player = new (function(){
        // the group holding both the player sprite and the weapon
        this.div = $();
        // the sprite holding the player's avatar
        this.avatar = $();
        // the sprite holding the weapon
        this.weapon = $();
        // the hit zone
        this.hitzone  = $();
        // collision zone
        this.colzone = $();
        
        var moveX = 0;
        var moveY = 0;
        var state = "null";
        var orientation = "down";
        var interacted = false;
        
        this.getState = function(){
        	switch (state){
        		case "idle":
        			return 0;
        		case "walk":
        			return 1;
        		case "strike":
        			return 2;
        	    default:
                    return 0;
        	}
        };
        
        this.getOrientation = function(){
            switch (orientation){
                case "down":
                    return 0;
                case "up":
                    return 1;
                case "left":
                    return 2;
                default:
                    return 3; 
            }
        };
        
        this.update = function () {
            
            var newX = gf.x(this.div) + gf.x(this.colzone) + moveX;
            var newY = gf.y(this.div) + gf.y(this.colzone) + moveY;
            var newW = gf.w(this.colzone);
            var newH = gf.h(this.colzone);
            
            var collisions = gf.tilemapCollide($("#tiles2"), {x: newX, y: newY, width: newW, height: newH});
            var i = 0;
            while (i < collisions.length > 0) {
                var collision = collisions[i];
                i++;
                var collisionBox = {
                    x1: gf.x(collision),
                    y1: gf.y(collision),
                    x2: gf.x(collision) + gf.w(collision),
                    y2: gf.y(collision) + gf.h(collision)
                };
                
                var x = gf.intersect(newX, newX + newW, collisionBox.x1,collisionBox.x2);
                var y = gf.intersect(newY, newY + newH, collisionBox.y1,collisionBox.y2);
                
                var diffx = (x[0] === newX)? x[0]-x[1] : x[1]-x[0];
                var diffy = (y[0] === newY)? y[0]-y[1] : y[1]-y[0];
                if (Math.abs(diffx) > Math.abs(diffy)){
                    // displace along the y axis
                     newY -= diffy;
                     moveY -= diffy;
                     speed = 0;
                     if(status=="jump" && diffy > 0){
                         status="stand";
                         gf.setAnimation(this.div, playerAnim.stand);
                     }
                } else {
                    // displace along the x axis
                    newX -= diffx;
                    moveX -= diffx;
                }
            }
            
            var nextX = gf.x(this.div) + moveX;
            var nextY = gf.y(this.div) + moveY;
            
            if(nextX > 0){
                if(nextX > 1856){
                    nextX = 1856;
                }
            } else {
                nextX = 0;
            }
            gf.x(this.div, nextX);
            if(nextY > 0){
                if(nextY > 1856){
                    nextY = 1856;
                }
            } else {
                nextY = 0;
            }
			gf.y(this.div, nextY);
			this.div.css("z-index",nextY + 160);
            
            moveX = 0;
            moveY = 0;
        };
        
        this.left = function (){
            if(state !== "strike"){
                if(orientation !== "left" && moveY === 0 && moveX === 0){
                    orientation = "left";
                    gf.x(this.hitzone, 16);
                    gf.y(this.hitzone, 16);
                    gf.h(this.hitzone,  128 + 32);
                    gf.w(this.hitzone, 64);
                    gf.setAnimation(this.avatar, playerAnim.walk.side, true);
                    gf.setAnimation(this.weapon, weaponAnim.walk.side, true);
                    gf.transform(this.avatar, {flipH: true});
                    gf.transform(this.weapon, {flipH: true});
                    
                } else if(state !== "walk") {
                    state = "walk";
                    gf.setAnimation(this.avatar, playerAnim.walk.side, true);
                    gf.setAnimation(this.weapon, weaponAnim.walk.side, true);
                }
                if(state === "walk") {
                    moveX -= 3;
                }
            }
        };
        
        this.right = function (){
            if(state !== "strike"){
                if(orientation !== "right" && moveY === 0 && moveX === 0){
                    orientation = "right";
                    state = "walk";
                    gf.x(this.hitzone, 192-80);
                    gf.y(this.hitzone, 16);
                    gf.h(this.hitzone,  128 + 32);
                    gf.w(this.hitzone, 64);
                    gf.setAnimation(this.avatar, playerAnim.walk.side, true);
                    gf.setAnimation(this.weapon, weaponAnim.walk.side, true);
                    gf.transform(this.avatar, {flipH: false});
                    gf.transform(this.weapon, {flipH: false});
                    
                } else if(state !== "walk") {
                    state = "walk";
                    gf.setAnimation(this.avatar, playerAnim.walk.side, true);
                    gf.setAnimation(this.weapon, weaponAnim.walk.side, true);
                }
                if (state === "walk") {
                    moveX += 3;
                }
            }
        };
        
        this.up = function (){
            if(state !== "strike"){
                if(orientation !== "up" && moveY === 0 && moveX === 0) {
                    orientation = "up";
                    state = "walk";
                    gf.x(this.hitzone, 16);
                    gf.y(this.hitzone, 16);
                    gf.w(this.hitzone,  128 + 32);
                    gf.h(this.hitzone, 64);
                    gf.setAnimation(this.avatar, playerAnim.walk.up, true);
                    gf.setAnimation(this.weapon, weaponAnim.walk.up, true);
                    gf.transform(this.avatar, {flipH: false});
                    gf.transform(this.weapon, {flipH: false});
                    
                } else if(state !== "walk"){
                    state = "walk";
                    gf.setAnimation(this.avatar, playerAnim.walk.up, true);
                    gf.setAnimation(this.weapon, weaponAnim.walk.up, true);
                }
                if (state === "walk") {
                    moveY -= 3;
                }
            }
            
        };
        
        this.down = function (){
            if(state !== "strike"){
                if(orientation !== "down" && moveY === 0 && moveX === 0) {
                    orientation = "down";
                    state = "walk";
                    gf.x(this.hitzone, 16);
                    gf.y(this.hitzone, 192-80);
                    gf.w(this.hitzone,  128 + 32);
                    gf.h(this.hitzone, 64);
                    gf.setAnimation(this.avatar, playerAnim.walk.down, true);
                    gf.setAnimation(this.weapon, weaponAnim.walk.down, true);
                    gf.transform(this.avatar, {flipH: false});
                    gf.transform(this.weapon, {flipH: false});
                } else if(state !== "walk"){
                    state = "walk";
                    gf.setAnimation(this.avatar, playerAnim.walk.down, true);
                    gf.setAnimation(this.weapon, weaponAnim.walk.down, true);
                }
                if (state === "walk") {
                    moveY += 3;
                }
            }
        };
        
        this.strike = function (){
            if(state !== "strike"){
                state = "strike";
                interacted = false;
                switch(orientation) {
                    case "left":
                        gf.setAnimation(this.avatar, playerAnim.strike.side, false, function(){
                            state = "null"
                            player.idle();
                        });
                        gf.setAnimation(this.weapon, weaponAnim.strike.side);
                        break;
                    case "right":
                        gf.setAnimation(this.avatar, playerAnim.strike.side, false, function(){
                            state = "null"
                            player.idle();
                        });
                        gf.setAnimation(this.weapon, weaponAnim.strike.side);
                        break;
                    case "up":
                        gf.setAnimation(this.avatar, playerAnim.strike.up, false, function(){
                            state = "null"
                            player.idle();
                        });
                        gf.setAnimation(this.weapon, weaponAnim.strike.up);
                        break;
                    case "down":
                        gf.setAnimation(this.avatar, playerAnim.strike.down, false, function(){
                            state = "null"
                            player.idle();
                        });
                        gf.setAnimation(this.weapon, weaponAnim.strike.down);
                        break;
                }
            }
        };
        
        this.idle  = function (){
            if(state !== "idle" && state !== "strike"){
                state = "idle";
                
                switch(orientation) {
                    case "left":
                        gf.setAnimation(this.avatar, playerAnim.stand.side);
                        gf.setAnimation(this.weapon, weaponAnim.stand.side);
                        gf.transform(this.avatar, {flipH: true});
                        gf.transform(this.weapon, {flipH: true});
                        break;
                    case "right":
                        gf.setAnimation(this.avatar, playerAnim.stand.side);
                        gf.setAnimation(this.weapon, weaponAnim.stand.side);
                        gf.transform(this.avatar, {flipH: false});
                        gf.transform(this.weapon, {flipH: false});
                        break;
                    case "up":
                        gf.setAnimation(this.avatar, playerAnim.stand.up);
                        gf.setAnimation(this.weapon, weaponAnim.stand.up);
                        gf.transform(this.avatar, {flipH: false});
                        gf.transform(this.weapon, {flipH: false});
                        break;
                    case "down":
                        gf.setAnimation(this.avatar, playerAnim.stand.down);
                        gf.setAnimation(this.weapon, weaponAnim.stand.down);
                        gf.transform(this.avatar, {flipH: false});
                        gf.transform(this.weapon, {flipH: false});
                        break;
                }
            }
        };
        
        this.detectInteraction = function(npcs, enemies, console){
            if(state == "strike" && !interacted){
                for (var i = 0; i < npcs.length; i++){
                    if(gf.spriteCollide(this.hitzone, npcs[i].div)){
                        npcs[i].object.dialog();
                        interacted = true;
                        return;
                    }
                }
                for (var i = 0; i < enemies.length; i++){
                    if(gf.spriteCollide(this.hitzone, enemies[i])){
                        $.getJSON("fight.php",
                        	{ name : enemies[i].attr("id") },
                        	function(json){
                        		if (json.hit){
	                        		if (json.success){
	                        			if(json.killed){
	                        				console.html("You killed the enemy!");
	                        			} else {
	                        				console.html("You hit the enemy "+json.damage+"pt");
	                        			}
	                        		} else {
				                        console.html("The enemy countered your attack");
	                        		}
                        		}
                        	})
                        interacted = true;
                        return;
                    }
                }
            }
        };
    });
    
    var NPC = function(name, text, console){
        var current = 0;
        
        this.getText = function(){
            if(current === text.length){
                current = 0;
                return "[end]";
            }
            return name + ": " + text[current++];
        };
        
        this.dialog = function(){
            console.html(this.getText());
        }
    }
    
    var container, tiles, world, gameState, npcsGroup, enemiesGroup, console;
    var npcs    = [];                                              
    var enemies = [];
    var others  = [];
    
    var initialize = function() {
        $("#mygame").append("<div id='container' style='display: none; width: 800px; height: 600px;'>");
        container       = $("#container");
        
        // create the console
        container.append("<div id='console' style='font-family: \"Press Start 2P\", cursive; color: #fff; width: 770px; height: 20px; padding: 15px; position: absolute; bottom: 0; background: rgba(0,0,0,0.5); z-index: 3000'>");
        console = $("#console");
        // the group holding all the other stuff
        world           = gf.addGroup(container,"group",{
                            x: -(510-192)/2,
                            y: -(360-192)/2
                        });
        
        // Create the level
        tiles           = gf.addGroup(world,"tiles");
		gf.importTiled("level.json",tiles, "tiles");
		$("#tiles3").css("z-index", "2990");
        
        // Create the NPCs 
        npcsGroup       = gf.addGroup(world,"npcs");
        npcs.push({
            div: gf.addSprite(npcsGroup,"NPC1", {
                x:      800,
                y:      800,
                width:  96,
                height: 96
            }),
            object: new NPC("Dr. Where", ["Welcome to this small universe...","I hope you will enjoy it.","You should head east from here...","there's someone you may want to meet."], console)
        });
        npcs[npcs.length-1].object.div = npcs[npcs.length-1].div;
        gf.setAnimation(npcs[npcs.length-1].div, new gf.animation({
            url: "npc/scientist.png"
        }));
        $("#NPC1").css("z-index",800 + 96);
        npcs.push({
            div: gf.addSprite(npcsGroup,"NPC2", {
                x:      1800,
                y:      600,
                width:  96,
                height: 96
            }),
            object: new NPC("Junior",["Howdy lad! If you explore this country"," be carefull! There are monsters", "roaming around!"], console)
        });
        npcs[npcs.length-1].object.div = npcs[npcs.length-1].div;
        gf.setAnimation(npcs[npcs.length-1].div, new gf.animation({
            url: "npc/desertnpc.png"
        }));
        $("#NPC2").css("z-index",600 + 96);
        
        // Create the enemies
        enemiesGroup    = gf.addGroup(world,"enemies");
        
        // Create group for the other players 
        gf.addGroup(world,"others");
        
        // Create the player
        player.div      = gf.addGroup(world,"player", {
                            x: initialPlayerPos.x,
                            y: initialPlayerPos.y
                        });
        player.avatar   = gf.addSprite(player.div, "avatar", {
                            x:      (192-128)/2,
                            y:      (192-128)/2,
                            width:  128,
                            height: 128
                        });
        player.weapon   = gf.addSprite(player.div, "weapon", {
                            width:  192,
                            height: 192
                        });
        player.hitzone  = gf.addSprite(player.div, "hitzone", {
                            x:      16,
                            y:      192-80,
                            width:  128 + 32,
                            height: 64
                        });
        player.colzone  = gf.addSprite(player.div, "hitzone", {
                            x:      72,
                            y:      76,
                            width:  48,
                            height: 64
                        });
        
        player.idle();
		
		// Start game
		gameState = "walk";
        
        $(".screen").css("display", "none");
        //$("#startButton").remove();
        container.css("display", "block");
        
        // update server state
        var updateFunction  = function(){
	    	$.getJSON(
    			"update.php",
    			{
    				name: name, 
    				x: gf.x(player.div), 
    				y: gf.y(player.div),
    				dir: player.getOrientation(),
    				state: player.getState()
    			},
    			function(json,status){
    				
    				// Here we need to update the position of all the other players
    				var existingOthers = {};
    				var players = json.players
    				for (var i = 0; i < players.length; i++){
    					 var other = players[i];
    					 existingOthers["other_"+other.name] = true;
    					 var avatar, weapon;
    					 var div = $("#other_"+other.name);
    					 var created = false;
    					 if(div.size() > 0){
    					 	avatar = $("#other_"+other.name+"_avatar");
    					 	weapon = $("#other_"+other.name+"_weapon");
    					 	// update
    					 	gf.x(div, other.x);
    					 	gf.y(div, other.y);
    					 	div.css("z-index",other.y + 160);
    					 } else {
    					 	var created = true;
    					 	// create other players
    					 	div = gf.addGroup($("#others"), "other_"+other.name, {
    					 		x:      other.x,
    					 		y:      other.y
    					 	})
    					 	others.push( div );
    					 	div.css("z-index",other.y + 160);
    					 	avatar = gf.addSprite(div, "other_"+other.name+"_avatar", {
    					 		x:      (192-128)/2,
	                            y:      (192-128)/2,
	                            width:  128,
	                            height: 128
    					 	});
    					 	weapon = gf.addSprite(div, "other_"+other.name+"_weapon", {
	                            width:  192,
	                            height: 192
	                        });
    					 	div.append("<div style='font-family: \"Press Start 2P\"; background: rgba(0,0,0,0.5); padding: 5px; color: #FFF; width: 192px; position: absolute;'>"+other.name+"</div>");
    					 	div.data("state", {dir: other.dir, state: other.state});
    					 }
    					 
    					 // set the correct animation
    					 if(created || other.state !== div.data("state").state || other.dir !== div.data("state").dir){
							 div.data("state", {dir: other.dir, state: other.state}); 
							 
							 gf.transform(avatar, {flipH: false});
		    				 gf.transform(weapon, {flipH: false});
		    				 var pAnim =  playerAnim.stand;
		    				 var wAnim =  weaponAnim.stand;
		    				 if(other.state === 1){
		    				 	pAnim = playerAnim.walk;
		    					wAnim = weaponAnim.walk;
		    				 } else if (other.state === 2){
		    				 	pAnim = playerAnim.strike;
		    					wAnim = weaponAnim.strike;
		    				 }
	    					 if(other.dir === 0){
		    					 gf.setAnimation(avatar, pAnim.down, true);
		    					 gf.setAnimation(weapon, wAnim.down, true);
	    					 } else if (other.dir === 1){
		    					 gf.setAnimation(avatar, pAnim.up, true);
		    					 gf.setAnimation(weapon, wAnim.up, true);
	    					 } else {
	    					 	gf.setAnimation(avatar, pAnim.side, true);
		    					gf.setAnimation(weapon, wAnim.side, true);
		    					if(other.dir === 2){
		    						gf.transform(avatar, {flipH: true});
		    						gf.transform(weapon, {flipH: true});
		    					}
	    					 }
	    				 }
	    				 
    				}
    				// remove gone others
    				for (var i = others.length-1; i >= 0; i--){
    					var other = others[i];
    					if(!existingOthers[other.attr("id")]){
    						other.fadeOut(2000, function(){
                                $(this).remove();
                            });
                            others.splice(i,1);
    					}
    				}
    				
    				var existingEnemies = {};
    				var enemiesGroup = $("#enemies");
    				for (var i  = 0; i < json.enemies.length; i++){
    					enemy = json.enemies[i];
    					var div = $("#"+enemy.name);
    					existingEnemies[enemy.name] = true;
    					if(div.size() == 0){
    						// create new
    						var div = gf.addSprite(enemiesGroup, enemy.name, {
			                    x:      enemy.x,
			                    y:      enemy.y,
			                    width:  192,
			                    height: 192
			                })
    						enemies.push( div );
    						
    						switch (enemy.type){
    							case "skeleton":
    								gf.setAnimation(div, skeletonAnim.stand.down, true);
    								break;
    							case "ogre":
    								gf.setAnimation(div, ogreAnim.stand.down, true);
    								break; 
    						} 
					        $("#enemy1").css("z-index",1300 + 192-16);
	    				}
    				}
    				// remove dead enemies
    				for (var i = enemies.length-1; i >= 0; i--){
    					var enemy = enemies[i];
    					if(!existingEnemies[enemy.attr("id")]){
    						enemy.fadeOut(2000, function(){
                                $(this).remove();
                            });
                            enemies.splice(i,1);
    					}
    				}
    				setTimeout(updateFunction,100);
    			}
    		);
        }
        setTimeout(updateFunction, 0);
    }
    
    
    var gameLoop = function() {
        
        var idle = true;
        if(gf.keyboard[37]){ //left arrow
            player.left();
        	idle = false;
        }
        if(gf.keyboard[38]){ //up arrow
        	player.up();
        	idle = false;
        }
        if(gf.keyboard[39]){ //right arrow
            player.right();
 	        idle = false;
        }
        if(gf.keyboard[40]){ //down arrow
        	player.down();
        	idle = false;
        }
        if(gf.keyboard[32]){ //space
            player.strike();
            idle = false;
        }
        if(idle){
            player.idle();
        }
        
        player.detectInteraction(npcs, enemies, console);
        player.update();
        
        var margin = {x: (800-192)/2, y: (600-192)/2}; 
        var playerPos = {x: gf.x(player.div), y: gf.y(player.div)};
        
        gf.x(world, margin.x-Math.min(Math.max(playerPos.x, margin.x), 2048-800+margin.x));
        gf.y(world, margin.y-Math.min(Math.max(playerPos.y, margin.y), 2048-600+margin.y));
        
    };
    gf.addCallback(gameLoop, 30);
});