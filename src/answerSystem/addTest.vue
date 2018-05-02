<template>
	<div id="addTest">
		<div class="title">发布试题<span class="spanshow" @click="testDetails()" v-if="showTest===false">查看已发布测试</span><span class="spanshow" @click="closeTest()" v-if="showTest" style="color:#41B883">隐藏已发布测试</span></div>
		<div class="sidebar">
			<div class="title sidebarTitle">选项扩展</div>
			<p>
				<label for="title">标题：</label>
				<input type="text" name="title" id="title" placeholder="例:HTML期末考试" class="navcheck" v-model="title">
			</p>
			<p>
				<label for="Type">类型：</label>
				<select class="navcheck" id="typeSel" v-model="type">
					<option value="0">请选择</option>
					<option v-for="type in typeList" :value="type.id">{{type.type_name}}</option>
				</select>
			</p>
			<p>
				<label for="num">数量：</label>随机获取
				<input type="number" name="num" id="num" class="navcheck" min="0" v-model="sum">条
				<span class="tip">* 所填数字超过所选测试题目，则为全部题目</span>
			</p>
			<p>
				<label>答题时间：</label><br><br>
				<input type="number" min="0" class="testTime" id="hour" name="hour">小时
				<input type="number" min="0" class="testTime" id="minute" name="minute">分钟
				<input type="number" min="0" class="testTime" id="second" name="second">秒
				<span class="tip">* 可以只填写 秒（例:180秒)</span>
			</p>
			<p>
				<label>公开：</label>
				<input type="radio"id="no" name="status" value="2" v-model="status"><label for="no" style="margin:0px 3px;">不公开</label>
				<input type="radio"id="yes" name="status" value="1" v-model="status"><label for="yes" style="margin:0px 3px;">公开</label>
			</p>
			<p>
				<label>截止时间：</label><br><br>
				<input type="datetime-local" name="testDate" id="testDate" v-model="end_time">
			</p>
		</div>
		<div class="sidebar sidebar2">
			<div class="title sidebarTitle">班级扩展</div>
				<!-- <p>
					<span><input type="checkbox" name="classCheck" class="classCheck" ></span>16网站开发与维护高级三年一班
				</p> -->
				<p v-for="Class in classList">
					<span><input type="checkbox" name="classCheck" class="classCheck" :value="Class.id"></span>{{Class.class_name}}
				</p>
		</div>
		<div class="testCont">
			<h3>题目选取：
				<!-- <select>
					<option value="0">按标题选取</option>
					<option value="1">按类型选取</option>
				</select> -->
			</h3>

			<table border="1" class="ClassTable">
				<tr>
					<th>选择</th>
					<th>序号</th>
					<th>标题</th>
					<th>类型</th>
					<!-- <th>公开</th> -->
					<th>操作</th>
				</tr>
				<tr v-for="(topic,value) in topicList">
					<td><input type="checkbox" name="testCheck" class="testCheck" :value="topic.id"></td>
					<td>{{value+1}}</td>
					<td>{{topic.title}}</td>
					<td>{{topic.type_name}}</td>
					<!-- <td>已公开</td> -->
					<td><span class="operation" @click="topicDetails(topic.id,topic.title)">详情</span></td>
				</tr>
			</table>
			<span class="subBtn operation" @click="addTest()">发布</span>
		</div>
		<!-- 查看已发布试题模块 -->
		<span class="oldContBg" v-if="showTest"></span>
		<transition name="slide-fade-class">
			<div class="oldCont" v-if="showTest">
				<h3>已发布测试</h3>
				<table border="1" class="ClassTable">
					<tr>
						<th>序号</th>
						<th>标题</th>
						<th>类型</th>
						<th>答题限时(<span class="colorRed" style="display:inline;font-size:14px;">秒</span>)</th>
						<th>截止时间</th>
						<th>状态</th>
						<th>发布班级</th>
						<th>操作</th>
					</tr>
					<tr v-for="(test,value) in testList">
						<td>{{value+1}}</td>
						<td>{{test.title}}</td>
						<td>{{test.type_name}}</td>
						<td>{{test.time}}</td>
						<td>{{test.end_time}}</td>
						<td v-if="test.status==1">已公开</td><td v-else>未公开</td>
						<td>{{test.class_name}}</td>
						<td>
							<span class="operation" @click="showTestDD(test.id,test.title)">详情</span>
							<span class="operation" @click="delTestDD(test.id,value)">删除</span>
							<span class="operation" @click="changeStatus(2,test.id,value)" v-if="test.status==1">隐藏</span>
							<span class="operation" @click="changeStatus(1,test.id,value)" v-else>公开</span>
						</td>
					</tr>
				</table>
			</div>
		</transition>
		<!-- 查看题目模块（按标题查询） -->
		<span class="oldContBg" v-if="showDetails"></span>
		<transition name="slide-fade-class">
			<div class="oldCont" v-if="showDetails">
				<span class="closeBtn" @click="closeDetails()">X</span>
				<h3>{{SDetailsTitle}}</h3>
				<table border="1" class="ClassTable">
					<tr>
						<tr>
						<th>序号</th>
						<th>题目</th>
						<th>选项<span class="colorRed" style="display:inline;">(' ^ '为分隔符)</span></th>
						<th>正确答案</th>
					</tr>
					<tr>
						<tr v-for="(question,value) in questiones">
						<td>{{value+1}}</td>
						<td>{{question.question}}</td>
						<td>{{question.option}}</td>
						<td>{{question.right}}</td>
					</tr>
				</table>
			</div>
		</transition>
		<!-- 已发布试题详情模块 -->
		<span class="oldContBg" v-if="testDD"></span>
		<transition name="slide-fade-class">
			<div class="oldCont" v-if="testDD">
				<span class="closeBtn" @click="closeTDD()" >X</span>
				<h3>{{SDDTitle}}</h3>
				<table border="1" class="ClassTable">
					<tr>
						<tr>
						<th>序号</th>
						<th>题目</th>
						<th>选项<span class="colorRed" style="display:inline;">(' ^ '为分隔符)</span></th>
						<th>正确答案</th>
					</tr>
					<tr>
						<tr v-for="(testD,value) in testDList">
						<td>{{value+1}}</td>
						<td>{{testD.question}}</td>
						<td>{{testD.option}}</td>
						<td>{{testD.right}}</td>
					</tr>
				</table>
			</div>
		</transition>
	</div>
