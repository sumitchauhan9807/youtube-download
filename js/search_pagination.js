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
     populateSearchHistory()
})


