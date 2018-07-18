# POST /login

+ Request (application/json)

```json
    {
        "username": "testuser",
        "password": "123456"
    }
```
+ Response (application/json)

```json
    {
        "token": "2erefkhjwrqr1i23rssndfiqwherakjhdfsfqer"
    }
```

# POST /user/{userID}

+ Request (application/json)

    + Headers

    ```
        Authorization: Bearer 2erefkhjwrqr1i23rssndfiqwherakjhdfsfqer
    ```

+ Response (application/json)

```json
    {
        "_id": "rssndfiqwheasfersdf343sgsadf",
        "email": "testuser@example.com",
        "name": "Test User",
        "username": "testuser"
    }
```
