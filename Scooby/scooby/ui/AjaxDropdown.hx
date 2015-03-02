package scooby.ui;


import scooby.common.Call;
import scooby.common.Server;
import scooby.events.Event;
import scooby.display.DisplayContainer;
import scooby.display.DisplayObject;
import scooby.ui.Input;

/**
 * ...
 * @author 
 */
class AjaxDropdown extends DisplayContainer {
	
	private var input:Input;
	private var route:String;
	private var labelField:String;
	
	public var data:Dynamic;
	
	public var text(get, set):String;
	
	private var container:DisplayContainer;
	private var items:Array<AjaxDropDownItem> = new Array<AjaxDropDownItem>();

	public function new(route:String, labelField:String = "label") {
		
		super("AjaxDropdown");
		
		this.labelField = labelField;
		this.route = route;
		
		input = new Input();
		input.addEventListener("keyup", onKeyUp);
		
		addChild(input);
		
		container = new DisplayContainer("AjaxDropdownContainer");
		container.visible = false;
		addChild(container);
	}
	
	public function set_text(value:String):String {
		return input.text = value;
	}
	
	public function get_text():String {
		return input.text;
	}
	
	private function onKeyUp(e:Event):Void {
		
		data = null;
		dispatch("change");
		
		Call.forget(loadAjax);
		Call.once(loadAjax, 300);
		
	}
	
	function loadAjax():Void {
		
		var data:Dynamic = { };
		Reflect.setField(data, labelField, input.text);
		Server.ask(route, onChangeResult, data);
	}
	
	function clearItems():Void {
		
		while (items.length > 0) items.pop().destroy();
		container.visible = false;
	}
	
	function onChangeResult(list:Array<Dynamic>) {
		
		clearItems();
		
		if (input.text.length < 2) return;
			
		for (i in 0 ... list.length) {
			var data:Dynamic = list[i];
			var item:AjaxDropDownItem = new AjaxDropDownItem(data, labelField, input.text);
			item.addEventListener("click", onItemSelect);
			container.addChild(item);
			items.push(item);
			
		}
		
		if (list.length > 0) container.visible = true;
	}
	
	private function onItemSelect(e:Event):Void {
		
		var item:AjaxDropDownItem = cast(e.target, AjaxDropDownItem);
		data = item.data;
		
		input.text = Reflect.field(data, labelField);
		
		clearItems();
		dispatch("select", data);
	}
	
}


class AjaxDropDownItem extends Button {
	
	public var data:Dynamic;
	
	
	public function new(data:Dynamic, labelField:String, needle:String):Void {
		
		super("AjaxDropDownItem");
		this.data = data;
		
		var str:String = Reflect.field(data, labelField);
		var start:Int = str.toLowerCase().indexOf(needle.toLowerCase());
		var end:Int = start + needle.length;
		
		if (start != -1) {
			str = str.substring(0, start) + "<strong>" + str.substring(start, end) + "</strong>" + str.substring(end);
		}
		
		text = str;
	}
}