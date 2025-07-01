# 🍔 Food Ordering System

A full-stack Food Ordering System built with the **MERN stack** and **Vite**. This app supports customer orders, real-time kitchen/cashier updates, and an interactive dashboard.

> ✅ Personal project built to improve my full-stack development skills and showcase my ability to build real-world systems.

---

## 🚀 Features

- 🧑‍🍳 Role-based views for customers, chefs, and cashiers
- 🔁 Real-time updates using **Socket.IO**
- 📊 Dashboard with daily, weekly, monthly, and yearly sales insights
- 🔐 Authentication with **JWT + Cookies**
- 📦 RESTful API built with Express & MongoDB
- 🌐 CORS, HTTPS dev server, environment variables

---

## 🛠️ Tech Stack

### Frontend
- React (with Vite)
- Redux Toolkit
- CSS Modules
- Framer Motion
- Axios

### Backend
- Node.js & Express.js
- MongoDB + Mongoose
- Socket.IO
- dotenv, cookie-parser
- CORS & HTTPS setup

---

## 📁 Project Structure

```bash
foodorderingsystem/
├── backend/ # Express API, models, routes
├── frontend/ # Vite + React frontend
└── README.md # You're here!

```
---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/foodorderingsystem.git
cd foodorderingsystem

```
### 2. Setup .env files

frontend/.env
```bash
VITE_DEV_HOST=192.168.100.100
VITE_DEV_PROXY=https://192.168.100.100:5000
VITE_DEV_HTTPS_KEY=cert/192.168.100.100-key.pem
VITE_DEV_HTTPS_CERT=cert/192.168.100.100.pem

```
backend/.env

```bash
PORT=5000
CLIENT_ORIGIN=https://192.168.100.100:5173
MONGO_URI=your-mongo-uri
JWT_SECRET=your-secret-key

```
### 3. Install dependencies

```bash
cd frontend
npm install

cd ../backend
npm install

```
### 4. Run the app locally

Start Backend:
```bash
npm run dev

```
Start Frontend:
```bash
npm run dev

```
## 📄 License
This project is open-source and free to use under the MIT License.

## 🙋‍♂️ About Me
I built this project to improve my skills while looking for opportunities as a full-stack or frontend developer. If you're interested in working with me or want to use this system — feel free to reach out!