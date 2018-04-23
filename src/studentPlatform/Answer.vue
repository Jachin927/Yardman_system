<template>
	<div id="Answer">
		<div id="Answer-content">
			<div class="Answer-head">
				<p class="p1">
					<span v-if="AnswerType==2">分数：{{Answertip.score}}</span><!-- 限时模式 -->
					<span v-if="PracticeType==2&&AnswerType==1">当前题数：{{AnswertipNum+1}}</span><!-- 无限模式 -->
					<span v-if="PracticeType==1||AnswerType==2">正确率：{{Answertip.accuracy}}%</span><!-- 经典模式,限时模式 -->
					<span v-if="PracticeType==1||AnswerType==2">进度：{{AnswertipNum+1}}/{{QuestionSum+1}}</span><!-- 经典模式，限时模式 -->
					<span v-if="PracticeType==2&&AnswerType==1" @click="s += 1">用时：{{Answertip.times}}秒</span><!-- 无限模式 -->
				</p>
				<p class="p2" v-if="AnswerType==2"><i>{{Answertip.sum_time-Answertip.times}}</i>秒 <span><span id="time" :style="'width:'+time+'%'"></span></span></p><!-- 限时模式 -->
			</div>
			<div id="PracticeType" v-if="AnswerType===1&&checkType">
				<span @click="getQuestion(1)">经典模式</span>
				<span @click="getQuestion(2)">一站到底模式</span>
			</div>
	 		<transition name="Answer-slide-fade">
				<template v-for="(question,val) in QuestionList" v-if="val==showQuestionNum">
					<div class="AnswerModel" v-if="Answermodelshow===0" >
						<div class="Answer-question">
							<p>{{val+1}}.{{question.question}}</p>
						</div>
						<ul class="Answer-sel">
							<li v-for="(select,vals) in question.select" @click="changAnswerModel(1,select,val,vals)">
								<span v-if="vals==0">A</span>
								<span v-else-if="vals==1">B</span>
								<span v-else-if="vals==2">C</span>
								<span v-else>D</span>
								{{select}}
							</li>
							<span id="selUlbg" v-if="errorshow"></span>
						</ul>
						<i v-if="errorshow">正确答案：{{question.right}}</i>
						<span class="next" @click="errorNext(1)" v-if="errorshow"></span>
					</div>
				</template>
			</transition>
	 		<transition name="Answer-slide-fade">
				<template v-for="(question,val) in QuestionList" v-if="val==showQuestionNum">
					<div class="AnswerModel"  v-if="Answermodelshow===1">
						<div class="Answer-question">
							<p>{{val+1}}.{{question.question}}</p>
						</div>
						<ul class="Answer-sel">
							<li v-for="(select,vals) in question.select" @click="changAnswerModel(0,select,val,vals)">
								<span v-if="vals==0">A</span>
								<span v-else-if="vals==1">B</span>
								<span v-else-if="vals==2">C</span>
								<span v-else>D</span>
								{{select}}
							</li>
							<span id="selUlbg" v-if="errorshow"></span>
						</ul>
						<i v-if="errorshow">正确答案：{{question.right}}</i>
						<span class="next" @click="errorNext(0)" v-if="errorshow"></span>
					</div>
				</template>
			</transition>
			<span id="endmodelBg" v-if="endshow"></span>
			<div id="endmodel" v-if="endshow">
				<h2>答题结束</h2>
				<p v-if="PracticeType==2">答题数量：{{AnswertipNum}}</p><!-- 一战到底模式 -->
				<p v-if="PracticeType!=1">用时：{{Answertip.times}}秒</p><!-- 一战到底模式，限时模式 -->
				<p v-if="AnswerType==2">正确率：{{Answertip.accuracy}}%</p><!-- 限时模式 -->
				<p v-if="AnswerType==2">分数：{{Answertip.score}}分</p><!-- 限时模式 -->
				<p v-if="AnswerType==2">-</p>
				<span v-if="login&&PracticeType!=1">用户名：{{loginList.usr.name}}</span>
				<span v-else>-</span>
				<span class="btn" @click="AnswerReturn(2)">重新开始</span>
				<span class="btn" v-if="login&&PracticeType!=1" @click="Submit()">提交</span>
			</div>
		</div>
		<!-- <div id="Answer-side">
			<div class="Answer-head" id="Answer-sideHead">
				<p>HTML第一次测试</p>
			</div>
			<ul>
				<li><span>试题类型</span>：HTML</li>
				<li><span>试题数量</span>：100</li>
				<li><span>答题时限</span>：200秒</li>
				<li><span>发布时间</span>：2018-03-10</li>
				<li><span>截至时间</span>：2018-03-11</li>
				<li><span>完成人数</span>：15/36</li>
			</ul>
		</div> -->
	</div>
