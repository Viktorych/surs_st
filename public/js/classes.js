class Melt { //Плавка
    constructor() {
        this.melt_name = '001'; //Наименование плавки
        this.ingot_name = 'MR1'; //Тип слитка
        this.count_ingot = 8; //Количесво слитков
        this.head_wight = 0;
        this.body_wight = 0;
        this.start_wight = 700;
        this.wight = 0;
        this.data_wight = [[0, 0, 0, 0, null]];
        this.data_speed = [[0, 0, 0, 0]];
        this.data_sim_speed = [[0, 0, 0, 0]];
        this.data_sim_wight = [[0, 0, 0, 0, 0]];
        this.p_metall = 7800;
        this.k_pddm = 0.9;
        this.K_si = Math.sqrt(1 / (1 + this.k_pddm));
        this.d_Ladle = 1200;
    }
    set(Ingot, ladle) {
        this.ingot = Ingot;
        this.ladle = ladle;
        this.calc();

    }

    calc() {
        this.body_wight = this.ingot.body_wight * this.count_ingot;
        this.head_wight = this.ingot.head_wight * this.count_ingot;
        this.wight = this.body_wight + this.head_wight + this.start_wight;
        this.start_speed_min = round1(this.start_wight / this.ingot.start.time_min);
        this.start_speed_max = round1(this.start_wight / this.ingot.start.time_max);
        this.start_time_avr = (this.ingot.start.time_min + this.ingot.start.time_max) / 2;
        this.start_speed_avr = round1(this.start_wight / this.start_time_avr);
        this.body_speed_min = round1(this.body_wight / this.ingot.body.time_min);
        this.body_speed_max = round1(this.body_wight / this.ingot.body.time_max);
        this.body_time_avr = (this.ingot.body.time_min + this.ingot.body.time_max) / 2;
        this.body_speed_avr = round1(this.body_wight / this.body_time_avr);
        this.head_speed_min = round1(this.head_wight / this.ingot.head.time_min);
        this.head_speed_max = round1(this.head_wight / this.ingot.head.time_max);
        this.head_time_avr = (this.ingot.head.time_min + this.ingot.head.time_max) / 2;
        this.head_speed_avr = round1(this.head_wight / this.head_time_avr);
        this.time_all_min = this.ingot.start.time_min + this.ingot.body.time_min + this.ingot.head.time_min;
        this.time_all_max = this.ingot.start.time_max + this.ingot.body.time_max + this.ingot.head.time_max;
        this.time_all_avr = this.start_time_avr + this.body_time_avr + this.head_time_avr;
        this.calc_data_wight();
        for (var i = 0; i < 19; i++) {
            this.data_sim_speed.push([i,
                                      null,
                                     null,
                                     null]);
        };
        for (var i = 0; i < 19; i++) {
            this.data_sim_wight.push([i,
                                      null,
                                     null,
                                     null,
                                      null]);
        };

    }

    calc_data_wight() {
        this.data_wight = []
        this.data_speed = []
        var w_min = this.ladle.wight_ladle;
        var w_max = this.ladle.wight_ladle;
        var w_avr = this.ladle.wight_ladle;
        var w_mettal = this.ladle.wight_ladle - this.wight;
        var s_min = this.start_speed_min;
        var s_max = this.start_speed_max;
        var s_avr = this.start_speed_avr;
        for (var i = 0; i <= this.time_all_max; i++) {
            switch (true) {
                case i === 0:

                    break;
                case i > 0 && i <= this.ingot.start.time_min:
                    w_min = w_min - this.start_speed_min;
                    s_min = this.start_speed_min;
                    break;
                case i > this.ingot.start.time_min && i <= this.ingot.body.time_min + this.ingot.start.time_min:
                    w_min = w_min - this.body_speed_min;
                    s_min = this.body_speed_min;
                    break;
                case i > this.ingot.body.time_min + this.ingot.start.time_min && i <= this.time_all_max:
                    w_min = w_min - this.head_speed_min;
                    s_min = this.head_speed_min;
                    if (w_min - w_mettal <= 0) {
                        w_min = null;
                        s_min = null;
                    };
                    break;
            };
            switch (true) {
                case i === 0:

                    break;
                case i > 0 && i <= this.ingot.start.time_max:
                    w_max = w_max - this.start_speed_max;
                    s_max = this.start_speed_max;
                    break;
                case i > this.ingot.start.time_max && i <= this.ingot.body.time_max + this.ingot.start.time_max:
                    w_max = w_max - this.body_speed_max;
                    s_max = this.body_speed_max;
                    break;
                case i > this.ingot.body.time_max + this.ingot.start.time_max && i <= this.time_all_max:
                    w_max = w_max - this.head_speed_max;
                    s_max = this.head_speed_max;
                    break;
            };
            switch (true) {
                case i === 0:

                    break;
                case i > 0 && i <= this.start_time_avr:
                    w_avr = w_avr - this.start_speed_avr;
                    s_avr = this.body_speed_avr;
                    break;
                case i > this.start_time_avr && i <= this.body_time_avr + this.start_time_avr:
                    w_avr = w_avr - this.body_speed_avr;
                    s_avr = this.body_speed_avr;
                    break;
                case i > this.body_time_avr + this.start_time_avr && i <= this.time_all_max:
                    w_avr = w_avr - this.head_speed_avr;
                    s_avr = this.head_speed_avr;
                    if (w_avr - w_mettal <= 0) {
                        w_avr = null;
                        s_avr = null;
                    };
                    break;
            };

            this.data_wight.push([i, w_min, w_max, w_avr, null]);
            this.data_speed.push([i, s_min, s_max, s_avr, null]);
        }

    }

    setCountIngot(count) {
        this.count_ingot = count;
        this.calc();
    }

}

class Ladle {
    constructor() {
        this.wight_ladle = 19000; //вес ковша
        this.wight_empty_ladle = 9400; //вес пустуго ковша
        this.wight_metall_ladle = 0; //вес металла в ковше
        this.calc();
    }
    calc() {
        this.wight_metall_ladle = this.wight_ladle - this.wight_empty_ladle;
    }
    setWight(w) {
        this.wight_ladle = w;
        this.calc();
    }
    setEmptyWight(w) {
        this.wight_empty_ladle = w;
        this.calc();
    }
    set(w, w_e) {
        this.wight_empty_ladle = w_e;
        this.wight_ladle = w;
        this.calc();
    }
}

class Ingot { //Параметры слитка
    constructor() {
        this.head_wight = 65;
        this.body_wight = 990;
        this.wight = this.head_wight + this.body_wightж
        this.start = {
            time_min: 15,
            time_max: 30
        };
        this.body = {
            time_min: 300,
            time_max: 330
        };
        this.head = {
            time_min: 150,
            time_max: 180
        };
    };
}
