# Deployment simplificado

## Build unico

Execute a partir da raiz do projeto:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1
```

O script faz o fluxo completo:

1. Instala as dependencias do frontend com `npm.cmd ci`.
2. Roda `npm.cmd run build` dentro de `frontend`.
3. Gera o React em `src/main/resources/static`, que e servido pelo Spring.
4. Roda `mvnw.cmd clean package`.
5. Mostra o caminho do `.jar` final em `target`.

Para reutilizar `frontend/node_modules` local:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1 -SkipInstall
```

Para empacotar sem rodar testes:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1 -SkipTests
```

## Executar o pacote final

Depois do build:

```powershell
java -jar .\target\FuTinder-0.0.1-SNAPSHOT.jar
```

A aplicacao completa fica em:

```text
http://localhost:8080
```

## Portas do projeto

`5000`: servidor Vite em desenvolvimento. Use com `npm.cmd run dev` dentro de `frontend`. Ele proxy as chamadas `/api` para `8080`.

`8080`: Spring Boot. Serve API, Swagger, Actuator e tambem o frontend empacotado em `src/main/resources/static`.

`9090`: Prometheus via `docker compose up`, lendo metricas de `http://host.docker.internal:8080/actuator/prometheus`.

`3000`: Grafana via `docker compose up`, com usuario `admin` e senha `admin`.

## Observabilidade local

Com o backend rodando em `8080`, suba Prometheus e Grafana:

```powershell
docker compose up
```

URLs uteis:

```text
http://localhost:8080/swagger-ui.html
http://localhost:8080/actuator/health
http://localhost:8080/actuator/prometheus
http://localhost:9090
http://localhost:3000
```
