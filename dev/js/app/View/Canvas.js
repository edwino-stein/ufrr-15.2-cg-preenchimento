App.define('View.Canvas', {

    $domObj: '#canvas',

    availableShape: {

        'rect': {
            type: 'rect',
            x: 200,
            y: 150,
            width: 400,
            height: 300
        },

        'circle': {
            type: 'circle',
            cx: 400,
            cy: 300,
            r: 200,
        },

        'complexA': {
            type: 'polygon',
            points: '192,165 300,275 110,370 330,480 685,320 570,220',
            seed: '401,324'
        },

        'complexC': {
            type: 'polygon',
            points: '185,470 185,300 400,160 615,300 615,470 475,470 400,400 325,470',
            seed: '401,324'
        },
    },

    fill: 'transparent',
    stroke: '#000',
    strokeWidth: 1.5,

    shapeSelected: '',
    shapeObj: null,

    setShape: function(name){

        if(!this.availableShape.hasOwnProperty(name)) return;
        if(this.shapeObj !== null) this.shapeObj.remove();
        this.shapeSelected = name;

        var shape = this.availableShape[name],
            exclude = ['type', 'seed'];

        this.shapeObj = document.createElementNS('http://www.w3.org/2000/svg', shape.type);

        for(var i in shape){
            if(exclude.indexOf(i) >= 0) continue;
            this.shapeObj.setAttribute(i, shape[i]);
        }

        this.shapeObj.setAttribute('fill', this.fill);
        this.shapeObj.setAttribute('stroke', this.stroke);
        this.shapeObj.setAttribute('stroke-width', this.strokeWidth);

        this.$domObj[0].appendChild(this.shapeObj);
    },

    getPolygon: function(){

        var polygon = this.availableShape[this.shapeSelected];

        switch (polygon.type) {

            case 'circle':
                return {
                    type: 'circle',
                    center: this.newPoint(polygon.cx, polygon.cy),
                    radius: polygon.r,
                    seed: this.newPoint(polygon.cx, polygon.cy)
                };
            break;

            case 'rect':
                return {
                    type: 'rect',
                    vertices:[
                        this.newPoint(polygon.x, polygon.y),
                        this.newPoint(polygon.x + polygon.width, polygon.y),
                        this.newPoint(polygon.x + polygon.width, polygon.y + polygon.height),
                        this.newPoint(polygon.x, polygon.y + polygon.height)
                    ],
                    seed: this.newPoint(polygon.x + polygon.width/2, polygon.y + polygon.height/2)
                };
            break;

            case 'polygon':

                var points = polygon.points.split(' '),
                    vertices = [];

                for(var i in points)
                    vertices.push(this.stringToPoint(points[i]));

                return {
                    type: 'polygon',
                    vertices: vertices,
                    seed: this.stringToPoint(polygon.seed)
                };

            break;
        }

        return null;
    },

    setColor: function(c){
        var color = '';
        color += ((0xff ^ c.red) < 16 ? '0' : '') + (0xff ^ c.red).toString(16);
        color += ((0xff ^ c.green) < 16 ? '0' : '') + (0xff ^ c.green).toString(16);
        color += ((0xff ^ c.blue) < 16 ? '0' : '') + (0xff ^ c.blue).toString(16);
        this.stroke = '#'+color;

        if(this.shapeObj !== null)
            this.shapeObj.setAttribute('stroke', '#'+color);
    },

    updateViewbox: function(width, height){
        this.$domObj[0].setAttribute('viewBox', '0 0 '+width+' '+height);
    },

    getViewBoxWidth: function(){
        return this.$domObj[0].viewBox.baseVal.width
    },

    getViewBoxHeight: function(){
        return this.$domObj[0].viewBox.baseVal.height
    },

    stringToPoint: function(input){
        input = input.split(',');
        var x = parseInt(input[0]),
            y = parseInt(input[1]);

        return this.newPoint(
            !isNaN(x) ? x : 0,
            !isNaN(y) ? y : 0
        );
    },

    newPoint: function(x, y){
        return new this.util.Point(x, y);
    },

    ready: function(){
        var me = this;
        me.updateViewbox(800, 600);
    },

    init: function(){
        var me = this;
        me.$domObj = $(me.$domObj);
        me.util = me._appRoot_.get('Util');
    }
});
