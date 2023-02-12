import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/Hew007/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "个人博客",
      description: "技术博客，前端技术，文章分享，记录生活，思考想法",
    },
    // "/en/": {
    //   lang: "en-US",
    //   title: "博客演示",
    //   description: "vuepress-theme-hope 的博客演示",
    // },
  },

  theme,

  shouldPrefetch: false,
});
