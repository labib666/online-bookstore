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
# GET /users

+ Request (application/json)

    + Headers

    ```
        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    ```

+ Response (application/json)

```json
    {
        "_id": "5b6460ed42d8ee10c322eb3d",
            "name": "Zarin",
            "username": "zarin",
            "email": "zarinesterik@gmail.com",
            "isModerator": true,
            "__v": 0,
            "isAdmin": true
    },
    {
            "_id": "5b646558b09cbd1327f17b7a",
            "name": "test zero",
            "username": "test00",
            "email": "test00@gmail.com",
            "isModerator": false,
            "__v": 0,
            "isAdmin": false
        },
         {
            "_id": "5b758ff330bb9f2f607af43b",
            "name": "King Tchalla",
            "username": "blackpanther",
            "email": "panther@wakanda.com",
            "isModerator": false,
            "__v": 0,
            "isAdmin": false
        },
        {
            "_id": "5b86d7a42cc152178092fee3",
            "name": "test two",
            "username": "test02",
            "email": "test02@test.com",
            "isModerator": false,
            "__v": 0,
            "isAdmin": false
        }
```
# GET/users/me

+ Request (application/json)

    + Headers

    ```
        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    ```

+ Response (application/json)

```json
    {
        "user": {
        "_id": "5b86d7a42cc152178092fee3",
        "name": "test two",
        "username": "test02",
        "email": "test02@test.com",
        "isModerator": false,
        "__v": 0,
        "isAdmin": false
    }
```




