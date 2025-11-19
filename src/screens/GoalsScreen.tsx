import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Target, Calendar, DollarSign, X } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addMoneyToGoal,
  clearError,
  clearSuccessMessage,
} from '../store/slices/goalsSlice';
import { formatCurrency } from '../utils/formatting';
import { COLORS } from '../constants/theme';
import { GOAL_EMOJIS } from '../constants';

const GOAL_COLORS = [
  '#8B5CF6',
  '#EC4899',
  '#10B981',
  '#F59E0B',
  '#3B82F6',
  '#EF4444',
];

export default function GoalsScreen() {
  const dispatch = useAppDispatch();
  const { goals, isLoading, error, successMessage } = useAppSelector((state) => state.goals);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    emoji: '🎯',
    deadline: '',
  });

  // Fetch goals on mount
  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  // Calculate stats from Redux goals
  const activeGoals = goals.filter((g) => g.current < g.target);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const avgProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce((sum, g) => sum + (g.current / g.target) * 100, 0) / goals.length
        )
      : 0;

  const handleCreateGoal = async () => {
    if (!newGoal.title || !newGoal.target) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const targetAmount = parseFloat(newGoal.target);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    try {
      // Pick a random color for the goal
      const randomColor = GOAL_COLORS[Math.floor(Math.random() * GOAL_COLORS.length)];

      await dispatch(
        createGoal({
          title: newGoal.title,
          target: targetAmount,
          emoji: newGoal.emoji,
          deadline: newGoal.deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default: 90 days from now
          color: randomColor,
        })
      ).unwrap();

      setShowCreateModal(false);
      setNewGoal({ title: '', target: '', emoji: '🎯', deadline: '' });
    } catch (err) {
      console.error('Failed to create goal:', err);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(deleteGoal(goalId)).unwrap();
          } catch (err) {
            console.error('Failed to delete goal:', err);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Goals</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Success/Error Messages */}
      {successMessage && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}
      {error && (
        <View style={styles.errorMessage}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activeGoals.length}</Text>
          <Text style={styles.statLabel}>Active Goals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatCurrency(totalSaved, 'USD', false)}</Text>
          <Text style={styles.statLabel}>Total Saved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{avgProgress}%</Text>
          <Text style={styles.statLabel}>Avg Progress</Text>
        </View>
      </View>

      {/* Goals List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading goals...</Text>
        </View>
      ) : goals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎯</Text>
          <Text style={styles.emptyTitle}>No Goals Yet</Text>
          <Text style={styles.emptySubtitle}>
            Create your first savings goal to get started!
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.emptyButtonText}>Create Goal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.goalsList}>
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onDelete={() => handleDeleteGoal(goal.id)}
            />
          ))}
        </ScrollView>
      )}

      {/* Create Goal Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Goal</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X color="#9CA3AF" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.emojiSelector}>
              {GOAL_EMOJIS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiOption,
                    newGoal.emoji === emoji && styles.emojiSelected,
                  ]}
                  onPress={() => setNewGoal({ ...newGoal, emoji })}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Goal name (e.g., New iPhone)"
              placeholderTextColor="#9CA3AF"
              value={newGoal.title}
              onChangeText={(title) => setNewGoal({ ...newGoal, title })}
            />

            <TextInput
              style={styles.input}
              placeholder="Target amount"
              placeholderTextColor="#9CA3AF"
              value={newGoal.target}
              onChangeText={(target) => setNewGoal({ ...newGoal, target })}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Deadline (optional, YYYY-MM-DD)"
              placeholderTextColor="#9CA3AF"
              value={newGoal.deadline}
              onChangeText={(deadline) => setNewGoal({ ...newGoal, deadline })}
            />

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateGoal}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.createButtonText}>Create Goal</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function GoalCard({ goal, onDelete }: { goal: any; onDelete: () => void }) {
  const dispatch = useAppDispatch();
  const [addAmount, setAddAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);

  const progress = (goal.current / goal.target) * 100;
  const remaining = goal.target - goal.current;

  const handleAddMoney = async () => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      await dispatch(
        addMoneyToGoal({
          id: goal.id,
          data: { amount },
        })
      ).unwrap();
      setAddAmount('');
      setShowAddMoney(false);
    } catch (err) {
      console.error('Failed to add money:', err);
    }
  };

  return (
    <View style={[styles.goalCard, { borderLeftColor: goal.color }]}>
      <View style={styles.goalHeader}>
        <View style={styles.goalTitleRow}>
          <Text style={styles.goalEmoji}>{goal.emoji}</Text>
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDeadline}>Target: {goal.deadline}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addMoneyButton}
          onPress={() => setShowAddMoney(!showAddMoney)}
        >
          <Plus color="#8B5CF6" size={20} />
        </TouchableOpacity>
      </View>

      {showAddMoney && (
        <View style={styles.addMoneySection}>
          <TextInput
            style={styles.addMoneyInput}
            placeholder="Amount to add"
            placeholderTextColor="#9CA3AF"
            value={addAmount}
            onChangeText={setAddAmount}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addMoneyConfirm} onPress={handleAddMoney}>
            <Text style={styles.addMoneyConfirmText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.goalProgress}>
        <View style={styles.amountRow}>
          <Text style={styles.currentAmount}>{formatCurrency(goal.current, 'USD', false)}</Text>
          <Text style={styles.targetAmount}>of {formatCurrency(goal.target, 'USD', false)}</Text>
        </View>

        <View style={styles.progressBar}>
          <LinearGradient
            colors={[goal.color, goal.color + '80']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]}
          />
        </View>

        <View style={styles.progressStats}>
          <Text style={styles.progressPercent}>{Math.round(progress)}% complete</Text>
          <Text style={styles.remainingAmount}>{formatCurrency(remaining, 'USD', false)} to go</Text>
        </View>
      </View>

      <View style={styles.goalActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowAddMoney(!showAddMoney)}
        >
          <DollarSign color="#10B981" size={16} />
          <Text style={styles.actionText}>Add Money</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <X color="#EF4444" size={16} />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successMessage: {
    backgroundColor: '#10B981',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  successText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: '#EF4444',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  goalsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  goalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  goalDeadline: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  addMoneyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoneySection: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  addMoneyInput: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  addMoneyConfirm: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addMoneyConfirmText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  goalProgress: {
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  targetAmount: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  remainingAmount: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emojiSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiSelected: {
    backgroundColor: '#8B5CF6',
  },
  emojiText: {
    fontSize: 20,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
