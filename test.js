const ytsr = require('ytsr');
let filter;


let searchString = 'iron maiden';
ytsr(searchString, {}, function(error,results){
    console.log(results)
});



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