package pages;
import scooby.events.Event;
import scooby.display.DisplayContainer;
import scooby.ui.GoogleMap;
import scooby.ui.GoogleMarker;

/**
 * ...
 * @author 
 */
class CustomPage extends DisplayContainer {
	var map:GoogleMap;
	
	//don't forget to include google maps script to index.html

	public function new() {
		super("CustomPage");
		
		addEventListener("added", onAddedToStage);
	}
	
	private function onAddedToStage(e:Event):Void {
		
		map = new GoogleMap();
		map.addEventListener("click", onClick);
		addChild(map);
	}
	
	private function onClick(e:Event):Void {
		var marker:GoogleMarker = new GoogleMarker();
		marker.setPosition(e.data);
		map.addMarker(marker);
		
	}
	
}