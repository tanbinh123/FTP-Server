package org.comeia.project.controller;

import java.util.HashSet;
import java.util.Set;

import org.comeia.project.exception.AbstractMessage;
import org.springframework.http.converter.json.MappingJacksonValue;

import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import com.google.common.base.CharMatcher;
import com.google.common.base.Splitter;
import com.google.common.base.Strings;
import com.google.common.collect.Sets;

public class ResourceController extends AbstractMessage {

	protected MappingJacksonValue buildResponse(Object resource, String attributes) {
		SimpleBeanPropertyFilter simpleBeanPropertyFilter = null;

		if (!Strings.isNullOrEmpty(attributes)) {
			Set<String> attributesSet = extractAttributes(attributes);
			simpleBeanPropertyFilter = SimpleBeanPropertyFilter.filterOutAllExcept(attributesSet);
		} else {
			simpleBeanPropertyFilter = SimpleBeanPropertyFilter.serializeAll(); 
		}

		FilterProvider attributesFilterProvider = new SimpleFilterProvider()
				.addFilter("attributesFilter", simpleBeanPropertyFilter);

		MappingJacksonValue wrapper = new MappingJacksonValue(resource);
		wrapper.setFilters(attributesFilterProvider);
		return wrapper;
	}

	private Set<String> extractAttributes(String attributesParameter) {
		Set<String> result = new HashSet<String>();
		if (!Strings.isNullOrEmpty(attributesParameter)) {
			result = Sets.newHashSet(
					Splitter.on(CharMatcher.anyOf(".,"))
					.trimResults()
					.omitEmptyStrings()
					.split(attributesParameter));
		}
		return result;
	}


}