</template>

<script>
export default {
  name: 'Class',
  props:['power'],
  data () {
    return {
      jwt:localStorage.getItem('yardman_t_jwt'),
      title:"",
      type:0,
      class_id:[],
      sum:"",
      time:0,
      end_time:"2000-01-01T00:00:00",
      status:2,
      tid:[],
      topicList:"",
      typeList:"",
      showDetails:false,
      showTest:false,
      testDD:false,
      SDetailsTitle:"",
      SDDTitle:"",
     	questiones:[],
     	classList:[],
     	testList:[],
     	testDList:[],
    }
  },
  beforeMount:function(){
		// 获取题目标题列表
		this.$http.jsonp('/api/fetch/a_til').then(function(response){
			this.topicList=response.body;
		},function(error){
			alert('操作错误！')
		}).catch(function(error){
	      alert('请求被拒绝！')
	  }),
	  // 获取类型列表
	  this.$http.jsonp('/api/fetch/type').then(function(response){
			this.typeList=response.body;
		},function(error){
			alert('操作错误！')
		}).catch(function(error){
	      alert('请求被拒绝！')
	  }),
	  // 获取班级列表
	  this.$http.jsonp('/api/fetch/class').then(function(response){
			this.classList=response.body;
		},function(error){
			alert('操作错误！')
		}).catch(function(error){
	      alert('请求被拒绝！')
	  })
	},
  methods:{
  	addTest:function(){
  		// 获取时间
  		var hour=document.getElementById('hour').value*60*60;
  		var minute=document.getElementById('minute').value*60;
  		var second=document.getElementById('second').value*1;
  		this.time=hour+minute+second;
  		// 获取所选标题
  		this.tid=[];
  		var testCheck=document.getElementsByName('testCheck');
  		for (var i = 0; i < testCheck.length; i++) {
  			if (testCheck[i].checked) {
  				this.tid.push(testCheck[i].value);
  			}
  		};
  		this.class_id=[];
  		var classCheck=document.getElementsByName('classCheck');
  		for (var i = 0; i < classCheck.length; i++) {
  			if (classCheck[i].checked) {
  				this.class_id.push(classCheck[i].value);
  			}
  		}
  		this.$http({
				url:'/api/p_til',
				method:'jsonp',
        params:{
        	jwt:this.jwt,
        	title:this.title,
        	type:this.type,
        	class_id:this.class_id,
        	sum:this.sum,
        	time:this.time,
        	end_time:this.end_time,
        	status:this.status,
        	tid:this.tid
        },
        emulateJSON:true,
			}).then(function(response){
	  		alert(response.body.slice(1,-1));
	  	},function(error){
	  		alert('操作错误！')
	  	}).catch(function(error){
	        alert('请求被拒绝！')
	    })
  	},
  	//更改限时测试的状态
  	changeStatus:function(status,id,val){
  		this.$http({
				url:'/api/change',
				method:'jsonp',
        params:{
        	status:status,
        	pid:id,
        },
        emulateJSON:true,
			}).then(function(response){
				alert(response.body)
				this.testList[val].status=status
	  	},function(error){
	  		alert('操作错误！')
	  	}).catch(function(error){
	        alert('请求被拒绝！')
	    })
  	},
  	// 关闭详情模块
		closeDetails(){
			this.showDetails=false;
		},
		// 关闭详情模块
		closeTest(){
			this.showTest=false;
		},
		// 关闭已发布试题详情模块
		closeTDD(){
			this.testDD=false;
		},
		// 题目选取模块详情
  	topicDetails:function(id,title){
  		this.$http({
				url:'/api/fetch/a_qs',
				method:'jsonp',
        params:{aid:id},
        emulateJSON:true,
			}).then(function(response){
	  		this.questiones=response.body
	    	this.showDetails=true;
	  	},function(error){
	  		alert('操作错误！')
	  	}).catch(function(error){
	        alert('请求被拒绝！')
	    })
	    this.SDetailsTitle=title;
  	},
  	// 打开 查看已发布测试 模块
  	testDetails:function(){
  		this.$http({
  			url:'/api/fetch/p_til',
  			method:'jsonp',
        params:{jwt:this.jwt},
  		}).then(function(response){
				this.testList=response.body;
				this.showTest=true;
			},function(error){
				alert('操作错误！')
			}).catch(function(error){
		      alert('请求被拒绝！')
		  })
  	},
  	// 已发布测试模块 详情
  	showTestDD:function(id,name){
  		this.$http({
  			url:'/api//fetch/p_qs',
  			method:'jsonp',
  			params:{pid:id},
  			emulateJSON:true,
  		}).then(function(response){
  			this.testDList=response.body;
  			this.testDD=true;
  		},function(error){
  			alert('操作错误！')
  		}).catch(function(error){
  			alert('请求被拒绝！')
  		})
  		this.SDDTitle=name;
  	},
  	// 已发布测试模块 删除
  	delTestDD:function(id,value){
  		// console.log(this.power)
  		this.$http({
				url:'/api/del/p_til',
				method:'jsonp',
        params:{
        	jwt:this.jwt,
        	pid:id,
        	power:this.power
        },
        emulateJSON:true,
			}).then(function(response){
				alert(response.body.slice(1,-1));
	    	this.testList.splice(value,1);
	    	// console.log(response)
	  	},function(error){
	  		alert('操作错误！')
	  	}).catch(function(error){
	        alert('请求被拒绝！')
	    })
  	}
  },
  /*beforeRouteLeave(to, from, next){
  }*/
}
</script>

