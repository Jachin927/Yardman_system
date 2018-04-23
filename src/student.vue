<template>
	<div id="Student">
				<router-link to="/" class="returnEntry">返回入口处</router-link>
		<template v-if="login">
				
				<div id="S-head">
					<h1>牧码人答题平台</h1>
					<p id="S-headuser">{{loginList.usr.name}} <span @click="ChangePassword(1)">修改密码</span><span @click="Logout()">注销</span></p>
				</div>
				<div id="S-side">
					<div class="bNav">
		            <p @click="ChangeMenuId(0)"><router-link to='/Student/Exercise' :class="{'router-link-active':menuId===0}">答题平台</router-link></p>
		            <!-- <p @click="ChangeMenuId(1)"><router-link to='/Student/Limit' >个人信息</router-link></p>
		            <p @click="ChangeMenuId(2)"><router-link to='/Student/Rank' >排行榜</router-link></p> -->
		          </div>
				</div>
				<div id="S-content">
					<span id="passwordFormBg" v-if="ChangePasswordshow"></span>
					<!-- 修改密码 -->
					<div id="passwordForm" v-if="ChangePasswordshow">
						<span @click="ChangePassword(2)">X</span>
						<h3>修改密码</h3>
						<p><label>新的密码：</label><input type="password" id="changepwda" placeholder="新密码不可与原密码一致" v-model="newpassword"  autofocus="autofocus"></p>
						<p><label>重复密码：</label><input type="password" id="changepwdb" placeholder="重复输入密码" v-model="rpassword"></p>
						<i class="btn" @click="sendChangepassword()">修改</i>
					</div>
					<router-view v-show="menuId>0" class="S-model" :AnswerType="AnswerType" :AnswerId="AnswerId" :AnswerVal="AnswerVal" :login="login" :loginList="loginList" :jwt="jwt" @returnIndex='returnIndex' @returnRank="returnRank"></router-view>
					<div v-show="menuId===0">
						<!-- 排行榜 -->
						<div id="S-rankBg">
							<div id="S-rank">
								<h2>班级排行榜</h2>
								<div v-if="login">
									<div>
										<ul class="Ranktype">
											<li @click="changRankType(1)" :class="{'rankfocus':Ranktype==1}">一站到底榜</li>
											<li @click="changRankType(2)" :class="{'rankfocus':Ranktype==2}">限时榜</li>
										</ul>
									</div>
									<!-- 一站到底榜 -->
									<transition name="fade">
										<table v-if="Ranktype==1">
											<tr>
												<th>排名</th>
												<th>姓名</th>
												<th>答题数量</th>
												<th>用时(S)</th>
											</tr>
											<tr v-for="(single,val) in loginList.endless">
												<td>{{val+1}}</td>
												<td>{{single.name}}</td>
												<td>{{single.num}}</td>
												<td>{{single.times}}</td>
											</tr>
											<tr class="me">
												<td>{{loginList.rank.endless_rank.rank}}</td>
												<td>{{loginList.rank.endless_rank.name}}</td>
												<td>{{loginList.rank.endless_rank.num}}</td>
												<td>{{loginList.rank.endless_rank.times}}</td>
											</tr>
										</table>
									</transition>
									<!-- 限时榜 -->
									<transition name="fade">
										<table v-if="Ranktype==2">
											<tr>
												<th>排名</th>
												<th>姓名</th>
												<th>分数/总分</th>
												<th>用时(S)</th>
												<th>正确率</th>
											</tr>
											<tr v-for="(lim_single,val) in loginList.timing">
												<td>{{val+1}}</td>
												<td>{{lim_single.name}}</td>
												<td>{{lim_single.score+'/'+lim_single.sum}}</td>
												<td>{{lim_single.times}}</td>
												<td>{{lim_single.accuracy}}%</td>
											</tr>
											<tr class="me">
												<td>{{loginList.rank.timings_rank.rank}}</td>
												<td>{{loginList.rank.timings_rank.name}}</td>
												<td>{{loginList.rank.timings_rank.score+'/'+loginList.rank.timings_rank.sum}}</td>
												<td>{{loginList.rank.timings_rank.times}}</td>
												<td>{{loginList.rank.timings_rank.accuracy}}%</td>
											</tr>
										</table>
									</transition>
									<span @click="ChangeMenuId(2)" v-if="false"><router-link to='/Student/Rank'>查看更多>></router-link></span>
								</div>
								<div v-else>
									<h3><i>登录</i>后即可查看排行榜</h3>
								</div>
							</div>
						</div>
						<!-- 类型题库 -->
						<div class="S-contentBox">
							<h2>练习题库<span :title="msg" v-if="TypeListnum<=5" @click="TypeListnum=9999">+</span><span style="font-size:50px;letter-spacing:-7px;line-height: 32px;margin-right: 27px" v-if="TypeListnum>5" @click="TypeListnum=5">--</span></h2>
							<ul id="S-exerciseUl">
								<li v-for="(Type,value) in TypeList " v-show='value<TypeListnum' :mid="Type.id" @click="Gotoanswer(1,Type.id),ChangeMenuId(3)">
									<router-link to='/Student/Answer' >
										<img :src="Typeimagebefore+Type.image" alt="找不到图片">
										<p>{{Type.type_name}}</p>
										<span>开始答题</span>
									</router-link>
								</li>
							</ul>
						</div>
						<!-- 限时测试 -->
						<div class="S-contentBox" v-if="login">
							<h2>限时测试</h2>
							<table border="1">
								<tr>
									<th>序号</th>
									<th>标题</th>
									<th>截止时间</th>
									<th>个人完成情况</th>
									<th>操作</th>
								</tr>
								<tr v-for="(apublic,val) in publicList" v-if="apublic.overdue===false">
									<td>{{val+1}}</td>
									<td>{{apublic.title}}</td>
									<td>{{apublic.end_time}}</td>
									<th v-if="apublic.isDo">已完成</th><th v-else>未完成</th>
									<td>
										<span class="btn" @click="LimitDetial(val)">详情</span>
										<router-link to='/Student/Answer' >
											<span class="btn" v-if="apublic.isDo==false" @click="Gotoanswer(2,apublic.id,val),ChangeMenuId(3)">
											开始答题
											</span>
										</router-link>
									</td>
								</tr>
							</table>
						</div>
						<transition name="fade">
							<div id="LimitDetialBox" v-if="LimitDetialShow">
								<span class="btn" @click="closeLimitDetial()">X</span>
								<h2>{{showPublic.title}}</h2>
								<p>发起时间：{{showPublic.create_time}}</p>
								<p>截止时间：{{showPublic.end_time}}</p>
								<p>答题时间：{{showPublic.time}}秒</p>
								<p>题目数量：{{showPublic.sum}}</p>
								<p>已完成人数：{{showPublic.complete}}/{{showPublic.peopleSum}}</p>
								<p>个人完成情况：<span v-if="showPublic.isDo">已完成</span><span v-else>未完成</span></p>
							</div>
						</transition>
					</div>
				</div>
				<div id="S-footer">&copy;2018 牧码人社团</div>
			
		</template>
		<template v-if="login==false">
			<sLogin @successLogin="successLogin"></sLogin>
		</template>
	</div>
