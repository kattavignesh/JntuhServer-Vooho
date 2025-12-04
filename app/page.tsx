export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        🎓 JNTUH Results Automation
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Automated R22 examination results fetching and caching system
                    </p>
                </div>

                {/* Status Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="text-3xl mb-2">🗄️</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Database
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Neon Postgres storing all results
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="text-3xl mb-2">⚡</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Cache
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Upstash Redis for instant retrieval
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="text-3xl mb-2">🤖</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Automation
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Cron jobs checking every minute
                        </p>
                    </div>
                </div>

                {/* API Endpoints */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        📡 API Endpoints
                    </h2>

                    <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                GET /api/health
                            </code>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Check system health and database connectivity
                            </p>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                            <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                GET /api/check/:hallTicket
                            </code>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Retrieve results for a specific hall ticket
                            </p>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                            <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                POST /api/scrape/start
                            </code>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Trigger scraping process (requires API key)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Configuration Info */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">⚙️ Configuration</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">Regulation:</p>
                            <p className="opacity-90">R22</p>
                        </div>
                        <div>
                            <p className="font-semibold">Hall Ticket Range:</p>
                            <p className="opacity-90">220100000001 - 220999999999</p>
                        </div>
                        <div>
                            <p className="font-semibold">Workers:</p>
                            <p className="opacity-90">20 parallel scrapers</p>
                        </div>
                        <div>
                            <p className="font-semibold">Expected Students:</p>
                            <p className="opacity-90">~100,000 - 200,000</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-gray-600 dark:text-gray-400">
                    <p>Built with Next.js, TypeScript, Neon Postgres, and Upstash Redis</p>
                    <p className="mt-2">Deployed on Vercel with automated cron jobs</p>
                </div>
            </div>
        </main>
    );
}
