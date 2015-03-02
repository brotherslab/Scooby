package scooby.ui;
import scooby.events.Event;
import scooby.ui.TreeNode;
import scooby.display.DisplayContainer;

/**
 * ...
 * @author rzer
 */
class TreeView extends DisplayContainer {
	
	public var level:Int = 0;
	public var nodes:Array<TreeNode> = new Array<TreeNode>();
	
	private var container:DisplayContainer;
	public var routePath:String;

	public function new(routePath:String) {
		
		this.routePath = routePath;
		super("TreeView");
		
		container = new DisplayContainer("TreeViewContainer");
		addChild(container);
	}
	
	public function home() {
		setLevel(0, true);
		addNode(0);
	}
	
	public function back():Void {
		if (level == 0) return;
		setLevel(level - 1);
	}
	
	public function loadNextLevel(nodeId:Int) {
		setLevel(level + 1);
		addNode(nodeId);
	}
	
	function addNode(nodeId:Int):TreeNode {
		var node:TreeNode = new TreeNode(nodeId, routePath);
		node.addEventListener("select", onSelect);
		container.addChild(node);
		nodes.push(node);
		return node;
	}
	
	private function onSelect(e:Event):Void {
		dispatchEvent(e);
	}
	
	function setLevel(level:Int, clearLast:Bool = false):Void {
		
		this.level = level;
		
		var l:Int = (clearLast) ? level : level + 1;
		
		while (nodes.length > l) {
			nodes.pop().destroy();
		}
		
		container.el.style.marginLeft = (-level * el.clientWidth) + "px";
	}
	
}