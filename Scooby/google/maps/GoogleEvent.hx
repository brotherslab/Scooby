package google.maps;

extern class GoogleEvent {
	
private static function __init__() : Void untyped {
	__js__('if (google.maps.event) { google.maps.GoogleEvent = google.maps.event; }');
}

public static function removeListener(listener:Dynamic):Void;
public static function addListenerOnce(instance:Dynamic, eventName:String, handler:Dynamic):Dynamic;
public static function addDomListenerOnce(instance:Dynamic, eventName:String, handler:Dynamic) : Dynamic;
public static function addListener(instance:Dynamic, eventName:String, handler:Dynamic) : Dynamic;
public static function clearListeners(instance:Dynamic, eventName:String) : Void;
public static function trigger(instance:Dynamic, eventName:String, var_args:Dynamic) : Void;
public static function addDomListener(instance:Dynamic, eventName:String, handler:Dynamic) : Dynamic;
public static function clearInstanceListeners(instance:Dynamic) : Void;

}