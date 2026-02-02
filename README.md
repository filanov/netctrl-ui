# NetCtrl UI

A modern web-based user interface for managing network cluster configurations via the [netctrl-server](https://github.com/filanov/netctrl-server) backend.

## Features

- **Full CRUD Operations**: Create, read, update, and delete cluster configurations
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Type-Safe**: Full TypeScript support with Zod validation schemas
- **Dark Mode**: Automatic dark/light theme support
- **Real-time Validation**: Client-side form validation
- **API Integration**: Seamless integration with netctrl-server REST API

## Tech Stack

- **React 19** with TypeScript
- **Vite** - Lightning-fast build tool
- **TanStack Query** (React Query) - Server state management with caching
- **React Hook Form** - Performant form handling
- **Zod** - Runtime type validation
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Prerequisites

- Node.js 18+ and npm
- netctrl-server running on `http://localhost:8080` (or accessible via network)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The UI will be available at **http://localhost:3000**

The dev server proxies `/api/*` requests to `http://localhost:8080` by default. To change this, edit `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-server:8080',  // Change this
      changeOrigin: true,
    },
  },
}
```

### 3. Build for Production

```bash
npm run build
```

Production-ready files will be in the `dist/` directory.

### 4. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
netctrl-ui/
├── src/
│   ├── api/              # API client and endpoints
│   │   ├── client.ts     # Axios instance configuration
│   │   └── clusters.ts   # Cluster API functions
│   ├── components/       # Reusable UI components
│   │   └── Layout.tsx    # Main layout with navigation
│   ├── pages/            # Route pages
│   │   ├── ClusterList.tsx   # List all clusters
│   │   └── ClusterForm.tsx   # Create/edit cluster form
│   ├── types/            # TypeScript types and Zod schemas
│   │   └── cluster.ts    # Cluster type definitions
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## Cluster Schema

Based on the netctrl-server proto definition:

```typescript
{
  id: string              // Auto-generated
  name: string            // Required
  description: string     // Optional
  created_at: timestamp   // Auto-generated
  updated_at: timestamp   // Auto-generated
}
```

## API Endpoints

This UI interacts with the following netctrl-server endpoints:

- `GET /api/v1/clusters` - List all clusters
- `GET /api/v1/clusters/:id` - Get cluster by ID
- `POST /api/v1/clusters` - Create new cluster
- `PATCH /api/v1/clusters/:id` - Update cluster
- `DELETE /api/v1/clusters/:id` - Delete cluster

## Deployment Options

### Docker Deployment

Build and run with Docker:

```bash
# Build the Docker image
docker build -t netctrl-ui .

# Run the container
docker run -p 3000:80 netctrl-ui
```

Using Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Note**: Edit `nginx.conf` to configure the API proxy for production deployments.

### Static Hosting (Nginx, Caddy, etc.)

Build the project and serve the `dist` directory:

```bash
npm run build
```

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name netctrl.example.com;
    root /path/to/netctrl-ui/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to netctrl-server
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Embed in Go Binary

Use [embed](https://pkg.go.dev/embed) to serve the UI from your Go backend:

```go
//go:embed dist/*
var staticFiles embed.FS

func main() {
    // Serve static files
    http.Handle("/", http.FileServer(http.FS(staticFiles)))

    // API routes
    http.HandleFunc("/api/", apiHandler)
}
```

### Cloud Platforms

- **Vercel/Netlify**: Connect your Git repository for automatic deployments
- **AWS S3 + CloudFront**: Static hosting with CDN
- **Google Cloud Storage**: Static hosting
- **Azure Static Web Apps**: Integrated hosting solution

## Troubleshooting

### Cannot connect to backend

1. Verify netctrl-server is running:
   ```bash
   curl http://localhost:8080/api/v1/clusters
   ```

2. Check the proxy configuration in `vite.config.ts` (dev) or `nginx.conf` (production)

3. Check browser console for CORS errors

### Build errors

Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Empty list shows as error

This has been fixed - the UI now properly handles empty cluster lists.

## Environment Variables

For production deployments, configure the API endpoint via environment variables:

```typescript
// vite.config.ts
export default defineConfig({
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'http://localhost:8080'
    ),
  },
})

// src/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})
```

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project follows the same license as netctrl-server.
