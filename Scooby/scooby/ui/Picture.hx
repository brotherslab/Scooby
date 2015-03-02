package scooby.ui;
import scooby.display.DisplayObject;


class Picture extends DisplayObject {
	
	@:isVar public var src(get, set):String = "";
	
	public function new(className:String = "", src:String = "") {
		
		if (className.length > 0) className = " " + className;
		super("Picture" + className, "img");
		
		
		if (src != "") this.src = src;
	}
	
	
	public function set_src(value:String):String {
		src = value;
		setAttribute("src", src);
		return src;
	}
	
	function get_src():String {
		return src;
	}
	
	
	
	
}