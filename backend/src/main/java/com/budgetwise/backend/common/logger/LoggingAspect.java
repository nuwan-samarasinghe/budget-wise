package com.budgetwise.backend.common.logger;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceUnitUtil;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class LoggingAspect {

	@PersistenceContext
	private EntityManager entityManager;

	@Around("execution(* *(..)) && (" + "@within(org.springframework.stereotype.Service) || "
			+ "@within(org.springframework.web.bind.annotation.RestController))")
	public Object logMethodDetails(ProceedingJoinPoint joinPoint) throws Throwable {
		MethodSignature signature = (MethodSignature) joinPoint.getSignature();

		String className = signature.getDeclaringTypeName();
		String methodName = signature.getName();
		Object[] args = joinPoint.getArgs();
		String[] parameterNames = signature.getParameterNames();

		StringBuilder logMsg = new StringBuilder();
		logMsg.append("→ ").append(className).append(".").append(methodName).append("(");

		for (int i = 0; i < args.length; i++) {
			logMsg.append(parameterNames[i]).append("=");

			if (parameterNames[i].toLowerCase().contains("password")) {
				logMsg.append("****");
			} else {
				logMsg.append(summarizeArgument(args[i]));
			}

			if (i < args.length - 1) {
				logMsg.append(", ");
			}
		}

		logMsg.append(")");

		Object result = joinPoint.proceed();

		logMsg.append(" → Returned: ").append(summarizeArgument(result));

		log.info(logMsg.toString());

		return result;
	}

	private String summarizeArgument(Object obj) {
		if (obj == null)
			return "null";

		try {
			PersistenceUnitUtil util = entityManager.getEntityManagerFactory().getPersistenceUnitUtil();
			if (!util.isLoaded(obj)) {
				return obj.getClass().getSimpleName() + " (uninitialized)";
			}
		} catch (Exception e) {
			// Ignore errors for non-entities
		}

		try {
			if (isJPAEntity(obj)) {
				Object id = entityManager.getEntityManagerFactory().getPersistenceUnitUtil().getIdentifier(obj);
				return obj.getClass().getSimpleName() + "[id=" + id + "]";
			}
		} catch (Exception e) {
			// Ignore
		}

		String str = obj.toString();
		return str.length() > 100 ? str.substring(0, 100) + "..." : str;
	}

	private boolean isJPAEntity(Object obj) {
		return obj != null && entityManager.getMetamodel().getEntities().stream()
				.anyMatch(e -> e.getJavaType().equals(obj.getClass()));
	}
}
