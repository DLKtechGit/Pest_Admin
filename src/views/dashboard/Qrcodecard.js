import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import qrcode from 'assets/images/icons/qrcodeicon.gif'
// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';
import ApiTotalQrcode from "../../Services/Qrcode"
// assets


// styles
const CardWrapper = styled(MainCard)(() => ({
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `#8FC84F`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `#8BA075`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

const Qrcodecard = ({ isLoading }) => {
  const theme = useTheme();
  const [count, setCount] = useState(0)
  // const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    CustomersCount()
  }, [])

  const CustomersCount = async () => {
    const res = await ApiTotalQrcode?.GetTotalQrcodes()
    console.log("res-------------------------------------->", res.data);
    const counts = res.data.totalQrcode
    setCount(counts)
  }
  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <CardWrapper border={false} content={false} style={{ height: '120px', width: '400px' }} >
          <Box sx={{ p: 2 }} >
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      backgroundColor: theme.palette.warning.light,
                      color: theme.palette.warning.dark
                    }}
                  >
                    <img src={qrcode} alt='qr' />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    py: 2,
                    mt: 0.45,
                    mb: 0.45
                  }}
                  primary={<Typography variant="h3">{count}</Typography>}
                  secondary={
                    <Typography
                      variant="subtitle2 h6"
                      sx={{
                        color: theme.palette.grey[500],
                        mt: 0.5
                      }}
                    >
                      Total QR Code generated
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

Qrcodecard.propTypes = {
  isLoading: PropTypes.bool
};

export default Qrcodecard;
