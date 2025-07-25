import {
  AccountBalanceWallet,
  AttachMoney,
  Home,
  Logout,
  MoneyOff,
  Person,
} from '@mui/icons-material';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import type { MouseEventHandler } from 'react';
import { CustomNavLink } from './CustomNavLink';

const items = [
  { to: '/', icon: <Home />, label: 'Finance Dashboard' },
  { to: '/income', icon: <AttachMoney />, label: 'My Income' },
  {
    to: '/budget-planner',
    icon: <AccountBalanceWallet />,
    label: 'Budget Planner',
  },
  { to: '/expenses', icon: <MoneyOff />, label: 'Expenses' },
  { to: '/my-profile', icon: <Person />, label: 'My Profile' },
];

interface SidebarContentProps {
  onLinkClick?: MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
}

export default function Sidebar({ onLinkClick }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 text-lg font-semibold">Finance Hub</div>
      <List>
        {items.map(({ to, icon, label }) => (
          <ListItemButton
            key={to}
            component={CustomNavLink}
            to={to}
            end
            onClick={onLinkClick}
            className="hover:bg-gray-100"
            activeClassName="bg-gray-200 text-blue-600"
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
      <div className="mt-auto mb-4">
        <ListItemButton
          component={CustomNavLink}
          to="/logout"
          className="hover:bg-gray-100"
          activeClassName="bg-gray-200 text-blue-600"
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </div>
    </div>
  );
}
