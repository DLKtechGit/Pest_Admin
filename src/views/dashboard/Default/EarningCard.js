import PropTypes from 'prop-types';
import { useState } from 'react';
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
// assets
import customericon from 'assets/images/icons/customer icon.png'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Apiservice from '../../../Services/CustomerServices'
import { useEffect } from 'react';
import Loader from 'ui-component/Loader/Loader';
import { useNavigate } from 'react-router';
const CardWrapper = styled(MainCard)(({ theme }) => ({

  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({ isLoading }) => {
  const theme = useTheme();
  const [count, setCount] = useState(0)
  const [loader,setLoader] = useState(false)
  const navigate = useNavigate()

  // const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    CustomersCount()
  }, [])

  const CustomersCount = async () => {
  setLoader(true)
    const res = await Apiservice.CustomerCount()
    const counts = res.data.totalCustomers
    setCount(counts)
    setLoader(false)
  }

  

  return (
    
    <>

{loader && (
      <Loader show={loader}/>
      
    )} 
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false} className='dash-card' >
          <Box sx={{ p: 2.25 }} >
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      className='icon-bg'
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette.secondary[800],
                        mt: 1
                      }}
                    >
                      <img src={customericon} alt="Notification" />
                    </Avatar>
                  </Grid>                  
                </Grid>
              </Grid>
              <Grid item>
                <Grid  container alignItems="center">
                  <Grid item>
                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>  {count}</Typography>
                  </Grid>
                  <Grid item>
                    <Avatar
                      className='arrow'
                      sx={{
                        cursor: 'pointer',
                        ...theme.typography.smallAvatar,
                        backgroundColor: theme.palette.secondary[200],
                        color: theme.palette.secondary.dark
                      }}
                    >
                      <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  className='text-in'
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: theme.palette.secondary[200]
                  }}
                >
                  Total Customers
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool
};

export default EarningCard;
