App.define('Controller.FillAlgorithms', {

    grid: 'View.Grid',
    canvas: 'View.Canvas',

    scanLine: function(polygon, color, borderColor){

        var now = this.getTimeStamp();
        switch (polygon.type){

            case 'rect':
                this.rectScanLine(polygon.vertices, color);
            break;

            case 'circle':
                this.circleScanLine(polygon.center, polygon.radius, color, borderColor);
            break;
        }

        return this.getTimeStamp() - now;
    },

    circleScanLine: function(center, radius, color, borderColor){

        var maxPixel = this.canvasToGrid(center.x, center.y + radius),
            minPixel = this.canvasToGrid(center.x, center.y - radius),
            pixelColor;

        center = this.canvasToGrid(center.x, center.y);

        for (minPixel.y += 1; minPixel.y < maxPixel.y ; minPixel.y++) {

            //Pinta da metade para direta
            minPixel.x = center.x;
            pixelColor = this.grid.getPixelColor(minPixel);
            while(!borderColor.isEqual(pixelColor)) {
                this.grid.activePixel(minPixel, color, false);
                minPixel.x++;
                pixelColor = this.grid.getPixelColor(minPixel);
            }

            //Pinta da metade para esquerda
            minPixel.x = center.x - 1;
            pixelColor = this.grid.getPixelColor(minPixel);
            while(!borderColor.isEqual(pixelColor)) {
                this.grid.activePixel(minPixel, color, false);
                minPixel.x--;
                pixelColor = this.grid.getPixelColor(minPixel);
            }
        }
    },

    rectScanLine: function(vertices, color){

        var min = this.newPoint(vertices[0].x, vertices[0].y),
            max = this.newPoint(vertices[0].x, vertices[0].y);
            pixel = this.newPoint(0, 0);

        for(var i = 1; i < vertices.length; i++){

            //Ponto minimo
            if(min.x > vertices[i].x) min.x = vertices[i].x;
            if(min.y > vertices[i].y) min.y = vertices[i].y;

            //Ponto maxmo
            if(max.x < vertices[i].x) max.x = vertices[i].x;
            if(max.y < vertices[i].y) max.y = vertices[i].y;
        }

        //Converte para coordenadas da matriz de pixels
        min = this.canvasToGrid(min.x, min.y);
        max = this.canvasToGrid(max.x, max.y);

        //Pinta os pixels
        for(pixel.y = min.y + 1; pixel.y < max.y; pixel.y++)
            for(pixel.x = min.x + 1; pixel.x < max.x; pixel.x++)
                this.grid.activePixel(pixel, color, false);
    },

    floodFill: function(polygon, color){
        var now = this.getTimeStamp(),
            seed = this.canvasToGrid(polygon.seed.x, polygon.seed.y),
            targetColor = this.grid.getPixelColor(seed);

        this.rFloodFill(seed, color, targetColor);
        return this.getTimeStamp() - now;
    },

    /**
        Flood Fill recursiva
    */
    rFloodFill: function(pixel, color, targetColor){

        if(!targetColor.isEqual(this.grid.getPixelColor(pixel)))
            return;

        this.grid.activePixel(pixel, color, false);

        //Pixel da direita
        this.rFloodFill(this.newPoint(pixel.x + 1, pixel.y), color, targetColor);

        //Pixel de cima
        this.rFloodFill(this.newPoint(pixel.x, pixel.y + 1), color, targetColor);

        //Pixel da esquerda
        this.rFloodFill(this.newPoint(pixel.x - 1, pixel.y), color, targetColor);

        //Pixel de baixo
        this.rFloodFill(this.newPoint(pixel.x, pixel.y - 1), color, targetColor);
    },

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
