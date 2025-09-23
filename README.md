<!-- Header -->

<img src="./readme/title1.svg"/>
<br><br>

<!-- project overview -->
<img src="./readme/title2.svg"/>

> Slotify is a B2B SaaS platform designed to simplify and automate appointment and resource management for businesses. It leverages AI to:

> Automate client bookings and interactions through a WhatsApp AI assistant powered by a local LLM.

> Dynamically assign staff and resources to appointments, with smart handling of cancellations and conflicts, and instantly notify clients via WhatsApp with updates.

> Provide an AI-powered real-time call assistant for bookings, Q&A, and instant client support.

> With Slotify, businesses can reduce scheduling overhead, improve client communication, and ensure smooth operations even when staff availability changes unexpectedly.

<br><br>
<!-- Project Highlights -->
<img src="./readme/title4.svg"/>

### Why Slotify Stands Out


| Features Overview |
| --------------------------------------- |
| ![Slotify Features](./readme/Demo/features.png) |

<br><br>


<!-- System Design -->
<img src="./readme/title3.svg"/>

**All system design diagrams are available here:**
[Eraser Workspace - Slotify Diagrams](https://app.eraser.io/workspace/kpMq0AEkfNANwjx9BMP4?origin=share)

### Component Diagram

<img src="./readme/daigrams/Component-daigram.png" alt="Component Diagram" width="600"/> 

### ER Diagram

![ER Diagram](./readme/daigrams/ER-daigram.svg) 

### WhatsApp Booking Flow Diagram 

 ![WhatsApp Booking Flow Diagram](./readme/Demo/wp-booking-daigram.svg) 

### AI Call Flow Diagram

 ![AI Call Flow Diagram](./readme/Demo/Ai-call-daigram.svg) 

### Dynamic Staff Assignment Flow

 ![Dynamic Staff Assignment Flow](./readme/daigrams/dynamic-assign.svg) 

### N8N Workflow Integration

 ![N8N Workflow](./readme/Demo/N8N.png) 

<br><br>

<!-- Demo -->
<img src="./readme/title5.svg"/>

### Admin Screens (Web)

| Business Hub                            | Dashboard Overview                    |
| --------------------------------------- | ------------------------------------- |
| ![Business Hub](./readme/Demo/business-hub.png) | ![Dashboard](./readme/Demo/Dashboard.png) |

| Clients Management                    | Resources Management                 |
| ------------------------------------- | ------------------------------------- |
| ![Clients](./readme/Demo/Clients.png) | ![Resources](./readme/Demo/Resources.png) |

### Client Screens

| Real-time Voice Call |
| -------------------- |
| ![Real-time Call](./readme/Demo/Real-time-call.png) |

| Booking via WhatsApp (Video) | Services via WhatsApp (Video) |
| ---------------------------- | ----------------------------- |
| ![Booking via WhatsApp](./readme/Demo/booking-wp.gif) | ![Services via WhatsApp](./readme/Demo/service-wp.gif) |

<br><br>

#### Automatic Staff Assignment & Client Notification Example

![Auto-assign and Notify](./readme/Demo/ResourcesNotify-wp.jpg)


<!-- Development & Testing -->
<img src="./readme/title6.svg"/>

### Testing & Test Results

To run tests for the Next.js client:

```bash
cd client
npm test
```

To run tests for the Laravel backend:

```bash
cd server
php artisan test
```

| Next.js Test Results                    | Laravel Test Results                  |
| --------------------------------------- | ------------------------------------- |
| ![Next.js Tests](./readme/Demo/nextjs-tests.png) | ![Laravel Tests](./readme/Demo/laravel-tests.png) |

<br>

| Controller Example | Service Example |
| ------------------ | -------------- |
| ![Controller](./readme/Demo/Controller.png) | ![Service](./readme/Demo/Service.png) |


## AI Agent Process for Non-Technical Readers

**What is the AI Agent?**

The AI Agent is like a smart digital assistant that understands what customers want when they send messages or make voice calls to book appointments. It acts like a knowledgeable employee who can instantly help customers 24/7.

![How It Works](./readme/Demo/how-it-works.png) 

### Why This Matters for Businesses
 ![Why This Matters](./readme/Demo/why-matters.png) 

<!-- Deployment -->
<img src="./readme/title7.svg"/>

### API Testing with Postman

| Postman API 1                            | Postman API 2                       | Postman API 3                        |
| --------------------------------------- | ------------------------------------- | ------------------------------------- |
| ![Postman1](./readme/Demo/Postman1.png)  | ![Postman2](./readme/Demo/Postman2.png) | ![Postman3](./readme/Demo/Postman3.png) |

### API Documentation with Swagger

Swagger provides interactive API documentation for Slotify's backend endpoints. To access Swagger when running the application:

1. Start the Laravel backend server: `php artisan serve`
2. Navigate to `http://localhost:8000/api/documentation` in your browser
3. Explore and test API endpoints directly through the interactive interface

| Swagger Screenshot 1                    | Swagger Screenshot 2                  | Swagger Screenshot 3                  |
| --------------------------------------- | ------------------------------------- | ------------------------------------- |
| ![Swagger1](./readme/Demo/Swagger%201.png) | ![Swagger2](./readme/Demo/Swagger%202.png) | ![Swagger3](./readme/Demo/Swagger%203.png) |

### Linear Project Management

Linear was used for efficient project management and task tracking throughout the development of Slotify. The screenshots below showcase the organized workflow, issue tracking, and PRs.

| Linear Board 1                          | Linear Board 2                        | Linear Board 3                        |
| --------------------------------------- | ------------------------------------- | ------------------------------------- |
| ![Linear1](./readme/Demo/linear-1.png) | ![Linear2](./readme/Demo/linear-2.png) | ![Linear3](./readme/Demo/linear-3.png) |

<br><br>
