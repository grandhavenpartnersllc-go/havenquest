import Link from 'next/link'

export default function RealtorCTA() {
  return (
    <section className="py-12 px-4 bg-white border-t border-gray-100">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-2xl font-medium text-gray-900 mb-2">
          Are you a Texas realtor?
        </p>
        <p className="text-gray-500 mb-6">
          When someone arrives in your city with a clear vision, a set budget, and a plan for their future — they deserve the finest realtor available. That&apos;s who we&apos;re looking for.
        </p>
        <Link
          href="/for-realtors"
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium text-sm hover:border-accent hover:text-accent transition-colors"
        >
          Learn about HavenQuest for Realtors →
        </Link>
      </div>
    </section>
  )
}
