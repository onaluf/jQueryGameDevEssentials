
/**
 * This function sets or returns the position along the x-axis.
 **/
gf.x = function(divId,position) {
    if(position) {
    	var data = $("#"+divId).data("gf");
        var y = data.y;
        data.x = position;
        $("#"+divId).css("transform", "translate("+position+"px, "+y+"px)");
    } else {
        return $("#"+divId).data("gf").x; 
    }
}
/**
 * This function sets or returns the position along the y-axis.
 **/
gf.y = function(divId,position) {
    if(position) {
    	var data = $("#"+divId).data("gf");
    	var x = data.x;
        data.y = position;
        $("#"+divId).css("transform", "translate("+x+"px, "+position+"px)"); 
    } else {
        return $("#"+divId).data("gf").y; 
    }
}