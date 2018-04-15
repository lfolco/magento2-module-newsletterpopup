define([
    "jquery",
    "Magento_Ui/js/modal/modal",
    "mage/cookies",
    "mage/validation",
    "domReady!"

], function($,modal) {
    "use strict";

    $.widget('bitbull.popupNewsletter', {

        /**
         * @private
         */

        _init: function() {

            var $widget = this,
                delay   = this.options.delay,
                time    = this._getDelay(delay),
                cookie = 'newsletter',
                options = {
                  type: 'popup',
                  innerScroll: true,
                  title: $.mage.__(this.options.title),
                  modalClass: "newsletter-modal",
                  buttons: ''
                };


            var $hld = $('.popup-newsletter');

            function removeMessage() {
                $hld.find('.message').remove();
            }

            function showMessage(msg, error) {

                var type = error ? 'error' : 'success';
                var $msg = $(
                    '<div class="message-'+type+' '+type+' message">' +
                        '<div>'+msg+'</div>'+
                    '</div>');

                removeMessage();
                $hld.prepend($msg);

                if (error) {
                    setTimeout(function(){
                        removeMessage();
                    }, 4000);
                } else {
                    $hld.find('.content').hide();
                    setTimeout(function(){
                        $widget.element.modal('closeModal');
                    }, 4000);
                }
            }

            /* Init Ajax */
            if (this.options.use_ajax) {
                $hld.find('.form.subscribe').submit(function(){
                    var $form = $(this);
                    if (!$form.valid()) return;
                    $form.find('button').attr('disabled', 'disabled');
                    $.ajax({
                        url: $form.attr('action'),
                        dataType: 'json',
                        method: 'POST',
                        data: $form.serialize(),
                        success: function(res) {
                            if (res.success) {
                                showMessage(res.message);
                            } else {
                                showMessage(res.message, 1);
                            }
                        },
                        error: function() {
                            showMessage('Unexpected Error', 1);
                        },
                        complete: function(){
                            $form.find('button').removeAttr('disabled');
                        }
                    });
                    return false;
                });
            }

            /* Allow custom display */
            window.openNewsletterPopup = function () {
                removeMessage();
                $hld.find('.content').show();
                $widget._openModal(options, cookie);
            };

            if (this.options.display_mode == 0) {
                /* Display after time dalay */
                if (this._isCookieSet(cookie) != true) {
                    this._logTime(time, openNewsletterPopup);
                }
            }

        },

        /**
         * Open Modal and set cookie
         *
         * @param options
         * @param cookie
         * @private
         */

        _openModal: function (options, cookie) {

            var html   = this.element,
                popup  = modal(options, html);

               html.modal('openModal');
               this._setCookie(cookie);
        },

        /**
         * Return the remaining time
         * for the modal opening
         *
         * @param delay
         * @returns {*}
         * @private
         */

        _getDelay: function (delay) {

            var cookie = $.mage.cookies.get('popup-timing');
            if (cookie > 0 ) {
                return delay - cookie
            } else {
                return delay
            }
        },

        /**
         * Set remaining time cookie
         *
         * @param i
         * @param callback
         * @private
         */

        _logTime: function (i, callback) {

            callback = callback || function(){};
            var int = setInterval(function() {
                $.mage.cookies.set('popup-timing', i);
                i-- || (clearInterval(int), callback());
            }, 1000);
        },

        /**
         * Set cookie
         *
         * @param cookie
         * @private
         */

        _setCookie: function (cookie) {
            $.mage.cookies.set(cookie, 'yes',
                {lifetime: 342342342342});
        },

        /**
         * Check if cookie is set
         *
         * @param cookie
         * @returns {boolean}
         * @private
         */

        _isCookieSet: function (cookie) {
            if ($.mage.cookies.get(cookie) == 'yes') {
                return true;
            }
        }

    });

    return $.bitbull.popupNewsletter;
});
