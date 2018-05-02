<template>
  <div id="app">
    <div id="entry">
      <h2>欢迎使用答题系统</h2>
      <router-link to="/Teacher"><div class="entry_box entry_teacher" @click="checkInChange()">教师入口</div></router-link>
      <router-link to="/Student"><div class="entry_box entry_student" @click="checkInChange()">学生入口</div></router-link>
      <div class="footer">&copy;牧码人社团 2018</div>
      <div id="usedata">用户人数:{{user}}<span>使用次数：{{useNum}}</span></div>
    </div>
    <router-view v-if="checkIn"></router-view>
  </div>
</template>
<script>
  export default {
  name: 'app',
  data(){
    return{
      checkIn:false,
      user:0,
      useNum:0,
      isAdd:sessionStorage.getItem('yardman_usedata')||1
    }
  },
  beforeMount(){
    sessionStorage.setItem('yardman_usedata',2);
    // console.log(this.isAdd)
    this.$http({
      url:'/api/sum',
      method:'jsonp',
      params:{
        isAdd:this.isAdd
      },
      emulateJSON:true,
    }).then(function(response){
      // console.log(response)
      this.user=response.body.sum;
      this.useNum=response.body.num;
    },function(error){
      alert('操作错误！');
    }).catch(function(error){
      alert('请求被拒绝！')
    });
  },
  methods:{
    checkInChange:function(){
      this.checkIn=true;
    },
    getUsedata:function(){

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
    min-width: 1200px;
    min-height: 790px;
  }
  table{
    border-collapse:collapse;
    border-color: #ccc;
  }
  input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  }
  input::-webkit-outer-spin-button {
  -webkit-appearance: none;
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

  #app,#Teacher,#Student {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    color: #2c3e50;
    width: 100%;
    height: 100%;
    background: #5E5E5E;
    position: relative;
    z-index: 3;
  }
  #Student{position: relative;z-index: 3}
  #entry{
    width: 100%;
    height: 100%;
    background: #fff;
    position: absolute;
    z-index: 2;
  }
  #entry h2{
    position: absolute;
    top:10%;
    z-index: 2;
    text-align: center;
    font-size: 40px;
    font-weight: 500;
    width: 100%;
  }
  #entry .footer{
    position: absolute;
    z-index: 2;
    bottom: 30px;
    width: 100%;
    text-align: center;
  }
  .entry_box{
    width: 300px;
    height: 200px;
    float: left;
    position: absolute;
    cursor: pointer;
    user-select: none;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    font-size: 24px;
    line-height: 200px;
    border-radius: 10px;
  }
  .entry_teacher{
    background: #B0040E;
    right: 55%;
    color: #0d0d0d;
  }
  .entry_student{
    background: #0086cc;
    left: 55%;
    color: #fff;
  }
  #usedata{
    position: fixed;
    top: 0;
    right: 0;
    background: #e8e8e8;
    z-index: 100;
    line-height: 30px;
    padding: 2px 16px;
    font-size: 14px;
  }
  #usedata span{
    display: inline-block;
    margin-left: 20px;
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
    padding-left: 20px;
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
  .bNav .router-link-active{
    background: #B0040E;
    border-radius: 10px;
    color: #fff;
    line-height: 40px;
  }

  .bNav p a{
    font-family: Simhei;
    display: inline-block;
    width: 100%;
    line-height: 40px;
    color: #b3b3b3;
    text-align: center;
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
      width: 99%;
      height: 280px;
      overflow: auto;
      margin: 10px;
    }
    .ClassTable{
      text-align: center;
    }
    .ClassTable th,.ClassTable td{
      padding: 4px 30px;
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

    #Login{
    width: 100%;
    height: 100%;
    background-image: url(assets/login_bg.jpg);
    background-color: #000;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    color: #fff;
    position: relative;
  }
  .loginBox{
    position: absolute;
    padding: 10px 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
  }
  .loginBox h1{
    font-size: 72px;
    font-weight: 500;
  }
  .loginBox p{
    line-height: 80px;
    font-size: 28px;
  }
  .loginBox label{position: relative;top: 4px;}
  .loginBox p input{
    height: 46px;
    width: 280px;
    outline: none;
    opacity: 0.7;
    background: #fff;
    box-sizing: border-box;
    padding: 4px 10px;
    border-radius: 10px;
    border:none;
  }
  .loginBox .loginBtn{
    display: inline-block;
    width: 120px;
    height: 60px;
    background: #9a020b;
    color: #c1c1c1;
    text-align: center;
    line-height: 60px;
    border-radius: 10px;
    margin-top: 20px;
    font-size: 24px;
    cursor:pointer;
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