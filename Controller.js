/*------------------------------------------*/
/*		ON STARTUP							*/
/*------------------------------------------*/
var movieData = '';
var movieBackdrop = 'http://image.tmdb.org/t/p/w185';
var youtubeTrailers = 'http://www.youtube.com/v/'

/* Create a cache object */
var cache = new LastFMCache();

/* Create a LastFM object */
var lastfm = new LastFM({
  apiKey    : 'c552f90db5abc8f1feeb4c20c1eeb8be',
  apiSecret : '145d5b41c3f929076b216f8253cd36d9',
  cache     : cache
});


// Will run when DOM is fully loaded
$(document).ready(function() {
	hideResults();
	hideMusicResults();
});

/*------------------------------------------*/
/*	HOME SCREEN VARIABLES AND FUNCTIONS 	*/
/*------------------------------------------*/

var musicButton = document.getElementById('musicBut');

// Make sure musicButton is not null
// if null alert the error and possible solution.
if(musicButton) {
	musicButton.addEventListener('click', musicFun);
}
else {
	alert("Error the music button is undefined!\n Try reloading the web page.");
}

var movieButton = document.getElementById('movieBut');
// Make sure movieButton is not null
// if null alert the error and possible solution.
if(movieButton) {
	movieButton.addEventListener('click', movieFun);
}
else {
	alert("Error the movie button is undefined!\n Try reloading the web page.");
}

function add_top_albums(data){
   $("ul").empty();
   var list = document.getElementById('TopAlbums');
   size=10;
   if(data.topalbums.album.length<10){size=data.topalbums.album.length;}
   for(i=0; i<10; i++){
   var newitem=document.createElement("li");
   var a = document.createElement("a");
   a.textContent = data.topalbums.album[i].name;
   //console.log(data.topalbums.album[i].url);
   a.setAttribute('href',data.topalbums.album[i].url);
   a.setAttribute('target',"_blank");
   newitem.appendChild(a);
   list.appendChild(newitem);
  }
 }

// Function for when the music button is clicked
// Change title to the title of the search data
function musicFun() {
	searchData = document.getElementById("searchdata").value;
	var parsedData = parseForSearch(searchData);
	document.getElementById("title").innerHTML = searchData;
	/* Load some artist info. */
	console.log(searchData);
	lastfm.artist.getInfo({artist: searchData}, {success: function(data){
  /* Use data. */
  console.log("Success callback");
   console.log(data);
 
   console.log("1");
   if (typeof data.artist.image != "undefined") {
	   document.getElementById("band").src = data.artist.image[3]["#text"];
   }
   
   if (typeof data.artist.bio != "undefined") {
	   document.getElementById("bio").innerHTML = "Bio: " + data.artist.bio.content;
   }
   else {
	   document.getElementById("bio").style.display = "none";
   }
   
   if (typeof data.artist.bandmembers != "undefined") {
	   if (data.artist.bandmembers.member.length > 0) {
		   var bandmembers = data.artist.bandmembers.member[0].name;
		   for (i = 1; i < data.artist.bandmembers.member.length; i++) {
			   bandmembers = bandmembers + ", " + data.artist.bandmembers.member[i].name;
		   }
		   document.getElementById("members").innerHTML = "Members: " + bandmembers;
	   }
   }
   else {
	   document.getElementById("members").style.display = "none";
   }
   
   if (typeof data.artist.bio != "undefined") {
	   document.getElementById("origin").innerHTML = "Origin: " + data.artist.bio.placeformed;
	   document.getElementById("yearFormed").innerHTML = "Year Formed: " + data.artist.bio.yearformed;
   }
   else {
	   document.getElementById("origin").style.display = "none";
	   document.getElementById("yearFormed").style.display = "none";
   }
   
   if (typeof data.artist.tags != "undefined") {
	   if (data.artist.tags.tag.length > 0) {
		   var genres = data.artist.tags.tag[0].name;
		   for (i = 1; i < data.artist.tags.tag.length; i++) {
			   genres = genres + ", " + data.artist.tags.tag[i].name;
		   }
		   document.getElementById("genre").innerHTML = "Genres: " + genres;
	   }
   }
   else {
	   document.getElementById("genre").style.display = "none";
   }
   
   lastfm.artist.getTopAlbums({artist: searchData}, {success: function(data1){
	 /* Use data. */
	 console.log("Success callback albums");
	  console.log(data1);
	  console.log("1");
	 add_top_albums(data1);
		
		}, error: function(code, message){
		 /* Show error message. */
		 console.log("Error");
		}
		}
	);
   
}, error: function(code, message){
  /* Show error message. */
  console.log("Error");
}});
	hideOpening();
	displayMusicResults();
}

