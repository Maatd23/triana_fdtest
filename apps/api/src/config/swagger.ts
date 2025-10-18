// src/config/swagger.ts
const doc = {
  openapi: "3.0.0",
  info: {
    title: "yourname_fdtest API",
    version: "1.0.0",
    description:
      "API untuk Authentication, Users, dan Books. Protected endpoints memakai Bearer JWT di header `Authorization: Bearer <access_token>`.",
  },
  servers: [
    {
      url: process.env.API_URL || "http://localhost:4000",
      description: "Local",
    },
  ],
  tags: [
    { name: "Health", description: "Service health" },
    { name: "Auth", description: "Authentication & account flows" },
    { name: "Users", description: "User directory & profile" },
    { name: "Books", description: "Book CRUD & public listing" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      // ===== Common =====
      MessageResponse: {
        type: "object",
        properties: { message: { type: "string" } },
        required: ["message"],
      },
      ErrorResponse: {
        type: "object",
        properties: { message: { type: "string" } },
        required: ["message"],
        example: { message: "Invalid or expired token" },
      },
      PaginationMeta: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          pages: { type: "integer", example: 10 },
          total: { type: "integer", example: 95 },
        },
      },

      // ===== Auth =====
      RegisterBody: {
        type: "object",
        properties: {
          username: { type: "string", minLength: 3, example: "Alice" },
          email: {
            type: "string",
            format: "email",
            example: "alice@example.com",
          },
          password: { type: "string", minLength: 8, example: "Passw0rdA" },
        },
        required: ["username", "email", "password"],
      },
      LoginBody: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "alice@example.com",
          },
          password: { type: "string", example: "Passw0rdA" },
        },
        required: ["email", "password"],
      },
      LoginResponse: {
        type: "object",
        properties: {
          access_token: {
            type: "string",
            description: "JWT access token (15m)",
          },
          profile: {
            type: "object",
            properties: {
              id: { type: "string" },
              username: { type: "string" },
              email: { type: "string" },
              emailVerified: { type: "boolean" },
            },
          },
        },
      },
      ForgotBody: {
        type: "object",
        properties: { email: { type: "string", format: "email" } },
        required: ["email"],
        example: { email: "alice@example.com" },
      },
      ResetBody: {
        type: "object",
        properties: {
          token: { type: "string", description: "Hex(64) token dari email" },
          newPassword: { type: "string", minLength: 8 },
        },
        required: ["token", "newPassword"],
        example: {
          token: "9c5b...<64hex>...c1a2",
          newPassword: "NewPassw0rdA",
        },
      },
      ChangePasswordBody: {
        type: "object",
        properties: {
          currentPassword: { type: "string" },
          newPassword: { type: "string", minLength: 8 },
        },
        required: ["currentPassword", "newPassword"],
      },

      // ===== Users =====
      UserPublic: {
        type: "object",
        properties: {
          id: { type: "string" },
          username: { type: "string" },
          email: { type: "string" },
          emailVerified: { type: "boolean" },
        },
      },

      // ===== Books =====
      Book: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          author: { type: "string" },
          description: { type: "string" },
          coverUrl: { type: "string", nullable: true },
          rating: { type: "integer", minimum: 0, maximum: 5 },
          uploadedBy: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      BookCreateBody: {
        type: "object",
        properties: {
          title: { type: "string", example: "Clean Code" },
          author: { type: "string", example: "Robert C. Martin" },
          description: {
            type: "string",
            example: "A handbook of agile software craftsmanship",
          },
          coverUrl: { type: "string", example: "https://..." },
          rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
        },
        required: ["title", "author", "description"],
      },
      BookUpdateBody: {
        type: "object",
        properties: {
          title: { type: "string" },
          author: { type: "string" },
          description: { type: "string" },
          coverUrl: { type: "string" },
          rating: { type: "integer", minimum: 1, maximum: 5 },
        },
      },
      PublicBooksResponse: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/Book" },
          },
          total: { type: "integer" },
          page: { type: "integer" },
          pages: { type: "integer" },
        },
      },
    },
  },
  paths: {
    // ========= Health =========
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
                example: { ok: true },
              },
            },
          },
        },
      },
    },

    // ========= Auth =========
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user (sends verification email)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterBody" },
            },
          },
        },
        responses: {
          "201": {
            description: "Registered. Please verify your email.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "409": {
            description: "Email already in use",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with email & password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginBody" },
            },
          },
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/verify-email": {
      get: {
        tags: ["Auth"],
        summary: "Verify email using token from email",
        parameters: [
          {
            name: "token",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Hex(64) token",
          },
        ],
        responses: {
          "200": {
            description: "Email verified",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "400": {
            description: "Invalid or expired token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request reset link (email sent if exists)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ForgotBody" },
            },
          },
        },
        responses: {
          "200": {
            description: "Always OK (anti-enumeration)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password using token from email",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ResetBody" },
            },
          },
        },
        responses: {
          "200": {
            description: "Password reset",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "400": {
            description: "Invalid or expired token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/change-password": {
      post: {
        tags: ["Auth"],
        summary: "Change password (requires auth)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ChangePasswordBody" },
            },
          },
        },
        responses: {
          "200": {
            description: "Password changed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "400": {
            description: "Current password incorrect / validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ========= Users =========
    "/api/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get my profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    email: { type: "string" },
                    emailVerified: { type: "boolean" },
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "List users (search & filter)",
        description: "Query: `?q=alice&verified=true`",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "q",
            in: "query",
            schema: { type: "string" },
            description: "Search by name/email",
          },
          {
            name: "verified",
            in: "query",
            schema: { type: "boolean" },
            description: "Filter by emailVerified",
          },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/UserPublic" },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },

    // ========= Books =========
    "/api/books/public": {
      get: {
        tags: ["Books"],
        summary: "Public books with filters & pagination",
        parameters: [
          { name: "author", in: "query", schema: { type: "string" } },
          {
            name: "rating",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 5 },
          },
          {
            name: "from",
            in: "query",
            schema: { type: "string", format: "date-time" },
          },
          {
            name: "to",
            in: "query",
            schema: { type: "string", format: "date-time" },
          },
          {
            name: "q",
            in: "query",
            schema: { type: "string" },
            description: "Search by title/description",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PublicBooksResponse" },
              },
            },
          },
        },
      },
    },
    "/api/books": {
      get: {
        tags: ["Books"],
        summary: "List books (auth)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Book" },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
      post: {
        tags: ["Books"],
        summary: "Create book",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookCreateBody" },
            },
          },
        },
        responses: {
          "201": {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Book" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/books/{id}": {
      get: {
        tags: ["Books"],
        summary: "Get book by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Book" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
      put: {
        tags: ["Books"],
        summary: "Update book by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookUpdateBody" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Book" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
      delete: {
        tags: ["Books"],
        summary: "Delete book by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No Content" },
          "401": { description: "Unauthorized" },
        },
      },
    },
  },
};

export default doc as any;
