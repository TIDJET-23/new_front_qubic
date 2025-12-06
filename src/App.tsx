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
