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

# POST /logout

+ Request (application/json)

    + Headers

    ```
        Authorization: Bearer 2erefkhjwrqr1i23rssndfiqwherakjhdfsfqer
    ```

+ Response (application/json)

```json
    {
        "removedToken": "2erefkhjwrqr1i23rssndfiqwherakjhdfsfqer"
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
# POST /social/google

+ Request (application/json)

```json
    {
        "id_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    }
```
+ Response (application/json)

```json
    {
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    }
```
# POST /social/facebook

+ Request (application/json)

```json
    {
        "id_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    }
```
+ Response (application/json)

```json
    {
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    }
```


