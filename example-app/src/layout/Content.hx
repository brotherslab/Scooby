package layout;

import scooby.display.DisplayContainer;
import scooby.display.DisplayObject;

/**
 * ...
 * @author rzer
 */
class Content extends DisplayContainer {
	
	var page:DisplayContainer;

	public function new() {
		super("PageContent");
	}
	
	public function setPage(nextPage:DisplayContainer) {
		if (page != null) page.destroy();
		page = nextPage;
		addChild(page);
	}
	
}