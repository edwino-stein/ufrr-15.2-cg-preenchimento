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

            case 'polygon':
                this.scanLinePolygon(polygon.vertices, color, borderColor);
            break;
        }

        return this.getTimeStamp() - now;
    },

    scanLinePolygon: function(vertices, color, borderColor){

        var maxY = vertices[0].y,
            minY = vertices[0].y;

        for(var i = 1; i < vertices.length; i++){
            if(maxY < vertices[i].y) maxY = vertices[i].y;
            if(minY > vertices[i].y) minY = vertices[i].y;
        }

        var sides = [],
            sortSides = function(a, b){
                return (a[0].x + a[1].x)/2 >= (b[0].x + b[1].x)/2 ? 1 : (0);
            };


        for(var i = 0; i < vertices.length; i++){
            if(i + 1 >= vertices.length)
                sides.push([vertices[i], vertices[0]]);
            else
                sides.push([vertices[i], vertices[i + 1]]);
        }
        sides.sort(sortSides);

        var pixelSize = this.getPixelSize(),
            y = 0,
            pixelColor = null,
            intersections = null,
            pixelInitial = null,
            pixelFinal = null;

        maxY = this.gridToCanvas(0, this.canvasToGrid(0, maxY).y).y;
        minY = this.gridToCanvas(0, this.canvasToGrid(0, minY).y + 1).y;

        for(y = minY; y < maxY; y += pixelSize){

            intersections = this.getIntersections(y, sides);

            for(var i in intersections){
                pixelInitial = this.canvasToGrid(intersections[i][0], y);
                pixelFinal = this.canvasToGrid(intersections[i][1], y);
                for(pixelInitial.x; pixelInitial.x <= pixelFinal.x; pixelInitial.x++){
                    this.grid.activePixel(pixelInitial, color, false);
                }
            }

        }
    },

    getIntersections: function(y, sides){

        var intersections = [],
            a = [];

        for(var i in sides){
            if(sides[i][0].y > y && sides[i][1].y < y || sides[i][1].y > y && sides[i][0].y < y){
                a.push(sides[i]);
                continue;
            }

            if(sides[i][0].y === y || sides[i][1].y === y){
                a.push(sides[i]);
                continue;
            }
        }

        var interval = [];
        for(var i in a){
            interval.push(this.getXOfLine(y, a[i][0], a[i][1]));
            if(interval.length == 2){
                intersections.push(interval);
                interval = [];
            }
        }

        return intersections;
    },

    getXOfLine: function(y, point1, point2){
        return (((y - point1.y)*(point2.x - point1.x))/(point2.y - point1.y)) + point1.x;
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

        try{
            this.rFloodFill(seed, color, targetColor);
        }catch(ex){
            window.alert("Erro ao preencher o polígono:\n\n"+ex);
        }

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
