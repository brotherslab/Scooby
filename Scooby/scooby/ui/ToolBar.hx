package scooby.ui;

import scooby.events.Event;
import scooby.display.DisplayContainer;
import scooby.display.DisplayObject;


class ToolBar extends DisplayContainer {
	
	public var text(get, set):String;
	var label:Label;
	
	public function new(className:String = "") {
		
		if (className.length > 0) className = " " + className;
		super("ToolBar" + className);
		
		label = new Label("", "ToolBarLabel");
		label.visible = false;
		addChild(label);
		
		addEventListener("added", onAdded);
	}
	
	private function onAdded(e:Event):Void {
		parent.addClass("toolbar-offset");
	}
	
	public override function destroy():Void {
		if (parent != null) parent.removeClass("toolbar-offset");
		super.destroy();
	}
	
	public function set_text(value:String):String {
		label.visible = (value.length > 0);
		return label.text = value;
	}
	
	function get_text():String {
		return label.text;
	}
	
}