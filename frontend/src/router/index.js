import { createRouter, createWebHistory } from 'vue-router'

import IndexView from '../components/Index.vue'
import ZipEditorView from '../components/views/ZipEditor.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: IndexView
  },
  {
    path: '/zip-editor',
    name: 'zip-editor',
    component: ZipEditorView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router