</template>
<script>
	export default {
  name: 'Answer',
  props:['AnswerId','AnswerType','AnswerVal','login','loginList'],
  data(){
  	return{
  		jwt:""||localStorage.getItem("yardman_s_jwt"),
  		Answermodelshow:0,//选项轮换
  		showQuestionNum:0,//显示第几条问题
  		QuestionSum:0,//题目总数量
  		PracticeType:0,//类型答题模式：1-经典模式，2-一站到底模式
  		checkType:true,//练习模式选择模块是否出现
  		QuestionList:{},//获取到的题目
  		errorshow:false,//错误展示
  		errorCheck:-1,
  		Answertip:{
  			score:0,//分数
  			accuracy:0,//正确率
  			schedule:0,//进度
  			times:0,//用时
  			sum_time:0,//总共时间
  			right:0//正确题数
  		},
  		AnswertipNum:0,//当前题数
  		endshow:false,
  		t1:null,//计时器
  		time:null,
  		endlessRank:{},//提交无限时判断是否传输数据
  	}
  },
	beforeMount:function(){
		if (this.AnswerType==2) {//限时模式
  		this.$http({
        url:'/s_api/qs/timing',
        method:'jsonp',
        params:{qid:this.AnswerId},
        emulateJSON:true,
      }).then(function(response){
      	// console.log(response)
      	this.QuestionList=response.body.data.data;
      	this.Answertip.sum_time=response.body.data.time.time;
      	this.QuestionSum=this.QuestionList.length-1;
      },function(error){
        alert('操作错误！');
      }).catch(function(error){
        alert('请求被拒绝！')
      });
      let that=this;
      this.t1=setInterval(function(){
	      	that.Answertip.times++;
	      	if (that.Answertip.times==that.Answertip.sum_time) {
						that.endshow=true;
						clearInterval(that.t1);
	      	}
	      },1000)
  	}
  },
  methods:{
  	changAnswerModel:function(num,check,val,selectInd){//判断对错
  		this.errorCheck=selectInd;
  		console.log(this.errorCheck)
			if (check==this.QuestionList[val].right) {//答题正确
	  		if (this.AnswertipNum!=this.QuestionSum) {//未答完题目
	  			this.Answermodelshow=num;
	  			this.Answertip.score=this.Answertip.score+10;
	  			this.showQuestionNum++;
	  			this.AnswertipNum++;
	  			this.Answertip.right++;
	  		}
	  		else{//答完题目
	  			if(this.PracticeType==2){//一站到底模式
	  				clearInterval(this.t1);
		  			this.AnswertipNum++;
	  			}
	  			else if(this.AnswerType==2){//限时模式
	  				this.Answertip.right++;
		  			this.Answertip.score=this.Answertip.score+10;
		  			this.AnswertipNum++;
		  			clearInterval(this.t1);
	  			}
  				this.endshow=true;
	  		}
  		}
  		else{//答题错误
  			var Answer_li=document.getElementsByClassName('Answer-sel')[0].getElementsByTagName('li')[selectInd];
  			Answer_li.id='borderRed';

  			if (this.PracticeType==2) {
  				clearInterval(this.t1)
  			}
  			this.errorshow=true;
  		}
  	},
  	errorNext:function(num){//题目错误时下一题
  		if (this.PracticeType==1||this.AnswerType==2) {//经典模式，限时模式
	  		if (this.AnswertipNum==this.QuestionSum) {
	  				this.AnswertipNum++;
	  				this.endshow=true;
	  					clearInterval(this.t1);
				}else{
					this.Answermodelshow=num;
		  		this.errorshow=false;
		  		this.showQuestionNum++;
					this.AnswertipNum++;
				};
  		}
  		else if(this.PracticeType==2){//一战到底模式
  			this.endshow=true;
  		}
  		
  	},
  	getQuestion:function(val){//获取题目
  		this.checkType=false;
  		if (val==1) {//经典模式
				this.$http({
	        url:'/s_api/qs/classic',
	        method:'jsonp',
	        params:{tid:this.AnswerId},
	        emulateJSON:true,
	      }).then(function(response){
	      	// console.log(response)
	      	if (response.body.status==0) {
	      		alert(response.body.msg);
	      		this.$emit('returnIndex','msg');
	      		this.checkType=true;
	      	}else{
		        this.QuestionList=response.body.data;
		        this.QuestionSum=this.QuestionList.length-1;
		      }
	      },function(error){
	        alert('操作错误！');
	      }).catch(function(error){
	        alert('请求被拒绝！')
	      });
  		}else if(val==2){//一站到底模式
	  		let that=this;
  			this.$http({
	        url:'/s_api/qs/endless',
	        method:'jsonp',
	        params:{tid:this.AnswerId},
	        emulateJSON:true,
	      }).then(function(response){
	      	// console.log(response)
	      	if (response.body.status==0) {
	      		alert(response.body.msg);
	      		this.$emit('returnIndex','msg');
	      		this.checkType=true;
	      	}else{
			        this.QuestionList=response.body.data;
			        this.QuestionSum=this.QuestionList.length-1;
			        this.t1=setInterval(function(){
			      		that.Answertip.times++;
			      	},1000)
	      	}
	      },function(error){
	        alert('操作错误！');
	      }).catch(function(error){
	        alert('请求被拒绝！')
	      });
  		}
  		this.PracticeType=val;
  	},
  	AnswerReturn:function(ret){//重新开始
  		this.checkType=true;
  		this.endshow=false;
  		this.errorshow=false;
  		this.showQuestionNum=0;
  		this.Answertip.score=0;
  		this.Answertip.accuracy=0;
  		this.Answertip.schedule=0;
  		this.Answertip.times=0;
  		this.Answertip.right=0;
  		this.AnswertipNum=0;
  		this.PracticeType=0;
  		clearInterval(this.t1);
  		var Answer_li=document.getElementsByClassName('Answer-sel')[0].getElementsByTagName('li')[this.errorCheck];
  			Answer_li.id='';
  		if (ret==2) {
	  		if (this.AnswerId==1&&this.PracticeType==2) {
	  			let that=this;
		      this.t1=setInterval(function(){
		      	that.Answertip.times++;
		      },1000)
	  		}else if(this.AnswerType==2){
	  			let that=this;
		      this.t1=setInterval(function(){
		      	that.Answertip.times++;
		      	if (that.Answertip.times==that.Answertip.sum_time) {
							that.endshow=true;
							clearInterval(that.t1);
		      	}
		      },1000)
	  		}
  		}
  	},
  	Submit:function(){//提交
  		var Answer_li=document.getElementsByClassName('Answer-sel')[0].getElementsByTagName('li')[this.errorCheck];
			Answer_li.id='';
  		if (this.AnswerType==2) {//限时
	  		this.$http({
	        url:'/s_api/sub/timing',
	        method:'jsonp',
	        params:{
	        	jwt:this.jwt,
	        	cid:this.loginList.usr.class_id,
	        	pid:this.AnswerId,
	        	accuracy:this.Answertip.accuracy,
	        	score:this.Answertip.score,
	        	times:this.Answertip.times,
	        	sum:Number(this.QuestionSum+1)*10,
	        },
	        emulateJSON:true,
	      }).then(function(response){
	      	console.log(response)
	      	if (response.body.status==1) {
	      		alert(response.body.msg);
		      	this.$emit('returnIndex',this.AnswerVal);
		      	this.$emit('returnRank',{data:response.body.data,status:2})
	      	}else{
	      		alert(response.body.msg)
	      	}
	      },function(error){
	        alert('操作错误！');
	      }).catch(function(error){
	        alert('请求被拒绝！')
	      });
      	this.AnswerReturn(21);
	  	}
	  	else if(this.PracticeType==2){//无限
	  		this.endlessRank=this.loginList.rank.endless_rank;
	  		if (this.AnswertipNum>this.endlessRank.num||this.AnswertipNum==this.endlessRank.num&&this.Answertip.times<this.endlessRank.times) {
		  		this.$http({
		        url:'/s_api/sub/endless',
		        method:'jsonp',
		        params:{
		        	jwt:this.jwt,
		        	cid:this.loginList.usr.class_id,
		        	accuracy:this.Answertip.accuracy,
		        	num:this.AnswertipNum,
		        	times:this.Answertip.times,
		        },
		        emulateJSON:true,
		      }).then(function(response){
		      	if (response.body.status==1) {
			      	alert(response.body.msg);
			      	this.$emit('returnIndex','msg');
		      		this.$emit('returnRank',{data:response.body.data,status:1})
		      	}else{
		      		alert(response.body.msg)
		      	}
		      },function(error){
		        // alert('操作错误！');
		      }).catch(function(error){
		        alert('请求被拒绝！')
		      });
	  		}else{
	  			alert('提交成功！');
	  			this.$emit('returnIndex','msg');
	  		}
    		this.AnswerReturn(21);
	  	}
  	}
  },
  watch:{
  	AnswertipNum:function(newval,oldval){//计算正确率
			this.AnswertipNum==0?this.Answertip.accuracy=0:this.Answertip.accuracy=Math.round(Number(this.Answertip.right)/Number(this.AnswertipNum)*100);
  	},
  	'Answertip.times':function(newval,oldval){
  		this.time=Number(this.Answertip.sum_time-this.Answertip.times)/Number(this.Answertip.sum_time)*100;
  	}

  }
}
</script>

