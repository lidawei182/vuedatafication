
const piecolor = [
  "#fcf91c",
  "#d45704"
];
export default {
  lineData: {
    animation: true,
    color: piecolor,
    title: {
      text: '呼叫统计',
      left: '1%',
      top: '7.5%',
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
      right: '2%',
      top: '7%',
      data: ['总共呼叫数量', '异常挂断'],
      textStyle: {
        color: 'rgba(255,255,255,0.9)'
      }
    },
    toolbox: {
      show: false
    },
    grid: {
      x: 42,
      y: "26%",
      width: '88%',
      height: '62%',
      backgroundColor: 'rgba(0,0,0,0)',
      borderWidth: 1,
      borderColor: '#ccc'
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['0-3', '3-6', '6-9', '9-12', '12-15', '15-18', '18-21', '21-24'],
        axisLabel: {
          show: true,
          color: 'rgba(255,255,255,0.9)',
          fontSize: 10
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
        name: '总共呼叫数量',
        type: 'line',
        animationDurationUpdate: 1000, // 更新动画时长为 1s
        animationEasingUpdate: 'quinticInOut', // 更新动画缓动效果为 'quinticInOut'
        label: {
          show: true
        },
        stack: 'Total',
        smooth: true,
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [30, 25, 112, 266, 90, 230, 110, 80,90, 230, 110, 80]
      },
      {
        name: '异常挂断',
        type: 'line',
        animationDurationUpdate: 1000, // 更新动画时长为 1s
        animationEasingUpdate: 'quinticInOut', // 更新动画缓动效果为 'quinticInOut'
        stack: 'Total',
        smooth: true,
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [200, 110, 132, 226, 90, 300, 10, 80,90, 230, 110, 80]
      }
    ]
  },
  test: () => {
    return "test";
  },
};