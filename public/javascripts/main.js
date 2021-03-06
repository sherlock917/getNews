$(document).ready(function(){
	GetNewsMain.init();
});

var GetNewsMain = {
	init : function(){
		GetNewsMain.bindEvent();
	},
	bindEvent : function(){
		$('.nav-btn').bind('tap',GetNewsMain.getList());
		$('#news-list-more').bind('tap',GetNewsMain.getListMore());
	},
	getList : function(){
		return function (e){
			$('#news-list-title').text($(e.target).text());
			$('#news-list-more').attr('urlstr', $(e.target).attr('urlstr')).attr('nextpage', parseInt($(e.target).attr('nextpage')) + 1);
			GetNewsMain.getListAjax(e);
		}
	},
	getListMore : function(){
		return function (e){
			GetNewsMain.getListAjax(e);
			$('#news-list-more').attr('nextpage', parseInt($('#news-list-more').attr('nextpage')) + 1);
		}
	},
	getListAjax : function(e){
		$.getJSON('/list/' + $(e.target).attr('urlstr') + '/' + $(e.target).attr('nextpage'),
		function(result){
			$.each(result, function(i, item){
				var link = $(Template.news_link);
				link.find('.news-link').attr('urlstr',item.link);
				link.find('.news-title').text(item.title);
				link.find('.news-from').text(item.from + ':');
				link.find('.news-date').text(item.date);
				link.bind('tap',GetNewsMain.getArticle());
				$('#news-list').append(link);
			});
		});
	},
	getArticle : function(){
		return function (e){
			$.getJSON('/article' + $(e.target).parent('.news-link').attr('urlstr'),
			function(result){
				$('#news-article-title').text(result.title);
				$('#news-article-content').html(result.content);
				//fix the image problems
				GetNewsMain.getArticleImages();
			});
		}
	},
	getArticleImages : function(){
		var windowWidth = $(window).width();
		var img = $('#news-article-content').find('img');
		for(var i = 0; i < img.length; i++){
			//handle the url problem
			var srcStr = 'http://info.scau.edu.cn/' + $(img[i]).attr('src');
			$(img[i]).attr('src', srcStr);
			//fix the style of images
			var proportion = $(img[i]).attr('width') / $(img[i]).attr('height');
			$(img[i]).attr('width', windowWidth * 0.9);
			$(img[i]).attr('height', windowWidth * 0.9 / proportion);
			$(img[i]).parent().css('text-align', 'center');
		}
	}
}