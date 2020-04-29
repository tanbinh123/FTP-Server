package org.comeia.project.security;

import java.util.Objects;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public final class SecurityUtils
{
	public static String getCurrentLogin()
	{
		SecurityContext securityContext = SecurityContextHolder.getContext();
		Authentication authentication = securityContext.getAuthentication();
		
		if(Objects.isNull(authentication)) {
			return null;
		}
		
		String userName = null;
		if ((authentication.getPrincipal() instanceof UserDetails)) {
			UserDetails springSecurityUser = (UserDetails) authentication.getPrincipal();
			userName = springSecurityUser.getUsername();
		} else if ((authentication.getPrincipal() instanceof String))  {
			userName = (String) authentication.getPrincipal();
		}
		
		return userName;
	}
}