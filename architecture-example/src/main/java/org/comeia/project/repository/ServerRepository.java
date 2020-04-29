package org.comeia.project.repository;

import java.util.Optional;

import org.comeia.project.domain.Server;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ServerRepository extends JpaRepository<Server, Long>, JpaSpecificationExecutor<Server> {

	Optional<Server> findByIdAndDeletedIsFalse(long id);
}

