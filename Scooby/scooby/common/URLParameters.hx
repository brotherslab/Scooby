package scooby.common;
import js.Browser;

/**
 * Читает параметры из GET запроса
 * @author 
 */

class URLParameters {
	
	private static var parameters:Map<String, String> = null;
	
	
	public static function getQueryParams():Map < String, String > {
			
		var result:Map<String, String> = new Map<String, String>();
		
		var query:String = Browser.window.location.search;
		query = query.substring(1);
		
		var params:Array<String> = query.split("&");
		
		for (i in 0 ... params.length) {
			var pair:Array<String> = params[i].split("=");
			result.set(pair[0], pair[1]);
		}
		
		return result;
	}
	
	public static function get(paramName:String):String {
		if (parameters == null) parameters = getQueryParams();
		return parameters.get(paramName);
	}
	
	

	
	
}