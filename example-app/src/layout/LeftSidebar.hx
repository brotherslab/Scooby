package layout;

import scooby.events.Event;
import haxe.Json;
import scooby.display.DisplayContainer;
import scooby.ui.ButtonGroup;


class LeftSidebar extends DisplayContainer {
	

	public function new() {
		
		super("LeftSidebar");
		
		var menu:ButtonGroup = new ButtonGroup("menu", true);
		menu.addEventListener("select", onSelect);
		addChild(menu);
		
		menu.addItem("Static HTML page", "static").click();
		menu.addItem("Login Page", "login");
		menu.addItem("Custom component", "custom");
		
		
	}
	
	private function onSelect(e:Event):Void {
		dispatch("select", e.data);
	}
	
	
}