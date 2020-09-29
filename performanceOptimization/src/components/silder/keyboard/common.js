export default {
    getParam(data) {
        let url = '';
        for (var k in data) {
            let value = data[k] !== undefined ? data[k] : '';
            url += `&${k}=${encodeURIComponent(value)}`
        }
        return url ? url.substring(1) : ''
    },
    formatDate(datetime, baseHour) {
        // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
        var year = datetime.getFullYear(),
            month = ("0" + (datetime.getMonth() + 1)).slice(-2),
            date = ("0" + datetime.getDate()).slice(-2),
            hour = baseHour ? baseHour : ("0" + datetime.getHours()).slice(-2),
            minute = ("0" + datetime.getMinutes()).slice(-2),
            second = ("0" + datetime.getSeconds()).slice(-2);
        // 拼接
        var result = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        // 返回
        return result;
    },
    timeDifference(baseHour) {
//定义两个变量time1,time2分别保存开始和结束时间
        var today_time = new Date();    // 获取当前时间
        var time1 = this.formatDate(today_time, baseHour);
        let time2 = this.formatDate(today_time); // 时间转换

//判断开始时间是否大于结束日期
        if (time1 > time2) {
            alert("开始时间不能大于结束时间！");
            return false;
        }

//截取字符串，得到日期部分"2009-12-02",用split把字符串分隔成数组
        var begin1 = time1.substr(0, 10).split("-");
        var end1 = time2.substr(0, 10).split("-");

//将拆分的数组重新组合，并实例成化新的日期对象
        var date1 = new Date(begin1[1] + -+begin1[2] + -+begin1[0]);
        var date2 = new Date(end1[1] + -+end1[2] + -+end1[0]);

//得到两个日期之间的差值m，以分钟为单位
//Math.abs(date2-date1)计算出以毫秒为单位的差值
//Math.abs(date2-date1)/1000得到以秒为单位的差值
//Math.abs(date2-date1)/1000/60得到以分钟为单位的差值
        var m = parseInt(Math.abs(date2 - date1) / 1000 / 60);

//小时数和分钟数相加得到总的分钟数
//time1.substr(11,2)截取字符串得到时间的小时数
//parseInt(time1.substr(11,2))*60把小时数转化成为分钟
        var min1 = parseInt(time1.substr(11, 2)) * 60 + parseInt(time1.substr(14, 2));
        var min2 = parseInt(time2.substr(11, 2)) * 60 + parseInt(time2.substr(14, 2));

//两个分钟数相减得到时间部分的差值，以分钟为单位
        var n = min2 - min1;

//将日期和时间两个部分计算出来的差值相加，即得到两个时间相减后的分钟数
        var minutes = m + n;
        return minutes;
    }
}
