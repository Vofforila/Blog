function findPos(obj) {
   var curleft = (curtop = 0);
   if (obj.offsetParent) {
      curleft = obj.offsetLeft;
      curtop = obj.offsetTop;
      while ((obj = obj.offsetParent)) {
         curleft += obj.offsetLeft;
         curtop += obj.offsetTop;
      }
   }
   return [curleft, curtop];
}

console.log(findPos(document.getElementsByClassName("navbar-top-left")));
