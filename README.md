# 📚 WOM Finance – Bookstore & Transaction Backend API

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Node](https://img.shields.io/badge/Node.js-18+-blue)
![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-orange)
![MySQL](https://img.shields.io/badge/Database-MySQL-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Aplikasi backend untuk **manajemen buku, transaksi penjualan, checkout, stok, dan laporan**.  
Dibangun dengan **Node.js, Express, Sequelize ORM, MySQL**, serta dilengkapi **autentikasi JWT**, manajemen role, dan **error logging otomatis**.

---

## ✨ **Fitur Utama**

### 🔐 **Authentication**

- Login user + JWT token
- Role-based access (admin & user)
- Device-based token management

### 📚 **Manajemen Buku**

- CRUD buku
- Filtering (title, author, stock, active)
- Hold stock & real stock separation
- Bulk update (optimistic & race-condition safe)

### 🛒 **Cart & Checkout**

- Add/update cart detail
- Checkout dengan transactional API
- Race condition handling (LOCK/transaction)
- Payment callback support (success, failed, pending)

### 💰 **Transaksi & Laporan**

- Detail transaksi per buku
- Total qty terjual
- Total pendapatan (revenue)
- Sisa stok
- Laporan grouped per buku

### 📝 **Error Logging**

- Setiap error dicatat ke database (ErrorLog)
- Simpan:
  - message
  - status code
  - level (info/warn/error)
  - raw JSON error
  - userId (opsional)
  - destination (middleware/service/controller)

---

## 🛠️ **Tech Stack**

- **Node.js**
- **Express.js**
- **TypeScript**
- **Sequelize ORM**
- **MySQL**
- **JWT Authentication**
- **Winston / Custom Logger**
- **ESLint + Prettier**

---

## ⚙️ **Instalasi**

```bash
git clone https://github.com/your-name/wom-finance.git
cd wom-finance
npm install

npm run migrate

cp .env.example .env

npm run dev
```
