const pieColorMap = {
  'bad': { color: '#80848f' },
  'disappoint': { color: '#ed3f14' },
  'normal': { color: '#ff9300' },
  'satisfied': { color: '#f7de00' },
  'amazing': { color: '#19be6b' }
}

function getItemColor(obj) {
  return pieColorMap[obj.name].color;
}

const pie = {
  title: {
    text: "评分统计",
    left: "center"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: [
      "bad",
      "disappoint",
      "normal",
      "satisfied",
      "amazing"
    ]
  },
  series: [
    {
      name: "评分统计",
      type: "pie",
      radius: "55%",
      center: ["50%", "60%"],
      itemStyle: {
        color: getItemColor,
      },
      data: [
        { name: 'bad', value: 0 },
        { name: 'disappoint', value: 0 },
        { name: 'normal', value: 0 },
        { name: 'satisfied', value: 0 },
        { name: 'amazing', value: 0 }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
}

export { pie };
