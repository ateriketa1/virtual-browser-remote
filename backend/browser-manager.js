const playwright = require('playwright');
const fs = require('fs').promises;
const path = require('path');

class BrowserManager {
  constructor() {
    this.sessions = new Map();
    this.browsers = new Map();
  }

  async createSession() {
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    try {
      const browser = await playwright.chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      });
      
      const page = await context.newPage();
      
      this.sessions.set(sessionId, {
        browser,
        context,
        page,
        createdAt: new Date()
      });
      
      this.browsers.set(sessionId, browser);
      
      // Navigate to blank page
      await page.goto('about:blank');
      
      console.log(`Session created: ${sessionId}`);
      return sessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  }

  async navigate(sessionId, url) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    try {
      // Add protocol if missing
      let fullUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = 'https://' + url;
      }

      await session.page.goto(fullUrl, { waitUntil: 'networkidle' });
      const screenshot = await session.page.screenshot({ encoding: 'base64' });
      
      return { success: true, screenshot, url: fullUrl };
    } catch (error) {
      console.error('Navigation error:', error);
      throw error;
    }
  }

  async click(sessionId, x, y) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    try {
      await session.page.click(`[data-x="${x}"][data-y="${y}"]`);
      // Fallback: click at coordinates
      await session.page.click({ x, y });
      await session.page.waitForLoadState('networkidle').catch(() => {});
      
      const screenshot = await session.page.screenshot({ encoding: 'base64' });
      return { success: true, screenshot };
    } catch (error) {
      console.error('Click error:', error);
      // Still return screenshot even if click fails
      const screenshot = await session.page.screenshot({ encoding: 'base64' });
      return { success: false, screenshot, error: error.message };
    }
  }

  async type(sessionId, text) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    try {
      await session.page.keyboard.type(text);
      await session.page.waitForLoadState('networkidle').catch(() => {});
      
      const screenshot = await session.page.screenshot({ encoding: 'base64' });
      return { success: true, screenshot };
    } catch (error) {
      console.error('Type error:', error);
      const screenshot = await session.page.screenshot({ encoding: 'base64' });
      return { success: false, screenshot, error: error.message };
    }
  }

  async scroll(sessionId, direction, amount) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    try {
      const scrollAmount = direction === 'down' ? amount : -amount;
      await session.page.evaluate((amount) => {
        window.scrollBy(0, amount);
      }, scrollAmount);
      
      const screenshot = await session.page.screenshot({ encoding: 'base64' });
      return { success: true, screenshot };
    } catch (error) {
      console.error('Scroll error:', error);
      throw error;
    }
  }

  async closeSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    try {
      await session.context.close();
      await session.browser.close();
      this.sessions.delete(sessionId);
      this.browsers.delete(sessionId);
      console.log(`Session closed: ${sessionId}`);
    } catch (error) {
      console.error('Error closing session:', error);
    }
  }
}

module.exports = { BrowserManager };
