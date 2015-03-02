package scooby.ui;
import scooby.events.Event;
import scooby.common.Server;
import scooby.display.DisplayContainer;
import scooby.display.DisplayObject;

/**
 * ...
 * @author rzer
 */
class TreeNode extends DisplayContainer {
	
	public var routePath:String;
	public var nodeId:Int;
	
	private var list:Array<Dynamic> = new Array<Dynamic>();

	public function new(nodeId:Int, routePath:String) {
		
		super("TreeNode");
		
		this.routePath = routePath;
		this.nodeId = nodeId;
		
		trace("ask", routePath, nodeId);
		Server.ask(routePath, onLoaded, {
			id: nodeId
		});
	}
	
	function onLoaded(list:Array<Dynamic>):Void {
		
		this.list = list;
		
		for (i in 0 ... list.length) {
			
			var data:Dynamic = list[i];
			var btn:Button = new Button(data.title);
			btn.addEventListener("click", onClick);
			btn.name = cast i;
			addChild(btn);
		}
	}
	
	private function onClick(e:Event):Void {
		var btn:Button = cast e.target;
		dispatch("select", list[cast btn.name]);
	}
	
}