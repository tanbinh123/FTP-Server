package org.comeia.project.controller;

import static org.comeia.project.search.ServerSpecification.listAllByCriteria;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.comeia.project.converter.ServerConverter;
import org.comeia.project.domain.Server;
import org.comeia.project.dto.ServerDTO;
import org.comeia.project.dto.ServerFilterDTO;
import org.comeia.project.enumerator.ServerType;
import org.comeia.project.locale.ErrorMessageKeys;
import org.comeia.project.repository.ServerRepository;
import org.comeia.project.search.SearchCriteria;
import org.comeia.project.validator.ServerValidator;
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
@RequestMapping(value = "/api/v1/server")
@AllArgsConstructor
public class ServerController extends ResourceController {

	private final ServerRepository repository;
	private final ServerConverter converter;
	private final ServerValidator validator;
	
	@GetMapping
	public MappingJacksonValue listByCriteria(Pageable pageable,
			@RequestParam(required = false) String attributes,
			ServerFilterDTO filter) {
		
		List<SearchCriteria> criterias = ServerFilterDTO.buildCriteria(filter);
		Page<ServerDTO> pages = this.repository.findAll(listAllByCriteria(criterias), pageable)
				.map(converter::from);
		return buildResponse(pages, attributes);
	}
	
	@GetMapping(path = "/types")
	public MappingJacksonValue types(@RequestParam(required = false) String attributes) {
		ServerType[] types = ServerType.values();
		return buildResponse(types, attributes);
	}
	
	@GetMapping(path = "{id}")
	public MappingJacksonValue getById(@PathVariable long id,
			@RequestParam(required = false) String attributes) {
		
		ServerDTO dto = this.repository.findByIdAndDeletedIsFalse(id)
				.map(this.converter::from)
				.orElseThrow(() -> throwsException(ErrorMessageKeys.ERROR_SERVER_NOT_FOUND_BY_ID, String.valueOf(id)));
		return buildResponse(dto, attributes);
	}
	
	@PostMapping
	public MappingJacksonValue create(@Validated @RequestBody ServerDTO dto,
			@RequestParam(required = false) String attributes) {
		
		if(Objects.isNull(dto)) {
			throw new HttpMessageNotReadableException("Required request body is missing");
		}
		
		ServerDTO serverDTO = Optional.of(dto)
				.map(this.converter::to)
				.map(this.repository::save)
				.map(this.converter::from)
				.orElseThrow(() -> throwsException("Error"));
		
		return buildResponse(serverDTO, attributes);
	}
	
	@PutMapping(path = "{id}")
	public MappingJacksonValue update(@PathVariable long id,
			@Validated @RequestBody ServerDTO dto,
			@RequestParam(required = false) String attributes) {
		
		if(Objects.isNull(dto)) {
			throw new HttpMessageNotReadableException("Required request body is missing");
		}
		
		ServerDTO serverDTO = this.repository.findByIdAndDeletedIsFalse(id)
				.map(server -> this.converter.to(dto, server))
				.map(this.repository::save)
				.map(this.converter::from)
				.orElseThrow(() -> throwsException(String.valueOf(id)));
		
		return buildResponse(serverDTO, attributes);
	}
	
	@DeleteMapping(path = "{id}")
    public MappingJacksonValue delete(@PathVariable long id,
            @RequestParam(required = false) String attributes) {

        ServerDTO dto = this.repository.findByIdAndDeletedIsFalse(id)
                .map(this.converter::from)
                .orElseThrow(() -> throwsException(ErrorMessageKeys.ERROR_SERVER_NOT_FOUND_BY_ID, String.valueOf(id)));

        Server doc = this.converter.to(dto);
        doc.setDeleted(true);
        doc.setId(dto.getId());
        this.repository.save(doc);
        return buildResponse(doc, attributes);
    }
}
