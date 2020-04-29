package org.comeia.project.search;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.comeia.project.domain.Person;
import org.comeia.project.enumerator.PersonType;
import org.comeia.project.util.FilterUtil;
import org.springframework.data.jpa.domain.Specification;

public class PersonSpecification {

	public static Specification<Person> listAllByCriteria(List<SearchCriteria> criterias) {
		return (root, query, builder) -> {
			List<Predicate> predicates = addPredicates(criterias, root, builder);
			predicates.add(builder.equal(root.<Boolean> get("deleted"), false));
			return FilterUtil.andTogether(predicates, builder);
		};
	}
	
	private static List<Predicate> addPredicates(
			List<SearchCriteria> criterias, Root<Person> root,
			CriteriaBuilder builder) {
		
		List<Predicate> predicates = new ArrayList<>();
		for (SearchCriteria criteria : criterias) {
			addPredicate(root, builder, predicates, criteria);
		}
		return predicates;
	}
	
	private static void addPredicate(Root<Person> root, CriteriaBuilder builder, 
			List<Predicate> predicates, SearchCriteria criteria) {

		if ( criteria.getKey().equalsIgnoreCase("fullName") ) {
			predicates.add(builder.like(
					builder.lower(root.<String> get( criteria.getKey())), 
					criteria.getValue().toString().toLowerCase()));
			return;
		}
		
		if ( criteria.getKey().equalsIgnoreCase("type") ) {
			predicates.add(builder.equal(
					root.<PersonType> get("personType"), 
					PersonType.valueOf(criteria.getValue().toString())));
			return;
		}
	}
}