// Function for when the movie button is clicked
// Use API to find the movie and then parse the JSON string
// Display data on next screen also
function movieFun() {
	searchData = document.getElementById("searchdata").value;
	var parsedData = parseForSearch(searchData);
	theMovieDb.search.getMovie({"query": parsedData, "page": 1}, success, error);
	hideOpening();
	displayResults();
}

// Hides the opening page elements
function hideOpening() {
	document.getElementById("buttons").style.display = "none";
	document.getElementById("moresearchshit").style.display = "none";
	document.getElementById("searchshit").style.display = "none";
	document.getElementById("prompt").style.display = "none";
}	

// Displays the opening screen elements
function displayOpening() {
	document.getElementById("buttons").style.display = "block"
	document.getElementById("moresearchshit").style.display = "block";
	document.getElementById("searchshit").style.display = "block";
	document.getElementById("prompt").style.display = "block"
}

/*---------------------------------------*/
/*	DATA SCREEN VARIABLES AND FUNCTIONS  */
/*---------------------------------------*/

var backButton = document.getElementById('backBut');
// Make sure back button is not null
// if null alert the error and possible solution.
if(backButton) {
	backButton.addEventListener('click', backFun);
}
else {
	alert("Error the back button is undefined!\n Try reloading the web page.");
}

// Function for when the back button is clicked
function backFun() {
	document.getElementById("YTTrailer").data = "";
	hideResults();
	hideMusicResults();
	//document.getElementById("searchdata").innerHTML = "none";

	document.getElementById("title").innerHTML = "MediaMatrix"
	document.getElementById("credits").innerHTML = "<b><u>CAST:</b></u><br>";
	document.getElementById("Reviews").innerHTML = "<b><u>REVIEWS:</b></u><br>";
	document.getElementById("similarMovies").innerHTML = "<b><u>SIMILAR MOVIES:</b></u><br>";
	displayOpening();
}

// Display the elements of the data screen
function displayResults() {
	document.getElementById("buttonsR").style.display = "block";
	document.getElementById("backdrop").style.display = "inline";
	document.getElementById("poster").style.display = "inline";
	document.getElementById("credits").style.display = "block";
	document.getElementById("Reviews").style.display = "block";
	document.getElementById("YTTrailer").style.display = "block";
	document.getElementById("similarMovies").style.display = "block";
	var elems = document.getElementsByClassName("movieData");
	for(i = 0 ; i < elems.length; i++) {
		elems[i].style.display = "block";
	}
}

// Hide the elements of the data screen
function hideResults() {
	document.getElementById("buttonsR").style.display = "none";
	document.getElementById("backdrop").style.display = "none";
	document.getElementById("poster").style.display = "none";
	document.getElementById("credits").style.display = "none";
	document.getElementById("Reviews").style.display = "none";
	document.getElementById("YTTrailer").style.display = "none";
	document.getElementById("similarMovies").style.display = "none";
	var elems = document.getElementsByClassName("movieData");
	for(i = 0; i < elems.length; i++) {
		elems[i].style.display = "none";
	}
	var elems2 = document.getElementsByClassName("musicData");
	for(i = 0; i < elems2.length; ++i) {
		elems2[i].style.display = "none";
	}
}

// Display the elements of the data screen
function displayMusicResults() {
	document.getElementById("TopAlbums").style.display = "block";
	document.getElementById("buttonsR").style.display = "block";
	document.getElementById("band").style.display = "inline";
	var elems = document.getElementsByClassName("musicData");
	for(i = 0 ; i < elems.length; i++) {
		elems[i].style.display = "block";	
	}
	var elems2 = document.getElementsByClassName("musicDataAlbums");
	for(i = 0 ; i < elems2.length; i++) {
		elems2[i].style.display = "block";
	}
}

// Hide the elements of the data screen
function hideMusicResults() {
	$("ul").empty();
	document.getElementById("TopAlbums").style.display = "none";
	document.getElementById("buttonsR").style.display = "none";
	document.getElementById("band").style.display = "none";
	//document.getElementById("searchshit").value = "";
	document.getElementById("band").innerHTML = " ";
	var elems = document.getElementsByClassName("musicData");
	for(i = 0; i < elems.length; i++) {
		elems[i].style.display = "none";
		elems[i].innerHTML=" ";
	}
	var elems2 = document.getElementById("MusicAblums");
	elems2.style.display = "none";
	//$("#TopAlbums").remove();
	var elems3 = document.getElementById("band");
	elems3.src="";
}

