package ;

import pages.LoginPage;
import pages.StaticPage;
import pages.CustomPage;
import scooby.events.Event;
import js.Browser;
import js.Lib;
import layout.Content;
import layout.Header;
import layout.LeftSidebar;
import scooby.display.DisplayContainer;

class Main extends DisplayContainer {
	
	var header:Header;
	var left:LeftSidebar;
	var content:Content;
	
	var page:DisplayContainer;
	
	static function main() {
		var main:Main = new Main();
		main.setView(Browser.document.body);
	}
	
	public function new() {
		super("ExampleApp");
		
		header = new Header();
		
		left = new LeftSidebar();
		left.addEventListener("select", onMenuSelect);
		
		content = new Content();
		
		addChilds([header, left, content]);
		
		page = new StaticPage();
		content.addChild(page);
		
	}
	
	private function onMenuSelect(e:Event):Void {
		
		if (page != null) page.destroy();
		
		switch (e.data) {
			case "static": page = new StaticPage();
			case "login": page = new LoginPage();
			case "custom": page = new CustomPage();
		}
		
		content.addChild(page);
	}
	
}