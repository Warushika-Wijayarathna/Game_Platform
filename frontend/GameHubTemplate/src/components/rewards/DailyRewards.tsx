import { useEffect, useState } from 'react';

export interface RewardDTO {
  dayOfWeek: number;
  dayName: string;
  points: number;
  claimed: boolean;
  claimable: boolean;
}

const DailyReward = () => {
  const [rewards, setRewards] = useState<RewardDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeeklyRewards = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch('http://localhost:8080/api/v1/reward/weekly', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch rewards');

        const data = await response.json();
        setRewards(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load rewards');
      } finally {
        setLoading(false);
      }
    };
    fetchWeeklyRewards();
  }, []);

  const handleClaim = async (dayOfWeek: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`http://localhost:8080/api/v1/reward/claim/${dayOfWeek}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Claim failed');

      const updatedRewards = rewards.map(reward =>
          reward.dayOfWeek === dayOfWeek ? { ...reward, claimed: true } : reward
      );
      setRewards(updatedRewards);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to claim reward');
    }
  };

  if (loading) return <div>Loading rewards...</div>;
  if (error) return <div>Error: {error}</div>;

  // Convert JavaScript's 0-6 (Sun-Sat) to 1-7 (Mon-Sun) to match backend
  const jsDay = new Date().getDay();
  const currentDayOfWeek = jsDay === 0 ? 7 : jsDay;

  return (
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <h2 style={{
          textAlign: 'center',
          color: '#2c3e50',
          fontSize: '2.5rem',
          marginBottom: '2rem',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>Weekly Rewards</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1.5rem',
          justifyContent: 'center'
        }}>
          {Array.isArray(rewards) && rewards.map((reward) => (
              <div
                  key={reward.dayOfWeek}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    ...(reward.claimed && {
                      background: '#f5f6fa',
                      opacity: '0.8'
                    }),
                    ...(reward.claimable && {
                      border: '2px solid #dea814'
                    })
                  }}
              >
                <h3 style={{
                  color: '#2c3e50',
                  margin: '0 0 0.5rem',
                  fontSize: '1.25rem'
                }}>{reward.dayName}</h3>

                <p style={{
                  color: '#dea814',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: '0 0 1rem'
                }}>{reward.points} Points</p>

                <button
                    style={{
                      backgroundColor: reward.claimed ? '#7f8c8d' : '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '25px',
                      cursor: (!reward.claimable || reward.claimed || reward.dayOfWeek > currentDayOfWeek)
                          ? 'not-allowed'
                          : 'pointer',
                      fontWeight: '600',
                      transition: 'background-color 0.2s ease',
                      width: '100%'
                    }}
                    onClick={() => handleClaim(reward.dayOfWeek)}
                    disabled={!reward.claimable || reward.claimed || reward.dayOfWeek > currentDayOfWeek}
                >
                  {reward.claimed ? 'Claimed' : 'Claim'}
                </button>
              </div>
          ))}
        </div>
        <p style={{
          marginTop: '2rem',
          textAlign: 'center',
          color: '#dea814',
          fontSize: '1.125rem'
        }}>
          Claim your rewards every week! Points can be used to unlock exclusive content.
        </p>
      </div>
  );
};

export default DailyReward;
