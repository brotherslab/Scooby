package scooby.common;
import haxe.ds.HashMap.HashMap;
import haxe.Http;
import haxe.Json;
import js.html.DOMFormData;
import js.html.File;
import js.html.XMLHttpRequest;
import js.html.XMLHttpRequestProgressEvent;
import js.html.XMLHttpRequestUpload;
import js.Lib;

/**
 * Обёртка вокруг haxe.http для удобной работы с rzer/RestPHP
 * @author 
 */
class Server {
	
	public static var basePath:String = "api/index.php?r=";
	public static var token:String = "";
	
	public static function ask(route:String, handler:Dynamic->Void, data:Dynamic = null):Void {
		
		if (data == null) data = { };
		if (token != "") data.token = token;
		
		var caller:AskCaller = new AskCaller(handler);
		
		var http:Http = new Http(basePath + route);
		http.addHeader("Content-Type", "application/json; charset=utf-8");
		http.setPostData(Json.stringify(data));
		http.onData = caller.call;
		http.request(true);
		
	}
	
	public static function json(path:String, handler:Dynamic->Void):Void {
		
		var caller:AskCaller = new AskCaller(handler);
		var http:Http = new Http(path);
		http.onData = caller.call;
		http.request();
		
	}
	
	static public function upload(route:String, fileField:String, file, handler:Dynamic->Void, data:Dynamic = null) {

		var form:Dynamic = new DOMFormData();
		
		form.append(fileField, file);
		if (token != "") form.append("token", token);
		
		if (data != null){
			for (name in Reflect.fields(data)) {
				form.append(name, Reflect.field(data, name));
			}
		}
		
		
		var caller:AskCaller = new AskCaller(handler);
		
		var request:XMLHttpRequest = new XMLHttpRequest();
		request.open("POST", basePath + route, true);
		request.onload = caller.call2;
		request.send(form);

	}
	
}

class AskCaller {
	
	public var handler:Dynamic->Void;
	
	public function new(handler:Dynamic->Void) {
		this.handler = handler;
	}
	
	public function call2(e) {
		var request = e.currentTarget;
		call(request.responseText);
	}
	
	public function call(data:Dynamic):Void {
		data = Json.parse(data);
		Reflect.callMethod(null, handler, [data]);
	}
}