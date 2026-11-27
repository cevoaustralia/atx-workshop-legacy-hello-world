import { Link as RouterLink, LinkProps } from '@tanstack/react-router';
import React from 'react';

export const Link: React.FC<LinkProps> = (props) => {
  return <RouterLink {...props} />;
};
