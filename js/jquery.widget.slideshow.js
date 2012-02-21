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
			slideControlWidth:30,
			cyclic:false
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
			
			
			//Wrap all the slides inside a div, and also create divs for the 
			//'prev' and 'next' controllers
			$domObject.wrapInner('<div></div>').append('<div></div>').append('<div></div>');
			var $prevControl=$domObject.children().eq(1);
			var $nextControl=$domObject.children().eq(2);
			
			$domObject.data('currentSlide',0);
			
			//Perform the visual setup of the elements based upon the widget's options
			//for the layout of the widget.
			this._visualSetup($domObject,options);
			
			//Initialize the slideshow controllers
			this._navigationSetup($domObject,options);
		},
		_visualSetup:function($domObject,options){
		
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
			
			$prevControl.append('<div>'+'<'+'</div>');
			$nextControl.append('<div>'+'>'+'</div>');
			
			if(!options.cyclic){
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
				$prevControl.addClass('left-slider-control').width(options.slideControlWidth);
				$nextControl.addClass('right-slider-control').width(options.slideControlWidth);
				
				//Calculate the heights of the sliding controls based upon the height of the slides
				$prevControl.css('top',-slidesHeight);
				$prevControl.css('height',slidesHeight);
				$nextControl.css('top',-slidesHeight);
				$nextControl.css('height',slidesHeight);
				
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
			
			
			if(options.cyclic){
			
				//Save data on the widget during initialization to indicate which controllers should be visible during startup
				//Initially, the controller for the previous slide should be disabled.
				$domObject.data('activateNextController',true);
				$domObject.data('activatePrevController',true);
				
				
				//widget._getNextSlide($domObject,options);
				$prevControl.click(function(){
					$this=$(this);
					console.log('cyclic prev');
					
					var $lastSlide=$slidesWrapper.children().eq(maxSlides-1);
					//console.log($lastSlide.html());
					
					var lastSlideWidth=$lastSlide.outerWidth();
					$slidesWrapper.prepend($lastSlide);
					$slidesWrapper.css('margin-left',-(lastSlideWidth));
					$slidesWrapper.animate({'margin-left':'0px'})
					
				});
				$nextControl.click(function(){
					$this=$(this);
					console.log('cyclic next');
					
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
			
		}
	
	};

	$.widget('ui.slideshow',slideshowPrototype);
	
})(jQuery);