function cleanUp() {
	var elems = document.getElementsByClassName("movieData");
	for(i = 0; i < elems.length; ++i) {
		elems[i].innerHTML = '';
	}
	document.getElementById("backdrop").src = '';
	document.getElementById("poster").src = '';
}
/*-----------------------------------------*/
/*		CALLBACKS	  					   */
/*-----------------------------------------*/

// Success callback for if movie is found
function success(data) {
	console.log("Entering success function");
	console.log("Success callback");
	almostData = $.parseJSON(data);
	console.log(almostData);
	if(almostData.results.length != 0) {
		movieData = JSON.stringify(almostData.results[0]);
		parseSearchData(movieData);
	}
	else {
		alert("Movie was not found please check spelling and try again.")
		cleanUp();
	}
}

// Success for finding the credits by ID
function successID(data) {
	console.log("Successfully found Movie ID!");
	almostData = $.parseJSON(data);
	for (j = 0; j < parseInt(almostData.cast.length); ++j) {
		creditsData = JSON.stringify(almostData.cast[j]);
		parseCreditData(creditsData);
	}
}

// Success callback for getting the Reviews
function successReviews(data) {
	console.log("Successfully found Reviews!");
	almostData = $.parseJSON(data);
	if (almostData.results.length == 0) {
		parseReviewData("none");
	}
	else {
		for(j = 0; j < parseInt(almostData.results.length); ++j) {
			reviewData = JSON.stringify(almostData.results[j]);
			parseReviewData(reviewData);
		}
	}
}

// Success callback for getting the Trailers
function successTrailers(data) {
	console.log("Successfully found Trailers!");
	almostData = $.parseJSON(data);
	if(almostData.quicktime.length == 0 && almostData.youtube.length == 0) {
		parseTrailerData("none");
	}
	else{
		trailerData = JSON.stringify(almostData.youtube[0]);
		parseTrailerData(trailerData);
	}
}

// Success callback for getting similar movies
function successSimilar(data) {
	console.log("Successfully found similar movies!");
	almostData = $.parseJSON(data);
	console.log(almostData);
	if(almostData.results.length == 0) {
		parseSimilarData("none");
	}
	else {
		for(j = 0; j < almostData.results.length; ++j) {
			similarData = JSON.stringify(almostData.results[j]);
			parseSimilarData(similarData);
		}
	}
}

// Failure callback for if movie is not found or error occurs
function error(data) {
	console.log("Error callback: " + data);
}

//success callback for music
function success_m(data){
console.log("Success callback");
almostData = $.parseJSON(data);
MusicData = JSON.stringify(almostData);
console.log(MusicData);
}

// Failure callback for if movie is not found or error occurs
function error_m(data) {
	console.log("Error callback: " + data);
}

/*----------------------------------------*/
/*	PARSER FUNCTIONS & HELPERS			  */
/*----------------------------------------*/

// Parse the user input for the API search
function parseForSearch(data) {
	var newData = '';
	for (i = 0; i < data.length; i++){
		if(data.charAt(i) == ' ') {
			newData = newData + "%20";
		}
		else {
			newData = newData + data.charAt(i);
		}
	}
	return newData;
}

// Parse the JSON string and get data elements
function parseSearchData(data) {
	var element = ''
	for (i = 0; i < data.length; i++) {
		if(data.charAt(i) == ':') {
			checkElementAndAssign(element, i, data);
			element = ''
		}
		else if(isLetter(data.charAt(i))) {
			element = element + data.charAt(i);
		}
		else if(data.charAt(i) == ',') {
			element = '';
		}
		else if(data.charAt(i) == '}') {
			i = data.length;
		}
	}
}

// Parse the JSON string and get the elements required
function parseCreditData(data) {
	var element = '';
	for (i = 0; i < data.length; i++) {
		if(data.charAt(i) == ':') {
			checkCreditAndAssign(element, i, data);
			element = '';
		}
		else if(isLetter(data.charAt(i))) {
			element = element + data.charAt(i);
		}
		else if(data.charAt(i) == ',') {
			element = '';
		}
		else if(data.charAt(i) == '}') {
			break;
		}
	}
}

