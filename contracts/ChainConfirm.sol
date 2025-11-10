// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ChainConfirm
 * @dev A simple, decentralized escrow contract for P2P commerce.
 */
contract ChainConfirm {
    // --- Events ---
    event TransactionCreated(bytes32 indexed transactionId, address indexed buyer, address indexed seller, uint256 amount);
    event TransactionShipped(bytes32 indexed transactionId);
    event TransactionCompleted(bytes32 indexed transactionId);
    event TransactionCancelled(bytes32 indexed transactionId);

    // --- State ---
    enum Status {
        Empty,      // Default state
        Locked,     // Funds are held in escrow
        Shipped,    // Seller has shipped the item
        Completed,  // Buyer has confirmed receipt, funds released
        Cancelled   // Transaction has been cancelled and refunded
    }

    struct Transaction {
        address buyer;
        address seller;
        uint256 amount;
        Status status;
    }

    mapping(bytes32 => Transaction) public transactions;

    // --- Functions ---

    /**
     * @dev Creates a new transaction and locks the buyer's funds.
     * The `transactionId` should be a unique identifier generated off-chain.
     */
    function createTransaction(bytes32 transactionId, address seller) public payable {
        require(transactions[transactionId].status == Status.Empty, "Transaction ID already exists");
        require(msg.value > 0, "Amount must be greater than zero");
        require(seller != address(0), "Seller address cannot be zero");

        transactions[transactionId] = Transaction({
            buyer: msg.sender,
            seller: seller,
            amount: msg.value,
            status: Status.Locked
        });

        emit TransactionCreated(transactionId, msg.sender, seller, msg.value);
    }

    /**
     * @dev Allows the seller to mark the transaction as shipped.
     * In a real implementation, this could be restricted to an oracle.
     */
    function shipTransaction(bytes32 transactionId) public {
        Transaction storage t = transactions[transactionId];
        require(msg.sender == t.seller, "Only seller can ship");
        require(t.status == Status.Locked, "Transaction not in Locked state");

        t.status = Status.Shipped;
        emit TransactionShipped(transactionId);
    }

    /**
     * @dev Allows the buyer to confirm receipt and release funds to the seller.
     */
    function completeTransaction(bytes32 transactionId) public {
        Transaction storage t = transactions[transactionId];
        require(msg.sender == t.buyer, "Only buyer can complete");
        require(t.status == Status.Shipped, "Transaction not in Shipped state");

        t.status = Status.Completed;
        
        // Transfer the funds to the seller
        (bool success, ) = t.seller.call{value: t.amount}("");
        require(success, "Payment failed");

        emit TransactionCompleted(transactionId);
    }

    /**
     * @dev Allows the buyer to cancel the transaction before it is shipped.
     */
    function cancelTransaction(bytes32 transactionId) public {
        Transaction storage t = transactions[transactionId];
        require(msg.sender == t.buyer, "Only buyer can cancel");
        require(t.status == Status.Locked, "Transaction not in Locked state");

        t.status = Status.Cancelled;

        // Refund the buyer
        (bool success, ) = t.buyer.call{value: t.amount}("");
        require(success, "Refund failed");

        emit TransactionCancelled(transactionId);
    }
}
