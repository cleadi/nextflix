// Variables for search area
var searchBtn = $("#search-button");
var searchInputField = $("#input-text")[0];
var errorText = $(".error-text");

// Variables for results/popular movies area
resultsDiv = $(".resultsDiv");

//Global variables
var favoriteList = JSON.parse(localStorage.getItem("favoriteList")) || [];
var currentSearch = "";
var newFavoriteID = "";


// Pulls a query of current popular movies from API
function startPage() {
    
    var apiKey = "76e9c110b6137a307950d97ef6abdeff"; 
    var requestURL = "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey + "&language=en-US&page=1";

    fetch(requestURL)
        .then(function(response){
            if (response.ok) {
                 response.json().then(function(data) {
                    populatePopular(data);                    
            })
      // Alerts user if there is an error or if their input is invalid    
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function(error){
            alert("Unable to connect to Nextflix");
        })
}


// Uses the data from the API to display the main page cards with current popular movies
function populatePopular(data) {
    var cardCounter = 0;

    $(".card").each(function() {

        var posterPath = data.results[cardCounter].poster_path;
        var iconURL = "https://image.tmdb.org/t/p/original/" + posterPath;

        $(this).children(".card-img-top").attr("src", iconURL);
        $(this).children().children(".card-title").text(data.results[cardCounter].title);     
        $(this).children().children(".movie-desc").text(data.results[cardCounter].overview);
        $(this).children().children(".release-year").text(data.results[cardCounter].release_date);
        $(this).children().children(".movie-id").text(data.results[cardCounter].id);

        cardCounter++;
    })
}

// Calls the API to fetch data based on user search 
function getMovieAPI(currentSearch) {

    favoriteList = JSON.parse(localStorage.getItem("favoriteList"));
    
    var apiKey = "76e9c110b6137a307950d97ef6abdeff"; 
    var requestURL = "https://api.themoviedb.org/3/search/movie?api_key=76e9c110b6137a307950d97ef6abdeff&query=" + currentSearch;
    
    errorText.hide();

    fetch(requestURL)
        .then(function(response){
            if (response.ok) {
                response.json().then(function(data) {   
                    
                    if( !data.results.length ){
                        errorText.text("There were no records matching your search. Please try again.").show();
                    } else {
                        populateCards(data);
                    }        
        })
            // Alerts user if there is an error or if their input is invalid    
            } else {
               errorText.text("There was an error with your search. Please try again.").show();
            }
        })
        .catch(function(error){
            errorText.text("There was an error with your search. Please try again.").show();
        })
}

// Iterates over each existing card and populates it with query data for the user search
function populateCards(data) {
    var cardCounter = 0;
    
    $(".card").each(function() {

        if (cardCounter < data.results.length) {
        
        var posterPath = data.results[cardCounter].poster_path;
        var iconURL = "https://image.tmdb.org/t/p/original/" + posterPath;

        $(this).children(".card-img-top").attr("src", iconURL);
        $(this).children().children(".card-title").text(data.results[cardCounter].title);     
        $(this).children().children(".movie-desc").text(data.results[cardCounter].overview);
        $(this).children().children(".release-year").text(data.results[cardCounter].release_date);
        $(this).children().children(".movie-id").text(data.results[cardCounter].id);
        
        cardCounter++;
           
        } else {
            return;
        } 
    })
}

// Checks if new favorite movie id is already in local storage and if not pushes it there	
function saveFavorite(newFavoriteID) {
    
    if (localStorage.getItem("favoriteList") !== null && favoriteList.length > 0) {
        favoriteList = JSON.parse(localStorage.getItem("favoriteList"));

        if (!favoriteList.includes(newFavoriteID)) {
            // Adds movie to local storage array
                favoriteList.push(newFavoriteID);
                localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
            }    
    } else {
        favoriteList.push(newFavoriteID);
                localStorage.setItem("favoriteList", JSON.stringify(favoriteList));

    }
}



// Calls start function
startPage();

// Event listener for click on search button
searchBtn.click(function(event) {
    event.preventDefault();
    currentSearch = searchInputField.value;
    getMovieAPI(currentSearch);
    
    // Sets buttons to default text
    $(".favoriteButton").each(function(){
        $(this).text("Save movie");
    })
})

// Event listener for pressing enter rather than on the search button
$("#input-text").on("keypress", function(event) {

    if (event.key === "Enter"){
        event.preventDefault();
        currentSearch = searchInputField.value;
        getMovieAPI(currentSearch);
        
        // Sets buttons to default text
        $(".favoriteButton").each(function(){
            $(this).text("Save movie");
        })
    }
})

// Event listener on each card and send that movie's ID number to be saved in the next function
resultsDiv.click(function(event){
    newFavoriteID = $(event.target).closest(".text-center").siblings(".movie-id")[0].textContent;
    saveFavorite(newFavoriteID);
    // When Save to Favorites button is clicked the text changes to Saved to Favorites
    $(event.target).text("Saved to favorites");
    
})
