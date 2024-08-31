import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ManageserviceLists from 'views/utilities/ManageserviceLists';
import ManageCompanylist from 'views/utilities/ManageCompanylist';
import ManageChemicalsLists from 'views/utilities/ManageChemicalsLists';
import ManageCategoryLists from 'views/utilities/ManageCategoryLists';
import ManageIssues from 'views/utilities/ManageIssues';


// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routin]
const UtilsTechnicianDeletedTask = Loadable(lazy(() => import('views/utilities/TechnicianDeletedList')));

const UtilsDeletedCustomers = Loadable(lazy(() => import('views/utilities/DeletedCustomers')));
const UtilsDeleteQrCode = Loadable(lazy(() => import('views/utilities/DeleteQrCode')));
const UtilsCreateQRCode = Loadable(lazy(() => import('views/utilities/CreateQRCode')));
const UtilsTechnicianCompletedTask = Loadable(lazy(() => import('views/utilities/TechnicianCompletedTask')));
const UtilsAddTaskDetials = Loadable(lazy(() => import('views/utilities/AddTaskDetials')));
const UtilsTechnicianOngoingTask = Loadable(lazy(() => import('views/utilities/TechnicianOngoingTask')));
const UtilsTechnicianAssignedTask = Loadable(lazy(() => import('views/utilities/TechnicianAssignedTask')));
const UtilsTechnicianCreateTask = Loadable(lazy(() => import('views/utilities/TechnicianCreateTask')));
const UtilsTechnicianResetPassword = Loadable(lazy(() => import('views/utilities/ManageTechnicianLogin')));
const UtilsCustomerResetPassword = Loadable(lazy(() => import('views/utilities/ManageCustomerLogin')));
const UtilsDeleteTechinician = Loadable(lazy(() => import('views/utilities/DeleteTechinician')));
const UtilsDeleteCustomer = Loadable(lazy(() => import('views/utilities/ManageCompanylist')));
const AuthTechinicianLogin = Loadable(lazy(() => import('views/pages/authentication/authentication3/TechinicianLogin')));
const UtilsAddTechinician = Loadable(lazy(() => import('views/utilities/ManageTechnicianList')));
const UtilsTechnocianTable = Loadable(lazy(() => import('views/utilities/TechnicianListTable')));
const UtilsTable = Loadable(lazy(() => import('views/utilities/CustomerListTable')));
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));
const UtilsCustomerAssignedTask = Loadable(lazy(() => import('views/utilities/CustomerAssignedTask')));
const UtilsCustomerOngoinTask = Loadable(lazy(() => import('views/utilities/CustomerOngoingTask')));
const UtilsCustomerCompletedTask = Loadable(lazy(() => import('views/utilities/CustomerCompletedTask')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));
const AdmidRegiter = Loadable(lazy(() => import('views/utilities/AdminRegister')));
const ManageAdmin = Loadable(lazy(() => import('views/utilities/ManageAdmin')));
const CreateTaskModel = Loadable(lazy(() => import('views/utilities/TaskCrateModel')));
// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page/ManageReports')));

// ==============================|| MAIN ROUTING ||=================/============ //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'admindashboard',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    }, {
      path: 'add',
      children: [
        {
          path: 'details',
          element: <UtilsAddTaskDetials />

        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <UtilsTablerIcons />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <UtilsMaterialIcons />
        }
      ]
    },
    {
      path: '/customer-list',
      children: [
        {
          path: 'table',
          element: <UtilsTable />
        }
      ]
    },
    {
      path: '/deleted-customer',
      children: [
        {
          path: 'list',
          element: <UtilsDeletedCustomers />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util/technician/table',
          element: <UtilsTechnocianTable />
        }
      ]
    },
    {
      path: 'login',
      children: [
        {
          path: '/login',
          element: <AuthRegister3 />
        }
      ]
    },
    {

      path: 'add-tech',
      children: [
        {
          path: 'new/techinician',
          element: <UtilsAddTechinician />
        }
      ]
    }, {
      path: 'delete',
      children: [
        {
          path: 'customer/login',
          element: <UtilsDeleteCustomer />
        }
      ]
    }, {

      path: 'delete',
      children: [
        {
          path: 'techinician/login',
          element: <UtilsDeleteTechinician />
        }
      ]

    }
    , {
      path: 'manage',
      children: [
        {
          path: 'customer/login',
          element: <UtilsCustomerResetPassword />
        }
      ]
    }, {
      path: 'manage',
      children: [

        {
          path: 'technician/login',
          element: <UtilsTechnicianResetPassword />
        }
      ]
    }
    , {

      path: 'create-techician',
      element: <AuthTechinicianLogin />

    },

    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: '/customer-ass',
      children: [
        {
          path: 'task',
          element: <UtilsCustomerAssignedTask />
        }
      ]
    }, {
      path: '/customer-ongoing',
      children: [
        {
          path: 'task',
          element: <UtilsCustomerOngoinTask />
        }
      ]
    }, {
      path: '/customer-completed',
      children: [
        {
          path: 'task',
          element: <UtilsCustomerCompletedTask />
        }
      ]
    }, {
      path: 'tech',
      children: [
        {
          path: 'create/task',
          element: <UtilsTechnicianCreateTask />
        }
      ]
    }, {
      path: 'tech',
      children: [
        {
          path: 'assigned/task',
          element: <UtilsTechnicianAssignedTask />

        }
      ]
    },
    {
      path: 'tech',
      children: [
        {
          path: 'ongoing/task',
          element: <UtilsTechnicianOngoingTask />
        }
      ]
    }, {
      path: 'tech',
      children: [
        {
          path: 'completed/task',

          element: <UtilsTechnicianCompletedTask />
        }
      ]
    },
    {
      path: 'create',
      children: [
        {
          path: 'qr/code',
          element: <UtilsCreateQRCode />
        }
      ]
    }, {
      path: 'delete',
      children: [
        {
          path: 'qr/code',
          element: <UtilsDeleteQrCode />
        }
      ]
    },
    {
      path: 'technician-deleted',
      children: [
        {
          path: 'list',
          element: <UtilsTechnicianDeletedTask />
        }
      ]
    },
    {
      path: 'add',
      children: [
        {
          path: 'managecategorylist',
          element: <ManageCategoryLists />
        }
      ]
    },
    {
      path: 'add',
      children: [
        {
          path: 'manageservicelist',
          element: <ManageserviceLists />
        }
      ]
    },
    {
      path: 'add',
      children: [
        {
          path: 'managechemicalslist',
          element: <ManageChemicalsLists />
        }
      ]
    },
    {
      path: 'add',
      children: [
        {
          path: 'managecompanylist',
          element: <ManageCompanylist />
        }
      ]
    },
    {
      path: 'create',
      children: [
        {
          path: 'Task-model/:technicianId',
          element: <CreateTaskModel/>
        }
      ]
    },
    {
      path: 'admin',
      children: [
        {
          path: 'register',
          element: <AdmidRegiter/>
        }
      ]
    },
    {
      path: 'delete',
      children: [
        {
          path: 'admin',
          element: <ManageAdmin/>
        }
      ]
    },
    {
      path: 'issues',
      children: [
        {
          path: 'manageIssues',
          element: <ManageIssues/>
        }
      ]
    }
  ]
};

export default MainRoutes;
