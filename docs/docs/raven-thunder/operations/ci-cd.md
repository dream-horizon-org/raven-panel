---
title: CI/CD
---

CI runs on PRs and `main`:
- Java 17, Maven `clean verify`
- Publishes unit test results to PRs
- Code scanning via CodeQL (compile‑only)
- Code formatting check (Spotless)
- Code style check (Checkstyle)



