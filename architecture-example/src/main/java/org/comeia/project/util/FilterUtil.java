package org.comeia.project.util;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;

public class FilterUtil {

	public static Predicate andTogether(List<Predicate> predicates, CriteriaBuilder builder) {
		return builder.and(predicates.toArray(new Predicate[0]));
	}
}
