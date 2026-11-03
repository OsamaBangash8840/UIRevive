# Core Engineering Principles & Best Practices Guide

> **Mandatory Standard:** Every line of code written, refactored, or reviewed in this repository MUST strictly adhere to and pass all rules in this document.

This document breaks down the foundational engineering standards required for building scalable, maintainable, and robust software systems.

---

## 1. Follow SOLID, KISS, and YAGNI Principles When Writing Logic

Software complexity compounds rapidly. Design principles provide guardrails against unmaintainable spaghetti code and premature abstraction.

### SOLID Principles (Object-Oriented Design)
Formulated by Robert C. Martin ("Uncle Bob"), these principles guide the design of modular, testable, and loosely-coupled components:

- **S — Single Responsibility Principle (SRP):**
  - *Definition:* A class or module should have one, and only one, reason to change.
  - *In Practice:* Separate data fetching, business validation, and UI presentation into distinct layers rather than bundling them into one monolithic function.

- **O — Open/Closed Principle (OCP):**
  - *Definition:* Software entities should be open for extension, but closed for modification.
  - *In Practice:* Implement behavior via interfaces, inheritance, or strategy patterns so new behavior can be introduced without modifying and risking existing, tested code paths.

- **L — Liskov Substitution Principle (LSP):**
  - *Definition:* Subtypes must be substitutable for their base types without altering the correctness of the program.
  - *In Practice:* If class `B` inherits from class `A`, replacing `A` with `B` must not throw unexpected exceptions or violate domain constraints.

- **I — Interface Segregation Principle (ISP):**
  - *Definition:* Clients should not be forced to depend on interfaces they do not use.
  - *In Practice:* Prefer many small, client-specific interfaces (e.g., `Reader`, `Writer`) over one massive "fat" interface (`StorageEngine`).

- **D — Dependency Inversion Principle (DIP):**
  - *Definition:* High-level modules should depend on abstractions, not on low-level concrete implementations.
  - *In Practice:* Inject database or service dependencies via interfaces instead of instantiating concrete database connections directly inside business logic.

### KISS (Keep It Simple, Stupid)
- *Origin:* Coined by aircraft engineer Kelly Johnson at Lockheed Skunk Works.
- *In Practice:* Avoid convoluted algorithmic tricks, excessive indirection, and esoteric language features. The most maintainable code is boring, readable, and immediately understandable by another engineer.

### YAGNI (You Aren't Gonna Need It)
- *Origin:* Extreme Programming (XP).
- *In Practice:* Build for current, concrete requirements rather than hypothetical future scenarios. Speculative code introduces bugs, demands test maintenance, and is often superseded by real-world requirements before ever being executed.

---

## 2. Confirm Findings and Operate on Facts Rather than One-Off Sources

Trial-and-error development and blindly copying answers from forums or search snippets leads to unstable applications, edge-case failures, and security regressions.

### Guidelines
- **Rely on Primary Documentation:** Consult official API documentation, language specifications, or open-source library source code before adopting a pattern or configuration.
- **Empirical Diagnostics:** Before applying a fix, reproduce the bug using tests, structured logs, or profiling metrics. Avoid guessing the root cause.
- **Cross-Verify Solutions:** If consulting third-party discussions or blog posts, verify version compatibility and test the solution across supported environments (OS, runtime, browser versions).

---

## 3. Avoid Complicated CSS That Becomes Hard to Maintain

CSS operates in a global execution environment with cascading specificity rules. Over-nested styles and high-specificity selectors create brittle stylesheets where modifying one rule breaks unrelated UI components.

### Best Practices
- **Adopt Structured Methodologies:**
  - Use **BEM** (Block-Element-Modifier), scoped CSS modules, or utility-first frameworks (e.g., Tailwind CSS) to keep selectors flat and predictable.
- **Avoid High Specificity:**
  - Do not use `!important` as a workaround for poorly scoped styles.
  - Avoid deeply nested selectors (e.g., `div.content > ul.items > li span a`).
- **Use Modern Layout Engines:**
  - Standardize on **Flexbox** for one-dimensional layouts and **CSS Grid** for two-dimensional layouts. Avoid negative margin hacks or manual float positioning.
- **Leverage Design Tokens:**
  - Store colors, typography, breakpoints, and spacing units in CSS variables (custom properties) to maintain a single source of truth.

---

## 4. Document Portions of Logic with Multi-Line Comments

Clear comments preserve intent, explaining the business rationale, constraints, and non-obvious workarounds that code syntax cannot communicate alone.

### Commenting Standards
- **Explain "Why", Not "What":**
  - *Bad:* `// loop over users`
  - *Good:* Explaining why an array is sorted in reverse before executing a pagination slice.
- **Use Structured Multi-Line Blocks:**
  - For complex algorithms, regular expressions, or vendor API edge cases, write clear block comments (such as JSDoc, Docstrings, or standard block syntax):

```javascript
/**
 * Deduplicates transactions based on timestamp and signature hash.
 * 
 * Note: Upstream provider occasionally emits duplicate webhooks when 
 * acknowledgment latency exceeds 1500ms. We enforce a 5-minute sliding
 * window to guarantee idempotency.
 */
function deduplicateTransactions(transactions, windowMs = 300000) {
  // Logic implementation...
}
```

---

## 5. Act as a Senior Engineer: Read More, Write Less

A senior engineering mindset prioritizes understanding the system and delivering precise, minimal solutions over generating large volumes of code.

### The Mindset
- **Code is a Liability:** Every line added must be tested, reviewed, compiled, and maintained over time. The best solution is often the one that achieves the goal with the smallest, simplest footprint.
- **Invest in Discovery:** Spend the majority of time reading existing code paths, identifying reusable utilities, reviewing architecture boundaries, and clarifying requirements.
- **Surgical Execution:** Write targeted, idiomatic code that addresses the exact problem without introducing unwanted dependencies, unnecessary abstractions, or architectural bloat.

