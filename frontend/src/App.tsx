import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import GlobalNotification from './components/GlobalNotification';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import BudgetPage from './pages/BudgetPage';
import ExpensePage from './pages/ExpensePage';
import HomePage from './pages/HomePage';
import IncomePage from './pages/IncomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <BrowserRouter>
      <GlobalNotification />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="my-profile" element={<ProfilePage />} />
            <Route path="income" element={<IncomePage />} />
            <Route path="budget-planner" element={<BudgetPage />} />
            <Route path="expenses" element={<ExpensePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
