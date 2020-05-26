var request = require("request")
function getSearchSuggestions(text){
    return new Promise((resolve,reject)=>{
        request('http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q='+text+'', function (error, response, body) {
            if(error){
                return null
                reject()
            }
            var body = JSON.parse(body)
            resolve(body[1])
            console.log(body[1]); 
        });
    })
}

module.exports = { getSearchSuggestions }
