package org.comeia.project.controller;

import static org.comeia.project.search.PersonSpecification.listAllByCriteria;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.comeia.project.converter.PersonConverter;
import org.comeia.project.domain.Person;
import org.comeia.project.dto.PersonDTO;
import org.comeia.project.dto.PersonFilterDTO;
import org.comeia.project.enumerator.PersonType;
import org.comeia.project.locale.ErrorMessageKeys;
import org.comeia.project.repository.PersonRepository;
import org.comeia.project.search.SearchCriteria;
import org.comeia.project.validator.PersonValidator;
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
@RequestMapping(value = "/api/v1/person")
@AllArgsConstructor
public class PersonController extends ResourceController {

	private final PersonRepository repository;
	private final PersonConverter converter;
	private final PersonValidator validator;
	
	@GetMapping
	public MappingJacksonValue listByCriteria(Pageable pageable,
			@RequestParam(required = false) String attributes,
			PersonFilterDTO filter) {
		
		List<SearchCriteria> criterias = PersonFilterDTO.buildCriteria(filter);
		Page<PersonDTO> pages = this.repository.findAll(listAllByCriteria(criterias), pageable)
				.map(converter::from);
		return buildResponse(pages, attributes);
	}
	
	@GetMapping(path = "/types")
	public MappingJacksonValue types(@RequestParam(required = false) String attributes) {
		PersonType[] types = PersonType.values();
		return buildResponse(types, attributes);
	}
	
	@GetMapping(path = "{id}")
	public MappingJacksonValue getById(@PathVariable long id,
			@RequestParam(required = false) String attributes) {
		
		PersonDTO dto = this.repository.findByIdAndDeletedIsFalse(id)
				.map(this.converter::from)
				.orElseThrow(() -> throwsException(ErrorMessageKeys.ERROR_PERSON_NOT_FOUND_BY_ID, String.valueOf(id)));
		return buildResponse(dto, attributes);
	}
	
	@PostMapping
	public MappingJacksonValue create(@Validated @RequestBody PersonDTO dto,
			@RequestParam(required = false) String attributes) {
		
		if(Objects.isNull(dto)) {
			throw new HttpMessageNotReadableException("Required request body is missing");
		}
		
		PersonDTO personDTO = Optional.of(dto)
				.map(this.converter::to)
				.map(this.repository::save)
				.map(this.converter::from)
				.orElseThrow(() -> throwsException("Error"));
		
		return buildResponse(personDTO, attributes);
	}
	
	@PutMapping(path = "{id}")
	public MappingJacksonValue update(@PathVariable long id,
			@Validated @RequestBody PersonDTO dto,
			@RequestParam(required = false) String attributes) {
		
		if(Objects.isNull(dto)) {
			throw new HttpMessageNotReadableException("Required request body is missing");
		}
		
		PersonDTO personDTO = this.repository.findByIdAndDeletedIsFalse(id)
				.map(person -> this.converter.to(dto, person))
				.map(this.repository::save)
				.map(this.converter::from)
				.orElseThrow(() -> throwsException(String.valueOf(id)));
		
		return buildResponse(personDTO, attributes);
	}
	
	@DeleteMapping(path = "{id}")
    public MappingJacksonValue delete(@PathVariable long id,
            @RequestParam(required = false) String attributes) {

        PersonDTO dto = this.repository.findByIdAndDeletedIsFalse(id)
                .map(this.converter::from)
                .orElseThrow(() -> throwsException(ErrorMessageKeys.ERROR_SERVER_NOT_FOUND_BY_ID, String.valueOf(id)));

        Person doc = this.converter.to(dto);
        doc.setDeleted(true);
        doc.setId(dto.getId());
        this.repository.save(doc);
        return buildResponse(doc, attributes);
    }
}
