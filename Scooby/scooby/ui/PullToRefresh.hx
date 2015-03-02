package scooby.ui;
import scooby.common.Call;
import scooby.display.DisplayObject;
import scooby.events.Event;
import scooby.display.DisplayContainer;

/**
 * ...
 * @author 
 */
class PullToRefresh extends DisplayContainer {
	
	private var lastScrollValue:Int = 0;
	
	private var icon:DisplayObject;
	private var label:Label;
	
	public function new() {
		
		super("PullToRefresh");
		
		addEventListener("added", onAdded);
	}
	
	private function onAdded(e:Event):Void {
		
		icon = new DisplayObject("PullToRefreshIcon");
		label = new Label("PLR_PULL");
		addChilds([icon, label]);
		
		parent.addEventListener("touchmove", onTouchMove);
		parent.addEventListener("touchend", onTouchEnd);
		parent.addClass("pull-to-refresh");
		
	}
	
	private function onTouchEnd(e:Event):Void {
		if (lastScrollValue < -70) {
			dispatch("refresh");
			start();
		}
	}
	
	public function start():Void {
		addClass("refreshing");
		label.text = "PLR_REFRESHING";
	}
	
	public function stop() {
		label.text = "PLR_PULL";
		removeClass("refreshing");
	}
	
	private function onTouchMove(e:Event):Void {
		lastScrollValue = parent.el.scrollTop;
	}
	
	public override function destroy():Void {
		parent.removeClass("pull-to-refresh");
		super.destroy();
	}
	
}