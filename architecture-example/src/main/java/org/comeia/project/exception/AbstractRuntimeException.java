package org.comeia.project.exception;

import java.lang.reflect.Constructor;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

@SuppressWarnings("serial")
public class AbstractRuntimeException extends RuntimeException {
	
	private final Logger log = LoggerFactory.getLogger(AbstractRuntimeException.class);
	private MessageSource messageSource;
	private String key;
	private String[] args;

	public AbstractRuntimeException(MessageSource messageSource, Class<?> source, String key, String... args) {
		this.messageSource = messageSource;
		this.key = key;
		this.args = args;
		dispatcheException(source);
	}
	
	private void dispatcheException(Class<?> source) { 
		Object instance = buildException(source);
		throw (RuntimeException) instance;
	}
	
	private RuntimeException buildException(Class<?> source) {
		
		Object instance = null;
		try {
			System.out.println(source.getName());	
			@SuppressWarnings("rawtypes")
			Class clazz = Class.forName(source.getName());
			@SuppressWarnings("unchecked")
			Constructor<?> constructor = clazz.getConstructor(String.class);
			instance = constructor.newInstance(buildMessage(key, args));
		} catch (Exception e) {
			log.debug(e.getMessage());
		} 
		return (RuntimeException) instance;
	}
	
	private String buildMessage(String key, String... args) {
		Locale locale = LocaleContextHolder.getLocale();
		String errorMessage = messageSource.getMessage(key, args, locale);
		log.debug(errorMessage);
		return errorMessage;
	}

}
