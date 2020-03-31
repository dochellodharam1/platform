define(['jquery', 'lib/ConfigProvider', 'lib/Utility', 'lib/TemplateProvider'], function($, ConfigProvider, Utility, TemplateProvider) {
	var articleTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<li class="news-article" style="padding: 5px !important;">
			<a target="_new" href="${url}" class="photo"> 
				<img src="${urlToImage}" class="cart-thumb" alt="" />
			</a>
			<p style="line-height: 1.3rem;">
				<a style="color: #797979" target="_new" href="${url}">${title}</a> 
			</p>
			<p class="m-top-10">${timeAgo} - <span class="price">${sourceName}</span></p>
		</li>
	_TEMPLATE_*/});
	
	var instance = function(settings) {
		settings = settings || {callbacks : {} };
		var dummyFn = function(param) {};
		var defaults = {
			container: "#notifications-dropdown",
			callbacks: {
				onNotificationClick: dummyFn
			}
		};
		
		var apiKey = settings.apiKey || defaults.apiKey;
		var container = settings.container || defaults.container;
		
		var onNotificationClick = settings.callbacks.onNotificationClick || defaults.callbacks.onNotificationClick;
		
		var config = new ConfigProvider();
		
		$.get(config.NOTIFICATION_API.url)
		.then(function(data){
			$('.noti-counter').text(data.content.length);
			for(var i in data.content) {
				var article = data.content[i];
				var date = new Date(Date.parse(article.publishedAt.replace('T', ' ').replace('Z', ' ')))
				article.timeAgo = Utility.formatByTimeAgo(date);
				if(!article.urlToImage) {
					article.urlToImage = 'https://via.placeholder.com/50x50.png?text=' + Utility.extractInitials(article.source.name);
				}
				var notifiation = TemplateProvider.parse(articleTemplate, article);
				$(container).append(notifiation);
			}
			$('.attribution').html(config.NOTIFICATION_API.attribution);
		});
		
		$('.noti-remove-btn').click(function(){
			$(container).find('.news-article').remove();
		});
		
		
		return {};
	};
	
	return instance;
});
