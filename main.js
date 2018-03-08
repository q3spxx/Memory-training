import { app, BrowserWindow } from 'electron';
import manifest from './manifest.json';

let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow(
    {
      width: manifest.width + manifest.paddingLeft,
      height: manifest.height + manifest.paddingTop
    });
  mainWindow.webContents.openDevTools();
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
