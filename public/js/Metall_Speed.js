
class MetallSpeed {
    constructor() {
        this.wight_metall = 10000;
        this.p_metall = 7800;
        this.d_slide_channel = 45;
        this.d_Ladle = 1200;
        this.volume_metall = .1;
        this.height_metall = .1;
        this.speed_kg_metall = .1;
        this.speed_mc_metall = .1;
        this.k_pddm = 0.9;
        this.K_si = Math.sqrt(1 / (1 + this.k_pddm));
        this.calc();
        this.wight_time = [[0, 0, 0]];
    };
    calc() {
        this.volume_metall = this.wight_metall / (this.p_metall);
        this.height_metall = this.volume_metall / (Math.PI * Math.pow((this.d_Ladle / 2) / 1000, 2));
        this.K_si = Math.sqrt(1 / (1 + this.k_pddm));
        this.speed_mc_metall = this.K_si * Math.sqrt(2 * 9.8 * this.height_metall);
        var p_lit = Math.PI * (Math.pow(this.d_slide_channel / 1000, 2) / 4);
        this.speed_kg_metall = this.speed_mc_metall * this.p_metall * p_lit;
        this.wight_time = [];

        var gwigth = this.wight_metall;
        var gspeed = 0
        var time = 0;
        while (gwigth >= 10) {

            this.wight_time.push([time, gwigth, this.wigth_speed(gwigth)]);

            time++;
            gwigth = gwigth - this.wigth_speed(gwigth);
        }
    }
    wigth_speed(gwigth) {
        var volume_metall = gwigth / (this.p_metall);
        var height_metall = volume_metall / (Math.PI * Math.pow((this.d_Ladle / 2) / 1000, 2));
        var K_si = Math.sqrt(1 / (1 + this.k_pddm));
        var speed_mc_metall = K_si * Math.sqrt(2 * 9.8 * height_metall);
        var p_lit = Math.PI * (Math.pow(this.d_slide_channel / 1000, 2) / 4);
        var speed_kg_metall = speed_mc_metall * this.p_metall * p_lit;
        //var wigth_speed = [gwigth, 10];
        return speed_kg_metall;
    }
};

var metallSpeed = new MetallSpeed();

$(document).ready(function () {

    $("#wight_metall").spinner({
        max: 12000,
        min: 1000,
        step: 100,
        page: 10,
        numberFormat: "n",
        stop: function (event, ui) {
            metallSpeed.wight_metall = $(this).spinner('value');

            update();
        },
        change: function (event, ui) {
            metallSpeed.wight_metall = $(this).spinner('value');
            metallSpeed.calc();
            update();
        }

    });

    $("#p_metall").spinner({
        max: 10000,
        min: 5000,
        page: 10,
        step: 10,
        start: 7800,
        numberFormat: "n",
        stop: function (event, ui) {
            metallSpeed.p_metall = $(this).spinner('value');
            update();
        },
        change: function (event, ui) {
            metallSpeed.p_metall = $(this).spinner('value');
            update();
        }

    });

    $("#d_slide_channel").spinner({
        max: 80,
        min: 30,
        step: 5,
        start: 45,
        numberFormat: "C",
        stop: function (event, ui) {
            metallSpeed.d_slide_channel = $(this).spinner('value');
            update();
        },
        change: function (event, ui) {
            metallSpeed.d_slide_channel = $(this).spinner('value');
            update();
        }
    });

    $("#d_Ladle").spinner({
        max: 1500,
        min: 500,
        step: 10,
        start: 1200,
        numberFormat: "C",
        stop: function (event, ui) {
            metallSpeed.d_Ladle = $(this).spinner('value');
            update();
        },
        change: function (event, ui) {
            metallSpeed.d_Ladle = $(this).spinner('value');
            update();
        }
    });
    g_w = new Dygraph(
        document.getElementById("svg_wight"), metallSpeed.wight_time, {
            title: 'Изменение веса и скорости во времени.',
            labels: ['Время', 'Вес', "Скорость"],
            ylabel: 'Вес (кг.)',
            xlabel: 'Время (сек.)',
            colors: ['#f80b0b', '#0bf826'],
            strokeWidth: 3,
            drawPoints: true,
            pointSize: 1,
            highlightCircleSize: 6,
            //labelsDiv: document.getElementById("labels"),
            //labels: [ 'Date', 'Y1', 'Y2', 'Y3', 'Y4' ],
            //ylabel: 'Primary y-axis',
            y2label: 'Cкорость (кг/сек).',
            //dyLegend(show = "follow"),
            series: {
                'Вес': {
                    axis: 'y'
                },
                'Скорость': {
                    axis: 'y2'
                },
                axes: {
                    y: {
                        // set axis-related properties here
                        drawGrid: false,
                        independentTicks: false
                    },
                    y2: {
                        // set axis-related properties here
                        //labelsKMB: true,
                        drawGrid: true,
                        independentTicks: true
                    }
                }
            }
        }
    );
    update_start();


    function update_start() {
        $("#wight_metall").spinner("value", metallSpeed.wight_metall);
        $("#p_metall").spinner("value", metallSpeed.p_metall);
        $("#d_slide_channel").spinner("value", metallSpeed.d_slide_channel);
        $("#d_Ladle").spinner("value", metallSpeed.d_Ladle);
        update();
    }


    function update() {
        metallSpeed.calc();
        //console.log(metallSpeed);
        $("#volume_metall").text(round3(metallSpeed.volume_metall));
        $("#height_metall").text(round3(metallSpeed.height_metall));
        $("#speed_mc_metall").text(round4(metallSpeed.speed_mc_metall));
        $("#speed_kg_metall").text(round4(metallSpeed.speed_kg_metall));

        g_w.updateOptions({
            'file': metallSpeed.wight_time
        });
    }
});
