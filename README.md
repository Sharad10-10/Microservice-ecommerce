Complete documentation for this project can be found here......

Tech Used:- Node.js, Express.js, React, TypeScript, Javascript, MongoDb, Docker, Kafka.js, Stripe for payment, JWT secured authentication with cookies, Tailwind Css and Resend for email service.

About this project:
This is a microservice emcommerce project which is integrated with kafkajs for communication based on events for each services and containerized with docker. 
It is scalable design to handle product management, user authentication, order processing and payment system. This application follows the architecture that mainly focuses on scalability and maintainability as everything has been created using independent services.

The project follows below given microservice architecture:
1. Analytic service:- To listen to important events and keep information of it.
2. Auth-service:- To handle user authentication and authorization.
3. Cart-service:- To handle user cart functionality.
4. Order-service:- Creates order for user and its tracking.
5. Payment service:- Handles user payment for order.
6. Product serivce:- Manages product information.

Run this project in your system? It can be handy but hang tight! I will guide you through this. I've got you!
1. First download the source code or clone the project from my repository.
2. Then open terminal and type npm install which will install necessary dependencies for the project.
3. Then go to each services for example, cd auth-service, cd order-service and then npm install, it will install necessary dependencies for particular service to run the project.
4. Then for each service, create .env file, create:
    PORT(keep in index.js to run server),
    your MONGODB_URL(to connect to database)
    JWT_SECRET(your jwt secret key)
    REFRESH_SECRET(generate a random token and keep in it)
    RESEND_API_KEY(go to resend, create account and it will provide you api key and keep the api key in it if you want email-service up and running properly)
    FRONTEND_URL(http://localhost:3000)
    STRIPE_SECRET_KEY(go to stripe, create account, find api key for you account and keep in it for payment-service)
5. If everything included, for each service type npm run dev and do cd frontend and npm run dev and it will start up and running.
6. Go to web and explore.


KEY FEATURES:
1. Secured user authentication and authorization using JWT.
2. Browse products and navigate through it.
3. Add or remove products from cart.
4. Payment using stripe and place orders.
5. User profile > My orders to view order history made by user.
   



