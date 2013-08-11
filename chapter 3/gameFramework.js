gf = {
    baseRate: 30
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
        rate : 1
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
gf.setFrame = function(divId, animation) {
    $("#" + divId).css("bakgroundPosition", "" + animation.currentFrame * animation.width + "px 0px");
}

gf.animations = [];

/**
 * Sets the animation for the given sprite.
 **/
gf.setAnimation = function(divId, animation, loop){
    var animate = {
        animation: $.extend({}, animation),
        div: divId,
        loop: loop,
        counter: 0
    }
    
    if(animation.url){
        $("#"+divId).css("backgroundImage","url('"+animation.url+"')");
    }
    
    // search if this div already has an animation
    var divFound = false;
    for (var i = 0; i < gf.animations.length; i++) {
        if(gf.animations[i].div == divId){
            divFound = true;
            gf.animations[i] = animate
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
gf.spriteFragment = $("<div style='position: absolute'></div>");
gf.addSprite = function(parentId, divId, options){
    var options = $.extend({
        x: 0,
        y: 0,
        width: 64,
        height: 64
    }, options);
    $("#"+parentId).append(gf.spriteFragment.clone().css({
            left:   options.x,
            top:    options.y,
            width:  options.width,
            height: options.height}).attr("id",divId).data("gf",options));
}


/**
 * This function sets or returns the position along the x-axis.
 **/
gf.x = function(divId,position) {
    if(position) {
        $("#"+divId).css("left", position); 
        $("#"+divId).data("gf").x = position;
    } else {
        return $("#"+divId).data("gf").x; 
    }
}
/**
 * This function sets or returns the position along the y-axis.
 **/
gf.y = function(divId,position) {
    if(position) {
        $("#"+divId).css("top", position); 
        $("#"+divId).data("gf").y = position;
    } else {
        return $("#"+divId).data("gf").y; 
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
            if(!animate.loop && animate.animation.currentFrame > animate.animation.numberOfFrame){
                finishedAnimations.push(i);
            } else {
                animate.animation.currentFrame %= animate.animation.numberOfFrame;
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
            call.counter = 0;
            call.callback();
        }
    }
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


