package scooby.display;
import js.Browser;
import js.html.Element;
import scooby.common.Call;

/**
 * Реализация слоёного пирога
 * @author rzer
 */

class DisplayContainer extends DisplayObject {
	

	public var childs:Array<DisplayObject> = new Array<DisplayObject>();
	

	public function addChild(display:DisplayObject):Void {
		
		if (display == null) return;

		el.appendChild(display.el);
		
		if (childs.indexOf(display) != -1) return;
		childs.push(display);
		display.setParent(this);
	}
	
	public function addChildAt(display:DisplayObject, index:Int):Void {
		
		if (display == null) return;
		
		el.insertBefore(display.el, el.children[index]);
		
		if (childs.indexOf(display) != -1) return;
		
		childs.push(display);
		display.setParent(this);
	}
	
	public function addChilds(extra:Array<DisplayObject>):Void {
		
		var child:DisplayObject;
		for (child in extra) addChild(child);
	}
	
	public function removeChild(display:DisplayObject):Void {
		if (childs.indexOf(display) == -1) return;
		
		el.removeChild(display.el);
		display.setParent(null);
	}
	
	public function childRemoved(display:DisplayObject):Void {
		var anIndex:Int = childs.indexOf(display);
		if (anIndex == -1) return;
		childs.splice(anIndex, 1);
	}
	
	public function setView(view:Element):Void {
		
		
		view.appendChild(el);
		stage = this;
	}
	
	
	public function destroyAllChilds():Void {
		
		var list:Array<DisplayObject> = childs.copy();
		
		while (list.length > 0) {
			var child:DisplayObject = list.pop();
			child.destroy();
		}
	}
	
	
	override public function destroy():Void {
		destroyAllChilds();
		super.destroy();
	}
	
}