<style>
	#addTest{
		position: relative;
		width: 100%;
		height: 100%;
	}
	.title{
		position: relative;
	}
	.title .spanshow{
		position: absolute;
		right: 10px;
		cursor: pointer;
	}
	.sidebar{
		width: 20%;
		height: 91%;
		background: #444444;
		border-radius: 10px;
		box-sizing: border-box;
		padding-left: 15px;
		padding-top: 70px;
		position: absolute;
		top: 8%;
		left: 0.5%;
	}
	.sidebar2{
		left: 79.5%;
		color: #fff;
	}
	.sidebar2 p{
		width: 95%;
		line-height: 30px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		user-select: none;
		cursor: default;
	}
	.sidebar2 p span {
		display: inline-block;
		position: relative;
		top: 4px;
		margin-right: 8px;
	}
	.sidebarTitle{
		background: #393939;
		text-align: center;
		position: absolute;
		left: 0;
		top: 0;
		padding-left: 0;
	}
	.sidebar p{
		margin-bottom: 20px;
		color: #fff;
	}
	.sidebar label{
		color: #fff;
		display: inline-block;
	}
	.sidebar .navcheck{
		width: 65%;
		height: 30px;
		box-sizing: border-box;
		padding: 4px;
	}
	#num{
		width: 20%;
		height: 28px;
		text-align: center;
		margin-right: 4px;
		padding: 0
	}
	.tip{
		font-size: 12px;
		display: inline-block;
		color: #E51C23;
	}
	.testTime{
		width: 14%;
		height: 28px;
		margin-right: 3px;
		box-sizing: border-box;
		padding: 2px;
		text-align: center;
	}
	#second{
		width: 19%;
		line-height: 28px;
	}
	#testDate{
		font-size: 14px;
	}
	.testCont{
		position: absolute;
		top: 8%;
		left: 22%;
		height: 91%;
	}
	.testCont h3,.oldCont h3{
		margin-bottom: 10px;
		font-size: 20px;
	}
	.testCont h3 select{
		height: 30px;
		width: 120px;
		text-align: center;
	}
	.testCheck,.classCheck{
		width: 20px;
		height: 20px;
		background: transparent;
		outline: none;
		border: none;
	}
	.oldCont{
		height: 86.2%;
		position: absolute;
		z-index: 10;
		right: 0px;
		padding: 20px;
		text-align: center;
		background: #f9f9f9;
		border: 1px solid #ccc;
		border-bottom: none;
		box-shadow: 0px 6px 40px #333;
		overflow: auto;
	}
	.subBtn{
		display: inline-block;
		width: 102px;
		height: 42px;
		line-height: 42px;
		background: #41B883;
		color: #fff;
		text-align: center;
		position: absolute;
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
		cursor: pointer;
	}
	.oldContBg{
		display: inline-block;
		width: 100%;
		height: 100%;
		background: transparent;
		position: absolute;
	}
	.closeBtn{
		display: inline-block;
		cursor: pointer;
		position: absolute;
		top: 15px;
		right: 15px;
		font-weight: 600;
		font-size: 18px;
	}


	.slide-fade-class-enter-active {
	  transition: all .5s ease;
	}
	.slide-fade-class-leave-active {
	  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-class-enter, .slide-fade-class-leave-to
	/* .slide-fade-leave-active for below version 2.1.8 */ {
	  transform: translateX(50px);
	  opacity: 0;
	}
</style>
