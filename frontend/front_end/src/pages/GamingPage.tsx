const GamingPage = () => {
    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {/* Navbar */}
            <nav className="flex justify-between items-center p-4 bg-gray-800">
                <h1 className="text-2xl font-bold">Gaming Zone</h1>
                <div>
                    <a href="/login" className="px-4 py-2 bg-blue-500 rounded-lg">Login</a>
                    <a href="/signup" className="ml-2 px-4 py-2 bg-green-500 rounded-lg">Sign Up</a>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="p-6 text-center">
                <h2 className="text-3xl font-bold">Welcome to Gaming Zone</h2>
                <p className="text-gray-400">Enjoy the best free games!</p>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                {/* Sample Games */}
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg">
                        <div className="h-40 bg-gray-600"></div>
                        <h3 className="mt-2 text-lg font-bold">Game {index + 1}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GamingPage;
