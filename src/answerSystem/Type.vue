<template>
	<div id="Type">
		<div class="title">分类管理
			<!-- <input type="text" name="search" class="search" placeholder="类型搜索">
			<span class="searchBtn">搜索</span> -->
		</div>
		<div class="ClassTableBox">
			<table border="1" class="ClassTable">
				<tr>
					<th>序号</th>
					<th>类型</th>
					<th>操作</th>
				</tr>
				<tr v-for="(type,value) in typeList">
					<td>{{value+1}}</td>
					<td>{{type.type_name}}</td>
					<td><span class="operation" @click="TypeChange(type.id,type.type_name,type.image)">修改</span><span class="operation" v-if="power>=3" @click="delType(type.id,value,type.image)">删除</span></td>
				</tr>
			</table>
			<div class="bg" v-if="showChange"></div>
			<transition name="slide-fade-type">
				<div id="TypeChangeBox" v-if="showChange">
					<span @click="closeChange()" class="btn">X</span>
					<h3>类型修改</h3>
					<form id="Typechange_form" name="Typechange_form">
						<p>
							<label for="typeName">名称修改：</label>
							<input type="text" id="typeName" name="typeName" class="input" :placeholder="change_typeName" v-model="typeName">
						</p>
						<p>
							<label for="image">图片修改：</label>
							<label for="image" class="filess">上传图片</label>
							<input type="file" name="image" id="image" v-show="false">
							<span class="colorRed">注：图片将用于学生板块，可不修该</span>
						</p>
						<p><span class="changBtn" @click="SendTypeChange(old_image)">确定修改</span></p>
						<div class="imgBox">
						<img :src="image" alt="找不到图片">
						<p>原图片</p>
						</div>
					</form>
				</div>
			</transition>
		</div>
		<div class="title">添加类型</div>
		<div class="ClassTableBox2">
			<form name="addtype_form" id="addtype_form">
				<p>
					<label for="type">名称:</label>
					<input type="text" name="type" id="type" class="search" placeholder="类型名称">
				</p>
				<p>
					<label for="image">图片:</label>
					<label for="image" id="classFile">上传图片</label>
					<input type="file" name="image" id="image" class="search" style="display:none;">
				</p>
				<span id="classNameListBtn"  class="operation" @click="addType()">添加</span>
			</form>
		</div>
	</div>
</template>

<script>
export default {
  name: 'Type',
	props:['power'],
  data () {
    return {
      typeList:"",
      typeListChange:0,
      showChange:false,
      change_typeName:"",
      jwt:localStorage.getItem('yardman_t_jwt'),
      typeName:"",
      id:-1,
      image:"",
      old_image:"",
    }
  },
  beforeMount:function(){
  	// 获取类型列表
		this.$http.jsonp('/api/fetch/type').then(function(response){
			// console.log(response);
			this.typeList=response.body;
		},function(error){
			alert('操作错误！')
		}).catch(function(error){
	      alert('请求被拒绝！')
	  })
	},
	methods:{
		// 修改类型模块出现事件
		TypeChange:function(id,name,url){
			this.showChange=true;
			this.change_typeName=name;
			this.id=id;
			this.image="http://lostars.cn"+url;
			this.old_image=url;
			// console.log(this.image)
		},
		//请求类型修改
		SendTypeChange:function(){
			var data=new FormData(document.getElementById('Typechange_form'));
			data.append('typeId',this.id);
			data.append('jwt',this.jwt);
			data.append('power',this.power);
			data.append('image',this.old_image)
			// console.log(data.get('power'))
			this.$http({
				url:'/api/update/type',
				method:'post',
        body:data,
        emulateJSON:false,
			}).then(function(response){
				alert(response.body.slice(13,-3))
				this.typeListChange++;
				this.showChange=false;
	  	},function(error){
	  		alert('操作错误！')
	  	}).catch(function(error){
	        alert('请求被拒绝！')
	    })
		},
		// 修改类型模块关闭事件
		closeChange:function(){
			this.showChange=false;
		},
		// 添加类型
		addType:function(){
			var data=new FormData(document.getElementById('addtype_form'));
			data.append('jwt',this.jwt);
			this.$http({
				url:'/api/type',
				method:'post',
        body:data,
        emulateJSON:false,
			}).then(function(response){
				alert(response.body.slice(13,-3))
				this.typeListChange++;
	  	},function(error){
	  		alert('操作错误！')
	  	}).catch(function(error){
	        alert('请求被拒绝！')
	    })
		},
		// 删除类型事件
		delType:function(id,value,image_url){
			this.$http({
				url:'/api/del/type',
				method:'jsonp',
        params:{
        	jwt:this.jwt,
        	typeId:id,
        	power:this.power,
        	image:image_url
        },
        emulateJSON:true,
			}).then(function(response){
				alert(response.body)
				this.typeList.splice(value,1)
	  	},function(error){
	  		alert('操作错误！')
	  	}).catch(function(error){
	        alert('请求被拒绝！')
	    })
		}
	},
	watch:{
		typeListChange(){
			// 更新
			this.$http.jsonp('/api/fetch/type').then(function(response){
				this.typeList=response.body;
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
#TypeChangeBox{
	width: 500px;
	height: 250px;
	background: #fff;
	display: inline-block;
	position: absolute;
	top: 10%;
	left: 30%;
	border: 2px solid #666;
	border-radius: 4px;
	z-index: 10;
	padding: 10px 30px;
	box-sizing: border-box;
}
#TypeChangeBox h3{
	text-align: center;
	line-height: 60px;
}
#TypeChangeBox .btn{
	display: inline-block;
	cursor: pointer;
	position: absolute;
	top: 6px;
	right: 8px;
	font-weight: 600;
	font-size: 16px;
}
#TypeChangeBox .input{
	outline: none;
	width: 120px;
	box-sizing: border-box;
	padding: 4px;
}
#TypeChangeBox p{
	margin-bottom: 10px;
}
.btn:hover{
	color:#dc1c28;
}
.filess{
	display: inline-block;
	width: 120px;
	height: 40px;
	border: 1px solid #999;
	box-sizing: border-box;
	line-height: 38px;
	text-align: center;
}
.changBtn{
	display: inline-block;
	border: 1px solid #999;
	width: 80px;
	height: 40px;
	line-height: 40px;
	text-align: center;
	margin-left: 60px;
	border-radius: 10px;
	margin-top: 20px;
	cursor: pointer;
}
.changBtn:hover{
	background: #41B883;
	color: #fff;
}
.imgBox{
	position: absolute;
	top: 25%;
	right: 10%;
	text-align: center;
}
.imgBox img{
	width: 140px;
	height: 140px;
}


.slide-fade-type-enter-active {
  transition: all .5s ease;
}
.slide-fade-type-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-type-enter, .slide-fade-type-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(-100px);
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
