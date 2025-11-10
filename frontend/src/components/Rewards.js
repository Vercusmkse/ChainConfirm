import React, { useState, useEffect } from 'react';

// In a real app, this would be fetched from the contract or a config file
const CONTRACT_OWNER_ADDRESS = "YOUR_CONTRACT_OWNER_ADDRESS_HERE"; // Replace with your actual owner address

function Rewards({ currentUserAddress }) {
    const [bestBuyer, setBestBuyer] = useState('');
    const [bestSeller, setBestSeller] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isOwner = currentUserAddress.toLowerCase() === CONTRACT_OWNER_ADDRESS.toLowerCase();

    const handleSetWinners = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/rewards/winners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ best_buyer: bestBuyer, best_seller: bestSeller }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to set winners');
            alert('Weekly winners have been set on-chain!');
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleClaimReward = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/rewards/claim', { method: 'POST' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to claim reward. Are you a winner?');
            alert(`Reward claimed successfully! Tx: ${data.transaction_hash}`);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="card">
            <h2>🏆 Weekly Rewards</h2>
            {error && <p className="error">{error}</p>}

            {/* User Section */}
            <div className="form-section">
                <h3>Claim Your Reward</h3>
                <p>If you've been selected as a Best Buyer or Seller, you can claim your reward here.</p>
                <button onClick={handleClaimReward} disabled={loading}>
                    {loading ? 'Claiming...' : 'Claim Reward'}
                </button>
            </div>

            {/* Admin Section */}
            {isOwner && (
                <div className="form-section admin-section">
                    <h3>Admin: Set Weekly Winners</h3>
                    <input
                        type="text"
                        value={bestBuyer}
                        onChange={(e) => setBestBuyer(e.target.value)}
                        placeholder="Best Buyer Address (0x...)"
                    />
                    <input
                        type="text"
                        value={bestSeller}
                        onChange={(e) => setBestSeller(e.target.value)}
                        placeholder="Best Seller Address (0x...)"
                    />
                    <button onClick={handleSetWinners} disabled={loading || !bestBuyer || !bestSeller}>
                        {loading ? 'Setting...' : 'Set Winners On-Chain'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default Rewards;
