package scooby.ui;


import google.maps.GoogleEvent;
import google.maps.LatLng;
import google.maps.Map;
import google.maps.MapTypeId;
import google.maps.MapTypeStyle;
import google.maps.Marker;
import google.maps.MouseEvent;
import google.maps.StyledMapType;
import haxe.Json;

import scooby.events.Event;
import scooby.display.DisplayContainer;
import scooby.display.DisplayObject;

/**
 * Google Map
 * 0) https://github.com/jdonaldson/google-js-api-hx/tree/master/google-js-maps-v3/google/maps
 * 1) Add to head section: <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
 * 2) Add map child only to a visible object
 */

class GoogleMap extends DisplayObject {
	
	public var map:Map;
	private var initParams:Dynamic;

	public function new(coords:LatLng = null, zoom:Int = 2, mapTypeId:String = "roadmap", isActive:Bool = true) {
		
		if (coords == null) coords = new LatLng(30.000000, 0.000000);
		
		super("GoogleMap");
		
		
		if (isActive) {
			
			initParams = {
				center: coords,
				zoom:zoom,
				mapTypeId: mapTypeId
			};
			
		}else{
			
			initParams = {
				center: coords,
				zoom:zoom,
				mapTypeId: mapTypeId,
				scrollwheel: false,
				navigationControl: false,
				mapTypeControl: false,
				scaleControl: false,
				draggable: false
			};
			
			
		}
		
		addEventListener("added", onAdded);
	}
	
	private function onAdded(e:Event):Void {
		
		map = new Map(el, initParams);
		
		GoogleEvent.addListener(map, "idle", onIdle);
		GoogleEvent.addListener(map, "click", onClick);
	}

	
	private function onClick(e:MouseEvent):Void {
		dispatch("click", e.latLng);
	}
	
	private function onIdle():Void {
		dispatch("idle");
	}
	
	public function addMarker(marker:GoogleMarker):Void {
		marker.g.setMap(map);
	}
	
	public function removeMarker(marker:GoogleMarker):Void {
		marker.g.setMap(null);
	}
	
	public function setCenter(coords:LatLng, zoom:Int) {
		map.setCenter(coords);
		map.setZoom(zoom);
	}
	


	public override function destroy() {
		GoogleEvent.clearInstanceListeners(map);
		super.destroy();
	}
	
	public function getSource():Map {
		return map;
	}
	
}