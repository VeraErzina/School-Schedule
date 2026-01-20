const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  
  });
  win.maximize(); // разворачивает на весь экран
  win.show();  
  win.webContents.openDevTools()
  win.loadFile(path.join(__dirname, 'dist', 'index.html')); // Загрузка index.html из Vite-сборки
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit(); 
});

