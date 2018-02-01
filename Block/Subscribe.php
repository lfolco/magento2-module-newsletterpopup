<?php

namespace Bitbull\NewsletterPopup\Block;

/**
 * @api
 * @since 100.0.2
 */
class Subscribe extends \Magento\Newsletter\Block\Subscribe
{
    /**
     * Retrieve form action url and set "secure" param to avoid confirm
     * message when we submit form from secure page to unsecure
     *
     * @return string
     */
    public function getFormActionUrl()
    {
        return $this->getUrl('bbnewsletterpopup/subscriber/new', ['_secure' => true]);
    }
}
