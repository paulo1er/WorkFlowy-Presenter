function modal(){
  var modal = $("#myModal");
  var aModal =  $("<a>").text("Style");
  var content = $(".selected > .name > .content");
  aModal.click(function(){
    modal.css("display", "block");
    content = $(this).parent().parent().parent().children(".content");
    var style={
      "background" : '#ffffff',
      "color" : '#000000',
      "font" : 'Arial',
      "bold" : "normal",
      "italic" : "normal",
      "underline" : "normal",
      "size" : 14,
      "textAlign" : 'left'
    }

    var match;
    content.children(".contentTag").children(".contentTagText").each(function() {

      if((match = /^wfe-background:rgb:([0-9a-f]*)$/i.exec($(this).text())) != null ) {
      	style["background"] = '#' + match[1];
      }
      else if((match = /^wfe-font-color:rgb:([0-9a-f]*)$/i.exec($(this).text())) != null ) {
      	style["color"] = '#' + match[1];
      }

      else if((match = /^wfe-background:([a-z]*)$/i.exec($(this).text())) != null  && allColor.hasOwnProperty(match[1].toUpperCase()) ) {
      	style["background"] = (new Color(allColor[match[1].toUpperCase()])).toHexa();
      }
      else if((match = /^wfe-font-color:([a-z]*)$/i.exec($(this).text())) != null  && allColor.hasOwnProperty(match[1].toUpperCase()) ) {
      	style["color"] = (new Color(allColor[match[1].toUpperCase()])).toHexa();
      }
      else if((match = /^wfe-font-face:([a-z_]*)$/i.exec($(this).text())) != null ) {
      	style["font"] = match[1];
      }
      else if((match = /^wfe-font-weight:([a-z]*)$/i.exec($(this).text())) != null ) {
      	style["bold"] = match[1];
      }
      else if((match = /^wfe-font-style:([a-z]*)$/i.exec($(this).text())) != null ) {
      	style["italic"] = match[1];
      }
      else if((match = /^wfe-text-decoration:([a-z]*)$/i.exec($(this).text())) != null ) {
      	style["underline"] = match[1];
      }
      else if((match = /^wfe-font-size:([0-9]*)$/i.exec($(this).text())) != null ) {
      	style["size"] = match[1];
      }
      else if((match = /^wfe-text-align:([a-z]*)$/i.exec($(this).text())) != null ) {
      	style["textAlign"] = match[1];
      }
    });

    $('#background').val(style["background"]);
    $('#color').val(style["color"]);
    $('#font').val(style["font"]);
    $('#bold').prop('checked', style["bold"]=="bold");
    $('#italic').prop('checked', style["italic"]=="italic");
    $('#underline').prop('checked', style["underline"]=="underline");
    $('#size').val(style["size"]);
    $('#textAlign').val(style["textAlign"]);

    $("#test").css({
      "background" : $('#background').val(),
      "color" : $('#color').val(),
      "font-family" : $('#font').val().replaceAll('_', ' '),
      "font-weight" : $('#bold').prop('checked') ? "bold" : "normal" ,
      "font-style" : $('#italic').prop('checked') ? "italic" : "normal" ,
      "text-decoration" : $('#underline').prop('checked') ? "underline" : "" ,
      "font-size" : $('#size').val() + "px",
      "text-align" : $('#textAlign').val()
    })
  });
  $('#controlsLeft').append("<hr>");
  $('#controlsLeft').append(aModal);

  $('#background').change(function(){
    $("#test").css("background", $('#background').val());
  });
  $('#color').change(function(){
    $("#test").css("color", $('#color').val())
  });
  $('#font').change(function(){
    $("#test").css("font-family", $('#font').val().replaceAll('_', ' '))
  });
  $('#bold').change(function(){
    $("#test").css("font-weight", $('#bold').prop('checked') ? "bold" : "normal" )
  });
  $('#italic').change(function(){
    $("#test").css("font-style", $('#italic').prop('checked') ? "italic" : "normal" )
  });
  $('#underline').change(function(){
    $("#test").css("text-decoration", $('#underline').prop('checked') ? "underline" : "" )
  });
  $('#size').change(function(){
    $("#test").css("font-size", $('#size').val() + "px")
  });
  $('#textAlign').change(function(){
    $("#test").css("text-align", $('#textAlign').val())
  });

  $("#myModal .close").click(function() {
    modal.css("display", "none");
  });
  function removeTag(e){
    var i = content.contents().index(e.parent());
    if(i>0){
      var text = content.contents().get(i-1);
      var str = $(text).text();
      if(str.charAt(str.length - 1) == " "){
        if(text.nodeType!=3) $(text).text(str.substring(0, str.length - 1))
        else $(text).replaceWith(str.substring(0, str.length - 1));
      }
    }
    e.parent().remove();
  }
  $("#Validate").click(function() {
    modal.css("display", "none");
    content.children(".contentTag").children(".contentTagText").each(function() {
      if(/^wfe-background:(?:([a-z]*)|rgb:([0-9a-f]*))$/i.test($(this).text()) ) {
      	removeTag($(this));
      }
      else if(/^wfe-font-color:(?:([a-z]*)|rgb:([0-9a-f]*))$/i.test($(this).text()) ) {
      	removeTag($(this));
      }
      else if(/^wfe-font-face:([a-z_]*)$/i.test($(this).text()) ) {
      	removeTag($(this));
      }
      else if(/^wfe-font-weight:([a-z]*)$/i.test($(this).text()) ) {
      	removeTag($(this));
      }
      else if(/^wfe-font-style:([a-z]*)$/i.test($(this).text()) ) {
      	removeTag($(this));
      }
      else if(/^wfe-text-decoration:([a-z]*)$/i.test($(this).text()) ) {
      	removeTag($(this));
      }
      else if(/^wfe-font-size:([0-9]*)$/i.test($(this).text()) ) {
      	removeTag($(this));
      }
      else if(/^wfe-text-align:([a-z]*)$/i.test($(this).text()) ) {
      	removeTag($(this));
      }
    });
    content.focus();
    var tagsToAdd = [];
    if($('#background').val() !='#ffffff') tagsToAdd.push("#wfe-background:rgb:" + $('#background').val().slice(1));
    if($('#color').val() !='#000000') tagsToAdd.push("#wfe-font-color:rgb:" + $('#color').val().slice(1));
    if($('#font').val() != 'Arial') tagsToAdd.push("#wfe-font-face:" + $('#font').val());
    if($('#bold').prop('checked') != false) tagsToAdd.push("#wfe-font-weight:" + "bold");
    if($('#italic').prop('checked') != false) tagsToAdd.push("#wfe-font-style:" + "italic");
    if($('#underline').prop('checked') != false) tagsToAdd.push("#wfe-text-decoration:" + 'underline');
    if($('#size').val() != 14) tagsToAdd.push("#wfe-font-size:" + $('#size').val());
    if($('#textAlign').val() != 'left') tagsToAdd.push("#wfe-text-align:" + $('#textAlign').val());

    tagsToAdd.forEach(function(tag, i){
      if(i==0 && content.text()[content.text().length - 1] != " ")
        content.html(content.html() + " ");
      content.html(content.html() + tag + " ");
    });

    content.blur();
  });
};
