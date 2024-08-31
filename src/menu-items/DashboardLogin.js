import { IconDashboard ,IconEditCircle ,IconUserPlus} from '@tabler/icons';

// constant
const icons = { IconDashboard,IconEditCircle,IconUserPlus };

const AdminLogin = {
    id: 'adminLogin',
    title: 'Admin',
    type: 'group',
    children: [
      {
        id: 'rege',
        title: 'Create Child Admin',
        type: 'item',
        url: '/admin/register',
        icon: icons.IconUserPlus,
        breadcrumbs: false
      },
      {
        id: 'childAdmin',
        title: 'Manage Child Admin',
        type: 'item',
        url: '/delete/admin',
        icon: icons.IconEditCircle,
        breadcrumbs: false
      }
    ]
  };
  
  export default AdminLogin;