# UiPath Orchestrator Process Dashboard

A modern, responsive web application for viewing and managing UiPath Orchestrator processes. Built with React, TypeScript, and the UiPath SDK, this dashboard provides a clean interface to monitor and interact with your automation processes.

[cloudflarebutton]

## Features

- **Process Listing**: View all Orchestrator processes with detailed information
- **Real-time Data**: Fetch live process data from UiPath Orchestrator
- **Folder Management**: Browse processes across different Orchestrator folders
- **Responsive Design**: Beautiful, mobile-first UI built with Tailwind CSS
- **Secure Authentication**: OAuth 2.0 PKCE flow integration with UiPath
- **Modern Stack**: React 18, TypeScript, Vite for fast development and builds

## Technology Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.8
- **Build Tool**: Vite 6.3.1
- **Styling**: Tailwind CSS 4.0
- **Routing**: React Router DOM 6.30.0
- **UiPath Integration**: @uipath/uipath-typescript SDK
- **Deployment**: Cloudflare Pages

## Prerequisites

- [Bun](https://bun.sh/) runtime installed
- UiPath Orchestrator account with appropriate permissions
- OAuth client credentials (pre-configured in `.env`)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
bun install
```

3. Verify environment configuration:
The `.env` file is pre-configured with UiPath OAuth settings. Ensure the following variables are set correctly:
```
VITE_UIPATH_BASE_URL=https://alpha.api.uipath.com
VITE_UIPATH_ORG_NAME=pricingtest
VITE_UIPATH_TENANT_NAME=DefaultTenant
VITE_UIPATH_CLIENT_ID=6794ae64-27a6-4933-b3e2-9aa807ddb5ab
VITE_UIPATH_SCOPE=OR.Administration.Read OR.Assets.Read OR.Execution.Read OR.Folders OR.Jobs OR.Queues.Read OR.Tasks PIMS Traces.Api DataFabric.Data.Read DataFabric.Data.Write DataFabric.Schema.Read ConversationalAgents
```

## Development

Start the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:3000`

### Development Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally
- `bun run lint` - Run ESLint

## Usage

1. **Sign In**: Click "Sign in with UiPath" to authenticate via OAuth
2. **Browse Processes**: Once authenticated, the dashboard will display all available Orchestrator processes
3. **Filter by Folder**: Select different folders to view processes in specific organizational units
4. **View Details**: Click on individual processes to see detailed information

## Project Structure

```
src/
├── hooks/
│   └── useAuth.tsx          # OAuth authentication hook
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles with Tailwind

.nucleus/plugin/             # UiPath SDK skill documentation
```

## Authentication Flow

The application uses OAuth 2.0 PKCE (Proof Key for Code Exchange) for secure authentication:

1. User clicks "Sign in with UiPath"
2. Redirected to UiPath OAuth authorization page
3. After approval, redirected back with authorization code
4. Code exchanged for access token automatically
5. Token stored securely in session storage
6. Automatic token refresh handled by SDK

## Building for Production

Create an optimized production build:
```bash
bun run build
```

The build output will be in the `dist/` directory, ready for deployment.

## Deployment

### Cloudflare Pages

This project is configured for deployment on Cloudflare Pages.

[cloudflarebutton]

#### Manual Deployment

1. Install Wrangler CLI:
```bash
bun add -g wrangler
```

2. Authenticate with Cloudflare:
```bash
wrangler login
```

3. Build the project:
```bash
bun run build
```

4. Deploy to Cloudflare Pages:
```bash
wrangler pages deploy dist
```

#### Configuration

The `wrangler.jsonc` file contains deployment configuration:
```jsonc
{
  "name": "orchestrator-process-xy40k32ar4cqzd3k1kmbo",
  "compatibility_date": "2025-01-01",
  "pages_build_output_dir": "dist"
}
```

## OAuth Scopes

The application requires the following UiPath OAuth scopes:
- `OR.Administration.Read` - Read administration data
- `OR.Assets.Read` - Read asset information
- `OR.Execution.Read` - Read execution data
- `OR.Folders` - Access folder information
- `OR.Jobs` - Manage jobs
- `OR.Queues.Read` - Read queue data
- `OR.Tasks` - Manage tasks
- `PIMS` - Process mining services
- `Traces.Api` - Tracing API access
- `DataFabric.Data.Read` - Read Data Fabric data
- `DataFabric.Data.Write` - Write Data Fabric data
- `DataFabric.Schema.Read` - Read Data Fabric schema
- `ConversationalAgents` - Conversational agent access

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Troubleshooting

### Authentication Issues

If you encounter "Authentication failed" errors:
1. Verify OAuth client ID in `.env` is correct
2. Ensure redirect URI matches your deployment URL
3. Check that required scopes are granted in UiPath Cloud

### Build Errors

If build fails:
1. Clear node_modules and reinstall: `rm -rf node_modules && bun install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Verify TypeScript version compatibility

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For issues related to:
- **UiPath SDK**: Refer to `.nucleus/plugin/skills/uipath-coded-apps/` documentation
- **Application bugs**: Open an issue in the repository
- **UiPath Orchestrator**: Contact UiPath support