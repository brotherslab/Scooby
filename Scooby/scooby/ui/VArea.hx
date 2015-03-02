package scooby.ui;

import js.Browser;
import scooby.common.Call;
import scooby.display.TouchContainer;
import scooby.events.Event;
import scooby.display.DisplayContainer;
import scooby.display.DisplayObject;


class VArea extends TouchContainer {
	
	var fix:DisplayObject;
	
	public var content:DisplayContainer;
	
	
	public function new(className:String = "") {
		
		if (className.length > 0) className = " " + className;
		super("VArea" + className);
		
		fix = new DisplayObject("ScrollableFix");
		addChild(fix);
		
		addEventListener("touchmove", onTouchMove);
		addEventListener("touchstart", onTouchStart);
	}

	private function onTouchStart(e:Event):Void {
		if (el.scrollTop == 0) el.scrollTop += 1;
		if (el.scrollTop == el.scrollHeight - el.offsetHeight) el.scrollTop -= 1;
	}
	
	public function setScroll(val:Bool):Void {
		fix.visible = val;
	}
	
	private function onTouchMove(e:Event):Void {
		
        if (el.scrollTop == 0 && touchDY() < 0) return;
        if (el.scrollHeight - el.offsetHeight == el.scrollTop && touchDY() > 0) return;
		
        e.data.stopPropagation();
	}
	
}