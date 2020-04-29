package org.comeia.project.config;

import java.util.List;

import org.comeia.project.locale.WebCookieLocaleResolver;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;

import com.fasterxml.jackson.databind.util.StdDateFormat;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers)
	{
		PageableHandlerMethodArgumentResolver resolver = new PageableHandlerMethodArgumentResolver();
		resolver.setOneIndexedParameters(true);
		resolver.setFallbackPageable(PageRequest.of(0, 20));
		argumentResolvers.add(resolver);
	}

	@Bean(name = "localeResolver")
	public LocaleResolver localeResolver() {
		WebCookieLocaleResolver cookieLocaleResolver = new WebCookieLocaleResolver();
		cookieLocaleResolver.setCookieName("LANG_KEY");
		return cookieLocaleResolver;
	}

	@Bean
	public MessageSource messageSource() {
		ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
		messageSource.setBasenames("classpath:/i18n/messages", "classpath:/i18n/errors");
		messageSource.setDefaultEncoding("ISO-8859-1");
		messageSource.setCacheSeconds(Integer.valueOf(System.getProperty(
				"cache-seconds", "-1")));
		return messageSource;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
		localeChangeInterceptor.setParamName("language");
		registry.addInterceptor(localeChangeInterceptor);
	}
	
	@Bean
	public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
	    return new Jackson2ObjectMapperBuilderCustomizer() {
	        @Override
	        public void customize(Jackson2ObjectMapperBuilder builder) {
	            builder.dateFormat(new StdDateFormat());  
	        }           
	    };
	}
}
