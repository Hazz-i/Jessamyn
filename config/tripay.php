<?php

return [
    'mode'          => env('TRIPAY_MODE', 'sandbox'),
    'api_key'       => env('TRIPAY_API_KEY'),
    'private_key'   => env('TRIPAY_PRIVATE_KEY'),
    'merchant_code' => env('TRIPAY_MERCHANT_CODE'),
    'callback_secret' => env('TRIPAY_CALLBACK_SECRET'),
    'return_url'    => env('TRIPAY_RETURN_URL'),

    'base_url' => fn () => env('TRIPAY_MODE', 'sandbox') === 'production'
        ? 'https://tripay.co.id/api'
        : 'https://tripay.co.id/api-sandbox',

    'endpoints' => [
        'channels'     => '/merchant/payment-channel',
        'calc_fee'     => '/merchant/fee-calculator',
        'create_tx'    => '/transaction/create',
        'detail_tx'    => '/transaction/detail',
        'close_tx'     => '/transaction/close',
    ],
];
