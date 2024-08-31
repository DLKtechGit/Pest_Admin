import { IconBrandChrome, IconHelp,IconReport,IconAlertOctagon } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp, IconReport,IconAlertOctagon };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const Issues = {
  id: 'issues',
  title: 'All Issues',
  type: 'group',
  children: [
    {
      id: 'issuesPage',
      title: 'Issues',
      type: 'item',
      url: '/issues/manageIssues',
      icon: icons.IconAlertOctagon,
      breadcrumbs: false
    },   
  ]
};

export default Issues;