// Parse the review data
function parseReviewData(data) {
	if (data == "none") {
		document.getElementById("Reviews").innerHTML = document.getElementById("Reviews").innerHTML + "No Reviews for this movie."
	}
	else {
		var element = '';
		for(i = 0; i< data.length; ++i) {
			if(data.charAt(i) == ':') {
				checkReviewAndAssign(element, i, data);
				element = '';
			}
			else if(isLetter(data.charAt(i))) {
				element = element + data.charAt(i);
			}
			else if(data.charAt(i) == ',') {
				element = '';
			}
			else if(data.charAt(i) == '}') {
				break;
			}
		}	
	}
}

// Parse the trailer data
function parseTrailerData(data) {
	if(data == "none") {
	}
	else {
		var element = '';
		for(i = 0; i < data.length; ++i) {
			if(data.charAt(i) == ':') {
				if(element == "source") {
					placeTrailer(i, data);
					break;
				}
			}
			else if(isLetter(data.charAt(i))) {
				element = element + data.charAt(i);
			}
			else if(data.charAt(i) == ',') {
				element = '';
			}
			else if(data.charAt(i) == '}') {
				break;
			}
		}
	}
}

// Parse the similar movies data
function parseSimilarData(data) {
	if (data == "none") {
		document.getElementById("similarMovies").innerHTML = document.getElementById("similarMovies").innerHTML + "No similar movies to this movie."
	}
	else {
		var element = '';
		for(i = 0; i< data.length; ++i) {
			if(data.charAt(i) == ':') {
				console.log
				if(element == "title") {
					placeSimilarTitle(i, data);
					break;
				}
			}
			else if(isLetter(data.charAt(i))) {
				element = element + data.charAt(i);
			}
			else if(data.charAt(i) == ',') {
				element = '';
			}
			else if(data.charAt(i) == '}') {
				break;
			}
		}	
	}
}

// Check which element we have to assign a value for
function checkElementAndAssign(element,ind,data) {
	if (element == "title") {
		placeTitle(ind, data);
	}
	if (element == "backdroppath") {
		placeBackdrop(ind, data);
	}
	if (element == "posterpath") {
		placePoster(ind, data);
	}
	if (element == "releasedate") {
		placeReleaseDate(ind, data);
	}
	if (element == "voteaverage") { 
		placeRatingAvg(ind, data) 
	}
	if (element == "votecount") {
		placeTotalRating(ind, data);
	}
	if (element == "id") {
		saveIDandSearch(ind, data);
	}
}


// Checks the credit element then asssigns it to its spot
function checkCreditAndAssign(element, ind, data) {
	if(element == "character") {
		placeCharacter(ind, data);
	}
	if(element == "name") {
		placeName(ind, data);
	}
}

// Check the review element and assigns it to its spot
function checkReviewAndAssign(element, ind, data) {
	if(element == "author") {
		placeAuthor(ind, data);
	}
	if(element == "content") {
		placeContent(ind, data);
	}
}

// Get the value of the title and add to HTML page
function placeTitle(ind, data) {
	var value = '';
	for(i = ind+1; i<data.length; ++i) {
		if(data.charAt(i) == ',') {
			break;
		}
		else if(data.charAt(i) != '"') {
			value = value + data.charAt(i);
		}
	}
	document.getElementById("title").innerHTML = value;
}

// Get value of the backdrop image and add to HTML
function placeBackdrop(ind, data) {
	var value = '';
	for(i = ind+1; i<data.length; ++i) {
		if(data.charAt(i) == ',') {
			break;
		}
		else if(data.charAt(i) != '"') {
			value = value + data.charAt(i);
		}
	}
	document.getElementById("backdrop").src = (movieBackdrop + value);
}

// Get value of the poster image and add to HTML
function placePoster(ind, data) {
	var value = '';
	for(i = ind+1; i<data.length; ++i) {
		if(data.charAt(i) == ',') {
			break;
		}
		else if(data.charAt(i) != '"') {
			value = value + data.charAt(i);
		}
	}
	document.getElementById("poster").src = (movieBackdrop + value);
}

// Get value of the release date and add to HTML
function placeReleaseDate(ind, data) {
	var value = '';
	for(i = ind+1; i <data.length; i++) {
		if(data.charAt(i) == ',') {
			break;
		}
		else if(data.charAt(i) != '"') {
			value = value + data.charAt(i);
		}
	}
	document.getElementById("release").innerHTML = "Release Date: " + value;
}

