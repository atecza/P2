
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


d3.json("http://localhost:5000/api/v1.0/EnvData").then((data) => {
        console.log(`Data`, data.Data)

        EnvData = data.Data
        addCountry(EnvData.Country)

        //get the selected value
        var myCountry = d3.select("#selDataset").property("value")
        console.log(`selected: ${myCountry}`)
        
        //pull only the data for the selected ID
        var selectedData = EnvData.Country.filter(d => d.Country === myCountry);

        console.log(selectedData)