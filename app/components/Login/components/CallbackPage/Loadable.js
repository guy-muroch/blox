import React from 'react';
import loadable from '~app/utils/loadable';
import LoadingIndicator from '~app/components/common/LoadingIndicator';

export default loadable(() => import('./index'), {
  fallback: <LoadingIndicator />,
});
