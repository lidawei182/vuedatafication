const piecolor = [
  "#5470c6",
  "#91cc75",
  "#eaaf29",
  "#ee6666",
  "#0caae7",
  "#3ba272",
  "#fc8452"
];
let liveData = [];
export default {
  chartDougData: {
    color: piecolor,
    title: {
      text: '',
      left: '3%',
      top: '7%',
      textStyle: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      orient: "vertical",
      textStyle: {
        color: "#e5e5e5"
      },
      top: "30%",
      right: "14%",
      itemHeight: 10,
      itemWidth: 10, //图例宽
      icon: "circle" //图例设为圆形
    },
    series: [
      {
        type: "pie",
        radius: ["30%", "60%"],
        avoidLabelOverlap: false,
        left: '-24%',
        bottom: '-16%',
        label: {
          //设置饼图中显示字体大小
          show: true,
          position: "inner",
          fontSize: 10,
          color: "#fff",
          formatter: "{d}%"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: "未婚" },
          { value: 735, name: "已婚" },
          { value: 580, name: "离异" },
          { value: 484, name: "丧偶" },
          { value: 300, name: "未说明" }
        ],
      }
    ]
  },
  chartRefererData: {
    color: piecolor,
    title: {
      text: '',
      left: '3%',
      top: '7%',
      textStyle: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      data: liveData,
      icon: 'none',
      top: '7%',
      right: '6%',
      textStyle: {
        color: 'rgba(255,255,255,0.9)'
      }
    },
    series: [
      {
        name: liveData,
        type: 'pie',
        radius: '41%',
        left: '-6%',
        bottom: '-15%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 1)'
          }
        },
        label: {
          //设置饼图中显示字体大小
          show: true,
          fontSize: 12,
          lineHeight: 15,
          formatter(param) {
            return param.data.name+ '\n' +param.data.value+'人';
          }
        },
        data: [
          { value: 148, name: "其他" },
          { value: 735, name: "独居" },
          { value: 180, name: "空巢" },
          { value: 484, name: "与亲戚同居" },
          { value: 300, name: "与子女同居" },
          { value: 200, name: "集中居住" }
        ],
      },
      {
        name: liveData,
        type: 'pie',
        radius: '46%',
        left: '-6%',
        bottom: '-15%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 1)'
          }
        },
        label: {
          //设置饼图中显示字体大小
          show: true,
          position: "inner",
          fontSize: 8,
          color: "#fff",
          formatter: "{d}%"
        },
        data: [
          { value: 148, name: "其他" },
          { value: 735, name: "独居" },
          { value: 180, name: "空巢" },
          { value: 484, name: "与亲戚同居" },
          { value: 300, name: "与子女同居" },
          { value: 200, name: "集中居住" }
        ],
      }
    ]
  },
  statisticsElderlyTypes:{
    color: ['#5470c6', '#a05906', '#630781', '#02325e', '#025e3c'],
    title: {
      text: '',
      left: '3%',
      top: '7%',
      textStyle: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: "item"
    },
    legend: {
      orient: "vertical",
      textStyle: {
        color: "#e5e5e5"
      },
      top: "30%",
      right: "10%",
      itemHeight: 10,
      itemWidth: 10, //图例宽
      icon: "triangle" //图例设为圆形
    },
    series: [
      {
        type: 'pie',
        radius: ['15%', '85%'],
        center: ['35%', '60%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        label: {
          //设置饼图中显示字体大小
          show: true,
          position: "inner",
          fontSize: 12,
          formatter(param) {
            return param.data.value+'人';
          }
        },
        data: [
          { value: 1048, name: '特困老人' },
          { value: 735, name: '独居老人' },
          { value: 580, name: '失婚老人' },
          { value: 484, name: '低保老人' },
          { value: 300, name: '其他' }
        ]
      }
    ]
  },
  healthStatistics:  {
    series: [
      {
        center: ['42%', '60%'],
        type: 'pie',
        data: [
          { name: '能力完好', value: 203, radius: ['40%', '53%'] },
          { name: '轻度失能', value: 65, radius: ['32%', '45%'] },
          { name: '中度失能', value: 32, radius: ['31%', '47%'] },
          { name: '重度失能', value: 44, radius: ['31%', '42%'] }
        ],
        outsideLabel: {
          labelLineEndLength: 20,
          formatter: '{percent}%\n{name}',
          style: {
            fill: '#fff',
            fontSize: 12,
          }
        }
      },
      {
        center: ['42%', '60%'],
        type: 'pie',
        data: [
          { value: 10, radius: ['60%', '63%'] }
        ],
        outsideLabel: {
          show: false
        },
        pieStyle: {
          fill: 'rgba(255, 255, 255, 0.2)'
        }
      },
      {
        center: ['42%', '60%'],
        type: 'pie',
        data: [
          { value: 10, radius: ['56%', '57%'] }
        ],
        outsideLabel: {
          show: false
        },
        pieStyle: {
          fill: 'rgba(255, 255, 255, 0.2)'
        }
      }
    ],
    color: ['#3683f6', '#fdcf41', '#03ae24', '#b54501']
  },
  test: () => {
    return "test";
  },
};