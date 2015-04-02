/* 
Change the position of the slider popup so it follows the slider thumb position.
Not the most beautiful solution to use setInterval. But there is no elegant way of detecting when 
the slider changes value in meteor, due to reactive changes in meteor.
*/
setInterval(function() {
	$('.slider').each(function() {
		$this = $(this);
		
		var sliderValue = $this.find('input').val();			//Get the current value of the slider input
		
		//Position slider popup next to the slider thumb
		var $sliderPopup = $this.find('.popup');				//Get the slider "popup"
		var margin = $this.width() * (sliderValue / 100);		//Calculate the X coordinate where the slider thumb is
		$sliderPopup.css('margin-left', margin);				//Position the slider popup at the same position as the slider thumb
		
		//Set the value of the slider popup to the same value as the slider input
		var $sliderPopupValue = $sliderPopup.find('.value');
		$sliderPopupValue.text(sliderValue);
	});
}, 50);