

# Topup Game Admin Web App & API

This Node.js backend project supports a top-up game app and its admin dashboard. It uses Express for routing and middleware, JWT for authentication and authorization, and integrates with MongoDB to store user and game data. The project includes APIs for user auth, game transactions, leaderboard, and the admin dashboard for game management and statistics. Users can top-up their game account and track their progress through the leaderboard, providing a secure and seamless gaming experience.


## Table of Contents

1. [Installation](##installation)
2. [Usage](##usage)
3. [API Documentation](##api-documentation)
4. [Acknowledgements](##acknowledgements)


## Installation

1. Prerequisites: 
  - Node.js (https://nodejs.org/en/download/)
  - MongoDB (https://docs.mongodb.com/manual/installation/)

2. Clone the repository: 
    `git clone https://github.com/[YOUR-USERNAME]/[YOUR-PROJECT-NAME].git`

3. Install dependencies: 
    `npm install`

4. Set environment variables: 
    Create a `.env` file and set the environment variables. Use `env` file as reference.

5. Start the server: 
    `npm start`

6. Open the app: 
    Access the app in your browser at `http://localhost:5000`.



## Usage

1. Register: 
Click on the "Register a new membership" button and fill out the registration form.

2. Login: 
Use your email and password to log in.

3. Admin Dashboard: 
Access statistics, and track progress.

3. Kategori: 
Manage game category

3. Nominal: 
Manage game coin

3. Voucher: 
Manage game voucher

3. Bank: 
Manage bank account for payment destination

3. Pembayaran: 
Manage payment category

3. Transaksi: 
Validate transaction

6. Logout: 
Click on your username onthe top right button then click "Logout" button to log out of the application.


## API Documentation

#### Using the APIs

The following APIs are available in this project:

1. User authentication API
    * POST `/api/v1/auth/signup`: Register a new user.
    * POST `/api/v1/auth/signin`: Log in an existing user.

2. Category
    * GET `/api/v1/players/category`: Get game categories

3. Profile
    * GET `/api/v1/players/profile`: Get user profile (Note: This action requires a valid JSON Web Token (JWT), so the user must first log in.)
    * PUT `/api/v1/players/profile`: Edit user profile (Note: This action requires a valid JSON Web Token (JWT), so the user must first log in.)

4. History
    * GET `/api/v1/players/history?status=pending`: Get tansaction histories (Note: This action requires a valid JSON Web Token (JWT), so the user must first log in.)
    * GET `/api/v1/players/history/[id]`: Get detail tansaction history (Note: This action requires a valid JSON Web Token (JWT), so the user must first log in.)

You can find more details on how to use these APIs, including the request and response formats, in the [API Documentation](https://documenter.getpostman.com/view/14858801/UVC2HpMb).

Please note that some API requests must include a valid JSON Web Token (JWT) in the header for authentication and authorization purposes.


## Acknowledgements

This project was developed as part of an online course on Build With Angga
