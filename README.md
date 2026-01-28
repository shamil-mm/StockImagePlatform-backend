# StockImagePlatform Backend

This is the backend API for the StockImagePlatform, built using **Node.js**, **Express**, and **TypeScript**. It provides robust authentication, image management via **Cloudinary**, and data persistence using **MongoDB**.

## Features

- **User Authentication**: Secure registration, login, logout, and password management using JWT (Access & Refresh tokens).
- **Image Management**: 
  - Upload multiple images.
  - Fetch user-specific collections with pagination.
  - Update image details (title, file).
  - Reorder images (drag-and-drop support on frontend).
  - Delete images (removes from Cloudinary and updates order).
- **Cloud Storage**: Seamless integration with Cloudinary for handling image assets.
- **Security**: HttpOnly cookies for refresh tokens, CORS configuration.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Storage**: Cloudinary
- **Authentication**: JSON Web Tokens (JWT)

## 📂 Project Structure

```
src/
├── controllers/    # Request handlers (e.g., AuthController)
├── Routes/         # API Route definitions
├── repositories/   # Data access layer (User, Collection)
├── middleware/     # Auth and other middlewares
├── utils/          # Utilities (JWT service, multer config)
├── models/         # Database models
└── app.ts          # App entry point and configuration
```

## ⚙️ prerequisites

Ensure you have the following installed/set up:
- **Node.js** (v14+ recommended)
- **MongoDB** (Local or Atlas connection string)
- **Cloudinary** Account (Cloud Name, API Key, API Secret)

## 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd StockImagePlatform/BackEnd
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following variables:

   ```env
   # Database
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/StockImagePlatformDB

   # Server
   PORT=3000

   # Authentication
   JWT_SECRET=your_super_secret_key
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=1d

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # CORS
   FRONTEND_URLS=http://localhost:5173,https://your-production-url.app
   NODE_ENV=development
   ```

4. **Run the Application:**

   Development mode:
   ```bash
   npm run dev
   ```

   Production build:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate user and receive tokens.
- `POST /api/auth/refresh` - Refresh access token using HttpOnly cookie.
- `POST /api/auth/logout` - Clear refresh token cookie.
- `PUT /api/auth/change-password` - Update user password.

### Images & Collections
- `POST /api/auth/upload` - Upload up to 10 images (Multipart form: `files`).
- `GET /api/auth/fetch` - Get paginated images for the user.
  - Query params: `page`, `limit`
- `GET /api/auth/image` - Get a single image details.
  - Query param: `id` (publicId)
- `PATCH /api/auth/upload` - Update an existing image (title or file).
- `PATCH /api/auth/reorder` - Update the order of images.
- `DELETE /api/auth/image` - Delete an image by its publicId.
