App.define('View.Panel', {

    $domObj: '#panel',
    $polygons: '.polygon',
    $resolutionSelect: '#resolution',
    $algorithmSelect: '#algorithm',
    $colorPicker: '#color',

    colorHexToDec: function(hex){

        if(hex[0] === '#') hex = hex.slice(1, hex.length);

        if(hex.length === 3)
            return new this.util.Color(
                parseInt(hex[0]+hex[0], 16),
                parseInt(hex[1]+hex[1], 16),
                parseInt(hex[2]+hex[2], 16)
            );

        else if(hex.length === 6)
            return new this.util.Color(
                parseInt(hex.slice(0, 2), 16),
                parseInt(hex.slice(2, 4), 16),
                parseInt(hex.slice(4, 6), 16)
            );

        else
            return new this.util.Color(0, 0, 0);

    },

    addListener: function(eventName, handle){
        this.$domObj.on(eventName, handle);
    },

    setResolution: function(resolution){

        if(isNaN(resolution) || resolution > 10)
            resolution = 10;
        else if(resolution < 3)
            resolution = 3;

        this.$resolutionSelect.val(resolution);
        this.onSelectResolutionChange(resolution);
    },

    setAlgorithm: function(algorithm){
        this.$algorithmSelect.val(algorithm);
        this.onAlgorithmSelect(algorithm);
    },

    setPolygon: function(name){

        var element = null;
        this.$polygons.each(function(index, el){
            if(element !== null) return;
            element = $(el).data('polygon') === name ? el : null;
        });

        if(element !== null) this.onPolygonChange(element);
    },

    onPolygonChange: function(el){
        el = $(el);
        if(el.hasClass('active')) return;
        this.$polygons.removeClass('active');
        el.addClass('active');
        this._appRoot_.Base.fireEvent('polygon-change', this.$domObj, [el.data('polygon'), el[0]]);
    },

    onSelectResolutionChange: function(value){

        if(isNaN(value) || value > 10){
            value = 10;
            this.$resolutionSelect.val(10);
        }
        else if(value < 3){
            value = 3;
            this.$resolutionSelect.val(3);
        }

        this._appRoot_.Base.fireEvent('resolution-change', this.$domObj, [value]);
    },

    onColorSelect: function(value){
        this._appRoot_.Base.fireEvent('color-change', this.$domObj, [this.colorHexToDec(value)]);
    },

    onAlgorithmSelect: function(value){
        this._appRoot_.Base.fireEvent('algorithm-change', this.$domObj, [value]);
    },

    ready: function(){
        var me = this;

        me.$polygons.click(function(){me.onPolygonChange(this)});
        me.$resolutionSelect.change(function(){me.onSelectResolutionChange(parseInt(this.value))});
        me.$algorithmSelect.change(function(){me.onAlgorithmSelect(this.value)});
        me.$colorPicker.on('input', function(e){me.onColorSelect($(this).val())}).val('#000000');
    },

    init: function(){
        
        this.$domObj = $(this.$domObj);
        this.$polygons = this.$domObj.find(this.$polygons);
        this.$resolutionSelect = $(this.$resolutionSelect);
        this.$algorithmSelect = $(this.$algorithmSelect);
        this.$colorPicker = $(this.$colorPicker);

        this.util = this._appRoot_.get('Util');
    }
});
