package layout;
import scooby.display.DisplayContainer;
import scooby.ui.Label;


class Header extends DisplayContainer{

	public function new() {
		super("PageHeader");
		
		addChild(new Label("Sample scooby app", "LogoHeader"));
	}
	
}