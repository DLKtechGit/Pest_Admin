// assets
import { IconBrandChrome, IconHelp,IconReport } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp, IconReport };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  title: 'Task Reports',
  type: 'group',
  children: [
    {
      id: 'sample-page',
      title: 'Reports',
      type: 'item',
      url: '/sample-page',
      icon: icons.IconReport,
      breadcrumbs: false
    },   
  ]
};

export default other;
