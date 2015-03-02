package scooby.ui;

import scooby.display.DisplayContainer;
import scooby.display.DisplayObject;


class ProgressBar extends DisplayContainer {
	
	@:isVar public var progress(get, set):Float = 0.5;
	
	private var fill:DisplayObject;
	

	public function new(className:String) {
		
		if (className.length > 0) className = " " + className;
		super("ProgressBar" + className);
		
		fill = new DisplayObject("ProgressLine");
		addChild(fill);
	}
	
	
	public function set_progress(value:Float):Float {
		
		progress = value;
		
		fill.el.style.width = 1 + value * 99 + "%";
		
		return value;
	}
	
	function get_progress():Float {
		return progress;
	}
	
}