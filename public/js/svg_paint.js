class svg_paint {
    constructor(paper, metallSpeed, width, height) {
        this.paper = paper;
        this.metallSpeed = metallSpeed;
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

    paint() {
        console.log("рисовалка");
    }
}
