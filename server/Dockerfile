# Use official PHP 8.2 FPM image
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libonig-dev \
    curl \
    npm \
    && docker-php-ext-install pdo_pgsql mbstring

# Set working directory inside container
WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./
# Copy the rest of your Laravel app
COPY . .
# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# Install dependencies and run artisan commands now that artisan exists
RUN composer install && php artisan config:clear

# Expose port for Laravel dev server
EXPOSE 8000

# Start Laravel dev server
CMD php artisan serve --host=0.0.0.0 --port=8000
