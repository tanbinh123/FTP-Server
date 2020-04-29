package org.comeia.project.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StopWatch;

import liquibase.exception.LiquibaseException;
import liquibase.integration.spring.SpringLiquibase;

public class LiquibaseConfig extends SpringLiquibase
{
	private final Logger log = LoggerFactory.getLogger(LiquibaseConfig.class);

	public void afterPropertiesSet() throws LiquibaseException {
		this.log.debug("Starting Liquibase synchronously");
		initDb();
	}

	protected void initDb() throws LiquibaseException {
		StopWatch watch = new StopWatch();
		watch.start();
		super.afterPropertiesSet();
		watch.stop();
		this.log.debug("Started Liquibase in {} ms", Long.valueOf(watch.getTotalTimeMillis()));
	}
}
