<?php

namespace Bitbull\NewsletterPopup\Controller\Subscriber;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class NewAction extends \Magento\Newsletter\Controller\Subscriber\NewAction
{

    /**
     * New subscription action
     *
     * @throws \Magento\Framework\Exception\LocalizedException
     * @return void
     */
    public function execute()
    {
        if (!$this->getRequest()->isXmlHttpRequest()) {
            return parent::execute();
        }

        $data = ['success' => false];
        if ($this->getRequest()->isPost() && $this->getRequest()->getPost('email')) {
            $email = (string)$this->getRequest()->getPost('email');

            try {
                $this->validateEmailFormat($email);
                $this->validateGuestSubscription();
                $this->validateEmailAvailable($email);

                $subscriber = $this->_subscriberFactory->create()->loadByEmail($email);
                if ($subscriber->getId()
                    && $subscriber->getSubscriberStatus() == \Magento\Newsletter\Model\Subscriber::STATUS_SUBSCRIBED
                ) {
                    throw new \Magento\Framework\Exception\LocalizedException(
                        __('This email address is already subscribed.')
                    );
                }

                $status = $this->_subscriberFactory->create()->subscribe($email);
                $data['success'] = true;
                if ($status == \Magento\Newsletter\Model\Subscriber::STATUS_NOT_ACTIVE) {
                    $data['message'] = __('The confirmation request has been sent.');
                } else {
                    $data['message'] = __('Thank you for your subscription.');
                }
            } catch (\Magento\Framework\Exception\LocalizedException $e) {
                $data['message'] = __('There was a problem with the subscription: %1', $e->getMessage());
            } catch (\Exception $e) {
                $data['message'] =  __('Something went wrong with the subscription.');
            }
        }
        $this->getResponse()->setBody(
            \Zend_Json::encode($data)
        );
    }
}
