package scooby.ui;

import scooby.common.Translator;
import scooby.display.DisplayContainer;
import scooby.display.DisplayObject;
import scooby.display.TouchContainer;

class Button extends TouchContainer {
	
	
	public var image:Picture;
	public var label:Label;
	public var text(get, set):String;
	@:isVar public var checked(get, set):Bool;

	public function new(text:String = "", className:String = "") {
		
		if (className.length > 0) className = " " + className;
		
		super("Button" + className);
		
		label = new Label(text);
		addChild(label);
		
		label.visible = (text.length > 0);
		
	}
	
	public function setImage(src:String):Void {
		if (image == null) {
			image = new Picture();
			addChildAt(image, 0);
		}
		
		image.src = src;
	}
	
	public function click():Button {
		dispatch("click");
		return this;
	}
	
	public function set_checked(value:Bool):Bool {
		
		checked = value;
		checked ? addClass("checked") : removeClass("checked");
		return checked;
		
	}
	
	public function get_checked():Bool {
		return checked;
	}
	
	public function set_text(value:String):String {
		label.visible = (value.length > 0);
		return label.text = value;
	}
	
	function get_text():String {
		return label.text;
	}
	
}