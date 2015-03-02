package scooby.events;


/**
 * Наш кастомный класс события
 * @author rzer
 */

class Event {
	
	public var bubbles:Bool;
	public var data:Dynamic;
	public var type:String;
	public var canceled:Bool = false;
	public var target:EventDispatcher;

	public function new(type:String, data:Dynamic = null, bubbles:Bool = false ) {
		this.bubbles = bubbles;
		this.data = data;
		this.type = type;
		
	}
	
	public function stopPropogation():Void {
		canceled = true;
	}
}