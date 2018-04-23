<template>
  <div id="apps">
    <template v-if="login==true">
      <div id="head">
        <h1>牧码人功能系统</h1>
        <div id="headUser">
          <img src="./assets/logo.png" alt="找不到图片">
          <span>您好，{{loginInfo.name}}</span>
        </div>
      </div>
      <ul id="side">
        <li @click="changmenuId(0)" :class="{'focus':menuId===0}">总览</li>
        <li @click="changmenuId(1)" :class="{'focus':menuId===1}">答题系统</li>
        <transition name="slide-fade">
          <div class="bNav" v-if="menuId===1">
            <p @click="changselId(0)"><router-link to='/Class' >班级管理</router-link></p>
            <p @click="changselId(1)"><router-link to='/Type' >分类管理</router-link></p>
            <p @click="changselId(2)"><router-link to='/Topic' >题目管理</router-link></p>
            <p @click="changselId(3)"><router-link to='/addTest' >发布试题</router-link></p>
            <p @click="changselId(4)"><router-link to='/scoreCheck' >成绩查询</router-link></p>
          </div>
        </transition>
      </ul>
      <div id="allContent">
        <router-view :selId="selId" :power="power"></router-view>
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
  name: 'apps',
  components:{Login},
  data(){
    return{
      menuId:0,
      login:false,
      loginInfo:{},
      selId:0,
      power:0,
    }
  },
  beforeMount:function(){
    if (localStorage.hasOwnProperty('yardman_t_jwt')) {
      var jwt={jwt:localStorage.getItem("yardman_t_jwt").slice(1,-1)};
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
    changmenuId:function(value){
      this.menuId=value;
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
*{
  margin: 0;padding: 0;
}
ul li{list-style: none;}
a{text-decoration: none;}
html,body{
  width: 100%;
  height: 100%;
  min-width: 1190px;
  min-height: 790px;
}
table{
  border-collapse:collapse;
}
input::-webkit-inner-spin-button {
-webkit-appearance: none;
}
input::-webkit-outer-spin-button {
-webkit-appearance: none;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  width: 100%;
  height: 100%;
  background: #5E5E5E;
  position: relative;
}
footer{
  width: 100%;
  height: 4%;
  position: absolute;
  bottom: 0;
  text-align: center;
  color:#fff;
  background: #393939;
  line-height: 34px;
}


#head{
  width: 100%;
  height: 50px;
  background: #363636;
  font-size: 11px;
  line-height: 50px;
  color:#fff;
  position: relative;
}
#head h1{
  position: absolute;
  text-indent: 2rem;
}
#headUser{
  position: absolute;
  right: 40px;
  height: 100%;
}
#headUser img{
  width: 30px;
  height: 30px;
  position: relative;
  top: 10px;
  left: -5px;
}
#headUser span{
  line-height: 50px;
}
#side{
  width: 11%;
  min-height: 86%;
  background: #363636;
  position: absolute;
  top: 60px;
  left: 0.5%;
  border-radius: 10px;
  padding-bottom: 10px;
}
#side li{
  width: 90%;
  line-height: 40px;
  background: #444444;
  border-radius: 6px;
  margin: 0 auto; 
  margin-top: 10px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
#allContent{
  position: absolute;
  top: 60px;
  left: 12%;
  background: #f9f9f9;
  border-radius: 10px;
  width: 87%;
  height: 87%;
  box-sizing: border-box;
  border: 10px solid #393939;
}
#side .focus{
  background: #B0040E;
  border-radius: 6px;
}
.bNav .router-link-active{
  background: transparent;
  color: #B0040E;
}

.bNav p a{
  display: inline-block;
  width: 100%;
  line-height: 30px;
  color: #b3b3b3;
  text-align: center;
  font-size: 12px;
  margin: 5px 0;
}

/*子组件样式*/
  .title{
    width: 100%;
    line-height: 50px;
    background: #5E5E5E;
    color: #fff;
    box-sizing: border-box;
    padding-left:20px;
    border-radius: 10px;
  }
  .search{
    width: 200px;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    outline: none;
    margin-left: 5px;
  }
  .searchBtn{
    display: inline-block;
    width: 50px;
    height: 30px;
    margin-left: 10px;
    cursor: pointer;
    line-height: 50px;
  }
  .ClassTableBox{
    width: 100%;
    height: 280px;
    overflow: auto;
    margin: 10px;
  }
  .ClassTable{
    text-align: center;
  }
  .ClassTable th,.ClassTable td{
    padding: 4px 10px;
    font-size: 14px;
  }
  .operation{
    display: inline-block;
    width: 40px;
    margin: 0 5px;
    padding: 4px;
    border-radius: 6px;
    cursor: pointer;
  }
  .operation:hover{
    background: #41B883;
    color: #fff;
  }
  .ClassTableBox2{
    width: 300px;
    margin: 10px;
    position: relative;
    text-align: center;
  }
  .ClassTableBox2 p{
    margin-bottom: 20px;
  }
  #classFile{
    display: inline-block;
    width: 140px;
    height: 50px;
    border: 1px solid #ccc;
    margin-left: 4px;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
  }
  .colorRed{
    color: #B0040E;
    font-size: 12px;
    display: block;
  }
  .colorRed a{
    color: #B0040E;
    text-decoration: underline;
  }
  #classNameListBtn{
    width: 100px;
    height: 40px;
    display: inline-block;
    border: 1px solid #ccc;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    border-radius: 6px;
    margin-left: 16%;
  }


  .bgLinHei{
    background: rgba(65,184,131,0.5);
  }

/*过渡样式*/
  .slide-fade-enter-active {
    transition: all .5s ease;
  }
  .slide-fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter{
    transform: translateX(-50px);
    opacity: 0;
  }
  .slide-fade-leave-to{
    transform: translateX(50px);
    opacity: 0;
  }

</style>
