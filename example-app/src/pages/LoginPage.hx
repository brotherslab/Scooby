package pages;
import js.Lib;
import scooby.events.Event;
import scooby.common.Server;
import scooby.ui.Button;
import scooby.ui.Input;
import scooby.display.DisplayContainer;
import scooby.ui.Label;

/**
 * ...
 * @author 
 */
class LoginPage extends DisplayContainer {
	
	var email:Input;
	var password:Input;

	public function new() {
		super("LoginPage");
		
		var header:Label = new Label("Login", "Header");
		email = new Input("text");
		password = new Input("password");
		var submit:Button = new Button("Login!", "primary");
		
		addChilds([header, email, password, submit]);
		
		submit.addEventListener("click", onClick);
	}
	
	private function onClick(e:Event):Void {
		
		Server.ask("auth/login", onLoginResult, {
			email: email.text,
			password: password.text
		});
		
		Lib.alert("Auth email: " + email.text + ", password: " + password.text);
		
	}
	
	function onLoginResult(data:Dynamic) {
		trace(data);
	}
	
}