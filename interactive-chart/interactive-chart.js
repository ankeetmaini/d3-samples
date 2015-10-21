var containerDimensions = {
  width: 900,
  height: 400
};
var margin = {
  top: 10,
  right: 20,
  bottom: 30,
  left: 60
};
var chartDimensions = {
  width: containerDimensions.width - margin.left - margin.right,
  height: containerDimensions.height - margin.top - margin.bottom
};

// draw svg
var chart = d3.select('#timeseries')
  .append('svg')
    .attr('width', containerDimensions.width)
    .attr('height', containerDimensions.height)
  .append('g')
    .attr('id', 'chart')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

// scales and axes
var timeScale = d3.time.scale()
  .range([0, chartDimensions.width])
  .domain([new Date(2009, 0, 1), new Date(2011, 3, 1)]);
var percentScale = d3.scale.linear()
  .range([chartDimensions.height, 0])
  .domain([65, 90]);
var timeAxis = d3.svg.axis()
  .scale(timeScale);
var percentAxis = d3.svg.axis()
  .scale(percentScale)
  .orient('left');

// draw axes now
chart.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0, ' + chartDimensions.height + ')')
  .call(timeAxis);

chart.append('g')
  .attr('class', 'y axis')
  .call(percentAxis);

// add titles to the axes
d3.select('.y.axis')
  .append('text')
  .text('percent on time')
  .attr('transform', 'rotate(90, 0, 0)')
  .attr('x', chartDimensions.height/3)
  .attr('y', margin.left / 1.5);

// d3.select('.x.axis')
//   .append('text')
//   .text('timeline')
//   .attr('x', chartDimensions.width / 3)
//   .attr('y', margin.bottom);

// draw key items
var keyItems = d3.select('#key')
  .selectAll('div')
  .data(meanData)
  .enter()
  .append('div')
    .attr('class', 'key_line')
    .attr('id', function (d) { return d.line_id; });

keyItems.append('div')
  .attr('id', function (d) { return 'key_square ' + d.line_id; })
  .attr('class', function (d) { return 'key_square ' + d.line_id; });

keyItems.append('div')
  .attr('class','key_label')
  .text(function (d) { return d.line_name; });

// attach click handlers on .key_line
d3.selectAll('.key_line')
  .on('click', getTimeSeriesData);

// all functions

// checks if line is already present, if not draws it
function getTimeSeriesData (e) {
  var id = d3.select(this).attr('id');
  var ts = d3.select('#' + id + '_path');
  if (ts.empty()) {
    var d = waitData.filter(function (i) { return i.line_id === id});
    if (d) drawTimeSeries(d, id);
  } else {
    ts.remove();
  }
}

function drawTimeSeries (data, id) {
  var line = d3.svg.line()
    .x(function (d) { return timeScale(d.time); })
    .y(function (d) { return percentScale(d.late_percent); })
    .interpolate('linear');

  var g = d3.select('#chart')
    .append('g')
      .attr('id', id + '_path')
      .attr('class', 'Line_' + id.split('_')[1]);

  // line
  g.append('path')
      .attr('d', line(data))
      .attr('class', '' + id.split('_')[1]);
  // dots
  g.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
      .attr('cx', function (d) { return timeScale(d.time); })
      .attr('cy', function (d) { return percentScale(d.late_percent); })
      .attr('r', 0); // so they can't be seen
  // animate the dots one after the other
  var enterDuration = 600;
  g.selectAll('circle')
    .transition()
    .delay(function (d, i) { return i / data.length * enterDuration; })
    .attr('r', 5);

  // animation of swelling up of data points
  g.selectAll('circle')
    .on('mouseover', function (d) {
      d3.select(this)
        .transition()
        .attr('r', 9);
    })
    .on('mouseout', function (d) {
      d3.select(this).transition().attr('r', 5);
    });

  // tooltip
  g.selectAll('circle')
    .on('mouseover.tooltip', function (d) {
      d3.select('text#' + d.line_id).remove();
      d3.select('#chart')
        .append('text')
          .text(d.late_percent + '%')
          .attr('x', timeScale(d.time) - 10)
          .attr('y', percentScale(d.late_percent) - 15)
          .attr('id', d.line_id);
    })
    .on('mouseout.tooltip', function (d) {
      d3.select('text#' + d.line_id)
        .transition()
        .duration(500)
        .style('opacity', 0)
        .attr('transform','translate(0, -20)')
        .remove();
    });
}
