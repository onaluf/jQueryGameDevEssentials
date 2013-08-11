gf = {
    baseRate: 30,
    width: 640,
    height: 480,
    time: 0
};

gf.initialize = function(options) {
    $.extend(gf, options);
}

/**
 * Animation Object.
 **/
gf.animation = function(options) {
    var defaultValues = {
        url : false,
        width : 64,
        numberOfFrames : 1,
        currentFrame : 0,
        rate : 1,
        offset: 0
    }
    $.extend(this, defaultValues, options);
    if(options.rate){
        // normalize the animation rate
        this.rate = Math.round(this.rate / gf.baseRate);
    }
    if(this.url){
        gf.addImage(this.url);
    }
}

/**
 * This function sets the current frame.
 **/
gf.setFrame = function(div, animation) {
    div.css("backgroundPosition", "-" + (animation.currentFrame * animation.width + animation.offset) + "px 0px");
}

gf.animations = [];

/**
 * Sets the animation for the given sprite.
 **/
gf.setAnimation = function(div, animation, loop){
    var animate = {
        animation: $.extend({}, animation),
        div: div,
        loop: loop,
        counter: 0
    }
    
    if(animation.url){
        div.css("backgroundImage","url('"+animation.url+"')");
    }
    
    // search if this div already has an animation
    var divFound = false;
    for (var i = 0; i < gf.animations.length; i++) {
        if(gf.animations[i].div.is(div)){
            divFound = true;
            gf.animations[i] = animate;
        }
    }
    
    // otherwise we add it to the array
    if(!divFound) {
        gf.animations.push(animate);
    }
}

/**
 * This function adds a sprite the div defined by the fir'st argument
 **/
gf.spriteFragment = $("<div class='gf_sprite' style='position: absolute; overflow: hidden;'></div>");
gf.addSprite = function(parent, divId, options){
    var options = $.extend({
        x: 0,
        y: 0,
        width: 64,
        height: 64,
        flipH: false,
		flipV: false,
		rotate: 0,
		scale: 1
    }, options);
    var sprite = gf.spriteFragment.clone().css({
            left:   options.x,
            top:    options.y,
            width:  options.width,
            height: options.height}).attr("id",divId).data("gf",options);
    parent.append(sprite);
    return sprite;
}

/**
 * This function adds a sprite the div defined by the fir'st argument
 **/
gf.groupFragment = $("<div class='gf_group' style='position: absolute; overflow: visible;'></div>");
gf.addGroup = function(parent, divId, options){
    var options = $.extend({
        x: 0,
        y: 0,
        flipH: false,
		flipV: false,
		rotate: 0,
		scale: 1
    }, options);
    var group = gf.groupFragment.clone().css({
            left:   options.x,
            top:    options.y}).attr("id",divId).data("gf",options);
    parent.append(group);
    return group;
}


gf.intersect = function(a1,a2,b1,b2){
    var i1 = Math.min(Math.max(a1, b1), a2);
    var i2 = Math.max(Math.min(a2, b2), a1);
    return [i1, i2];
} 
/**
 * This function returns the indexes coresponding to the given box in the tilemap.
 */
gf.tilemapBox = function(tilemapOptions, boxOptions){
    var tmX  = tilemapOptions.x;
    var tmXW = tilemapOptions.x + tilemapOptions.width * tilemapOptions.tileWidth;
    var tmY  = tilemapOptions.y;
    var tmYH = tilemapOptions.y + tilemapOptions.height * tilemapOptions.tileHeight;
    
    var bX  = boxOptions.x;
    var bXW = boxOptions.x + boxOptions.width;
    var bY  = boxOptions.y;
    var bYH = boxOptions.y + boxOptions.height;
    
    var x = gf.intersect(tmX,tmXW, bX, bXW);
    var y = gf.intersect(tmY, tmYH, bY, bYH);
    
    return {
        x1: Math.floor((x[0] - tilemapOptions.x) / tilemapOptions.tileWidth),
        y1: Math.floor((y[0] - tilemapOptions.y) / tilemapOptions.tileHeight),
        x2: Math.ceil((x[1] - tilemapOptions.x) / tilemapOptions.tileWidth),
        y2: Math.ceil((y[1] - tilemapOptions.y) / tilemapOptions.tileHeight)
    }
}

gf.tilemapFragment = $("<div class='gf_tilemap' style='position: absolute'></div>");
gf.addTilemap = function(parent, divId, options){
    var options = $.extend({
        x: 0,
        y: 0,
        tileWidth: 64,
        tileHeight: 64,
        width: 0,
        height: 0,
        map: [],
        animations: []
    }, options);
    
    //create line and row fragment:
    var tilemap = gf.tilemapFragment.clone().attr("id",divId).data("gf",options);
    for (var i=0; i < options.height; i++){
        for(var j=0; j < options.width; j++) {
            var animationIndex = options.map[i][j];
            
            if(animationIndex > 0){
                var tileOptions = {
                    x: options.x + j*options.tileWidth,
                    y: options.y + i*options.tileHeight,
                    width: options.tileWidth,
                    height: options.tileHeight
                }
                var tile = gf.spriteFragment.clone().css({
                    left:   tileOptions.x,
                    top:    tileOptions.y,
                    width:  tileOptions.width,
                    height: tileOptions.height}
                ).addClass("gf_line_"+i).addClass("gf_column_"+j).data("gf", tileOptions);
                
                gf.setAnimation(tile, options.animations[animationIndex-1]);
                
                tilemap.append(tile);
            }
        }
    }
    parent.append(tilemap);
    return tilemap;
}

