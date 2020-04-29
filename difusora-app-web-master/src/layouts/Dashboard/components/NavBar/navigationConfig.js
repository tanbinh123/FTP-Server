/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from 'react';
import { colors } from '@material-ui/core';
import EventNote from '@material-ui/icons/EventNote';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ChatIcon from '@material-ui/icons/ChatOutlined';
import CodeIcon from '@material-ui/icons/Code';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import PlaceIcon from '@material-ui/icons/PlaceOutlined';
import AssignmentIndOutlinedIcon from '@material-ui/icons/AssignmentIndOutlined';
import StorageIcon from '@material-ui/icons/Storage';
import FaceIcon from '@material-ui/icons/Face';
import DescriptionIcon from '@material-ui/icons/Description';

import { Label } from 'components';

export default [
  {
    title: 'Menu',
    pages: [
      {
        title: 'Documents',
        href: '/document',
        icon: DescriptionIcon
      },
      {
        title: 'Servers',
        href: '/server',
        icon: StorageIcon

      },
      {
        title: 'Persons',
        href: '/person',
        icon: FaceIcon
      },
    ]
  },
  
];
