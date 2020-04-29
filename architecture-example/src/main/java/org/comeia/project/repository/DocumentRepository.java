package org.comeia.project.repository;

import java.util.Optional;

import org.comeia.project.domain.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DocumentRepository extends JpaRepository<Document, Long>, JpaSpecificationExecutor<Document> {

	Optional<Document> findByIdAndDeletedIsFalse(long id);
}

