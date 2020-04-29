/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';

import AuthLayout from './layouts/Auth';
import ErrorLayout from './layouts/Error';
import DashboardLayout from './layouts/Dashboard';

const routes = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/store" />
  },
  {
    path: '/auth',
    component: AuthLayout,
    routes: [
      {
        path: '/auth/login',
        exact: true,
        component: lazy(() => import('views/Login'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    path: '/errors',
    component: ErrorLayout,
    routes: [
      {
        path: '/errors/error-401',
        exact: true,
        component: lazy(() => import('views/Error401'))
      },
      {
        path: '/errors/error-404',
        exact: true,
        component: lazy(() => import('views/Error404'))
      },
      {
        path: '/errors/error-500',
        exact: true,
        component: lazy(() => import('views/Error500'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    route: '*',
    component: DashboardLayout,
    routes: [
      {
        path: '/store',
        exact: true,
        component: lazy(() => import('views/StoreManagentList'))
      },
      {
        path: '/store/new',
        exact: true,
        component: lazy(() => import('views/StoreManagentDetails'))
      },
      {
        path: '/store/:id',
        exact: true,
        component: lazy(() => import('views/StoreManagentDetails'))
      },
      {
        path: '/coupon',
        exact: true,
        component: lazy(() => import('views/CouponManagentList'))
      },
      {
        path: '/coupon/new',
        exact: true,
        component: lazy(() => import('views/CouponManagentDetails'))
      },
      {
        path: '/coupon/:id',
        exact: true,
        component: lazy(() => import('views/CouponManagentDetails'))
      },
      {
        path: '/person',
        exact: true,
        component: lazy(() => import('views/PersonManagentList'))
      },
      {
        path: '/person/new',
        exact: true,
        component: lazy(() => import('views/PersonManagentDetails'))
      },
      {
        path: '/person/:id',
        exact: true,
        component: lazy(() => import('views/PersonManagentDetails'))
      },
      {
        path: '/server',
        exact: true,
        component: lazy(() => import('views/ServerManagentList'))
      },
      {
        path: '/server/new',
        exact: true,
        component: lazy(() => import('views/ServerManagentDetails'))
      },
      {
        path: '/server/:id',
        exact: true,
        component: lazy(() => import('views/ServerManagentDetails'))
      },
      {
        path: '/document',
        exact: true,
        component: lazy(() => import('views/DocumentManagentList'))
      },
      {
        path: '/document/new',
        exact: true,
        component: lazy(() => import('views/DocumentManagentDetails'))
      },
      {
        path: '/document/:id',
        exact: true,
        component: lazy(() => import('views/DocumentManagentDetails'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  }
];

export default routes;
