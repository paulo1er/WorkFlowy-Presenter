String.prototype.replaceAll = function(find, replace) {
    return this.split(find).join(replace);
};

(function($){
    var isPresenter = false;
    var isLatexRender = false;
    var isMarkdownRender = false;
    var isStyleRender = true;
    var lockContent = false;

    var prev_isPresenter = isPresenter;
    var timerUpdateNodes;
    var updateNodes = function() {
      $(".selected .content").each(function() {
        $(this).attr('contentEditable', !lockContent);
        var node = $(this);
        var styles = {};
        for (var p in properties) {
          if (properties.hasOwnProperty(p)){
            styles[properties[p].name]="";
          }
        }
        styles["line-height"] = "1.3em";

        if(!isStyleRender) node.removeAttr('style');
        else{
          node.children(".contentTag").children(".contentTagText").each(function() {
            var tagText = $(this).text();
            for (var p in properties) {
              if (properties.hasOwnProperty(p)){
                var value = properties[p].val(tagText);
                if(value!="") styles[properties[p].name] = value;
              }
            }
          });
          node.css(styles);
        }
      });
      clearInterval(timerUpdateNodes);
    };
    var startTimer = function() {
      if (timerUpdateNodes) {
        clearInterval(timerUpdateNodes);
      };
      timerUpdateNodes = setInterval(updateNodes, 300);
    };
    function goParent() {
      var parentPath = $(".selected").parent().parent().children(".name").children(".bullet").attr("href");
      if(parentPath)
        location.href = parentPath;
      else
        location.href = "/#/";
    }
    var addCSS = function() {
      console.log("Presenter mode");
      var path = chrome.extension.getURL('css/inject.css');
      $('head').append($('<link>')
          .attr("id","injectCSS")
          .attr("rel","stylesheet")
          .attr("type","text/css")
          .attr("href", path));

      $("#logo:not([class*='show'])").addClass("show");
      $("#searchForm:not([class*='show'])").addClass("show");
      $('#header').append($('<a>')
        .attr("id","goParent")
        .click(goParent)
        .text("<"));
      document.addEventListener('keyup', shortcut, false);
    };
    var deleteCSS = function() {
      console.log("Normal mode");
      $('#injectCSS').remove();
      $('#goParent').remove();
      document.removeEventListener('keyup', shortcut, false);
    };

    function addControllers(){
      var path = chrome.extension.getURL('css/modal.css');
      $('head').append($('<link>')
          .attr("id","modalCSS")
          .attr("rel","stylesheet")
          .attr("type","text/css")
          .attr("href", path));
      path = chrome.extension.getURL('modal.html');
      $.ajax({
        url: path,
        success: function (data) {
          $('#documentView').append(data);
          modal();
        },
        dataType: 'html'
      });


      window.onclick = function(event) {
        if (event.target == modal[0]) {
          modal.css("display", "none");
        }
      }
    }

    function shortcut(e) {
        e = e || window.event;
        if ((e.ctrlKey && e.keyCode == '38') || (e.keyCode == '33')) {
          var path = $('meta[name=urlPrevious]').attr("content");
          if(path && path!= "") location.href = path;
        }
        else if ((e.ctrlKey && e.keyCode == '40') || (e.keyCode == '34')) {
          var path = $('meta[name=urlNext]').attr("content");
          if(path && path!= "") location.href = path;
        }
    };

    var startWorking = function() {
      console.log(isStyleRender ? "START Rendering Style" : "STOP Rendering Style");
      document.addEventListener("DOMNodeInserted", startTimer);


      var path = chrome.extension.getURL('css/emoji.css');
      $('head').append($('<link>')
          .attr("id","emojiCSS")
          .attr("rel","stylesheet")
          .attr("type","text/css")
          .attr("href", path));

      var s = document.createElement('script');
      s.src = chrome.extension.getURL("js/markdown.js");
      (document.head||document.documentElement).appendChild(s);

      s = document.createElement('script');
      s.src = chrome.extension.getURL("js/latex.js");
      (document.head||document.documentElement).appendChild(s);

      s = document.createElement('script');
      s.src = chrome.extension.getURL("js/inject.js");
      (document.head||document.documentElement).appendChild(s);


      //addControllers();

      if(isPresenter) addCSS(); else deleteCSS();

      var metaRenderLaTeX = $("[name=\'renderingLaTeX\']");
      if(!metaRenderLaTeX.length){
        metaRenderLaTeX = $("<meta>").attr("name", "renderingLaTeX").attr("content", isLatexRender);
        $("head").append(metaRenderLaTeX);
      }
      metaRenderLaTeX.attr("content", isLatexRender);

      var metaRenderMarkdown = $("[name=\'renderingMarkdown\']");
      if(!metaRenderMarkdown.length){
        metaRenderMarkdown = $("<meta>").attr("name", "renderingMarkdown").attr("content", isMarkdownRender);
        $("head").append(metaRenderMarkdown);
      }
      metaRenderMarkdown.attr("content", isMarkdownRender);

      var metaLock = $("[name=\'lock\']");
      if(!metaLock.length){
        metaLock = $("<meta>").attr("name", "lock").attr("content", lockContent);
        $("head").append(metaLock);
      }
      metaLock.attr("content", lockContent);

      chrome.storage.onChanged.addListener(function(changes, namespace) {
        if ("presenter" in changes) {
          prev_isPresenter = isPresenter;
          isPresenter = changes.presenter.newValue;
          if (prev_isPresenter != isPresenter) {
            if(isPresenter) addCSS();
            else deleteCSS();
          }
          startTimer();
        };
        if ("isStyleRender" in changes) {
          isStyleRender = changes.isStyleRender.newValue;
          console.log(isStyleRender ? "START Rendering Style" : "STOP Rendering Style");
          startTimer();
        };
        if ("isLatexRender" in changes) {
          isLatexRender = changes.isLatexRender.newValue;
          metaRenderLaTeX.attr("content", isLatexRender);
        };
        if ("isMarkdownRender" in changes) {
          isMarkdownRender = changes.isMarkdownRender.newValue;
          metaRenderMarkdown.attr("content", isMarkdownRender);
        };
        if ("lockContent" in changes) {
          lockContent = changes.lockContent.newValue;
          metaLock.attr("content", lockContent);
        };
       });
    };
    var callbackGetValue = function(vals) {
      isPresenter = vals.presenter;
      isStyleRender = vals.isStyleRender;
      isLatexRender = vals.isLatexRender;
      isMarkdownRender = vals.isMarkdownRender;
      lockContent = vals.lockContent;
      startWorking();
    };
  chrome.storage.sync.get({"presenter":false, "isStyleRender":true, "isLatexRender":true, "isMarkdownRender":true, "lockContent":false}, callbackGetValue);

	chrome.runtime.sendMessage({
		type: 'showIcon'
	}, function() {});
}) (jQuery);

