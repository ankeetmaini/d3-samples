var data = [{name: 'Yes', value: 145}, {name: 'No', value: 241}];

d3.select('body')
  .append('div')
  .selectAll('div.line')
  .data(data)
  .enter()
  .append('div')
    .attr('class', 'line');

d3.selectAll('div.line')
  .append('div')
    .attr('class', 'label')
    .text(function (d) { return d.name; });

d3.selectAll('div.line')
  .append('div')
   .attr('class', 'bars')
  .style('width', function (d) { return d.value + 'px'; })
  .style('outline', '1px solid red')
  .text(function (d) { return d.value; });
