function round0(value) {
    return Math.round(value);
}

function round1(value) {
    return Math.round(value * 10) / 10;
}

function round3(value) {
    return Math.round(value * 1000) / 1000;
}

function round4(value) {
    return Math.round(value * 10000) / 10000;
}

function seс_to_min(sec) {
    m = Math.floor(sec / 60);
    s = Math.floor(sec - m * 60);
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;
    return m + ":" + s + " (" + Math.round(sec) + " сек.)";
}

function csl(v){
    console.log(v);
}

class Gr {
    constructor(width, height, name_y) {
        this.h = height; //ширина
        this.w = width; //высота
        //Отступы до координатного поля
        this.offset = {
            left: 50, //отступ до оси X с лево
            right: 30, //отступ до оси X  с право
            top: 20, //отступ с верху
            bottom: 30 //отступ до оси Y с низу
        };
        //Линии осей
        this.line_ax = {
            color: '#000000',
            thickness: '1px',
            crossing: 3
        };
        //Линии сетки
        this.line_grid = {
            color: '#828389',
            thickness: '.5px',
            crossing: 3
        };
        //Линия значений
        this.line_wight = {
            color: '#ff0000',
            thickness: '2px',
            crossing: 3
        };

        //начало координат
        this.zerro_point = [this.w - this.offset_x, this.h - this.offset_y];

        //this.name_y = name_y;
        //this.step_grid_x = 20; //Шаг оси X
        //this.step_grid_y = 20; //Шаг оси Y
        this.w_x = this.w - this.offset.left - this.offset.right; //Длина оси x
        this.w_y = this.h - this.offset.top - this.offset.bottom; //Длина оси y
        //this.os_y = [this.offset_x, this.h - this.offset_y + 5, this.offset_x, this.offset_ower]; //линия оси X
        //this.os_x = [this.offset_x - 5, this.h - this.offset_y, this.w - this.offset_ower, this.h - this.offset_y]; //линия оси Y
        this.value_x = {
            min: 0,
            max: 910,
            step: 60,
            // brutto: this.value_x.max - this.value_x.min
        };
        this.value_y = {
            min: 9000,
            max: 21490,
            step: 500
        };

        this.netto = 0;
        this.brutto = 0; //вес металла
        this.time_all = 0;
        this.time_1 = 0;
        this.time_2 = 0;
        this.zerro_wight = 0;

    }

    CalcData() {
        /*
        this.brutto = this.steps.wight1 + this.steps.wight2; //вес металла
        this.time_all = this.steps.wight1 / this.steps.speed1 + this.steps.wight2 / this.steps.speed2;
        this.time_1 = this.steps.wight1 / this.steps.speed1;
        this.time_2 = this.steps.wight2 / this.steps.speed2;
        this.zerro_wight = this.netto - this.brutto;
        this.value_y.max = this.netto;
        this.value_y.min = this.brutto;*/

    }
    convert_coord_point(x, y) {
        return [x + this.offset_x, y + (this.h - this.offset_y)];
    }
    convert_coord_x(x) {
        return x + this.offset.left;
    }
    convert_coord_y(y) {
        return (this.h - this.offset.bottom) - y;

    }
    convert_coord_line(x1, y1, x2, y2) {
        return [x1 + this.offset.left, (this.h - this.offset.bottom) - y1, x2 + this.offset.left, (this.h - this.offset.bottom) - y2];

    }
    paint(snap) {
        //this.CalcData();
        snap.clear();
        //Маркер стрелок
        this.arrow = snap.polygon([0, 10, 4, 10, 2, 0, 0, 10]).attr({
            fill: this.line_ax.color
        }).transform('r90');
        this.marker = this.arrow.marker(0, 0, 10, 10, 0, 5);

        //округление координат до шага
        this.y_min_to_Grid = Math.floor(this.value_y.min / this.value_y.step) * this.value_y.step;
        this.y_max_to_Grid = (Math.floor(this.value_y.max / this.value_y.step) + 1) * this.value_y.step;
        this.grid_ko_y = this.w_y / (this.y_max_to_Grid - this.y_min_to_Grid);
        this.x_min_to_Grid = Math.floor(this.value_x.min / this.value_x.step) * this.value_x.step;
        this.x_max_to_Grid = (Math.floor(this.value_x.max / this.value_x.step) + 1) * this.value_x.step;
        this.grid_ko_x = this.w_x / (this.x_max_to_Grid - this.x_min_to_Grid);
        //Сетка X
        for (var i = this.y_min_to_Grid; i <= this.y_max_to_Grid; i = i + this.value_y.step) {
            snap.polyline(this.convert_coord_line(-5, this.grid_ko_y * (i - this.y_min_to_Grid), this.w_x, this.grid_ko_y * (i - this.y_min_to_Grid))).attr({
                stroke: this.line_grid.color,
                strokeWidth: this.line_grid.thickness
            });
            snap.text(this.convert_coord_x(-35), this.convert_coord_y(this.grid_ko_y * (i - this.y_min_to_Grid) - 2), i).attr({
                'font-size': 12
            });
        }


        //Сетка Y


        for (var i = this.x_min_to_Grid; i <= this.x_max_to_Grid; i = i + this.value_x.step) {
            snap.polyline(this.convert_coord_line(this.grid_ko_x * (i - this.x_min_to_Grid), -5, this.grid_ko_x * (i - this.x_min_to_Grid), this.w_y)).attr({
                stroke: this.line_grid.color,
                strokeWidth: this.line_grid.thickness
            });

            snap.text(this.convert_coord_x(this.grid_ko_x * (i - this.x_min_to_Grid) - 10), this.convert_coord_y(-15), i).attr({
                'font-size': 12
            });
        }


        // Ось х
        var x_ax = snap.polyline(this.offset.left - this.line_ax.crossing, this.h - this.offset.bottom, this.w - this.offset.right, this.h - this.offset.bottom)
            .attr({
                stroke: this.line_ax.color,
                strokeWidth: this.line_ax.thickness,
                markerEnd: this.marker
            });
        //Ось У
        var y_ax = snap.polyline(this.offset.left, this.h - this.offset.bottom + this.line_ax.crossing, this.offset.left, this.offset.top).attr({
            stroke: this.line_ax.color,
            strokeWidth: this.line_ax.thickness,
            markerEnd: this.marker
        });
    }
}
