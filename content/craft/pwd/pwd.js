function enterdecode(e){
  if (e.keyCode == 13){
    pwd = get_pwd()
    var hiddenElement = document.createElement('button');
    new ClipboardJS(hiddenElement);
    hiddenElement.setAttribute("data-clipboard-text", pwd);
    hiddenElement.click();
  }
}
function show_pwd(){
  pwd = get_pwd();
  $("#key").val(pwd)
}
function get_pwd(){
  key = $("#key").val();
  var shaObj = new jsSHA("SHA-1", "TEXT");
  shaObj.update(key);
  var hash = shaObj.getHash("B64");
  return ensure_pwd(hash.substring(0, $("#num").val()))
}
function ensure_pwd(hash){
  var iupper = -1;
  var ilower = -1;
  var inum = -1;
  var pwd = ''
  for (var i=0; i < hash.length; i++){
    ch = hash.charAt(i);
    console.log(ch);
    if (!isNaN(ch * 1)){
      inum = i;
      pwd += ch;
    }else{
      if (ch== ch.toUpperCase()) {
        if (iupper == -1){ pwd += ch.toLowerCase(); }else{ pwd += ch; }
        iupper = i;
      }
      if (ch== ch.toLowerCase()){
        if (ilower == -1){ pwd += ch.toUpperCase(); }else{ pwd += ch; }
        ilower = i;
      }
    }
  }
  if (inum == -1){
    ch = Math.abs(ilower) % 10;
    pwd = pwd.substring(0, pwd.length-1) + ch
  }
  return pwd;
}