<style>
	#Answer{
		width: 1200px;
		position: relative;
	}
	#Answer-content{
		width: 800px;
		height: 540px;
		background: #fff;
		margin-top: 30px;
		margin-left: 12px;
		position: relative;
		border-radius: 10px 10px 0 0;
	}
	.Answer-head{
		width: 100%;
		height: 70px;
		position: relative;
		background: #0086cc;
		box-sizing: border-box;
		padding: 0 18px;
		border-radius: 10px 10px 0 0;
	}
	.Answer-head p{
		color: #fff;
		line-height: 70px;
		float: left;
	}
	.Answer-head .p1 span{
		display: inline-block;
		margin-right: 50px;
	}
	.Answer-head .p1 span:last-child{margin-right: 0;}
	.Answer-head .p2{
		float: right;
		line-height: 70px;
	}
	.Answer-head .p2 i{
		font-style: normal;
	}
	.Answer-head .p2 span{
		display: inline-block;
		width: 250px;
		height: 6px;
		background: #147db4;
		margin-left: 10px;
		border-radius: 10px;
		position: relative;
		top: -2px;
		overflow: hidden;
	}
	#time{
		content:"";
		width: 100%;
		height: 100%;
		background: #fff;
		position: absolute;
		right: 0;
		top: 0;
	}
	.Answer-question{
		width: 100%;
		height: 120px;
		text-align: center;
		position: relative;
	}
	.Answer-question p{
		width: 100%;
		box-sizing: border-box;
		padding:  0 20px;
		font-size: 18px;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}
	.Answer-sel{
		width: 450px;
		margin: 0 auto;
		position: relative;
	}
	.Answer-sel li{
		width: 450px;
		height: 55px;
		box-sizing: border-box;
		border: 1.2px solid #c9c9c9;
		line-height: 55px;
		padding-left: 53px;
		position: relative;
		text-align: center;
		margin: 10px 0;
		cursor: pointer;
		user-select: none;
	}
	.Answer-sel li span{
		display: inline-block;
		width: 52px;
		height: 40px;
		line-height: 40px;
		position: absolute;
		left: 0;
		top: 7px;
		border-right: 1px solid #c9c9c9;
	}
	.Answer-sel li:hover,.Answer-sel li:hover span{
		border-color: #0086cc;
	}
	.AnswerModel{
		width: 100%;
		position: absolute;
	}
	.AnswerModel i{
		display: inline-block;
		width: 100%;
		font-style: normal;
		text-align: center;
		line-height: 60px;
		font-size:24px;
		color: #009688;
	}
	.AnswerModel .next{
		width: 80px;
		height: 254px;
		display: inline-block;
		position: absolute;
		right: 5%;
		top: 28%;
		cursor: pointer;
	}
	.AnswerModel .next::before{
		content: "";
		display: inline-block;
		width: 60px;
		height: 2px;
		background: #000;
		position: absolute;
		top: 40%;
		left: 20%;
		transform: rotateZ(60deg);
	}
	.AnswerModel .next::after{
		content: "";
		display: inline-block;
		width: 60px;
		height: 2px;
		background: #000;
		position: absolute;
		top: 60%;
		left: 20%;
		transform: rotateZ(-60deg);
	}
	.AnswerModel .next:hover::after,.AnswerModel .next:hover::before{
		background: #009688;
	}
	#selUlbg{
		display: inline-block;
		width: 100%;
		height: 278px;
		background: transparent;
		position: absolute;
		top: 0;
	}


	#PracticeType{
		width: 100%;
		height: 470px;
		background: #fff;
		position: absolute;
		z-index: 2;
	}
	#PracticeType span{
		display: inline-block;
		padding: 16px 0px;
		width: 160px;
		text-align: center;
		color: #fff;
		background: #0086cc;
		border-radius: 14px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		cursor: pointer;
	}
	#PracticeType span:first-child{top: 35%;}
	#PracticeType span:hover{opacity: .8}
	#Answer-side{
		width: 350px;
		height: 540px;
		background: #fff;
		position: absolute;
		top: 0;
		right: 12px;
		border-radius: 10px 10px 0 0;
	}
	#Answer-sideHead{
		height: 70px;
	}
	#Answer-sideHead p{
		width: 100%;
		text-align: center;
	}
	#Answer-side ul{
		width: 100%;
		box-sizing: border-box;
		padding: 20px;
	}
	#Answer-side ul li{
		line-height: 40px;
	}
	#Answer-side ul li span{
		color: #0086cc;
		font-weight: bold;
	}

	#endmodel{
		width: 400px;
		/*height: 300px;*/
		background: #Fff;
		position: absolute;
		top: 55%;
		left: 50%;
		transform: translate(-50%,-50%);
		z-index: 3;
		text-align: center;
	}
	#endmodel h2{
		line-height: 60px;
	}
	#endmodel p{
		display: inline-block;
		width: 50%;
		float: left;
		line-height: 50px;
	}
	#endmodel span{
		display: block;
		width: 100%;
		line-height: 50px;
	}
	#endmodel span input{
		width: 200px;
		height: 30px;
		border-radius: 10px;
		outline: none;
		box-sizing: border-box;
		padding: 2px 8px;
	}
	#endmodel .btn{
		display: block;
		width: 200px;
		margin: 10px auto;
		border-radius: 10px;
		background: #fff;
		border:1px solid #ccc;
		cursor: pointer;
	}
	#endmodel .btn:hover{
		border-color: #0086cc;
		color: #0086cc;
	}
	#endmodelBg{
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(0,0,0,0.5);
		z-index: 2;
	}
	#borderGreen{
		border:1px solid #2db93f;
	}
	#borderRed{
		border:1px solid #d02f2f;
	}





.Answer-slide-fade-enter-active {
  transition: all .3s linear;
}
.Answer-slide-fade-leave-active {
  transition: all .3s linear;
}
.Answer-slide-fade-enter{
	transform: translateX(80px);
 	opacity: 0;
}
.Answer-slide-fade-enter-to{
  transform: translateX(0px);
  opacity: 1;
}
.Answer-slide-fade-leave-to{
	transform: translateX(-80px);
  opacity: 0;
}
</style>