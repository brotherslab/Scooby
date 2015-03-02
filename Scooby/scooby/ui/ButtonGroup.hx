package scooby.ui;
import scooby.display.DisplayContainer;
import scooby.events.Event;


class ButtonGroup extends DisplayContainer {
	
	var isToggle:Bool;
	var selectedItem:Button;

	public function new(className:String = "", isToggle:Bool = false) {
		this.isToggle = isToggle;
		
		if (className.length > 0) className = " " + className;
		super("ButtonGroup" + className);
		
	}
	
	public function getValue():String {
		return selectedItem.name;
	}
	
	public function addItem(label:String, name:String = ""):Button {
		var btn:Button = new Button(label, "Item");
		btn.name = name;
		btn.addEventListener("click", onClick);
		addChild(btn);
		
		return btn;
	}
	
	private function onClick(e:Event):Void {
		
		var btn:Button = cast(e.target, Button);
		
		if (isToggle) {
			
			if (selectedItem != null) selectedItem.checked = false;
			
			selectedItem = btn;
			selectedItem.checked = true;
		}
		
		dispatch("select",  btn.name);
	}
	
}