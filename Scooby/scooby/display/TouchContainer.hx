package scooby.display;
import js.Browser;
import js.html.Event;
import scooby.common.Call;

import js.html.Touch;
import js.html.TouchEvent;

/**
 * Правильная работа c событиями пальца
 * @author rzer
 */
 
class TouchContainer extends DisplayContainer {
	
	public static var touchSensivity:Float = 100;
	
	private static var tsFastClick:Bool = false;
	
	private var tsTime:Float;
	private var tsPoint:Point;
	private var tmPoint:Point;
	
	static public function init() {
		
		Browser.document.ontouchmove = function(e) {
			e.preventDefault();
		}
	}

	public function new(className:String, elementType:String = "div") {
		
		TouchContainer.init();
		
		super(className, elementType);
		
		nativeEvent("touchstart");
		nativeEvent("touchend");
		nativeEvent("touchmove");
		nativeEvent("click");
	}
	
	public override function onNativeEvent(e:Event) {
		
		
		if (e.type == "touchstart") touchStart(e);
		if (e.type == "touchmove") touchMove(e);
		if (e.type == "touchend") touchEnd(e);
		
		if (e.type == "click" && tsFastClick) {
			e.stopImmediatePropagation();
			tsFastClick = false;
			return;
		}
		
        dispatch(e.type,e);
    }
	
	
	public function touchDistance():Float {
		var dx:Float = touchDX();
		var dy:Float = touchDY();
		
		return dx*dx+dy*dy;
	}
	
	public function touchDX():Float {
		if (tsPoint == null || tmPoint == null) return -1;
		return tsPoint.x - tmPoint.x;
	}
	
	public function touchDY():Float {
		if (tsPoint == null || tmPoint == null) return -1;
		return tsPoint.y - tmPoint.y;
	}
	
	function touchStart(e) {
		tsPoint = getTouchPoint(e);
		tsTime = Date.now().getTime();
		tsFastClick = true;
	}
	
	function touchMove(e) {
		
		tmPoint = getTouchPoint(e);

		if (touchDistance() > touchSensivity) tsFastClick = false;
		e.stopPropagation();
	}
	
	function touchEnd(e) {
		if (!tsFastClick) return;
		dispatch("click", e);
	}
	
	function getTouchPoint(e:Dynamic):Dynamic {
		if (e.originalEvent != null) e = e.originalEvent;
        var touch:Touch = e.touches[0];
		return new Point(touch.screenX,touch.screenY);
	}
	
	
}

class Point {
	
	public var y:Int;
	public var x:Int;

	public function new(x:Int, y:Int) {
		this.y = y;
		this.x = x;
	}
}