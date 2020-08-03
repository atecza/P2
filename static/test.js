
function addCountry(myData){
    //need to add a value
    d3.select("#selDataset").selectAll('option')
    .data(myData) //binding data to non existant tr
    .enter() //this takes account of the length of the data
    .append('option')
    .html(function(d){
        return `<option>${d}</option>`;
    });
}


// Notes on making svg responsive to div container resizing
d3.select("div#chartId") //#chartid
   .append("div")
   // Container class to make it responsive.
   .classed("svg-container", true) 
   .append("svg")
   // Responsive SVG needs these 2 attributes and no width and height attr.
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 600 400")
   // Class to make it responsive.
   .classed("svg-content-responsive", true)


//The CSS:

// .svg-container {
//   display: inline-block;
//   position: relative;
//   width: 100%;
//   padding-bottom: 100%; /* aspect ratio */
//   vertical-align: top;
//   overflow: hidden;
// }

// .svg-content-responsive {
//   display: inline-block;
//   position: absolute;
//   top: 10px;
//   left: 0;
// }

// svg .rect {
//   fill: gold;
//   stroke: steelblue;
//   stroke-width: 5px;
// }



//The HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.7.0/d3.min.js"></script>

<div id="chartId"></div>




// bargraph works
var xBandScale = d3.scaleBand()
            .domain(selectedData.map(d => d.group))
            .range([0, width])
            .padding(0.1);
        
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(selectedData, d => d.value)])
            .range([height, 0]);
        
        var bottomAxis = d3.axisBottom(xBandScale);
        var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

        barGroup.append("g")
            .call(leftAxis);
        
        barGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        
        barGroup.selectAll(".bar")
            .data(selectedData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xBandScale(d.group))
            .attr("y", d => yLinearScale(d.value))
            .attr("width", xBandScale.bandwidth())
            .attr("height", d => height - yLinearScale(d.value));


//bargraph update
        // Initialize the X axis
        var x = d3.scaleBand()
            .range([ 0, width ])
            .padding(0.2);
        
        var xAxis = bar_svg.append("g")
            .attr("transform", "translate(0," + height + ")")
        
        // Initialize the Y axis
        var y = d3.scaleLinear()
            .range([ height, 0]);

        var yAxis = bar_svg.append("g")
            .attr("class", "myYaxis")
        
        // A function that create / update the plot for a given variable:

function updateBar(data) {

    //Update the X axis
    x.domain(data.map(function(d){return d.group}))
    xAxis.call(d3.axisBottom(x))

    //Update the Y axis
    y.domain([0, d3.max(data, function(d){return d.value})]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    //create the updated bar
    var upbar = bar_svg.selectAll("rect")
        .data(data)
    
    upbar.enter()
        .append("rect")//add a new rect for each new element
        .merge(upbar)//get existing elements
        .transition()//apply changes to all
        .duration(1000)
            .attr("x", function(d){return x(d.group);})
            .attr("y", function(d){return y(d.value);})
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.value); })
            .attr("fill", "#69b3a2")
    
    upbar.exit().remove() //cleanup

}//end updateBar function