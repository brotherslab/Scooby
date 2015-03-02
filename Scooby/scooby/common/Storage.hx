package scooby.common;

import haxe.Json;
import js.Browser;


/**
 * Статический класс обслуживающий localStorage. Возвращает объект в том виде, в котором был записан.
 * @author rzer
 */

class Storage{
	
	private static var storage:js.html.Storage = Browser.getLocalStorage();
	
	
	public static function setItem(key:String, data:Dynamic):Void {
		
		if (storage == null) return;
		
		data = Json.stringify(data);
		storage.setItem(key, data);
	}
	
	public static function getItem(key:String):Dynamic {
		if (storage == null) return null;
		
		var data:Dynamic = storage.getItem(key);
		if (data == null) return null;
		
		data = Json.parse(data);
		return data;
	}
	
	public static function removeItem(key:String):Void {
		if (storage == null) return;
		storage.removeItem(key);
	}
}