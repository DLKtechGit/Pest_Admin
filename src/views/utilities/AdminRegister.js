import { Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import AdminAuthRegister from 'views/pages/authentication/auth-forms/AdminAuthRegister';

// ===============================|| AUTH3 - REGISTER ||=============================== //

const AdminRegister = () => {
  return (
    <MainCard title="Create Child Admin">
      <Grid container justifyContent="center" alignItems="center">
        <AdminAuthRegister />
      </Grid>
    </MainCard>
  );
};

export default AdminRegister;
