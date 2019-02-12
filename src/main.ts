import { app, BrowserWindow, Menu, screen, Tray } from "electron";
import * as path from "path";

const TRAY_ARROW_HEIGHT = 50;
const WINDOW_WIDTH = 600;
const WINDOW_HEIGHT = 400;
const HORIZ_PADDING = 15;
const VERT_PADDING = 15;

let mainWindow: BrowserWindow;
let trayIcon: Tray;

function createWindow(): BrowserWindow {
  // Create the browser window.
  let window = new BrowserWindow({
    frame: false,
    height: WINDOW_HEIGHT,
    resizable: false,
    show: false,
    transparent: false,
    width: WINDOW_WIDTH
  });

  window.loadFile(path.join(__dirname, "..", "index.html"));

  window.on("closed", () => {
    window = null;
  });

  window.on("blur", () => {
    window.hide();
  });

  return window;
}

function createTray(iconPath: string): Tray {
  const tray = new Tray(iconPath);
  tray.setToolTip("Give feedback here!");
  tray.on("click", () => onIconClick(mainWindow));
  return tray;
}

function onIconClick(window: BrowserWindow): void {
  const cursorPosition = screen.getCursorScreenPoint();
  const primarySize = screen.getPrimaryDisplay().workAreaSize;
  const trayPositionVert =
    cursorPosition.y >= primarySize.height / 2 ? "bottom" : "top";
  const trayPositionHoriz =
    cursorPosition.x >= primarySize.width / 2 ? "right" : "left";
  window.setPosition(getTrayPosX(), getTrayPosY());
  window.isVisible() ? window.hide() : window.show();

  function getTrayPosX() {
    const horizBounds = {
      left: cursorPosition.x - WINDOW_WIDTH / 2,
      right: cursorPosition.x + WINDOW_WIDTH / 2
    };
    if (trayPositionHoriz === "left") {
      return horizBounds.left <= HORIZ_PADDING
        ? HORIZ_PADDING
        : horizBounds.left;
    } else {
      return horizBounds.right >= primarySize.width
        ? primarySize.width - HORIZ_PADDING - WINDOW_WIDTH
        : horizBounds.right - WINDOW_WIDTH;
    }
  }
  function getTrayPosY() {
    return trayPositionVert === "bottom"
      ? cursorPosition.y - WINDOW_HEIGHT - VERT_PADDING
      : cursorPosition.y + VERT_PADDING;
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  mainWindow = createWindow();
  trayIcon = createTray(path.join(__dirname, "..", "assets", "writing.png"));
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
