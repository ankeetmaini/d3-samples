var margin = 50;
var width = 700;
var height = 300;

var xExtent = d3.extent(scatterData, function (d) {
  return d.collision_with_injury;
});
var yExtent = d3.extent(scatterData, function (d) {
  return d.dist_between_fail;
});

// scales
var xScale = d3.scale.linear()
  .range([margin, width - margin])
  .domain(xExtent);
var yScale = d3.scale.linear()
  .range([height - margin, margin])
  .domain(yExtent);

// scatter graph
d3.select('body')
  .append('svg')
    .attr('width', width)
    .attr('height', height)
  .selectAll('circle')
  .data(scatterData) // from scatter-graph-data.js
  .enter()
  .append('circle')
    .attr('cx', function (d) { return xScale(d.collision_with_injury); })
    .attr('cy', function (d) { return yScale(d.dist_between_fail); })
    .attr('r', 5);

// adding axes
var xAxis = d3.svg.axis().scale(xScale);
d3.select('svg')
  .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + (height - margin) + ')')
  .call(xAxis); // creates x-axis

var yAxis = d3.svg.axis().scale(yScale).orient('left');
d3.select('svg')
  .append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + margin + ', 0)')
  .call(yAxis); // creates y-axis

// add titles
d3.select('.x.axis')
  .append('text')
    .text('collisions with injury (per million miles)')
    .attr('x', (width / 2) - margin)
    .attr('y', margin / 1.5);

d3.select('.y.axis')
  .append('text')
  .text('mean distance between failure (miles)')
  .attr('transform', 'rotate(-90, -43, 0) translate(-280)');
