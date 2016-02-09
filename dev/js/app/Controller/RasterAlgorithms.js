App.define('Controller.RasterAlgorithms', {

    grid: 'View.Grid',
    canvas: 'View.Canvas',

    polygon: function(vertices, color){

        var now = this.getTimeStamp();

        for(var i = 0; i< vertices.length; i++){
            if(i + 1 === vertices.length)
                this.drawLine(vertices[i], vertices[0], color);
            else
                this.drawLine(vertices[i], vertices[i+1], color);
        }

        return this.getTimeStamp() - now;
    },

    /**
        Algoritmo de Bresenham para desenhar circunferência
    */
    circle: function(center, radius, color){

        var now = this.getTimeStamp();
            idealPoint = this.newPoint(0, radius),
            pixelPoint = this.canvasToGrid(0, radius),
            p = 5/4 - radius;

        center = this.canvasToGrid(center.x, center.y);

        while(pixelPoint.x <= pixelPoint.y){

            //1º octante
            this.grid.activePixel(this.newPoint(center.x + pixelPoint.y, center.y + pixelPoint.x), color, false);

            //2º octante
            this.grid.activePixel(this.newPoint(center.x + pixelPoint.x, center.y + pixelPoint.y), color, false);

            //3º octante
            this.grid.activePixel(this.newPoint(center.x - pixelPoint.x, center.y + pixelPoint.y), color, false);

            //4º octante
            this.grid.activePixel(this.newPoint(center.x - pixelPoint.y, center.y + pixelPoint.x), color, false);

            //5º octante
            this.grid.activePixel(this.newPoint(center.x - pixelPoint.y, center.y - pixelPoint.x), color, false);

            //6º octante
            this.grid.activePixel(this.newPoint(center.x - pixelPoint.x, center.y - pixelPoint.y), color, false);

            //7º octante
            this.grid.activePixel(this.newPoint(center.x + pixelPoint.x, center.y - pixelPoint.y), color, false);

            //8º octante
            this.grid.activePixel(this.newPoint(center.x + pixelPoint.y, center.y - pixelPoint.x), color, false);

            if(p >= 0){

                pixelPoint.y--;

                //Encontra o ponto da circunferencia a partir do pixel atual
                idealPoint = this.gridToCanvas(pixelPoint.x + 1 , pixelPoint.y - 1);

                //Calcula o proximo P
                p += (2 * idealPoint.x) - (2 * idealPoint.y) + 5;

                pixelPoint.x++;
            }
            else{
                //Encontra o ponto da circunferencia a partir do pixel atual
                idealPoint = this.gridToCanvas(pixelPoint.x + 1, pixelPoint.y - 1);

                //Calcula o proximo P
                p += (2 * idealPoint.x) + 3;

                pixelPoint.x++;
            }
        }

        return this.getTimeStamp() - now;
    },

    /**
        Algoritmo de Bresenham para desenhar linhas
    */
    drawLine: function(start, end, color){

        //Converte para coordenadas inteiras aos seus pixels correspondentes da matriz
        start = this.canvasToGrid(start.x, start.y);
        end = this.canvasToGrid(end.x, end.y);

        var octante, dx, dy, p, pixel = this.newPoint(start.x, start.y);

        //Descobre em qual octante a reta pertence
        if(start.x <= end.x){
            dx = end.x - start.x;
            if(start.y <= end.y){
                dy = end.y - start.y;
                octante = (dx >= dy) ? 1 : 2;
            }
            else{
                dy = start.y - end.y;
                octante = (dx >= dy) ? 8 : 7;
            }
        }
        else{
            dx = start.x - end.x;
            if(start.y <= end.y){
                dy = end.y - start.y;
                octante = (dx >= dy) ? 4 : 3;
            }
            else{
                dy = start.y - end.y;
                octante = (dx >= dy) ? 5 : 6;
            }
        }

        switch (octante) {
            case 1:
                p = 2*dy - dx;
                for(pixel.x; pixel.x <= end.x; pixel.x++){
                    this.grid.activePixel(pixel, color, false);
                    if(p < 0){
                        p += 2*dy;
                        continue;
                    }
                    pixel.y++;
                    p += 2*(dy - dx);
                }
            break;
            case 2:
                p = 2*dx - dy;
                for(pixel.y; pixel.y <= end.y; pixel.y++){
                    this.grid.activePixel(pixel, color, false);
                    if(p < 0){
                        p += 2*dx;
                        continue;
                    }
                    pixel.x++;
                    p += 2*(dx - dy);
                }
            break;
            case 3:
                p = 2*dx - dy;
                for(pixel.y; pixel.y <= end.y; pixel.y++){
                    this.grid.activePixel(pixel, color, false);
                    if(p < 0){
                        p += 2*dx;
                        continue;
                    }
                    pixel.x--;
                    p += 2*(dx - dy);
                }
            break;
            case 4:
                p = 2*dy - dx;
                for(pixel.x; pixel.x >= end.x; pixel.x--){
                    this.grid.activePixel(pixel, color, false);
                    if(p < 0){
                        p += 2*dy;
                        continue;
                    }
                    pixel.y++;
                    p += 2*(dy - dx);
                }
            break;
            case 5:
                p = 2*dy - dx;
                for(pixel.x; pixel.x >= end.x; pixel.x--){
                    this.grid.activePixel(pixel, color, false);
                    if(p < 0){
                        p += 2*dy;
                        continue;
                    }
                    pixel.y--;
                    p += 2*(dy - dx);
                }
            break;
            case 6:
                p = 2*dx - dy;
                for(pixel.y; pixel.y >= end.y; pixel.y--){
                    this.grid.activePixel(pixel, color, false);
                    if(p < 0){
                        p += 2*dx;
                        continue;
                    }
                    pixel.x--;
                    p += 2*(dx - dy);
                }
            break;
            case 7:
                p = 2*dx - dy;
                for(pixel.y; pixel.y >= end.y; pixel.y--){
                    this.grid.activePixel(pixel, color, false);
                    if(p < 0){
                        p += 2*dx;
                        continue;
                    }
                    pixel.x++;
                    p += 2*(dx - dy);
                }
            break;
            case 8:
                p = 2*dy - dx;
                for(pixel.x; pixel.x <= end.x; pixel.x++){
                    this.grid.activePixel(pixel, color, false);
                    if(p < 0){
                        p += 2*dy;
                        continue;
                    }
                    pixel.y--;
                    p += 2*(dy - dx);
                }
            break;
        }
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
