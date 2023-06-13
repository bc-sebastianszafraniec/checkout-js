import React, { FunctionComponent, useEffect } from 'react';

import {
    CheckoutButtonProps,
    CheckoutButtonResolveId,
    toResolvableComponent,
} from '@bigcommerce/checkout/payment-integration-api';

const CheckoutButton: FunctionComponent<CheckoutButtonProps> = ({
    checkoutService: { deinitializeCustomer, initializeCustomer },
    containerId,
    methodId,
    onUnhandledError,
}) => {
    useEffect(() => {
        initializeCustomer({
            methodId,
            [methodId]: {
                container: containerId,
                onUnhandledError,
            },
        })
        .then(beautifyCheckoutButtons)
        .catch(onUnhandledError);
        
        return () => {
            deinitializeCustomer({ methodId }).catch(onUnhandledError);
        };
        
    }, [containerId, deinitializeCustomer, initializeCustomer, methodId, onUnhandledError]);
    
    const beautifyCheckoutButtons = (): void => {
        if (methodId === "amazonpay") {
            if (!document.querySelector('.checkout-button-container')) {
                return;
            }

            const container = document.querySelector('#amazonpayCheckoutButton > div') as unknown as HTMLElement;
            if (!container) return;

            (container?.shadowRoot?.querySelector('.amazonpay-button-view1') as unknown as HTMLElement).style.height = '36px'
        }
    }

    return <div id={containerId} />;
};

export default toResolvableComponent<CheckoutButtonProps, CheckoutButtonResolveId>(
    CheckoutButton,
    [],
);
