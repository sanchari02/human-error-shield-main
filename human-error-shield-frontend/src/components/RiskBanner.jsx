export default function RiskBanner({ risk='UNKNOWN', message='' }){
  const palette = {
    HIGH: 'bg-red-600',
    LOW: 'bg-orange-500',
    SAFE: 'bg-green-600',
    UNKNOWN: 'bg-yellow-400'
  }
  const textMap = {
    HIGH: 'HIGH RISK: Missing Safety Equipment!',
    LOW: 'LOW RISK: Partial Equipment',
    SAFE: 'SAFE: All Equipment Detected',
    UNKNOWN: 'UNKNOWN: Check Equipment'
  }
  const banner = palette[risk] || palette.UNKNOWN
  const text = message || textMap[risk] || textMap.UNKNOWN

  return (
    <div className={`w-full ${banner} text-white rounded-lg px-4 py-3 flex items-center justify-between`}>
      <span className="font-semibold">{risk}</span>
      <span className="opacity-90">{text}</span>
    </div>
  )
}
