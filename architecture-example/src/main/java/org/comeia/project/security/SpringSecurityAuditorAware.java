package org.comeia.project.security;

import java.util.Optional;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

@Component
public class SpringSecurityAuditorAware implements AuditorAware<String>
{
	public static final String SYSTEM_ACCOUNT = "system";

	public Optional<String> getCurrentAuditor()
	{
		String userName = SecurityUtils.getCurrentLogin();
		return Optional.of(userName != null ? userName : "system");
	}
}
