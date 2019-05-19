/* @flow */

import * as React from 'react';

type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

export const withTheme: <Props extends { theme: {} }>(
    Comp: React.ComponentType<Props>
  ) => React.ComponentType<Without<Props, "theme">>;