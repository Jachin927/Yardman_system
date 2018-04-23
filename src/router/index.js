import Vue from 'vue'
import Router from 'vue-router'
import Teacher from '@/teacher'
import Class from '@/answerSystem/Class'
import Type from '@/answerSystem/Type'
import Topic from '@/answerSystem/Topic'
import addTest from '@/answerSystem/addTest'
import scoreCheck from '@/answerSystem/scoreCheck'
import Watch from '@/answerSystem/Watch'

import Student from '@/student'
import Exercise from '@/studentPlatform/Exercise'
import Limit from '@/studentPlatform/Limit'
import Rank from '@/studentPlatform/Rank'
import About from '@/studentPlatform/About'
import Answer from '@/studentPlatform/Answer'
Vue.use(Router)

export default new Router({
mode:"history",
  routes: [
    /*{
      path:'/',
      name:'',
      component:Teacher,
    },*/
    // 教师版路由
    {
      path: '/Teacher',
      name: 'Teacher',
      component: Teacher,
      redirect:'/Teacher/Class',
      children:[
        {
          path: '/Teacher/Class',
          name: 'Class',
          component: Class
        },
        {
          path: '/Teacher/Type',
          name: 'Type',
          component: Type
        },
        {
          path: '/Teacher/Topic',
          name: 'Topic',
          component: Topic
        },
        {
          path: '/Teacher/addTest',
          name: 'addTest',
          component: addTest
        },
        {
          path: '/Teacher/scoreCheck',
          name: 'scoreCheck',
          component: scoreCheck
        },
        {
          path:'/Teacher/Watch',
          name:'Watch',
          component: Watch,
          meta: {
            keepAlive: true // true 表示需要使用缓存
          }
        }
      ]
    },
    // 学生版路由
    {
      path:'/Student',
      name:'Student',
      component:Student,
      children:[
        {
          path: '/Student/Exercise',
          name: 'Exercise',
          component: Exercise
        },
        {
          path: '/Student/Limit',
          name: 'Limit',
          component: Limit
        },
        {
          path: '/Student/Rank',
          name: 'Rank',
          component: Rank
        },
        {
          path: '/Student/About',
          name: 'About',
          component: About
        },
        {
          path: '/Student/Answer',
          name: 'Answer',
          component: Answer
        }
      ]
    }
  ]
})

//全局路由守卫
// Router.beforeEach(to,from,next)