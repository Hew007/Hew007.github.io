import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    "",
    {
      text: "如何使用",
      icon: "creative",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    {
      text: "文章",
      icon: "note",
      prefix: "posts/",
      children: [
        {
          text: "生活随笔",
          icon: "flower",
          prefix: "informal-essay/",
          children: "structure",
        },
        {
          text: "技术笔记",
          icon: "any",
          prefix: "tech-article/",
          children: "structure",
        },
      ],
    },
    "intro",
    "slides",
  ],
});
