import React from 'react';
import type { NavLinkProps } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export const CustomNavLink = React.forwardRef<
  HTMLAnchorElement,
  NavLinkProps & { activeClassName?: string }
>(({ activeClassName, className, ...rest }, ref) => (
  <NavLink
    ref={ref}
    {...rest}
    className={({ isActive }) =>
      `${className ?? ''} ${isActive && activeClassName ? activeClassName : ''}`.trim()
    }
  />
));
