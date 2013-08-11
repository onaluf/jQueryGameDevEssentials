// a sound object
sound = function(){
	this.preloaded = false;
	
	// Preloads the sound
	this.preload = function(url){
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		
		// Decode asynchronously
		var that = this;
		request.onload = function() {
			sound.context.decodeAudioData(request.response, function(buffer) {
				that.soundBuffer = buffer;
				that.preloaded = true;
			});
		}
		request.send();
	};
	
	// Returns true if the sound is preloaded
	this.isPreloaded = function(){
		return this.preloaded;
	}
	
	// Starts to play the sound. If loop is true the
	// sound will repeat until stopped 
	this.play = function(loop){
		this.source = sound.context.createBufferSource();
		this.source.buffer = this.soundBuffer;
		this.source.connect(sound.context.destination);
		this.source.loop = true;
		this.source.start(0);
	};
	
	// Stops the sound
	this.stop = function(){
		this.source.stop(0);
	};
};

sound.context = new webkitAudioContext();