package org.comeia.project.enumerator;

import java.util.HashMap;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonValue;

@JsonFilter("attributeFilter")
public enum ServerType {

	AWS("Amazon Server"), 
	Oracle("Oracle Server");

	public final String displayName;

	private ServerType(String displayName) {
		this.displayName = displayName;
	}
	
	@JsonCreator
    public static ServerType forValue(String value) {
        return ServerType.valueOf(value);
    }
	
	@JsonValue
	public HashMap<String, String> jsonValue() {
		HashMap<String, String> map = new HashMap<>();
		map.put("name", this.name());
		map.put("displayName", this.displayName);
		return map;
	}
}
