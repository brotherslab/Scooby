package scooby.display;

import scooby.events.Event;


/**
 * Визуальный объект с родителем и рассылкой сообщений по дереву
 * @author rzer
 */

class DisplayObject extends DOMObject {
	
	private static var _stage:DisplayContainer;
	
	public var parent:DisplayContainer;
	public var name:String;
	
	public var stage(get, set):DisplayContainer;

	public function setParent(parent:DisplayContainer):Void {
		
		if (this.parent != null) this.parent.childRemoved(this);
		this.parent = parent;
		
		var type:String = (parent == null) ? "removed" : "added";
		dispatch(type);
	}
	
	public override function dispatchEvent(event:Event):Void {
		if (event.canceled) return;
		super.dispatchEvent(event);
		
		if (parent != null && event.bubbles) parent.dispatchEvent(event);
	}
	
	public override function destroy():Void {
	
		if (parent != null) parent.removeChild(this);
		
		super.destroy();
	}
	
	public function set_stage(value:DisplayContainer):DisplayContainer {
		return _stage = value;
	}
	
	public function get_stage():DisplayContainer {
		return _stage;
	}
	
}