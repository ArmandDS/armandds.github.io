jQuery.githubUser = function(username, callback) {
   jQuery.getJSON('https://api.github.com/users/'+username+'/repos?per_page=100&callback=?',callback)
}
 
jQuery.fn.loadRepositories = function(username) {
    this.html("<span>Querying GitHub for " + username +"'s repositories...</span>");
     
    var target = this;
    $.githubUser(username, function(data) {
        var repos = data.data; // JSON Parsing
        sortByName(repos);
        console.log(repos);    
        var list = $('<div/>');
        target.empty().append(list);
        $(repos.slice(0,9)).each(function() {
            if (this.name != (username.toLowerCase()+'.github.com')) {
                var num =22;
                if (this.description == null){
                    var des = "ML Repo";
                }
                else if ( this.description.length <= num) {
                   var  des =  this.description;
                }else{
                    var  des =  this.description.slice(0, num) + '...';
                }

                list.append('<div class= "col-md-4 col-sm-12 repo-div"> <div class="repo-card-div"> '+
                            '<a href="'+this.svn_url+'"> <div class="repo-name-div ">'+
                            '<p class="repo-name">'+ this.name + '</p></div>'+
                            '<div class="repo-name-div "><p class="repo-description">' + des +'⚡️</p></div>'+
                            '<div class="repo-stats"><div class="repo-left-stat">'+
                            '<span><div class="language-color" style="background-color: rgb(100, 255, 218);"></div>'+
                            '<p>'+this.language+'</p></span>'+
                            '<span>'+
                            '<p><i class="fas fa-star"></i>'+this.stargazers_count+'</p></span>'+
                            '</div>'+
                            '</div>'+
                            '</div></a></div></div>'
                            );
            }
        });      
      });
      
    function sortByName(repos) {
        repos.sort(function(a, b){
        var keyA = new Date(b.updated_at),
            keyB = new Date(a.updated_at);
        // Compare the 2 dates
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
        });
    }
};




// https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/studytact


jQuery.MediumUser = function( callback) {
   jQuery.getJSON('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@KonradDaWo?callback=?',callback);
}
 
jQuery.fn.loadMedium = function() {
    this.html("<span>Querying Medium Post...</span>");
    var target = this;
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@armandj.olivares')
       .then((res) => res.json())
       .then((data) => {
           // Fillter the array
           const res = data.items //This is an array with the content. No feed, no info about author etc..
           const posts = res.filter(item => item.categories.length > 0) // That's the main trick* !
           
           function toText(node) {
             let tag = document.createElement('div')
             tag.innerHTML = node
             node = tag.innerText
             return node
          }
           function shortenText(text,startingPoint ,maxLength) {
           return text.length > maxLength?
              text.slice(startingPoint, maxLength):
              text
          }
          
          let output = '';
          posts.slice(0, 4).forEach((item) => {
             output += `
             <li class="blog__post">
                <a href="${item.link}">
                   <img src="${item.thumbnail}" class="blog__topImg"></img>
                   <div class="blog__content">
                      <div class="blog_preview">
                         <h2 class="blog__title">${shortenText(item.title, 0, 30)+ '...'}</h2>
                         <p class="blog__intro">${'...' + shortenText(toText(item.content),60, 300)+ '...'}</p>
                      </div>
                      <hr>
                      <div class="blog__info">
                         <span class="blog__author">${item.author}</span>
                         <span class="blog__date">${shortenText(item.pubDate,0 ,10)}</span>
                      </div>
                   </div>
                <a/>
             </li>`
          })
          document.querySelector('.blog__slider').innerHTML = output
          this.html("<span></span>");
        })
};