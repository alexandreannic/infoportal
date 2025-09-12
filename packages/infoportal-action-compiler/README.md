# InfoPortal – Safe execution of user-provided mappers

Architecture: parent orchestrator (server) + isolated worker
Sandbox engine: vm2 (inside a separate Node.js process) + hard limits
Note: Always deploy worker inside a container with no network for defense-in-depth

### SECURITY CHECKLIST

- Never expose DB or secrets to the worker. Parent fetches rows and writes results.
- Always run the worker in a separate OS process. Prefer a container (no network, read-only FS, low CPU/mem cgroups).
- Enforce timeouts, memory caps, and per-item timeouts. Kill on breach.
- Accept only a *function body*, wrap it yourself. No dynamic require/import.
- Deep-clone inputs/outputs to avoid object capability leakage.
- Log code, job owner, resource usage; add quotas and concurrency limits per tenant.
- Consider code review / allowlist libraries only if you ever expose helpers.
- Keep vm2 updated or swap to a JS engine in a microVM (e.g., gVisor/Firecracker) for stronger isolation.
- Optionally add static analysis (AST parse) to disallow constructs (e.g., new Function, Proxy abuse).
- ) For maximal isolation, move to WASM or QuickJS inside a microVM; keep the same parent/child protocol.
