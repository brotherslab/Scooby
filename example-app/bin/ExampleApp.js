(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,__class__: List
};
var scooby = {};
scooby.events = {};
scooby.events.EventDispatcher = function() {
	this.listeners = new haxe.ds.StringMap();
};
scooby.events.EventDispatcher.__name__ = true;
scooby.events.EventDispatcher.prototype = {
	addEventListener: function(type,listener) {
		if(this.listeners.get(type) == null) {
			var v = new Array();
			this.listeners.set(type,v);
			v;
		}
		var list = this.listeners.get(type);
		if(HxOverrides.indexOf(list,listener,0) != -1) return;
		list.push(listener);
	}
	,hasEventListener: function(type,listener) {
		return this.listeners.get(type) != null && (function($this) {
			var $r;
			var _this = $this.listeners.get(type);
			$r = HxOverrides.indexOf(_this,listener,0);
			return $r;
		}(this)) != -1;
	}
	,removeEventListener: function(type,listener) {
		var list = this.listeners.get(type);
		if(list == null) return;
		var anIndex = HxOverrides.indexOf(list,listener,0);
		if(anIndex == -1) return;
		list.splice(anIndex,1);
	}
	,dispatchEvent: function(event) {
		var list = this.listeners.get(event.type);
		if(list == null) return;
		event.target = this;
		list = list.slice();
		var listener;
		var _g = 0;
		while(_g < list.length) {
			var listener1 = list[_g];
			++_g;
			listener1(event);
		}
	}
	,dispatch: function(type,data,bubbles) {
		if(bubbles == null) bubbles = false;
		var event = new scooby.events.Event(type,data,bubbles);
		this.dispatchEvent(event);
	}
	,removeAllListeners: function() {
		this.listeners = new haxe.ds.StringMap();
	}
	,destroy: function() {
		this.removeAllListeners();
	}
	,__class__: scooby.events.EventDispatcher
};
scooby.display = {};
scooby.display.DOMObject = function(className,elementType) {
	if(elementType == null) elementType = "div";
	if(className == null) className = "";
	this.visible = true;
	this.nativeEvents = [];
	scooby.events.EventDispatcher.call(this);
	this.className = className;
	this.el = window.document.createElement(elementType);
	if(className != "") this.el.className = className;
};
scooby.display.DOMObject.__name__ = true;
scooby.display.DOMObject.__super__ = scooby.events.EventDispatcher;
scooby.display.DOMObject.prototype = $extend(scooby.events.EventDispatcher.prototype,{
	set_visible: function(value) {
		if(value) this.removeClass("hidden"); else this.addClass("hidden");
		return this.visible = value;
	}
	,get_visible: function() {
		return this.visible;
	}
	,addClass: function(className) {
		this.el.classList.add(className);
	}
	,removeClass: function(className) {
		this.el.classList.remove(className);
	}
	,toggleClass: function(className) {
		this.el.classList.toggle(className);
	}
	,setHTML: function(html) {
		this.el.innerHTML = html;
	}
	,setAttribute: function(type,value) {
		this.el.setAttribute(type,value);
	}
	,setAttributes: function(data) {
		var type;
		var $it0 = data.iterator();
		while( $it0.hasNext() ) {
			var type1 = $it0.next();
			this.setAttribute(type1,data.get(type1));
		}
	}
	,focus: function() {
		this.el.focus();
	}
	,nativeEvent: function(type) {
		if(HxOverrides.indexOf(this.nativeEvents,type,0) != -1) return;
		this.nativeEvents.push(type);
		if(($_=this.el,$bind($_,$_.addEventListener))) this.el.addEventListener(type,$bind(this,this.onNativeEvent),false); else this.el.attachEvent("on" + type,clickHandlerFunction,false);
	}
	,onNativeEvent: function(e) {
		this.dispatch(e.type,e);
	}
	,destroy: function() {
		scooby.events.EventDispatcher.prototype.destroy.call(this);
		while(this.nativeEvents.length > 0) {
			var type = this.nativeEvents.pop();
			if(($_=this.el,$bind($_,$_.removeEventListener))) this.el.removeEventListener(type,$bind(this,this.onNativeEvent)); else this.el.detachEvent("on" + type,$bind(this,this.onNativeEvent));
		}
	}
	,__class__: scooby.display.DOMObject
	,__properties__: {set_visible:"set_visible",get_visible:"get_visible"}
});
scooby.display.DisplayObject = function(className,elementType) {
	scooby.display.DOMObject.call(this,className,elementType);
};
scooby.display.DisplayObject.__name__ = true;
scooby.display.DisplayObject.__super__ = scooby.display.DOMObject;
scooby.display.DisplayObject.prototype = $extend(scooby.display.DOMObject.prototype,{
	setParent: function(parent) {
		if(this.parent != null) this.parent.childRemoved(this);
		this.parent = parent;
		var type;
		if(parent == null) type = "removed"; else type = "added";
		this.dispatch(type);
	}
	,dispatchEvent: function(event) {
		if(event.canceled) return;
		scooby.display.DOMObject.prototype.dispatchEvent.call(this,event);
		if(this.parent != null && event.bubbles) this.parent.dispatchEvent(event);
	}
	,destroy: function() {
		if(this.parent != null) this.parent.removeChild(this);
		scooby.display.DOMObject.prototype.destroy.call(this);
	}
	,set_stage: function(value) {
		return scooby.display.DisplayObject._stage = value;
	}
	,get_stage: function() {
		return scooby.display.DisplayObject._stage;
	}
	,__class__: scooby.display.DisplayObject
	,__properties__: $extend(scooby.display.DOMObject.prototype.__properties__,{set_stage:"set_stage",get_stage:"get_stage"})
});
scooby.display.DisplayContainer = function(className,elementType) {
	this.childs = new Array();
	scooby.display.DisplayObject.call(this,className,elementType);
};
scooby.display.DisplayContainer.__name__ = true;
scooby.display.DisplayContainer.__super__ = scooby.display.DisplayObject;
scooby.display.DisplayContainer.prototype = $extend(scooby.display.DisplayObject.prototype,{
	addChild: function(display) {
		if(display == null) return;
		this.el.appendChild(display.el);
		if(HxOverrides.indexOf(this.childs,display,0) != -1) return;
		this.childs.push(display);
		display.setParent(this);
	}
	,addChildAt: function(display,index) {
		if(display == null) return;
		this.el.insertBefore(display.el,this.el.children[index]);
		if(HxOverrides.indexOf(this.childs,display,0) != -1) return;
		this.childs.push(display);
		display.setParent(this);
	}
	,addChilds: function(extra) {
		var child;
		var _g = 0;
		while(_g < extra.length) {
			var child1 = extra[_g];
			++_g;
			this.addChild(child1);
		}
	}
	,removeChild: function(display) {
		if(HxOverrides.indexOf(this.childs,display,0) == -1) return;
		this.el.removeChild(display.el);
		display.setParent(null);
	}
	,childRemoved: function(display) {
		var anIndex = HxOverrides.indexOf(this.childs,display,0);
		if(anIndex == -1) return;
		this.childs.splice(anIndex,1);
	}
	,setView: function(view) {
		view.appendChild(this.el);
		this.set_stage(this);
	}
	,destroyAllChilds: function() {
		var list = this.childs.slice();
		while(list.length > 0) {
			var child = list.pop();
			child.destroy();
		}
	}
	,destroy: function() {
		this.destroyAllChilds();
		scooby.display.DisplayObject.prototype.destroy.call(this);
	}
	,__class__: scooby.display.DisplayContainer
});
var Main = function() {
	scooby.display.DisplayContainer.call(this,"ExampleApp");
	this.header = new layout.Header();
	this.left = new layout.LeftSidebar();
	this.left.addEventListener("select",$bind(this,this.onMenuSelect));
	this.content = new layout.Content();
	this.addChilds([this.header,this.left,this.content]);
	this.page = new pages.StaticPage();
	this.content.addChild(this.page);
};
Main.__name__ = true;
Main.main = function() {
	var main = new Main();
	main.setView(window.document.body);
};
Main.__super__ = scooby.display.DisplayContainer;
Main.prototype = $extend(scooby.display.DisplayContainer.prototype,{
	onMenuSelect: function(e) {
		if(this.page != null) this.page.destroy();
		var _g = e.data;
		switch(_g) {
		case "static":
			this.page = new pages.StaticPage();
			break;
		case "login":
			this.page = new pages.LoginPage();
			break;
		case "custom":
			this.page = new pages.CustomPage();
			break;
		}
		this.content.addChild(this.page);
	}
	,__class__: Main
});
var IMap = function() { };
IMap.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
var haxe = {};
haxe.Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
haxe.Http.__name__ = true;
haxe.Http.prototype = {
	addHeader: function(header,value) {
		this.headers.push({ header : header, value : value});
		return this;
	}
	,setPostData: function(data) {
		this.postData = data;
		return this;
	}
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				s = null;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.iterator();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.iterator();
		while( $it1.hasNext() ) {
			var h1 = $it1.next();
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,__class__: haxe.Http
};
haxe.Log = function() { };
haxe.Log.__name__ = true;
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
haxe.Timer.prototype = {
	run: function() {
	}
	,__class__: haxe.Timer
};
haxe.ds = {};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,__class__: haxe.ds.StringMap
};
haxe.io = {};
haxe.io.Eof = function() { };
haxe.io.Eof.__name__ = true;
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
js.Browser = function() { };
js.Browser.__name__ = true;
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
};
js.Lib = function() { };
js.Lib.__name__ = true;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
var layout = {};
layout.Content = function() {
	scooby.display.DisplayContainer.call(this,"PageContent");
};
layout.Content.__name__ = true;
layout.Content.__super__ = scooby.display.DisplayContainer;
layout.Content.prototype = $extend(scooby.display.DisplayContainer.prototype,{
	setPage: function(nextPage) {
		if(this.page != null) this.page.destroy();
		this.page = nextPage;
		this.addChild(this.page);
	}
	,__class__: layout.Content
});
layout.Header = function() {
	scooby.display.DisplayContainer.call(this,"PageHeader");
	this.addChild(new scooby.ui.Label("Sample scooby app","LogoHeader"));
};
layout.Header.__name__ = true;
layout.Header.__super__ = scooby.display.DisplayContainer;
layout.Header.prototype = $extend(scooby.display.DisplayContainer.prototype,{
	__class__: layout.Header
});
layout.LeftSidebar = function() {
	scooby.display.DisplayContainer.call(this,"LeftSidebar");
	var menu = new scooby.ui.ButtonGroup("menu",true);
	menu.addEventListener("select",$bind(this,this.onSelect));
	this.addChild(menu);
	menu.addItem("Static HTML page","static").click();
	menu.addItem("Login Page","login");
	menu.addItem("Custom component","custom");
};
layout.LeftSidebar.__name__ = true;
layout.LeftSidebar.__super__ = scooby.display.DisplayContainer;
layout.LeftSidebar.prototype = $extend(scooby.display.DisplayContainer.prototype,{
	onSelect: function(e) {
		this.dispatch("select",e.data);
	}
	,__class__: layout.LeftSidebar
});
var pages = {};
pages.CustomPage = function() {
	scooby.display.DisplayContainer.call(this,"CustomPage");
	this.addEventListener("added",$bind(this,this.onAddedToStage));
};
pages.CustomPage.__name__ = true;
pages.CustomPage.__super__ = scooby.display.DisplayContainer;
pages.CustomPage.prototype = $extend(scooby.display.DisplayContainer.prototype,{
	onAddedToStage: function(e) {
		this.map = new scooby.ui.GoogleMap();
		this.map.addEventListener("click",$bind(this,this.onClick));
		this.addChild(this.map);
	}
	,onClick: function(e) {
		var marker = new scooby.ui.GoogleMarker();
		marker.setPosition(e.data);
		this.map.addMarker(marker);
	}
	,__class__: pages.CustomPage
});
pages.LoginPage = function() {
	scooby.display.DisplayContainer.call(this,"LoginPage");
	var header = new scooby.ui.Label("Login","Header");
	this.email = new scooby.ui.Input("text");
	this.password = new scooby.ui.Input("password");
	var submit = new scooby.ui.Button("Login!","primary");
	this.addChilds([header,this.email,this.password,submit]);
	submit.addEventListener("click",$bind(this,this.onClick));
};
pages.LoginPage.__name__ = true;
pages.LoginPage.__super__ = scooby.display.DisplayContainer;
pages.LoginPage.prototype = $extend(scooby.display.DisplayContainer.prototype,{
	onClick: function(e) {
		scooby.common.Server.ask("auth/login",$bind(this,this.onLoginResult),{ email : this.email.get_text(), password : this.password.get_text()});
		js.Lib.alert("Auth email: " + this.email.get_text() + ", password: " + this.password.get_text());
	}
	,onLoginResult: function(data) {
		haxe.Log.trace(data,{ fileName : "LoginPage.hx", lineNumber : 44, className : "pages.LoginPage", methodName : "onLoginResult"});
	}
	,__class__: pages.LoginPage
});
pages.StaticPage = function() {
	scooby.display.DisplayContainer.call(this,"StaticPage");
	this.setHTML("<h1>Static HTML page</h1><p>Use setHTML method to set HTML content to block. Don't use addChild before because of destroy problems</p>");
};
pages.StaticPage.__name__ = true;
pages.StaticPage.__super__ = scooby.display.DisplayContainer;
pages.StaticPage.prototype = $extend(scooby.display.DisplayContainer.prototype,{
	__class__: pages.StaticPage
});
scooby.common = {};
scooby.common.Call = function() { };
scooby.common.Call.__name__ = true;
scooby.common.Call.createTimer = function() {
	var timer = new haxe.Timer(30);
	timer.run = scooby.common.Call.onTimer;
	return timer;
};
scooby.common.Call.onTimer = function() {
	var currentTime = Std["int"](haxe.Timer.stamp() * 1000);
	var caller;
	var _g = 0;
	var _g1 = scooby.common.Call.afterCalls;
	while(_g < _g1.length) {
		var caller1 = _g1[_g];
		++_g;
		if((function($this) {
			var $r;
			var a = caller1.time;
			$r = (function($this) {
				var $r;
				var aNeg = currentTime < 0;
				var bNeg = a < 0;
				$r = aNeg != bNeg?aNeg:currentTime >= a;
				return $r;
			}($this));
			return $r;
		}(this))) caller1.call();
	}
	scooby.common.Call.afterCalls = scooby.common.Call.afterCalls.filter(scooby.common.Call.onFilter);
};
scooby.common.Call.onFilter = function(caller) {
	return caller.alive;
};
scooby.common.Call.after = function(handler,delay,args,onlyOnce) {
	if(onlyOnce == null) onlyOnce = false;
	if(delay == null) delay = 0;
	var caller = new scooby.common.AfterCaller(handler,args,Std["int"]((function($this) {
		var $r;
		var _g1 = haxe.Timer.stamp() * 1000;
		var _g = delay;
		$r = (function($this) {
			var $r;
			var $int = _g;
			$r = $int < 0?4294967296.0 + $int:$int + 0.0;
			return $r;
		}($this)) + _g1;
		return $r;
	}(this))));
	if(onlyOnce && scooby.common.Call.alreadyInCalls(handler)) return;
	scooby.common.Call.afterCalls.push(caller);
};
scooby.common.Call.once = function(handler,delay,args) {
	if(delay == null) delay = 0;
	scooby.common.Call.after(handler,delay,args,true);
};
scooby.common.Call.alreadyInCalls = function(handler) {
	var caller;
	var _g = 0;
	var _g1 = scooby.common.Call.afterCalls;
	while(_g < _g1.length) {
		var caller1 = _g1[_g];
		++_g;
		if(caller1.alive && caller1.handler == handler) return true;
	}
	return false;
};
scooby.common.Call.forget = function(handler) {
	var caller;
	var _g = 0;
	var _g1 = scooby.common.Call.afterCalls;
	while(_g < _g1.length) {
		var caller1 = _g1[_g];
		++_g;
		if(caller1.handler == handler) caller1.alive = false;
	}
};
scooby.common.AfterCaller = function(handler,args,time) {
	this.alive = true;
	this.args = args;
	this.handler = handler;
	this.time = time;
};
scooby.common.AfterCaller.__name__ = true;
scooby.common.AfterCaller.prototype = {
	call: function() {
		if(!this.alive) return;
		this.alive = false;
		this.handler.apply(null,this.args);
	}
	,__class__: scooby.common.AfterCaller
};
scooby.common.Server = function() { };
scooby.common.Server.__name__ = true;
scooby.common.Server.ask = function(route,handler,data) {
	if(data == null) data = { };
	if(scooby.common.Server.token != "") data.token = scooby.common.Server.token;
	var caller = new scooby.common.AskCaller(handler);
	var http = new haxe.Http(scooby.common.Server.basePath + route);
	http.addHeader("Content-Type","application/json; charset=utf-8");
	http.setPostData(JSON.stringify(data));
	http.onData = $bind(caller,caller.call);
	http.request(true);
};
scooby.common.Server.json = function(path,handler) {
	var caller = new scooby.common.AskCaller(handler);
	var http = new haxe.Http(path);
	http.onData = $bind(caller,caller.call);
	http.request();
};
scooby.common.Server.upload = function(route,fileField,file,handler,data) {
	var form = new FormData();
	form.append(fileField,file);
	if(scooby.common.Server.token != "") form.append("token",scooby.common.Server.token);
	if(data != null) {
		var _g = 0;
		var _g1 = Reflect.fields(data);
		while(_g < _g1.length) {
			var name = _g1[_g];
			++_g;
			form.append(name,Reflect.field(data,name));
		}
	}
	var caller = new scooby.common.AskCaller(handler);
	var request = new XMLHttpRequest();
	request.open("POST",scooby.common.Server.basePath + route,true);
	request.onload = $bind(caller,caller.call2);
	request.send(form);
};
scooby.common.AskCaller = function(handler) {
	this.handler = handler;
};
scooby.common.AskCaller.__name__ = true;
scooby.common.AskCaller.prototype = {
	call2: function(e) {
		var request = e.currentTarget;
		this.call(request.responseText);
	}
	,call: function(data) {
		data = JSON.parse(data);
		this.handler.apply(null,[data]);
	}
	,__class__: scooby.common.AskCaller
};
scooby.common.Translator = function() { };
scooby.common.Translator.__name__ = true;
scooby.common.Translator.addFile = function(path) {
	scooby.common.Translator.isInitialized = true;
	scooby.common.Translator.leftToLoad++;
	haxe.Log.trace("prepare",{ fileName : "Translator.hx", lineNumber : 24, className : "scooby.common.Translator", methodName : "addFile", customParams : [path]});
	scooby.common.Server.json(path,scooby.common.Translator.onLanguageLoaded);
};
scooby.common.Translator.onLanguageLoaded = function(data) {
	haxe.Log.trace("language loaded",{ fileName : "Translator.hx", lineNumber : 29, className : "scooby.common.Translator", methodName : "onLanguageLoaded"});
	scooby.common.Translator.addLanguage(data.lang,data);
	scooby.common.Translator.leftToLoad--;
	if(scooby.common.Translator.leftToLoad == 0 && scooby.common.Translator.handler != null) scooby.common.Translator.handler();
};
scooby.common.Translator.addLanguage = function(language,data) {
	var v = data;
	scooby.common.Translator.languages.set(language,v);
	v;
	if(scooby.common.Translator.currentLanguage == "") scooby.common.Translator.currentLanguage = language;
};
scooby.common.Translator.load = function(handler) {
	scooby.common.Translator.handler = handler;
};
scooby.common.Translator.getPreferedLanguage = function(langCodes) {
	var langStr;
	var _this = window.navigator.language.toLowerCase();
	langStr = HxOverrides.substr(_this,0,2);
	var _g1 = 0;
	var _g = langCodes.length;
	while(_g1 < _g) {
		var i = _g1++;
		var lang = langCodes[i];
		if(langStr.indexOf(lang) != -1) return lang;
	}
	return langCodes[0];
};
scooby.common.Translator.setLanguage = function(language) {
	scooby.common.Translator.currentLanguage = language;
};
scooby.common.Translator.get = function(phrase,lang) {
	if(lang == null) lang = "";
	if(lang == "") lang = scooby.common.Translator.currentLanguage;
	var data = scooby.common.Translator.languages.get(lang);
	if(data == null || Reflect.getProperty(data,phrase) == null) return phrase;
	return Reflect.getProperty(data,phrase);
};
scooby.display.TouchContainer = function(className,elementType) {
	if(elementType == null) elementType = "div";
	scooby.display.TouchContainer.init();
	scooby.display.DisplayContainer.call(this,className,elementType);
	this.nativeEvent("touchstart");
	this.nativeEvent("touchend");
	this.nativeEvent("touchmove");
	this.nativeEvent("click");
};
scooby.display.TouchContainer.__name__ = true;
scooby.display.TouchContainer.init = function() {
	window.document.ontouchmove = function(e) {
		e.preventDefault();
	};
};
scooby.display.TouchContainer.__super__ = scooby.display.DisplayContainer;
scooby.display.TouchContainer.prototype = $extend(scooby.display.DisplayContainer.prototype,{
	onNativeEvent: function(e) {
		if(e.type == "touchstart") this.touchStart(e);
		if(e.type == "touchmove") this.touchMove(e);
		if(e.type == "touchend") this.touchEnd(e);
		if(e.type == "click" && scooby.display.TouchContainer.tsFastClick) {
			e.stopImmediatePropagation();
			scooby.display.TouchContainer.tsFastClick = false;
			return;
		}
		this.dispatch(e.type,e);
	}
	,touchDistance: function() {
		var dx = this.touchDX();
		var dy = this.touchDY();
		return dx * dx + dy * dy;
	}
	,touchDX: function() {
		if(this.tsPoint == null || this.tmPoint == null) return -1;
		return this.tsPoint.x - this.tmPoint.x;
	}
	,touchDY: function() {
		if(this.tsPoint == null || this.tmPoint == null) return -1;
		return this.tsPoint.y - this.tmPoint.y;
	}
	,touchStart: function(e) {
		this.tsPoint = this.getTouchPoint(e);
		this.tsTime = new Date().getTime();
		scooby.display.TouchContainer.tsFastClick = true;
	}
	,touchMove: function(e) {
		this.tmPoint = this.getTouchPoint(e);
		if(this.touchDistance() > scooby.display.TouchContainer.touchSensivity) scooby.display.TouchContainer.tsFastClick = false;
		e.stopPropagation();
	}
	,touchEnd: function(e) {
		if(!scooby.display.TouchContainer.tsFastClick) return;
		this.dispatch("click",e);
	}
	,getTouchPoint: function(e) {
		if(e.originalEvent != null) e = e.originalEvent;
		var touch = e.touches[0];
		return new scooby.display.Point(touch.screenX,touch.screenY);
	}
	,__class__: scooby.display.TouchContainer
});
scooby.display.Point = function(x,y) {
	this.y = y;
	this.x = x;
};
scooby.display.Point.__name__ = true;
scooby.display.Point.prototype = {
	__class__: scooby.display.Point
};
scooby.events.Event = function(type,data,bubbles) {
	if(bubbles == null) bubbles = false;
	this.canceled = false;
	this.bubbles = bubbles;
	this.data = data;
	this.type = type;
};
scooby.events.Event.__name__ = true;
scooby.events.Event.prototype = {
	stopPropogation: function() {
		this.canceled = true;
	}
	,__class__: scooby.events.Event
};
scooby.ui = {};
scooby.ui.Button = function(text,className) {
	if(className == null) className = "";
	if(text == null) text = "";
	if(className.length > 0) className = " " + className;
	scooby.display.TouchContainer.call(this,"Button" + className);
	this.label = new scooby.ui.Label(text);
	this.addChild(this.label);
	this.label.set_visible(text.length > 0);
};
scooby.ui.Button.__name__ = true;
scooby.ui.Button.__super__ = scooby.display.TouchContainer;
scooby.ui.Button.prototype = $extend(scooby.display.TouchContainer.prototype,{
	setImage: function(src) {
		if(this.image == null) {
			this.image = new scooby.ui.Picture();
			this.addChildAt(this.image,0);
		}
		this.image.set_src(src);
	}
	,click: function() {
		this.dispatch("click");
		return this;
	}
	,set_checked: function(value) {
		this.checked = value;
		if(this.get_checked()) this.addClass("checked"); else this.removeClass("checked");
		return this.get_checked();
	}
	,get_checked: function() {
		return this.checked;
	}
	,set_text: function(value) {
		this.label.set_visible(value.length > 0);
		return this.label.set_text(value);
	}
	,get_text: function() {
		return this.label.get_text();
	}
	,__class__: scooby.ui.Button
	,__properties__: $extend(scooby.display.TouchContainer.prototype.__properties__,{set_checked:"set_checked",get_checked:"get_checked",set_text:"set_text",get_text:"get_text"})
});
scooby.ui.ButtonGroup = function(className,isToggle) {
	if(isToggle == null) isToggle = false;
	if(className == null) className = "";
	this.isToggle = isToggle;
	if(className.length > 0) className = " " + className;
	scooby.display.DisplayContainer.call(this,"ButtonGroup" + className);
};
scooby.ui.ButtonGroup.__name__ = true;
scooby.ui.ButtonGroup.__super__ = scooby.display.DisplayContainer;
scooby.ui.ButtonGroup.prototype = $extend(scooby.display.DisplayContainer.prototype,{
	getValue: function() {
		return this.selectedItem.name;
	}
	,addItem: function(label,name) {
		if(name == null) name = "";
		var btn = new scooby.ui.Button(label,"Item");
		btn.name = name;
		btn.addEventListener("click",$bind(this,this.onClick));
		this.addChild(btn);
		return btn;
	}
	,onClick: function(e) {
		var btn;
		btn = js.Boot.__cast(e.target , scooby.ui.Button);
		if(this.isToggle) {
			if(this.selectedItem != null) this.selectedItem.set_checked(false);
			this.selectedItem = btn;
			this.selectedItem.set_checked(true);
		}
		this.dispatch("select",btn.name);
	}
	,__class__: scooby.ui.ButtonGroup
});
scooby.ui.GoogleMap = function(coords,zoom,mapTypeId,isActive) {
	if(isActive == null) isActive = true;
	if(mapTypeId == null) mapTypeId = "roadmap";
	if(zoom == null) zoom = 2;
	if(coords == null) coords = new google.maps.LatLng(30.000000,0.000000);
	scooby.display.DisplayObject.call(this,"GoogleMap");
	if(isActive) this.initParams = { center : coords, zoom : zoom, mapTypeId : mapTypeId}; else this.initParams = { center : coords, zoom : zoom, mapTypeId : mapTypeId, scrollwheel : false, navigationControl : false, mapTypeControl : false, scaleControl : false, draggable : false};
	this.addEventListener("added",$bind(this,this.onAdded));
};
scooby.ui.GoogleMap.__name__ = true;
scooby.ui.GoogleMap.__super__ = scooby.display.DisplayObject;
scooby.ui.GoogleMap.prototype = $extend(scooby.display.DisplayObject.prototype,{
	onAdded: function(e) {
		this.map = new google.maps.Map(this.el,this.initParams);
		google.maps.GoogleEvent.addListener(this.map,"idle",$bind(this,this.onIdle));
		google.maps.GoogleEvent.addListener(this.map,"click",$bind(this,this.onClick));
	}
	,onClick: function(e) {
		this.dispatch("click",e.latLng);
	}
	,onIdle: function() {
		this.dispatch("idle");
	}
	,addMarker: function(marker) {
		marker.g.setMap(this.map);
	}
	,removeMarker: function(marker) {
		marker.g.setMap(null);
	}
	,setCenter: function(coords,zoom) {
		this.map.setCenter(coords);
		this.map.setZoom(zoom);
	}
	,destroy: function() {
		google.maps.GoogleEvent.clearInstanceListeners(this.map);
		scooby.display.DisplayObject.prototype.destroy.call(this);
	}
	,getSource: function() {
		return this.map;
	}
	,__class__: scooby.ui.GoogleMap
});
scooby.ui.GoogleMarker = function(data) {
	scooby.events.EventDispatcher.call(this);
	this.g = new google.maps.Marker();
	google.maps.GoogleEvent.addListener(this.g,"click",$bind(this,this.onClick));
	this.setData(data);
};
scooby.ui.GoogleMarker.__name__ = true;
scooby.ui.GoogleMarker.__super__ = scooby.events.EventDispatcher;
scooby.ui.GoogleMarker.prototype = $extend(scooby.events.EventDispatcher.prototype,{
	onClick: function(e) {
		this.dispatch("click");
	}
	,setData: function(data) {
		if(data == null) return;
		this.id = data.id;
		this.g.setPosition(new google.maps.LatLng(data.lat,data.lon));
	}
	,setPosition: function(latLng) {
		this.g.setPosition(latLng);
	}
	,__class__: scooby.ui.GoogleMarker
});
scooby.ui.Input = function(type,className) {
	if(className == null) className = "";
	if(type == null) type = "text";
	this.placeholder = "";
	if(className.length > 0) className = " " + className;
	if(type == "textarea") scooby.display.DisplayObject.call(this,"Input" + className,"textarea"); else {
		scooby.display.DisplayObject.call(this,"Input" + className,"input");
		this.setAttribute("type",type);
	}
	this.nativeEvent("keydown");
	this.nativeEvent("keyup");
	this.nativeEvent("change");
	this.addEventListener("keydown",$bind(this,this.onKeyDown));
};
scooby.ui.Input.__name__ = true;
scooby.ui.Input.__super__ = scooby.display.DisplayObject;
scooby.ui.Input.prototype = $extend(scooby.display.DisplayObject.prototype,{
	set_placeholder: function(value) {
		if(scooby.common.Translator.isInitialized) value = scooby.common.Translator.get(value);
		this.placeholder = value;
		this.setAttribute("placeholder",value);
		return value;
	}
	,get_placeholder: function() {
		return this.placeholder;
	}
	,onKeyDown: function(e) {
		if(e.data.keyCode == 13) this.dispatch("submit",null,true);
	}
	,set_text: function(value) {
		return this.el.value = value;
	}
	,get_text: function() {
		return this.el.value;
	}
	,getFiles: function() {
		return this.el.files;
	}
	,__class__: scooby.ui.Input
	,__properties__: $extend(scooby.display.DisplayObject.prototype.__properties__,{set_placeholder:"set_placeholder",get_placeholder:"get_placeholder",set_text:"set_text",get_text:"get_text"})
});
scooby.ui.Label = function(text,className) {
	if(className == null) className = "";
	if(text == null) text = "";
	this.text = "";
	if(className.length > 0) className = " " + className;
	scooby.display.DisplayObject.call(this,"Label" + className);
	this.set_text(text);
};
scooby.ui.Label.__name__ = true;
scooby.ui.Label.__super__ = scooby.display.DisplayObject;
scooby.ui.Label.prototype = $extend(scooby.display.DisplayObject.prototype,{
	set_text: function(value) {
		if(scooby.common.Translator.isInitialized) value = scooby.common.Translator.get(value);
		this.text = value;
		this.setHTML(value);
		return value;
	}
	,get_text: function() {
		return this.text;
	}
	,__class__: scooby.ui.Label
	,__properties__: $extend(scooby.display.DisplayObject.prototype.__properties__,{set_text:"set_text",get_text:"get_text"})
});
scooby.ui.Picture = function(className,src) {
	if(src == null) src = "";
	if(className == null) className = "";
	this.src = "";
	if(className.length > 0) className = " " + className;
	scooby.display.DisplayObject.call(this,"Picture" + className,"img");
	if(src != "") this.set_src(src);
};
scooby.ui.Picture.__name__ = true;
scooby.ui.Picture.__super__ = scooby.display.DisplayObject;
scooby.ui.Picture.prototype = $extend(scooby.display.DisplayObject.prototype,{
	set_src: function(value) {
		this.src = value;
		this.setAttribute("src",this.get_src());
		return this.get_src();
	}
	,get_src: function() {
		return this.src;
	}
	,__class__: scooby.ui.Picture
	,__properties__: $extend(scooby.display.DisplayObject.prototype.__properties__,{set_src:"set_src",get_src:"get_src"})
});
scooby.ui.PopupWindow = function(headerText,className) {
	if(className == null) className = "";
	if(className.length > 0) className = " " + className;
	scooby.display.DisplayContainer.call(this,"PopupWindow" + className);
	this.toolbar = new scooby.ui.ToolBar();
	this.toolbar.set_text(headerText);
	scooby.display.DisplayContainer.prototype.addChild.call(this,this.toolbar);
	this.close = new scooby.ui.Button("","PopupWindowClose");
	this.close.setImage("img/back.svg");
	this.close.addEventListener("click",$bind(this,this.onClose));
	this.toolbar.addChild(this.close);
	this.container = new scooby.ui.VArea("PopupWindowContent");
	scooby.display.DisplayContainer.prototype.addChild.call(this,this.container);
	this.get_stage().addChild(this);
};
scooby.ui.PopupWindow.__name__ = true;
scooby.ui.PopupWindow.__super__ = scooby.display.DisplayContainer;
scooby.ui.PopupWindow.prototype = $extend(scooby.display.DisplayContainer.prototype,{
	addChild: function(display) {
		this.container.addChild(display);
	}
	,onClose: function(e) {
		this.destroy();
	}
	,destroy: function() {
		this.dispatch("close");
		scooby.display.DisplayContainer.prototype.destroy.call(this);
	}
	,__class__: scooby.ui.PopupWindow
});
scooby.ui.ToolBar = function(className) {
	if(className == null) className = "";
	if(className.length > 0) className = " " + className;
	scooby.display.DisplayContainer.call(this,"ToolBar" + className);
	this.label = new scooby.ui.Label("","ToolBarLabel");
	this.label.set_visible(false);
	this.addChild(this.label);
	this.addEventListener("added",$bind(this,this.onAdded));
};
scooby.ui.ToolBar.__name__ = true;
scooby.ui.ToolBar.__super__ = scooby.display.DisplayContainer;
scooby.ui.ToolBar.prototype = $extend(scooby.display.DisplayContainer.prototype,{
	onAdded: function(e) {
		this.parent.addClass("toolbar-offset");
	}
	,destroy: function() {
		if(this.parent != null) this.parent.removeClass("toolbar-offset");
		scooby.display.DisplayContainer.prototype.destroy.call(this);
	}
	,set_text: function(value) {
		this.label.set_visible(value.length > 0);
		return this.label.set_text(value);
	}
	,get_text: function() {
		return this.label.get_text();
	}
	,__class__: scooby.ui.ToolBar
	,__properties__: $extend(scooby.display.DisplayContainer.prototype.__properties__,{set_text:"set_text",get_text:"get_text"})
});
scooby.ui.VArea = function(className) {
	if(className == null) className = "";
	if(className.length > 0) className = " " + className;
	scooby.display.TouchContainer.call(this,"VArea" + className);
	this.fix = new scooby.display.DisplayObject("ScrollableFix");
	this.addChild(this.fix);
	this.addEventListener("touchmove",$bind(this,this.onTouchMove));
	this.addEventListener("touchstart",$bind(this,this.onTouchStart));
};
scooby.ui.VArea.__name__ = true;
scooby.ui.VArea.__super__ = scooby.display.TouchContainer;
scooby.ui.VArea.prototype = $extend(scooby.display.TouchContainer.prototype,{
	onTouchStart: function(e) {
		if(this.el.scrollTop == 0) this.el.scrollTop += 1;
		if(this.el.scrollTop == this.el.scrollHeight - this.el.offsetHeight) this.el.scrollTop -= 1;
	}
	,setScroll: function(val) {
		this.fix.set_visible(val);
	}
	,onTouchMove: function(e) {
		if(this.el.scrollTop == 0 && this.touchDY() < 0) return;
		if(this.el.scrollHeight - this.el.offsetHeight == this.el.scrollTop && this.touchDY() > 0) return;
		e.data.stopPropagation();
	}
	,__class__: scooby.ui.VArea
});
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
if (google.maps.event) { google.maps.GoogleEvent = google.maps.event; }
scooby.common.Call.timer = scooby.common.Call.createTimer();
scooby.common.Call.afterCalls = [];
scooby.common.Server.basePath = "api/index.php?r=";
scooby.common.Server.token = "";
scooby.common.Translator.isInitialized = false;
scooby.common.Translator.languages = new haxe.ds.StringMap();
scooby.common.Translator.currentLanguage = "";
scooby.common.Translator.leftToLoad = 0;
scooby.display.TouchContainer.touchSensivity = 100;
scooby.display.TouchContainer.tsFastClick = false;
Main.main();
})();

//# sourceMappingURL=ExampleApp.js.map