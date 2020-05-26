var request = require("request")
request('http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=iron%20mai', function (error, response, body) {
  if(error){
      return null
  }
  var body = JSON.parse(body)
  console.log(body[1]); // Print the HTML for the Google homepage.
});





// const ytsr = require('ytsr');
// let filter;


// let searchString = 'iron maiden';
// ytsr(searchString, {}, function(error,results){
//     console.log(results)
// });

// for(var i=0;i<20;i++){
//     console.log(Math.round(Math.random() * 8))
// }

// ytsr.getFilters('iron maiden', function(err, filters) {
//   if(err) throw err;
//   filter = filters.get('Type').find(o => o.name === 'Video');
//   ytsr.getFilters(filter.ref, function(err, filters) {
//     if(err) throw err;
//     filter = filters.get('Duration').find(o => o.name.startsWith('Short'));
//     var options = {
//       limit: 30,
//       nextpageRef: filter.ref,
//     }
//     ytsr(null, options, function(err, searchResults) {
//       if(err) throw err;
//       console.log(searchResults);
//     });
//   });
// });