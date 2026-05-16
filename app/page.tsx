import Link from 'next/link'

export default function FeedPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      {/* Hero */}
      <div className="mb-10">
        <div className="text-5xl font-extrabold text-[#1e3829] tracking-tight mb-2">ZK</div>
        <p className="text-gray-500 text-base mb-8">time to change ur life is now</p>

        <div className="flex gap-4 flex-wrap">
          <Link href="/food" className="flex flex-col gap-2 bg-[#1e3829] text-white rounded-[20px] px-7 py-6 min-w-[160px] hover:-translate-y-1 hover:shadow-xl transition-all duration-150">
            <span className="text-3xl">🥗</span>
            <span className="text-lg font-bold mt-1">Food Plan</span>
            <span className="text-sm opacity-75">50 meals</span>
          </Link>
          <Link href="/workout" className="flex flex-col gap-2 bg-[#1e3829] text-white rounded-[20px] px-7 py-6 min-w-[160px] hover:-translate-y-1 hover:shadow-xl transition-all duration-150">
            <span className="text-3xl">💪</span>
            <span className="text-lg font-bold mt-1">Workout</span>
            <span className="text-sm opacity-75">4 training types</span>
          </Link>
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-sm">Latest Activity</span>
          <span className="text-gray-400 text-sm">0 entries</span>
        </div>
        <p className="text-gray-400 text-sm text-center py-5">No entries yet. Start tracking! 🚀</p>
      </div>
    </div>
  )
}
