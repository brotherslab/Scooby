package scooby.ui;
import js.html.FileList;
import scooby.common.Translator;
import scooby.events.Event;
import js.html.InputElement;
import scooby.display.DisplayObject;

class Input extends DisplayObject {
	
	public var text(get, set):String;
	@:isVar public var placeholder(get, set):String = "";

	public function new(type:String = "text", className:String = "") {
		
		if (className.length > 0) className = " " + className;
		
		if (type == "textarea") {
			super("Input" + className, "textarea");
		}else {
			super("Input" + className, "input");
			setAttribute("type", type);
		}
		
		nativeEvent("keydown");
		nativeEvent("keyup");
		nativeEvent("change");
		
		addEventListener("keydown", onKeyDown);
	}
	
	public function set_placeholder(value:String):String {
		
		if (Translator.isInitialized) value = Translator.get(value);
		
		placeholder = value;
		setAttribute("placeholder", value);
		
		return value;
	}
	
	function get_placeholder():String {
		return placeholder;
	}
	
	private function onKeyDown(e:Event):Void {
		if (e.data.keyCode == 13) dispatch("submit", null, true);
	}
	
	public function set_text(value:String):String {
		return untyped el.value = value;
	}
	
	public function get_text():String {
		return untyped el.value;
	}
	
	
	public function getFiles():FileList {
		return untyped __js__("this.el.files");
	}
	
}