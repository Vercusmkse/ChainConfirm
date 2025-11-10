import React, { useState } from 'react';
import { ethers } from 'ethers';

const getStatusString = (status) => {
  // ... (same as before)
};

function TransactionManager({ currentUserAddress }) {
    const [transaction, setTransaction] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [sellerAddress, setSellerAddress] = useState('');
    const [amount, setAmount] = useState('0.01');
    const [reviewRating, setReviewRating] = useState(5);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const createNewTransaction = async () => {
        // ... (logic from previous App.js)
    };

    const fetchTransaction = async (id) => {
        // ... (logic from previous App.js)
    };

    const handleReview = async () => {
        if (!transaction) return;
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transaction_id: transaction.id,
                    rating: parseInt(reviewRating, 10),
                }),
            });
            if (!response.ok) throw new Error('Failed to submit review.');
            alert('Review submitted successfully!');
            fetchTransaction(transaction.id); // Refresh transaction to show review status
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    // Placeholder functions for ship/complete for brevity
    const handleShip = async () => alert("Ship function not implemented in this UI mock.");
    const handleComplete = async () => alert("Complete function not implemented in this UI mock.");

    return (
        <div className="card">
            <h2>Transaction Management</h2>
            {/* Create Transaction Form */}
            <div className="form-section">
                <h3>Create New Transaction</h3>
                <input type="text" value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} placeholder="Seller's Address" />
                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount in ETH" />
                <button onClick={createNewTransaction} disabled={loading}>Create</button>
            </div>

            {/* View Transaction Form */}
            <div className="form-section">
                <h3>View Transaction</h3>
                <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Transaction ID" />
                <button onClick={() => fetchTransaction(transactionId)} disabled={loading}>Fetch</button>
            </div>

            {error && <p className="error">Error: {error}</p>}

            {transaction && (
                <div className="transaction-details">
                    <h3>Transaction Details</h3>
                    {/* ... (display transaction details) ... */}

                    {/* Actions: Ship, Complete, Review */}
                    <div className="actions">
                        {transaction.status === 1 && transaction.seller === currentUserAddress && <button onClick={handleShip}>Ship Item</button>}
                        {transaction.status === 2 && transaction.buyer === currentUserAddress && <button onClick={handleComplete}>Complete Transaction</button>}
                        
                        {transaction.status === 3 && (
                            <div>
                                <h4>Leave a Review</h4>
                                <select value={reviewRating} onChange={(e) => setReviewRating(e.target.value)}>
                                    {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>)}
                                </select>
                                <button onClick={handleReview} disabled={loading}>Submit Review</button>
                                {transaction.buyer === currentUserAddress && transaction.buyerHasReviewed && <p>You have reviewed this transaction.</p>}
                                {transaction.seller === currentUserAddress && transaction.sellerHasReviewed && <p>You have reviewed this transaction.</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TransactionManager;