</template>
<script>
	import sLogin from '@/s_login'
	export default {
  name: 'Student',
  components:{sLogin},
  data(){
  	return{
  		jwt:""||localStorage.getItem("yardman_s_jwt"),
  		menuId:0,
  		ChangePasswordshow:false,
  		newpassword:null,
  		rpassword:null,
  		msg:'查看全部',
  		login:false,//检查是否已经登录
  		// LoginShow:true,//登录框是否显示
  		loginList:{},//登录返回的数据
  		publicList:[],//限时测试所有
  		showPublic:{},//详情测试
  		Ranktype:1,//排行榜类型
  		TypeList:[],//类型数据
  		TypeListnum:5,//类型显示数量
  		LimitDetialShow:false,//是否显示限时测试详情
  		AnswerType:0,//答题类型：1-练习，2-限时
  		AnswerId:0,//判断选取什么题目，id
  		AnswerVal:null,//数组下标，用于返回时隐藏‘开始答题’块；
  		Typeimagebefore:'http://10.21.40.246'
  	}
  },
  beforeMount:function(){
  	// 检查是否已经登录过
  	if (localStorage.hasOwnProperty('yardman_s_jwt')) {
			var jwt={jwt:localStorage.getItem("yardman_s_jwt")};
			this.$http({
        url:'/s_api/usr/logged',
        method:'jsonp',
        params:jwt,
        emulateJSON:true,
      }).then(function(response){
        this.loginList=response.body.data;
        this.publicList=this.loginList.public;
				this.login=true;
				// this.LoginShow=false;
				// console.log(response)
      },function(error){
        alert('操作错误！');
      }).catch(function(error){
        alert('请求被拒绝！')
      });
      
  	}
  	// 获取类型
  	this.$http.jsonp('/s_api/type/all').then(function(response){
      this.TypeList=response.body;
      // console.log(response)
    },function(error){
      alert('操作错误！');
    }).catch(function(error){
      alert('请求被拒绝！')
    });
  	
  },
  methods:{
  	// 菜单所选取模块（判断类型模块是否显示）
  	ChangeMenuId:function(val){
  		this.menuId=val
  	},
  	// 类型模块展示隐藏
  	Typeslide:function(val){
  		val==1?this.typeState=false:this.typeState=true;
  	},
  	// 关闭登录框
  	// CloseLogin:function(){
  	// 	this.LoginShow=false;
  	// },
  	// 未登录情况下打开登录框
  	// ShowLogin:function(){
  	// 	this.LoginShow=true;
  	// },
  	// 登录成功
  	successLogin(data){
  		/*if (this.Loginuser!=null&&this.Loginpwd!=null) {
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
	        if (this.loginList.status==3) {
	        	alert("登录成功")
	        	this.loginList=this.loginList.data;
	        	this.publicList=this.loginList.public;
	        	this.LoginShow=false;
  		     	this.login=true;
  		     	localStorage.setItem('yardman_s_jwt',this.loginList.jwt);
	        }else{
	        	alert(this.loginList.msg);
	        }
	      },function(error){
	        alert('操作错误！');
	      }).catch(function(error){
	        alert('请求被拒绝！')
	      });
  		}else{
  			alert('请输入账号密码！')
  		}*/
  		this.loginList=data;
  		alert("登录成功");
  		this.publicList=this.loginList.public;
			this.login=true;
  	},
  	// 登出
  	Logout:function(){
  		this.loginList={};
  		localStorage.removeItem("yardman_s_jwt");
  		alert("注销成功！");
  		this.login=false;
  	},
  	//改变当前排行榜的类型
  	changRankType:function(val){
  		this.Ranktype=val;
  	},
  	//限时测试详情
  	LimitDetial:function(val){
  		this.showPublic=this.publicList[val];
  		this.showPublic.peopleSum=this.loginList.class.sum;
  		this.LimitDetialShow=true;
  	},
  	//关闭限时测试详情
  	closeLimitDetial:function(){
  		this.LimitDetialShow=false;
  	},
  	//前往答题
  	Gotoanswer:function(val,mid,num){
  		this.AnswerType=val;
  		this.AnswerId=mid;
  		this.AnswerVal=num;//数组下标，用于返回时隐藏‘开始答题’块；
  	},
  	returnIndex(ind){//提交完成返回首页
  		if (ind!='msg') {
  		this.publicList[ind].isDo=true;
  		console.log(1)
  		}
  		this.menuId=0;
  	},
  	returnRank(data){//提交之后排行榜更新
  		if (data.status==2) {
  			this.loginList.timing=data.data.timing;
  			this.loginList.rank.timings_rank=data.data.timings_rank;
  		}else{
  			this.loginList.endless=data.data.endless;
  			this.loginList.rank.endless_rank=data.data.endless_rank;
  		}
  	},
  	ChangePassword(val){//修改密码模块出现
  		if (val==1) {
  			this.ChangePasswordshow=true;
  		}else{
  			this.ChangePasswordshow=false;
  		}
  	},
  	sendChangepassword(){
  		var changepwda=document.getElementById('changepwda').value;
  		var changepwdb=document.getElementById('changepwdb').value;
  		if (changepwda==null||changepwda==""||changepwdb==null||changepwdb=="") {
  			alert('请输入密码！');
  		}else if(changepwda!==changepwdb){
  			alert('密码不一致！请重新输入')
  		}
  		else{
  			this.$http({
  				url:'/s_api/pwd',
  				method:'jsonp',
  				params:{
  					jwt:this.jwt,
  					password:this.newpassword
  				},
  				emulateJSON:true,
  			}).then(function(response){
					alert(response.body);
					this.ChangePasswordshow=false;
				},function(error){
					alert('操作错误！');
				}).catch(function(error){
					alert('请求被拒绝！')
				});
  		}
  	}
  },
  watch:{
  }
}
</script>
<style>
	#Student{
		background: #f8fbd1;
		min-width: 1400px;
	} 
	#Student .returnEntry{
	  color: #fff;
	  font-size: 16px;
	  margin-left: 20px;
	  position: fixed;
	  line-height: 24px;
	  z-index: 100;
	  display: inline-block;
	  bottom: 20px;
	  right: 0px;
	  background: #219EE1;
	  padding: 6px 12px;
	  border-radius: 6px;
	}
	#Student .returnEntry:hover{background: #4ec1ff;}

	#S-head{
    width: 100%;
    height: 50px;
    background: #0086cc;
    font-size: 11px;
    line-height: 50px;
    color:#fff;
    position: relative;
  }
  #S-head h1{
    position: absolute;
    padding-left: 40px;
  }
	#passwordForm{
		width: 350px;
		height: 250px;
		background: #fff;
		border:2px solid #999;
		border-radius: 10px;
		z-index: 4;
		position: absolute;
		left: 50%;
		top: 40%;
		transform: translate(-50%,-50%);
		text-align: center;
	}
	#passwordForm h3{
		line-height: 60px;
	}
	#passwordForm span{
		display: inline-block;
		position: absolute;
		right: 10px;
		top: 4px;
		font-weight: 600;
		cursor: pointer;
	}
	#passwordForm input{
		height: 30px;
		border-radius: 6px;
		padding: 2px 8px;
		outline: none;
		margin-top: 10px;
	}
	#passwordForm .btn{
		display: block;
		font-style: normal;
		margin: 0 auto;
		margin-top: 35px;
		width: 60px;
		/*background: #000;*/
		border:1px solid #999;
		padding: 8px 10px;
		border-radius: 10px;
		cursor: pointer;
	}
	#passwordFormBg{
		display: inline-block;
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 3;
		background: rgba(255,255,255,0.4);
	}

  #S-headUser{
    position: absolute;
    right: 40px;
    height: 100%;
  }
  /*#S-headUser img{
    width: 30px;
    height: 30px;
    position: relative;
    top: 10px;
    left: -5px;
  }*/
	#S-headuser{
		float: right;
		margin-right: 20px;
		font-size: 14px;
		font-weight: 600;
	}
	#S-headuser span{margin-left: 20px;}
	#S-headuser span:hover{
		color: #000;
		cursor: pointer;
	}
	#S-side{
    width: 11%;
    min-height: 86%;
    background: #0086cc;
    position: absolute;
    top: 60px;
    left: 0.5%;
    border-radius: 10px;
    padding-bottom: 10px;
  }
  #S-side .bNav .router-link-active{
    background: #fff;
    border-radius: 20px;
    color: #0086cc;
    line-height: 40px;
  }
  #S-side .bNav p{
  	margin: 5px 0;
  }
  #S-side .bNav p a{
    font-family: Simhei;
    display: inline-block;
    width: 100%;
    height: 100%;
    color: #fff;
    text-align: center;
    margin: 0;
  }

	#S-content{
		position: absolute;
    top: 60px;
    left: 13%;
    background: #fff;
    border-radius: 10px;
    width: 86%;
    height: 87%;
    box-sizing: border-box;
    border: 10px solid #0086cc;
    overflow-y: auto;
	}
	.S-model{
		position: absolute;
		z-index: 2;
	}
	.S-contentBox{
		min-width: 750px;
		max-width: 60%;
		background: #fff;
		margin-left: 10px;
		margin-top: 10px;
		padding-bottom: 8px;
		margin-bottom: 30px;
		position: relative;
		border-radius: 10px 10px 10px 0;
	}
	.S-contentBox h2{
		font-size: 16px;
		padding-left: 18px;
		background: #0086cc;
		color: #fff;
		line-height: 40px;
		margin-bottom: 10px;
		border-radius: 10px 10px 0 10px;
	}
	.S-contentBox h2 span{
		display: inline-block;
		float: right;
		margin-right: 20px;
		font-size: 42px;
		line-height: 40px;
		cursor: pointer;
		user-select: none;
	}
	.S-contentBox h2 span:hover{
		color: #08557d;
	}
	#S-exerciseUl{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		width: 100%;
	}
	#S-exerciseUl li{
		width: 110px;
		height: 130px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		margin: 0 20px;
	}
	#S-exerciseUl li img{
		width: 80px;
		height: 80px;
		border: 2px solid #fff;
		box-sizing: border-box;
		border-radius: 6px;
		position: absolute;
		left: 50%;
		top: 6%;
		transform: translate(-50%);
	}
	#S-exerciseUl li p{
		text-align: center;
		line-height: 40px;
		color: #2c3e50;
		width: 100%;
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
		position: absolute;
		bottom: 0;
	}
	#S-exerciseUl li span{
		/*content:'开始答题';*/
		display: inline-block;
		width: 100%;
		height: 40px;
		line-height: 40px;
		background: #219ee1;
		color: #fff;
		position: absolute;
		left: 0;
		bottom: -40px;
		text-align: center;
		transition: 0.3s all ease-in-out;
		opacity: 0;
		border-radius: 6px;
	}
	#S-exerciseUl li:hover span{
		bottom: 0;
		opacity: 1;
		z-index: 2;
	}
	.S-contentBox table{
		margin: 20px auto;
	}
	.S-contentBox table tr th{
		padding: 4px 20px;
		text-align: center;
	}
	.S-contentBox table tr td{
		text-align: center;
		padding: 4px	10px;
	}
	.S-contentBox table .btn{
		display: inline-block;
		padding: 4px 10px;
		border-radius: 10px;
		margin: 0 6px;
		cursor: pointer;
		line-height: 30px;
	}
	.S-contentBox table a{
		color: #2c3e50;
	}
	.S-contentBox table .btn:hover{
		color: #fff;
		background: #219ee1;
	}

	
	#S-rankBg{
		width: 35%;
		position: absolute;
		left: 64%;
	}
	#S-rank{
		width: 400px;
		height: 426px;
		background: #fff;
		border-radius: 10px;
		overflow: hidden;
		margin: 0 auto;
		position: relative;
	}
	#S-rank .Ranktype{
		display: flex;
		justify-content: space-between;
		padding: 0 10px;
		width: 250px;
		margin: 15px auto;
	}
	#S-rank .Ranktype li{
		padding: 8px 20px;
		border:1px solid #bbb;
		border-radius: 12px;
		cursor: pointer;
	}
	.rankfocus{
		background: #0086cc;
		color: #fff;
	}
	#S-rank h2{
		font-size: 16px;
		background: #0086cc;
		line-height: 42px;
		text-align: center;
		color: #fff;
		border-radius: 10px 10px 0 0;
	}
	#S-rank h3{
		text-align: center;
		color: #c1c1c1;
		line-height: 240px;
	}
	#S-rank h3 i{
		text-decoration: underline;
		font-style: normal;
		cursor: pointer;
	}
	#S-rank table{
		margin: 0 auto;
		text-align: center;
		line-height: 24px;
		position: absolute;
		left: 50%;
		transform: translate(-50%);
	}
	#S-rank table tr th{
		padding: 0 20px 8px 10px;
		margin-bottom: 10px;
	}
	#S-rank table tr td{
		line-height: 40px;
	}
	#S-rank .me{
		color:#00a7ff;
	}
	#S-rank span{
		display: inline-block;
		width: 100%;
		line-height: 40px;
		text-align: center;
		position: absolute;
		bottom: 0;
		cursor: pointer;
	}
	#S-rank span a{
		display: inline-block;
		width: 100%;
		color: #2c3e50;
	}
	#S-rank span a:hover{
		color: #0086cc;
	}

	#LimitDetialBox{
		background: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		padding: 14px 40px;
		box-shadow: 0px 0px 30px #666;
	}
	#LimitDetialBox .btn{
		position: absolute;
		right: 10px;
		top: 8px;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
	}
	#LimitDetialBox h2{
		text-align: center;
		padding: 12px 0;
	}
	#LimitDetialBox p{
		line-height: 28px;
	}

	#S-footer{
		width: 100%;
		line-height: 40px;
		position: absolute;
		bottom: 10px;
		text-align: center;
	}
	#S-Login{
		width: 500px;
		height: 250px;
		background: #fff;
		border-radius: 10px;
		position: fixed;
		left: 50%;
		top: 45%;
		transform: translate(-50%,-50%);
		z-index: 10;
		box-sizing: border-box;
		padding: 20px 40px;
		box-shadow: 4px 4px 50px #666;
	}
	#S-Login h2{
		text-align: center;
		line-height: 50px;
		margin-bottom: 20px;
	}
	#S-Login p{
		text-align: center;
		font-style: 18px;
		font-weight: bold;
		line-height: 40px;
	}
	#S-Login p input{
		height: 30px;
		width: 180px;
		border-radius: 10px;
		outline: none;
		box-sizing: border-box;
		padding: 4px 8px;
	}
	#S-Login span{
		display: inline-block;
		position: absolute;
		top: 12px;
		right: 14px;
		cursor: pointer;
	}
	/*#S-Login span:hover{
		color: #B0040E;
	}*/
	#S-LoginBg{
		display: inline-block;
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
	}
	#S-LoginBtn{
		width: 80px;
		height: 40px;
		background: #0086cc;
		border-radius: 12px;
		text-align: center;
		line-height: 40px;
		margin: 0 auto;
		margin-top: 20px;
		color: #fff;
		cursor: pointer;
	}
	#S-Login i{
		font-style: normal;
		font-size: 14px;
		position: absolute;
		right: 8px;
		bottom: 8px;
		cursor: pointer;
	}


	.fade-enter-active{
		transition: opacity .3s .3s;
	}
	.fade-leave-active {
	  transition: opacity .3s;
	}
	.fade-enter, .fade-leave-to{
	  opacity: 0;
	}

</style>