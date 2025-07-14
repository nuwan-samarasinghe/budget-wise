import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import BudgetPage from './pages/BudgetPage';
import ExpensePage from './pages/ExpensePage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SalaryPage from './pages/SalaryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="my-profile" element={<ProfilePage />} />
          <Route path="income" element={<SalaryPage />} />
          <Route path="budget-planner" element={<BudgetPage />} />
          <Route path="expenses" element={<ExpensePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
