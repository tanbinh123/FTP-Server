package org.comeia.project.config;

import javax.sql.DataSource;
import liquibase.integration.spring.SpringLiquibase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages={"org.comeia.project.repository"})
@EnableJpaAuditing(auditorAwareRef="springSecurityAuditorAware")
@EnableTransactionManagement
public class DatabaseConfig
{
	private final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

	@Bean
	public SpringLiquibase liquibase(DataSource dataSource, LiquibaseProperties liquibaseProperties)
	{
		SpringLiquibase liquibase = new LiquibaseConfig();
		liquibase.setDataSource(dataSource);
		liquibase.setChangeLog("classpath:config/liquibase/master.xml");
		liquibase.setContexts(liquibaseProperties.getContexts());
		liquibase.setDefaultSchema(liquibaseProperties.getDefaultSchema());
		liquibase.setDropFirst(liquibaseProperties.isDropFirst());
		liquibase.setShouldRun(liquibaseProperties.isEnabled());
		
		log.debug("Configuring Liquibase");
		
		return liquibase;
	}
}
