const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');
const { BrowserManager } = require('./backend/browser-manager');
const { RepoManager } = require('./backend/repo-manager');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

// Initialize managers
const browserManager = new BrowserManager();
const repoManager = new RepoManager();

// REST API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.post('/api/browser/navigate', async (req, res) => {
  try {
    const { url, sessionId } = req.body;
    const result = await browserManager.navigate(sessionId, url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/repos/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const data = await repoManager.getRepository(owner, repo);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket Events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('create-session', async (data) => {
    try {
      const sessionId = await browserManager.createSession();
      socket.emit('session-created', { sessionId });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('navigate', async (data) => {
    try {
      const { sessionId, url } = data;
      const screenshot = await browserManager.navigate(sessionId, url);
      socket.emit('page-loaded', { screenshot });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('click', async (data) => {
    try {
      const { sessionId, x, y } = data;
      const screenshot = await browserManager.click(sessionId, x, y);
      socket.emit('page-updated', { screenshot });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('type', async (data) => {
    try {
      const { sessionId, text } = data;
      const screenshot = await browserManager.type(sessionId, text);
      socket.emit('page-updated', { screenshot });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
