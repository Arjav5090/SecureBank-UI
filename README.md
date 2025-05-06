# SecureBank UI

SecureBank UI is the frontend application for SecureBank, built using **Next.js** and **Tailwind CSS**. It provides a fast, secure, and user-friendly interface for users to access banking features such as registration, login, fund transfers, transaction history, and more.


---

## 🖥️ Features

- **User Registration & Login** – Secure authentication using JWT  
- **PIN Setup & Update** – Users can manage their PINs directly from the dashboard  
- **Fund Transfers** – Transfer money to other accounts within the system  
- **Deposit & Withdrawal** – Perform cash operations digitally  
- **Transaction History** – View complete transaction logs with filters  
- **Responsive Design** – Works seamlessly across desktop, tablet, and mobile  
- **Email Notifications** – Triggered on login and for statement delivery

---

## ⚙️ Tech Stack

- Next.js  
- Tailwind CSS  
- React Hooks  
- Axios  
- JWT Authentication  

---

## 📦 Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/arjav5090/SecureBank-UI.git
   cd SecureBank-UI
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Create a `.env.local` file in the root directory.
   - Add your backend API base URL and any other secrets:
     ```env
     NEXT_PUBLIC_API_URL=https://your-api-url.com
     NEXT_PUBLIC_TOKEN_NAME=tokenName
     ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 Deployment

SecureBank UI can be deployed to any platform supporting Node.js. Recommended platforms include:
- Vercel (native Next.js support)
- Netlify
- AWS Amplify
- DigitalOcean App Platform

---

## ❗ Error Handling

The app gracefully handles errors such as:
- Invalid credentials or expired sessions  
- Network/API failures  
- Invalid input or missing fields

---

This project complements the [SecureBank-backend](https://github.com/arjav5090/SecureBank-backend) by offering a responsive and intuitive web interface for all core banking operations.
