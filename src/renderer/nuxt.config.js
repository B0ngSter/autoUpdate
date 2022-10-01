const random = Math.floor(Math.random() * 1220 + 100);
const version = 124 + random;
module.exports = {
  server: {
    host: process.env.ENV === "local" ? "127.0.0.1" : "0.0.0.0",
    port: 3001, // default: 3000
  },
  target: "server",
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0",
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  css: ["~/assets/global.css"],
  loading: false,
  plugins: [
    { src: "~/plugins/debounce.js" },
    { src: "~/plugins/axios.js" }
  ],
  components: true,
  modules: [
    "@nuxtjs/axios",
    ["cookie-universal-nuxt", { alias: "cookies" }]
  ],
  axios: {
    baseURL: "http://127.0.0.1:4040/",
    credentials: true,
    // headers:{'Authorization': token}
  },
  build: {
    extractCSS: true,
    filenames: {
      app: ({ isDev }) =>
        isDev ? "[name].js" : "app.[contenthash]" + version + ".js",
      chunk: ({ isDev }) =>
        isDev ? "[name].js" : "app.[contenthash]" + version + ".js",
      css: ({ isDev }) =>
        isDev ? "[name].css" : "app.[contenthash]" + version + ".css",
      img: ({ isDev }) =>
        isDev
          ? "[path][name].[ext]"
          : "img/[contenthash:7]" + version + ".[ext]",
      font: ({ isDev }) =>
        isDev
          ? "[path][name].[ext]"
          : "fonts/[contenthash:7]" + version + ".[ext]",
      video: ({ isDev }) =>
        isDev
          ? "[path][name].[ext]"
          : "videos/[contenthash:7]" + version + ".[ext]",
    },
  },
};
