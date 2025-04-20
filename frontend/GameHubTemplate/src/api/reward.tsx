export const getTotalPoints = async () => {
    const response = await fetch('http://localhost:8080/api/v1/reward/totalPoints', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + localStorage.getItem('token')
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch total points');
    }

    const data = await response.json();
    return data.totalPoints;
}
