$.ajax({
	dataType: "json",
	url: "highscore.php",
	data: {
		// ...
	},
	async: false,
	success: function (json) {
		var top = "";
		for (var i = 0; i < json.top.length; i++){
			if(json.intop && json.pos === i){
				if (twitter){
					top +=  "<input id='name' type='hidden' val='"+twitterName+"'/>"
					+ twitterName + " " + minSec(json.top[i].time)
					+ " <a id='saveScore' href='#'>submit</a>"
					+ " <a id='tweetScore' href='#'>tweet</a> <br>";
				} else {
					top += "<input id='name' placeholder='_____' size='5' />"
					+ " "+minSec(json.top[i].time)
					+ " <a id='saveScore' href='#'>submit</a>"
					+ " <a target='_blank' href='http://twitter.com/home?status="+escape("I've just finished level "+currentLevel+" in YAP in "+minSec(json.top[i].time)+"!")+"'>tweet</a> <br>";
				}
			} else {
				top += "" + json.top[i].name + " " + minSec(json.top[i].time) + "<br>";
			}
		}
		$("#top_list").html(top);
	}
});