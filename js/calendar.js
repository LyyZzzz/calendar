$(function () {

  //必要的数据
  //今天的年 月 日 ；本月的总天数；本月第一天是周几？？？
  var iNow = 0;
  var year = 0;
  var month = 0;
  var today = 0;
  var clickDay = 0; //点击了哪一天
  var todayJournal = "";
  var hasFestival = ""; //当天是否有节日

  function run(n) {

    var oDate = new Date(); //定义时间
    oDate.setMonth(oDate.getMonth() + n); //设置月份
    year = oDate.getFullYear(); //年
    month = oDate.getMonth(); //月
    today = oDate.getDate(); //日

    //公历节日
    var gregorianFestivals = {
      '0101': '元旦',
      '0214': '情人节',
      '0308': '妇女节',
      '0312': '植树节',
      '0401': '愚人节',
      '0501': '劳动节',
      '0504': '青年节',
      '0512': '护士节',
      '0601': '儿童节',
      '0701': '建党节',
      '0801': '建军节',
      '0910': '教师节',
      '1001': '国庆节',
      '1224': '平安夜',
      '1225': '圣诞节',
    };

    var lunarFestivals = {
      '腊月三十': '除夕',
      '正月初一': '春节',
      '正月十五': '元宵节',
      '五月初五': '端午节',
      '七月初七': '七夕节',
      '八月十五': '中秋节',
      '九月初九': '重阳节',
    }



    //计算本月有多少天
    var allDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];

    //判断闰年
    if (month == 1) {
      if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
        allDay = 29;
      }
    }

    //判断本月第一天是星期几
    oDate.setDate(1); //时间调整到本月第一天
    var week = oDate.getDay(); //读取本月第一天是星期几
    //console.log(week);

    $(".dateList").empty(); //每次清空
    //插入空白

    for (var i = 0; i < week; i++) {
      $(".dateList").append("<div class='each-date'></div>");
    }

    //日期插入到dateList
    for (var i = 1; i <= allDay; i++) {
      hasFestival = "";
      $(".dateList").append("<div class='each-date date" + i + " ' data-toggle='modal' data-target='#exampleModal'>" +
        "<span class='num'>" + i + "</span>" +
        "<span class='calendar'>" + festivalView(getLunarCalendar(i), month + 1, i) + "</span>" +
        "</div>")
      $(`.date${i}`).attr("festival", hasFestival)
    }
    //标记颜色=====================
    $(".dateList .each-date").each(function (i, elm) {
      var val = $(this).find(".num").text();
      //console.log(val);
      if (n == 0) {
        if (val < today) {
          $(this).addClass('gray')
        } else if (val == today) {
          $(this).children().first().addClass("pink")
        } else if (i % 7 == 0 || i % 7 == 6) {
          $(this).addClass('weekend')
        }
      } else if (n < 0) {
        $(this).addClass('gray')
      } else if (i % 7 == 0 || i % 7 == 6) {
        $(this).addClass('weekend')
      }
    });

    //定义标题日期
    $("#calendar .title").text(year + "年" + (month + 1) + "月");
    $(".each-date").click(function () {
      clickDay = parseInt($(this).text());
      var pageDay = {
        year: year,
        month: month,
        date: clickDay
      };
      // console.log(pageDay);
      var detail = dateDetail({
        'timeStamp': new Date(pageDay.year, pageDay.month, pageDay.date).getTime()
      });
      $("#journal").val(todayJournal);

    });

    /**
     * 获取农历
     */
    function getLunarCalendar(date) {
      let detail = dateDetail({
        'timeStamp': new Date(year, month, date).getTime()
      }).aL.lunarCalendar;
      // return [detail.slice(0, 2),detail.slice(2, 4)]
      return detail
    }

    /**
     * 获取当日是否是农历假日
     */
    function festivalView(lunarCalendar, month, date) {
      if (Object.keys(lunarFestivals).indexOf(lunarCalendar) != -1) {
        hasFestival = lunarFestivals[lunarCalendar]
        return lunarFestivals[lunarCalendar]
      } else {
        let day = (month > 9 ? month + '' : "0" + month) + (date > 9 ? date + '' : "0" + date);
        if (Object.keys(gregorianFestivals).indexOf(day) != -1) {
          hasFestival = gregorianFestivals[day]
          return gregorianFestivals[day]
        } else {
          if (lunarCalendar.indexOf('闰') != -1) {
            return lunarCalendar.slice(5, 7);
          } else {
            return lunarCalendar.slice(2, 4);
          }
        }
      }
    }

    /**
     * 滚动页面时防止tip定位出错
     */
    var contentTop = document.getElementById("content").getBoundingClientRect().top;
    var scrollTop = contentTop > 0 ? 0 : document.documentElement.scrollTop;
    window.onscroll = function () {
      contentTop = document.getElementById("content").getBoundingClientRect().top;
      scrollTop = contentTop > 0 ? 0 : document.documentElement.scrollTop;
    };

    var x = 10;
    var y = 20;
    $(".each-date").mouseenter(function (e) {
      let date = $(this).find(".num").text();
      if (date) {
        let journal = window.localStorage.getItem("yyJournal");
        let obj = journal ? JSON.parse(journal) : {};
        todayJournal = "";
        let day = new Date(year, month, date).getTime() + '';
        if (obj && Object.keys(obj).indexOf(day) != -1) {
          todayJournal = obj[day];
        }
        let arr = "鼠牛虎兔龙蛇马羊猴鸡狗猪".split(/(?!\b)/);
        let todayMsg = dateDetail({
          'timeStamp': new Date(year, month, date).getTime()
        });
        let festival = $(this).attr("festival");
        if (festival) {
          $(".festival-content").show();
          $(".festival-icon").show();
          $(".tip-today").html(festival);
        } else {
          if (n == 0 && date == today) {
            $(".festival-content").show();
            $(".festival-icon").hide();
            $(".tip-today").html("今日");
          } else {
            $(".festival-content").hide();
          }
        }
        $("#tip .tip-week").html(todayMsg.week);
        $("#tip .tip-weekEng").html(todayMsg.weekEng);
        $("#tip .tip-annals").html(todayMsg.aL.annals);
        $("#tip .zodiac").html(arr[(year - 1912) % 12]);
        $("#tip .tip-lunarCalendar").html("农历" + todayMsg.aL.lunarCalendar);
        if (todayJournal) {
          $(".journal-msg").html(todayJournal);
          $(".tip-journal").show();
        } else {
          // $(".journal-msg").html("点击添加日志");
          $(".tip-journal").hide();
        }
        $("#tip").css({
          "top": (e.pageY - scrollTop + y) + "px",
          "left": (e.pageX + x) + "px"
        }).show(); //设置x坐标和y坐标，并且显示
      }
    }).mousemove(function (e) {
      if (e.pageX + x + 300 >= document.body.clientWidth) {
        $("#tip").css({
          "top": (e.pageY - scrollTop + y) + "px",
          "left": (e.pageX - 200) + "px"
        }); //设置x坐标和y坐标，并且显示
      } else {
        $("#tip").css({
          "top": (e.pageY - scrollTop + y) + "px",
          "left": (e.pageX + x) + "px"
        });
      }
    }).mouseleave(function () {
      $("#tip").hide(); //移除
    });

    $(".btn-primary").click(function () {
      let journal = $("#journal").val();
      let day = new Date(year, month, clickDay).getTime();
      yyJournal = window.localStorage.getItem("yyJournal");
      let obj = yyJournal ? JSON.parse(yyJournal) : {};
      obj[day] = journal;
      window.localStorage.setItem('yyJournal', JSON.stringify(obj))
    })
  };



  run(0);

  $(".a1").click(function () {
    iNow--;
    run(iNow);
    $("#calendar .calendar-bg").css("background-image", `url("img/${month}.jpg")`)
    $(".calendarImg").css("background-image", `url("img/${month}.jpg")`)
  });

  $(".a2").click(function () {
    iNow++;
    run(iNow);
    $("#calendar .calendar-bg").css("background-image", `url("img/${month}.jpg")`)
    $(".calendarImg").css("background-image", `url("img/${month}.jpg")`)
  });

  $(".home-btn").click(function () {
    iNow = 0;
    run(iNow);
  });

  $(".a1").hover(function () {
    $(".left-circle").css("background-image", 'url("img/left-circle.png")')
  }, function () {
    $(".left-circle").css("background-image", 'url("img/left-circle1.png")')
  })

  $(".a2").hover(function () {
    $(".right-circle").css("background-image", 'url("img/right-circle.png")')
  }, function () {
    $(".right-circle").css("background-image", 'url("img/right-circle1.png")')
  })

  $(".home-btn").hover(function () {
    $(".home-btn").css("background-image", 'url("img/home.png")')
  }, function () {
    $(".home-btn").css("background-image", 'url("img/home1.png")')
  })
});