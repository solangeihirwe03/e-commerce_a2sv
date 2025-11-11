# 🛒e-commerce_a2sv

This is the backend API for the E-commerce platform. It supports user authentication, product management, order placement, role-based access for admins, and users.

#### GITHUB REPOSITORY FOR E-COMMERCE-NINJAS BACKEND

[https://github.com/solangeihirwe03/e-commerce_a2sv.git](https://github.com/solangeihirwe03/e-commerce_a2sv.git)

## Tech Stack

- Node.js + Express – Fast and scalable backend framework
- PostgreSQL + Sequelize – Relational database with ORM
- JWT – Secure authentication
- Joi – Request validation
- Cloudinary – Image upload and hosting
- Swagger – API documentation
- Role-based Access Control – Secure route protection
- Sequelize CLI – Migrations and seeders

## INSTALLATION

1. Clone the repository:

    ```sh
    git clone https://github.com/solangeihirwe03/e-commerce_a2sv.git
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Copy `.env.example` to `.env` and add values to all variables.

4. Start the server:
   ```sh
   npm run dev
   ```

## FOLDER STRUCTURE

- `.env`: Secure environment variables.
- `src/`: Source code directory.

  - `databases/`: Database related files.
    - `config/`: Database connectivity configuration.
    - `models/`: Sequelize models.
  - `middlewares/`: Middleware functions.
  - `modules/`: Modules like User, Products, etc.
    - `user/`: user module.
      - `controller/`: user controllers.
      - `repository/`: user repositories.
      - `validation/`: user validation schemas.
    - `products/`: product module.
      - `controller/`: product controllers.
      - `repository/`: product repositories.
      - `validation/`: product validation schemas.
  - `routes/`: API routes.
  - `helpers/`: Utility functions.
  - `validation/`: Validation schemas.
  - `index.ts`: Startup file for all requests.

## INITILIAZE SEQUELIZE CLI

1. Initialize Sequelize CLI:
   ```sh
   npx sequelize-cli init
   ```
2. Generate Seeder:
   ```sh
   npx sequelize-cli seed:generate --name name-of-your-seeder
   ```
   ✅ Admin account and sample products are seeded for testing.
3. Generate Migrations:
   ```sh
   npx sequelize-cli migration:generate --name name-of-your-migration
   ```
4. Define Migration:
   Edit the generated migration file to include the tables you want to create.
5. Define Seeder Data:
   Edit the generated seeder file to include the data you want to insert.
6. Run the Migration:
   ```sh
   npm run createAllTables
   ```
6. Delete the Migration:
   ```sh
   npm run deleteAllTables
   ```