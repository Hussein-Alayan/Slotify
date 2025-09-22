<?php

return [

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'auth/*',
        'oauth/*',
        'login',
        'logout',
        'register',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000', // Next.js frontend in dev
        'https://myapp.com',     // production frontend
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
