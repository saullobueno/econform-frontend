import React from 'react';
import PropTypes from 'prop-types';

import { useAuth } from 'context/auth';

export default function PrivateAction({ role, children }) {
  const { auth } = useAuth();

  if (!auth.access_role && auth.access_role !== 'ECONFORM') {
    return null;
  }

  return children;
}

PrivateAction.propTypes = {
  role: PropTypes.string.isRequired || PropTypes.array.isRequired,
};
