// Extends jQuery to truncate text content based on the width of the container. Requires overflow:hidden
(function( $ ) {
    $.fn.truncateToWidth = function (callback) {
        // Perform truncation for all of the selected elements (and return this for chaining)
        return this.each( function () {
            var self = $(this), ratio;

            // Save out the original text to be used in case the container grows
            if (!self.data('text')) {
                self.data('text', self.html());
            } else {
                self.html(self.data('text'));
            }
            
            // Save the width to compare in the watcher
            self.data('width', self.outerWidth());

            // Check if the text height is greater than the container height
            if (self[0].scrollHeight > self.outerHeight()) {
                // If so, use the ratio in height to determine how much to strip off (with a factor of 0.9 to account for rounding errors)
                ratio = self[0].scrollHeight / self.height();
                self.html(self.html().slice(0, self.html().length / ( ratio * 0.8)));
                // Since there is 0.1 extra text, remove it word by word until it fits
                while (self[0].scrollHeight > self.outerHeight()) {
                    self.html(self.html().slice(0, self.html().length -1));
                }

                // Add an ellipsis to the end of the string after making space and add a title attr for a tooltip
                self.html(self.html().slice(0, self.html().length - 3) + '...').attr('title', self.data('text'));

                // Run the callback if it is specified (passing the jquery this to it)
                if (typeof callback === 'function') {
                    callback(self);
                }
            } else {
                // Run the callback anyways
                if (typeof callback === 'function') {
                    callback(self);
                }
            }
            
            // Set a watch to see if the div width changes to run this again
            self.data('interval', setInterval( function () {
                // Compare the widths
                if (self.outerWidth() !== self.data('width')) {
                    // If the width is different, clear the timer and run the truncation again
                    clearInterval(self.data('interval'));
                    self.truncateToWidth(callback);
                }
            }, 500));
        });
    };
})(jQuery);