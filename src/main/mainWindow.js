import BrowserWinHandler from './BrowserWinHandler'

const winHandler = new BrowserWinHandler({
  width: 1200,
  height: 750,
  useContentSize: true,
  backgroundColor: '#F5F5F5',
  autoHideMenuBar: true,
  webPreferences: {
    webviewTag: true, // Required
    nodeIntegration: true, // Required
    nodeIntegrationInWorker: true, // Enable Web Workers https://www.electronjs.org/docs/tutorial/multithreading
    contextIsolation: false, // Required Electron 12
  },
  titleBarStyle: 'hiddenInset', // Hide the bar
  icon: 'https://aistore.shop/OogashopIc.webp'
})

winHandler.onCreated(_browserWindow => {
  winHandler.loadPage('/')
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

export default winHandler
