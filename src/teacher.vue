<template>
  <div id="Teacher">
    <template v-if="login==true">
      <router-link to="/" class="returnEntry">返回入口处</router-link>
      <div id="head">
        <h1>牧码人答题管理系统</h1>
        <div id="headUser">
          <img src="./assets/logo.png" alt="找不到图片">
          <span>您好，{{loginInfo.name}} <span id="loginout" @click="Logout()">注销</span> </span>
        </div>
      </div>
      <div id="side">
        <transition name="slide-fade">
          <div class="bNav">
            <p><router-link to='/Teacher/Class' >班级管理</router-link></p>
            <p><router-link to='/Teacher/Type' >分类管理</router-link></p>
            <p><router-link to='/Teacher/Topic' >题目管理</router-link></p>
            <p><router-link to='/Teacher/addTest' >发布试题</router-link></p>
            <p><router-link to='/Teacher/scoreCheck' >成绩查询</router-link></p>
            <p><router-link to='/Teacher/Watch'>实时监控</router-link></p>
          </div>
        </transition>
      </div>
      <div id="allContent">
        <router-view :power="power"></router-view>
      </div>
      <footer>&copy;2018 牧码人社团</footer>
      <button style="display:none" ></button>
    </template>
    <template v-if="login===false">
      <Login @successLogin="successLogin"></Login>
    </template>
  </div>
</template>

<script>
import Login from '@/login'
export default {
  name: 'Teacher',
  components:{Login},
  data(){
    return{
      // menuId:0,
      login:false,
      loginInfo:{},
      power:0,
    }
  },
  beforeMount:function(){
    if (localStorage.hasOwnProperty('yardman_t_jwt')) {
      var jwt={jwt:localStorage.getItem("yardman_t_jwt")};
      this.login=true;
      this.$http({
        url:'/api/usr/logged',
        method:'jsonp',
        params:jwt,
        emulateJSON:true,
      }).then(function(response){
        this.loginInfo=response.body;
        this.power=this.loginInfo.power;
      },function(error){
        alert('操作错误！');
      }).catch(function(error){
        alert('请求被拒绝！')
      });
    }
  },
  methods:{
    Logout:function(){//注销
      this.loginList={};
      localStorage.removeItem("yardman_t_jwt");
      alert("注销成功！");
      this.login=false;
      this.power=0;
      this.loginInfo="";
    },
    changselId:function(value){
      this.selId=value;
    },
    successLogin(data){
      this.loginInfo=data;
      alert('登陆成功！')
      this.login=true;
      this.power=data.power
    }
  }
}
</script>

<style>
 #Teacher .returnEntry{
  color: #fff;
  font-size: 16px;
  margin-left: 20px;
  position: fixed;
  line-height: 24px;
  z-index: 100;
  display: inline-block;
  bottom: 20px;
  right: 0px;
  background: #B0040E;
  padding: 6px 12px;
  border-radius: 6px;
 }
 #Teacher .returnEntry:hover{
  background: #dd0612;
  color: #fff;
 }
 #loginout{
  display: inline-block;
  margin-left: 20px;
  cursor: pointer;
 }
 #loginout:hover{
  color: #B0040E;
 }
</style>
