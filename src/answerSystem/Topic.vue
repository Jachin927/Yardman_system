<template>
	<div id="Topic">
		<div class="title">题目管理
			<!-- <input type="text" name="search" class="search" placeholder="类型搜索">
			<span class="searchBtn">搜索</span> -->
		</div>
		<div class="ClassTableBox">
			<table border="1" class="ClassTable">
				<tr>
					<th>序号</th>
					<th>标题</th>
					<th>类型</th>
					<th>操作</th>
				</tr>
				<tr v-for="(topic,value) in topicList">
					<td>{{value+1}}</td>
					<td>{{topic.title}}</td>
					<td>{{topic.type_name}}</td>
					<td><span class="operation" @click="topicDetails(topic)">详情</span><span class="operation" v-if="power>=3" @click="delTopic(topic.id,value)">删除</span></td>
				</tr>

			</table>
		</div>
		<div class="title">添加类型题目</div>
		<div class="ClassTableBox2">
			<form name="topicForm" id="topicForm">
				<br>
				<p>
					<label for="title">标题:</label>
					<input type="text" name="title" id="title" class="search" placeholder="例：2018-03-24发布题目">
				</p>
				<p>
					<label for="Sel">类型:</label>
					<select id="typeSel" class="Sel">
						<option>请选择</option>
						<option v-for="type in typeList" :value="type.id">{{type.type_name}}</option>
					</select>
				</p>
				<!-- <p>
					<label for="privateSel">公开:</label>
					<input type="radio" id="privateSel1" name="privateSel" checked="checked">
					<label for="privateSel1" class="radioLabel">不公开</label>
					<input type="radio" id="privateSel2" name="privateSel">
					<label for="privateSel2" class="radioLabel">公开</label>
				</p> -->
				<p>
					<label for="excel">题目:</label>
					<label for="excel" id="classFile">上传文件</label>
					<input type="file" name="excel" id="excel" class="search" style="display:none;">
					<span class="colorRed">*上传文件需为Excel文件且字体需统一，格式请<a href="/src/assets/试题.xlsx">下载模板</a></span>
				</p>
				<span id="classNameListBtn" class="operation" @click="addQuestion()">提交</span>
			</form>
		</div>
		<div class="bg" v-if="showDetails"></div>
	 	<transition name="slide-fade-class">
	 		<div id="TDetails" v-if="showDetails">
	 			<span @click="closeDetails()" class="closeBtn">X</span>
				<h2>{{topic_name}}</h2>
				<p>类型：{{topic_type_name}}</p>
				<table border="1" class="ClassTable">
					<tr>
						<th>序号</th>
						<th>题目</th>
						<th>选项<span class="colorRed" style="display:inline;">(' ^ '为分隔符)</span></th>
						<th>正确答案</th>
					</tr>
					<tr v-for="(question,value) in questiones">
						<td>{{value+1}}</td>
						<td>{{question.question}}</td>
						<td>{{question.option}}</td>
						<td>{{question.right}}</td>
					</tr>
				</table>
	 		</div>
	 	</transition>
	</div>
</template>

<script>
export default {
  name: 'Topic',
  props:['power'],
  data () {
    return {
     topicList:"",
     topicListChange:0,
     typeList:"",
     showDetails:false,
     topic_name:"",
     topic_type_name:"",
     questiones:[],
     jwt:localStorage.getItem('yardman_t_jwt')
    }
  },
  beforeMount:function(){
		// 获取类型列表
		this.$http.jsonp('/api/fetch/a_til').then(function(response){
			this.topicList=response.body;
		},function(error){
			alert('操作错误！')
		}).catch(function(error){
	      alert('请求被拒绝！')
	  }),
	  this.$http.jsonp('/api/fetch/type').then(function(response){
			this.typeList=response.body;
		},function(error){
			alert('操作错误！')
		}).catch(function(error){
	      alert('请求被拒绝！')
	  })
	},
	methods:{
		// 问题详情
		topicDetails:function(topic){
			this.topic_name=topic.title;
			this.topic_type_name=topic.type_name
	    this.showDetails=true;
	    this.$http({
				url:'/api/fetch/a_qs',
				method:'jsonp',
	        params:{aid:topic.id},
	        emulateJSON:true,
			}).then(function(response){
	  		this.questiones=response.body
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
		// 添加题目
		addQuestion(){
			var typeSel=document.getElementById('typeSel')
			var ind=typeSel.selectedIndex;
			var type=typeSel.options[ind].value;
			var data=new FormData(document.getElementById('topicForm'));
			data.append('jwt',this.jwt);
			data.append('type',type);
			this.$http({
				url:'/api/a_til',
				method:'post',
        body:data,
        emulateJSON:false,
			}).then(function(response){
				alert(response.body.slice(13,-3));
				this.topicListChange++;
				// console.log(this.topicListChange)
	  	},function(error){
	  		alert('操作错误！')
	  	}).catch(function(error){
	        alert('请求被拒绝！')
	    });
		},
		// 删除题目
		delTopic:function(id,value){
			this.$http({
				url:'/api/del/a_til',
				method:'jsonp',
        params:{
        	jwt:this.jwt,
        	aid:id,
        	power:this.power
        },
        emulateJSON:true,
			}).then(function(response){
				alert(response.body)
				this.topicList.splice(value,1)
	  	},function(error){
	  		alert('操作错误！')
	  	}).catch(function(error){
	        alert('请求被拒绝！')
	    })
		}
	},
	watch:{
		// 更新
		topicListChange(){
			this.$http.jsonp('/api/fetch/a_til').then(function(response){
				this.topicList=response.body;
			},function(error){
				alert('操作错误！')
			}).catch(function(error){
		      alert('请求被拒绝！')
		  })
		}
	}
}
</script>
<style>
.Sel{
	width: 200px;
	height: 30px;
	line-height: 30px;
	border-radius: 6px;
	margin-left: 2px;
}
.radioLabel{
	margin-right: 10px;
}
.ClassTableBox2{
	text-align: left;
	padding-left: 30px;
	width: 390px;
}
#TDetails{
	max-height: 94%;
	overflow: auto;
	background: #fff;
	position: absolute;
	z-index: 2;
	right: 0;
	top: 0;
	padding: 20px 50px;
	text-align: center;
}
#TDetails h2{
	margin-bottom: 20px;
}
#TDetails .ClassTable{
	margin: 0 auto;
	padding: 20px;
}
#TDetails .closeBtn{
	display: inline-block;
	cursor: pointer;
	position: absolute;
	top: 15px;
	right: 15px;
	font-weight: 600;
	font-size: 18px;
}
#TDetails p{
	text-align: right;
	padding-right: 20px;
	font-size: 14px;
}
.closeBtn:hover{
	color:#dc1c28;
}




.slide-fade-topic-enter-active {
  transition: all .5s ease;
}
.slide-fade-topic-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-topic-enter, .slide-fade-topic-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(50px);
  opacity: 0;
}
.bg{
	background: transparent;
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
}
</style>
