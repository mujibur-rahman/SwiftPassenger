module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo", // plain — no jsxImportSource
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": "./src",
            "@assets": "./assets"
          },
          extensions: [".js", ".jsx", ".json"],
        },
      ],
      // must be last
      "react-native-reanimated/plugin",
    ],
  };
};