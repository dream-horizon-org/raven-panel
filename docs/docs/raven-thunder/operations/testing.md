---
title: Testing
---

Run all tests:
```bash
mvn -DskipITs=false clean verify
```

Notes:
- Unit tests via Surefire
- Integration tests via Failsafe (`**/*IT.java`), require Docker for Testcontainers



