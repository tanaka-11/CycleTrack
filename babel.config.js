module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          globals: {
            setImmediate: true,
            setTimeout: true,
            clearTimeout: true,
            fetch: true,
            Headers: true,
            Request: true,
            Response: true,
            FileReader: true,
            Blob: true,
            FormData: true,
            SharedArrayBuffer: true,
            DebuggerInternal: true,
            IDBDatabase: true,
            IDBObjectStore: true,
            IDBIndex: true,
            IDBCursor: true,
            IDBTransaction: true,
            DOMException: true,
            IDBRequest: true,
            MessageChannel: true,
            nativeFabricUIManager: true,
            __REACT_DEVTOOLS_GLOBAL_HOOK__: true,
            navigator: true,
            performance: true,
            self: true,
            URLSearchParams: true,
            AbortController: true,
            XMLHttpRequest: true,
          },
        },
      ],
    ],
  };
};
