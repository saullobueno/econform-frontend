import React from 'react';
import { Pie, measureTextWidth } from '@ant-design/charts';

const PieChart = (data) => {
  function renderStatistic(containerWidth, text, style) {
    var _measureTextWidth = (0, measureTextWidth)(text, style),
      textWidth = _measureTextWidth.width,
      textHeight = _measureTextWidth.height;
    var R = containerWidth / 2;
    var scale = 1;
    if (containerWidth < textWidth) {
      scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
    }
    var textStyleStr = 'width:'.concat(containerWidth, 'px;');
    return '<div style="'
      .concat(textStyleStr, ';font-size:')
      .concat(scale, 'em;line-height:')
      .concat(scale < 1 ? 1 : 'inherit', ';">')
      .concat(text, '</div>');
  }

  var config = {
    autoFit: false,
    appendPadding: 20,
    data: data.data,
    legend: false,
    angleField: 'value',
    colorField: 'type',
    color: data.data.map((colorItem, idx) => colorItem.color),
    radius: 1,
    innerRadius: 0.8,
    meta: {
      value: {
        formatter: function formatter(v) {
          return ''.concat(v, ' %');
        },
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: { fontSize: 20, textAlign: 'center', fontWeight: 'bold' },
      autoRotate: false,
      content: '{value}',
    },
    statistic: {
      title: {
        offsetY: -4,
        style: { fontSize: '20px' },
        customHtml: function customHtml(container, view, datum) {
          var _container$getBoundin = container.getBoundingClientRect(),
            width = _container$getBoundin.width,
            height = _container$getBoundin.height;
          var d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          var text = datum ? datum.type : data.name;
          return renderStatistic(d, text, { fontSize: 20 });
        },
      },
      content: {
        offsetY: 4,
        style: { fontSize: '20px' },
        customHtml: function customHtml(container, view, datum, data) {
          var _container$getBoundin2 = container.getBoundingClientRect(),
            width = _container$getBoundin2.width;
          var text = datum
            ? datum.value
            : data.reduce(function (r, d) {
                return r + d.value;
              }, 0);
          return renderStatistic(width, text, { fontSize: 20 });
        },
      },
    },
    interactions: [
      { type: 'element-selected' },
      { type: 'element-active' },
      {
        type: 'pie-statistic-active',
        cfg: {
          start: [
            { trigger: 'element:mouseenter', action: 'pie-statistic:change' },
            { trigger: 'legend-item:mouseenter', action: 'pie-statistic:change' },
            { trigger: 'element:mouseleave', action: 'pie-statistic:reset' },
            { trigger: 'legend-item:mouseleave', action: 'pie-statistic:reset' },
          ],
        },
      },
    ],
  };
  return <Pie {...config} />;
};

export default PieChart;
