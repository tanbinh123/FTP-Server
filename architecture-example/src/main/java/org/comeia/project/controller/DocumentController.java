package org.comeia.project.controller;

import static org.comeia.project.search.DocumentSpecification.listAllByCriteria;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.comeia.project.converter.DocumentConverter;
import org.comeia.project.domain.Document;
import org.comeia.project.dto.DocumentDTO;
import org.comeia.project.dto.DocumentFilterDTO;
import org.comeia.project.enumerator.DocumentType;
import org.comeia.project.locale.ErrorMessageKeys;
import org.comeia.project.repository.DocumentRepository;
import org.comeia.project.search.SearchCriteria;
import org.comeia.project.validator.DocumentValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping(value = "/api/v1/document")
@AllArgsConstructor
public class DocumentController extends ResourceController {

	private final DocumentRepository repository;
	private final DocumentConverter converter;
	private final DocumentValidator validator;
	
	@GetMapping
	public MappingJacksonValue listByCriteria(Pageable pageable,
			@RequestParam(required = false) String attributes,
			DocumentFilterDTO filter) {
		
		List<SearchCriteria> criterias = DocumentFilterDTO.buildCriteria(filter);
		Page<DocumentDTO> pages = this.repository.findAll(listAllByCriteria(criterias), pageable)
				.map(converter::from);
		return buildResponse(pages, attributes);
	}
	
	@GetMapping(path = "/types")
	public MappingJacksonValue types(@RequestParam(required = false) String attributes) {
		DocumentType[] types = DocumentType.values();
		return buildResponse(types, attributes);
	}
	
	@GetMapping(path = "{id}")
	public MappingJacksonValue getById(@PathVariable long id,
			@RequestParam(required = false) String attributes) {
		
		DocumentDTO dto = this.repository.findByIdAndDeletedIsFalse(id)
				.map(this.converter::from)
				.orElseThrow(() -> throwsException(ErrorMessageKeys.ERROR_DOCUMENT_NOT_FOUND_BY_ID, String.valueOf(id)));
		return buildResponse(dto, attributes);
	}
	
	@PostMapping
	public MappingJacksonValue create(@Validated @RequestBody DocumentDTO dto,
			@RequestParam(required = false) String attributes) {
		
		if(Objects.isNull(dto)) {
			throw new HttpMessageNotReadableException("Required request body is missing");
		}
		
		DocumentDTO documentDTO = Optional.of(dto)
				.map(this.converter::to)
				.map(this.repository::save)
				.map(this.converter::from)
				.orElseThrow(() -> throwsException("Error"));
		
		return buildResponse(documentDTO, attributes);
	}
	
	@PutMapping(path = "{id}")
	public MappingJacksonValue update(@PathVariable long id,
			@Validated @RequestBody DocumentDTO dto,
			@RequestParam(required = false) String attributes) {
		
		if(Objects.isNull(dto)) {
			throw new HttpMessageNotReadableException("Required request body is missing");
		}
		
		DocumentDTO documentDTO = this.repository.findByIdAndDeletedIsFalse(id)
				.map(document -> this.converter.to(dto, document))
				.map(this.repository::save)
				.map(this.converter::from)
				.orElseThrow(() -> throwsException(String.valueOf(id)));
		
		return buildResponse(documentDTO, attributes);
	}
	
	@DeleteMapping(path = "{id}")
    public MappingJacksonValue delete(@PathVariable long id,
            @RequestParam(required = false) String attributes) {

        DocumentDTO dto = this.repository.findByIdAndDeletedIsFalse(id)
                .map(this.converter::from)
                .orElseThrow(() -> throwsException(ErrorMessageKeys.ERROR_DOCUMENT_NOT_FOUND_BY_ID, String.valueOf(id)));

        Document doc = this.converter.to(dto);
        doc.setDeleted(true);
        doc.setId(dto.getId());
        this.repository.save(doc);
        return buildResponse(doc, attributes);
    }
}
