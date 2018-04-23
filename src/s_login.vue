<template>
	<div id="sLogin">
		<div class="panel-lite">
      <h4>学生登录</h4>
      <form>
        <div class="form-group">
          <input type="text" class="form-control user" name="username" required autofocus="autofocus" v-model="Loginuser">
          <label class="form-label">用户名</label>
          <span style="color: red;font-size: 12px;display: none;">用户名不能为空！</span>
        </div>
        <div class="form-group">
          <input type="password" class="form-control password" name="password" required v-model="Loginpwd" @keyup.enter="Login()">
          <label class="form-label">密 码</label>
          <span style="color: red;font-size: 12px;display: none;">密码不能为空！</span>
        </div>
        <span class="submit" @click="Login()">登录</span>
      </form>
    </div>
	</div>
</template>
<script>
	export default{
		name:'sLogin',
		data(){
			return{
				Loginuser:"",//登录账号
  			Loginpwd:"",//登录密码
  			loginList:{},//登录返回的数据
			}
		},
		methods:{
			Login:function(){
				if (this.Loginuser!=""&&this.Loginpwd!="") {
					this.$http({
		        url:'/s_api/usr/login',
		        method:'jsonp',
		        params:{
		        	username:this.Loginuser,
		        	password:this.Loginpwd
		        },
		        emulateJSON:true,
		      }).then(function(response){
		        this.loginList=response.body;
		        console.log(response)
		      },function(error){
		        alert('操作错误！');
		      }).catch(function(error){
		        alert('请求被拒绝！')
		      });
				}
			}
		},
		watch:{
			loginList(){
				if (this.loginList.status==3) {
					this.$emit('successLogin',this.loginList.data);
					localStorage.setItem('yardman_s_jwt',this.loginList.data.jwt);
				}else{
					alert(this.loginList.msg);
				}
			}
		}
	}
</script>
<style>
	.panel-lite {
	  min-width: 360px;
	  min-height: 300px;
	  background: #fff;
	  padding: 45px 20px;
	  border-radius: 4px;
	  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
	  position: absolute;
	  top: 50%;left: 50%;
	  transform: translateX(-50%) translateY(-50%);
	}
	.panel-lite h4 {
	  font-weight: 500;
	  font-size: 30px;
	  text-align: center;
	  color: #219EE1;
	  margin: 15px auto 20px;
	  line-height: 40px;
	}
	.panel-lite a {
	  display: inline-block;
	  margin-top: 20px;
	  text-decoration: none;
	  color: #5492E2;
	  font-size: 14px;
	}
	.panel-lite a input{
		float: left;
		margin-top: 4px;
	}
	.form-group {
	  position: relative;
	  font-size: 15px;
	  color: #666;
	  min-height: 51px;
	  margin-top: 10px;
	}
	.form-group .form-label {
	  position: absolute;
	  z-index: 5;
	  left: 0;
	  top: 10px;
	  -webkit-transition: 0.3s;
	  transition: 0.3s;
	}
	.form-group .form-control {
	  width: 100%;
	  position: relative;
	  z-index: 3;
	  height: 25px;
	  background: transparent;
	  border: none;
	  padding: 5px 0;
	  transition: 0.3s;
	  border-bottom: 1px solid #777;
	}
	.form-group .form-control:invalid {
	  outline: none;
	}
	.form-group .form-control:focus, .form-group .form-control:valid {
	  outline: none;
	  color: #5492E2;
	  box-shadow: 0 1px #5492E2;
	  border-color: #5492E2;
	}
	.form-group .form-control:focus + .form-label, .form-group .form-control:valid + .form-label {
	  font-size: 12px;
	  transform: translateY(-22px);
	  color: #5492E2;
	}

	.floating-btn {
	  background: #5492E2;
	  width: 60px;
	  height: 60px;
	  border-radius: 50%;
	  color: #fff;
	  font-size: 32px;
	  border: none;
	  position: absolute;
	  margin: auto;
	  transition: 0.3s;
	  box-shadow: 1px 0px 0px rgba(0, 0, 0, 0.3) inset;
	  margin: auto;
	  right: -30px;
	  bottom: 90px;
	  cursor: pointer;
	}
	.floating-btn:hover {
	  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3) inset, 0 3px 6px rgba(0, 0, 0, 0.16), 0 5px 11px rgba(0, 0, 0, 0.23);
	}
	.floating-btn:hover .icon-arrow {
	  transform: rotate(45deg) scale(1.2);
	}
	.floating-btn:focus, .floating-btn:active {
	  outline: none;
	}
	.icon-arrow {
	  position: relative;
	  width: 13px;
	  height: 13px;
	  border-right: 3px solid #fff;
	  border-top: 3px solid #fff;
	  display: block;
	  transform: rotate(45deg);
	  margin: auto;
	  transition: 0.3s;
	}
	.icon-arrow:after {
	  content: '';
	  position: absolute;
	  width: 18px;
	  height: 3px;
	  background: #fff;
	  left: -5px;
	  top: 5px;
	  transform: rotate(-45deg);
	}
	.submit{ 
		display: block;
		width: 40%; 
		height: 40px; 
		margin: 0 auto;
		line-height: 40px;
		color: #fff; 
		background: #219EE1; 
		margin-top: 40px;
		outline:none; 
		border: transparent;
		border-radius: 5px;
		text-align: center;
		user-select: none;
		cursor: pointer;
	}
	.submit:hover{
		box-shadow: 0 0 0 rgba(0, 0, 0, 0.3) inset, 0 3px 6px rgba(0, 0, 0, 0.16), 0 5px 11px rgba(0, 0, 0, 0.23);
	}
	.reset{
		width: 100%; 
		height: 40px; 
		line-height: 40px; 
		text-align: center; 
		color: #fff; 
		background: #5492E2; 
		cursor: pointer; 
		margin-top: 15px;
	}
	.reset:hover{
		box-shadow: 0 0 0 rgba(0, 0, 0, 0.3) inset, 0 3px 6px rgba(0, 0, 0, 0.16), 0 5px 11px rgba(0, 0, 0, 0.23);
	}

	.form-group .left,.form-group .right{width: 50%;float: left;}
	.form-group .right .replace{display: block;margin: 0 auto;width: 80%;cursor: pointer;}

	.auto{width: 100%;height: 16px;margin: 5px auto;}
	.auto #checkbox{margin-top: 3px;}
	.auto #checkbox,.auto label{display: block;float: left;font-size: 12px;color: #666;}
</style>