$(document).ready(function() {
$("#txt_input").focus();
    $("#submit_btn").click(loadCountries);
});

function loadCountries(){
	var country = $("#txt_input").val();
	toastr.info('Loading bands');
	try {
		$.get("http://maps.googleapis.com/maps/api/geocode/json?address=%22"+country+"%22&sensor=false", function(geodata){
			try {
				var lat = geodata.results[0].geometry.location.lat;
				var lon = geodata.results[0].geometry.location.lng;
				$.get("http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=" + country + "&api_key=c6f5ad25b6120e5e42f312f4b6ebf4ad&format=json", function(data){
				try {
					var artistsArray = data.topartists.artist;
					var topten = artistsArray.slice(0,10);
					var htmlTopTen = getTableFromArtists(topten);
					L.marker([lat, lon]).addTo(map)
						.bindPopup(htmlTopTen).openPopup();
					toastr.success('Successfuly finished the search.');
				} catch (error) {
					toastr.error('There was an error performing the search');
				}
			}).fail(function() {
				throw 'ajax fail';
			});
			} catch(error) {
				toastr.error('There was an error performing the search');
			}
					
		});	
	} catch(error) {
		toastr.error('There was an error performing the search');
	}
	return false;
}

function getTableFromArtists(artists) {
    var rows = [];
    for (var i = 0 ; i < artists.length ; i++) {
        var artist = artists[i];
        var row = '<tr><td><a class="row_href" target="_blank" href="' + artist.url + '">' + artist.name + '</a></td><td>' + artist.listeners + '</td></tr>';
        rows.push(row);
    }
    var html = '<table border="0">';
    for (var i = 0 ; i < rows.length ; i++) {
        html += rows[i];
    }
    html += '</table>';
   
    return html;
}
