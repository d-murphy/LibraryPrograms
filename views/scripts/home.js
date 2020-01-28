<script>
var filtersOn = false;
var curAudFilters = [];
var curSubjFilters = [];
var curLibFilters = [];
   
// find all possible filter values
  
   var audFilters = [{name: "Adults"}, 
                     {name: "Children"},
                     {name: "New Adults (20-30)"},
                     {name: "Seniors"}, 
                     {name: "Teens"}];

  
   var subjFilters = [{name: "Arts and Crafts"},
                      {name: "Community Service"},
                      {name: "Computers and Tech"},
                      {name: "Cooking"},
                      {name: "Finance"},
                      {name: "Fun and Games"},
                      {name: "General"},
                      {name: "Health and Wellness"},
                      {name: "Literary"}, 
                      {name: "Music"}];

const libraries = [...new Set(results.map(results => results.library))].sort()
var libFilters = [];
for(i=0; i<libraries.length; i++){
  libFilters.push({name: libraries[i]})
}

// create HTML for filters when called

var filterHtml = "";
const createPills = (filterArray, divType, filterType) => {
  for(i=0; i<filterArray.length; i++){
    filterHtml += "<div class='" + divType + "' id='" + filterType + "'>" +
                  filterArray[i].name +  "</div>";
  }
}

// select all events

var events = document.querySelectorAll("div.event") 

//
  
const filterLibraryPrograms = function() { 
      if(curSubjFilters.length>0){           //If there are Subject filters applied
        for(i=0;i<events.length;i++){
          if(curSubjFilters.includes(events[i].childNodes[4].innerText)){
            events[i].subDisplay=1;
          } else {
            events[i].subDisplay=0;
          }
        }
      } else {                            //If there are no Subject filters, all 1s
        for(i=0;i<events.length;i++){
          events[i].subDisplay=1
        }
      };
      if(curLibFilters.length>0){           //If there are Library filters applied
        for(i=0;i<events.length;i++){
          if(curLibFilters.includes(events[i].childNodes[2].childNodes[2].innerText)){
            events[i].libDisplay=1;
          } else {
            events[i].libDisplay=0;
          }
        }
      } else {
        for(i=0;i<events.length;i++){
          events[i].libDisplay=1
        }
      };
      if(curAudFilters.length>0){
        for(i=0;i<events.length;i++){
          if(curAudFilters.includes(events[i].childNodes[2].childNodes[0].innerText)){
            events[i].audDisplay=1;
          } else {
            events[i].audDisplay=0;
          }
        }
      } else {
        for(i=0;i<events.length;i++){
          events[i].audDisplay=1
        }
      };
     for(i=0;i<events.length;i++){
       if(events[i].subDisplay + events[i].libDisplay + events[i].audDisplay == 3){
         events[i].style.display = '';
       } else {
         events[i].style.display = 'none';
       }
     }    
}      
      
// if filter bubble clicked, change to filterClicked class
// push the html text into the curLibFilters, etc.  
  
const changeFilterClass = (e) => {
    console.log(e.target.id);
    if(e.target.className == "filter"){
    e.target.className = "filterClicked";
    if(e.target.id == "subjFilter"){
      curSubjFilters.push(e.target.innerHTML);
    } else if (e.target.id == "libFilter") {
      curLibFilters.push(e.target.innerHTML);
    } else {
      curAudFilters.push(e.target.innerHTML);
    }
  } else {
    e.target.className = "filter"
    if(e.target.id == "subjFilter"){
      for(i=0; i<curSubjFilters.length; i++){
        if(curSubjFilters[i]==e.target.innerHTML){curSubjFilters.splice(i,1);}
      }
    } else if(e.target.id == "libFilter"){
      for(i=0; i<curLibFilters.length; i++){
        if(curLibFilters[i]==e.target.innerHTML){curLibFilters.splice(i,1);}
      }
    } else if (e.target.id == "audFilter"){
      for(i=0; i<curAudFilters.length; i++){
        if(curAudFilters[i]==e.target.innerHTML){curAudFilters.splice(i,1);}        
      }
    }
  }
  filterLibraryPrograms();
}
      
// create filter bubbles and add event listeners

const showFilter = () => {
  if(!filtersOn){
    filterHtml = "<div class='audFilters'>";
    createPills(audFilters, "filter", "audFilter");
    filterHtml += "</div><div class='subjFilters'>";
    createPills(subjFilters, "filter", "subjFilter");
    filterHtml += "</div><div class='libFilters'>";
    createPills(libFilters, "filter", "libFilter");
    filterHtml += "</div>";
    document.getElementById('filtersContainer').innerHTML = filterHtml;
    filtersOn = true;
    for(let i=0;i<document.querySelectorAll("div.filter").length;i++){
      document.querySelectorAll("div.filter")[i].
        addEventListener("click", changeFilterClass, false);
    }
    document.querySelectorAll("div.showFilter")[0].innerHTML = "Remove Filters";
  } else {
    document.getElementById('filtersContainer').innerHTML = ""
    filtersOn = false;
    document.querySelectorAll("div.showFilter")[0].innerHTML = "Show Filters";
    curSubjFilters = [];
    curLibFilters = [];
    curAudFilters = [];
    filterLibraryPrograms();
  }
}

document.querySelectorAll("div.showFilter")[0].
        addEventListener("click", showFilter, false);
  

</script>
