// Google Fit API service for fetching health data
interface HealthMetrics {
  restingHeartRate: number | null;
  heartRateVariability: number | null;
  sleepQuality: number | null; // 0-100 score
  stressLevel: number | null; // 0-100 score
  lastUpdated: number;
}

interface GoogleFitSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const GOOGLE_FIT_BASE_URL = 'https://www.googleapis.com/fitness/v1/users/me';

export const fetchHealthMetrics = async (
  accessToken: string
): Promise<HealthMetrics> => {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  try {
    // Fetch resting heart rate (daily average)
    const heartRateData = await fetch(`${GOOGLE_FIT_BASE_URL}/dataset:aggregate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [
          {
            dataTypeName: 'com.google.heart_rate.bpm',
            dataSourceId: 'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm',
          },
        ],
        bucketByTime: { durationMillis: 86400000 }, // 1 day buckets
        startTimeMillis: sevenDaysAgo,
        endTimeMillis: now,
      }),
    });

    const heartRateResponse = await heartRateData.json();

    // Calculate average resting heart rate from last 7 days
    let restingHeartRate: number | null = null;
    if (heartRateResponse.bucket && heartRateResponse.bucket.length > 0) {
      const allRates = heartRateResponse.bucket
        .flatMap((bucket: any) =>
          bucket.dataset[0]?.point?.map((point: any) => point.value[0]?.fpVal)
        )
        .filter(Boolean);
      if (allRates.length > 0) {
        restingHeartRate = Math.round(
          allRates.reduce((a: number, b: number) => a + b, 0) / allRates.length
        );
      }
    }

    // Fetch sleep data
    let sleepQuality: number | null = null;
    try {
      const sleepData = await fetch(`${GOOGLE_FIT_BASE_URL}/dataset:aggregate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aggregateBy: [
            {
              dataTypeName: 'com.google.sleep.segment',
              dataSourceId: 'derived:com.google.sleep.segment:com.google.android.gms:sleep_segment',
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: sevenDaysAgo,
          endTimeMillis: now,
        }),
      });

      const sleepResponse = await sleepData.json();

      // Calculate sleep quality as percentage of nights with adequate sleep (7+ hours)
      if (sleepResponse.bucket && sleepResponse.bucket.length > 0) {
        const nightsWithData = sleepResponse.bucket.filter(
          (bucket: any) => bucket.dataset[0]?.point?.length > 0
        ).length;

        if (nightsWithData > 0) {
          const goodSleepNights = sleepResponse.bucket.filter((bucket: any) => {
            const totalSeconds = bucket.dataset[0]?.point?.reduce(
              (sum: number, point: any) => sum + (point.value[0]?.intVal || 0),
              0
            ) || 0;
            const hours = totalSeconds / 3600;
            return hours >= 7;
          }).length;

          sleepQuality = Math.round((goodSleepNights / nightsWithData) * 100);
        }
      }
    } catch (e) {
      console.log('Sleep data not available');
    }

    // Estimate HRV from stress data (if available)
    let heartRateVariability: number | null = null;
    try {
      const stressData = await fetch(`${GOOGLE_FIT_BASE_URL}/dataset:aggregate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aggregateBy: [
            {
              dataTypeName: 'com.google.stress_score.level',
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: sevenDaysAgo,
          endTimeMillis: now,
        }),
      });

      const stressResponse = await stressData.json();

      if (stressResponse.bucket && stressResponse.bucket.length > 0) {
        const stressScores = stressResponse.bucket
          .flatMap((bucket: any) =>
            bucket.dataset[0]?.point?.map((point: any) => point.value[0]?.intVal)
          )
          .filter(Boolean);

        if (stressScores.length > 0) {
          const avgStress = stressScores.reduce((a: number, b: number) => a + b, 0) / stressScores.length;
          // Inverse relationship: lower stress = higher HRV estimate
          heartRateVariability = Math.round(60 - avgStress * 0.6);
        }
      }
    } catch (e) {
      console.log('Stress data not available');
    }

    // Estimate stress level (0-100, higher = more stressed)
    let stressLevel: number | null = null;
    if (restingHeartRate !== null) {
      // Simplified: RHR of 60 = low stress (20), RHR of 90 = high stress (80)
      stressLevel = Math.min(100, Math.max(0, (restingHeartRate - 50) * 2.5));
    }

    return {
      restingHeartRate,
      heartRateVariability,
      sleepQuality,
      stressLevel,
      lastUpdated: now,
    };
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    return {
      restingHeartRate: null,
      heartRateVariability: null,
      sleepQuality: null,
      stressLevel: null,
      lastUpdated: now,
    };
  }
};

export const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }).toString(),
    });

    const data = await response.json();
    return data.access_token || null;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
};
