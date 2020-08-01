var svgWidth = 1000;
var svgHeight = 700;

var margin = {
  top: 40,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// function used for updating x-scale var upon click on axis label
function xScale(EnvData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(EnvData, d => d[chosenXAxis]), d3.max(EnvData, d => d[chosenXAxis])])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(EnvData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.max(EnvData, d => d[chosenYAxis]), d3.min(EnvData, d => d[chosenYAxis])])
      .range([0, height]);
  
    return yLinearScale;
  
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(xLinearScale, xAxis) {
    var bottomAxis = d3.axisBottom(xLinearScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis; //returns the newly formatted x axis
}

// function used for updating xAxis var upon click on axis label
function renderYAxes(yLinearScale, yAxis) {
    var leftAxis = d3.axisLeft(yLinearScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis; //returns the newly formatted y axis
}

// function used for updating circles group with a transition to
// new circles

function renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
    
    
    return circlesGroup;

}

function renderCircleLabels(circlesLable, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis){
    circlesLable.transition()
        .duration(1000)
        .attr("x", d => xLinearScale(d[chosenXAxis])-10)
        .attr("y", d => yLinearScale(d[chosenYAxis])+5)
    
    return circlesLable;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${chosenXAxis}: ${d[chosenXAxis]}<br> ${chosenYAxis}: ${d[chosenYAxis]}`);
        });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
    
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });
  
    return circlesGroup;
}

// Initial Param

var chosenYAxis = "BioCap_RD";
var chosenXAxis = "HDI";

//      GET DATA AND CREATE THE GRAPH   

d3.json("http://localhost:5000/api/v1.0/EnvData").then((EnvData) => {
    
    console.log(`x & y: ${chosenXAxis},${chosenYAxis}`)
  

    console.log(EnvData)

    // xLinearScale function above csv import
    var xLinearScale = xScale(EnvData, chosenXAxis);
  
    // Create y scale function
    var yLinearScale = yScale(EnvData, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);

    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis",true)
        .call(leftAxis);
    
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(EnvData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "lightblue")
        .attr("stroke", "steelblue")
        .attr("opacity", ".5")

        console.log(circlesGroup)
    
        //create labels
    var circlesLable = chartGroup.selectAll("text").exit()
        .data(EnvData)  
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis])-10)
        .attr("y", d => yLinearScale(d[chosenYAxis])+5)
        .text(d => d.Country)
        .attr("class","stateAbbr");
    
    
    // Create group for three x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var HDILabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "HDI") // value to grab for event listener
        .classed("active", true)
        .classed("inactive", false)
        .text("Human Development Index");

    var EconAgLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "EconAg") // value to grab for event listener
        .classed("active", false)
        .classed("inactive", true)
        .text("Economy Agriculture");

    var EconIndLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "EconInd") // value to grab for event listener
        .classed("active", false)
        .classed("inactive", true)
        .text("Economy Industry");
    
    // Create group for three y-axis labels
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(-80,${height/2})`);
    
    var BioCap_RDLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0) //this should be the outer most lable
        .attr("value", "BioCap_RD") // value to grab for event listener
        .classed("active", true)
        .classed("inactive", false)
        .text("Biologic Capacity Reserve/Deficit");
    
    var FTotalLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20)
        .attr("x", 0)
        .attr("value", "Footprint_Total") // value to grab for event listener
        .classed("active", false)
        .classed("inactive", true)
        .text("Total Ecological Footprint");
    
    var EmissionLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 40)
        .attr("x", 0)
        .attr("value", "Emission_CO2") // value to grab for event listener
        .classed("active", false)
        .classed("inactive", true)
        .text("Emissions CO2");
    
    
    // updateToolTip 
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // axis labels event listener
    xlabelsGroup.selectAll("text").on("click", function() {

        // get value of selection
        var valueX = d3.select(this).attr("value");


        if (valueX !== chosenXAxis) { //for homework change this to if value in...

            // replaces chosenXAxis with value
            chosenXAxis = valueX;

            console.log(`chosenX: ${chosenXAxis}`)
            console.log(`chosenY: ${chosenYAxis}`)

            // updates x scale for new data
            xLinearScale = xScale(healthData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            circlesLable = renderCircleLabels(circlesLable, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenXAxis === "HDI") {
                HDILabel
                    .classed("active", true)
                    .classed("inactive", false);
                EconAgLabel
                    .classed("active", false)
                    .classed("inactive", true);
                EconIndLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            if (chosenXAxis === "EconAg"){
                HDILabel
                    .classed("active", false)
                    .classed("inactive", true);
                EconAgLabel
                    .classed("active", true)
                    .classed("inactive", false);
                EconIndLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            if (chosenXAxis === "EconInd"){
                HDILabel
                    .classed("active", false)
                    .classed("inactive", true);
                EconAgLabel
                    .classed("active", false)
                    .classed("inactive", true);
                EconIndLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
            
        } 

    });

    ylabelsGroup.selectAll("text").on('click', function(){

        // get value of selection
        var valueY = d3.select(this).attr("value");


        if (valueY !== chosenYAxis){
        
            // replaces chosenXAxis with value
            chosenYAxis = valueY;

            console.log(`chosenY: ${chosenYAxis}`)
            console.log(`chosenX: ${chosenXAxis}`)

            // updates x scale for new data
            yLinearScale = yScale(healthData, chosenYAxis);

            // updates x axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            circlesLable = renderCircleLabels(circlesLable, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            // changes classes to change bold text
            if (chosenYAxis === "BioCap_RD") {
                BioCap_RDLabel
                    .classed("active", true)
                    .classed("inactive", false);
                FTotalLabel
                    .classed("active", false)
                    .classed("inactive", true);
                EmissionLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            if (chosenYAxis === "Footprint_Total"){
                BioCap_RDLabel
                    .classed("active", false)
                    .classed("inactive", true);
                FTotalLabel
                    .classed("active", true)
                    .classed("inactive", false);
                EmissionLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            if (chosenYAxis === "Emissions_CO2"){
                BioCap_RDLabel
                    .classed("active", false)
                    .classed("inactive", true);
                FTotalLabel
                    .classed("active", false)
                    .classed("inactive", true);
                EmissionLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    });

}).catch(function(error) {
        console.log(error);
});