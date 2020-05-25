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

     
})


