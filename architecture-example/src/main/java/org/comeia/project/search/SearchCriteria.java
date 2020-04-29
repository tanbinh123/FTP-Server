package org.comeia.project.search;

import lombok.Data;

public @Data class SearchCriteria {

	private String key;
	private Object value;

	public SearchCriteria(String key, Object value) {
		this.key = key;
		this.value = value;
	}
}
