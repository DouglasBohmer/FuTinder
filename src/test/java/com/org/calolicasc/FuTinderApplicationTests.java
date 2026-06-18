package com.org.calolicasc;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class FuTinderApplicationTests {

	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	void contextLoads() {
	}

	@Test
	void actuatorHealthIsAvailable() {
		ResponseEntity<String> response = restTemplate.getForEntity("/actuator/health", String.class);

		assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
		assertThat(response.getBody()).contains("\"status\":\"UP\"");
	}

	@Test
	void prometheusMetricsAreAvailable() {
		ResponseEntity<String> response = restTemplate.getForEntity("/actuator/prometheus", String.class);

		assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
		assertThat(response.getBody()).contains("jvm_memory_used_bytes", "futinder_database_up");
	}

}
