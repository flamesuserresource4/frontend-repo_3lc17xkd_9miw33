import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function StatCard({ title, value, hint }) {
  return (
    <div className="p-4 rounded-xl bg-white/70 backdrop-blur shadow-sm border border-gray-100">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  )
}

function Section({ title, children, action }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function App() {
  const [hello, setHello] = useState('')
  const [pricing, setPricing] = useState([])
  const [demand, setDemand] = useState([])
  const [supply, setSupply] = useState([])

  useEffect(() => {
    fetch(`${API_BASE}/api/hello`).then(r => r.json()).then(d => setHello(d.message)).catch(() => setHello(''))
    fetch(`${API_BASE}/api/analytics/pricing`).then(r => r.json()).then(setPricing).catch(() => setPricing([]))
    fetch(`${API_BASE}/api/analytics/demand`).then(r => r.json()).then(setDemand).catch(() => setDemand([]))
    fetch(`${API_BASE}/api/analytics/supply`).then(r => r.json()).then(setSupply).catch(() => setSupply([]))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald-700">AgriBridge</h1>
            <p className="text-gray-600">Connecting farmers to buyers with smart logistics</p>
          </div>
          <span className="text-sm text-gray-500">{hello}</span>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Market Categories" value={pricing.length || '—'} hint="Based on listed products" />
          <StatCard title="Top Demanded" value={demand.length || '—'} hint="Products ordered most" />
          <StatCard title="Supply Segments" value={supply.length || '—'} hint="Available by category" />
        </div>

        <Section title="Pricing Trends">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pricing.length === 0 && <div className="text-gray-500">No pricing data yet</div>}
            {pricing.map((p, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-gray-100">
                <div className="text-gray-600 text-sm">{p._id}</div>
                <div className="text-xl font-semibold">{p.avg_price?.toFixed ? `$${p.avg_price.toFixed(2)}` : p.avg_price}</div>
                <div className="text-xs text-gray-400">{p.count} products</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Demand (Top Products)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {demand.length === 0 && <div className="text-gray-500">No orders yet</div>}
            {demand.map((d, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-gray-100">
                <div className="text-gray-700">Product: <span className="font-medium">{d._id}</span></div>
                <div className="text-sm text-gray-500">Orders: {d.orders} • Qty: {d.qty}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Supply Overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {supply.length === 0 && <div className="text-gray-500">No supply data yet</div>}
            {supply.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-gray-100">
                <div className="text-gray-600">{s._id}</div>
                <div className="text-xl font-semibold">{s.available}</div>
                <div className="text-xs text-gray-400">Items: {s.items}</div>
              </div>
            ))}
          </div>
        </Section>

        <footer className="text-center text-xs text-gray-500">
          Direct trade • Smallholder-first • Traceable • Export-ready
        </footer>
      </div>
    </div>
  )
}

export default App
