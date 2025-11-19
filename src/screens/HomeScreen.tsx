import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchGoals } from '../store/slices/goalsSlice';
import { fetchCards, fetchTransactions } from '../store/slices/walletSlice';
import { formatCurrency, formatRelativeTime } from '../utils/formatting';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const dispatch = useAppDispatch();

  // Redux state
  const { user } = useAppSelector((state) => state.auth);
  const { goals, isLoading: goalsLoading } = useAppSelector((state) => state.goals);
  const { balance, transactions, isLoading: walletLoading } = useAppSelector(
    (state) => state.wallet
  );
  const { statistics, achievements } = useAppSelector((state) => state.user);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchGoals({ limit: 3, status: 'active' }));
    dispatch(fetchCards());
    dispatch(fetchTransactions({ limit: 3 }));
  }, [dispatch]);

  // Calculate display values
  const displayName = user?.name?.split(' ')[0] || 'User';
  const displayBalance = balance || 0;
  const monthlyChange = 12.5; // TODO: Calculate from transactions
  const activeGoalsToShow = goals.slice(0, 3);
  const recentTransactions = transactions.slice(0, 3);
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const latestAchievement = unlockedAchievements[unlockedAchievements.length - 1];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey {displayName}! 👋</Text>
          <Text style={styles.subtitle}>Ready to grow your money?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <LinearGradient
        colors={['#8B5CF6', '#EC4899', '#F59E0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <View style={styles.balanceContent}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          {walletLoading ? (
            <ActivityIndicator size="small" color="#ffffff" style={{ marginVertical: 12 }} />
          ) : (
            <>
              <Text style={styles.balanceAmount}>{formatCurrency(displayBalance)}</Text>
              <View style={styles.balanceChange}>
                <TrendingUp color="#ffffff" size={16} />
                <Text style={styles.changeText}>+{monthlyChange.toFixed(1)}% this month</Text>
              </View>
            </>
          )}
        </View>
        <View style={styles.cardDecoration}>
          <View style={styles.decorationCircle} />
          <View style={styles.decorationCircle2} />
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
              <PlusCircle color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
              <ArrowUpRight color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
              <Target color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionText}>New Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#F59E0B' }]}>
              <Zap color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionText}>Invest</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Savings Goals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {goalsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
          </View>
        ) : activeGoalsToShow.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activeGoalsToShow.map((goal) => (
              <GoalCard
                key={goal.id}
                title={goal.title}
                target={goal.target}
                current={goal.current}
                color={goal.color}
                emoji={goal.emoji}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No active goals yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap "New Goal" to create one</Text>
          </View>
        )}
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionsList}>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                type={transaction.type}
                title={transaction.title}
                amount={transaction.amount}
                time={formatRelativeTime(transaction.timestamp)}
                icon={transaction.icon || '💰'}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent transactions</Text>
            </View>
          )}
        </View>
      </View>

      {/* Achievement */}
      {latestAchievement && (
        <View style={styles.achievementCard}>
          <View style={styles.achievementIcon}>
            <Award color="#F59E0B" size={24} />
          </View>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>
              {latestAchievement.title} {latestAchievement.emoji}
            </Text>
            <Text style={styles.achievementText}>{latestAchievement.description}</Text>
          </View>
        </View>
      )}

      {/* Streak Display */}
      {statistics.currentStreak > 0 && (
        <View style={styles.achievementCard}>
          <View style={styles.achievementIcon}>
            <Text style={styles.achievementEmoji}>🔥</Text>
          </View>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>Streak Master!</Text>
            <Text style={styles.achievementText}>
              {statistics.currentStreak} day{statistics.currentStreak !== 1 ? 's' : ''} streak! Keep
              it up!
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function GoalCard({
  title,
  target,
  current,
  color,
  emoji,
}: {
  title: string;
  target: number;
  current: number;
  color: string;
  emoji: string;
}) {
  const progress = (current / target) * 100;

  return (
    <View style={[styles.goalCard, { borderLeftColor: color }]}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalEmoji}>{emoji}</Text>
        <Text style={styles.goalTitle}>{title}</Text>
      </View>
      <Text style={styles.goalAmount}>{formatCurrency(current, 'USD', false)}</Text>
      <Text style={styles.goalTarget}>of {formatCurrency(target, 'USD', false)}</Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(progress, 100)}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.progressText}>{Math.round(progress)}% complete</Text>
    </View>
  );
}

function TransactionItem({
  type,
  title,
  amount,
  time,
  icon,
}: {
  type: 'income' | 'expense' | 'savings' | 'investment';
  title: string;
  amount: number;
  time: string;
  icon: string;
}) {
  const getColor = () => {
    switch (type) {
      case 'income':
        return '#10B981';
      case 'expense':
        return '#EF4444';
      case 'savings':
        return '#8B5CF6';
      case 'investment':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const formattedAmount = amount >= 0 ? `+${formatCurrency(amount)}` : formatCurrency(amount);

  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Text style={styles.transactionEmoji}>{icon}</Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{title}</Text>
        <Text style={styles.transactionTime}>{time}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: getColor() }]}>{formattedAmount}</Text>
    </View>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  balanceContent: {
    zIndex: 1,
  },
  balanceLabel: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.9,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
  cardDecoration: {
    position: 'absolute',
    right: -20,
    top: -20,
  },
  decorationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorationCircle2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
    right: 40,
    top: 40,
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
  },
  seeAll: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: width * 0.65,
    borderLeftWidth: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  goalTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  goalAmount: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  goalTarget: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  transactionTime: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
});
