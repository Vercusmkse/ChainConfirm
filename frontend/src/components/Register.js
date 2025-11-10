import React, { useState, useEffect } from 'react';

function Register({ currentUserAddress }) {
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkRegistration = async () => {
            if (!currentUserAddress) return;
            setLoading(true);
            try {
                const response = await fetch(`/api/users/${currentUserAddress}`);
                const data = await response.json();
                setIsRegistered(data.isRegistered);
            } catch (error) {
                console.error("Failed to check registration status:", error);
                setIsRegistered(false);
            }
            setLoading(false);
        };
        checkRegistration();
    }, [currentUserAddress]);

    const handleRegister = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/users/register', { method: 'POST' });
            if (!response.ok) throw new Error('Registration failed');
            alert('Registration successful! Your profile is now on-chain.');
            setIsRegistered(true);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="card"><h2>User Profile</h2><p>Loading registration status...</p></div>;
    }

    return (
        <div className="card">
            <h2>User Registration</h2>
            {isRegistered ? (
                <p className="success-message">✅ You are registered on-chain.</p>
            ) : (
                <>
                    <p>Your address is not registered. Register now to use the platform.</p>
                    <button onClick={handleRegister} disabled={loading}>
                        {loading ? 'Registering...' : 'Register Profile On-Chain'}
                    </button>
                </>
            )}
        </div>
    );
}

export default Register;
