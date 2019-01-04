/**
 * Created by Administrator on 2017/1/10 0010.
 */
var dom = document.getElementById("container");
var myChart = echarts.init(dom);
var app = {};
option = null;
var geoCoordMap = {
    '上海': [121.4648,31.2891],
    '东莞': [113.8953,22.901],
    '东营': [118.7073,37.5513],
    '中山': [113.4229,22.478],
    '临汾': [111.4783,36.1615],
    '临沂': [118.3118,35.2936],
    '丹东': [124.541,40.4242],
    '丽水': [119.5642,28.1854],
    '乌鲁木齐': [87.9236,43.5883],
    '佛山': [112.8955,23.1097],
    '保定': [115.0488,39.0948],
    '兰州': [103.5901,36.3043],
    '包头': [110.3467,41.4899],
    '北京': [116.4551,40.2539],
    '北海': [109.314,21.6211],
    '南京': [118.8062,31.9208],
    '南宁': [108.479,23.1152],
    '南昌': [116.0046,28.6633],
    '南通': [121.1023,32.1625],
    '厦门': [118.1689,24.6478],
    '台州': [121.1353,28.6688],
    '合肥': [117.29,32.0581],
    '呼和浩特': [111.4124,40.4901],
    '咸阳': [108.4131,34.8706],
    '哈尔滨': [127.9688,45.368],
    '唐山': [118.4766,39.6826],
    '嘉兴': [120.9155,30.6354],
    '大同': [113.7854,39.8035],
    '大连': [122.2229,39.4409],
    '天津': [117.4219,39.4189],
    '太原': [112.3352,37.9413],
    '威海': [121.9482,37.1393],
    '宁波': [121.5967,29.6466],
    '宝鸡': [107.1826,34.3433],
    '宿迁': [118.5535,33.7775],
    '常州': [119.4543,31.5582],
    '广州': [113.5107,23.2196],
    '廊坊': [116.521,39.0509],
    '延安': [109.1052,36.4252],
    '张家口': [115.1477,40.8527],
    '徐州': [117.5208,34.3268],
    '德州': [116.6858,37.2107],
    '惠州': [114.6204,23.1647],
    '成都': [103.9526,30.7617],
    '扬州': [119.4653,32.8162],
    '承德': [117.5757,41.4075],
    '拉萨': [91.1865,30.1465],
    '无锡': [120.3442,31.5527],
    '日照': [119.2786,35.5023],
    '昆明': [102.9199,25.4663],
    '杭州': [119.5313,29.8773],
    '枣庄': [117.323,34.8926],
    '柳州': [109.3799,24.9774],
    '株洲': [113.5327,27.0319],
    '武汉': [114.3896,30.6628],
    '汕头': [117.1692,23.3405],
    '江门': [112.6318,22.1484],
    '沈阳': [123.1238,42.1216],
    '沧州': [116.8286,38.2104],
    '河源': [114.917,23.9722],
    '泉州': [118.3228,25.1147],
    '泰安': [117.0264,36.0516],
    '泰州': [120.0586,32.5525],
    '济南': [117.1582,36.8701],
    '济宁': [116.8286,35.3375],
    '海口': [110.3893,19.8516],
    '淄博': [118.0371,36.6064],
    '淮安': [118.927,33.4039],
    '深圳': [114.5435,22.5439],
    '清远': [112.9175,24.3292],
    '温州': [120.498,27.8119],
    '渭南': [109.7864,35.0299],
    '湖州': [119.8608,30.7782],
    '湘潭': [112.5439,27.7075],
    '滨州': [117.8174,37.4963],
    '潍坊': [119.0918,36.524],
    '烟台': [120.7397,37.5128],
    '玉溪': [101.9312,23.8898],
    '珠海': [113.7305,22.1155],
    '盐城': [120.2234,33.5577],
    '盘锦': [121.9482,41.0449],
    '石家庄': [114.4995,38.1006],
    '福州': [119.4543,25.9222],
    '秦皇岛': [119.2126,40.0232],
    '绍兴': [120.564,29.7565],
    '聊城': [115.9167,36.4032],
    '肇庆': [112.1265,23.5822],
    '舟山': [122.2559,30.2234],
    '苏州': [120.6519,31.3989],
    '莱芜': [117.6526,36.2714],
    '菏泽': [115.6201,35.2057],
    '营口': [122.4316,40.4297],
    '葫芦岛': [120.1575,40.578],
    '衡水': [115.8838,37.7161],
    '衢州': [118.6853,28.8666],
    '西宁': [101.4038,36.8207],
    '西安': [109.1162,34.2004],
    '贵阳': [106.6992,26.7682],
    '连云港': [119.1248,34.552],
    '邢台': [114.8071,37.2821],
    '邯郸': [114.4775,36.535],
    '郑州': [113.4668,34.6234],
    '鄂尔多斯': [108.9734,39.2487],
    '重庆': [107.7539,30.1904],
    '金华': [120.0037,29.1028],
    '铜川': [109.0393,35.1947],
    '银川': [106.3586,38.1775],
    '镇江': [119.4763,31.9702],
    '长春': [125.8154,44.2584],
    '长沙': [113.0823,28.2568],
    '长治': [112.8625,36.4746],
    '阳泉': [113.4778,38.0951],
    '青岛': [120.4651,36.3373],
    '韶关': [113.7964,24.7028]
};

