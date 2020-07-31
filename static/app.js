
//define th color for map
function getColor(data){
    if (data === 0){result = "grey"} 
    else if (data <= -10){result = "#b30000"}
    else if (data >= -10 && data < -8){result = "#cc0000"}
    else if (data >= -8 && data < -6){result = "#ff471a"}
    else if (data >= -6 && data < -4){result = "#ff751a"}
    else if (data >= -4 && data < -2){result = "#ffa64d"}
    else if (data >= -2 && data < 0){result = "#ffcc00"}
    else if (data > 0 && data < 2){result = "#e6e600"} 
    else if (data >= 2 && data < 4){result = "#cccc00"}
    else if (data >= 6 && data < 8){result = "#ace600"}
    else if (data >= 8 && data < 10){result = "#86b300"}
    else if (data >= 10){result = "#558000"}
    else {result == "black"}

    return result
}//end color function

//Width and height of map
var width = 2000;
var height = 1000;

// D3 Projection
var projection = d3
   .geoEquirectangular()
   .center([0, 15]) // set centre to further North
   .scale([width/(2*Math.PI)]) // scale to fit group width
   .translate([width/2,height/2]) // ensure centred in group
;

// Define path generator
var path = d3.geoPath().projection(projection)  // tell path generator to use projection



//Create SVG element to append map to SVG
//Create SVG element and append map to the SVG

var map_svg = d3.select("#map-div")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 2000 1000")
    .classed("svg-content", true);


var toop_div = d3.select("#map-div")
    .append("div")
    .attr("class","tooltip")
    .style("opacity",0)


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


 
    d3.json("http://localhost:5000/api/v1.0/EnvData").then((data) => {
        console.log(`Data`, data)

        MyPaths.on("click", function(d) {
            // get value of selection
            var valueCountry = d.properties.ADMIN
            console.log(valueCountry)
            return valueCountry
        })//end mouseclick 
    
    })//Closes myData json

}) //Closes Geojson






