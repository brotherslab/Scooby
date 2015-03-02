package scooby.ui;

import js.html.File;
import js.Lib;
import scooby.events.Event;
import js.html.FileList;
import scooby.display.DisplayContainer;
import js.html.FileReader;



class FileUploader extends DisplayContainer {
	
	var input:Input;
	var source:String;

	public function new() {
		
		super("FileUploader", "form");
		
		input = new Input("file");
		input.setAttribute("name", "image");
		addChild(input);
		
		input.addEventListener("change", onChange);
	}
	
	public function onlyImages() {
		input.setAttribute("accept", "image/x-png, image/gif, image/jpeg");
	}
	
	
	private function onChange(e:Event):Void {
		
		var files = input.getFiles();
		var file = files[0];
		
		dispatch("select", file);
			
		var reader:FileReader = new FileReader();
			
		reader.onloadend = function(e) {
			showUploadedItem(e.target.result);
		}
			
		reader.readAsDataURL(file);

		
	}
	
	function showUploadedItem(source) {
		this.source = source;
		dispatch("preview", source);
		
	}
	
}