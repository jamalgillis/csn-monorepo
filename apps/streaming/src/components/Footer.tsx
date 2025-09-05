import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/investors" className="hover:text-white transition-colors">
                  Investors
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Browse */}
          <div>
            <h3 className="text-white font-semibold mb-4">Browse</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="/movies" className="hover:text-white transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/tv-shows" className="hover:text-white transition-colors">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  All Content
                </Link>
              </li>
              <li>
                <Link href="/genres" className="hover:text-white transition-colors">
                  Genres
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="/sign-in" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="hover:text-white transition-colors">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link href="/gift" className="hover:text-white transition-colors">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="w-30">
            <Link href="/" className="block">
              <div className="relative w-full max-w-[200px] h-12">
                <Image
                  src="https://q1u9idchx6.ufs.sh/f/kC4KSKx35wVMyWV5rMoSpRJNgzIn8b2G1Do0WC3csXUZFBE4"
                  alt="CSN Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
            
            {/* <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-red-600 to-orange-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-white text-lg font-bold">CSN</span>
            </div> */}
            
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p>&copy; 2024 Content Streaming Network. All rights reserved.</p>
              <p className="mt-1">Experience the future of content discovery.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}