gf.tilemapCollide = function(tilemap, box){
    var options = tilemap.data("gf");
    var collisionBox = gf.tilemapBox(options, box);
    var divs = []
    
    for (var i = collisionBox.y1; i < collisionBox.y2; i++){
        for (var j = collisionBox.x1; j < collisionBox.x2; j++){
            var index = options.map[i][j];
            if( index > 0){
                divs.push(tilemap.find(".gf_line_"+i+".gf_column_"+j));
            }
        }
    }
    return divs;
}

gf.spriteCollide = function(sprite1, sprite2){
	var option1 = sprite1.data("gf");
	var option2 = sprite2.data("gf");
	
	var x = gf.intersect(
		option1.x,
		option1.x + option1.width,
		option2.x,
		option2.x + option2.width);
	var y = gf.intersect(
		option1.y,
		option1.y + option1.height,
		option2.y,
		option2.y + option2.height);
	
	if (x[0] == x[1] || y[0] == y[1]){
		return false;
	} else {
		return true;
	}
}

/**
 * This function sets or returns the position along the x-axis.
 **/
gf.x = function(div,position) {
    if(position) {
        div.css("left", position);
        div.data("gf").x = position;
    } else {
        return div.data("gf").x; 
    }
}
/**
 * This function sets or returns the position along the y-axis.
 **/
gf.y = function(div,position) {
    if(position) {
        div.css("top", position); 
        div.data("gf").y = position;
    } else {
        return div.data("gf").y; 
    }
}

gf.transform = function(div, options){
	var gf = div.data("gf");
	if(options.flipH !== undefined){
		gf.flipH = options.flipH;
	}
	if(options.flipV !== undefined){
		gf.flipV = options.flipV;
	}
	if(options.rotate !== undefined){
		gf.rotate = options.rotate;
	}
	if(options.scale !== undefined){
		gf.scale = options.scale;
	}
	var factorH = gf.flipH ? -1 : 1;
	var factorV = gf.flipV ? -1 : 1;
	div.css("transform", "rotate("+gf.rotate+"deg) scale("+(gf.scale*factorH)+","+(gf.scale*factorV)+")");
}

gf.width = function(div,dimension) {
    if(dimension) {
        div.css("width", position); 
        div.data("gf").width = position;
    } else {
        return div.data("gf").width; 
    }
}

gf.height = function(div,dimension) {
    if(dimension) {
        div.css("height", position); 
        div.data("gf").height = position;
    } else {
        return div.data("gf").height; 
    }
}

gf.imagesToPreload = [];

/**
 * Add an image to the list of image to preload
 **/
gf.addImage = function(url) {
    if ($.inArray(url, gf.imagesToPreload) < 0) {
        gf.imagesToPreload.push();
    }
    gf.imagesToPreload.push(url);
};

gf.callbacks = [];

gf.addCallback = function(callback, rate){
    gf.callbacks.push({
        callback: callback,
        rate: Math.round(rate / gf.baseRate),
        counter: 0
    });
}

gf.refreshGame = function (){
    
    // update animations
    var finishedAnimations = [];
    
    for (var i=0; i < gf.animations.length; i++) {
        
        var animate = gf.animations[i];
        
        animate.counter++;
        if (animate.counter == animate.animation.rate) {
            animate.counter = 0;
            animate.animation.currentFrame++;
            if(!animate.loop && animate.animation.currentFrame > animate.animation.numberOfFrames){
                finishedAnimations.push(i);
            } else {
                animate.animation.currentFrame %= animate.animation.numberOfFrames;
                gf.setFrame(animate.div, animate.animation);
            }
        }
    }
    for(var i=0; i < finishedAnimations.length; i++){
        gf.animations.splice(finishedAnimations[i], 1);
    }
    
    // execute the callbacks
    for (var i=0; i < gf.callbacks.length; i++) {
        var call  = gf.callbacks[i];
        
        call.counter++;
        if (call.counter == call.rate) {
            var currentTime = (new Date()).getTime();
            call.counter = 0;
            call.callback(currentTime - gf.time);
        }
    }
    gf.time = (new Date()).getTime();
}

/**
 * Start the preloading of the images.
 **/
gf.startGame = function(endCallback, progressCallback) {
    var images = [];
    var total = gf.imagesToPreload.length;
    
    for (var i = 0; i < total; i++) {
        var image = new Image();
        images.push(image);
        image.src = gf.imagesToPreload[i];
    }
    var preloadingPoller = setInterval(function() {
        var counter = 0;
        var total = gf.imagesToPreload.length;
        for (var i = 0; i < total; i++) {
            if (images[i].complete) {
                counter++;
            }
        }
        if (counter == total) {
            //we are done!
            clearInterval(preloadingPoller);
            endCallback();
            setInterval(gf.refreshGame, gf.baseRate);
            gf.time = (new Date()).getTime();
        } else {
            if (progressCallback) {
                count++;
                progressCallback((count / total) * 100);
            }
        }
    }, 100);
};

gf.keyboard = [];
// keyboard state handler
 $(document).keydown(function(event){
    gf.keyboard[event.keyCode] = true;
});
$(document).keyup(function(event){
    gf.keyboard[event.keyCode] = false;
});


