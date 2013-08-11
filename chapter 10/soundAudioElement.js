// a sound object
sound = function(){
	
	// Preloads the sound
	this.preload = function(url){
		this.audio = new Audio();
		//this.audio.setAttribute("src", url + this.ext);
		this.audio.preload = "auto";
		this.audio.src = url + sound.ext;
		this.audio.load();
	};
	
	// Returns true if the sound is preloaded
	this.isPreloaded = function(){
		return (this.audio.readyState == 4)
	}
	
	// Starts to play the sound. If loop is true the
	// sound will repeat until stopped 
	this.play = function(loop){
		if (this.audio.lopp === undefined){
			this.audio.addEventListener('ended', function() {
			    this.currentTime = 0;
			    this.play();
			}, false);
		} else {
			this.audio.loop = loop;
		}
		this.audio.play();
	};
	
	// Pauses the sound
	this.pause = function(loop){
		this.audio.pause();
	};
	
	// Stops the sound
	this.stop = function(){
		this.audio.pause();
		this.audio.currentTime = 0;
	};
};

(function(){
	var audio = new Audio();
	var canPlayOggVorbis = audio.canPlayType('audio/ogg; codecs="vorbis"');
	var canPlayMP3 = audio.canPlayType('audio/mpeg; codecs="mp3"');
	if (canPlayOggVorbis == "probably" || (canPlayOggVorbis == "maybe" && canPlayMP3 != "probably")) {
		sound.ext = ".ogg";
	} else {
		sound.ext = ".mp3";
	}
})();