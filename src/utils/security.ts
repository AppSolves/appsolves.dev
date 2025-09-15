// Security utilities for client-side protection

export class SecurityManager {
  private static instance: SecurityManager;
  private botUserAgents = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python-requests',
    'scrapy', 'selenium', 'headless', 'phantom', 'automated', 'googlebot',
    'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot'
  ];

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // Basic bot detection (easily bypassed but deters simple scrapers)
  detectBot(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return this.botUserAgents.some(bot => userAgent.includes(bot));
  }

  // Disable right-click context menu (easily bypassed)
  disableRightClick(): void {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  // Disable text selection (easily bypassed)
  disableTextSelection(): void {
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
    });
  }

  // Disable common keyboard shortcuts for dev tools
  disableDevTools(): void {
    document.addEventListener('keydown', (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
      }
    });
  }

  // Console warning for potential scrapers
  addConsoleWarning(): void {
    console.clear();
    console.error('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
    console.error('%cThis is a browser feature intended for developers. Using this console to run code could expose your personal information to malicious actors.', 'color: red; font-size: 16px;');
    console.error('%cIf someone told you to copy/paste something here, it is likely a scam.', 'color: red; font-size: 16px;');
  }

  // Obfuscate email addresses
  obfuscateEmail(email: string): string {
    return email.replace('@', '[at]').replace('.', '[dot]');
  }

  // Basic honeypot trap (hidden field that bots might fill)
  createHoneypot(): HTMLElement {
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.position = 'absolute';
    honeypot.style.left = '-9999px';
    honeypot.style.opacity = '0';
    honeypot.setAttribute('tabindex', '-1');
    honeypot.setAttribute('autocomplete', 'off');
    return honeypot;
  }

  // Initialize all security measures
  initialize(): void {
    // Basic bot detection
    if (this.detectBot()) {
      // Redirect bots or show limited content
      console.error('Bot detected - implementing restrictions');
    }

    // Add console warning
    this.addConsoleWarning();

    // Optional: Enable stricter measures (uncomment if needed)
    // this.disableRightClick();
    // this.disableTextSelection();
    this.disableDevTools();
  }
}

// Export singleton instance
export const security = SecurityManager.getInstance();