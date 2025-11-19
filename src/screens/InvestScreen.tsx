import React, { useEffect, useMemo } from 'react';
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Zap,
} from 'lucide-react-native';

// Redux
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchInvestments } from '../store/slices/investmentsSlice';

// Utils
import { formatCurrency, formatPercentage } from '../utils/formatting';

const { width } = Dimensions.get('window');

export default function InvestScreen() {
  const dispatch = useAppDispatch();

  // Redux state
  const { investments, portfolioValue, todayChange, isLoading, error } =
    useAppSelector((state) => state.investments);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchInvestments());
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

  // Calculate portfolio change percentage
  const todayChangePercent = useMemo(() => {
    if (portfolioValue > 0 && todayChange) {
      return ((todayChange / (portfolioValue - todayChange)) * 100).toFixed(2);
    }
    return '0.00';
  }, [portfolioValue, todayChange]);

  // Hardcoded recommendations (would come from API in real app)
  const recommendations = [
    {
      title: 'Diversify with Bonds',
      description: 'Add stability to your portfolio',
      risk: 'Low',
      potentialReturn: '4-6%',
      color: '#3B82F6',
    },
    {
      title: 'Growth Stocks',
      description: 'High potential tech companies',
      risk: 'High',
      potentialReturn: '10-15%',
      color: '#8B5CF6',
    },
    {
      title: 'Real Estate ETF',
      description: 'Exposure to property market',
      risk: 'Medium',
      potentialReturn: '6-9%',
      color: '#10B981',
    },
  ];

  // Loading state
  if (isLoading && investments.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading portfolio...</Text>
      </View>
    );
  }

  const isPositiveChange = todayChange >= 0;

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
        <Text style={styles.title}>Invest & Grow</Text>
        <TouchableOpacity style={styles.analyticsButton}>
          <BarChart3 color="#8B5CF6" size={24} />
        </TouchableOpacity>
      </View>

      {/* Portfolio Overview */}
      <LinearGradient
        colors={['#1E293B', '#374151']}
        style={styles.portfolioCard}
      >
        <View style={styles.portfolioHeader}>
          <Text style={styles.portfolioLabel}>Portfolio Value</Text>
          <View
            style={[
              styles.changeIndicator,
              {
                backgroundColor: isPositiveChange
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)',
              },
            ]}
          >
            {isPositiveChange ? (
              <TrendingUp color="#10B981" size={16} />
            ) : (
              <TrendingDown color="#EF4444" size={16} />
            )}
            <Text
              style={[
                styles.changeText,
                { color: isPositiveChange ? '#10B981' : '#EF4444' },
              ]}
            >
              {isPositiveChange ? '+' : ''}
              {todayChangePercent}%
            </Text>
          </View>
        </View>
        <Text style={styles.portfolioValue}>
          {formatCurrency(portfolioValue)}
        </Text>
        <Text
          style={[
            styles.portfolioChange,
            { color: isPositiveChange ? '#10B981' : '#EF4444' },
          ]}
        >
          {isPositiveChange ? '+' : ''}
          {formatCurrency(Math.abs(todayChange))} today
        </Text>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Invest</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#10B981' }]}>
              <Zap color="#ffffff" size={24} />
            </View>
            <Text style={styles.quickActionText}>Auto Invest</Text>
            <Text style={styles.quickActionSubtext}>$50/week</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#3B82F6' }]}>
              <PieChart color="#ffffff" size={24} />
            </View>
            <Text style={styles.quickActionText}>Balanced</Text>
            <Text style={styles.quickActionSubtext}>Mix of assets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#8B5CF6' }]}>
              <TrendingUp color="#ffffff" size={24} />
            </View>
            <Text style={styles.quickActionText}>Aggressive</Text>
            <Text style={styles.quickActionSubtext}>High growth</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Holdings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Holdings</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {investments.length > 0 ? (
          <View style={styles.holdingsList}>
            {investments.map((investment, index) => (
              <InvestmentCard key={investment.id || index} investment={investment} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyInvestments}>
            <Text style={styles.emptyInvestmentsEmoji}>📈</Text>
            <Text style={styles.emptyInvestmentsTitle}>No Investments Yet</Text>
            <Text style={styles.emptyInvestmentsSubtitle}>
              Start investing to grow your wealth
            </Text>
            <TouchableOpacity style={styles.emptyInvestmentsButton}>
              <DollarSign color="#ffffff" size={20} />
              <Text style={styles.emptyInvestmentsButtonText}>
                Start Investing
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendations.map((rec, index) => (
            <RecommendationCard key={index} recommendation={rec} />
          ))}
        </ScrollView>
      </View>

      {/* Learning Section */}
      <View style={styles.learningSection}>
        <Text style={styles.learnTitle}>📚 Learn as You Grow</Text>
        <Text style={styles.learnDescription}>
          Check out our bite-sized lessons on investing basics
        </Text>
        <TouchableOpacity style={styles.learnButton}>
          <Text style={styles.learnButtonText}>Start Learning</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InvestmentCard({ investment }: { investment: any }) {
  const isPositive = investment.change >= 0;

  // Calculate percentage if not provided
  const changePercent =
    investment.changePercent ||
    (investment.value > 0
      ? ((investment.change / (investment.value - investment.change)) * 100).toFixed(
          2
        )
      : 0);

  // Calculate fill percentage for progress bar (can be based on allocation or other metric)
  const fillPercentage = investment.allocation || 60;

  return (
    <View style={styles.investmentCard}>
      <View style={styles.investmentHeader}>
        <View>
          <Text style={styles.investmentName}>
            {investment.name || investment.symbol}
          </Text>
          <Text style={styles.investmentSymbol}>{investment.symbol}</Text>
        </View>
        <View style={styles.investmentValues}>
          <Text style={styles.investmentValue}>
            {formatCurrency(investment.value || investment.currentValue)}
          </Text>
          <View style={styles.investmentChange}>
            {isPositive ? (
              <TrendingUp color="#10B981" size={14} />
            ) : (
              <TrendingDown color="#EF4444" size={14} />
            )}
            <Text
              style={[
                styles.changeValue,
                { color: isPositive ? '#10B981' : '#EF4444' },
              ]}
            >
              {isPositive ? '+' : ''}
              {formatCurrency(Math.abs(investment.change))}
            </Text>
            <Text
              style={[
                styles.changePercent,
                { color: isPositive ? '#10B981' : '#EF4444' },
              ]}
            >
              ({isPositive ? '+' : ''}
              {changePercent}%)
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.investmentBar}>
        <View
          style={[
            styles.investmentBarFill,
            {
              backgroundColor: investment.color || '#8B5CF6',
              width: `${Math.min(fillPercentage, 100)}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

function RecommendationCard({ recommendation }: { recommendation: any }) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'High': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={[styles.recommendationCard, { borderLeftColor: recommendation.color }]}>
      <Text style={styles.recTitle}>{recommendation.title}</Text>
      <Text style={styles.recDescription}>{recommendation.description}</Text>
      <View style={styles.recStats}>
        <View style={styles.recStat}>
          <Text style={styles.recStatLabel}>Risk</Text>
          <Text style={[styles.recStatValue, { color: getRiskColor(recommendation.risk) }]}>
            {recommendation.risk}
          </Text>
        </View>
        <View style={styles.recStat}>
          <Text style={styles.recStatLabel}>Return</Text>
          <Text style={styles.recStatValue}>{recommendation.potentialReturn}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.recButton}>
        <Text style={styles.recButtonText}>Learn More</Text>
      </TouchableOpacity>
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
  analyticsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portfolioCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  portfolioLabel: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  portfolioValue: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  portfolioChange: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
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
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  quickActionSubtext: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  holdingsList: {
    gap: 12,
  },
  investmentCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  investmentName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  investmentSymbol: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  investmentValues: {
    alignItems: 'flex-end',
  },
  investmentValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  investmentChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  changeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  changePercent: {
    fontSize: 12,
  },
  investmentBar: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
  },
  investmentBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  recommendationCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: width * 0.7,
    borderLeftWidth: 4,
  },
  recTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  recDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 16,
  },
  recStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  recStat: {
    flex: 1,
  },
  recStatLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 2,
  },
  recStatValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  recButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  recButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  learningSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  learnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  learnDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  learnButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  learnButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
  emptyInvestments: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyInvestmentsEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyInvestmentsTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyInvestmentsSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyInvestmentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  emptyInvestmentsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
