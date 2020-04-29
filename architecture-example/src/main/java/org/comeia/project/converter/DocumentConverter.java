package org.comeia.project.converter;

import static java.util.Optional.ofNullable;

import java.util.Objects;

import org.comeia.project.domain.Document;
import org.comeia.project.dto.DocumentDTO;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class DocumentConverter implements Converter<Document, DocumentDTO> {

	@Override
	public DocumentDTO from(Document entity) {
		
		if(Objects.isNull(entity)) {
			return null;
		}
		
		DocumentDTO dto = new DocumentDTO();
		
		ofNullable(entity.getId())
			.ifPresent(dto::setId);
		
		ofNullable(entity.getDocumentName())
			.ifPresent(dto::setDocumentName);
		
		ofNullable(entity.getDocumentType())
			.ifPresent(dto::setDocumentType);
		
		return dto;
	}
	
	@Override
	public Document to(DocumentDTO dto, Document entity) {
		
		if(Objects.isNull(dto)) {
			return null;
		}

		if(Objects.isNull(entity)) {
			entity = new Document();
		}
		
		ofNullable(dto.getDocumentName())
			.ifPresent(entity::setDocumentName);
		
		ofNullable(dto.getDocumentType())
			.ifPresent(entity::setDocumentType);
		
		return entity;
	}
}
