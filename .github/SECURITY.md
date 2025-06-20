# Security

This document summarizes the key security controls and best practices for the DevVerse App (frontend + backend).

## 1. Transport Security
- **HTTPS only**  
  All traffic is encrypted with TLS.  
- **HSTS**  
  The backend API enforces HTTP Strict Transport Security to prevent downgrade attacks.

## 2. Authentication & Authorization
- **JWT-based auth**  
  Users authenticate via a JSON Web Token (JWT) issued by the backend.  
- **httpOnly cookies**  
  JWTs are stored in httpOnly cookies to mitigate XSS-based token theft.  
- **Route protection**  
  All API endpoints require a valid JWT and check user ownership.

## 3. CORS
- **Restricted origin**  
  Backend CORS policy only allows requests from the official frontend origin.  
- **Preflight checks**  
  `OPTIONS` requests are handled and validated before allowing any state-changing method.

## 4. Secrets & Config
- **Environment variables**  
  All secrets (database URLs, JWT signing keys, third-party API keys) are injected via environment variables—never checked into source control.  
- **.env exclusions**  
  The repository’s `.gitignore` excludes any local `.env` or secret files.

## 5. Dependency Management
- **Regular audits**  
  - Frontend: `npm audit` (or `yarn audit`) run on each CI build.  
  - Backend: `pip-audit` (or `safety`) scans Python dependencies for known vulnerabilities.  
- **Pinned versions**  
  `package.json` and `requirements.txt` use exact version pins to ensure reproducible installs.

---

> [!IMPORTANT]
> Please [contact me](mailto:hoangson091104@gmail.com) immediately if you notice any security issues or vulnerabilities.

