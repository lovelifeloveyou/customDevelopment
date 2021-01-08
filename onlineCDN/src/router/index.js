import Vue from 'vue'
import VueRouter from 'vue-router'
import config from '../config/index'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/index.vue')
    },
    {
        path: '/scroll',
        name: 'scroll',
        component: () => import('@/views/scroll.vue')
    }
]

let router

if (config.directTest) {
    router = new VueRouter({
        mode: 'history',
        routes
    })
} else {
    router = new VueRouter({
       mode: 'history',
       routes 
    })
}

export default router
