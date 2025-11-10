import React, { useState, useEffect } from 'react';

function UserProfile({ userAddress }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userAddress) return;
            setLoading(true);
            try {
                const response = await fetch(`/api/users/${userAddress}`);
                const data = await response.json();
                if (data.isRegistered) {
                    setProfile(data);
                } else {
                    setProfile(null);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setProfile(null);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [userAddress]);

    if (!userAddress || !profile) {
        return null; // Don't show the component if there's no address or profile
    }

    if (loading) {
        return <div className="card"><h2>My Reputation</h2><p>Loading profile...</p></div>;
    }

    return (
        <div className="card">
            <h2>My On-Chain Reputation</h2>
            <div className="profile-stats">
                <div>
                    <strong>Total Transactions:</strong>
                    <span>{profile.totalTransactions}</span>
                </div>
                <div>
                    <strong>Total Reviews:</strong>
                    <span>{profile.totalReviews}</span>
                </div>
                <div>
                    <strong>Average Rating:</strong>
                    <span>{profile.averageRating} / 5</span>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
