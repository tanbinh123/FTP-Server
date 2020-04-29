package org.comeia.project.enumerator;

import java.util.HashMap;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonValue;

@JsonFilter("attributeFilter")
public enum PersonType {

	Physical("Física"), 
	Legal("Jurídica");

	public final String displayName;

	private PersonType(String displayName) {
		this.displayName = displayName;
	}
	
	@JsonCreator
    public static PersonType forValue(String value) {
        return PersonType.valueOf(value);
    }
	
	@JsonValue
	public HashMap<String, String> jsonValue() {
		HashMap<String, String> map = new HashMap<>();
		map.put("name", this.name());
		map.put("displayName", this.displayName);
		return map;
	}
}