var BJData = [
    [{name:'北京'}, {name:'上海',value:95}],
    [{name:'北京'}, {name:'广州',value:90}],
    [{name:'北京'}, {name:'西宁',value:80}],
    [{name:'北京'}, {name:'南宁',value:70}],
    [{name:'北京'}, {name:'南昌',value:60}],
    [{name:'北京'}, {name:'拉萨',value:50}],
    [{name:'北京'}, {name:'天津',value:40}],
    [{name:'北京'}, {name:'乌鲁木齐',value:30}],
    [{name:'北京'}, {name:'厦门',value:20}],
    [{name:'北京'}, {name:'常州',value:10}]
];

var SHData = [
    [{name:'上海'},{name:'包头',value:95}],
    [{name:'上海'},{name:'昆明',value:90}],
    [{name:'上海'},{name:'广州',value:80}],
    [{name:'上海'},{name:'郑州',value:70}],
    [{name:'上海'},{name:'哈尔滨',value:60}],
    [{name:'上海'},{name:'重庆',value:50}],
    [{name:'上海'},{name:'长沙',value:40}],
    [{name:'上海'},{name:'北京',value:30}],
    [{name:'上海'},{name:'丹东',value:20}]
];

var GZData = [
    [{name:'广州'},{name:'福州',value:95}],
    [{name:'广州'},{name:'太原',value:90}],
    [{name:'广州'},{name:'长春',value:80}],
    [{name:'广州'},{name:'大同',value:70}],
    [{name:'广州'},{name:'西安',value:60}],
    [{name:'广州'},{name:'成都',value:50}],
    [{name:'广州'},{name:'常州',value:40}],
    [{name:'广州'},{name:'北京',value:30}],
    [{name:'广州'},{name:'北海',value:20}],
    [{name:'广州'},{name:'海口',value:10}]
];

var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
            res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                coords: [fromCoord, toCoord]
            });
        }
    }
    return res;
};

var color = ['#a6c84c', '#ffa022', '#46bee9'];
var series = [];
[['北京', BJData], ['上海', SHData], ['广州', GZData]].forEach(function (item, i) {
    series.push({
            name: item[0] + ' Top10',
            type: 'lines',
            zlevel: 1,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3
            },
            lineStyle: {
                normal: {
                    color: color[i],
                    width: 0,
                    curveness: 0.2
                }
            },
            data: convertData(item[1])
        },
        {
            name: item[0] + ' Top10',
            type: 'lines',
            zlevel: 2,
            effect: {
                //show: true,
                //period: 6,
                //trailLength: 0,
                //symbol: planePath,
                //symbolSize: 55
            },
            lineStyle: {
                normal: {
                    color: color[i],
                    width: 1,
                    opacity: 0.4,
                    curveness: 0.2
                }
            },
            data: convertData(item[1])
        },
        {
            name: item[0] + ' Top10',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
                brushType: 'stroke'
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                }
            },
            symbolSize: function (val) {
                return val[2] / 8;
            },
            itemStyle: {
                normal: {
                    color: color[i]
                }
            },
            data: item[1].map(function (dataItem) {
                return {
                    name: dataItem[1].name,
                    value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                };
            })
        });
});

