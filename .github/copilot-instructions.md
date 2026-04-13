# Webu-Portal Copilot Instructions

## Purpose

- Keep implementation decisions consistent while we introduce DDD incrementally.
- Prioritize safe refactoring that preserves existing API behavior.

## Architecture Reference

- Before implementation, always read `Docs/Architecture.md` together with this file.
- If there is any mismatch between this file and `Docs/Architecture.md`, follow `Docs/Architecture.md` and update this file in the same PR to restore consistency.

## Architecture Policy

- Adopt light DDD with layered architecture.
- Apply DDD strongly only to important use cases first.
- Current top priority use case: Alumni profile update flow (`updateAlumniProfile`).
- Preserve public API contracts during migration (GraphQL schema and DTO compatibility first).

## Layer Responsibilities

### Presentation Layer

- Location: `service/src/modules/**/presentation/*`
- Responsibilities:
  - Resolver definitions
  - Auth guard usage
  - Input/output mapping between transport and application types
- Must not contain:
  - Business rules
  - Domain normalization logic

### Application Layer

- Location: `service/src/modules/**/application/*`
- Responsibilities:
  - Use-case orchestration
  - Transaction boundaries
  - Exception mapping
  - Coordination across domain/infrastructure
- Must not contain:
  - Core domain rules (validation/normalization that represent business invariants)

### Domain Layer

- Location: `service/src/modules/**/domain/*`
- Responsibilities:
  - Entities
  - Value Objects
  - Domain services/policies
  - Business invariants and rule enforcement
- Rule:
  - String normalization, deduplication, and publish constraints must live here when they are business rules.

### Infrastructure Layer

- Location: `service/src/modules/**/infrastructure/*`
- Responsibilities:
  - Prisma persistence
  - External service integration (storage, etc.)
- Must not contain:
  - Business decisions
  - Rule ownership that belongs to domain

## Current Scope (Must Do)

- Introduce and use domain models for Alumni profile update:
  - Entity: `AlumniProfileDraft`
  - Value Objects: `CompanyNameCollection`, `EmailAddress`, `SkillList`
- Keep Application service thin for `updateAlumniProfile` by delegating normalization and invariants to domain.

## Out of Scope (For Now)

- Repository interface introduction (`domain/ports`)
- Domain event introduction
- Large redesign of Gmail linking / avatar update flows
- Large mapper split in repository layer

## Coding Rules

- Prefer one use case per PR for DDD migration.
- Avoid changing GraphQL contracts unless explicitly planned.
- Do not duplicate business validation across layers.
- If a rule appears in multiple places, move ownership to domain and call it from application.

## Testing Rules

- Add domain unit tests first for new Entity/VO invariants.
- Add application tests for use-case orchestration and exception mapping.
- Keep existing e2e coverage for API contract regression checks.

## Review Checklist

- Is the business rule implemented in domain, not application/presentation?
- Is application layer only orchestrating?
- Is infrastructure free from domain decisions?
- Is the public API contract preserved?
- Are domain tests added for new invariants?
