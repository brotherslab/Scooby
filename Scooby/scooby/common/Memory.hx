package scooby.common;
import haxe.Json;

/**
 * Кеш во время выполнения
 * @author 
 */

class Memory{
	
	public static var data:Dynamic = {};
	
	public static function clear():Void {
		data = {};
	}
	
	public static function getItem(key:String):Dynamic {
		return Reflect.field(data, key);
	}
	
	public static function setItem(key:String, item:Dynamic):Void {
		Reflect.setField(data, key, item);
	}
	
	public static function save():Void {
		Storage.setItem("cache", Json.stringify(data));
	}
	
	public static function load():Void {
		data = Json.parse(Storage.getItem("cache"));
		if (data == null) data = { };
	}
	
	static public function removeItem(key:String) {
		Reflect.deleteField(data, key);
	}
	
	
}