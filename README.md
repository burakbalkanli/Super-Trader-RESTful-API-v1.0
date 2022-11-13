# Welcome the Super Trader API v1.0
## Node.JS || PostgreSQL || Sequelize

- Models
    - User
    - Portfolio
    - Share
    - Transaction

- User
    - /user 
        - Get information for all users.
    - /user/:id
        - Get information for user with users id.
    - /user/createUser 
        - Create a user with request body.
        - username, name, surname must be in the request body.
    - /user/updateUser/:id
        - Update a user with user id and request body.
        - username, name, surname must be in the request body.
    - /user/deleteUser/:id 
        - Delete a user with user id.

- Portfolio
    - /portfolio
        - Get information for all portfolios.
    - /portfolio/:userid
        - Get information of users portfolio with users id.

- Share
    - /share
        - Get information for all shares.
    - /share/createShare 
        - Create a share with request body.
        - code, name must be in the request body.
    - /share/updateShare/:id
        - Update a share with share id and request body.
        - code, name must be in the request body.
    - /share/deleteShare/:id
        - Delete a share with share id

- Transaction
    - /transaction
        - Get information for all transactions.
    - /transaction/buy
        - Buy a share with request body.
        - share code, username, unit must be in the request body.
    - /transaction/sell 
        - Sell a share with request body.
        - share code, username, unit must be in the request body.


