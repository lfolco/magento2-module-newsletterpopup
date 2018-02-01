<?php

namespace Bitbull\NewsletterPopup\Model\Config\Source;

/**
 * Display mode
 *
 */
class DisplayMode implements \Magento\Framework\Option\ArrayInterface
{
    /**
     * @const string
     */
    const AFTER_TIME_DELAY = 0;

    /**
     * @const string
     */
    const CUSTOM = 1;

    /**
     * Options getter
     *
     * @return array
     */
    public function toOptionArray()
    {
        return [
            ['value' => self::AFTER_TIME_DELAY, 'label' => __('After Time Dalay')],
            ['value' => self::CUSTOM, 'label' => __('Custom')],
        ];
    }

    /**
     * Get options in "key-value" format
     *
     * @return array
     */
    public function toArray()
    {
        $array = [];
        foreach ($this->toOptionArray() as $item) {
            $array[$item['value']] = $item['label'];
        }
        return $array;
    }
}
