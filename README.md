# UPang Assist

## Suggested Project Structure

This structure separates each responsibility by feature and keeps the current scope focused on student authentication, chat, tasks, and the knowledge base. Administrative features are intentionally excluded for now.

```text
UPangAssist-V2-main/
├── README.md
├── my-react-app/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx
│   │   │   └── routes.jsx
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── SignupPage.jsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatComposer.jsx
│   │   │   │   ├── ChatThread.jsx
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   └── formatMarkdown.js
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Topbar.jsx
│   │   │   └── tasks/
│   │   │       ├── TaskForm.jsx
│   │   │       └── TaskList.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   ├── apiClient.js
│   │   │   ├── authApi.js
│   │   │   ├── chatApi.js
│   │   │   └── taskApi.js
│   │   ├── assets/
│   │   ├── styles/
│   │   │   ├── auth.css
│   │   │   ├── chat.css
│   │   │   ├── layout.css
│   │   │   └── tasks.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
└── server/
    ├── data/
    │   └── knowledgeBase.json
    ├── src/
    │   ├── config/
    │   │   ├── database.js
    │   │   └── env.js
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── chatController.js
    │   │   ├── healthController.js
    │   │   └── taskController.js
    │   ├── middlewares/
    │   │   ├── authMiddleware.js
    │   │   ├── errorMiddleware.js
    │   │   ├── notFoundMiddleware.js
    │   │   ├── rateLimitMiddleware.js
    │   │   └── validationMiddleware.js
    │   ├── models/
    │   │   ├── Task.js
    │   │   └── User.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── chatRoutes.js
    │   │   ├── healthRoutes.js
    │   │   └── taskRoutes.js
    │   ├── services/
    │   │   ├── authService.js
    │   │   ├── chatService.js
    │   │   └── knowledgeBaseService.js
    │   ├── utils/
    │   │   ├── emailPolicy.js
    │   │   ├── jwt.js
    │   │   └── response.js
    │   ├── app.js
    │   └── server.js
    ├── .env.example
    └── package.json
```

## Current-to-Target Separation

| Current code | Target location | Responsibility |
|---|---|---|
| `my-react-app/src/App.jsx` | `src/app/App.jsx` plus feature components | Application state and page composition |
| Login JSX in `App.jsx` | `src/components/auth/LoginPage.jsx` | Student login UI |
| Signup JSX in `App.jsx` | `src/components/auth/SignupPage.jsx` | Student registration UI |
| Chat JSX in `App.jsx` | `src/components/chat/` | Chat thread, composer, and messages |
| Sidebar and topbar JSX | `src/components/layout/` | Shared application layout |
| `src/utils/apiBaseUrl.js` | `src/services/apiClient.js` | Authenticated API requests and cookies |
| Inline login/register calls | `src/services/authApi.js` | Authentication API functions |
| Inline chat fetch logic | `src/services/chatApi.js` | Chat API and streaming response handling |
| `server/src/server.js` | `server/src/app.js` and feature modules | API composition instead of business logic |
| Auth route/controller files | `server/src/routes/` and `server/src/controllers/` | HTTP endpoints and request handling |
| `server/src/semanticSearch.js` | `server/src/services/chatService.js` | Search, embeddings, and answer generation |
| `server/data/knowledgeBase.json` | Same location, accessed by service | Verified UPang reference data |

## Responsibilities and Boundaries

### Frontend

- Components render UI and receive data through props or hooks.
- Services perform API requests.
- `useAuth.js` owns session restoration, login, registration, and logout state.
- Components must not contain MongoDB, JWT, or password logic.
- The browser communicates with the API through HTTP-only cookies.

### Backend

- Routes define URLs and middleware order.
- Controllers validate request flow and create responses.
- Services contain business logic such as authentication and semantic search.
- Models define MongoDB schemas and relationships.
- Middleware handles authentication, validation, rate limiting, and errors.
- Configuration reads environment variables and connects to MongoDB.
- `server.js` starts the process only; it should not contain chat or authentication logic.

## Scope for the Current Separation Phase

Implement only these feature areas:

1. Student registration using an approved school email domain.
2. Student login and logout using an HTTP-only JWT cookie.
3. Current-user session restoration through `/api/auth/me`.
4. Protected chat access.
5. Authenticated task CRUD with ownership enforcement.
6. Knowledge-base search and answer generation.
7. Health checking and centralized error handling.

The admin role and admin dashboard are intentionally deferred. Keep `role: "student"` as the registration default, but do not add admin routes until the student structure is stable.

## Recommended Migration Order

1. Keep the existing API behavior working.
2. Extract environment loading and MongoDB connection into `config/`.
3. Move security and route mounting into `app.js`.
4. Move the inline chat endpoint into `chatController.js` and `chatService.js`.
5. Keep authentication controllers and routes together under their existing feature boundary.
6. Keep task controllers and routes protected by `authMiddleware.js`.
7. Move frontend API calls into `services/`.
8. Extract authentication pages from `App.jsx`.
9. Extract chat and layout components from `App.jsx`.
10. Run the frontend build and API tests after each extraction.

## Initial API Surface

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout

POST   /api/chat

GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id

GET    /api/health
```

## Security Rules

- Only configured school email domains may register.
- Registration always creates a `student` account.
- Passwords are hashed with Argon2id.
- JWTs are stored in HTTP-only cookies, never `localStorage`.
- Task ownership comes from `req.user._id`, never from the request body.
- Chat and task endpoints require authentication.
- CORS allows only the configured frontend origin.
- Helmet, rate limiting, request-size limits, and centralized error handling are enabled.
- Secrets and database credentials remain in environment variables.
- Do not commit `.env` files.
