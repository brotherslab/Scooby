package scooby.ui;
import scooby.events.Event;
import google.maps.GoogleEvent;
import google.maps.LatLng;
import google.maps.Marker;
import scooby.events.EventDispatcher;

/**
 * ...
 * @author 
 */
class GoogleMarker extends EventDispatcher {
	
	public var g:Marker;
	public var id:String;

	public function new(data:Dynamic = null) {
		super();
		g = new Marker();
		GoogleEvent.addListener(g, "click", onClick);
		
		setData(data);
	}
	
	private function onClick(e:Event):Void {
		dispatch("click");
	}
	
	public function setData(data:Dynamic):Void {
		
		if (data == null) return;
		
		id = data.id;
		g.setPosition(new LatLng(data.lat, data.lon));
	}
	
	public function setPosition(latLng:LatLng) {
		g.setPosition(latLng);
	}
	
}