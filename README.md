# Mentoring Call Scheduling System - Frontend

Frontend application built with React and Vite for the mentoring call scheduling platform.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Language**: JavaScript (ES6+)
- **HTTP Client**: Axios


## Github Link
```bash
https://github.com/vishnuu5/Mentoring-Call-Scheduling-System.git
```

## Deployed on vercel
[View project]()

## Setup & Installation

### Prerequisites
- Node.js 18+
- Backend API running on http://localhost:5000
- npm package manager

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env
```

Update `.env`:
```
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```

App will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
npm run preview
```

## Features

### Authentication
- Simple JWT-based login
- Three roles: User, Mentor, Admin
- Protected routes with role-based access
- Auto-logout on token expiration

### User Dashboard
- View and manage availability
- See scheduled calls
- Download Google Meet links

### Mentor Dashboard
- Manage availability
- View student sessions
- Access meeting links

### Admin Dashboard
- Search and select users
- View user availability
- Get AI-recommended mentors
- Book calls between users and mentors
- Manage all system calls
- View mentor metadata

## Key Components

### ProtectedRoute
Handles role-based route protection:
```jsx
<ProtectedRoute requiredRole={ROLES.ADMIN}>
  <AdminDashboard />
</ProtectedRoute>
```

### useAuth Hook
Manages authentication state:
```jsx
const { user, login, logout, isAuthenticated } = useAuth();
```

### useFetch Hook
Handles API data fetching:
```jsx
const { data, loading, error, refetch } = useFetch(url, options);
```

## API Integration

All API calls use the configured `VITE_API_URL`. The axios instance automatically:
- Adds JWT token from localStorage
- Handles 401 errors by logging out
- Formats requests/responses as JSON

## Styling

Uses Tailwind CSS with custom utilities:
- Responsive design patterns
- Custom components (cards, alerts, forms)
- Loading spinners and feedback messages

## Demo Credentials

```
Admin: admin@example.com / admin123
User: user1@example.com / user123
Mentor: mentor1@example.com / mentor123
```

## Development

### Adding New Pages
1. Create component in `pages/`
2. Add route in `App.jsx`
3. Wrap with `ProtectedRoute` if needed

### Adding New Features
1. Create components in `components/`
2. Use `useFetch` for API calls
3. Use `useAuth` for user context
4. Add utilities to `utils/` as needed

## Common Issues

**CORS errors**
- Ensure backend CORS is configured for `http://localhost:5173`
- Check `VITE_API_URL` matches backend URL

**Token not persisting**
- Check if localStorage is enabled
- Verify JWT token is being stored correctly

**Styling not applying**
- Ensure `tailwind.css` is imported in main.jsx
- Check Tailwind className syntax

## License

MIT
