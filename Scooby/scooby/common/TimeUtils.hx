package scooby.common;


class TimeUtils{

	public static function getAge(dateString:String):Int {
		
		var today:Date = Date.now();
		var birthDate = Date.fromString(dateString);
		
		var age = today.getFullYear() - birthDate.getFullYear();
		
		var m = today.getMonth() - birthDate.getMonth();
		
		if (m < 0 || (m == 0 && today.getDate() < birthDate.getDate())){
			age--;
		}
		
		return age;
	}
	
}