<template>
	<div id="Class">
		<div class="title">成绩查询</div>
		<div class="ClassTableBox ClassTableBoxC">
			<p class="aboutScoreCheck">
				<label for="titleScore">查询标题(只显示公开的测试)：</label>
				<select id="titleScore" class="scoreSelect" v-model="titleId">
					<option value="0">请选择</option>
					<option v-for="aTitle in titleList" :value="aTitle.id" v-if="aTitle.status==1">{{aTitle.title}}</option>
				</select>
				<label for="classScore">查询班级：</label>
				<select id="classScore" class="scoreSelect" v-model="classId">
					<option value="0">请选择</option>
					<option v-for="aClass in classList" :value="aClass.id">{{aClass.class_name}}</option>
				</select>
				<!-- <label for="sortScore">排序:</label>
				<input type="radio" name="sortScore" id="score1" class="scoreRadio" value="0" checked="checked">
				<label for="score1">学号</label>
				<input type="radio" name="sortScore" id="score2" class="scoreRadio" value="1">
				<label for="score2">分数</label> -->
				<span class="scoreBtn" @click="scoreCheck()">查询</span>
			</p>
			<table border="1" class="ClassTable">
				<tr>
					<th>排名</th>
					<th>姓名</th>
					<th>学号</th>
					<th>分数/总分</th>
					<th>准确率</th>
					<th>用时(S)</th>
				</tr>
				<tr v-for="(aScore,value) in scoreList.rank">
					<td>{{value+1}}</td>
					<td>{{aScore.name}}</td>
					<td>{{aScore.student_id}}</td>
					<td>{{aScore.score}}/{{aScore.sum}}</td>
					<td>{{aScore.accuracy}}</td>
					<td>{{aScore.times}}</td>
				</tr>
				<tr v-for="(uScore,value) in scoreList.list" v-if="uScore.isDo==false">
					<td>0</td>
					<td>{{uScore.name}}</td>
					<td>{{uScore.student_id}}</td>
					<td>0</td>
					<td>0</td>
					<td>0</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script scoped>
export default {
  name: 'Class',
  data () {
    return {
      classList:{},
      titleList:{},
      scoreList:{},
      titleId:0,
      classId:0
    }
  },
  beforeMount:function(){
  	// 获取班级列表
		this.$http.jsonp('/api/fetch/class').then(function(response){
			this.classList=response.body;
			// console.log(response.body)
		},function(error){
			alert('操作错误！')
		}).catch(function(error){
	      alert('请求被拒绝！')
	  });
	  // 获取标题列表
		this.$http({
			url:'/api/fetch/p_til',
			method:'jsonp',
			params:{jwt:localStorage.getItem('yardman_t_jwt')},
			emulateJSON:true,
		}).then(function(response){
			this.titleList=response.body;
			// console.log(response)
		},function(error){
			alert('操作错误！');
		});
  },
  methods:{
  	scoreCheck(){//成绩查询
  		this.$http({
			url:'/api/watch',
			method:'jsonp',
			params:{
				cid:this.classId,
				pid:this.titleId,
			},
			emulateJSON:true,
		}).then(function(response){
			this.scoreList=response.body;
			// console.log(response)
		},function(error){
			alert('操作错误！');
		});
  	}
  }
}
</script>

<style>
	#Class{
		height: 100%;
	}
	.ClassTableBoxC{
		height: 90%;
	}
	.aboutScoreCheck{
		line-height: 30px;
		font-size: 16px;
		margin-bottom: 15px;
	}
	.scoreSelect{
		padding: 4px 10px;
		border-radius: 6px;
		margin-right: 10px;
	}
	.scoreRadio{
		margin: 0 6px;
	}
	.scoreBtn{
		width: 80px;
		height: 30px;
		display: inline-block;
		margin-left: 40px;
		border: 1px solid #999;
		text-align: center;
		border-radius: 6px;
		cursor: pointer;
		line-height: 30px;
	}
	.scoreBtn:hover{
		background: #41B883;
		color: #fff;
	}
	.ClassTable tr td{
		padding: 4px 30px;
	}
</style>