var placeList = [
    {name:'海门', geoCoord:[121.15, 31.89]},
    {name:'鄂尔多斯', geoCoord:[109.781327, 39.608266]},
    {name:'招远', geoCoord:[120.38, 37.35]},
    {name:'舟山', geoCoord:[122.207216, 29.985295]},
    {name:'齐齐哈尔', geoCoord:[123.97, 47.33]},
    {name:'盐城', geoCoord:[120.13, 33.38]},
    {name:'赤峰', geoCoord:[118.87, 42.28]},
    {name:'青岛', geoCoord:[120.33, 36.07]},
    {name:'乳山', geoCoord:[121.52, 36.89]},
    {name:'金昌', geoCoord:[102.188043, 38.520089]},
    {name:'泉州', geoCoord:[118.58, 24.93]},
    {name:'莱西', geoCoord:[120.53, 36.86]},
    {name:'日照', geoCoord:[119.46, 35.42]},
    {name:'胶南', geoCoord:[119.97, 35.88]},
    {name:'南通', geoCoord:[121.05, 32.08]},
    {name:'拉萨', geoCoord:[91.11, 29.97]},
    {name:'云浮', geoCoord:[112.02, 22.93]},
    {name:'梅州', geoCoord:[116.1, 24.55]},
    {name:'文登', geoCoord:[122.05, 37.2]},
    {name:'上海', geoCoord:[121.48, 31.22]},
    {name:'攀枝花', geoCoord:[101.718637, 26.582347]},
    {name:'威海', geoCoord:[122.1, 37.5]},
    {name:'承德', geoCoord:[117.93, 40.97]},
    {name:'厦门', geoCoord:[118.1, 24.46]},
    {name:'汕尾', geoCoord:[115.375279, 22.786211]},
    {name:'潮州', geoCoord:[116.63, 23.68]},
    {name:'丹东', geoCoord:[124.37, 40.13]},
    {name:'太仓', geoCoord:[121.1, 31.45]},
    {name:'曲靖', geoCoord:[103.79, 25.51]},
    {name:'烟台', geoCoord:[121.39, 37.52]},
    {name:'福州', geoCoord:[119.3, 26.08]},
    {name:'瓦房店', geoCoord:[121.979603, 39.627114]},
    {name:'即墨', geoCoord:[120.45, 36.38]},
    {name:'抚顺', geoCoord:[123.97, 41.97]},
    {name:'玉溪', geoCoord:[102.52, 24.35]},
    {name:'张家口', geoCoord:[114.87, 40.82]},
    {name:'阳泉', geoCoord:[113.57, 37.85]},
    {name:'莱州', geoCoord:[119.942327, 37.177017]},
    {name:'湖州', geoCoord:[120.1, 30.86]},
    {name:'汕头', geoCoord:[116.69, 23.39]},
    {name:'昆山', geoCoord:[120.95, 31.39]},
    {name:'宁波', geoCoord:[121.56, 29.86]},
    {name:'湛江', geoCoord:[110.359377, 21.270708]},
    {name:'揭阳', geoCoord:[116.35, 23.55]},
    {name:'荣成', geoCoord:[122.41, 37.16]},
    {name:'连云港', geoCoord:[119.16, 34.59]},
    {name:'葫芦岛', geoCoord:[120.836932, 40.711052]},
    {name:'常熟', geoCoord:[120.74, 31.64]},
    {name:'东莞', geoCoord:[113.75, 23.04]},
    {name:'河源', geoCoord:[114.68, 23.73]},
    {name:'淮安', geoCoord:[119.15, 33.5]},
    {name:'泰州', geoCoord:[119.9, 32.49]},
    {name:'南宁', geoCoord:[108.33, 22.84]},
    {name:'营口', geoCoord:[122.18, 40.65]},
    {name:'惠州', geoCoord:[114.4, 23.09]},
    {name:'江阴', geoCoord:[120.26, 31.91]},
    {name:'蓬莱', geoCoord:[120.75, 37.8]},
    {name:'韶关', geoCoord:[113.62, 24.84]},
    {name:'嘉峪关', geoCoord:[98.289152, 39.77313]},
    {name:'广州', geoCoord:[113.23, 23.16]},
    {name:'延安', geoCoord:[109.47, 36.6]},
    {name:'太原', geoCoord:[112.53, 37.87]},
    {name:'清远', geoCoord:[113.01, 23.7]},
    {name:'中山', geoCoord:[113.38, 22.52]},
    {name:'昆明', geoCoord:[102.73, 25.04]},
    {name:'寿光', geoCoord:[118.73, 36.86]},
    {name:'盘锦', geoCoord:[122.070714, 41.119997]},
    {name:'长治', geoCoord:[113.08, 36.18]},
    {name:'深圳', geoCoord:[114.07, 22.62]},
    {name:'珠海', geoCoord:[113.52, 22.3]},
    {name:'宿迁', geoCoord:[118.3, 33.96]},
    {name:'咸阳', geoCoord:[108.72, 34.36]},
    {name:'铜川', geoCoord:[109.11, 35.09]},
    {name:'平度', geoCoord:[119.97, 36.77]},
    {name:'佛山', geoCoord:[113.11, 23.05]},
    {name:'海口', geoCoord:[110.35, 20.02]},
    {name:'江门', geoCoord:[113.06, 22.61]},
    {name:'章丘', geoCoord:[117.53, 36.72]},
    {name:'肇庆', geoCoord:[112.44, 23.05]},
    {name:'大连', geoCoord:[121.62, 38.92]},
    {name:'临汾', geoCoord:[111.5, 36.08]},
    {name:'吴江', geoCoord:[120.63, 31.16]},
    {name:'石嘴山', geoCoord:[106.39, 39.04]},
    {name:'沈阳', geoCoord:[123.38, 41.8]},
    {name:'苏州', geoCoord:[120.62, 31.32]},
    {name:'茂名', geoCoord:[110.88, 21.68]},
    {name:'嘉兴', geoCoord:[120.76, 30.77]},
    {name:'长春', geoCoord:[125.35, 43.88]},
    {name:'胶州', geoCoord:[120.03336, 36.264622]},
    {name:'银川', geoCoord:[106.27, 38.47]},
    {name:'张家港', geoCoord:[120.555821, 31.875428]},
    {name:'三门峡', geoCoord:[111.19, 34.76]},
    {name:'锦州', geoCoord:[121.15, 41.13]},
    {name:'南昌', geoCoord:[115.89, 28.68]},
    {name:'柳州', geoCoord:[109.4, 24.33]},
    {name:'三亚', geoCoord:[109.511909, 18.252847]},
    {name:'自贡', geoCoord:[104.778442, 29.33903]},
    {name:'吉林', geoCoord:[126.57, 43.87]},
    {name:'阳江', geoCoord:[111.95, 21.85]},
    {name:'泸州', geoCoord:[105.39, 28.91]},
    {name:'西宁', geoCoord:[101.74, 36.56]},
    {name:'宜宾', geoCoord:[104.56, 29.77]},
    {name:'呼和浩特', geoCoord:[111.65, 40.82]},
    {name:'成都', geoCoord:[104.06, 30.67]},
    {name:'大同', geoCoord:[113.3, 40.12]},
    {name:'镇江', geoCoord:[119.44, 32.2]},
    {name:'桂林', geoCoord:[110.28, 25.29]},
    {name:'张家界', geoCoord:[110.479191, 29.117096]},
    {name:'宜兴', geoCoord:[119.82, 31.36]},
    {name:'北海', geoCoord:[109.12, 21.49]},
    {name:'西安', geoCoord:[108.95, 34.27]},
    {name:'金坛', geoCoord:[119.56, 31.74]},
    {name:'东营', geoCoord:[118.49, 37.46]},
    {name:'牡丹江', geoCoord:[129.58, 44.6]},
    {name:'遵义', geoCoord:[106.9, 27.7]},
    {name:'绍兴', geoCoord:[120.58, 30.01]},
    {name:'扬州', geoCoord:[119.42, 32.39]},
    {name:'常州', geoCoord:[119.95, 31.79]},
    {name:'潍坊', geoCoord:[119.1, 36.62]},
    {name:'重庆', geoCoord:[106.54, 29.59]},
    {name:'台州', geoCoord:[121.420757, 28.656386]},
    {name:'南京', geoCoord:[118.78, 32.04]},
    {name:'滨州', geoCoord:[118.03, 37.36]},
    {name:'贵阳', geoCoord:[106.71, 26.57]},
    {name:'无锡', geoCoord:[120.29, 31.59]},
    {name:'本溪', geoCoord:[123.73, 41.3]},
    {name:'克拉玛依', geoCoord:[84.77, 45.59]},
    {name:'渭南', geoCoord:[109.5, 34.52]},
    {name:'马鞍山', geoCoord:[118.48, 31.56]},
    {name:'宝鸡', geoCoord:[107.15, 34.38]},
    {name:'焦作', geoCoord:[113.21, 35.24]},
    {name:'句容', geoCoord:[119.16, 31.95]},
    {name:'北京', geoCoord:[116.46, 39.92]},
    {name:'徐州', geoCoord:[117.2, 34.26]},
    {name:'衡水', geoCoord:[115.72, 37.72]},
    {name:'包头', geoCoord:[110, 40.58]},
    {name:'绵阳', geoCoord:[104.73, 31.48]},
    {name:'乌鲁木齐', geoCoord:[87.68, 43.77]},
    {name:'枣庄', geoCoord:[117.57, 34.86]},
    {name:'杭州', geoCoord:[120.19, 30.26]},
    {name:'淄博', geoCoord:[118.05, 36.78]},
    {name:'鞍山', geoCoord:[122.85, 41.12]},
    {name:'溧阳', geoCoord:[119.48, 31.43]},
    {name:'库尔勒', geoCoord:[86.06, 41.68]},
    {name:'安阳', geoCoord:[114.35, 36.1]},
    {name:'开封', geoCoord:[114.35, 34.79]},
    {name:'济南', geoCoord:[117, 36.65]},
    {name:'德阳', geoCoord:[104.37, 31.13]},
    {name:'温州', geoCoord:[120.65, 28.01]},
    {name:'九江', geoCoord:[115.97, 29.71]},
    {name:'邯郸', geoCoord:[114.47, 36.6]},
    {name:'临安', geoCoord:[119.72, 30.23]},
    {name:'兰州', geoCoord:[103.73, 36.03]},
    {name:'沧州', geoCoord:[116.83, 38.33]},
    {name:'临沂', geoCoord:[118.35, 35.05]},
    {name:'南充', geoCoord:[106.110698, 30.837793]},
    {name:'天津', geoCoord:[117.2, 39.13]},
    {name:'富阳', geoCoord:[119.95, 30.07]},
    {name:'泰安', geoCoord:[117.13, 36.18]},
    {name:'诸暨', geoCoord:[120.23, 29.71]},
    {name:'郑州', geoCoord:[113.65, 34.76]},
    {name:'哈尔滨', geoCoord:[126.63, 45.75]},
    {name:'聊城', geoCoord:[115.97, 36.45]},
    {name:'芜湖', geoCoord:[118.38, 31.33]},
    {name:'唐山', geoCoord:[118.02, 39.63]},
    {name:'平顶山', geoCoord:[113.29, 33.75]},
    {name:'邢台', geoCoord:[114.48, 37.05]},
    {name:'德州', geoCoord:[116.29, 37.45]},
    {name:'济宁', geoCoord:[116.59, 35.38]},
    {name:'荆州', geoCoord:[112.239741, 30.335165]},
    {name:'宜昌', geoCoord:[111.3, 30.7]},
    {name:'义乌', geoCoord:[120.06, 29.32]},
    {name:'丽水', geoCoord:[119.92, 28.45]},
    {name:'洛阳', geoCoord:[112.44, 34.7]},
    {name:'秦皇岛', geoCoord:[119.57, 39.95]},
    {name:'株洲', geoCoord:[113.16, 27.83]},
    {name:'石家庄', geoCoord:[114.48, 38.03]},
    {name:'莱芜', geoCoord:[117.67, 36.19]},
    {name:'常德', geoCoord:[111.69, 29.05]},
    {name:'保定', geoCoord:[115.48, 38.85]},
    {name:'湘潭', geoCoord:[112.91, 27.87]},
    {name:'金华', geoCoord:[119.64, 29.12]},
    {name:'岳阳', geoCoord:[113.09, 29.37]},
    {name:'长沙', geoCoord:[113, 28.21]},
    {name:'衢州', geoCoord:[118.88, 28.97]},
    {name:'廊坊', geoCoord:[116.7, 39.53]},
    {name:'菏泽', geoCoord:[115.480656, 35.23375]},
    {name:'合肥', geoCoord:[117.27, 31.86]},
    {name:'武汉', geoCoord:[114.31, 30.52]},
    {name:'大庆', geoCoord:[125.03, 46.58]}
]
option = {
    backgroundColor: '#1b1b1b',
    color: [
        'rgba(255, 255, 255, 0.8)',
        'rgba(14, 241, 242, 0.8)',
        'rgba(37, 140, 249, 0.8)'
    ],
    title : {
        text: '大规模MarkPoint特效',
        subtext: '纯属虚构',
        x:'center',
        textStyle : {
            color: '#fff'
        }
    },
    legend: {
        orient: 'vertical',
        x:'left',
        data:['强','中','弱'],
        textStyle : {
            color: '#fff'
        }
    },
    toolbox: {
        show : true,
        orient : 'vertical',
        x: 'right',
        y: 'center',
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    series : [
        {
            name: '弱',
            type: 'map',
            mapType: 'china',
            itemStyle:{
                normal:{
                    borderColor:'rgba(100,149,237,1)',
                    borderWidth:1.5,
                    areaStyle:{
                        color: '#1b1b1b'
                    }
                }
            },
            data : [],
            markPoint : {
                symbolSize: 2,
                large: true,
                effect : {
                    show: true
                },
                data : (function(){
                    var data = [];
                    var len = 3000;
                    var geoCoord
                    while(len--) {
                        geoCoord = placeList[len % placeList.length].geoCoord;
                        data.push({
                            name : placeList[len % placeList.length].name + len,
                            value : 10,
                            geoCoord : [
                                geoCoord[0] + Math.random() * 5 - 2.5,
                                geoCoord[1] + Math.random() * 3 - 1.5
                            ]
                        })
                    }
                    return data;
                })()
            }
        },
        {
            name: '中',
            type: 'map',
            mapType: 'china',
            data : [],
            markPoint : {
                symbolSize: 3,
                large: true,
                effect : {
                    show: true
                },
                data : (function(){
                    var data = [];
                    var len = 1000;
                    var geoCoord
                    while(len--) {
                        geoCoord = placeList[len % placeList.length].geoCoord;
                        data.push({
                            name : placeList[len % placeList.length].name + len,
                            value : 50,
                            geoCoord : [
                                geoCoord[0] + Math.random() * 5 - 2.5,
                                geoCoord[1] + Math.random() * 3 - 1.5
                            ]
                        })
                    }
                    return data;
                })()
            }
        },
        {
            name: '强',
            type: 'map',
            mapType: 'china',
            hoverable: false,
            roam:true,
            data : [],
            markPoint : {
                symbol : 'diamond',
                symbolSize: 6,
                large: true,
                effect : {
                    show: true
                },
                data : (function(){
                    var data = [];
                    var len = placeList.length;
                    while(len--) {
                        data.push({
                            name : placeList[len].name,
                            value : 90,
                            geoCoord : placeList[len].geoCoord
                        })
                    }
                    return data;
                })()
            }
        }
    ]
};
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}