package scooby.net;

import haxe.Json;
import scooby.common.Storage;
import scooby.common.Call;
import scooby.common.Server;

/**
 * Накапливает интересующие айдишники данных и отсылает их одним запросом, не повторяет запрос, если id уже есть в словаре
 * @author 
 */
class RemoteDictionary {
	
	//стратегии кеширования: never - никогда, update - принудительное обновление, read - чтение предпочтительно
	//места кеширования: memory - в памяти приложения до его завершения, storage - в localStorage
	//время кеширования: 0 - навсегда, или n минут
	
	private var data:Dynamic = { };
	private var list:Array<String> = new Array<String>();
	private var requests:Array<RemoteCaller> = new Array<RemoteCaller>();
	private var route:String;
	private var saveInStorage:Bool;
	private var multiple:Bool;
	
	public function new(route:String, saveInStorage:Bool = false, multiple:Bool = true):Void {
		
		this.multiple = multiple;
		this.saveInStorage = saveInStorage;
		
		//Загружаем данные из localStorage
		if (saveInStorage) {
			var obj:Dynamic = Storage.getItem("rd_" + route);
			if (obj != null) data = obj;
		}
		
		this.route = route;
	}
	
	public function ask(id:String, handler:Dynamic->Void, forceUpdate:Bool = false):Void {
		
		if (forceUpdate) Reflect.deleteField(data, id);
		
		if (Reflect.field(data, id) == null && list.indexOf(id) == -1) {
			
			if (multiple) {
				list.push(id);
				Call.once(getRemote);
			}else {
				Server.ask(route, onOneResult, {id: id});
			}
		}
		
		requests.push(new RemoteCaller(id, handler));
		Call.once(doCalls);
		
	}
	
	function onOneResult(obj:Dynamic) {
		Reflect.setField(data, obj.id, obj);
		update();
	}
	
	public function doCalls():Void {
		requests = requests.filter(filterCalls);
	}
	
	function filterCalls(caller:RemoteCaller):Bool {
		
		var obj:Dynamic = Reflect.field(data, caller.id);
		
		if (obj == null) return true;
		
		caller.call(obj);
		
		return false;
	}
	
	public function getRemote():Void {
		Server.ask(route, onMultipleResult, {
			list: list.join(",")
		});
	}
	
	function onMultipleResult(list:Array<Dynamic>) {
		
		for (obj in list) {
			Reflect.setField(data, obj.id, obj);
		}
		
		update();
	}
	
	function update():Void {
		
		list = list.filter(filterList);
		
		//Сохраняем данные в localStorage
		if (saveInStorage) {
			Storage.setItem("rd_" + route, data);
		}
		
		Call.once(doCalls);
		
	}
	
	function filterList(id:String):Bool {
		return Reflect.field(data, id) == null;
	}
	
}

class RemoteCaller {
	
	public var handler:Dynamic -> Void;
	public var id:String;

	public function new(id:String, handler:Dynamic->Void):Void {
		this.handler = handler;
		this.id = id;
		
	}
	
	public function call(data:Dynamic):Void {
		Reflect.callMethod(null, handler, [data]);
	}
	
}
