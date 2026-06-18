package com.org.calolicasc.config;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseMetricsConfig {

    public DatabaseMetricsConfig(MeterRegistry meterRegistry, JdbcTemplate jdbcTemplate) {
        Gauge.builder("futinder.database.up", () -> isDatabaseUp(jdbcTemplate))
            .description("Indica se o banco de dados respondeu a uma consulta simples.")
            .register(meterRegistry);
    }

    private static int isDatabaseUp(JdbcTemplate jdbcTemplate) {
        try {
            Integer result = jdbcTemplate.queryForObject("VALUES 1", Integer.class);
            return Integer.valueOf(1).equals(result) ? 1 : 0;
        } catch (RuntimeException ex) {
            return 0;
        }
    }
}
