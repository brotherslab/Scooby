package scooby.ui;
import scooby.events.Event;
import scooby.display.DisplayContainer;
import scooby.display.DisplayObject;


class PopupWindow extends DisplayContainer {
	
	public var toolbar:ToolBar;
	public var close:Button;
	
	public var container:VArea;
	
	public function new(headerText:String, className:String = "") {
		
		if (className.length > 0) className = " " + className;
		super("PopupWindow" + className);
		
		toolbar = new ToolBar();
		toolbar.text = headerText;
		super.addChild(toolbar);
		
		close = new Button("", "PopupWindowClose");
		close.setImage("img/back.svg");
		close.addEventListener("click", onClose);
		toolbar.addChild(close);
		
		container = new VArea("PopupWindowContent");
		super.addChild(container);
		
		stage.addChild(this);
	}
	
	public override function addChild(display:DisplayObject):Void {
		container.addChild(display);
	}
	
	private function onClose(e:Event):Void {
		destroy();
	}
	
	public override function destroy():Void {
		dispatch("close");
		super.destroy();
	}
	
}