// declare global variables for visualization
let branchHemisphere, raceHemisphere, genderHemisphere, myConsensus, myTimeline, myLollipop, rankchart, myClusterplot, studiovis, studiobubbles, myGenreBar;
let selectedTimeRange = [];
let parseYear = d3.timeParse('%Y'); // Convert OscarYear integer to a Date object
let dateFormatter = d3.timeFormat("%Y"); // Function to convert date objects to strings or reverse
 
// Load data with promises
let promises = [
    d3.json("data/movies_list.json"),
    d3.csv("data/oscars_df.csv"),
    d3.csv("data/film_budget_data.csv"),
    d3.json("data/cleanestdata.json"),
    d3.json("data/cleanestdata2.json")
];


Promise.all(promises)
    .then(function (data) {
        createVis(data)
    })
    .catch(function (err) {
        console.log(err)
    });

function createVis(data) {    
    let movieList = data[0];
    let oscarsDF = data[1];
    let budgetData = data[2];
    let squeakyCleanData = data[3];
    let squeakyCleanData2 = data[4];

    // Create visualization instances
    branchHemisphere = new Hemisphere("branchHemisphere", branchsizes_2022);
    raceHemisphere = new Hemisphere("raceHemisphere", raceproportions_2022);
    genderHemisphere = new Hemisphere("genderHemisphere", genderproportions_2022);
    // rankchart = new RankChart("rankchart", budgetData, movieList, squeakyCleanData);
    // studiovis = new StudioVis("studiovis", squeakyCleanData2)
    // studiobubbles = new StudioBubbles("studiobubbles", squeakyCleanData2)
    myClusterplot = new ClusterPlot("clusterplot", squeakyCleanData);
    myGenreBar = new GenreBar("genreBar", squeakyCleanData);

    /////// PREPARE DATA FOR CONSENSUS PLOT ////////

    // Filter the data to get only the movies that are winners of Best Picture Award
    const winners = oscarsDF.filter(movie => movie.Award === "Winner");

    // Initialize an empty array to store the display data
    let displayData = [];

    // Populate the displayData array with movie names, Tomatometer Rating, and Audience Rating
    displayData = winners.reduce((result, movie) => {
        // Push an object with required fields into the result array
        result.push({
            Film: movie.Film, // Movie Name
            OscarYear: movie['Oscar Year'], // Year of Oscars Ceremony
            CriticRating: movie['Tomatometer Rating'], // Tomatometer (Critic) Rating
            AudienceRating: movie['Audience Rating'] // Audience Rating
        });
        return result;
    }, []);

    // Insert the missing Tomatometer Rating and Audience Rating values
    displayData[2].CriticRating = 90;
    displayData[2].AudienceRating = 90;

    displayData[10].CriticRating = 95;
    displayData[10].AudienceRating = 88;

    displayData[11].CriticRating = 90;
    displayData[11].AudienceRating = 92;

    displayData[12].CriticRating = 98;
    displayData[12].AudienceRating = 92;

    displayData[37].CriticRating = 95;
    displayData[37].AudienceRating = 90;

    displayData[47].CriticRating = 96;
    displayData[47].AudienceRating = 97;

    displayData[62].CriticRating = 85;
    displayData[62].AudienceRating = 81;

    displayData[63].CriticRating = 87;
    displayData[63].AudienceRating = 87;

    displayData[82].CriticRating = 97;
    displayData[82].AudienceRating = 84;

    displayData[87].CriticRating = 91;
    displayData[87].AudienceRating = 78;

    displayData[92].CriticRating = 99;
    displayData[92].AudienceRating = 90;


    // Change string value numbers for critic and audience ratings to integers
    displayData.forEach(movie => {
        movie.OscarYear = parseFloat(movie.OscarYear) + 1;
        movie.OscarYear = parseYear(`${movie.OscarYear}`);
        movie.CriticRating = parseInt(movie.CriticRating, 10);
        movie.AudienceRating = parseInt(movie.AudienceRating, 10);
    });

    // New consensus plot object
    myConsensus = new ConsensusPlot("consensus", displayData);

    // New timeline object (brushVis that links to consensus plot)
    myTimeline = new Timeline('timeline', displayData);


    /////// PREPARE DATA FOR LOLLIPOP CHART ////////

    // Create empty array to store IMDB data
    const imdbData = [];

    oscarsDF.forEach((movie) => {
        // Extract 'Award', 'Oscar Year', and 'IMDB Rating' columns
        const { Film, Award, 'Oscar Year': OscarYear, 'IMDB Rating': IMDBRating } = movie;

        // Push an object with the extracted values to imdbData array
        imdbData.push({ Film, Award, OscarYear, IMDBRating });
    });

    // Change string value numbers to floats
    imdbData.forEach(movie => {
        movie.OscarYear = parseFloat(movie.OscarYear) + 1;
        movie.IMDBRating = parseFloat(movie.IMDBRating);
    });

    // New lollipop chart object
    myLollipop = new LollipopChart("lollipop", imdbData);

}
