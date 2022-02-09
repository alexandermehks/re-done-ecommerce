$(document).ready(function() {


  $("#reviewbutton").click(
    function() {
        $(".reviewform").slideToggle();

    });
 



});

function emptysizes()
{
    document.getElementById('S').setAttribute("class", "style1");
}
function changeStarColor(id)
{
  
  
  
  document.getElementById(id).style.color = "orange";
  
 


  
 
  }


  function changeColor(id)
{
  
  console.log(id)
  
  document.getElementById("S").style.backgroundColor = "white";
  document.getElementById("M").style.backgroundColor = "white";
  document.getElementById("L").style.backgroundColor = "white";
  document.getElementById("XL").style.backgroundColor = "white";
  document.getElementById("2XL").style.backgroundColor = "white"; // backcolor
  document.getElementById(id).style.backgroundColor = "lightgray"; // backcolor
  var x = document.getElementById("sizehelpS");
  x.style.display === "none"
  if (id === "S"){
    document.getElementById("length").innerHTML = "172-184 cm";
    document.getElementById("weight").innerHTML = "70-74 kg";
    document.getElementById("chest").innerHTML = "95-99 cm";

  }else if(id === "M"){
    document.getElementById("length").innerHTML = "174-188 cm";
    document.getElementById("weight").innerHTML = "75-84 kg";
    document.getElementById("chest").innerHTML = "100-104 cm";
  }else if(id === "L"){
    document.getElementById("length").innerHTML = "176-192 cm";
    document.getElementById("weight").innerHTML = "85-94 kg";
    document.getElementById("chest").innerHTML = "105-109 cm";
  }else if(id === "XL"){
    document.getElementById("length").innerHTML = "178-196 cm";
    document.getElementById("weight").innerHTML = "95-104 kg";
    document.getElementById("chest").innerHTML = "110-114 cm";
  }else if(id === "2XL"){
    document.getElementById("length").innerHTML = "180-196 cm";
    document.getElementById("weight").innerHTML = "105-109 kg";
    document.getElementById("chest").innerHTML = "115-119 cm";
  }
  x.style.display = "block"
  let text = "Size "+id+" fits:";
  document.getElementById("sizefit").innerHTML = text.bold();
  
 
  }