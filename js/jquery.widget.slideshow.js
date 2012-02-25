/**
widget.slideshow.js
Version 	: 	1.0
Features 	: 	Horizontal Sliding
*/
(function($){
	var slideshowPrototype={
		options:{
			slidesSelector:'',
			slideAxis:'x',
			cycle:false,
			url:'',
			width:'300px', //The default width of the box
			height:'300px' //The default height of the box
		},
		_create:function(){
			console.log('create');
			var widget=this;
			var $domObject=widget.element;
			var options=widget.options;
		},
		_init:function(){
			var widget=this;
			var $domObject=widget.element;
			var options=widget.options;
			console.log('init');
			
			var slideElements = {};
			if(options.slidesSelector==''){
				//console.log("slideselector not set");
				slideElements=$domObject.children();
			}
			else{
				slideElements=$domObject.find(options.slidesSelector);
			}
			
			
			$domObject.data('currentSlide',0);
			
			//If the images are to be fetched asynchronously, fetch the data then proceed to widget creation.
			if(options.url){
				$.when(this._getUrlSource()).then(function(){
					//Wrap all the slides inside a div, and also create divs for the 
					//'prev' and 'next' controllers
					$domObject.wrapInner('<div></div>').append('<div></div>').append('<div></div>');
					var $prevControl=$domObject.children().eq(1);
					var $nextControl=$domObject.children().eq(2);
					
					//Perform the visual setup of the elements based upon the widget's options
					//for the layout of the widget.
					widget._visualSetup($domObject,options);
					
					//Initialize the slideshow controllers
					widget._navigationSetup($domObject,options);
				});
			}
			else{
				//Wrap all the slides inside a div, and also create divs for the 
				//'prev' and 'next' controllers
				$domObject.wrapInner('<div></div>').append('<div></div>').append('<div></div>');
				var $prevControl=$domObject.children().eq(1);
				var $nextControl=$domObject.children().eq(2);	
				
				//Perform the visual setup of the elements based upon the widget's options
				//for the layout of the widget.
				widget._visualSetup($domObject,options);
				
				//Initialize the slideshow controllers
				widget._navigationSetup($domObject,options);
			}
		},
		_visualSetup:function($domObject,options){
		
			//If a url is declared, then use it as the source for the images.
			//For example you can use a flickr rss feed as the URL
			
			var $slidesWrapper=$('div',$domObject).eq(0);
			var $prevControl=$domObject.children().eq(1);
			var $nextControl=$domObject.children().eq(2);
			
			var slidesHeight=$domObject.height();
			var slidesWidth=$domObject.width();
			var maxSlides = $slidesWrapper.children().size();
			
			//Calculate the total horizontal padding(including margins and borders) 
			//for any one child
			var $child=$slidesWrapper.children().eq(0);
			var horizontalPadding=$child.outerWidth(true)-$child.width();
			
			//Stretch the width and height of the children to that of the widget
			$slidesWrapper.children().css('height','100%');
			$slidesWrapper.children().css('width',slidesWidth-horizontalPadding);
			
			
			//Override the dimentions of the widget and fix its height to its original value
			//so that its children can float but the only visible part has the dimentions
			//of the initial widht and height of the widget.
			$domObject.css('height',slidesHeight);
			$domObject.css({'overflow':'hidden'});
			
			//Basic styling for the previous and next controls
			$nextControl.hover(function(){$(this).css('cursor','pointer');},function(){$(this).css('cursor','default');});
			$prevControl.hover(function(){$(this).css('cursor','pointer');},function(){$(this).css('cursor','default');});
			$prevControl.css({'opacity':'0.1'});
			$nextControl.css({'opacity':'0.1'});
			
			$prevControl.append('<div>'+''+'</div>');
			$nextControl.append('<div>'+''+'</div>');
			
			if(!options.cycle){
				$prevControl.hide();
			}
			
				
			//Perform styling of the 'prev' and 'next' controllers
			//Styling can be done either horizontally or vertacally 
			//depending upon the axis chosen by the user
			if(options.slideAxis=='y'){
			}
			else{
			
				//**Default to horizontal sliding and display the sliders on the left and right
				
				$slidesWrapper.css({'float':'left','position':'relative'});
				
				//Horizontal floating for the child elements to allow for horizontal sliding
				$slidesWrapper.children().css('float','left');
				
				//Set up the width of the parent slidesWrapper to that total width of all the slides
				//so as to enable the slides to float to the left
				var slidesWrapperWidth = (maxSlides*(slidesWidth+horizontalPadding));
				$slidesWrapper.css('width',slidesWrapperWidth);
				

				//Add custom classes to the slideshow controls
				$prevControl.addClass('left-slider-control').width(35);
				$nextControl.addClass('right-slider-control').width(35);
				
				//Calculate the heights of the sliding controls based upon the height of the slides
				$prevControl.css('top',-(slidesHeight-20));
				//$prevControl.css('height',slidesHeight);
				$nextControl.css('top',-(slidesHeight-20));
				//$nextControl.css('height',slidesHeight);
				//$prevControl.addClass('');
				//$nextControl.addClass('');
				
				//Vertically align the text of the controllers
				$('div',$nextControl).css('padding-top',$nextControl.height()/2.3);
				$('div',$prevControl).css('padding-top',$prevControl.height()/2.3);
				
			}
		},
		_navigationSetup:function($domObject,options){
			var widget=this;
			var $slidesWrapper=$('div',$domObject).eq(0);
			var $prevControl=$domObject.children().eq(1);
			var $nextControl=$domObject.children().eq(2);
			var maxSlides = $slidesWrapper.children().size();
			var slidesWidth=$domObject.width();
			
			
			
			$domObject.hover(function(){
				var activatePrevController=$domObject.data('activatePrevController');
				var activateNextController=$domObject.data('activateNextController');
				
				if(activatePrevController){
					$prevControl.animate({'opacity':'1.0'});
				}
				if(activateNextController){
					$nextControl.animate({'opacity':'1.0'});
				}
			},
			function(){
				$prevControl.animate({'opacity':'0.1'});
				$nextControl.animate({'opacity':'0.1'});
			});
			
			
			if(options.cycle){
			
				//Save data on the widget during initialization to indicate which controllers should be visible during startup
				//Initially, the controller for the previous slide should be disabled.
				$domObject.data('activateNextController',true);
				$domObject.data('activatePrevController',true);
				
				
				//widget._getNextSlide($domObject,options);
				$prevControl.click(function(){
					$this=$(this);
					console.log('cycle prev');
					
					var $lastSlide=$slidesWrapper.children().eq(maxSlides-1);
					//console.log($lastSlide.html());
					
					var lastSlideWidth=$lastSlide.outerWidth();
					$slidesWrapper.prepend($lastSlide);
					$slidesWrapper.css('margin-left',-(lastSlideWidth));
					$slidesWrapper.animate({'margin-left':'0px'})
					
				});
				$nextControl.click(function(){
					$this=$(this);
					console.log('cycle next');
					
					var $currentSlide=$slidesWrapper.children().eq(0);
					
					var currentSlideWidth=$currentSlide.outerWidth();
					$slidesWrapper.animate({'margin-left':-currentSlideWidth},function(){
						$slidesWrapper.append($currentSlide);
						$slidesWrapper.css({'margin-left':'0'});
					});
					
					
					//$slidesWrapper.css('margin-left',lastSlideWidth);
					//var currentMarginLeft=$slidesWrapper.css('margin-left');
					//console.log(currentMarginLeft);
					//$slidesWrapper.animate({'margin-left':'0'});
					
				});
			}
			else{
				//Whenever a control is clicked, we need to perform three tasks
			//1) Determine the next slide to be shown
			//2) Navigate to the next slide
			//3) If need be, modify the visual status of the controllers
			
			//Save data on the widget during initialization to indicate which controllers should be visible during startup
			//Initially, the controller for the previous slide should be disabled.
			$domObject.data('activateNextController',true);
			$domObject.data('activatePrevController',false);
			
			$prevControl.click(function(){
				$this=$(this);
				
				
				var currentSlide=$domObject.data('currentSlide');
				currentSlide--;
				console.log("currentSlide Prev: "+currentSlide);
				
				if(currentSlide>=0){
					$domObject.data('activatePrevController',true);
					$slidesWrapper.animate({'margin-left':-(currentSlide*slidesWidth)});
					$domObject.data('currentSlide',currentSlide);
				}
				if(currentSlide<=0){
					$domObject.data('activatePrevController',false);
					$prevControl.animate({'opacity':'0'},100,function(){
						$(this).hide();	
					});
				}
				else{
					$domObject.data('activateNextController',true);
					$prevControl.show().animate({'opacity':'1.0'},1000);
					$nextControl.show().animate({'opacity':'1.0'},1000);
				}
				
			});
			
			
			//When a user clicks on a control, determine the currently visible slide of the widget
			$nextControl.click(function(){
				$this=$(this);
				
				var currentSlide=$domObject.data('currentSlide');
				
				
				currentSlide++;
				console.log("currentSlide next :"+currentSlide);
				
				if(currentSlide<=(maxSlides-1)){
					$slidesWrapper.animate({'margin-left':-((currentSlide)*slidesWidth)});
					$domObject.data('currentSlide',currentSlide);
					$domObject.data('activateNextController',true);
				}
				if(currentSlide==(maxSlides-1)){
					$domObject.data('activateNextController',false);
					$nextControl.animate({'opacity':'0'},100,function(){
						$(this).hide();
					});
				}
				else{
					$domObject.data('activatePrevController',true);
					$prevControl.show().animate({'opacity':'1.0'},1000);
					$nextControl.show().animate({'opacity':'1.0'},1000);
				}
			});
			}
			
		},
		_getUrlSource:function(){
			var widget=this;
			var $domObject=widget.element;
			var options=this.options;
			
			var imgSource='';
			//console.log("options : " + options.url);
			console.log('flickr index : ' + options.url.indexOf('flickr'));
			if(options.url.indexOf('flickr')!=-1){
				urlSource='flickr';
				imgSource=options.url+'&format=json&jsoncallback=?'
			}
			else{
				
			}
			
			
			var dfd = $.Deferred(function(dfd){
				$.getJSON(imgSource, function(data){
					$.each(data.items, function(i,item){
						$("<img/>").attr("src", item.media.m).appendTo($domObject);
						console.log('fetched');
					});
					dfd.resolve();
				});
				
			});
			
			return dfd;
			
		}
		
	};

	$.widget('ui.slideshow',slideshowPrototype);
	
})(jQuery);