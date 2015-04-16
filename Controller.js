/*------------------------------------------*/
/*		ON STARTUP							*/
/*------------------------------------------*/
var movieData = '';
var movieBackdrop = 'http://image.tmdb.org/t/p/w185';

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
   $("ol").empty();
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
	hideResults();
	hideMusicResults();
	document.getElementById("title").innerHTML = "MediaMatrix"
	displayOpening();
}

// Display the elements of the data screen
function displayResults() {
	document.getElementById("buttonsR").style.display = "block";
	document.getElementById("backdrop").style.display = "inline";
	document.getElementById("poster").style.display = "inline";
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
	var elems = document.getElementsByClassName("movieData");
	for(i = 0; i < elems.length; i++) {
		elems[i].style.display = "none";
	}
}

// Display the elements of the data screen
function displayMusicResults() {
	document.getElementById("buttonsR").style.display = "block";
	document.getElementById("band").style.display = "inline";
	var elems = document.getElementsByClassName("musicData");
	for(i = 0 ; i < elems.length; i++) {
		elems[i].style.display = "block";
	}
}

// Hide the elements of the data screen
function hideMusicResults() {
	document.getElementById("buttonsR").style.display = "none";
	document.getElementById("band").style.display = "none";
	var elems = document.getElementsByClassName("musicData");
	for(i = 0; i < elems.length; i++) {
		elems[i].style.display = "none";
	}
}

/*-----------------------------------------*/
/*		CALLBACKS	  					   */
/*-----------------------------------------*/

// Success callback for if movie is found
function success(data) {
	console.log("Success callback");
	almostData = $.parseJSON(data);
	movieData = JSON.stringify(almostData);
	parseSearchData(movieData);
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
			console.log(element);
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

// Checks if a char is a letter a-z
function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
