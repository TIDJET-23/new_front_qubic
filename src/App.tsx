import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ApiData {
  agent_1_emotional_network?: any
  agent_2_whale_behavior?: any
  agent_3_shadow_wallets?: any
  agent_4_multiverse?: any
  agent_5_governance?: any
  agent_6_futures_impact?: any
}

function App() {
  const [activeButton, setActiveButton] = useState<number>(1)
  const [apiData, setApiData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8002/api/analysis')
      setApiData(response.data)
      setError(null)
      setLoading(false)
    } catch (err) {
      setError('Erreur lors de la récupération des données')
      setLoading(false)
      console.error('Error fetching data:', err)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const getAgentData = () => {
    if (!apiData) return null

    switch (activeButton) {
      case 1:
        return apiData.agent_1_emotional_network
      case 2:
        return apiData.agent_2_whale_behavior
      case 3:
        return apiData.agent_3_shadow_wallets
      case 4:
        return apiData.agent_4_multiverse
      case 5:
        return apiData.agent_5_governance
      case 6:
        return apiData.agent_6_futures_impact
      default:
        return null
    }
  }

  const renderEmotionalNetwork = (data: any) => {
    if (!data) return null

    const getRiskColor = (level: string) => {
      switch (level) {
        case 'HIGH': return 'text-red-600 bg-red-100'
        case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
        case 'LOW': return 'text-green-600 bg-green-100'
        default: return 'text-gray-600 bg-gray-100'
      }
    }

    return (
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Emotional Network Agent</h2>
            <span className={`px-4 py-2 rounded-full font-bold ${getRiskColor(data.risk_level)}`}>
              {data.risk_level}
            </span>
          </div>
          <p className="text-gray-700">{data.interpretation}</p>
        </div>

        {/* Stats Grid - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Emotion Dominante</div>
            <div className="text-3xl font-bold capitalize">{data.dominant_emotion}</div>
            <div className="text-xl text-gray-600">{data.emotion_score}/100</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Wallets Analysés</div>
            <div className="text-3xl font-bold">{data.wallets_analyzed}</div>
            <div className="text-sm text-red-600">{data.wallets_in_stress} en stress</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Volume Déplacé</div>
            <div className="text-3xl font-bold">{(data.total_volume_moved / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-600">QUBIC</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Network Pressure</div>
            <div className={`text-3xl font-bold ${data.network_pressure < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {data.network_pressure.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Anomaly: {data.anomaly_score}</div>
          </div>
        </div>

        {/* Stats Grid - Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Wallets en Stress</div>
            <div className="text-3xl font-bold text-red-600">{data.wallets_in_stress}</div>
            <div className="text-sm text-gray-600">{((data.wallets_in_stress / data.wallets_analyzed) * 100).toFixed(1)}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Wallets Neutres</div>
            <div className="text-3xl font-bold text-gray-600">{data.wallets_neutral}</div>
            <div className="text-sm text-gray-600">{((data.wallets_neutral / data.wallets_analyzed) * 100).toFixed(1)}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Wallets Accumulant</div>
            <div className="text-3xl font-bold text-green-600">{data.wallets_accumulating}</div>
            <div className="text-sm text-gray-600">{((data.wallets_accumulating / data.wallets_analyzed) * 100).toFixed(1)}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Volatility Index</div>
            <div className="text-3xl font-bold text-orange-600">{data.volatility_index.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">
              {data.whale_activity_detected ? '🐋 Whale Activity' : 'No Whales'}
            </div>
          </div>
        </div>

        {/* Stats Grid - Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Avg Balance Delta</div>
            <div className={`text-3xl font-bold ${data.avg_balance_delta_pct < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {data.avg_balance_delta_pct.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Position Change</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Transaction Velocity</div>
            <div className="text-3xl font-bold text-blue-600">{data.transaction_velocity.toFixed(1)}</div>
            <div className="text-sm text-gray-600">tx/hour</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Anomaly Score</div>
            <div className={`text-3xl font-bold ${data.anomaly_score > 70 ? 'text-red-600' : data.anomaly_score > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
              {data.anomaly_score}/100
            </div>
            <div className="text-sm text-gray-600">Detection Level</div>
          </div>
        </div>

        {/* Alerts */}
        {data.alerts && data.alerts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-red-800 mb-3">Alertes</h3>
            <ul className="space-y-2">
              {data.alerts.map((alert: string, idx: number) => (
                <li key={idx} className="text-red-700 flex items-start">
                  <span className="mr-2">⚠️</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Emotion Breakdown Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Répartition des Émotions</h3>
            <div className="h-80">
              <Doughnut
                data={{
                  labels: ['Panic', 'Euphoria', 'Stress', 'Accumulation', 'Neutral'],
                  datasets: [{
                    data: [
                      data.emotion_breakdown.panic,
                      data.emotion_breakdown.euphoria,
                      data.emotion_breakdown.stress,
                      data.emotion_breakdown.accumulation,
                      data.emotion_breakdown.neutral
                    ],
                    backgroundColor: [
                      '#ff0000',
                      '#00ff88',
                      '#ff8844',
                      '#00d4ff',
                      '#8b92b0'
                    ]
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Emotion Score Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Emotion Score (24h)</h3>
            <div className="h-80">
              <Line
                data={{
                  labels: data.history_24h?.map((h: any) => `${h.hour}h`) || [],
                  datasets: [{
                    label: 'Emotion Score',
                    data: data.history_24h?.map((h: any) => h.emotion_score) || [],
                    borderColor: '#ff4444',
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Network Pressure Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Network Pressure (24h)</h3>
            <div className="h-80">
              <Line
                data={{
                  labels: data.history_24h?.map((h: any) => `${h.hour}h`) || [],
                  datasets: [{
                    label: 'Network Pressure',
                    data: data.history_24h?.map((h: any) => h.network_pressure) || [],
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      min: -15,
                      max: 15
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Wallets in Stress Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Wallets in Stress (24h)</h3>
            <div className="h-80">
              <Line
                data={{
                  labels: data.history_24h?.map((h: any) => `${h.hour}h`) || [],
                  datasets: [{
                    label: 'Wallets in Stress',
                    data: data.history_24h?.map((h: any) => h.wallets_in_stress) || [],
                    borderColor: '#ff8844',
                    backgroundColor: 'rgba(255, 136, 68, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 40
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Wallet Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Distribution des Wallets</h3>
            <div className="h-80">
              <Doughnut
                data={{
                  labels: ['Wallets en Stress', 'Wallets Neutres', 'Wallets Accumulant'],
                  datasets: [{
                    data: [
                      data.wallets_in_stress,
                      data.wallets_neutral,
                      data.wallets_accumulating
                    ],
                    backgroundColor: [
                      '#ff4444',
                      '#8b92b0',
                      '#00ff88'
                    ]
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderWhaleBehavior = (data: any) => {
    if (!data) return null

    const getRiskColor = (level: string) => {
      switch (level) {
        case 'HIGH': return 'text-red-600 bg-red-100'
        case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
        case 'LOW': return 'text-green-600 bg-green-100'
        default: return 'text-gray-600 bg-gray-100'
      }
    }

    const getSentimentColor = (sentiment: string) => {
      switch (sentiment) {
        case 'bearish': return 'text-red-600 bg-red-100'
        case 'bullish': return 'text-green-600 bg-green-100'
        case 'neutral': return 'text-gray-600 bg-gray-100'
        default: return 'text-gray-600 bg-gray-100'
      }
    }

    return (
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Whale Behavior Predictor</h2>
            <div className="flex gap-3">
              <span className={`px-4 py-2 rounded-full font-bold capitalize ${getSentimentColor(data.overall_sentiment)}`}>
                {data.overall_sentiment}
              </span>
              <span className={`px-4 py-2 rounded-full font-bold ${getRiskColor(data.risk_level)}`}>
                {data.risk_level}
              </span>
            </div>
          </div>
          <p className="text-gray-700 text-lg">{data.prediction}</p>
          <p className="text-gray-600 mt-2">Confidence: {(data.confidence * 100).toFixed(0)}%</p>
        </div>

        {/* Stats Grid - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Whales Tracked</div>
            <div className="text-3xl font-bold">{data.whales_tracked}</div>
            <div className="text-sm text-gray-600">Total monitored</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Risk Score</div>
            <div className={`text-3xl font-bold ${data.risk_score > 70 ? 'text-red-600' : data.risk_score > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
              {data.risk_score.toFixed(1)}/100
            </div>
            <div className="text-sm text-gray-600">Danger level</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Total Whale Balance</div>
            <div className="text-3xl font-bold">{(data.total_whale_balance / 1000000).toFixed(0)}M</div>
            <div className="text-sm text-gray-600">QUBIC</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Balance Change 24h</div>
            <div className={`text-3xl font-bold ${data.balance_change_24h_pct < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {data.balance_change_24h_pct.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Overall trend</div>
          </div>
        </div>

        {/* Stats Grid - Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Whales Accumulating</div>
            <div className="text-3xl font-bold text-green-600">{data.whales_accumulating}</div>
            <div className="text-sm text-gray-600">{((data.whales_accumulating / data.whales_tracked) * 100).toFixed(0)}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Whales Distributing</div>
            <div className="text-3xl font-bold text-red-600">{data.whales_distributing}</div>
            <div className="text-sm text-gray-600">{((data.whales_distributing / data.whales_tracked) * 100).toFixed(0)}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Whales Idle</div>
            <div className="text-3xl font-bold text-gray-600">{data.whales_idle}</div>
            <div className="text-sm text-gray-600">{((data.whales_idle / data.whales_tracked) * 100).toFixed(0)}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Whale Activity Index</div>
            <div className="text-3xl font-bold text-blue-600">{data.whale_activity_index.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Activity level</div>
          </div>
        </div>

        {/* Stats Grid - Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Avg Transaction Size</div>
            <div className="text-3xl font-bold text-purple-600">{(data.avg_transaction_size / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-600">QUBIC per tx</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Connected Wallets</div>
            <div className="text-3xl font-bold text-orange-600">{data.connected_wallets_detected}</div>
            <div className="text-sm text-gray-600">Detected links</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Suspicious Transfers</div>
            <div className="text-3xl font-bold text-red-600">{data.suspicious_transfers}</div>
            <div className="text-sm text-gray-600">Flagged transactions</div>
          </div>
        </div>

        {/* Whale Patterns */}
        {data.patterns_detected && data.patterns_detected.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Patterns Détectés</h3>
            <div className="space-y-4">
              {data.patterns_detected.map((pattern: any, idx: number) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-lg">{pattern.whale_id}</h4>
                      <p className="text-sm text-gray-600">Pattern: {pattern.current_pattern}</p>
                      <p className="text-sm text-gray-600">Stage: <span className="font-semibold">{pattern.pattern_stage}</span></p>
                    </div>
                    {pattern.historical_accuracy && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {(pattern.historical_accuracy * 100).toFixed(0)}% accuracy
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-red-50 p-3 rounded">
                      <div className="text-xs text-gray-600">Sell</div>
                      <div className="text-lg font-bold text-red-600">{(pattern.probability_next_action.sell * 100).toFixed(0)}%</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="text-xs text-gray-600">Accumulate</div>
                      <div className="text-lg font-bold text-green-600">{(pattern.probability_next_action.accumulate * 100).toFixed(0)}%</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-xs text-gray-600">Hold</div>
                      <div className="text-lg font-bold text-gray-600">{(pattern.probability_next_action.hold * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Time to action:</span> {pattern.estimated_time_to_action}
                  </p>
                  {pattern.potential_sell_volume && (
                    <p className="text-sm text-red-700 mt-1">
                      <span className="font-semibold">Potential sell volume:</span> {(pattern.potential_sell_volume / 1000000).toFixed(1)}M QUBIC
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts */}
        {data.alerts && data.alerts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-red-800 mb-3">Alertes</h3>
            <ul className="space-y-2">
              {data.alerts.map((alert: string, idx: number) => (
                <li key={idx} className="text-red-700 flex items-start">
                  <span className="mr-2">⚠️</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Whale Distribution Doughnut */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Distribution des Whales</h3>
            <div className="h-80">
              <Doughnut
                data={{
                  labels: ['Accumulating', 'Distributing', 'Idle'],
                  datasets: [{
                    data: [
                      data.whales_accumulating,
                      data.whales_distributing,
                      data.whales_idle
                    ],
                    backgroundColor: [
                      '#00ff88',
                      '#ff4444',
                      '#8b92b0'
                    ]
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Total Balance Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Total Whale Balance (24h)</h3>
            <div className="h-80">
              <Line
                data={{
                  labels: data.history_24h?.map((h: any) => `${h.hour}h`) || [],
                  datasets: [{
                    label: 'Total Balance (Millions)',
                    data: data.history_24h?.map((h: any) => h.total_balance_millions) || [],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: false
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Whales Accumulating vs Distributing */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Whales Accumulating vs Distributing (24h)</h3>
            <div className="h-80">
              <Line
                data={{
                  labels: data.history_24h?.map((h: any) => `${h.hour}h`) || [],
                  datasets: [
                    {
                      label: 'Accumulating',
                      data: data.history_24h?.map((h: any) => h.whales_accumulating) || [],
                      borderColor: '#00ff88',
                      backgroundColor: 'rgba(0, 255, 136, 0.1)',
                      fill: true,
                      tension: 0.4,
                      borderWidth: 2
                    },
                    {
                      label: 'Distributing',
                      data: data.history_24h?.map((h: any) => h.whales_distributing) || [],
                      borderColor: '#ff4444',
                      backgroundColor: 'rgba(255, 68, 68, 0.1)',
                      fill: true,
                      tension: 0.4,
                      borderWidth: 2
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 12
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderShadowWallets = (data: any) => {
    if (!data) return null

    const getRiskColor = (level: string) => {
      switch (level) {
        case 'CRITICAL': return 'text-red-700 bg-red-100'
        case 'HIGH': return 'text-red-600 bg-red-100'
        case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
        case 'LOW': return 'text-green-600 bg-green-100'
        default: return 'text-gray-600 bg-gray-100'
      }
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Shadow Wallet Detector</h2>
            <span className={`px-4 py-2 rounded-full font-bold ${getRiskColor(data.network_threat_level)}`}>
              {data.network_threat_level}
            </span>
          </div>
          <p className="text-gray-700 text-lg">{data.prediction}</p>
          <p className="text-gray-600 mt-2">Confidence: {(data.confidence * 100).toFixed(0)}%</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Total Suspicious</div>
            <div className="text-3xl font-bold text-red-600">{data.total_suspicious_wallets}</div>
            <div className="text-sm text-gray-600">Wallets detected</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">New 24h</div>
            <div className="text-3xl font-bold text-orange-600">{data.new_wallets_detected_24h}</div>
            <div className="text-sm text-gray-600">Recently created</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">High Risk</div>
            <div className="text-3xl font-bold text-red-700">{data.high_risk_wallets}</div>
            <div className="text-sm text-gray-600">Critical wallets</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Avg Risk Score</div>
            <div className="text-3xl font-bold text-yellow-600">{data.avg_risk_score.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Out of 100</div>
          </div>
        </div>

        {/* Suspicious Wallets */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Suspicious Wallets</h3>
          <div className="space-y-4">
            {data.suspicious_wallets?.map((wallet: any, idx: number) => (
              <div key={idx} className="border-l-4 border-red-600 bg-red-50 p-4 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg">{wallet.wallet_id}</h4>
                    <p className="text-sm text-gray-600">Type: {wallet.threat_type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full font-bold ${getRiskColor(wallet.risk_level)}`}>
                    {wallet.risk_score}
                  </span>
                </div>
                <ul className="text-sm space-y-1 mb-2">
                  {wallet.indicators?.map((ind: string, i: number) => (
                    <li key={i} className="text-gray-700">• {ind}</li>
                  ))}
                </ul>
                <div className="mt-2 px-3 py-1 bg-gray-800 text-white rounded inline-block text-sm">
                  Action: {wallet.recommended_action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {data.alerts && (
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-red-800 mb-3">Alertes</h3>
            <ul className="space-y-2">
              {data.alerts.map((alert: string, idx: number) => (
                <li key={idx} className="text-red-700">{alert}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Charts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Risk Distribution</h3>
            <div className="h-80">
              <Doughnut
                data={{
                  labels: ['High Risk', 'Medium Risk'],
                  datasets: [{
                    data: [data.high_risk_wallets, data.medium_risk_wallets],
                    backgroundColor: ['#dc2626', '#f59e0b']
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Suspicious Wallets Detection (24h)</h3>
            <div className="h-80">
              <Line
                data={{
                  labels: data.history_24h?.map((h: any) => `${h.hour}h`) || [],
                  datasets: [{
                    label: 'Total Suspicious',
                    data: data.history_24h?.map((h: any) => h.total_suspicious) || [],
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true } }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAgentContent = () => {
    const agentData = getAgentData()

    if (loading) {
      return <div className="text-xl">Chargement des données...</div>
    }

    if (error) {
      return <div className="text-xl text-red-600">{error}</div>
    }

    if (!agentData) {
      return <div className="text-xl">Aucune donnée disponible</div>
    }

    // Agent 1: Emotional Network
    if (activeButton === 1) {
      return renderEmotionalNetwork(agentData.data)
    }

    // Agent 2: Whale Behavior
    if (activeButton === 2) {
      return renderWhaleBehavior(agentData.data)
    }

    // Agent 3: Shadow Wallets
    if (activeButton === 3) {
      return renderShadowWallets(agentData.data)
    }

    // Agent 4: Multiverse
    if (activeButton === 4) {
      return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Smart Contract Multiverse Simulator</h2>
            <p className="text-gray-700">{agentData.data.prediction}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">Scenarios Explored</div>
              <div className="text-3xl font-bold">{agentData.data.total_scenarios_explored}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">Dangerous States</div>
              <div className="text-3xl font-bold text-red-600">{agentData.data.dangerous_states_found}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">Safe States</div>
              <div className="text-3xl font-bold text-green-600">{agentData.data.safe_states}</div>
            </div>
          </div>

          {agentData.data.dangerous_scenarios?.map((scenario: any, idx: number) => (
            <div key={idx} className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">{scenario.scenario_id} - Risk: {scenario.risk_score}</h3>
              <p className="text-sm mb-2"><strong>Trigger:</strong> {scenario.trigger_condition}</p>
              <p className="text-sm mb-2"><strong>Outcome:</strong> {scenario.outcome}</p>
              <p className="text-sm text-green-700"><strong>Fix:</strong> {scenario.recommended_fix}</p>
            </div>
          ))}

          {agentData.data.alerts && (
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-red-800 mb-3">Alertes</h3>
              <ul className="space-y-2">
                {agentData.data.alerts.map((alert: string, idx: number) => (
                  <li key={idx} className="text-red-700">{alert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    }

    // Agent 5: Governance
    if (activeButton === 5) {
      return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Governance Sentiment Predictor</h2>
            <h3 className="text-xl font-semibold mb-2">{agentData.data.event_name}</h3>
            <p className="text-gray-700 mb-2">{agentData.data.prediction}</p>
            <div className="flex gap-4 mt-4">
              <span className={`px-4 py-2 rounded-full font-bold ${
                agentData.data.predicted_outcome === 'APPROVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {agentData.data.predicted_outcome} ({(agentData.data.confidence * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">Whales Tracked</div>
              <div className="text-3xl font-bold">{agentData.data.influential_wallets_tracked}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">Accumulating</div>
              <div className="text-3xl font-bold text-green-600">{agentData.data.wallets_accumulating_tokens}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">Distributing</div>
              <div className="text-3xl font-bold text-red-600">{agentData.data.wallets_distributing_tokens}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">Tokens Accumulated (7d)</div>
              <div className="text-3xl font-bold text-blue-600">{(agentData.data.token_accumulation_7d / 1000000).toFixed(0)}M</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Voting Power Distribution</h3>
            <div className="h-80">
              <Doughnut
                data={{
                  labels: ['Approve', 'Reject', 'Uncertain'],
                  datasets: [{
                    data: [
                      agentData.data.voting_power_likely_approve,
                      agentData.data.voting_power_likely_reject,
                      agentData.data.voting_power_uncertain
                    ],
                    backgroundColor: ['#00ff88', '#ff4444', '#8b92b0']
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Token Accumulation (7 days)</h3>
            <div className="h-80">
              <Line
                data={{
                  labels: agentData.data.history_7d?.map((h: any) => `Day ${h.day}`) || [],
                  datasets: [{
                    label: 'Tokens Accumulated (M)',
                    data: agentData.data.history_7d?.map((h: any) => h.tokens_accumulated / 1000000) || [],
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>
        </div>
      )
    }

    // Agent 6: Futures Impact
    if (activeButton === 6) {
      return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Futures Impact Analyzer</h2>
            <p className="text-gray-700 text-lg mb-2">{agentData.data.prediction}</p>
            <div className="flex gap-4 mt-4">
              <span className="px-4 py-2 rounded-full font-bold bg-red-100 text-red-700">
                Impact: {agentData.data.price_impact_pct}%
              </span>
              <span className="px-4 py-2 rounded-full font-bold bg-yellow-100 text-yellow-700">
                Confidence: {(agentData.data.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">Transaction Type</div>
              <div className="text-2xl font-bold capitalize">{agentData.data.transaction_type.replace('_', ' ')}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">Volume</div>
              <div className="text-3xl font-bold">{(agentData.data.hypothetical_volume / 1000000).toFixed(1)}M</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">Price Impact</div>
              <div className="text-3xl font-bold text-red-600">{agentData.data.price_impact_pct}%</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">Network Reaction</div>
              <div className="text-xl font-bold text-red-600 capitalize">{agentData.data.network_reaction.replace('_', ' ')}</div>
            </div>
          </div>

          {agentData.data.predicted_chain_reaction && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Predicted Chain Reaction</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border p-4 rounded">
                  <h4 className="font-bold mb-2">Phase 1: Immediate</h4>
                  <p className="text-sm text-gray-600">{agentData.data.predicted_chain_reaction.phase_1_immediate.time}</p>
                  <p className="text-lg font-bold text-red-600">{agentData.data.predicted_chain_reaction.phase_1_immediate.price_drop_pct}%</p>
                </div>
                <div className="border p-4 rounded">
                  <h4 className="font-bold mb-2">Phase 2: Cascade</h4>
                  <p className="text-sm text-gray-600">{agentData.data.predicted_chain_reaction.phase_2_cascade.time}</p>
                  <p className="text-lg font-bold text-red-600">{agentData.data.predicted_chain_reaction.phase_2_cascade.total_price_drop_pct}%</p>
                </div>
                <div className="border p-4 rounded">
                  <h4 className="font-bold mb-2">Phase 3: Stabilization</h4>
                  <p className="text-sm text-gray-600">{agentData.data.predicted_chain_reaction.phase_3_stabilization.time}</p>
                  <p className="text-lg font-bold text-red-600">{agentData.data.predicted_chain_reaction.phase_3_stabilization.total_price_drop_pct}%</p>
                </div>
              </div>
            </div>
          )}

          {agentData.data.alerts && (
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-red-800 mb-3">Alertes</h3>
              <ul className="space-y-2">
                {agentData.data.alerts.map((alert: string, idx: number) => (
                  <li key={idx} className="text-red-700">{alert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    }

    // Pour les autres agents, afficher temporairement le JSON
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{agentData.agent_name}</h2>
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              agentData.status === 'mocked' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
            }`}>
              {agentData.status}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Données</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[600px] text-sm">
            {JSON.stringify(agentData.data, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  const agentNames = [
    'Emotional Network',
    'Whale Behavior',
    'Shadow Wallets',
    'Multiverse',
    'Governance',
    'Futures Impact'
  ]

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      {/* Sidebar */}
      <div className="w-64 min-w-64 max-w-64 bg-gray-800 text-white p-4 flex-shrink-0 fixed h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-8">Menu</h2>
        <div className="flex flex-col gap-3">
          {agentNames.map((name, index) => (
            <button
              key={index + 1}
              onClick={() => setActiveButton(index + 1)}
              className={`py-3 px-4 rounded-lg transition-all duration-200 text-left ${
                activeButton === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100 overflow-x-auto ml-64">
        <h1 className="text-4xl font-bold mb-6">Dashboard Qubic</h1>
        {renderAgentContent()}
      </div>
    </div>
  )
}

export default App
