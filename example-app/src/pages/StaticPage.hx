package pages;
import scooby.display.DisplayContainer;

/**
 * ...
 * @author 
 */
class StaticPage extends DisplayContainer{

	public function new() {
		super("StaticPage");
		
		setHTML("<h1>Static HTML page</h1><p>Use setHTML method to set HTML content to block. Don't use addChild before because of destroy problems</p>");
	}
	
}