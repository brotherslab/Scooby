package scooby.common;
import haxe.Json;
import haxe.Resource;
import js.Boot;
import js.Browser;

/**
 * Перевод на разные языки, выбор наиболее подходящего
 * @author 
 */

class Translator {
	
	public static var isInitialized:Bool = false;
	public static var languages:Map<String, Dynamic> = new Map<String, Dynamic>();
	public static var currentLanguage:String = "";
	
	private static var leftToLoad:Int = 0;
	private static var handler:Void->Void;
	
	public static function addFile(path:String):Void {
		isInitialized = true;
		leftToLoad++;
		trace("prepare", path);
		Server.json(path, onLanguageLoaded);
	}
	
	private static function onLanguageLoaded(data:Dynamic):Void {
		trace("language loaded");
		addLanguage(data.lang, data);
		leftToLoad--;
		if (leftToLoad == 0  && handler != null) handler();
	}
	
	public static function addLanguage(language:String, data:Dynamic):Void {
		languages[language] = data;
		if (currentLanguage == "") currentLanguage = language;
	}
	
	public static function load(handler:Void->Void):Void {
		Translator.handler = handler;
	}
	
	public static function getPreferedLanguage(langCodes:Array<String>):String {

		var langStr = Browser.navigator.language.toLowerCase().substr(0,2);
		
		for (i in 0 ... langCodes.length) {
			
			var lang:String = langCodes[i];
			if (langStr.indexOf(lang) != -1) return lang;
		}
		
		return langCodes[0];         
	}
	
	public static function setLanguage(language:String):Void {
		currentLanguage = language;
	}
	
	
	public static function get(phrase:String, lang:String = ""):String {
		
		if (lang == "") lang = currentLanguage;
		
		var data:Dynamic = languages.get(lang);
		if (data == null || Reflect.getProperty(data, phrase) == null) return phrase;
		return Reflect.getProperty(data, phrase);
		
	}
}
