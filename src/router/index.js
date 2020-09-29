import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import VideoChat from '../components/VideoChat'
import TextChat from '../components/TextChat'

const routes = [{
    path: '/text',
    name: 'TextChat',
    component: TextChat
  },
  {
    path: '/video',
    name: 'VideoChat',
    component: VideoChat
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router