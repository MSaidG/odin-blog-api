# odin-blog-api

## TO-DO's

[X] Authentication
[X] Authorization
[X] CRUD for blogs
[ ] Published and unpublished blogs
[ ] CRUD for comments

### BONUS

[ ] Pagination
[ ] Filter
[ ] Sort
[ ] Search

- Blog should have posts and comments
- Leave username of author and timestamp for comments
- Post(id, title, text, comments, isPublished, author, timestamp)
- User(id, username, email, password, [enum] =>(blogger, basic, admin) status )

> [!NOTE]
> Implement JWT authentication with refresh token (stored in database encrypted)
> When receive 401 status error from API, refresh access token and try again from client side

> [!IMPORTANT]
> NEED 2 CLIENT (author, normal) AND 1 API SERVER

> [!NOTE]
> USE POSTMAN FOR API TEST

### API DESIGN

| Method | Endpoint                                         |
| ------ | ------------------------------------------------ |
| POST   | /auth/login                                      |
| POST   | /auth/signup                                     |
| GET    | /users                                           |
| GET    | /posts                                           |
| GET    | /comments                                        |
| GET    | /users/:userId                                   |
| GET    | /users/:userId/posts/:postId                     |
| GET    | /users/:userId/posts                             |
| GET    | /users/:userId/comments/                         |
| GET    | /users/:userId/posts/:postId/comments            |
| POST   | /users/:userId                                   |
| PUT    | /users/:userId                                   |
| DELETE | /users/:userId                                   |
| POST   | /users/:userId/posts/:postId                     |
| PUT    | /users/:userId/posts/:postId                     |
| DELETE | /users/:userId/posts/:postId                     |
| GET    | /users/:userId/comments/:commentId               |
| DELETE | /users/:userId/comments/:commentId               |
| POST   | /users/:userId/comments/:commentId               |
| PUT    | /users/:userId/comments/:commentId               |
| GET    | /users/:userId/posts/:postId/comments/:commentId |
| DELETE | /users/:userId/posts/:postId/comments/:commentId |
| POST   | /users/:userId/posts/:postId/comments/:commentId |
| PUT    | /users/:userId/posts/:postId/comments/:commentId |

> [!IMPORTANT]
> Provide query params for pagination, sort, filter

- /users?limit=10&offset=0&sort=desc&username=Smith
- /posts?limit=10&offset=0&sort=desc&isPublished=true&author=1
- /comments?limit=10&offset=0&sort=desc

> [!IMPORTANT]
> Handle errors with proper status codes

- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 500 - Internal Server Error
- 502 - Bad Gateway
- 503 - Service Unavailable

> [!IMPORTANT]
> Maintain good security practices for API
> Use ssl

> [!NOTE]
> Try use caching to reduce server load

#### AUTH Method

> Use jwt
> -> ( jsonwebtoken OR password jwt OR SUPABASE )

- Login will give provide user a jwt

- jwt will be stored in (cookies or localStorage)
  client side

- In any request to the api jwt will be sent in
  "Authorization" header with "Bearer" schema
  and will be verified for every request (protected route)

- In logout jwt will be removed from client side localStorage

#### AUTHOR Client

- List posts with whether or not isPublished

- Make a publish and unpublish button

- New post form with TinyMCE (or an equivalent)

- Add delete and edit options for comments

> [!NOTE]
> Focus should be in backend rather than frontend
