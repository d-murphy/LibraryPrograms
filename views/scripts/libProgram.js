<script>
//  const divGuidelines = document.querySelectorAll("div.guidelines");
//  divGuidelines[0].style.display = 'none';
  
//  const toggleGuidelineDisplay = () => {
//    if(divGuidelines[0].style.display == 'none'){
//      divGuidelines[0].style.display = '';
//    } else {
//      divGuidelines[0].style.display = 'none';
//    }
//  }
  
  const overlay = document.querySelectorAll("div.overlay");
  
  const toggleOverlay = () => {
    if(overlay[0].style.display != "block") {
      overlay[0].style.display = "block";
    } else {
      overlay[0].style.display = "none";
    }
  }

document.querySelectorAll("div.showGuidelines")[0].
        addEventListener("click", toggleOverlay, false);
  
window.onclick = function(event) {
  if (event.target == overlay[0]) {
    toggleOverlay();
  }
}
    
    
  
</script>