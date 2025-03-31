# ShelfSmart ( Frontend Part )

**ShelfSmart(Frontend)** is the client-side component of the ShelfSmart inventory management system, built with React and Vite. It provides a responsive, user-friendly interface for managing pantry inventory, tracking stock levels, and generating reports.

## Features
- **Dashboard**: Displays inventory stats, charts.
- **AI-driven restock suggestions.**
- **Inventory Management**: Add, edit, delete, and consume items with responsive views.
- **Suppliers**: Admin-only supplier management.
- **Reports**: Download daily, weekly, and custom reports.
- **User Activity**: View user action logs.
- **Authentication**: Secure login and registration with role-based access (Admin/User).
- **Notifications**: Real-time updates via a notification bell.

## Tech Stack
- **Frontend**: React, React Router, Vite
- **Styling**: Tailwind CSS
- **API Client**: Axios
- **Charts**: Chart.js (`react-chartjs-2`)
- **Notifications**: React-Toastify
- **Dropdowns**: React-Select
- **CSV Parsing**: PapaParse
- **Icons**: React-Icons

## Project Structure

```bash
shelfsmart-frontend/
├── public/                 # Static assets
│   ├── icon.png
│   └── vite.svg
├── src/
│   ├── assets/             # Images and resources
│   ├── components/         # Reusable UI components
│   │   ├── AIAccordion.jsx
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Skeleton.jsx
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Inventory.jsx
│   │   ├── Login.jsx
│   │   ├── Registration.jsx
│   │   ├── Report.jsx
│   │   ├── Suppliers.jsx
│   │   └── UserActivity.jsx
│   ├── App.jsx             # Main app with routing
│   ├── App.css             # App-specific styles
│   ├── index.css           # Global styles
│   └── main.jsx            # Entry point
├── .gitignore
├── eslint.config.js
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md               # This file
```

## Prerequisites
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/MohitNamdev22/ShelfSmart-Frontend.git
   cd shelfsmart
2. Install Dependencies:
```bash

npm install
```
Set Up Environment Variables:

3. Create a .env file in the root:
```bash
VITE_API_URL=http://localhost:8080
Update VITE_API_URL to match your backend URL.
```
4. Run the Development Server:
```bash

npm run dev
Open http://localhost:5173 in your browser.
```


5. Build for Production:
```bash

npm run build
```

## Usage

* *   Connect to the ShelfSmart Backend (shelfsmart-backend) running at http://localhost:8080.


* *   Register or log in to access the dashboard and manage inventory based on your role (Admin/User).

### Admin Credentials

*   **Email**: `namdevmohit0@gmail.com`  
*   **Password**: `mohit123`
     

Use these credentials to log in as an **Admin** and access admin-only features like managing suppliers and manage complete Inventory.

### User Account Creation

To create a **User** account, simply register through the app's registration page. Once registered, you will have access to Users Feature.

