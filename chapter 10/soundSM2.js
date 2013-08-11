sound = function(){
	
	this.preloadStarted = false;
	
	// Preloads the sound
	this.preload = function(url){
		if(sound.ready){
			this.audio = soundManager.createSound({
				id: 'sound'+sound.counter++,
				url: url,
				autoLoad: true,
				autoPlay: false,
				volume: 50
			});
			this.preloadStarted = true;
		} else {
			this.url = url;
		}
	};
	
	// Returns true if the sound is preloaded
	this.isPreloaded = function(){
		if (!this.preloadStarted){
			this.preload(this.url);
			return false;
		} else {
			return (this.audio.readyState == 3)
		}
	}
	
	// Starts to play the sound. If loop is true the
	// sound will repeat until stopped 
	this.play = function(loop){
		this.audio.loops = loop;
		this.audio.play();
	};
	
	// Pauses the sound
	this.pause = function(loop){
		this.audio.pause();
	};
	
	// Stops the sound
	this.stop = function(){
		this.audio.stop();
	};
};

sound.ready = false;
sound.counter = 0;
// a sound object
soundManager.setup({
  url: 'sm2.swf',
  flashVersion: 8, 
  useFlashBlock: false, // optionally, enable when you're ready to dive in
  useHTML5Audio: true,
  onready: function() {
    sound.ready = true;
  }
});