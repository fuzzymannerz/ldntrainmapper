/*////////////////////////////////////////
////        London Train Mapper       ////
////       By Fuzzy - thefuzz.xyz     ////
*/////////////////////////////////////////

// Tube station names API URL
var tubeurl = "https://marquisdegeek.com/api/tube/";
// Transport for London API settings
var tflappid = '935b6408';
var tflkey = '739705189de6451aab28019bb454145d';
var tflurl = 'https://api.tfl.gov.uk/Line/Mode/tube,overground,dlr/Status?app_id='+tflappid+'&app_key='+tflkey;

// When the page loads...
$(document).ready(function(){
	// Hide the error banner, clear the text box and hide the map area and info links
	$("#nope").hide();
	$("#info").hide();
	$('input').val("");
	$('#map').show();
	// Listen for 'enter' button press on textbox
    $('#userstation').keypress(function(e){
      if(e.keyCode==13)
      submission();
    });
  // Clear text box upon click and page load
	$('input').click(function() {
	$(this).val("")
	});
	// Fetch station name list for autocomplete text box
	$.ajax({
	  url: tubeurl,
	  dataType: 'json',
	  success: function(data){
	  var stationnamelist = [];
	  // Retrieve all station names from data array
      for (var index in data) {
      var namelist = data[index].name;
      stationnamelist.push(namelist);
      }
	// Set autocomplete settings
	$('#userstation').autocomplete({
	lookup: stationnamelist,
	onSelect: function (suggestion) {
	$(this).val(suggestion.value);
	submission();
	}
	});
	}});

// Hold the tube line vars for potential global usage
var trainlines = [];
var linestatus = [];

// Fetch tube line statuses
$.ajax({
  url: tflurl,
  dataType: 'json',
  success: function(data){
    for (var index in data) {
    var linelist = data[index].name;
    var status = data[index].lineStatuses[0].statusSeverityDescription;
    // Update the global vars
    trainlines.push(linelist);
    linestatus.push(status);
    }

    // Create table to display line status data
    function statustable() {
    var myTableDiv = document.getElementById("statustable")
    var table = document.createElement('table')
    table.setAttribute("id", "statustable");
    var tableBody = document.createElement('tbody')
    table.appendChild(tableBody);
    // Line Headings
    var tr = document.createElement('tr');
    tableBody.appendChild(tr);
    for (i = 0; i < trainlines.length; i++) {
        var th = document.createElement('th')
        th.appendChild(document.createTextNode(trainlines[i]));
        tr.appendChild(th);
    }
    //Status Rows
    var tr = document.createElement('tr');
    tableBody.appendChild(tr);
    for (i = 0; i < linestatus.length; i++) {
        var td = document.createElement('td')
        td.setAttribute("class", "status");
        td.appendChild(document.createTextNode(linestatus[i]));
        tr.appendChild(td);
    }
    myTableDiv.appendChild(table)
}

    // Set the line colours on table header
    var linecolours = new Array('#B36305','#E32017','#FFD300','#00782A','#00A4A7','#F3A9BB','#A0A5A9','#EE7C0E','#9B0056','#000000','#003688','#0098D4','#95CDBA');
    function alternate(id){ 
    var table = document.getElementById(id);
    var rows = table.getElementsByTagName("th");
    for(i = 0; i < rows.length; i++){
      doMultiple(rows[i], i);
    }
    }
    function doMultiple(row, i){
    row.style.backgroundColor = linecolours[i % linecolours.length];
    }
    // Display the table and set the colours of the lines and status
    statustable();
    alternate('statustable');
    // Set the service status colours
    $('.status:contains("Good")').css('background-color', '#45B29D');
    $('.status:contains("Minor")').css('background-color', '#EFC94C');
    $('.status:contains("Part")').css('background-color', '#EFC94C');
    $('.status:contains("Closed")').css('background-color', '#bc4545');
    $('.status:contains("Special")').css('background-color', '#bc4545');
    $('.status:contains("Severe")').css('background-color', '#bc4545');
    $('.status:contains("Bus")').css('background-color', '#bc4545');
    $('.status:contains("Reduced")').css('background-color', '#bc4545');
    $('.status:contains("Suspended")').css('background-color', '#bc4545');
    $('.status:contains("Diverted")').css('background-color', '#bc4545');
    $('.status:contains("Not")').css('background-color', '#bc4545');
    $('.status:contains("Issues")').css('background-color', '#EFC94C');
    $('.status:contains("frequency")').css('background-color', '#EFC94C');
    $('.status:contains("Step")').css('background-color', '#EFC94C');
  }
})
});

// Run on enter press...
function submission()
{
var userstation = document.getElementById("userstation");
// Make sure first letter of each word is a capital
function capitals(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
var stationname = capitals(userstation.value);

  	// Easter egg ;)
  	if (stationname.indexOf("Platform") != -1){
  	$('#station').html('Platform 9 3/4');
    $("#statustable").fadeOut();
  	$("#station").fadeIn();
    $("#map").css('height','280px');
  	$('#map').html('<center><img src="hp.jpg" width="auto" style="margin-left:auto:margin-right:auto;max-height:280px;"></center>');
  	$('#map').show();
  	$("#info").show();	
  	}
else{
// Retrieve the station info by name
$.ajax({
  url: tubeurl+'?name='+stationname,
  dataType: 'json',
  success: function(data){
  data = data[0];
  if (data == null){
  	$('input').val("");
  	$('input').fadeOut();
  	$("#map").fadeOut();
  	$("#nope").fadeIn();
  	$("body").mousemove(function() {
  	$("#nope").fadeOut();
  	$('input').fadeIn();
  	$("#map").fadeIn();
  	$("#info").fadeIn();
	});
  }

  else{
  // Make sure the map DIV is empty
  $('#map').html('');
  // Get the location of the train station
  var latitude = data.latitude;
  var longitude = data.longitude;
  // Create map from data
  mapboxgl.accessToken = 'pk.eyJ1IjoiZnV6enltYW5uZXJ6IiwiYSI6ImNpcmt5OGVpNTAwMmNocW0xaWIxZHNhaGUifQ.QbMRTKTXyNrOI_laS0_mHw';
	var map = new mapboxgl.Map({
	  container: 'map',
	  center: [longitude, latitude],
	  zoom: 15,
	  style: 'mapbox://styles/mapbox/streets-v9',
	  hash: false,
	});
	// Add user location button, map controls and enable touch and move features
	map.addControl(new mapboxgl.Geolocate({position: 'top-right'}));
	map.addControl(new mapboxgl.Navigation({position: 'top-left'}));
	map.touchZoomRotate.enable();
	map.dragRotate.enable();

  // Update the HTML & CSS elements
  $('input').val("");
  $("#msg").fadeOut();
  if(data.zone === ''){
  $('#station').html(data.name);
  }
  else{
  $('#station').html(data.name+' <span id="zone">(Zone '+data.zone+')</span>');
  }
  $("#station").fadeIn();
  $("#map").css('height','280px');
  $('#map').fadeIn();
  $("#info").fadeIn();
  // Make sure the map fits the DIV
  map.resize();
  }
  
},
// If there's an error, tell the user
  error: function(error){
  	console.log('DATA ERROR');
  	$('#msg').html('There\'s been an error.<br><a href="javascript:location.reload();">Refresh the page</a> or try again later.');
  	$("#map").fadeOut();
  }
});

}}