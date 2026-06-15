package com.org.calolicasc.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI fuTinderOpenApi() {
        return new OpenAPI()
            .info(new Info()
                .title("FuTinder API")
                .description("API REST para cadastro de usuarios, quadras e partidas esportivas.")
                .version("1.0.0")
                .contact(new Contact().name("Equipe FuTinder")));
    }
}
