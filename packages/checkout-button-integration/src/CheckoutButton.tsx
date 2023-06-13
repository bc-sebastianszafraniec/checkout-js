import React, { FunctionComponent, useCallback, useEffect } from 'react';

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
    const beautifyCheckoutButtons = useCallback((): void => {
        if (methodId === 'amazonpay') {
            if (!document.querySelector('.checkout-button-container')) {
                return;
            }

            const container: HTMLElement | null = document.querySelector(
                '#amazonpayCheckoutButton > div',
            );

            if (!container || !container.shadowRoot) return;

            const amazonPayButton: HTMLElement | null =
                container.shadowRoot.querySelector('.amazonpay-button-view1');

            if (amazonPayButton) {
                amazonPayButton.style.height = '36px';
            }
        }
    }, [methodId]);

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
    }, [
        containerId,
        deinitializeCustomer,
        initializeCustomer,
        methodId,
        onUnhandledError,
        beautifyCheckoutButtons,
    ]);

    return <div id={containerId} />;
};

export default toResolvableComponent<CheckoutButtonProps, CheckoutButtonResolveId>(
    CheckoutButton,
    [],
);
