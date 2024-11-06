import { Locales, PaymentStepAsGuestPreset, test } from '@bigcommerce/checkout/test-framework';

test.describe('Moneris', () => {
    test('Customer should be able to pay using CC with Moneris through the payment step in checkout', async ({
        assertions,
        checkout,
        page,
    }) => {
        // 1. Testing environment setup
        await checkout.use(new PaymentStepAsGuestPreset('CAD', 'CA', Locales.CA));
        await checkout.start('CC with MONERIS in Payment Step');
        // Optional: Add mockups.

        await checkout.route(
            /https:\/\/bigpay.service.bcdev\/pay\/hosted_forms\/.+\/field?.+|http:\/\/localhost:.+\/checkout\/payment\/hosted-field?.+/,
            `${__dirname}/support/hostedField.ejs`,
        );

        // await checkout.route(
        //     'https://js.mollie.com/v1/mollie.js',
        //     `${__dirname}/support/mollie.mock.js`,
        // );

        await page.route('**/api/public/v1/orders/payments', (route) => {
            void route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: '{"status":"ok","three_ds_result":{"acs_url":null,"payer_auth_request":null,"merchant_data":null,"callback_url":null},"provider_data":null,"errors":[]}',
            });
        });

        await page.route('https://esqa.moneris.com/HPPtoken/request.php', (route) => {
            void route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: '{"dataKey":"ot-Yg4iH1CoCEopY3swgq95x8iP4","bin":"545454","responseCode":["001"]}',
            });
        });

        // 2. Playwright actions
        await checkout.goto();
        // await page.pause();
        // await checkout.selectPaymentMethod('credit_card');
        // await page.waitForSelector('#monerisDataInput');
        // await page.locator('#monerisDataInput').getByRole('textbox').fill('5454545454545454');
        // await page.locator('#monerisCVDInput').getByRole('textbox').fill('123');
        // await page.locator('#monerisExpInput').getByRole('textbox').fill('12/25');

        await checkout.placeOrder();

        // 3. Assertions
        await assertions.shouldSeeOrderConfirmation();
    });
});
