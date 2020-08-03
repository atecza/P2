
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


//playing with barchart
barGroup.selectAll(".bar")
            .data(selectedData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.group); })
            .attr("width", 10)
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });
  
        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(selectedData.map(function(d) { return d.group; }))
            .padding(0.2);

            console.log('X', x)

        barGroup.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))


        var y = d3.scaleLinear()
            .domain([0, d3.max(selectedData, function(d) { return d.value;})])
            .range([ height, 0]);
        
        barGroup.append("g")
            .attr("class", "myYaxis")
            .call(d3.axisLeft(y));