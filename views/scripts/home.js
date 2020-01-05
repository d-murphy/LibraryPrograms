<script>
var filtersOn = false;
var curSubjFilters = [];
var curLibFilters = [];
  
   var subjFilters = [{name: "Arts and Crafts"},
                      {name: "Computers and Tech"},
                      {name: "Cooking"},
                      {name: "General"},
                      {name: "Health and Wellness"},
                      {name: "Literary"}, 
                      {name: "Music"}]

const libraries = [...new Set(results.map(results => results.library))].sort()
var libFilters = [];
for(i=0; i<libraries.length; i++){
  libFilters.push({name: libraries[i]})
}


var filterHtml = "";
const createPills = (filterArray, divType, filterType) => {
  for(i=0; i<filterArray.length; i++){
    filterHtml += "<div class='" + divType + "' id='" + filterType + "'>" +
                  filterArray[i].name +  "</div>";
  }
}

  var s = ""
  
const filterLibPrograms = () => {
    s = document.querySelectorAll("div.event")
    if(curSubjFilters.length>0 & curLibFilters.length>0){
      for(i=0;i<s.length;i++){
        if(curLibFilters.includes(s[i].childNodes[2].innerText) & 
           curSubjFilters.includes(s[i].childNodes[4].innerText)){
          s[i].style.display = '';
        } else {
          s[i].style.display = 'none';
        }
      }
    } else if(curSubjFilters.length>0 & curLibFilters.length==0){
      for(i=0;i<s.length;i++){
        if(curSubjFilters.includes(s[i].childNodes[4].innerText)){
          s[i].style.display = '';
        } else {
          s[i].style.display = 'none';
        }
      }
    } else if(curSubjFilters.length==0 & curLibFilters.length>0){
      for(i=0;i<s.length;i++){
        if(curLibFilters.includes(s[i].childNodes[2].innerText)){
          s[i].style.display = '';
        } else {
          s[i].style.display = 'none';
        }
      }
    } else {
      for(i=0;i<s.length;i++){
        s[i].style.display = '';
      }       
    }  
  }
  
  
const changeFilterClass = (e) => {
    if(e.target.className == "filter"){
    e.target.className = "filterClicked";
    if(e.target.id == "subjFilter"){
      curSubjFilters.push(e.target.innerHTML);
    } else {
      curLibFilters.push(e.target.innerHTML);
    }
  } else {
    e.target.className = "filter"
    if(e.target.id == "subjFilter"){
      for(i=0; i<curSubjFilters.length; i++){
        if(curSubjFilters[i]==e.target.innerHTML){curSubjFilters.splice(i,1);}
      }
    } else {
      for(i=0; i<curLibFilters.length; i++){
        if(curLibFilters[i]==e.target.innerHTML){curLibFilters.splice(i,1);}        
      }
    }
  }
  filterLibPrograms();
}
      


const showFilter = () => {
  if(!filtersOn){
    filterHtml = "<div class='subjFilters'>";
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
    filterLibPrograms();
  }
}

document.querySelectorAll("div.showFilter")[0].
        addEventListener("click", showFilter, false);
  

</script>
