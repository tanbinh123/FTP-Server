package org.comeia.project.exception;

import java.util.ArrayList;
import java.util.List;

import org.comeia.project.dto.ErrorDTO;
import org.comeia.project.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.fasterxml.jackson.databind.exc.InvalidDefinitionException;

import lombok.AllArgsConstructor;

@ControllerAdvice
@AllArgsConstructor
public class GlobalExceptionHandlingControllerAdvice {

	private final MessageService messageService;

	@ResponseStatus(value=HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(Exception.class)
	@ResponseBody
	public ErrorDTO errorHandlerw(Exception ex) throws Exception {
		return ErrorDTO.builder()
				.code("500")
				.error(ex.toString())
				.build();
	}
	
	@ResponseStatus(value=HttpStatus.BAD_REQUEST)
	@ExceptionHandler(HttpMessageNotReadableException.class)
	@ResponseBody
	public ErrorDTO errorHandler(HttpMessageNotReadableException ex) throws Exception {
		String message = this.messageService.getMessage("error.system.http.message.not.readable");
		return ErrorDTO.builder()
				.code("400")
				.error(message)
				.build();
	}
	
	@ResponseStatus(value=HttpStatus.BAD_REQUEST)
	@ExceptionHandler(BusinessException.class)
	@ResponseBody
	public ErrorDTO errorHandler(BusinessException ex) throws Exception {
		return ErrorDTO.builder()
				.code("400")
				.error(ex.getMessage())
				.build();
	}
	
	@ExceptionHandler(NumberFormatException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public ErrorDTO numberFormatException(NumberFormatException ex) throws Exception {
		return ErrorDTO.builder()
				.code("400")
				.error(ex.getMessage())
				.build();
	}
	
	@ExceptionHandler(InvalidDefinitionException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public ErrorDTO invalidDefinitionException(InvalidDefinitionException ex) throws Exception {
		String message = this.messageService.getMessage("com.fasterxml.jackson.databind.exc.invalid_definition_exception", 
				ex.getPathReference() );
		return ErrorDTO.builder()
				.code("400")
				.error(message)
				.build();
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public ErrorDTO processValidationError(MethodArgumentNotValidException ex) {
		BindingResult result = ex.getBindingResult();
		FieldError fieldError = result.getFieldError();
		
		List<String> args = new ArrayList<String>();
		for (int i = fieldError.getArguments().length-1; i >= 1; i--) {
			Object arg = fieldError.getArguments()[i];
			args.add(arg.toString());
		} 
		
		String message = this.messageService.getMessage(fieldError.getDefaultMessage(), 
				args.toArray(new String[args.size()]));
		return ErrorDTO.builder()
				.code("400")
				.error(message)
				.build();
	}
}
