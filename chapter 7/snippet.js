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