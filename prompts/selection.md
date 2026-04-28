Use this template when the user wants to build a web application that integrates with UiPath services using the official UiPath TypeScript SDK (`@uipath/uipath-typescript`).

Use when:
- Building dashboards for UiPath Orchestrator (processes, tasks, queues, assets)
- Automation monitoring and management applications
- Action Center task management interfaces (HITL workflows)
- Maestro process orchestration viewers with BPMN diagrams
- Data Fabric entity explorers and record editors
- Any app reading from or writing to UiPath Orchestrator, Action Center, Maestro, or Data Fabric

Built with:
- React 18, TypeScript, Vite, Tailwind CSS
- Cloudflare Pages for static site hosting
- UiPath TypeScript SDK with PKCE OAuth authentication (useAuth hook)
- Bundled `uipath-coded-apps` skill (loaded by the Claude Agent SDK) providing SDK reference, OAuth scope mapping, and UI patterns for polling, BPMN rendering, and HITL task embedding
