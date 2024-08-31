import { useEffect, useState } from 'react';
import completedtask from "assets/images/icons/completedtask.png"
import ongoing from "assets/images/icons/ongoingtask.gif"
import Qrcodecard from '../Qrcodecard';
import Apiservice from '../../../Services/TechniciansService'
import assignedtaskicon from "assets/images/icons/assigntask 2.png"
import { Grid } from '@mui/material';
import EarningCard from './EarningCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import { gridSpacing } from 'store/constant';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [startCount, setStartCount] = useState(0)
  const [ongoingCount, SetOngoingCount] = useState(0)
  const [data, setData] = useState(0)

  useEffect(() => {
    setLoading(false);
    StartTaskCount()
    OngoingTaskCount()
    getAllTasks()
  }, []);

  const StartTaskCount = async () => {
    const res = await Apiservice.StartTaskCount()
    const StarTask = res.data.start
    setStartCount(StarTask)
  }

  const OngoingTaskCount = async () => {
    const res = await Apiservice.OngoingTaskCount()

    const ongoingTask = res.data.Ongoing
    SetOngoingCount(ongoingTask)
  }

  const getAllTasks = async () => {
    try {
      const AllTask = await Apiservice.technicianTask();
      const Tasks = AllTask.data.Results;
      const mergedTasks = Tasks.reduce((acc, curr) => {
        acc.push(...curr.technicians[0]?.tasks);
        return acc;
      }, []);
      const completedTasks = mergedTasks.filter((task) => task.status === 'completed');
      // console.log("completedTasks",completedTasks.length);
      setData(completedTasks.length);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <div>
          <h5 style={{fontSize:"20px",fontWeight:"600"}}> Task History </h5>
        </div>
        <div className="mt-4">
          <div className="row ">
            <div className="col-xl-6 col-lg-6">
              <div className="card l-bg-blue-dark">
                <div className="card-statistic-3 p-4">
                  <div className="card-icon card-icon-large"> <img src={assignedtaskicon} style={{ width: '140px', height: '100px', paddingRight: '8px' }} alt='assign' /> </div>
                  <div className="mb-4">
                    <h5 className="card-title mb-0">Assigned Tasks </h5>
                  </div>
                  <div className="row align-items-center mb-2 d-flex">
                    <div className="col-8">
                      <h2 className="d-flex align-items-center mb-0">
                        {startCount}
                      </h2>
                    </div>
                    {/* <div className="col-4 text-right">
                      <span>9.23% <i className="fa fa-arrow-up"></i></span>
                    </div> */}
                  </div>
                  {/* <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                    <div className="progress-bar l-bg-green" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="card l-bg-orange-dark">
                <div className="card-statistic-3 p-4">
                  <div className="card-icon card-icon-large">
                    <img src={ongoing} alt='ongoing' style={{ width: '100px', height: '80px', paddingRight: '8px' }} />
                  </div>
                  <div className="mb-4">
                    <h5 className="card-title mb-0">On Going Tasks</h5>
                  </div>
                  <div className="row align-items-center mb-2 d-flex">
                    <div className="col-8">
                      <h2 className="d-flex align-items-center mb-0">
                        {ongoingCount}
                      </h2>
                    </div>
                    <div className="col-4 text-right">
                      {/* <span>2.5% <i className="fa fa-arrow-up"></i></span> */}
                    </div>
                  </div>
                  {/* <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                    <div className="progress-bar l-bg-cyan" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="card l-bg-green-dark">
                <div className="card-statistic-3 p-4">
                  <div className="card-icon card-icon-large">
                    <img src={completedtask} style={{ width: '130px', height: '80px', paddingRight: '8px' }} alt='complete' />
                  </div>
                  <div className="mb-4">
                    <h5 className="card-title mb-0">Completed Tasks</h5>
                  </div>
                  <div className="row align-items-center mb-2 d-flex">
                    <div className="col-8">
                      <h2 className="d-flex align-items-center mb-0">
                        {data}
                      </h2>
                    </div>
                    <div className="col-4 text-right">
                      {/* <span>10% <i className="fa fa-arrow-up"></i></span> */}
                    </div>
                  </div>
                  {/* <div className="progress mt-1 " data-height="8" style={{ height: '8px' }}>
                    <div className="progress-bar l-bg-orange" role="progressbar" data-width="25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style={{ width: '25%' }}></div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mb-3'>
          <h5 style={{fontSize:"20px",fontWeight:"600"}}> QR Code History </h5>
        </div>
        <Qrcodecard />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
{/* <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid> */}





