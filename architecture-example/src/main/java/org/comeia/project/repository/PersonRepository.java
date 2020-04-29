package org.comeia.project.repository;

import java.util.Optional;

import org.comeia.project.domain.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PersonRepository extends JpaRepository<Person, Long>, JpaSpecificationExecutor<Person> {

	Optional<Person> findByIdAndDeletedIsFalse(long id);
}

