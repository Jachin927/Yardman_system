<template>
	<div id="Login">
		<router-link to="/" class="returnEntry">返回入口处</router-link>
		<div class="loginBox">
			<h1>Welcome</h1>
			<p>
				<label for="user">账号：</label>
				<input type="text" name="user" id="user" placeholder="请输入账号" v-model="user" autofocus="autofocus">
			</p>
			<p>
				<label for="pwd">密码：</label>
				<input type="password" name="pwd" id="pwd" placeholder="请输入密码" v-model="pwd" @keyup.enter="Loging()">
			</p>
			<span class="loginBtn" @click="Loging()">Login</span>
		</div>
	</div>
</template>
<script>
export default {
	name:"Login",
 	data () {
    	return {
    		user:"",
    		pwd:"",
    		getData:{},
    		successLogin:0
    	}
	},
	methods:{
		Loging(){
			if (this.user!=""&&this.pwd!="") {
				var sendData={
					username:this.user,
					password:this.pwd
				}
				this.$http({
					url:'/api/usr/login',
					method:'jsonp',
					params:sendData,
					emulateJSON:true,
				}).then(function(response){
					this.getData=response.body;
					// console.log(response)
				},function(error){
					alert('操作错误！');
				});
			} else {
				alert('请输入账号密码！')
			}
		}
	},
	watch:{
		getData(){
			if (this.getData.status==2) {
				this.$emit('successLogin',this.getData.data);
				localStorage.setItem('yardman_t_jwt',this.getData.data.jwt);
			}else{
				alert(this.getData.msg)
			}
		}
	}
}
</script>
<style>
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
</style>