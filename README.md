# Virtual Browser Remote - Virtual Desktop Environment

A full-featured remote virtual desktop where you can browse any website, access GitHub repositories, and work seamlessly in a browser-based environment.

## Features

✅ **Remote Browser Engine** - Playwright-powered headless browser
✅ **Desktop-like Interface** - Complete virtual desktop experience
✅ **Website Browsing** - Browse any website seamlessly
✅ **GitHub Integration** - Browse and view repositories directly
✅ **Multi-tab Support** - Work with multiple tabs/windows
✅ **File Viewer** - View code and files from repositories
✅ **Real-time Updates** - WebSocket-powered instant updates
✅ **Session Management** - Save and restore sessions

## Tech Stack

### Backend
- Node.js + Express
- Playwright (headless browser engine)
- Socket.io (real-time communication)
- GitHub API

### Frontend
- React + Vite
- TailwindCSS
- WebSocket client

## Installation

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..

# Create .env file
cp .env.example .env
```

## Development

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

Server runs on `http://localhost:5000`
Client runs on `http://localhost:3000`

## Production Build

```bash
npm run build
npm start
```

## Usage

1. Open the application in your browser
2. Click "Create Desktop" to start a new session
3. Use the address bar to navigate to any website
4. Use the repository panel to search and view GitHub repos
5. Click and type to interact with websites

## API Endpoints

### Browser
- `POST /api/browser/navigate` - Navigate to URL
- `POST /api/browser/click` - Click element
- `POST /api/browser/type` - Type text

### Repositories
- `GET /api/repos/:owner/:repo` - Get repository info
- `GET /api/repos/:owner/:repo/tree` - Get file tree
- `GET /api/repos/:owner/:repo/file` - Get file content

## WebSocket Events

### Client -> Server
- `create-session` - Create new browser session
- `navigate` - Navigate to URL
- `click` - Click at coordinates
- `type` - Type text
- `scroll` - Scroll page

### Server -> Client
- `session-created` - Session created
- `page-loaded` - Page loaded with screenshot
- `page-updated` - Page updated
- `error` - Error occurred

## Environment Variables

```
PORT=5000
CLIENT_URL=http://localhost:3000
GITHUB_TOKEN=your_github_personal_access_token
PLAYWRIGHT_BROWSERS_PATH=/tmp/pw-browsers
```

## License

MIT

## Roadmap

- [ ] Multi-tab support
- [ ] Session persistence
- [ ] Screenshot history
- [ ] Code editor integration
- [ ] Terminal access
- [ ] File upload/download
- [ ] Dark mode
- [ ] Custom keyboard shortcuts
- [ ] Performance optimization
- [ ] Docker deployment
