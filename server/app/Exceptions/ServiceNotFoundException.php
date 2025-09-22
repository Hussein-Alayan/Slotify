<?php

namespace App\Exceptions;

use Exception;

class ServiceNotFoundException extends Exception
{
    public function __construct($message = "Service not found", $code = 404, Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}