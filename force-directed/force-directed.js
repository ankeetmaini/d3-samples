// setting up the svg container
var width = 500;
var height = 500;

var svg = d3.select('body')
  .append('svg')
    .attr('width', width)
    .attr('height', height);

var nodes = svg.selectAll('circle.node')
  .data(allStations.nodes)
  .enter()
  .append('circle')
    .attr('class', 'node')
    .attr('r', 12);

nodes.on('mouseover', function (d) {
  d3.select('text#' + d.name).remove();
  svg.append('text')
    .text(d.name)
    .attr('x', d.x)
    .attr('y', d.y - 20)
    .attr('id', d.name);
});

nodes.on('mouseout', function (d) {
  d3.select('text#' + d.name)
    .transition()
    .duration(500)
    .style('opacity', 0)
    .attr('transform','translate(0, -20)')
    .remove();
});

var links = svg.selectAll('link.link')
  .data(allStations.links)
  .enter()
  .append('line')
    .style('stroke', 'black');

// we created the links, and nodes
// now need to draw them out using d3's force directed algorithm

var force = d3.layout.force()
  .charge(-120)
  .linkDistance(10)
  .size([width, height])
  .nodes(allStations.nodes)
  .links(allStations.links)
  .start();

// listen on as algorithm finds the layout and update our links and nodes
force.on('tick', function () {
  links.attr('x1', function (d) { return d.source.x; })
      .attr('y1', function (d) { return d.source.y; })
      .attr('x2', function (d) { return d.target.x; })
      .attr('x2', function (d) { return d.target.y; });

  nodes.attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
});

// add interactivity
nodes.call(force.drag);
