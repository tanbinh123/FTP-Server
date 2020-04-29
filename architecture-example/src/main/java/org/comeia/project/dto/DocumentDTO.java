package org.comeia.project.dto;

import java.io.Serializable;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.comeia.project.enumerator.DocumentType;
import org.comeia.project.locale.MessagesMessageKeys;

import com.fasterxml.jackson.annotation.JsonFilter;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonFilter("attributesFilter")
@SuppressWarnings("serial")
@EqualsAndHashCode(callSuper=false)
public @Data class DocumentDTO implements Serializable {

	private Long id;
	
	@NotNull(message = MessagesMessageKeys.VALIDATE_DOCUMENT_DOCUMENTNAME_NOT_VALID)
	@Size(message = MessagesMessageKeys.VALIDATE_DOCUMENT_DOCUMENTNAME_NOT_LENGTH, min = 5, max = 60)
	private String documentName;
	
	@NotNull(message = MessagesMessageKeys.VALIDATE_DOCUMENT_TYPE_NOT_VALID)
	private DocumentType documentType;

}
