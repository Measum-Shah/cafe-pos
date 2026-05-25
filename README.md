# Cafe POS System

A web-based and desktop-supported **Cafe POS System** built for a local cafe to manage daily sales, products, categories, receipts, order history, and business reports.

This project is designed for small cafes, restaurants, and local businesses that need a simple, practical, and easy-to-use POS solution.

---

## Features

### POS System
Employees can use the POS screen to:

- Select products/items
- Add items to cart
- Process customer orders
- Generate receipts
- Complete sales quickly

### Receipt Generator
The system can generate receipts for completed orders, making the checkout process clean and organized.

### Items and Categories Management
Admins can manage:

- Products/items
- Categories
- Prices
- Cafe menu data

### Order History
The system maintains complete order history so previous sales can be tracked whenever needed.

### PDF Reports
Admins can generate business reports in PDF format for better record keeping and analysis.

### Admin Dashboard
The admin dashboard shows useful business stats such as:

- Total sales
- Total orders
- Total products
- Hot-selling products
- Overall cafe performance overview

### Role-Based Access

The system has two main roles:

#### Employee
Employees can:

- Use the POS system
- Add products/items

#### Admin
Admins can:

- Access the dashboard
- View business stats
- Manage products and categories
- View order history
- Generate PDF reports
- Track hot-selling products

---

## Project Type

This project can run in two ways:

1. **Web Application**
2. **Desktop Application using Electron**

---

## Folder Structure

```bash
cafe-pos/
│
├── frontend/        # Frontend app
├── backend/         # Backend server/API
├── package.json     # Main Electron app package file
└── README.md
```

> Folder names may vary depending on your project setup, but the commands below assume `frontend` and `backend` folders.

---

## Running as a Web Application

To run the project as a web application, you need to install dependencies separately in both the `frontend` and `backend` folders.

### 1. Install Backend Dependencies

```bash
cd backend
npm i
```

### 2. Run Backend Server

```bash
npm run dev
```

Keep this terminal running.

### 3. Install Frontend Dependencies

Open a new terminal and run:

```bash
cd frontend
npm i
```

### 4. Run Frontend App

```bash
npm run dev
```

Now the web app should be running locally.

Usually, the frontend runs on a URL like:

```bash
http://localhost:5173
```

And the backend runs on a URL like:

```bash
http://localhost:5000
```

The exact ports depend on your project configuration.

---

## Running as a Desktop Application

This project also supports desktop mode using Electron.

To run the desktop app, you must install dependencies in the main/root folder as well.

### 1. Install Main Folder Dependencies

From the root folder of the project, run:

```bash
npm i
```

### 2. Run Desktop App

```bash
npm run dev
```

This will start the Electron desktop application.

> Note: If your Electron app depends on the backend API, make sure the backend server is also running.

---

## Building the Desktop App

You can also build the desktop application using Electron build tools.

Depending on the scripts available in your `package.json`, you can run one of the following commands:

```bash
npm run build
```

or

```bash
npm run dist
```

The final desktop build will usually be generated inside a folder like:

```bash
dist/
```

or:

```bash
release/
```

The exact output folder depends on your Electron build configuration.

---

## Environment Variables

A `.env` file is included in this repository intentionally so the project can be run easily without extra setup.

And yes, before anyone judges me, the `.env` file is there on purpose.

There are no sensitive API keys involved in this project. It is only included to make local setup easier for anyone who wants to test or use the project.

> For production projects, always avoid pushing sensitive credentials, API keys, payment secrets, database passwords, or private tokens to GitHub.

---

## Basic Setup Summary

### Web Version

Run backend:

```bash
cd backend
npm i
npm run dev
```

Run frontend:

```bash
cd frontend
npm i
npm run dev
```

### Desktop Version

Run from main/root folder:

```bash
npm i
npm run dev
```

---

## Tech Usage

This project uses a web-based structure with desktop support through Electron.

Main parts include:

- Frontend application
- Backend API
- POS module
- Receipt generation
- PDF reporting
- Role-based access
- Electron desktop wrapper

---

## Who Can Use This?

This system can be useful for:

- Cafes
- Restaurants
- Small food businesses
- Local shops
- Small sales counters
- Businesses that need a simple POS solution

---

## GitHub Repository

Add your GitHub repository link here:

```bash
https://github.com/your-username/your-repository-name
```

---

## Access / Demo

Add your live access or demo link here:

```bash
https://your-demo-link.com
```

---

## Author

Developed by **Measum Shah**

If anyone wants a similar POS system for their cafe, restaurant, or small business, feel free to contact me.
