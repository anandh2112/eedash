import axios from 'axios';
import moment from 'moment-timezone';
import HomeClient from './components/HomeClient';

export default async function Home() {
  const startDateTime = "2025-04-01 00:00:00";
  const endDateTime = moment()
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss");

  let energyTracker = 0;
  const EMISSION_FACTOR = 0.82;

  // 1. Fetch energy consumption from external API
  try {
   

    energyTracker = 0;
  } catch (error) {
    console.error("Error fetching energy tracker:", error);
  }



  const clients =  0;
  const devices =  0;

  const emissionTracker = parseFloat(
    (energyTracker * EMISSION_FACTOR).toFixed(1)
  );

  const clientPipeline = 0;


  let alert = null;


  // 3. Pass all props including alert
  return (
    <HomeClient
      clients={clients}
      devices={devices}
      energyTracker={energyTracker}
      emissionTracker={emissionTracker}
      clientPipeline={clientPipeline}
      alert={alert}
    />
  );
}