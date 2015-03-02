package scooby.ui;
import scooby.display.TouchContainer;
import scooby.events.Event;
import scooby.display.DisplayContainer;
import scooby.display.DisplayObject;

class SidePanel extends DisplayContainer {
	
	@:isVar public var opened(get, set):Bool = false;
	
	private var tint:DisplayObject;

	public function new(className:String = "") {
		
		if (className.length > 0) className = " " + className;
		super("SidePanel" + className);
		
		tint = new TouchContainer("SidePanelTint");
		tint.addEventListener("click", onTintClick);
		addEventListener("added", onAdded);
	}
	
	function onTintClick(e:Event):Void {
		opened = false;
	}
	
	private function onAdded(e:Event):Void {
		parent.addChild(tint);
	}
	
	public function toggle():Void {
		opened = !opened;
	}
	
	public function set_opened(value:Bool):Bool {
		(value) ? addClass("opened") : removeClass("opened");
		tint.visible = value;
		return opened = value;
	}
	
	function get_opened():Bool {
		return opened;
	}
	
	public override function destroy():Void {
		tint.destroy();
		super.destroy();
	}
	
	

	
}