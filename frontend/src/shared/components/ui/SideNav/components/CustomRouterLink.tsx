import { ForwardedRef, forwardRef } from 'react';
import { Link } from 'react-router-dom';

const CustomRouterLink = forwardRef<HTMLAnchorElement, { href: string }>(
  ({ href, ...other }, ref: ForwardedRef<HTMLAnchorElement>) => (
    <Link ref={ref} to={href} {...other} />
  )
);

export default CustomRouterLink;
