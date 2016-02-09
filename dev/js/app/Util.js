App.define('Util', {

    Point: function Point(x, y){
        this.x = x;
        this.y = y;
    },

    Color: function Color(red, green, blue){

        red = parseInt(red);
        green = parseInt(green);
        blue = parseInt(blue);

        if(isNaN(red) || red < 0) this.red = 0;
        else if(red > 255) this.red = 255;
        else this.red = red;

        if(isNaN(green) || green < 0) this.green = 0;
        else if(green > 255) this.green = 255;
        else this.green = green;

        if(isNaN(blue) || blue < 0) this.blue = 0;
        else if(blue > 255) this.blue = 255;
        else this.blue = blue;

        this.isEqual = function(color){
            return  this.red    === color.red    &&
                    this.green  === color.green  &&
                    this.blue   === color.blue;
        }
    },

});
