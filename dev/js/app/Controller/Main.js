App.define('Controller.Main', {

    grid: 'View.Grid',
    panel: 'View.Panel',
    canvas: 'View.Canvas',
    raster: 'Controller.RasterAlgorithms',

    $time: '#time',

    polygon: null,
    fillAlgorithm: null,
    fillColor: {red: 0, green: 0, blue: 0},
    borderColor: {red: 50, green: 50, blue: 50},

    render: function(){
        if(this.polygon === null) return;
        // if(this.polygon === null || this.fillAlgorithm === null) return;

        this.grid.clearFrame(false);
        var time = 0;

        switch (this.polygon.type) {
            case 'rect':
            case 'polygon':
                time = this.raster.polygon(this.polygon.vertices, this.borderColor);
            break;

            case 'circle':
                time = this.raster.circle(this.polygon.center, this.polygon.radius, this.borderColor);
            break;
        }

        this.grid.update();
        this.$time.find('.raster').html((time).toFixed(5));
    },

    applyFill: function(){

        if(this.polygon === null) return;
        // if(this.polygon === null || this.fillAlgorithm === null) return;


    },

    setColor: function(color){

        this.fillColor = color;

        var diff = 50;
        if((color.red + color.green + color.blue)/3 > 127){
            this.borderColor = new this.util.Color(
                color.red - diff,
                color.green - diff,
                color.blue - diff
            );
        }
        else{
            this.borderColor = new this.util.Color(
                color.red + diff,
                color.green + diff,
                color.blue + diff
            );
        }
        this.canvas.setColor(this.borderColor);
    },

    ready: function(){

        var me = this;

        this.panel.addListener('polygon-change', function(e, polygon, element){
            me.canvas.setShape(polygon);
            me.polygon = me.canvas.getPolygon();
            me.render();
        });

        this.panel.addListener('resolution-change', function(e, resolution){
            me.grid.setResolution(resolution);
            me.render();
            me.applyFill();
        });

        this.panel.addListener('color-change', function(e, color){
            me.setColor(color);
            me.render();
            me.applyFill();
        });

        this.panel.addListener('algorithm-change', function(e, algorithm){
            me.fillAlgorithm = algorithm;
            me.render();
            me.applyFill();
        });

        me.panel.setResolution(7);
        // me.panel.setAlgorithm('parametric');
    },

    init: function(){
        var me = this;
        me.grid = me._appRoot_.get(me.grid);
        me.canvas = me._appRoot_.get(me.canvas);
        me.panel = me._appRoot_.get(me.panel);
        me.raster = me._appRoot_.get(me.raster);
        me.util = me._appRoot_.get('Util');
        me.$time = $(me.$time);
    }

});
