import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  Eye,
  EyeOff,
  Plus,
  Banknote,
} from 'lucide-react-native';

// Redux
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCards } from '../store/slices/walletSlice';
import { fetchTransactions } from '../store/slices/walletSlice';

// Utils
import { formatCurrency, formatRelativeTime } from '../utils/formatting';

export default function WalletScreen() {
  const dispatch = useAppDispatch();
  const [showBalance, setShowBalance] = React.useState(true);

  // Redux state
  const { cards, transactions, balance, isLoading, error } = useAppSelector(
    (state) => state.wallet
  );

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchCards());
    dispatch(fetchTransactions({ limit: 10 }));
  }, [dispatch]);

  // Auto-clear error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        // Error will be cleared by user action or navigation
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Loading state
  if (isLoading && cards.length === 0 && transactions.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading wallet...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
        <TouchableOpacity style={styles.addCardButton}>
          <Plus color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Cards Section */}
      <View style={styles.cardsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cards.length > 0 ? (
            <>
              {cards.map((card) => (
                <CardComponent key={card.id} card={card} showBalance={showBalance} />
              ))}
              <AddCardButton />
            </>
          ) : (
            <View style={styles.emptyCards}>
              <Text style={styles.emptyCardsEmoji}>💳</Text>
              <Text style={styles.emptyCardsTitle}>No Cards Yet</Text>
              <Text style={styles.emptyCardsSubtitle}>
                Add your first card to get started
              </Text>
              <TouchableOpacity style={styles.emptyCardsButton}>
                <Plus color="#ffffff" size={20} />
                <Text style={styles.emptyCardsButtonText}>Add Card</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Balance Visibility Toggle */}
      <View style={styles.balanceToggle}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowBalance(!showBalance)}
        >
          {showBalance ? (
            <EyeOff color="#9CA3AF" size={20} />
          ) : (
            <Eye color="#9CA3AF" size={20} />
          )}
          <Text style={styles.toggleText}>
            {showBalance ? 'Hide Balance' : 'Show Balance'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
              <ArrowDownLeft color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionTitle}>Receive</Text>
            <Text style={styles.actionSubtitle}>Get money from friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
              <ArrowUpRight color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionTitle}>Send</Text>
            <Text style={styles.actionSubtitle}>Transfer to anyone</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
              <Banknote color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionTitle}>Add Cash</Text>
            <Text style={styles.actionSubtitle}>Top up your wallet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {transactions.length > 0 ? (
          <View style={styles.transactionsList}>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyTransactions}>
            <Text style={styles.emptyTransactionsEmoji}>📊</Text>
            <Text style={styles.emptyTransactionsTitle}>No Transactions Yet</Text>
            <Text style={styles.emptyTransactionsSubtitle}>
              Your transaction history will appear here
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function CardComponent({ card, showBalance }: { card: any; showBalance: boolean }) {
  // Convert gradient array to proper format if needed
  const gradientColors = Array.isArray(card.gradient)
    ? card.gradient
    : ['#8B5CF6', '#EC4899'];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardType}>{card.type || 'Card'}</Text>
        <TouchableOpacity>
          <MoreHorizontal color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{card.name}</Text>
        <Text style={styles.cardBalance}>
          {showBalance ? formatCurrency(card.balance) : '••••••'}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardNumber}>{card.lastFour ? `**** ${card.lastFour}` : card.number}</Text>
        <CreditCard color="rgba(255, 255, 255, 0.8)" size={32} />
      </View>

      {/* Card decorations */}
      <View style={styles.cardDecoration}>
        <View style={styles.decorationDot} />
        <View style={[styles.decorationDot, { marginLeft: 20, opacity: 0.6 }]} />
        <View style={[styles.decorationDot, { marginLeft: 40, opacity: 0.3 }]} />
      </View>
    </LinearGradient>
  );
}

function AddCardButton() {
  return (
    <TouchableOpacity style={styles.addCard}>
      <View style={styles.addCardContent}>
        <Plus color="#9CA3AF" size={32} />
        <Text style={styles.addCardText}>Add New Card</Text>
      </View>
    </TouchableOpacity>
  );
}

function TransactionItem({ transaction }: { transaction: any }) {
  const isPositive = transaction.amount > 0;

  // Format the time - use createdAt if available, otherwise use a default
  const formattedTime = transaction.createdAt
    ? formatRelativeTime(new Date(transaction.createdAt))
    : transaction.time || 'Recently';

  // Get icon/emoji for the transaction
  const transactionIcon = transaction.icon || transaction.emoji || '💰';

  return (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Text style={styles.transactionEmoji}>{transactionIcon}</Text>
      </View>

      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>
          {transaction.description || transaction.title}
        </Text>
        <Text style={styles.transactionMerchant}>
          {transaction.merchant || transaction.category}
        </Text>
        <Text style={styles.transactionTime}>{formattedTime}</Text>
      </View>

      <View style={styles.transactionAmount}>
        <Text
          style={[
            styles.amountText,
            { color: isPositive ? '#10B981' : '#ffffff' },
          ]}
        >
          {isPositive ? '+' : ''}
          {formatCurrency(Math.abs(transaction.amount))}
        </Text>
        <Text style={styles.categoryText}>{transaction.category}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addCardButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsSection: {
    paddingLeft: 20,
    marginBottom: 16,
  },
  card: {
    width: 300,
    height: 180,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardType: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardBalance: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  cardDecoration: {
    position: 'absolute',
    top: -20,
    right: -20,
    flexDirection: 'row',
  },
  decorationDot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  addCard: {
    width: 300,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
    marginRight: 16,
  },
  addCardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  balanceToggle: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  toggleText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  seeAll: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionMerchant: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  transactionTime: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyCards: {
    width: 300,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginRight: 16,
  },
  emptyCardsEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyCardsTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyCardsSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyCardsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  emptyCardsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyTransactions: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyTransactionsEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTransactionsTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyTransactionsSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
});
