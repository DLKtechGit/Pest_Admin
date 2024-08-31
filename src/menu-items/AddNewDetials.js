
import { IconPlus,IconEditCircle,IconUsers,IconFlask,IconCategory } from '@tabler/icons';

const icons = {
    IconPlus,
    IconEditCircle,
    IconUsers,
    IconFlask,
    IconCategory
}

const dashboard = {
    id: 'add new',
    title: 'Add New',
    type: 'group',
    children: [
      {
        id: 'detials',
        title: 'Add',
        type: 'item',
        url: 'add/details',
        icon: icons.IconPlus,
        breadcrumbs: false
      },
      {
        id: 'categoryList',
        title: 'Manage Category List',
        type: 'item',
        url: 'add/managecategorylist',
        icon: icons.IconCategory,
        breadcrumbs: false
      },
      {
        id: 'serviceList',
        title: 'Manage Service List',
        type: 'item',
        url: 'add/manageservicelist',
        icon: icons.IconEditCircle,
        breadcrumbs: false
      },
      {
        id: 'chemicalsList',
        title: 'Manage Chemicals List',
        type: 'item',
        url: 'add/managechemicalslist',
        icon: icons.IconFlask,
        breadcrumbs: false
      },
    ]
  };
  
  export default dashboard;