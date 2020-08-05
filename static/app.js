
//make color for bar chart
function barColor(group) {
    switch (group) {
    case "Footprint_Carbon":
      return "#b38f00";
    case "Footprint_Crop":
      return "#806600";
    case "Footprint_Fish":
      return "#608000";
    case "Footprint_Forest":
      return "#394d00";
    case "Footprint_Graze":
      return "#662200";
    case "Footprint_Total":
        return "#800000";
    default:
      return "black";
    }
}


//set initial parameters (This will be size of entire svg)
var svgWidth = 800;
var svgHeight = 700;

var margin = {
  top: 40,
  right: 20,
  bottom: 100,
  left: 100
};

//create width and height for axis that will allow space from sides of svg
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var bar_svg = d3.select("#bar-div")
    .append("svg")
    .attr("viewBox", "0 0 900 700")
    .classed("svg-content-responsive", true)
    .attr("id","update-svg")

bar_svg.append("text")
    .classed("bar-starter", true)
    .attr("x", 100)
    .attr("y", height/2)
    .text("Select a country from the map above to see data")
    



//This function will go inside click event in map
function createBar(x){

    d3.json("http://localhost:5000/api/v1.0/EnvData").then((data) => {

        //filter data for bar graph by selected country
        CD = data.filter(f => f.Country === x)
        console.log(`Test data`, CD)

        //get the data into appropriate format for bar graph
        selectedData = []

        Object.entries(CD[0]).forEach(([key, value]) => {
            if (key.includes("Footprint")){
                console.log(key)
                console.log(value)
                Dic = {"group":key, "value":value}
                selectedData.push(Dic)
            }
        });

        console.log("myList", selectedData)

        
        function updateBar(CD, selectedData) {

            bar_svg.selectAll("*").remove();

            var barGroup = bar_svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
                .style("font", "14px times")
                .call(leftAxis);
        
            barGroup.append("g")
                .style("font", "15px times")
                .style("font-weight","bold")
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis)
                .selectAll("text")
                    .attr("y", 0)
                    .attr("x", 10)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(45)")
                    .style("text-anchor", "start");
        
            barGroup.selectAll(".bar")
                .data(selectedData)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => xBandScale(d.group))
                .attr("y", d => yLinearScale(d.value))
                .attr("width", xBandScale.bandwidth())
                .attr("height", d => height - yLinearScale(d.value))
                .attr("fill", function(d) { return barColor(d.group) })
            
            //Set title
            barGroup.append("text")
                .data(CD)
                .attr("x", (width / 2))             
                .attr("y", 40 - (margin.top/2))
                .attr("text-anchor", "middle")  
                .style("font-size", "25px") 
                .style("font-weight", 800)
                .style("text-decoration", "underline")  
                .text(function(d){
                    return d.Country
                });
            
                var ylabel = barGroup.append("g")
                    .attr("transform", `translate(-80,${height/2})`);
        
        
                ylabel.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 20)
                    .attr("x", -120)
                    .text("Ecological Footprint (Global Hectares per person)");

        }//end updateBar function

        updateBar(CD, selectedData)
        
    })//end d3 call
    
}//end function createBar

///////////////////SCATTER//////////////////////

//SET UP SVG

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var scatter_svg = d3
    .select("#scatter-div")
    .append("svg")
    .attr("viewBox", "0 0 900 700")//set the viewbox to svg original height and width
    .classed("svg-content-responsive", true)
    .attr("id","scatter-svg")
    .style("font", "20px times")
    

// Append an SVG group
var chartGroup = scatter_svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//BUILD MAIN FUNCTIONS TO USE IN SCATTER PLOT UPDATE FUNCTION

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
        .attr("class", "toolTip") //made capital T to distinguish from map tooltip
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
  
var chosenYAxis = "Footprint_Total";
var chosenXAxis = "HDI";


//CREATE FUNCTION TO BRING SCATTER TOGETHER

function getData() {
    //wait for the promise 
    d3.json("http://localhost:5000/api/v1.0/EnvData").then((data) => {
        console.log(`x & y: ${chosenXAxis},${chosenYAxis}`)
        
        var EnvData = data.filter(d => d.BioCap_RD !== 0)
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
            .style("font", "14px times")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
  
        // append y axis
        var yAxis = chartGroup.append("g")
            .classed("y-axis",true)
            .style("font", "14px times")
            .call(leftAxis);
    
        // append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(EnvData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 15)
            .attr("fill", function(d) { 
                if(d.BioCap_RD > 0){return ResColor(d.BioCap_RD)}
                else {return DefColor(d.BioCap_RD)}
            })
            .attr("stroke", "steelblue")
            .attr("opacity", ".5")

    
        //create labels (I decided labels made it too busy)
        // var circlesLable = chartGroup.selectAll("text").exit()
        //     .data(EnvData)  
        //     .enter()
        //     .append("text")
        //     .attr("x", d => xLinearScale(d[chosenXAxis])-10)
        //     .attr("y", d => yLinearScale(d[chosenYAxis])+5)
        //     .text(d => d.Data_Quality)
        //     .attr("class","Data_Quality");
    
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
    
    
        var FTotalLabel = ylabelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20)
            .attr("x", 0)
            .attr("value", "Footprint_Total") // value to grab for event listener
            .classed("active", true)
            .classed("inactive", false)
            .text("Total Ecological Footprint");
        
        chartGroup.append("text")
            .attr("x", (width / 2))             
            .attr("y", 40 - (margin.top/2))
            .attr("text-anchor", "middle")  
            .style("font-size", "25px") 
            .style("font-weight", 800)
            .style("text-decoration", "underline")  
            .text("World Ecological Data")
    
    
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

                //circlesLable = renderCircleLabels(circlesLable, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

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

    });//end of d3.json for main data
}// end of getData function

