var mapManager = {

    mapData: null, //переменная для хранения карты
    tLayer: new Array(), //переменная для хранения ссылки на блоки карты
    xCount: 0,//кол-во блоков по горизонтали
    yCount: 0,//кол-во блоков по вертикали
    tSize: {x: 32, y: 32},//размеры блока
    mapSize: {x: 0, y: 0},//размер карты в пикселях
    tilesets: new Array(),//массив описаний блоков карты
    imgLoadCount: 0, //количество загруженных изображений
    imgLoaded: false, //все изображения загружены
    jsonLoaded: false, //json загружено
    view: {x: 0, y: 0, w: 1000, h: 30 * 32},

    //Загрузка карты
    loadMap: function (path) {
        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open("GET", path, false);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                mapManager.parseMap(request.responseText);
            }
        };
        request.send();
    },

    draw: function (ctx) {
        if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {

        } else {
            if (this.tLayer.length === 0) {
                for (var id = 0; id < this.mapData.layers.length; id++) {
                    var layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer") {
                        this.tLayer.push(layer);
                    }
                }
            }
            for (var j = 0; j < this.tLayer.length; j++) {
                for (var i = 0; i < this.tLayer[j].data.length; i++) {
                    if (this.tLayer[j].data[i] !== 0) {
                        var tile = this.getTile(this.tLayer[j].data[i]);
                        var pX = (i % this.xCount) * this.tSize.x;
                        var pY = Math.floor(i / this.xCount) * this.tSize.y;
                        pX -= this.view.x;
                        pY -= this.view.y;
                        ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                    }
                }
            }
        }
    },


    parseMap: function (tilesJSON) {
        this.mapData = JSON.parse(tilesJSON); //разобрать JSON
        this.xCount = this.mapData.width; //сохранение ширины
        this.yCount = this.mapData.height; //сохранение высоты
        this.tSize.x = this.mapData.tilewidth; //сохранение размера блока
        this.tSize.y = this.mapData.tileheight; //сохранение размера блока
        this.mapSize.x = this.xCount * this.tSize.x; //вычисление 
        this.mapSize.y = this.yCount * this.tSize.y; //размера карты
        for (var i = 0; i < this.mapData.tilesets.length; i++) {
            var img = new Image();
            img.onload = function () {
                mapManager.imgLoadCount++;
                if (mapManager.imgLoadCount === mapManager.mapData.tilesets.length) {
                    mapManager.imgLoaded = true;  //загружены все изображения
                }
            };
            img.src = this.mapData.tilesets[i].image; //задание пути к изображению
            var t = this.mapData.tilesets[i]; // забираем tileset из карты
            var ts = { // создаём свой объект tileset
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / mapManager.tSize.x),
                yCount: Math.floor(t.imageheight / mapManager.tSize.y),
                tileW: t.imagewidth,
                tileH: t.imageheight
            };
            this.tilesets.push(ts);
        }
        this.jsonLoaded = true; // true, когда разобрали весь JSON
    },

    getTile: function (tileIndex) { // получение блока по его индексу из tileset
        var tile = {
            img: null,
            px: 0,
            py: 0,
            tileW: 0,
            tileH: 0,
            name: null
        };
        var tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        tile.tileH = tileset.tileH;
        tile.tileW = tileset.tileW;
        tile.name = tileset.name;
        var id = tileIndex - tileset.firstgid;
        var x = id % tileset.xCount;
        var y = Math.floor(id / tileset.xCount);
        tile.px = x * mapManager.tSize.x;
        tile.py = y * mapManager.tSize.y;
        return tile;
    },

    getTileset: function (tileIndex) {
        for (var i = mapManager.tilesets.length - 1; i >= 0; i--) {
            if (mapManager.tilesets[i].firstgid <= tileIndex) {
                return mapManager.tilesets[i];
            }
        }
        return null;
    },

    getTilesetIdx: function (x, y) {
        var wX = x;
        var wY = y;
        var idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);
        var arr = this.tLayer[0].data;
        return arr[idx];
    },

    parseEntities: function () {
        if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            setTimeout(function () {
                mapManager.parseEntities();
            }, 100);
        } else {
            for (var j = 0; j < this.mapData.layers.length; j++) {
                if (this.mapData.layers[j].type === 'objectgroup') {
                    var entities = this.mapData.layers[j];
                    for (var i = 0; i < entities.objects.length; i++) {
                        var e = entities.objects[i];
                        try {
                            var obj = Object.create(gameManager.factory[e.type]);
                            obj.name = e.name;
                            obj.pos_x = e.x;
                            obj.pos_y = e.y;
                            obj.size_x = e.width;
                            obj.size_y = e.height;
                            gameManager.entities.push(obj);
                            if (obj.name === "player1") gameManager.player1 = obj;
                            if (obj.name === "player2") {
                                gameManager.player2 = obj;
                            }

                        } catch (ex) {
                            console.log("" + e.gid + e.type + ex);
                        }
                    }
                }
            }
        }
    },

    centerAt: function (x, y) {
        if (x < this.view.w / 2) {
            this.view.x = 0;
        } else if (x > this.mapSize.x - this.view.w / 2) {
            this.view.x = this.mapSize.x - this.view.w;
        } else {
            this.view.x = x - (this.view.w / 2);
        }

        if (y < this.view.h / 3) {
            this.view.y = 0;
        } else if (y > this.mapSize.y - this.view.h) {
            this.view.y = this.mapSize.y - this.view.h;
        } else {
            this.view.y = y - (this.view.h / 3);
        }
    }
};

