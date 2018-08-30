# POST /register

+ Request (application/json)

```json
    {
        "name":"Test User",
        "username": "testuser",
        "password": "123456",
        "email": "testexample@test.com"
    }
```
+ Response (application/json)

```json
    {
        "user": "5b86d7a42cc152178092fee3"
    }
```
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
        "user": 
        "_id": "5b86d7a42cc152178092fee3",
        "name": "test two",
        "username": "test02",
        "email": "test02@test.com",
        "isModerator": false,
        "__v": 0,
        "isAdmin": false
    }
```
# GET /users/search

+ Request (application/json)
   
    + Headers

    ```
        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    ```
     ```json
    {
        "query": "Harry Potter"
    }
    ```
  


+ Response (application/json)

```json
    {
        "user": 
        "_id": "5b86d7a42cc152178092fee3",
        "name": "test two",
        "username": "test02",
        "email": "test02@test.com",
        "isModerator": false,
        "__v": 0,
        "isAdmin": false
    }
```
# GET /users/bookings

+ Request (application/json)

    + Headers

    ```
        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    ```

+ Response (application/json)

```json
    {
       "bookings": [
            {
                "_id": "5b870ab92cc152178092fef5",
                "user_id": "5b86d7a42cc152178092fee3",
                "book_id": "5b646494b09cbd1327f17b78",
                "quantity": 3,
                "status": "pending",
                "updatedAt": "2018-08-29T21:06:10.503Z",
                "createdAt": "2018-08-29T21:06:01.985Z",
                "__v": 0
            },
            {
                "_id": "5b870ab92cc152178092fef6",
                "user_id": "5b86d7a42cc152178092fee4",
                "book_id": "5b646494b09cbd1327f17b74",
                "quantity": 2,
                "status": "approved",
                "updatedAt": "2018-08-29T21:06:10.503Z",
                "createdAt": "2018-08-29T21:06:01.985Z",
                "__v": 0
            }
       ]
    }
```
# GET /users/ratings

+ Request (application/json)

    + Headers

    ```
        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    ```

+ Response (application/json)

```json
    {
        "ratings": [
        {
            "_id": "5b870cca2cc152178092fef8",
            "user_id": "5b86d7a42cc152178092fee3",
            "book_id": "5b646494b09cbd1327f17b78",
            "rating": 5,
            "review": "",
            "updatedAt": "2018-08-29T21:14:50.667Z",
            "createdAt": "2018-08-29T21:14:50.667Z",
            "__v": 0
        }
    ]
    }
```
# GET /API/books

+ Request (application/json)

    + Headers

    ```
        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    ```

+ Response (application/json)

```json
    {
       "books": [
            {
                "_id": "5b646494b09cbd1327f17b78",
                "title": "Harry Potter and the Sorcerer's Stone",
                "author": "J.K. Rowling",
                "ISBN": "0439554934",
                "__v": 0,
                "categories": [
                    "Fiction"
                ]
            }
        ]
    }
```
# POST/api/books

+ Request (application/json)
   
    + Headers

    ```
        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    ```
     ```json
    {
       "title":"And the mountains echoed",
       "author":"Khaled Hossaini",
       "ISBN":"159463176X"
    }
    ```
  


+ Response (application/json)

```json
    {
        "book": "5b878ae2854120229b6e1a6e"
    }
```
# GET/api/books/:id

+ Request (application/json)
   
    + Headers

    ```
        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    ```
     ```json
    {
       "book._id":"5b878ae2854120229b6e1a6e"
    }
    ```
  


+ Response (application/json)

```json
    {
        "book": {
        "_id": "5b878ae2854120229b6e1a6e",
        "title": "And the Mountains Echoed",
        "author": "Khaled Hosseini",
        "ISBN": "159463176X",
        "__v": 0,
        "categories": []
    }
    }
```
# GET/api/books/search

+ Request (application/json)
   
    + Headers

    ```
        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    ```
     ```json
    {
       "search":"Harry Potter and the Sorceror's Stone"
    }
    ```
  


+ Response (application/json)

```json
    {
        "books": [
        {
            "_id": "5b646494b09cbd1327f17b78",
            "title": "Harry Potter and the Sorcerer's Stone",
            "author": "J.K. Rowling",
            "ISBN": "0439554934",
            "__v": 0,
            "categories": [
                "Fiction"
            ]
        }
    ]
    }
```










