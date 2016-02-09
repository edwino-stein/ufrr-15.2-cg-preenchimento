App.define('Controller.FillAlgorithms', {

    grid: 'View.Grid',
    canvas: 'View.Canvas',

    newPoint: function(x, y){
        return new this.util.Point(x, y);
    },

    getTimeStamp: function(){
      return performance.now()
    },

    /**
        Converte um ponto do canvas(mm) em um pixel da grid
    */
    canvasToGrid: function(x, y){
        return this.newPoint(
            Math.floor((this.grid.fakeWidth * x)/this.canvas.getViewBoxWidth()),
            Math.floor((this.grid.fakeHeight * y)/this.canvas.getViewBoxHeight())
        );
    },

    /**
        Converte um pixel da grid em um ponto do canvas(mm)
    */
    gridToCanvas: function(x, y){
        return this.newPoint(
            (this.canvas.getViewBoxWidth() * x)/this.grid.fakeWidth,
            (this.canvas.getViewBoxHeight() * y)/this.grid.fakeHeight
        );
    },

    /**
        Pega o tamanho de um pixel da grid
    */
    getPixelSize: function(){
        return this.grid.pixelSize;
    },

    init: function(){
        var me = this;
        me.grid = me._appRoot_.get(me.grid);
        me.canvas = me._appRoot_.get(me.canvas);
        this.util = this._appRoot_.get('Util');
    }
});
