module.exports = {
  babelrcRoots: ["."],
  presets: [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        modules: false,
        targets: {
          chrome: "90",
        },
      },
    ],
  ],
};
