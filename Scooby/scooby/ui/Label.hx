package scooby.ui;

import scooby.common.Translator;
import scooby.display.DisplayObject;

class Label extends DisplayObject {
	
	@:isVar public var text(get, set):String = "";
	
	public var data:String;

	public function new(text:String = "", className:String = "") {
		
		if (className.length > 0) className = " " + className;
		super("Label" + className);
		
		this.text = text;
		
	}
	
	public function set_text(value:String):String {
		
		if (Translator.isInitialized) value = Translator.get(value);
		
		text = value;
		setHTML(value);
		
		return value;
	}
	
	function get_text():String {
		return text;
	}
	
}