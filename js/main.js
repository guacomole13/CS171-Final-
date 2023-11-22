// declare global variables for visualization
let myHemisphere;
let initialHemisphereCat = document.getElementById('hemisphereCat').value;

// regulates dropbox for hemisphere
function hemisphereCatChange() {
    myHemisphere.key = document.getElementById('hemisphereCat').value;
    console.log(myHemisphere.key)
    myHemisphere.updateVis();
 }
 
// Load data with promises
let promises = [
    d3.json("data/movies_list.json"),
    d3.csv("data/oscars_df.csv")
];

// Initialize consensus plot variable
let consensus;

Promise.all(promises)
    .then(function (data) {
        createVis(data)
    })
    .catch(function (err) {
        console.log(err)
    });

function createVis(data) {    
    let movieList = data[0];
    let oscarsDF = data[1]

    console.log(data[1]);
    // Create visualization instances
    myHemisphere = new Hemisphere("hemisphere", initialHemisphereCat, parliamentDatasets);
    consensus = new ConsensusPlot("consensus", data[1])
}