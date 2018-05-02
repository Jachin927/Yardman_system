<template>
	<div id="Class">
		<div class="title">班级管理
			<!-- <input type="text" name="search" class="search" placeholder="班级搜索">
			<span class="searchBtn">搜索</span> -->
		</div>
		<div class="ClassTableBox">
			<table border="1" class="ClassTable">
				<tr>
					<th>序号</th>
					<th>班级名称</th>
					<th>操作</th>
				</tr>
				<tr v-for="(Class,value) in classList">
					<td>{{value+1}}</td>
					<td>{{Class.class_name}}</td>
					<td><span class="operation" @click="ClassDetails(Class.id,Class.class_name)">详情</span><span class="operation" v-if="power>=3" @click="ClassDel(Class.id,value)">删除</span></td>
				</tr>
			</table>
		</div>
		<div class="title">添加班级</div>
		<div class="ClassTableBox2">
			<form name="addClass_form" id="addClass_form">
				<p>
					<label for="className">班级名:</label>
					<input type="text" name="className" id="className" class="search" placeholder="班级名称" v-model="add_ClassName">
				</p>
				<p>
					<label for="excel">成员表:</label>
					<label for="excel" id="classFile">上传文件</label>
					<input type="file" name="excel" id="excel" class="search" v-show="false">
					<span class="colorRed">*上传文件需为Excel文件且字体需统一，格式请<a href="/src/assets/学生名单.xlsx">下载模板</a></span>
				</p>
				<span id="classNameListBtn" class="operation" @click="addClass()">添加</span>
			</form>
		</div>
		<!-- 班级详情 -->
		<div class="bg" v-if="showDetails"></div>
	 	<transition name="slide-fade-class">
			<div id="CDetails" v-if="showDetails">
				<span @click="closeDetails()" class="closeBtn">X</span>
				<h2>{{class_name}}</h2>
				<table border="1" class="ClassTable">
					<tr>
						<th>姓名</th>
						<th>学号</th>
						<th>性别</th>
						<th>操作</th>
					</tr>
					<tr v-for="(student,value) in studentes">
						<td>{{student.name}}</td>
						<td>{{student.student_id}}</td>
						<td>{{student.sex}}</td>
						<td v-if="student.status===2"><span class="operation" @click="studentFree(1,student.id,value)">冻结</span></td>
						<td v-else><span class="operation" @click="studentFree(2,student.id,value)">恢复</span></td>
					</tr>
				</table>
			</div>
		</transition>
		<!-- 班级详情 -->
	</div>
</template>

<script>
export default {
name: 'Class',
props:['power'],
	data () {
	  return {
	    classList: '',
	    classListChange:0,
	    studentUpdate:0,
	    showDetails:false,
	    studentes:{},
	    class_name:"",
	    add_ClassName:"",
	    add_ClassNameList:"",
	    jwt:localStorage.getItem('yardman_t_jwt'),
	  }
  },
	beforeMount:function(){
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
		// 班级情况详情
		ClassDetails:function(id,name){
			this.$http({
				url:'/api/fetch/student',
				method:'jsonp',
	        params:{classId:id},
	        emulateJSON:true,
			}).then(function(response){
	  		this.studentes=response.body
	  	},function(error){
	  		alert('操作错误！')
	  	}).catch(function(error){
	        alert('请求被拒绝！')
	    })
	    this.class_name=name;
	    this.showDetails=true;
	  	},
	  // 关闭详情模块
		closeDetails(){
			this.showDetails=false;
		},
		// 班级添加事件
		addClass:function(){
			var data=new FormData(document.getElementById('addClass_form'));
			data.append('jwt',this.jwt);
			this.$http({
				url:'/api/class',
				method:'post',
        body:data,
        emulateJSON:false,
			}).then(function(response){
				alert(response.body.slice(14,-3))
				this.classListChange++
	  	},function(error){
	  		alert('操作错误！')
	  	}).catch(function(error){
	        alert('请求被拒绝！')
	    });
		},
		// 班级删除事件
		ClassDel:function(id,value){
			this.$http({
				url:'/api/del/class',
				method:'jsonp',
        params:{
        	jwt:this.jwt,
        	classId:id,
        	power:this.power
        },
        emulateJSON:true,
			}).then(function(response){
				alert(response.body.slice(1,-1));
	    	this.classList.splice(value,1);
	  	},function(error){
	  		alert('操作错误！')
	  	}).catch(function(error){
	        alert('请求被拒绝！')
	    })
		},
		Classupdate:function(){
	  	//班级更新，重新获取
			this.$http.jsonp('/api/fetch/class').then(function(response){
				this.classList=response.body;
			},function(error){
				alert('操作错误！')
			}).catch(function(error){
		      alert('请求被拒绝！')
		  })
		},
		studentFree:function(num,id,val){
			this.$http({
				url:'/api/freezen',
				method:'jsonp',
        params:{
        	jwt:this.jwt,
        	studentId:id,
        	status:num
        },
        emulateJSON:true,
			}).then(function(response){
				alert(response.body.slice(0,-1))
				this.studentes[val].status=num;
	  	},function(error){
	  		alert('操作错误！')
	  	}).catch(function(error){
	        alert('请求被拒绝！')
	    })
		}
	},
	watch:{
		classListChange(){
			this.$http.jsonp('/api/fetch/class').then(function(response){
				this.classList=response.body;
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
	#CDetails{
		height: 94%;
		background: #fff;
		position: absolute;
		z-index: 2;
		right: 0;
		top: 0;
		padding: 20px 50px;
		text-align: center;
		overflow: auto;
	}
	#CDetails h2{
		margin-bottom: 20px;
	}
	#CDetails .ClassTable{
		margin: 0 auto;
	}
	#CDetails .closeBtn{
		display: inline-block;
		cursor: pointer;
		position: absolute;
		top: 15px;
		right: 15px;
		font-weight: 600;
		font-size: 18px;
	}
	.closeBtn:hover{
		color:#dc1c28;
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