class Color{
	constructor(args){
		this.Red = args[0];
		this.Green = args[1];
		this.Blue = args[2];
	}
	toString(){return "rgb("+this.Red+", "+this.Green+", "+this.Blue+")"}
  toHexa(){
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(this.Red) + componentToHex(this.Green ) + componentToHex(this.Blue);
  }
};

function hexaToColor(hexa){
  var c = hexa.split('');
  if(c.length == 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  c= '0x'+c.join('');
  return (new Color([(c>>16)&255, (c>>8)&255, c&255]));
}

class Propertie{
  constructor(name, regex, exec){
    this.name = name;
    this.regex = regex;
    this.exec = exec;
  }
  val(tagText){
    var attr = this.regex.exec(tagText);
    return this.exec(attr);
  }
}
var properties = {
  background: new Propertie("background-color", /^wfe-background:(?:([a-z]*)|rgb:([0-9a-f]*))$/i, function(attr){
    if(attr != null && attr[1] != null && allColor.hasOwnProperty(attr[1].toUpperCase()))
      return (new Color(allColor[attr[1].toUpperCase()])).toString();
    else if(attr != null && attr[2] != null && (attr[2].length==3 ||attr[2].length==6))
      return hexaToColor(attr[2]).toString();
    return "";
  }),
  color: new Propertie("color", /^wfe-font-color:(?:([a-z]*)|rgb:([0-9a-f]*))$/i, function(attr){
    if(attr != null && attr[1] != null && allColor.hasOwnProperty(attr[1].toUpperCase()))
      return (new Color(allColor[attr[1].toUpperCase()])).toString();
    else if(attr != null && attr[2] != null && (attr[2].length==3 ||attr[2].length==6))
      return hexaToColor(attr[2]).toString();
    return "";
  }),
  font: new Propertie("font-family", /^wfe-font-face:([a-z_]*)$/i, function(attr){
    if(attr != null && attr[1] != null) {
  		var value = attr[1].toUpperCase().replaceAll("_", " ");
      if(allFont.hasOwnProperty(value))
        return allFont[value];
    }
    return "";
  }),
  bold: new Propertie("font-weight", /^wfe-font-weight:([a-z]*)$/i, function(attr){
    if(attr != null && attr[1] != null) {
      if(attr[1].toUpperCase() == "BOLD")
        return "bold";
      else if (attr[1].toUpperCase() == "NORMAL")
        return "normal";
    }
    return "";
  }),
  italic: new Propertie("font-style", /^wfe-font-style:([a-z]*)$/i, function(attr){
    if(attr != null && attr[1] != null) {
      if(attr[1].toUpperCase() == "ITALIC")
        return "italic";
      else if (attr[1].toUpperCase() == "NORMAL")
        return "normal";
    }
    return "";
  }),
  underline: new Propertie("text-decoration", /^wfe-text-decoration:([a-z]*)$/i, function(attr){
    if(attr != null && attr[1] != null) {
      if(attr[1].toUpperCase() == "UNDERLINE")
        return "underline";
    }
    return "";
  }),
  size: new Propertie("font-size", /^wfe-font-size:([0-9]*)$/i, function(attr){
    if(attr != null && attr[1] != null && attr[1]>0) {
      return attr[1]+"px";
    }
    return "";
  }),
  textAlign: new Propertie("text-align", /^wfe-text-align:([a-z]*)$/i, function(attr){
    if(attr != null && attr[1] != null) {
      if(attr[1].toUpperCase() == "CENTER")
        return "center";
      else if (attr[1].toUpperCase() == "LEFT")
        return "left";
      else if (attr[1].toUpperCase() == "RIGHT")
        return "right";
      else if (attr[1].toUpperCase() == "JUSTIFY")
        return "justify";
    }
    return "";
  })
}

var allColor={
	//Pink colors
		PINK : [255,192,203],
		LIGHTPINK : [255,182,193],
		HOTPINK : [255,105,180],
		DEEPPINK : [255,20,147],
		PALEVIOLETRED : [219,112,147],
		MEDIUMVIOLETRED : [199,21,133],
	//Red colors
		LIGHTSALMON : [255,160,122],
		SALMON : [250,128,114],
		DARKSALMON : [233,150,122],
		LIGHTCORAL : [240,128,128],
		INDIANRED : [205,92,92],
		CRIMSON : [220,20,60],
		FIREBRICK : [178,34,34],
		DARKRED : [139,0,0],
		RED : [255,0,0],
	//Orange colors
		ORANGERED : [255,69,0],
		TOMATO : [255,99,71],
		CORAL : [255,127,80],
		DARKORANGE : [255,140,0],
		ORANGE : [255,165,0],
	//Yellow colors
		YELLOW : [255,255,0],
		LIGHTYELLOW : [255,255,224],
		LEMONCHIFFON : [255,250,205],
		LIGHTGOLDENRODYELLOW : [250,250,210],
		PAPAYAWHIP : [255,239,213],
		MOCCASIN : [255,228,181],
		PEACHPUFF : [255,218,185],
		PALEGOLDENROD : [238,232,170],
		KHAKI : [240,230,140],
		DARKKHAKI : [189,183,107],
		GOLD : [255,215,0],
	//Brown colors
		CORNSILK : [255,248,220],
		BLANCHEDALMOND : [255,235,205],
		BISQUE : [255,228,196],
		NAVAJOWHITE : [255,222,173],
		WHEAT : [245,222,179],
		BURLYWOOD : [222,184,135],
		TAN : [210,180,140],
		ROSYBROWN : [188,143,143],
		SANDYBROWN : [244,164,96],
		GOLDENROD : [218,165,32],
		DARKGOLDENROD : [184,134,11],
		PERU : [205,133,63],
		CHOCOLATE : [210,105,30],
		SADDLEBROWN : [139,69,19],
		SIENNA : [160,82,45],
		BROWN : [165,42,42],
		MAROON : [128,0,0],
	//Green colors
		DARKOLIVEGREEN : [85,107,47],
		OLIVE : [128,128,0],
		OLIVEDRAB : [107,142,35],
		YELLOWGREEN : [154,205,50],
		LIMEGREEN : [50,205,50],
		LIME : [0,255,0],
		LAWNGREEN : [124,252,0],
		CHARTREUSE : [127,255,0],
		GREENYELLOW : [173,255,47],
		SPRINGGREEN : [0,255,127],
		MEDIUMSPRINGGREEN : [0,250,154],
		LIGHTGREEN : [144,238,144],
		PALEGREEN : [152,251,152],
		DARKSEAGREEN : [143,188,143],
		MEDIUMAQUAMARINE : [102,205,170],
		MEDIUMSEAGREEN : [60,179,113],
		SEAGREEN : [46,139,87],
		FORESTGREEN : [34,139,34],
		GREEN : [0,128,0],
		DARKGREEN : [0,100,0],
	//Cyan colors
		AQUA : [0,255,255],
		CYAN : [0,255,255],
		LIGHTCYAN : [224,255,255],
		PALETURQUOISE : [175,238,238],
		AQUAMARINE : [127,255,212],
		TURQUOISE : [64,224,208],
		MEDIUMTURQUOISE : [72,209,204],
		DARKTURQUOISE : [0,206,209],
		LIGHTSEAGREEN : [32,178,170],
		CADETBLUE : [95,158,160],
		DARKCYAN : [0,139,139],
		TEAL : [0,128,128],
	//Blue colors
		LIGHTSTEELBLUE : [176,196,222],
		POWDERBLUE : [176,224,230],
		LIGHTBLUE : [173,216,230],
		SKYBLUE : [135,206,235],
		LIGHTSKYBLUE : [135,206,250],
		DEEPSKYBLUE : [0,191,255],
		DODGERBLUE : [30,144,255],
		CORNFLOWERBLUE : [100,149,237],
		STEELBLUE : [70,130,180],
		ROYALBLUE : [65,105,225],
		BLUE : [0,0,255],
		MEDIUMBLUE : [0,0,205],
		DARKBLUE : [0,0,139],
		NAVY : [0,0,128],
		MIDNIGHTBLUE : [25,25,112],
	//Purple, violet, and magenta colors
		LAVENDER : [230,230,250],
		THISTLE : [216,191,216],
		PLUM : [221,160,221],
		VIOLET : [238,130,238],
		ORCHID : [218,112,214],
		FUCHSIA : [255,0,255],
		MAGENTA : [255,0,255],
		MEDIUMORCHID : [186,85,211],
		MEDIUMPURPLE : [147,112,219],
		BLUEVIOLET : [138,43,226],
		DARKVIOLET : [148,0,211],
		DARKORCHID : [153,50,204],
		DARKMAGENTA : [139,0,139],
		PURPLE : [128,0,128],
		INDIGO : [75,0,130],
		DARKSLATEBLUE : [72,61,139],
		SLATEBLUE : [106,90,205],
		MEDIUMSLATEBLUE : [123,104,238],
	//White colors
		WHITE : [255,255,255],
		SNOW : [255,250,250],
		HONEYDEW : [240,255,240],
		MINTCREAM : [245,255,250],
		AZURE : [240,255,255],
		ALICEBLUE : [240,248,255],
		GHOSTWHITE : [248,248,255],
		WHITESMOKE : [245,245,245],
		SEASHELL : [255,245,238],
		BEIGE : [245,245,220],
		OLDLACE : [253,245,230],
		FLORALWHITE : [255,250,240],
		IVORY : [255,255,240],
		ANTIQUEWHITE : [250,235,215],
		LINEN : [250,240,230],
		LAVENDERBLUSH : [255,240,245],
		MISTYROSE : [255,228,225],
	//Gray and black colors
		GAINSBORO : [220,220,220],
		LIGHTGRAY : [211,211,211],
		SILVER : [192,192,192],
		DARKGRAY : [169,169,169],
		GRAY : [128,128,128],
		DIMGRAY : [105,105,105],
		LIGHTSLATEGRAY : [119,136,153],
		SLATEGRAY : [112,128,144],
		DARKSLATEGRAY : [47,79,79],
		BLACK : [0,0,0]
};

var allFont ={
	"ARIAL" : "Arial",
	"TIMES NEW ROMAN" :  "Times New Roman",
	"COURIER" : "Courier New",
	"SYMBOL" : "Symbol",
	"GEORGIA" : "Georgia",
	"PALATINO LINOTYPE" : "Palatino Linotype",
	"ARIAL BLACK" : "Arial Black",
	"COMIC SANS MS" : "Comic Sans MS",
	"IMPACT" : "Impact",
	"LUCIDA SANS UNICODE" : "Lucida Sans Unicode",
	"TAHOMA" : "Tahoma",
	"TREBUCHET MS" : "Trebuchet MS",
	"VERDANA" : "Verdana",
	"LUCIDA CONSOLE" : "Lucida Console"
}