// Get value of the average rating and add to HTML
function placeRatingAvg(ind, data) {
	var value = '';
	for(i = ind+1; i < data.length; i++) {
		if(data.charAt(i) == ',') {
			break;
		}
		else if(data.charAt(i) != '"') {
			value = value + data.charAt(i);
		}
	}
	document.getElementById("ratingAvg").innerHTML = "Rating Average (1-10): " + value;
}

// Get total number of ratings and add to HTML
function placeTotalRating(ind, data) {
	var value = '';
	for(i = ind+1; i < data.length; i++) {
	if(data.charAt(i) == '}') {
			break;
		}
		else if(data.charAt(i) != '"') {
			value = value + data.charAt(i);
		}
	}
	document.getElementById("totalRatings").innerHTML = "Total number of ratings: " + value;
}

// Places the name of a similar movie title into the HTML page
function placeSimilarTitle(ind, data) {
	var value = '';
	for(i = ind+1; i < data.length; ++i) {
		if(data.charAt(i) == ',') {
			break;
		}
		else if(data.charAt(i) != '"') {
			value = value + data.charAt(i);
		}
	}
	value = value + "<br>";
	document.getElementById("similarMovies").innerHTML = document.getElementById("similarMovies").innerHTML + value;
}

// Save the Movie ID and search for its credits to get cast
function saveIDandSearch(ind, data) {
	var value = '';
	for(i = ind+1; i < data.length; i++) {
		if(data.charAt(i) == ',') {
			break;
		}
		else if(data.charAt(i) != '"' && data.charAt(i) != ',') {
			value = value + data.charAt(i);
		}
	}
	savedMovieID = value;
	theMovieDb.movies.getCredits({"id": savedMovieID}, successID, error);
	theMovieDb.movies.getReviews({"id": savedMovieID}, successReviews, error);
	theMovieDb.movies.getTrailers({"id": savedMovieID}, successTrailers, error);
	theMovieDb.movies.getSimilarMovies({"id": savedMovieID}, successSimilar, error);
}

// Places the characters name in the movie.
function placeCharacter(ind, data) {
	var value = '';
	for(i = ind+1; i < data.length; ++i) {
		if(data.charAt(i) == ',') {
			break;
		}
		else if(data.charAt(i) != '"' && data.charAt(i) != ',') {
			value = value + data.charAt(i);
		}
	}
	value = value + " - ";
	document.getElementById("credits").innerHTML = document.getElementById("credits").innerHTML + value;
}

// Places the name of the character 
function placeName(ind, data) {
	var value = '';
	for(i = ind+1; i < data.length; ++i) {
		if(data.charAt(i) == ',') {
			break;
		}
		else if(data.charAt(i) != '"' && data.charAt(i) != ',') {
			value = value + data.charAt(i);
		}
	}
	value = value + "<br>";
	document.getElementById("credits").innerHTML = document.getElementById("credits").innerHTML + value;
}

// Places the author of reviews name in the HTML code
function placeAuthor(ind, data) {
	var value = '';
	for(i = ind+1; i <data.length; ++i) {
		if(data.charAt(i) == ',') {
			break;
		}
		else if(data.charAt(i) != '"' && data.charAt(i) != ',') {
			value = value + data.charAt(i);
		}
	}
	value = value + " - "
	document.getElementById("Reviews").innerHTML = document.getElementById("Reviews").innerHTML + value;
}

// Places the content of the review after the authors name.
function placeContent(ind, data) {
	var value = '';
	for(i = ind+1; i < data.length; ++i) {
		if(data.charAt(i) == '"') {
			if(data.charAt(i+1) == ",") {
				break;
			}
		}
		else if(data.charAt(i) == "\\") {
			++i;
		}
		else if(data.charAt(i) != '"' && data.charAt(i) != ',' && data.charAt(i) != '\\') {
			value = value + data.charAt(i);
		}
	}
	value = value + "<br><br>"
	document.getElementById("Reviews").innerHTML = document.getElementById("Reviews").innerHTML + value;
}

// Places the trailer into the web page
function placeTrailer(ind, data) {
	var value = ''
	for(i = ind+1; i < data.length; ++i) {
		if(data.charAt(i) == ',') {
			break;
		}
		else if(data.charAt(i) != '"' && data.charAt(i) != ',') {
			value = value + data.charAt(i);
		}
	}
	value = youtubeTrailers + value;
	document.getElementById("YTTrailer").data = value;
}

// Checks if a char is a letter a-z
function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
