// app/electron/preload/index.ts

import { ipcRenderer, contextBridge, IpcRendererEvent } from 'electron';

interface ElectronAPI {
  send: <T>(channel: string, data: T) => void;
  on: <T>(
    channel: string,
    listener: (event: IpcRendererEvent, ...args: T[]) => void
  ) => () => void;
}

const api: ElectronAPI = {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => {
    const subscription = (event: IpcRendererEvent, ...args: unknown[]) =>
      func(event, ...args);
    ipcRenderer.on(channel, subscription);
    return () => ipcRenderer.removeListener(channel, subscription);
  },
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', api);

// Utility to patch prototype methods properly
function withPrototype<T extends object>(obj: T): T {
  const result: Partial<T> = {};
  const properties = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));

  properties.forEach((prop) => {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(obj),
      prop
    );
    if (propertyDescriptor) {
      Object.defineProperty(result, prop, propertyDescriptor);
    }
  });

  return result as T;
}

contextBridge.exposeInMainWorld('ipcRendererSafe', withPrototype(ipcRenderer));

// Preload script for handling document readiness and displaying a loading animation
function domReady(
  condition: string[] = ['complete', 'interactive']
): Promise<void> {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve();
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve();
        }
      });
    }
  });
}

function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
    @keyframes square-spin {
      25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
      50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
      75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
      100% { transform: perspective(100px) rotateX(0) rotateY(0); }
    }
    .${className} > div {
      animation-fill-mode: both;
      width: 50px;
      height: 50px;
      background: #fff;
      animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
    }
    .app-loading-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #282c34;
      z-index: 9;
    }
  `;
  const oStyle = document.createElement('style');
  const oDiv = document.createElement('div');

  oStyle.id = 'app-loading-style';
  oStyle.innerHTML = styleContent;
  oDiv.className = 'app-loading-wrap';
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      document.head.appendChild(oStyle);
      document.body.appendChild(oDiv);
    },
    removeLoading() {
      document.head.removeChild(oStyle);
      document.body.removeChild(oDiv);
    },
  };
}

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
  if (ev.data.payload === 'removeLoading') {
    removeLoading();
  }
};

setTimeout(removeLoading, 4999); // Ensure loading screen doesn't hang indefinitely
