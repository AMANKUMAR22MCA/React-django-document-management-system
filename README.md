# 🚀 Django & React Authentication and Document Management System

This project is a **Django REST API** with a **React frontend** for user authentication and document management. It provides **JWT-based authentication** using `dj-rest-auth`, and allows users to register, manage addresses, upload documents, and update their profiles.
<br>
## 🎥 Demo Video  

Watch the live demo: 
[Demo Video](https://youtu.be/rxtDG80u8Nw)

## 🛠️ Technologies Used

### **Backend** (Django & DRF)
- **Django Rest Framework (DRF)** - API development
- **dj-rest-auth** - Authentication (JWT, login, registration, token refresh)
- **Simple JWT** - Token-based authentication
- **PostgreSQL** - Database
- **Django Class-Based Views** - For clean API architecture

### **Frontend** (React)
- **React.js** - UI development
- **React Router** - Client-side navigation
- **Axios** - API calls
- **React Hook Form & Yup** - Form validation

---

## 📌 **API Endpoints**
| HTTP Method | Endpoint | Description |
|------------|----------|-------------|
| **POST** | `/auth/register/` | Register a new user |
| **POST** | `/auth/login/` | User login (returns JWT token) |
| **POST** | `/auth/logout/` | User logout |
| **POST** | `/auth/token/` | Obtain access & refresh token |
| **POST** | `/auth/token/refresh/` | Get a new access token |
| **POST** | `/auth/token/verify/` | Verify access token |
| **PATCH** | `/auth/user/update/` | Update user profile |
| **POST** | `/documents/` | Upload a document |
| **GET** | `/documents/list/` | List all uploaded documents |
| **POST** | `/addresses/` | Add a new address |
| **PATCH** | `/addresses/<id>/` | Update an address |

---

## ⚡ **Getting Started**

### **Backend Setup** (Django)
```sh
# Clone the repository
$ git clone https://github.com/AMANKUMAR22MCA/React-django-document-management-system.git
$ cd project

# Create virtual environment
$ python3 -m venv env
$ source env/bin/activate  # Mac/Linux
$ env\Scripts\activate    # Windows

# Install dependencies
$ pip install -r requirements.txt

# Add Database credientials in settings.py

# Run migrations
$ python manage.py migrate

# Start the server
$ python manage.py makemigrations api
$ python manage.py runserver
```

### **Frontend Setup** (React)
```sh
# Navigate to frontend directory
$ cd frontend

# Install dependencies
$ npm install

# Start the React app
$ npm start
```

---

## 🛡️ **Authentication System**
This project uses **dj-rest-auth** for authentication, providing features like:
- **User Registration & Login**
- **JWT-based authentication**
- **Password Reset & Change**
- **User Profile Management**

---

## 🎯 **Features**
✅ User Authentication (Register, Login, Logout)  
✅ JWT-based Authorization  
✅ Address Management (CRUD)  
✅ Document Upload & Listing  
✅ User Profile Update  

---

## 📜 **License**
This project is open-source and available under the [MIT License](LICENSE).

---

## 🤝 **Contributing**
Contributions are welcome! Feel free to open issues and pull requests.

---

## 📞 **Contact**
For any queries, reach out at: **your.email@example.com**

