// assets
import { IconKey, IconList, IconPencil } from '@tabler/icons';

// constant
const icons = {
  IconKey,
  IconList,
  IconPencil
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Customers',
  type: 'group',
  children: [
    {
      id: 'cusList',
      title: 'List ',
      type: 'collapse',
      icon: icons.IconList,
      children: [
        
        {
          id: 'view',
          title: 'List of Customers',
          type: 'item',
          url: '/customer-list/table',
        },
        {
          id: 'manage',
          title: 'Manage Customers',
          type: 'item',
          url: '/add/managecompanylist',
        },
        // {
        //   id: 'deleted customers',
        //   title: 'Restore Customers',
        //   type: 'item',
        //   url: '/deleted-customer/list',
        // }
      ]
    },
    {
      id: 'cusauthentication1',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,
      children: [ 
        // {
        //   id: 'login3',
        //   title: 'Create Login',
        //   type: 'item',
        //   url: '/login'
        // },
        // {
        //   id: 'delete-customer',
        //   title: 'Manage Logins',
        //   type: 'item',
        //   url: '/delete/customer/login'
        // },
        {
          id: 'manage-log',
          title: 'Manage Login',
          type: 'item',
          url: '/manage/customer/login'
        }
      ]
    },
    // {
    //   id: 'authentication',
    //   title: 'Task',
    //   type: 'collapse',
    //   icon: icons.IconPencil,
    //   children: [
    //     {
    //       id: 'assign',
    //       title: 'Assigned Task',
    //       type: 'item',
    //       url: '/customer-ass/task',
    //     },
    //     {
    //       id: 'going',
    //       title: 'On Going Task',
    //       type: 'item',
    //       url: '/customer-ongoing/task',
    //     },
    //     {
    //       id: 'complete',
    //       title: 'Completed Task',
    //       type: 'item',
    //       url: '/customer-completed/task',
    //     }
    //   ]
    // }
  ]
};

export default pages;

