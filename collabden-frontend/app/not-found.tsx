import Link from 'next/link';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Button from './components/ui/Button';

export default function NotFound() {
    return (
        <div className="relative min-h-screen bg-white/30 flex flex-col pt-32">
            <Navbar />
            <main className="fgrow flex items-center justify-center text-white text-center px-6">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-2xl w-full shadow-2xl">
                    <h1 className="text-8xl font-bold mb-4 text-primary-blue bg-clip-text">404</h1>
                    <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
                    <p className="text-lg text-white/70 mb-8">
                        The page you are looking for doesn&apos;t exist or has been moved.
                    </p>
                    <div className="flex justify-center">
                        <Link href="/">
                            <Button variant="primary" size="md">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
