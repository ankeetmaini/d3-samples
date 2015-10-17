var margin = 40;
var width = 700 - margin;
var height = 300 - margin;

// add scales
var xExtent = d3.extent(
  data.times_square.concat(data.grand_central),
  function (d) { return d.time; }
);
var xScale = d3.time.scale()
  .range([margin, width])
  .domain(xExtent);

var yExtent = d3.extent(
  data.times_square.concat(data.grand_central),
  function (d) { return d.count; }
);
var yScale = d3.scale.linear()
  .range([height, margin])
  .domain(yExtent);

// draw circular points of times_square and grand_central station
var g = d3.select('body')
  .append('svg')
    .attr('height', height + margin)
    .attr('width', width + margin)
  .append('g')
    .attr('class', 'chart');

g.selectAll('circle.timesSquare')
  .data(data.times_square)
  .enter()
  .append('circle')
    .attr('class', 'timesSquare');

g.selectAll('circle.grandCentral')
  .data(data.grand_central)
  .enter()
  .append('circle')
    .attr('class', 'grandCentral');

d3.selectAll('circle')
  .attr('cy', function (d) { return yScale(d.count); })
  .attr('cx', function (d) { return xScale(d.time); })
  .attr('r', 3);

// add axes
var timeAxis = d3.svg.axis()
  .scale(xScale);
g.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0, '+ height +')')
  .call(timeAxis);

var yAxis = d3.svg.axis()
  .scale(yScale).orient('left');
g.append('g')
  .attr('class', 'y axis')
  .attr('transform', 'translate(' + margin + ', 0)')
  .call(yAxis);

// joining scatter plots to form a time-series path
var line = d3.svg.line() // line generator function
  .x(function (d) { return xScale(d.time); })
  .y(function (d) { return yScale(d.count); });

g.append('path')
  .attr('d', line(data.times_square))
  .attr('class', 'timesSquare');

  g.append('path')
    .attr('d', line(data.grand_central))
    .attr('class', 'grandCentral');

// finally add axes titles
d3.select('.y.axis')
  .append('text')
  .text('mean number of turnstile revolutions')
  .attr('transform', 'rotate(90, ' + -margin +', 0)')
  .attr('y', 0)
  .attr('x', 20);

d3.select('.x.axis')
  .append('text')
  .text('time')
  .attr('y', margin / 1.5)
  .attr('x', (width / 1.6) - margin);
