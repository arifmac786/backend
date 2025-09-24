# Project Documentation

This document provides a detailed explanation of the files and code structure of this backend project.

---

## File-by-File Documentation

### `src/index.js`

**Purpose:** This is the main entry point of the application. It handles environment variable configuration, database connection, and starts the Express server.

**Key Steps:**
1.  **Import Dependencies:**
    *   `dotenv`: To load environment variables from a `.env` file.
    *   `connectDB`: The custom database connection function from `./db/index.js`.
    *   `app`: The configured Express application instance from `./app.js`.

2.  **Environment Variable Configuration:**
    *   `dotenv.config()` is called to load the environment variables. The `path` is explicitly set to `./env` to locate the `.env` file.

3.  **Port Configuration:**
    *   The `port` for the server is retrieved from `process.env.PORT`. If it's not defined, it defaults to `8000`.

4.  **Database Connection and Server Initialization:**
    *   `connectDB()` is called, which returns a promise.
    *   The `.then()` block is executed upon a successful database connection. Inside it, `app.listen()` starts the server on the configured port. A success message is logged to the console.
    *   The `.catch()` block handles any errors during the database connection, logging an error message.

---

### `src/app.js`

**Purpose:** This file configures the main Express application. It sets up essential middleware for handling CORS, JSON data, URL-encoded data, static files, and cookies.

**Middleware Configuration:**
1.  **`cors`:**
    *   Enables Cross-Origin Resource Sharing. This is crucial for allowing a frontend application (running on a different origin) to communicate with this backend.
    *   `origin`: The allowed origin is read from the `CORS_ORIGIN` environment variable.
    *   `credentials: true`: Allows the frontend to send cookies with its requests.

2.  **`express.json`:**
    *   Parses incoming requests with JSON payloads.
    *   `limit: "16kb"`: Sets a limit on the size of the JSON payload to prevent denial-of-service attacks with large requests.

3.  **`express.urlencoded`:**
    *   Parses incoming requests with URL-encoded payloads (e.g., from HTML forms).
    *   `extended: true`: Allows for parsing of nested objects.
    *   `limit: "16kb"`: Sets a limit on the payload size.

4.  **`express.static`:**
    *   Serves static files from the `public` directory. This is used for assets like images, CSS files, or frontend builds.

5.  **`cookieParser`:**
    *   Parses `Cookie` header and populates `req.cookies` with an object keyed by the cookie names. This allows the server to read and write cookies.

**Export:**
*   The configured `app` instance is exported to be used in `src/index.js`.

---

### `src/constants.js`

**Purpose:** This file centralizes application-wide constants.

**Constant:**
*   `DB_NAME`: A constant string `"videotube"` which is the name of the MongoDB database. Using a constant prevents typos and makes it easy to change the database name in one place.

---

### `src/db/index.js`

**Purpose:** This file contains the logic for connecting to the MongoDB database.

**`connectDB` Function:**
*   An `async` function that handles the database connection.
*   It uses a `try...catch` block to handle connection errors gracefully.
*   **Inside `try`:**
    *   `mongoose.connect()` is called with the MongoDB connection string from the `MONGO_URI` environment variable and the `DB_NAME` from `src/constants.js`.
    *   On successful connection, it logs the host of the connected database.
*   **Inside `catch`:**
    *   If an error occurs, it logs the error message.
    *   `process.exit(1)` is called to terminate the application process with a failure code. This is important because the application cannot function without a database connection.

---

### `src/utils/ApiError.js`

**Purpose:** This file defines a custom `ApiError` class that extends the built-in `Error` class. This is used to create standardized error responses throughout the API.

**`ApiError` Class:**
*   **Constructor:**
    *   `statusCode`: The HTTP status code for the error (e.g., 404, 400).
    *   `message`: A descriptive error message. Defaults to `"something went wrong"`.
    *   `errors`: An array to hold more specific validation errors.
    *   `stack`: An optional stack trace.
*   **Properties:**
    *   It sets properties like `statusCode`, `data` (which is `null` for errors), `message`, and `success` (which is always `false`).
*   **Stack Trace:**
    *   If a `stack` is not provided, `Error.captureStackTrace()` is used to generate a stack trace, which is helpful for debugging.

---

### `src/utils/ApiResponse.js`

**Purpose:** This file defines a custom `ApiResponse` class for sending standardized, successful API responses.

**`ApiResponse` Class:**
*   **Constructor:**
    *   `statusCode`: The HTTP status code for the response.
    *   `data`: The payload of the response (the actual data being sent).
    *   `message`: A descriptive message. Defaults to `"success"`.
