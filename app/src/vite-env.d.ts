/// <reference types="vite/client" />

interface Window {
  // Expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer;
  electronAPI: {
    send: (channel: string, data: unknown) => void;
    on: (
      channel: string,
      listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
    ) => () => void;
  };
}
