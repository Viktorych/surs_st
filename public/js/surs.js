//var DATA = new Data();
var timer = 0;
var time = 0;
var time_speed = 200;
var slide = 0
var milt = new Melt();
var ingot = new Ingot();
var ladle = new Ladle();
var w_m = 0;
milt.set(ingot, ladle);

$(document).ready(function () {
    $("#gate_slider").slider({
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        create: function (event, ui) {
            $("#custom-handle").text($(this).slider("value") + "%");
            slide = $(this).slider("value") / 100;
        },
        slide: function (event, ui) {
            $("#custom-handle").text(ui.value + "%");
            slide = $(this).slider("value") / 100;
        },
        change: function (event, ui) {
            $("#custom-handle").text(ui.value + "%");
            slide = $(this).slider("value") / 100;
        },
        disabled: true
    });

    $("#count_ingot").spinner({
        min: 1,
        max: 8,
        step: 1,
        start: 1,
        numberFormat: "n",
        stop: function (event, ui) {
            milt.setCountIngot($(this).spinner('value'));
            update();
        },
        change: function (event, ui) {
            milt.setCountIngot($(this).spinner('value'));
            update();
        }

    });
    $("#count_ingot").spinner("value", milt.count_ingot);


    $("#wight_ladle").spinner({
        max: 25000,
        min: 15000,
        step: 500,
        start: 19000,
        numberFormat: "C",
        change: function (event, ui) {
            set_brutto_ladle();
        },
        stop: function (event, ui) {
            set_brutto_ladle();
        }


    });
    $("#wight_empty_ladle").spinner({
        max: 10000,
        min: 8500,
        step: 100,
        start: 8500,
        numberFormat: "C",
        change: function (event, ui) {
            set_brutto_ladle();
        },
        stop: function (event, ui) {
            set_brutto_ladle();
        }
    });

    $("#clear").button().click(function () {
        clear_data();
    });

    $("#select_ingot").selectmenu();

    g_w = new Dygraph(
        document.getElementById("svg_wight"), milt.data_wight, {
            title: 'Изменение веса  во времени.',
            labels: ['Время', 'Мин', 'Макс', 'Ср.', 'Реал.'],
            ylabel: 'Вес (кг.)',
            xlabel: 'Время (сек.)',
            colors: ['#000aff', '#000aff', '#0bf826', '#ff0000'],
            strokeWidth: 1,
            drawPoints: true,
            pointSize: 1,
            highlightCircleSize: 3,
            fillGraph : true,
            fillAlpha : 0.05


        }
    );
    g_s = new Dygraph(
        document.getElementById("svg_speed"), milt.data_speed, {
            title: 'Изменение скорости  во времени.',
            labels: ['Время', 'Мин', 'Макс', 'Ср.', 'Реал.'],
            ylabel: 'Скорость (кг/сек.)',
            xlabel: 'Время (сек.)',
            colors: ['#000aff', '#000aff', '#0bf826', '#ff0000'],
            strokeWidth: 1,
            drawPoints: true,
            pointSize: 1,
            highlightCircleSize: 3,


        }
    );
    g_s_s = new Dygraph(
        document.getElementById("svg_sim_speed"), milt.data_sim_speed, {
            title: 'Скорость  во времени.',
            labels: ['Время', 'Мин', 'Макс', 'Реал.'],
            ylabel: 'Скорость (кг/сек.)',
            xlabel: 'Время (сек.)',
            colors: ['#000aff', '#000aff', '#ff0000'],
            strokeWidth: 3,
            drawPoints: true,
            pointSize: 1,
            highlightCircleSize: 5,


        }
    );
    g_s_w = new Dygraph(
        document.getElementById("svg_sim_wight"), milt.data_sim_wight, {
            title: 'Вес  во времени.',
            labels: ['Время', 'Мин', 'Макс', 'Ср', 'Реал.'],
            ylabel: 'Вес кг.)',
            xlabel: 'Время (сек.)',
            colors: ['#000aff', '#000aff', '#0bf826', '#ff0000'],
            strokeWidth: 5,
            drawPoints: true,
            pointSize: 1,
            highlightCircleSize: 8,
            fillGraph : true,
            fillAlpha : 0.05


        }
    );
    var sync = Dygraph.synchronize(g_w, g_s, {
        selection: true,
        zoom: false

    });

    $("#brutto_ladle").text(ladle.wight_metall_ladle + " кг.");

    update();

    function update() {
        $("#wight_ladle").spinner('value', ladle.wight_ladle);
        $("#brutto_ladle").text(ladle.wight_metall_ladle + " кг.");
        $("#ingot_wight").text(milt.wight + " кг.");
        $("#start_wight").text(milt.start_wight + " кг.");
        $("#start_time_min").text(milt.ingot.start.time_min + " сек.");
        $("#start_time_max").text(milt.ingot.start.time_max + " сек.");
        $("#body_wight").text(milt.body_wight + " кг.");
        $("#body_time_min").text(milt.ingot.body.time_min + " сек.");
        $("#body_time_max").text(milt.ingot.body.time_max + " сек.");
        $("#head_wight").text(milt.head_wight + " кг.");
        $("#head_time_min").text(milt.ingot.head.time_min + " сек.");
        $("#head_time_max").text(milt.ingot.head.time_max + " сек.");

        $("#start_speed_min").text(milt.start_speed_min.toFixed(1) + " кг/сек.");
        $("#start_speed_max").text(milt.start_speed_max.toFixed(1) + " кг/сек.");
        $("#body_speed_min").text(milt.body_speed_min.toFixed(1) + " кг/сек.");
        $("#body_speed_max").text(milt.body_speed_max.toFixed(1) + " кг/сек.");
        $("#head_speed_min").text(milt.head_speed_min.toFixed(1) + " кг/сек.");
        $("#head_speed_max").text(milt.head_speed_max.toFixed(1) + " кг/сек.");

        $("#time_all_min").text(milt.time_all_min + " сек.");
        $("#time_all_max").text(milt.time_all_max + " сек.");
        $("#ledWight").text("-----");
        $("#ledSpeed").text("--");
        $("#ledTime").text("---");
        g_w.updateOptions({
            'file': milt.data_wight
        });
        g_s.updateOptions({
            'file': milt.data_speed
        });
    }


    $("#radio input").button();
    $("#radio").on('keydown', function (event) {
        return false;
    });
    //$("#radio").off('keypress');
    $("#radio_speed_time input").button();
    //$("#radio_speed_time input").off('keypress');
    $('#radio').on("change", function (event) {
        var target = event.target.id;
        switch (target) {
            case "btn_start":
                sim_start();
                break;
            case "btn_stop":
                sim_stop();
                break;
        }
    });
    $('#radio_speed_time').on("change", function (event) {
        var target = event.target.id;
        switch (target) {
            case "btn_1x":
                time_speed = 1000;
                break;
            case "btn_2x":
                time_speed = 500;
                break;
            case "btn_5x":
                time_speed = 200;
                break;
            case "btn_10x":
                time_speed = 100;
                break;
            case "btn_100x":
                time_speed = 50;
                console.log(time_speed);
                break;
        }
    });
    $('#sim_graph_select').on("change", function (event) {
        var target = event.target.id;
        switch (target) {
            case "g_s_s":
                $('#svg_sim_wight').hide('slow');
                $('#svg_sim_speed').show(200);
                $(".ui-slider-handle").focus();
                break;
            case "g_s_w":
                $('#svg_sim_speed').hide('slow');
                $('#svg_sim_wight').show(200);
                $(".ui-slider-handle").focus();
                break;
        }
    });
    $("#sim_graph_select").on('keydown', function (event) {
        return false;
    });


    function sim_start() {
        $("#gate_slider").slider("value", 100);
        $("#gate_slider").slider("enable");
        $(".ui-slider-handle").focus();
        $("#ledWight").text(ladle.wight_ladle);
        $("#ledTime").text(0);
        $("#ledSpeed").text(0);
        $("#count_ingot").spinner("option", "disabled", true);
        $("#wight_ladle").spinner("option", "disabled", true);
        $("#wight_empty_ladle").spinner("option", "disabled", true);
        $("#select_ingot").selectmenu("option", "disabled", true);
        $("#radio_speed_time input").button("option", "disabled", true);
        $("#clear").button("option", "disabled", true);
        time = 0;
        w_m = ladle.wight_ladle //-ladle.wight_empty_ladle;
        timer = setInterval(timed, time_speed);
        //$("#gate_slider").foc;

    }

    function sim_stop() {

        $("#gate_slider").slider("value", 0);
        $("#gate_slider").slider("disable");
        $("#ledSpeed").text("--");
        $("#ledWight").text("-----");
        $("#ledTime").text("---");
        $("#count_ingot").spinner("option", "disabled", false);
        $("#wight_ladle").spinner("option", "disabled", false);
        $("#wight_empty_ladle").spinner("option", "disabled", false);
        $("#select_ingot").selectmenu("option", "disabled", false);
        $("#radio_speed_time input").button("option", "disabled", false);
        $("#clear").button("option", "disabled", false);
        clearTimeout(timer);
        //clear_data();

    }

    function clear_data() {
        //console.log(milt.data_wight)
        for (var i = 0; i < milt.data_wight.length; i++) {
            milt.data_wight[i][4] = null;
            milt.data_speed[i][4] = null;
        }
        //console.log(milt.data_sim_speed);
        g_w.updateOptions({
            'file': milt.data_wight
        });
        g_s.updateOptions({
            'file': milt.data_speed
        });
        for (var i = 0; i < 19; i++) {
            milt.data_sim_speed[i] = [i,
                                      null,
                                     null,
                                     null];
        };
        for (var i = 0; i < 19; i++) {
            milt.data_sim_wight[i] = [i,
                                      null,
                                     null,
                                     null, null];
        };
        g_s_s.updateOptions({
            'file': milt.data_sim_speed
        });
        g_s_w.updateOptions({
            'file': milt.data_sim_wight
        });

    }

    function timed() {


        if (time <= milt.time_all_max) {
            w_s = calc_timer(time, w_m, 45 * slide);
            $("#ledTime").text(time);
            $("#ledSpeed").text(round0(w_s));
            $("#ledWight").text(round0(w_m));

        } else {
            clearTimeout(timer);
            //alert("Симуляция окончена");
            $('#btn_start').prop('checked', false).button("refresh");
            $('#btn_stop').prop('checked', true).button("refresh");
            sim_stop();
            alert("!---------НАЛИТО--------!");
        }
        time++;



    };

    function set_brutto_ladle() {
        ladle.set($("#wight_ladle").spinner('value'), $("#wight_empty_ladle").spinner('value'));
        $("#brutto_ladle").text(ladle.wight_metall_ladle + " кг.");
        milt.calc_data_wight();
        g_w.updateOptions({
            'file': milt.data_wight
        });
    }

    function calc_timer(t, wight_metall, slide) {
        var volume_metall = (wight_metall - ladle.wight_empty_ladle) / (milt.p_metall);
        var height_metall = volume_metall / (Math.PI * Math.pow((milt.d_Ladle / 2) / 1000, 2));
        var speed_mc_metall = milt.K_si * Math.sqrt(2 * 9.8 * height_metall);
        var p_lit = Math.PI * (Math.pow(slide / 1000, 2) / 4);
        var speed_kg_metall = speed_mc_metall * milt.p_metall * p_lit;
        milt.data_wight[t][4] = wight_metall;
        milt.data_speed[t][4] = speed_kg_metall;
        if (t <= 10) {
            for (var i = 0; i < 20; i++) {
                var r = t + i;
                milt.data_sim_speed[i][0] = i;
                milt.data_sim_speed[i][1] = milt.data_speed[i][1];
                milt.data_sim_speed[i][2] = milt.data_speed[i][2];
                milt.data_sim_speed[i][3] = milt.data_speed[i][4];
            }
        } else if (t < milt.time_all_max - 10) {
            for (var i = -10; i < 10; i++) {
                var r = t + i;
                var n = i + 10;
                milt.data_sim_speed[n][0] = r;
                milt.data_sim_speed[n][1] = milt.data_speed[r][1];
                milt.data_sim_speed[n][2] = milt.data_speed[r][2];
                milt.data_sim_speed[n][3] = milt.data_speed[r][4];
            }
        }

        if (t <= 10) {
            for (var i = 0; i < 20; i++) {
                var r = t + i;
                milt.data_sim_wight[i][0] = i;
                milt.data_sim_wight[i][1] = milt.data_wight[i][1];
                milt.data_sim_wight[i][2] = milt.data_wight[i][2];
                milt.data_sim_wight[i][3] = milt.data_wight[i][3];
                milt.data_sim_wight[i][4] = milt.data_wight[i][4];
            }
        } else if (t < milt.time_all_max - 10) {
            for (var i = -10; i < 10; i++) {
                var r = t + i;
                var n = i + 10;
                milt.data_sim_wight[n][0] = r;
                milt.data_sim_wight[n][1] = milt.data_wight[r][1];
                milt.data_sim_wight[n][2] = milt.data_wight[r][2];
                milt.data_sim_wight[n][3] = milt.data_wight[r][3];
                milt.data_sim_wight[n][4] = milt.data_wight[r][4];
            }
        }
        g_w.updateOptions({
            'file': milt.data_wight
        });
        g_s.updateOptions({
            'file': milt.data_speed
        });
        g_s_s.updateOptions({
            'file': milt.data_sim_speed
        });
        g_s_w.updateOptions({
            'file': milt.data_sim_wight
        });
        g_s.updateOptions({
            'file': milt.data_speed
        });
        w_m = w_m - speed_kg_metall;
        return speed_kg_metall;
    }
});

