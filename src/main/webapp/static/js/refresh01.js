var pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset,
	generatedCount = 0;

function pullDownAction(obj) {
	setTimeout(function() { // <-- Simulate network congestion, remove setTimeout from production!
		alert("下拉刷新");
		loadrefresh();// Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000); // <-- Simulate network congestion, remove setTimeout from production!
}

function pullUpAction(obj) {
	setTimeout(function() { // <-- Simulate network congestion, remove setTimeout from production!
		alert("上拉加载");
		loadrefresh(); // Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000); // <-- Simulate network congestion, remove setTimeout from production!
}

var pullEl = document.getElementById("pullDown");
var pullOffset = pullEl.offsetHeight;

function loaded(pullDown,pullUp,wrapper) {
	pullDownEl = document.getElementById(pullDown);
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById(pullUp);
	pullUpOffset = pullUpEl.offsetHeight;
//	console.log(pullDownOffset);

	return new iScroll(wrapper, {
		topOffset: pullOffset,
		onRefresh: function() {
			if(pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新……';
			} else if(pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多……';
			}
		},
		onScrollMove: function() {
			if(this.y > 10 && !pullDownEl.className.match('flip')) {
//				console.log('000');
//				console.log(pullDownEl);
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放加载……';
				this.minScrollY = 0;
			} else if(this.y < 10 && pullDownEl.className.match('flip')) {
//				console.log('111');

				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新……';
				this.minScrollY = -pullDownOffset;
			} else if(this.y < (this.maxScrollY - 10) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新……';
				this.maxScrollY = this.maxScrollY;
			} else if(this.y > (this.maxScrollY + 10) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉在加载更多';
				this.maxScrollY = pullUpOffset;
			}
		},

		onScrollEnd: function() {
			if(pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中……';
				pullDownAction(); // Execute custom function (ajax call?)
			} else if(pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中……';
				pullUpAction(); // Execute custom function (ajax call?)
			}
		}
	});

	setTimeout(function() {
		document.getElementById(wrapper).style.left = '0';
	}, 800);
}

document.addEventListener('touchmove', function(e) {
	// 判断默认行为是否可以被禁用
	if(event.cancelable) {
		// 判断默认行为是否已经被禁用
		if(!event.defaultPrevented) {
			event.preventDefault();
		}
	}
}, false);


//document.addEventListener('DOMContentLoaded', function() {
//	setTimeout(loaded, 200);
//}, false);