package scooby.common;

import haxe.Timer;

/**
 * Обёртка вокруг таймера для реализации задержанных вызовов
 * @author rzer
 */

class Call {
	
	private static var timer:Timer = createTimer();
	private static var afterCalls:Array<AfterCaller> = [];
	
	private static function createTimer():Timer{
		var timer:Timer = new Timer(30);
		timer.run = onTimer;
		return timer;
	}
	
	public static function onTimer() {
		
		var currentTime:Int = Std.int(Timer.stamp() * 1000);
		
		var caller:AfterCaller;
		
		for (caller in afterCalls) {
			if (caller.time <= currentTime) caller.call();
		}
		
		afterCalls = afterCalls.filter(onFilter);
		
	}
	
	public static function onFilter(caller:AfterCaller):Bool {
		return caller.alive;
	}

	public static function after(handler:Dynamic, delay:UInt = 0,  args:Array<Dynamic> = null, onlyOnce:Bool = false):Void {
		
		var caller:AfterCaller = new AfterCaller(handler, args, Std.int(Timer.stamp()*1000 + delay));
		
		if (onlyOnce && alreadyInCalls(handler)) return;

		afterCalls.push(caller);
	}
	
	public static function once(handler:Dynamic, delay:UInt = 0,  args:Array<Dynamic> = null):Void {
		after(handler, delay, args, true);
	}
	
	public static function alreadyInCalls(handler:Dynamic):Bool {
		
		var caller:AfterCaller;
		
		for (caller in afterCalls) {
			if (caller.alive && caller.handler == handler) return true;
		}
		
		return false;
	}
	
	public static function forget(handler:Dynamic) {
		
		var caller:AfterCaller;
		
		for (caller in afterCalls) {
			if (caller.handler == handler) caller.alive = false;
		}
	}
	

}

class AfterCaller {
	
	public var time:UInt;
	public var handler:Dynamic;
	public var args:Array<Dynamic>;
	
	public var alive:Bool = true;
	
	public function new(handler:Dynamic, args:Array<Dynamic>, time:UInt) {
		
		this.args = args;
		this.handler = handler;
		this.time = time;
		
	}
	
	public function call():Void {
		
		if (!alive) return;
		
		alive = false;
		Reflect.callMethod(null, handler, args);
	}
	
}