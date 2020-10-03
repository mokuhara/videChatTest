import { createRouter, createWebHashHistory } from "vue-router";
import TextChat from "../components/TextChat";
import VideoChat from "../components/VideoChat";
import Home from "../views/Home"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/video",
    name: "VideoChat",
    component: VideoChat,
  },
  {
    path: "/text",
    name: "TextChat",
    component: TextChat,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
