import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import code from './code';
import other from './other';
import AddNewDetials from './AddNewDetials'
import AdminLogin from './DashboardLogin';
import Issues from './Issues';
import { useSelector } from "react-redux";

// ==============================|| MENU ITEMS ||============================== //


const menuItems = {
  items: [dashboard,AdminLogin , AddNewDetials, pages, utilities,code, other,Issues]
};

export default menuItems;
