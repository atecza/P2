//set initial parameters
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
var scatter_svg = d3
    .select("#scatter-div")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = scatter_svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Build main functions
// function used for updating x-scale var upon click on axis label
function xScale(EnvData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(EnvData, d => d[chosenXAxis]), d3.max(EnvData, d => d[chosenXAxis])])
        .range([0, width]);
  
    return xLinearScale;
  
}//end function xScale
  
// function used for updating y-scale var upon click on axis label
function yScale(EnvData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.max(EnvData, d => d[chosenYAxis]), d3.min(EnvData, d => d[chosenYAxis])])
        .range([0, height]);
    
    return yLinearScale;
    
}//end function yScale
  
// function used for updating xAxis var upon click on axis label
function renderXAxes(xLinearScale, xAxis) {
    var bottomAxis = d3.axisBottom(xLinearScale);
    
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis; //returns the newly formatted x axis
}//end function renderXAxis
  
// function used for updating xAxis var upon click on axis label
function renderYAxes(yLinearScale, yAxis) {
    var leftAxis = d3.axisLeft(yLinearScale);
    
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis; //returns the newly formatted y axis
}// end function renderYAxes
  
// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis) {
  
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
      
    return circlesGroup;
  
}//end function renderCircles
  
function renderCircleLabels(circlesLable, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis){
    circlesLable.transition()
        .duration(1000)
        .attr("x", d => xLinearScale(d[chosenXAxis])-10)
        .attr("y", d => yLinearScale(d[chosenYAxis])+5)
      
    return circlesLable;
}//end function renderCircleLabels
  
  
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
      
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`Country: ${d['Country']}<br>${chosenXAxis}: ${d[chosenXAxis]}<br> ${chosenYAxis}: ${d[chosenYAxis]}`);
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
}//end function update tooltip
  
// Initial Param
  
var chosenYAxis = "BioCap_RD";
var chosenXAxis = "HDI";


////////////// Create Function for Everything with Data/////////

function getData() {
    //wait for the promise 
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
            .attr("fill", function(d) { return getColor(d.BioCap_RD)})
            .attr("stroke", "steelblue")
            .attr("opacity", ".5")

    
        //create labels
        var circlesLable = chartGroup.selectAll("text").exit()
            .data(EnvData)  
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d[chosenXAxis])-10)
            .attr("y", d => yLinearScale(d[chosenYAxis])+5)
            .text(d => d.Data_Quality)
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
    
        var BioCapLabel = ylabelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", 0) //this should be the outer most lable
            .attr("value", "BioCap") // value to grab for event listener
            .classed("active", true)
            .classed("inactive", false)
        .   text("Biologic Capacity");
    
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

            if (valueX !== chosenXAxis) { 

                // replaces chosenXAxis with value
                chosenXAxis = valueX;

                console.log(`chosenX: ${chosenXAxis}`)
                console.log(`chosenY: ${chosenYAxis}`)

                // updates x scale for new data
                xLinearScale = xScale(EnvData, chosenXAxis);

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
            
            }//end if statement about novel selection

        });// end xlabelsGroup select on click function

        ylabelsGroup.selectAll("text").on('click', function(){

            // get value of selection
            var valueY = d3.select(this).attr("value");

            if (valueY !== chosenYAxis){
        
                // replaces chosenXAxis with value
                chosenYAxis = valueY;

                console.log(`chosenY: ${chosenYAxis}`)
                console.log(`chosenX: ${chosenXAxis}`)

                // updates x scale for new data
                yLinearScale = yScale(EnvData, chosenYAxis);

                // updates x axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                circlesLable = renderCircleLabels(circlesLable, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenYAxis === "BioCap") {
                    BioCapLabel
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
                    BioCapLabel
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
                    BioCapLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    FTotalLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    EmissionLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            } //end if statement for novel selection
        });// end ylabelGroup select-on-click function

    });//end of d3.json for main data
}// end of getData function

//////////// MAKE MAP //////////////

//define th color for map
function getColor(data){
    if (data === 0){result = "grey"} 
    else if (data <= -10){result = "#800000"}
    else if (data >= -10 && data < -8){result = "#990000"}
    else if (data >= -8 && data < -6){result = "#cc0000"}
    else if (data >= -6 && data < -4){result = "#e60000"}
    else if (data >= -4 && data < -2){result = "#e65c00"}
    else if (data >= -2 && data < 0){result = "#ff751a"}
    else if (data > 0 && data < 2){result = "#e6b800"} 
    else if (data >= 2 && data < 4){result = "#b3b300"}
    else if (data >= 6 && data < 8){result = "#669900"}
    else if (data >= 8 && data < 10){result = "#446600"}
    else if (data >= 10){result = "#334d00"}
    else {result == "black"}

    return result
}//end color function

//Width and height of map
var w = 600;
var h = 300;

// D3 Projection
var projection = d3
   .geoEquirectangular()
   .center([0, 15]) // set centre to further North
   .scale(100) // scale to fit group width
   .translate([w/2,h/2]) // ensure centred in group
;

// Define path generator
var path = d3.geoPath().projection(projection)  // tell path generator to use projection


var map_svg = d3.select("#map-div")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 300")
    .classed("svg-content", true);


var Tooltip = d3.select("#map-div")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 1)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        Tooltip.style("opacity", 1)
    }
    var mousemove = function(d) {
        Tooltip
            .html(d.properties.ADMIN + "<br>" + "BioCap: " + d.properties.BioCap_RD)
            .style("left", (d3.mouse(this)[0]+100) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
        Tooltip.style("opacity", 0)
    }

//Load Map Data
d3.json("static/Data/EnvCountry.json").then((json) => {

    console.log(json)
    // Bind the data to the SVG and create one path per GeoJSON feature
    var MyPaths = map_svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", function(d) { return d.properties.ADMIN; }) //assign a value to each path
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", function(d) { return getColor(d.properties.BioCap_RD)})
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    

    MyPaths.on("click", function(d) {
        x = d.properties.ADMIN
        console.log(x)
    })//end mouseclick 

    getData()


}) //Closes Geojson






