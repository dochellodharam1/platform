define(['jquery', 'Utility', 'TemplateProvider', 'timeAgo'], function($, Utility, TemplateProvider, timeAgo) {
	var articleTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<li class="news-article" style="padding: 5px !important;">
			<a target="_new" href="${url}" class="photo"> 
				<img src="${urlToImage}" class="cart-thumb" alt="" />
			</a>
			<p style="line-height: 1.3rem;">
				<a style="color: #797979" target="_new" href="${url}">${title}</a> 
			</p>
			<p class="m-top-10">${timeAgo} - <span class="price">${source.name}</span></p>
		</li>
	_TEMPLATE_*/});
	
	var instance = function(settings) {
		settings = settings || {callbacks : {} };
		var dummyFn = function(param) {};
		var defaults = {
			apiKey: '',
			container: "#notifications-dropdown",
			sources: ['bbc-news'],
			callbacks: {
				onNotificationClick: dummyFn
			}
		};
		
		var apiKey = settings.apiKey || defaults.apiKey;
		var container = settings.container || defaults.container;
		var sources = settings.sources || defaults.sources;
		var sourcesStr = sources[0]; // TODO:: 
		
		var onNotificationClick = settings.callbacks.onNotificationClick || defaults.callbacks.onNotificationClick;

		var url = 'http://newsapi.org/v2/top-headlines';
		$.get(url, {'country': 'in' ,'category': 'health', 'apiKey': apiKey})
		.then(function(data){
			if(data.status == 'ok') {
				$('.noti-counter').text(data.articles.length);
				for(var i in data.articles) {
					var article = data.articles[i];
					var date = new Date(Date.parse(article.publishedAt.replace('T', ' ').replace('Z', ' ')))
					article.timeAgo = timeAgo.format(date);
					if(!article.urlToImage) {
						article.urlToImage = 'https://via.placeholder.com/50x50.png?text=' + Utility.extractInitials(article.source.name);
					}
					var notifiation = TemplateProvider.parse(articleTemplate, article);
					$(container).append(notifiation);
				}
				var attribution = $('a.noti-powered-by');
				attribution.text('News API');
				attribution.attr('href', 'https://newsapi.org');
			}
		});
		
		$('.noti-remove-btn').click(function(){
			$(container).find('.news-article').remove();
		});
		
		
		return {};
	};
	
	return instance;
});
