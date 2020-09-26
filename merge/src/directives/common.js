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
        var str = baseHour;
        var arr = str.split(':');
        var hs = parseInt(arr[0]*3600);
        var ms = parseInt(arr[1]*60);
        var ss = parseInt(arr[2]);
        var seconds = hs + ms + ss;
        return seconds;
    }
}
