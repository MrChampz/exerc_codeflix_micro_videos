import React from 'react';
import Link, { LinkProps } from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter: React.FC<LinkRouterProps> = (props) => (
  <Link
    { ...props }
    component={ RouterLink as any }
  />
);

export default LinkRouter;