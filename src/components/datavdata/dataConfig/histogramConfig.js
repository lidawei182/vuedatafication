
const piecolor = [
  "#5470c6",
  "#fac858",
  "#ee6666",
  "#73c0de",
  "#73c0de",
  "#3ba272",
  "#fc8452"
];
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
let humanBeing = [];
let man = 0;
let manData = '';
man = 200 + 346 + 80 + 80 + 100;
manData = '男' + man + '人';
let woman = 0;
let womanData = 0;
woman = 90 + 10 + 45 + 40 + 80;
womanData = '女' + woman + '人';
humanBeing = [manData, womanData]; 
export default {
  lineData: {
    color: piecolor,
    title: {
      text: '',
      left: '10%',
      top: '3%',
      textStyle: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: 200,
      },
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: humanBeing,
      icon: 'circle',
      top: '25px',
      right:"5%",
      textStyle: {
        color: 'rgba(255,255,255,0.9)'
      }
    },
    toolbox: {
      show: false
    },
    grid: {
      x: 0,
      y: "30%",
      width: '100%',
      height: '60%',
      backgroundColor: 'rgba(0,0,0,0)',
      borderWidth: 1,
      borderColor: '#ccc'
    },
    xAxis: [
      {
        type: 'category',
        data: ['60以下', '60-70', '70-80', '80-90', '90以上'],
        axisLabel: {
          show: true,
          color: 'rgba(255,255,255,0.9)',
          fontSize: 12
        },
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          show: true,
          color: 'rgba(255,255,255,0.9)',
          fontSize: 12
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(255,255,255,0.2)'],
            width: 1,
            type: 'dashed'
          }
        }
      }
    ],
    series: [
      {
        name: manData,
        type: 'bar',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [
          200, 346, 80, 80, 100
        ],
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        showBackground: true,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      },
      {
        name: womanData,
        type: 'bar',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [
          90, 10, 45, 40, 80
        ],
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        showBackground: true,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#fcabab' },
            { offset: 0.5, color: '#e03737' },
            { offset: 1, color: '#b01717' }
          ])
        },
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  },
  test: () => {
    return "test";
  },
};