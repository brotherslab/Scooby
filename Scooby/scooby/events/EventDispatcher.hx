package scooby.events;

/**
 * Реализация Observer паттерна
 * @author rzer
 */

class EventDispatcher {
	
	public var listeners:Map<String, Array<Event->Void>> = new Map<String, Array<Event->Void>>();

	public function addEventListener(type:String, listener:Event->Void):Void {
		
		if (listeners[type] == null) listeners[type] = new Array<Event->Void>();
		
		var list:Array<Event->Void> = listeners[type];
		
		if (list.indexOf(listener) != -1) return;
		
		
		
		
		list.push(listener);
		
	}
	
	public function hasEventListener(type:String, listener:Event->Void):Bool {
		return (listeners[type] != null && listeners[type].indexOf(listener) != -1);
	}
	
	
	public function removeEventListener(type:String, listener:Event->Void):Void {
		
		var list:Array<Event->Void> = listeners[type];
		if (list == null) return;
		
		var anIndex:Int = list.indexOf(listener);
		if (anIndex == -1) return;
		list.splice(anIndex, 1);
	}
	
	public function dispatchEvent(event:Event):Void {
		
		var list:Array<Event->Void> = listeners[event.type];
		if (list == null) return;
		
		event.target = this;
		
		list = list.copy();
		
		var listener:Event->Void;
		
		for (listener in list) {
			listener(event);
		}
	}
	
	public function dispatch(type:String, data:Dynamic = null, bubbles:Bool = false):Void {
		var event:Event = new Event(type, data, bubbles);
		dispatchEvent(event);
	}
	
	
	public function removeAllListeners():Void {
		listeners = new Map<String, Array<Event->Void>>();
	}
	
	public function destroy():Void {
		removeAllListeners();
	}
	
	
}