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
        const token = localStorage.getItem('token'); // Get JWT from storage
        if (!token) throw new Error('No authentication token found');

        const response = await fetch('http://localhost:8080/api/v1/reward/weekly', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch rewards');

        const data = await response.json();
        console.log('Fetched rewards:', data);
        setRewards(data);
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
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`/api/v1/reward/claim/${dayOfWeek}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Claim failed');

      // Refresh rewards after successful claim
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

  return (
      <div className="daily-rewards-container">
        <h2>Weekly Rewards</h2>
        <div className="rewards-grid">
          {rewards.map((reward) => (
              <div
                  key={reward.dayOfWeek}
                  className={`reward-card ${reward.claimed ? 'claimed' : ''} ${reward.claimable ? 'claimable' : ''}`}
              >
                <h3>{reward.dayName}</h3>
                <p>{reward.points} Points</p>
                <button
                    onClick={() => handleClaim(reward.dayOfWeek)}
                    disabled={!reward.claimable || reward.claimed}
                >
                  {reward.claimed ? 'Claimed' : 'Claim'}
                </button>
              </div>
          ))}
        </div>
      </div>
  );
};

export default DailyReward;
