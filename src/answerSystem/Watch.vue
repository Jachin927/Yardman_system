<template>
	<div id="Watch">
		<div class="title">实时监控</div>
		<div class="WatchContent">
			<div id="WatchSide">
				<span id="sideBtn" @click="sideSwitch=!sideSwitch"><span v-if="sideSwitch">展开</span><span v-else>收起</span></span>
				<h3>监控设置</h3>
				<p>
					<label>监控班级：</label>
					<select id="WatchClass" v-model="cid">
						<option value="0">请选择</option>
						<option v-for="aClass in classList" :value="aClass.id">{{aClass.class_name}}</option>
					</select>
				</p>
				<p>
					<label>监控内容：</label>
					<select id="WatchClass"  :disabled="classChecked" v-model="pid">
						<option value="0">请先选择班级</option>
						<option v-for="aTopic in topicList" :value="aTopic.id">{{aTopic.title}}</option>
					</select>
				</p>
				<span id="WatchBtn" class="subBtn operation" @click="starWatch()">开始监控</span>
			</div>
			<div id="WatchMain">
					<div class="mainbox mainLeft" v-if="rankList.length>0">
						<table border="1" class="mainTable">
							<tr>
								<th>排名</th>
								<th>姓名</th>
								<th>分数/总分</th>
								<th>用时</th>
								<th>正确率</th>
							</tr>
							<tr v-for="(aRank,value) in rankList" v-if="value<20">
								<td>{{value+1}}</td>
								<td>{{aRank.name}}</td>
								<td>{{aRank.score}}/{{aRank.sum}}</td>
								<td>{{aRank.times}}</td>
								<td>{{aRank.accuracy}}%</td>
							</tr>
						</table>
					</div>
					<div class="mainbox mainRight" v-if="rankList.length>=20">
						<table border="1" class="mainTable">
							<tr>
								<th>排名</th>
								<th>姓名</th>
								<th>分数/总分</th>
								<th>用时</th>
								<th>正确率</th>
							</tr>
							<tr v-for="(aRank,value) in rankList" v-if="value>=20">
								<td>{{value+1}}</td>
								<td>{{aRank.name}}</td>
								<td>{{aRank.score}}/{{aRank.sum}}</td>
								<td>{{aRank.times}}</td>
								<td>{{aRank.accuracy}}%</td>
							</tr>
						</table>
					</div>
					<ul class="unrankUl">
						<h4 v-if="unrankList.length>0">未完成名单</h4>
						<li v-for="aunrank in unrankList" v-if="aunrank.isDo==false">{{aunrank.name}}</li>
					</ul>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		name:'Watch',
		data () {
			return{
				jwt:localStorage.getItem('yardman_t_jwt'),
				cid:0,
				pid:0,
				o_cid:0,
				o_pid:0,
				sideSwitch:false,
				classChecked:true,//第二个下拉菜单是否开启
				classList:[],
				topicList:[],
				rankList:[],
				unrankList:[],//未完成名单
				polling:0,
				t1:"",
			}
		},
		beforeMount:function(){
			this.$http.jsonp('/api/fetch/class').then(function(response){//获取班级
				this.classList=response.body;
				// console.log(response)
			},function(error){
				alert('操作错误！')
			}).catch(function(error){
		      alert('请求被拒绝！')
		  });
		},
		methods:{
			starWatch:function(){//开始监控
				this.o_cid=this.cid;
				this.o_pid=this.pid;
				this.$http({
					url:'/api/watch',
					method:'jsonp',
					params:{
						cid:this.o_cid,
						pid:this.o_pid,
					},
				}).then(function(response){
					this.rankList=response.body.rank;
					this.unrankList=response.body.list;
					this.sideSwitch=!this.sideSwitch
				},function(error){
					alert('操作错误！')
				}).catch(function(error){
					alert('请求被拒绝！')
				})
				let that=this;
				this.t1=setInterval(function(){
					that.polling++;
				},3000);
			}
		},
		watch:{
			cid(newv,old){
				this.$http({//获取标题
	  			url:'/api/fetch/class',
	  			method:'jsonp',
	        params:{
	        	jwt:this.jwt,
	        	cid:this.cid
	        },
	  		}).then(function(response){
					this.topicList=response.body;
					if (newv==0) {
						this.classChecked=true;
					}else{
						this.classChecked=false;
					}
				},function(error){
					alert('操作错误！')
				}).catch(function(error){
			      alert('请求被拒绝！')
			  })
			},
			sideSwitch(newv){
				var WatchSide=document.getElementById('WatchSide');
				if (newv) {
					WatchSide.style="transform:translateX(-100%)"
				}else{
					WatchSide.style="transform:translateX(0%)"
				}
			},
			polling(newv){
				this.$http({
					url:'/api/watch',
					method:'jsonp',
					params:{
						cid:this.o_cid,
						pid:this.o_pid,
					},
				}).then(function(response){
					this.rankList=response.body.rank;
					this.unrankList=response.body.list;
				},function(error){
					alert('操作错误！')
				}).catch(function(error){
					alert('请求被拒绝！')
				})
			}
		},
		beforeRouteLeave(to,from,next){//路由跳转页面时，清除计时器
			clearInterval(this.t1);
			next();
		}
	}
</script>
<style scoped>
	#Watch{
		width: 100%;
		height: 100%;
	}
	.WatchContent{
		height: 94%;
		position: relative;
		/*background: #000;*/
		overflow: hidden;
	}
	#WatchSide{
		min-width: 18%;
		height: 240px;
		background: #5E5E5E;
		border-radius: 0 0 10px 0;
		/*border:1px solid red;*/
		position: absolute;
		top: 15px;
		left: 0;
		transform: translateX(0%);
		z-index: 10;
		color: #fff;
		/*box-sizing: border-box;*/
		padding: 0 40px 0 20px;
		transition: 0.3s all;
	}
	#WatchSide h3{
		line-height: 60px;
		text-align: center;
	}
	#WatchSide p{
		margin-bottom: 20px;
	}
	#WatchSide select{
		height: 30px;
		line-height: 30px;
	}
	#sideBtn{
		display: inline-block;
		position: absolute;
		right: 0;
		transform: translateX(100%);
		background: #B0040E;
		width: 30px;
		height: 80px;
		box-sizing: border-box;
		border-radius: 0 10px 10px 0;
		padding-top: 16px;
		/*line-height: 80px;*/
		text-align: center;
		cursor: pointer;
	}
	#WatchBtn{
		display: block;
		bottom: 20px;
		width: 100px;
		height: 40px;
		line-height: 40px;
		margin: 0 auto;
    background: #41B883;
    text-align: center;
    margin-top: 30px;
	}
	#WatchMain{
		position: relative;
		width: 96%;
		height: 96%;
		/*background: #000;*/
		/*border:1px solid red;*/
		margin: 0 auto;
		margin-top: 15px;
	}
	.mainbox{
		position: absolute;
		width: 42%;
		height: 100%;
		/*background: #000;*/
		/*border: 1px solid red;*/
	}
	.mainRight{
		left: 43%;
	}
	.mainTable{
		width: 100%;
		line-height: 34px;
		text-align: center;
	}
	.unrankUl{
		position: absolute;
		width:13% ;
		right: 0;
		max-height: 100%;
		overflow: auto;
	}
	.unrankUl h4{
		text-align: center;
		line-height: 40px;
		margin-bottom: 10px;
	}
	.unrankUl li{
		display: inline-block;
		width: 50%;
		text-align: center;
		line-height: 24px;
	}
</style>