/////////////////////// MAKE MAP ///////////////////////////

//old color function (didn't use)
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
    else if (data >= 4 && data < 6){result = "#669900"}
    else if (data >= 6 && data < 8){result = "#446600"}
    else if (data >= 8 && data < 10){result = "#00802b"}
    else if (data >= 10){result = "#334d00"}
    else {result == "black"}

    return result
}//end old color function

//color for divergent color scale
var DefColorMin = "#ffcc00",
    DefColorMax = "#330000",
    ResColorMin = "#00cc00",
    EqualColor = "grey",
    ResColorMax = "#001a00";

var DefColor = d3.scaleLinear()
    .range([DefColorMin, DefColorMax])
    .domain([-0.001,-7])
    .interpolate(d3.interpolateLab);
var ResColor = d3.scaleLinear()
    .range([ResColorMin, ResColorMax])
    .domain([0.001,15])
    .interpolate(d3.interpolateLab);


//Width and height of map
var w = 100;
var h = 50;

// D3 map Projection
var projection = d3
   .geoEquirectangular()
   .center([0, 15]) // set centre to further North
   .scale(16) // scale to fit group width
   .translate([w/2,h/2]) // ensure centred in group
;

// Define path generator
var path = d3.geoPath().projection(projection)  // tell path generator to use projection

//Create the svg to put the map inside
var map_svg = d3.select("#map-div")
    .append("svg")
    .attr("preserveAspectRatio", "none")
    .attr("viewBox", "0 0 100 50")
    .classed("map-svg", true);

//make the tooltip for the map
var Tooltip = d3.tip()
    .attr("class", "Tooltip")
    .html(function(d){
        console.log(d)
        if (d.properties.BioCap_RD !== 0){return d.properties.ADMIN + "<br>" + "BioCap: " + d.properties.BioCap_RD}
        else {return d.properties.ADMIN + ": No Data"}
    })
    


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
        .style("stroke", "black")
        .style("stroke-width", ".05")
        .style("fill", function(d) {
            if (d.properties.BioCap_RD === 0){
                return EqualColor
            } else if (d.properties.BioCap_RD > 0){
                return ResColor(d.properties.BioCap_RD)
            } else {
                return DefColor(d.properties.BioCap_RD)
            }

        })
        .call(Tooltip)
        .on("mouseover", function(d){
            Tooltip.show(d);
        })
        .on("mouseleave", function(d){
        Tooltip.hide(d);
        })
        

    MyPaths.on("click", function(d) {
        ChosenCountry  = d.properties.ADMIN
        console.log(`ChosenCountry: ${ChosenCountry}`)
        return createBar(ChosenCountry)//this function makes bar graph

    })//end mouseclick 

    //Make Map Title
    map_svg.append("text")
        .attr("x", 50)             
        .attr("y", 3)
        .attr("text-anchor", "middle")  
        .style("font-size", "2.5px") 
        .style("font-weight", 800)
        .text("BioCapacity by Country")
    
    /// MAKE LEGEND for MAP///

    var legend = map_svg.append("g")
        .attr("class", "legend")
        .style("font", "1.3px times")
        .attr("transform", "translate(5,-10)")

    var legend_width = 12
    var divisions = 12
    var fakeData = [];
    var rectWidth = Math.floor(legend_width / divisions);

    for (var i=0; i < legend_width/2; i+= rectWidth ) {
        fakeData.push(i);
    }

    var ResColorScaleLegend = d3.scaleLinear()
          .domain([0, fakeData.length-1])
          .interpolate(d3.interpolateLab)
          .range([ResColorMin, ResColorMax]);
    var DefColorScaleLegend = d3.scaleLinear()
          .domain([fakeData.length-1,0])
          .interpolate(d3.interpolateLab)
          .range([DefColorMin, DefColorMax]);

    var ResLegend = legend.append("g").attr("class", "ResLegend").attr("transform", "translate("+(legend_width/2)+",0)"),
        DefLegend = legend.append("g").attr("class", "DefLegend");

    ResLegend.selectAll("rect")
        .data(fakeData)
        .enter()
        .append("rect")
            .attr("x", function(d) { return d; })
            .attr("y", 12)
            .attr("height", 1)
            .attr("width", rectWidth)
            .attr("fill", function(d, i) { return ResColorScaleLegend(i)});
    
    DefLegend.selectAll("rect")
        .data(fakeData)
        .enter()
        .append("rect")
            .attr("x", function(d) { return d; })
            .attr("y", 12)
            .attr("height", 1)
            .attr("width", rectWidth)
            .attr("fill", function(d, i) { return DefColorScaleLegend(i)});
    
    legend.append("text").text("0").attr("transform","translate("+((legend_width/2)-.5)+",15)");
    legend.append("text").text("-10").attr("transform","translate(-2,13)");
    legend.append("text").text("Deficit").attr("transform","translate(-2,15)");
    legend.append("text").text("10").attr("transform","translate("+(legend_width)+",13)");
    legend.append("text").text("Reserve").attr("transform","translate("+(legend_width-2)+",15)");



    //run the functions for the plots
    getData()


}) //Closes Geojson






