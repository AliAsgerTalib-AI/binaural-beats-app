import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchHealthMetrics, refreshAccessToken } from '@/lib/googleFitService';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    let accessToken = (session.user as any).accessToken;
    const refreshToken = (session.user as any).refreshToken;

    // Check if token needs refresh
    const expiresAt = (session.user as any).expiresAt;
    if (expiresAt && Date.now() > expiresAt * 1000) {
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (newAccessToken) {
        accessToken = newAccessToken;
      } else {
        return new Response(JSON.stringify({ error: 'Token refresh failed' }), { status: 401 });
      }
    }

    const metrics = await fetchHealthMetrics(accessToken);

    return new Response(JSON.stringify(metrics), { status: 200 });
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch health metrics' }), {
      status: 500,
    });
  }
}
