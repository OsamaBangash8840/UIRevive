---
description: Core Engineering Principles & Best Practices (SOLID, KISS, YAGNI, Fact-based verification, Clean CSS, Multi-line JSDoc comments, Senior Mindset)
---

# Core Engineering Principles & Best Practices Guide

> **Mandatory Standard:** Every line of code written, refactored, or reviewed in this repository MUST strictly adhere to and pass all rules in this document.

1. **Follow SOLID, KISS, and YAGNI Principles When Writing Logic:**
   - **SRP:** Separate data fetching, business validation, and UI presentation into distinct layers.
   - **OCP:** Implement extensible behavior via interfaces or strategy patterns (e.g., AI provider strategies) without modifying core tested logic.
   - **LSP & ISP:** Use small, focused TypeScript interfaces rather than bloated types.
   - **DIP:** High-level services depend on abstractions/interfaces, not concrete low-level implementations.
   - **KISS & YAGNI:** Keep logic simple, flat, and immediately readable. Do not build speculative features not currently required.

2. **Confirm Findings and Operate on Facts Rather than One-Off Sources:**
   - Verify framework and API behavior against official documentation and empirical build/type checks (`tsc --noEmit`, `npm run build`) before finalizing changes.

3. **Avoid Complicated CSS That Becomes Hard to Maintain:**
   - Use flat, utility-first Tailwind CSS classes and CSS custom properties (design tokens in `globals.css`).
   - Never use `!important`, deep selector nesting, or brittle margin/float hacks. Stick to Flexbox and CSS Grid.

4. **Document Portions of Logic with Multi-Line Comments:**
   - Every service function, hook, utility, and complex UI logic block must include a structured multi-line JSDoc block (`/** ... */`) explaining **why** the logic exists, its constraints, and edge-case handling.

5. **Act as a Senior Engineer: Read More, Write Less:**
   - Treat code as a liability. Inspect existing files thoroughly before writing, reuse shared atomic components, and write minimal, surgical, idiomatic code.

