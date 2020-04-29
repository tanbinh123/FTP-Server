package org.comeia.project.exception;

import org.comeia.project.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;

public class AbstractMessage {
	
	@Autowired
	public MessageService messageService;
	
	public BusinessException throwsException(String key, String... args) {
		BusinessException ex = new BusinessException(buildMessage(key, args));
        throw ex;
    }
    
    public BusinessException throwsException(String message) {
    	BusinessException ex = new BusinessException(buildMessage(message, ""));
        throw ex;
    }
	
	private String buildMessage(String key, String... args) {
        String errorMessage = this.messageService.getMessage(key, args);
        return errorMessage;
    }
}
