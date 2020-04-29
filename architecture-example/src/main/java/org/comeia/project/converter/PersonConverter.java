package org.comeia.project.converter;

import static java.util.Optional.ofNullable;

import java.util.Objects;

import org.comeia.project.domain.Person;
import org.comeia.project.dto.PersonDTO;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class PersonConverter implements Converter<Person, PersonDTO> {

	@Override
	public PersonDTO from(Person entity) {
		
		if(Objects.isNull(entity)) {
			return null;
		}
		
		PersonDTO dto = new PersonDTO();
		
		ofNullable(entity.getId())
			.ifPresent(dto::setId);
		
		ofNullable(entity.getFullName())
			.ifPresent(dto::setFullName);
		
		ofNullable(entity.getPersonType())
			.ifPresent(dto::setPersonType);
		
		return dto;
	}
	
	@Override
	public Person to(PersonDTO dto, Person entity) {
		
		if(Objects.isNull(dto)) {
			return null;
		}

		if(Objects.isNull(entity)) {
			entity = new Person();
		}
		
		ofNullable(dto.getFullName())
			.ifPresent(entity::setFullName);
		
		ofNullable(dto.getPersonType())
			.ifPresent(entity::setPersonType);
		
		return entity;
	}
}
