window.onload = function() {
	/*获取当前时间并渲染*/
	var d = new Date()
	var vYear = d.getFullYear()
	var vMon = d.getMonth() + 1
	var vDay = d.getDate()
	var vWeek = d.getDay();
	var h = d.getHours();
	var m = d.getMinutes();
	var se = d.getSeconds();

	var today = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
	var vWeek = today[d.getDay()];
	oNow = vYear + "年" + (vMon < 10 ? "0" + vMon : vMon) + "月" + (vDay < 10 ? "0" + vDay : vDay) + "日" + " " + vWeek;
	$('.m-toolbar .now').html(oNow)
	
	/*市区下拉选择*/
	$('.selectCase-btn').click(function() {
		$('.selectCase-details,.select-jt2').fadeToggle();
		return false;
	})
	$('body,html').click(function() {
		$('.selectCase-details,.select-jt2').fadeOut();
	})

	/*地区点击选择*/
	$('.selectCase-list2 li').click(function() {
		$('.selectCase-btn .txt').html($(this).text());
		$('.selectCase-details,.select-jt2').fadeToggle();
	})

	/*热搜词点击*/
	$('.keys li').click(function() {
		$('.m-search input').val($(this).text())
	})

	/*新闻轮播图*/
	$.ajax({
		type: "get",
		url: "test/imgs.json",
		async: true,
		success: function(data) {
			/*获取图片信息并渲染页面*/
			var data = {
				data: data
			};
			var newSlider = $('#newSlider').html();
			var html = Mustache.render(newSlider, data);
			$('.pgwSlider').html(html)
			/*执行新闻轮播图*/
			$('.pgwSlider').pgwSlider();
		},
		error: function(msg) {
			alert('请使用localhost访问')
		}
	});

	/*最新公告*/
	$.ajax({
		type: "get",
		url: "test/index.json",
		async: true,
		success: function(data) {
			/*获取最新公告的头条新闻数据并渲染页面*/
			var hotNewsData = data.affiche.top;
			var hotNewsData = {
				hotNewsData: hotNewsData
			};
			var hotNews = $('#hotNews').html();
			var hotNewsHtml = Mustache.render(hotNews, hotNewsData);
			$('.hotNews').html(hotNewsHtml)
			/*获取最新公告的列表数据并渲染页面*/
			var newNoticedata = data.affiche.items;
			var newNoticedata = {
				newNoticedata: newNoticedata
			};
			var newList = $('#newList').html();
			var newListHtml = Mustache.render(newList, newNoticedata);
			$('.newList').html(newListHtml)
			/*获取政策速递数据并渲染页面*/
			var policyData = data.policy;
			var policyData = {
				policyData: policyData
			};
			var newList = $('#policyList').html();
			var policyHtml = Mustache.render(newList, policyData);
			$('.policyList').html(policyHtml)
			/*获取便民提示数据并渲染页面*/
			var tipData = data.tip;
			var tipData = {
				tipData: tipData
			};
			var newList = $('#tipList').html();
			var tipHtml = Mustache.render(newList, tipData);
			$('.tipList').html(tipHtml)
		}
	});

	/*微博互动轮播图*/
	var mySwiper = new Swiper('.swiper-container', {
		autoplay: 3000, //可选选项，自动滑动
		loop: true, //可选选项，开启循环
		slidesPerView: 4, //分成4栏
		autoplayDisableOnInteraction: false, //用户操作后继续执行
	})
	$('.arrow-left').on('click', function(e) { //左箭头
		e.preventDefault()
		mySwiper.swipePrev()
	})
	$('.arrow-right').on('click', function(e) { //右箭头
		e.preventDefault()
		mySwiper.swipeNext()
	})

	/*获取echarts数据*/
	$.ajax({
		type: "get",
		url: "test/chart.json",
		async: true,
		success: function(data) {
			/*办理时间段数据渲染*/
			var timeSlotX = [];
			var timeSlotY = [];
			for(var i = 0; i < data.timeSlot.length; i++) {
				timeSlotX.push(data.timeSlot[i].x);
				timeSlotY.push(data.timeSlot[i].y);
			}
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('timeSlot'), 'macarons');
			timeSlot = {
				calculable: true,
				grid: {
					x: '8%',
					y: '3%',
					x2: '10%',
					y2: '20%',
				},
				xAxis: [{
					type: 'category',
					boundaryGap: false,
					data: timeSlotX,
					axisLabel: {
						show: true,
						textStyle: {
							width: 10
						},
						lineStyle: {
							color: 'red',
							width: 10
						}
					},
					axisLine: {
						lineStyle: {
							color: '#65b3df',
						}
					},
				}],
				yAxis: [{
					type: 'value',
					axisLabel: {
						formatter: '{value}人'
					},
					axisLine: {
						lineStyle: {
							color: '#65b3df'
						}
					},
				}],
				series: [{
					name: '适合我的办理时间段',
					type: 'line',
					data: timeSlotY,
					markPoint: {
						data: [{
								type: 'max',
								name: '最大值'
							},
							{
								type: 'min',
								name: '最小值'
							}
						],
						itemStyle: {
							normal: {
								color: '#b6a2de',
							}
						},
					},
					markLine: {
						data: [{
							type: 'average',
							name: '平均值'
						}],
						itemStyle: {
							normal: {
								color: '#b6a2de',
							}
						},
					},
					itemStyle: {
						normal: {
							color: '#b6a2de',
						},
					},
				}]
			};
			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(timeSlot);
			
			/*办理共组破日数据渲染*/
			var workdayX = [];
			var workdayY = [];
			for(var i = 0; i < data.workday.length; i++) {
				workdayX.push(data.workday[i].x);
				workdayY.push(data.workday[i].y);
			}

			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('workday'), 'macarons');

			// 指定图表的配置项和数据
			workday = {
				lable: true,
				grid: {
					x: '8%',
					y: '20%',
					x2: '10%',
					y2: '20%',
				},
				xAxis: [{
					type: 'category',
					data: workdayX,
					axisLine: {
						lineStyle: {
							width: 0
						}
					},
				}],
				yAxis: [{
					type: 'value',
					axisLine: {
						lineStyle: {
							width: 0
						}
					},
				}],
				series: [{
					name: '适合我办理的工作日',
					type: 'bar',
					data: workdayY,
					markPoint: {
						data: [{
								type: 'max',
								name: '最大值'
							},
							{
								type: 'min',
								name: '最小值'
							}
						],
						itemStyle: {
							normal: {
								color: '#c12e34',
							}
						},
					},
					markLine: {
						data: [{
							type: 'average',
							name: '平均值'
						}],
						color: '#c12e34',
						itemStyle: {
							normal: {
								color: '#c12e34',
							}
						},
					},
					itemStyle: {
						normal: {
							color: '#c12e34',
							barBorderRadius: [0, 0, 0, 0],
						},
					},
				}]
			};
			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(workday);
		}
	});
	
}