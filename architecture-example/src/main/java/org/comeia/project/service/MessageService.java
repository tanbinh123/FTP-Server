package org.comeia.project.service;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class MessageService {

	private final MessageSource messageSource;
	public static final String FAILURE = "failure";
	
	public String getMessage(String key, String... args) throws NoSuchMessageException {
		Locale locale = LocaleContextHolder.getLocale();
		String errorMessage = messageSource.getMessage(key, args, locale);
		return errorMessage;
	}
	
	public String getMessage(String key) throws NoSuchMessageException {
		return getMessage(key, "");
	}
	
	public HttpHeaders createHttpHeaderErrorMessage(String message) {
		HttpHeaders header = new HttpHeaders();
		header.add(getMessage(FAILURE), message);
		return header;
	}

	public HttpHeaders createHttpHeaderErrorMessage(String key, String... args) {
		return createHttpHeaderErrorMessage(getMessage(key, args));
	}
}
