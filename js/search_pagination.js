function saveSearch(searchText){
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    var time = new Date()
    searchHistory.push({
        date:time,
        search:searchText
    })
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
 }

 function populateSearchHistory(){
     const classArray = ['badge-primary','badge-secondary','badge-success','badge-danger','badge-warning','badge-info','badge-light','badge-dark']
     
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    var searchHistoryHTML='';
    searchHistory.forEach((thisSearch)=>{
        let Badgeclass = classArray[Math.round(Math.random() * 8)]
        searchHistoryHTML += '<span class="badge badge-pill '+Badgeclass+'">'+thisSearch.search+'</span>';
    })
    $('.searchHistory').html(searchHistoryHTML)
 }

 function getSuggestions(currentText){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:'http://52.66.243.150:5000/user/suggestions/'+currentText+'',
            type:'GET',
            success:function(response){
                resolve(response)
            }
        })
    })
 }

 function showSuggestions(results){
     //currentSearchSuggestions
     var html=''
     results.forEach((suggestion)=>{
        html += `<li>${suggestion}</li>`
     })
     $('#currentSearchSuggestions').css('display','block').html(html)
 }
$(document).ready(function(){
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height()  == $(document).height()) {
            //alert("bottom!");
            if(window.nextPage){
                $(".loading").css("display","block")
                $.ajax({
                    url:'/user/searchpagination',
                    type:'POST',
                    contentType: "application/json",
                    data:JSON.stringify({
                        next:window.nextPage
                    }),
                    success:function(results){
                      console.log(results)
                      window.nextPage = results.next
                      $(".loading").css("display","none")
                      populateSearchData(results,false)
                    }
                  })
            }else{
                alert('no next results')
            }
        }
     });
     $(document).on("click",".badge",function(){
         var thisSearchText = $(this).text();
         $(".searchSongInputText").val(thisSearchText)
     })
     $(document).on("click",".suggestionsDrop li",function(){
         var suggestionText = $(this).text();
        $('.searchSongInputText').val(suggestionText);
        $('#currentSearchSuggestions').css('display','none').html('')
        $(".searchSong").trigger("click");

     })
     $(document).on("click",".videoThumb",function(){
         var videoId = $(this).attr("videoId")
         var frame = `<iframe class="videoThumb"
            src="https://www.youtube.com/embed/${videoId}">
         </iframe>  `
         $(this).parents(".videoArea").html(frame)
            //alert(videoId)
     })
     var getSuggestionsTimeout
     $(".searchSongInputText").on("keyup",function(){
         var currentText  = $(this).val();
         if(currentText.length > 4){
            clearTimeout(getSuggestionsTimeout);
            getSuggestionsTimeout = setTimeout(()=>{
                console.log(currentText)
                getSuggestions(currentText).then((results)=>{
                    console.log(results)
                    showSuggestions(results)
                })
             },500)
         }else{
            $('#currentSearchSuggestions').css('display','none').html('')
         }
     })
     populateSearchHistory()
})


