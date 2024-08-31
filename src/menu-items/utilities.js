// assets
import { IconList, IconKey, IconPencil } from '@tabler/icons';

// constant
const icons = {
  IconList,
  IconKey,
  IconPencil
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Technician',
  type: 'group',
  children: [
    {
      id: 'techList',
      title: 'List ',
      type: 'collapse',
      icon: icons.IconList,

      children: [
        {
          id: 'view',
          title: 'List of Techician ',
          type: 'item',
          url: '/utils/util/technician/table'
        },
        {
          id: 'managetech',
          title: 'Manage Technician',
          type: 'item',
          url: '/add-tech/new/techinician'
        },
        // {
        //   id: 'delete',
        //   title: ' Restore Technician',
        //   type: 'item',
        //   url: '/technician-deleted/list'
        // }
      ]
    },
    {
      id: 'techauthentication1',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'manageLog',
          title: 'Manage Logins',
          type: 'item',
          url: '/manage/technician/login'
        }
      ]
    },
    {
      id: 'techauthentication2',
      title: 'Task',
      type: 'collapse',
      icon: icons.IconPencil,

      children: [
        {
          id: 'create',
          title: 'Create Task',
          type: 'item',
          url: '/tech/create/task'
        },
        {
          id: 'assigned',
          title: 'Assigned Task',
          type: 'item',
          url: '/tech/assigned/task'
        },
        {
          id: 'going',
          title: 'On Going Task',
          type: 'item',
          url: '/tech/ongoing/task'
        },
        {
          id: 'complete',
          title: 'Completed Task',
          type: 'item',
          url: '/tech/completed/task'
        }
      ]
    }
  ]
};

export default utilities;
