const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  compress: true, //파일 압축 플러그인
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === "production";
    const plugins = [...config.plugins];
    // if (prod) {
    //   plugins.push(new CompressPlugin());
    // }
    return {
      ...config,
      mode: prod ? "production" : "development",
      devtool: prod ? "hidden-source-map" : "eval",
      plugins,
    };
  },
});