*   **Properties:**
    *   `success`: A boolean value that is `true` if the `statusCode` is less than 400 (indicating a successful response), and `false` otherwise.

---

### `src/utils/asyncHandler.js`

**Purpose:** This file provides a wrapper function for handling asynchronous operations in Express route handlers, avoiding the need for repetitive `try...catch` blocks.

**`asyncHandler` Function:**
*   It's a higher-order function that takes a `requestHandler` function as an argument.
*   It returns a new function that takes `(req, res, next)`.
*   `Promise.resolve()` is used to wrap the `requestHandler`. This ensures that if the `requestHandler` returns a value or a promise, it's handled correctly.
*   `.catch((err) => next(err))` catches any errors that occur in the `requestHandler` and passes them to the next Express middleware (usually an error-handling middleware).

---

### `src/utils/cloudnary.js`

**Purpose:** This utility file handles file uploads to Cloudinary, a cloud-based image and video management service.

**Configuration:**
*   The Cloudinary library is configured using credentials (`cloud_name`, `api_key`, `api_secret`) from environment variables.

**`uploadOnCloudnary` Function:**
*   An `async` function that takes a `localFilePath` as an argument.
*   **Error Handling:** It uses a `try...catch` block.
*   **File Upload:**
    *   It checks if `localFilePath` exists.
    *   `cloudinary.uploader.upload()` is called to upload the file. `resource_type: "auto"` tells Cloudinary to automatically detect the file type.
*   **Cleanup:**
    *   On successful upload, it logs the public URL of the uploaded file and returns the response object from Cloudinary.
    *   If the upload fails, `fs.unlinkSync(localFilePath)` is called to delete the locally saved temporary file. It then returns `null`.

---

### `src/middlewares/multer.middleware.js`

**Purpose:** This middleware configures `multer`, a middleware for handling `multipart/form-data`, which is primarily used for uploading files.

**Configuration:**
*   `multer.diskStorage` is used to configure how files are stored on the server before being uploaded to a cloud service.
    *   `destination`: Specifies that files should be saved in the `./public/temp` directory.
    *   `filename`: Specifies that the original filename should be kept.
*   The `upload` object is created by calling `multer()` with the defined `storage` configuration. This `upload` object can then be used as middleware in routes that handle file uploads.

---

### `src/models/user.model.js`

**Purpose:** This file defines the Mongoose schema and model for a `User`.

**`userSchema`:**
*   **Fields:**
    *   `username`, `email`, `fullname`: Basic user information with constraints like `required`, `unique`, `lowercase`, and `trim`. `index: true` is added to `username` and `fullname` to optimize database queries on these fields.
    *   `avatar`, `coverImage`: Strings that will hold URLs to images hosted on Cloudinary.
    *   `watchHistory`: An array of `ObjectId`s, referencing the `Video` model.
    *   `password`: The user's password, which is required.
    *   `refreshToken`: A string to store the refresh token for persistent login sessions.
*   **Timestamps:** `timestamps: true` automatically adds `createdAt` and `updatedAt` fields.

**Middleware (`pre` hook):**
*   A `pre('save')` middleware is used to hash the user's password before it's saved to the database.
*   It checks if the password has been modified to avoid re-hashing it on every save.
*   `bcrypt.hash()` is used to hash the password with a salt factor of 10.

**Methods:**
*   `isPasswordCorrect(password)`: An instance method that uses `bcrypt.compare()` to check if a provided password matches the hashed password in the database.
*   `generateAccessToken()`: An instance method that uses `jsonwebtoken` (`jwt`) to generate a short-lived access token containing user information.
*   `generateRefreshToken()`: An instance method that generates a refresh token containing only the user's `_id`.

---

### `src/models/video.model.js`

**Purpose:** This file defines the Mongoose schema and model for a `Video`.

**`videoSchema`:**
*   **Fields:**
    *   `videoFile`, `thumbnail`: Strings to store Cloudinary URLs for the video and its thumbnail.
    *   `title`, `description`: Basic information about the video.
    *   `duration`: The length of the video.
    *   `views`: A counter for the number of views, defaulting to 0.
    *   `isPublished`: A boolean to control the visibility of the video, defaulting to `true`.
    *   `owner`: An `ObjectId` that references the `User` who uploaded the video.
*   **Timestamps:** `timestamps: true` is enabled.

**Plugin:**
*   `mongoose-aggregate-paginate-v2`: This plugin is added to the schema to enable pagination for complex aggregation queries, which is useful for features like fetching a list of videos with sorting and filtering.
