import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  UserRegistered,
  TransactionCreated,
  TransactionCompleted,
  ReviewLeft,
  WeeklyWinnerSet,
} from "../generated/ChainConfirm/ChainConfirm";
import { User, Transaction, Review, WeeklyWinner } from "../generated/schema";

// --- Event Handlers ---

export function handleUserRegistered(event: UserRegistered): void {
  let user = new User(event.params.userAddress.toHex());
  user.totalTransactions = BigInt.fromI32(0);
  user.totalReviews = BigInt.fromI32(0);
  user.ratingSum = BigInt.fromI32(0);
  user.save();
}

export function handleTransactionCreated(event: TransactionCreated): void {
  let transactionId = event.params.transactionId.toHex();
  let buyerId = event.params.buyer.toHex();
  let sellerId = event.params.seller.toHex();

  // Create the transaction entity
  let transaction = new Transaction(transactionId);
  transaction.buyer = buyerId;
  transaction.seller = sellerId;
  transaction.participants = [buyerId, sellerId];
  transaction.amount = event.params.amount;
  transaction.status = "Locked";
  transaction.createdAt = event.block.timestamp;
  transaction.save();

  // Update buyer's profile
  let buyer = User.load(buyerId)!;
  buyer.totalTransactions = buyer.totalTransactions.plus(BigInt.fromI32(1));
  buyer.save();

  // Update seller's profile
  let seller = User.load(sellerId)!;
  seller.totalTransactions = seller.totalTransactions.plus(BigInt.fromI32(1));
  seller.save();
}

export function handleTransactionCompleted(event: TransactionCompleted): void {
  let transactionId = event.params.transactionId.toHex();
  let transaction = Transaction.load(transactionId);
  if (transaction != null) {
    transaction.status = "Completed";
    transaction.completedAt = event.block.timestamp;
    transaction.save();
  }
}

export function handleReviewLeft(event: ReviewLeft): void {
  let transactionId = event.params.transactionId.toHex();
  let reviewerId = event.params.reviewer.toHex();
  let revieweeId = event.params.reviewee.toHex();

  // Create the review entity
  let reviewId = transactionId + "-" + reviewerId;
  let review = new Review(reviewId);
  review.transaction = transactionId;
  review.reviewer = reviewerId;
  review.reviewee = revieweeId;
  review.rating = event.params.rating;
  review.timestamp = event.block.timestamp;
  review.save();

  // Update the reviewee's profile
  let reviewee = User.load(revieweeId)!;
  reviewee.totalReviews = reviewee.totalReviews.plus(BigInt.fromI32(1));
  reviewee.ratingSum = reviewee.ratingSum.plus(BigInt.fromI32(event.params.rating));
  reviewee.save();
}

export function handleWeeklyWinnerSet(event: WeeklyWinnerSet): void {
  let winnerId = "current"; // Use a fixed ID for the singleton entity
  let weeklyWinner = WeeklyWinner.load(winnerId);
  if (weeklyWinner == null) {
    weeklyWinner = new WeeklyWinner(winnerId);
    // Initialize with placeholder values if needed, though the event provides one
    weeklyWinner.buyer = Address.zero().toHex();
    weeklyWinner.seller = Address.zero().toHex();
  }

  if (event.params.role == "Buyer") {
    weeklyWinner.buyer = event.params.user.toHex();
  } else if (event.params.role == "Seller") {
    weeklyWinner.seller = event.params.user.toHex();
  }

  weeklyWinner.updatedAt = event.block.timestamp;
  weeklyWinner.save();
}
