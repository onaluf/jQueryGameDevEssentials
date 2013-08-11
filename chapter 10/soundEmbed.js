// Preloads the sound
this.preload = function(url){
	// Preloading is not supported in a consistant
	// way for embeded sounds so we just save the 
	// URL for later use.
	this.url = url;
};

// Returns true if the sound is preloaded
this.isPreloaded = function(){
	// Since we use no preloading we allways return true
	return true;
}

// Starts to play the sound. If loop is true the
// sound will repeat until stopped 
this.play = function(loop){
	var embed = "<embed width='0' height='0' src='";
	embed += this.url;
	embed += "' loop='";
	embed += (loop)? "true" : "false";
	embed += "' autostart='true' />";
	this.obj = $(embed);
	$("body").append(this.obj);
};

// Stops the sound
this.stop = function(){
	this.obj.remove();
};