package scooby.display;

import js.Browser;
import js.html.Element;
import js.html.TouchEvent;
import js.html.TouchList;
import scooby.ui.PopupWindow;

import scooby.events.Event;
import scooby.events.EventDispatcher;


/**
 * Обёртка над DOM элементом, позволяющая наследоваться.
 * @author rzer
 */

class DOMObject extends EventDispatcher {
	
	private static var touchTarget:DOMObject;
	private static var touchTime:Float;
	
	public var nativeEvents:Array<String> = [];
	private var el:Element;
	public var className:String;
	
	@:isVar public var visible(get, set):Bool = true;
	
	
	public function set_visible(value:Bool):Bool {
		
		value ? removeClass("hidden") : addClass("hidden");
		return visible = value;
	}
	
	function get_visible():Bool {
		return visible;
	}
	
	
	public function new(className:String ="", elementType:String = "div") {
		super();
		
		this.className = className;
		
		el = Browser.document.createElement(elementType);
		if (className != "") el.className = className;
	}
	
	
	
	public function addClass(className:String):Void {
		el.classList.add(className);
	}
	
	public function removeClass(className:String):Void {
		el.classList.remove(className);
	}
	
	public function toggleClass(className:String):Void {
		el.classList.toggle(className);
		
	}
	
	
	public function setHTML(html:String):Void {
		el.innerHTML = html;
	}
	
	public function setAttribute(type:String, value:String):Void {
		el.setAttribute(type, value);
	}
	
	public function setAttributes(data:Map<String,String>) {
		var type:String;
		for (type in data) setAttribute(type, data[type]);
	}
	
	public function focus():Void {
		el.focus();
	}
	
	//Указывает какие нативные события - нужно трансформировать в кастомные
	public function nativeEvent(type:String):Void { 
		
		if (nativeEvents.indexOf(type) != -1) return;
		nativeEvents.push(type);
		
		untyped {
			if (el.addEventListener) el.addEventListener(type, onNativeEvent, false );
			else el.attachEvent("on" + type, clickHandlerFunction, false );
		}
	}
	
	
	public function onNativeEvent(e:js.html.Event) {
        dispatch(e.type,e);
    }
	
	
	public override function destroy():Void {
		
		super.destroy();
		
		while (nativeEvents.length > 0) {
			var type:String = nativeEvents.pop();
			
			untyped{    
				if (el.removeEventListener) el.removeEventListener(type, onNativeEvent);
				else el.detachEvent("on" + type, onNativeEvent);
			}
		}
		
	}
	
}