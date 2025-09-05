export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-primary mb-4">CSN</div>
            <p className="text-muted-foreground text-sm">Your ultimate destination for live sports, shows, and news.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Sports</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  NBA
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  NFL
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Soccer
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Tennis
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shows</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  SportsCenter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  First Take
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Undisputed
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  PTI
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 CSN Sports Network. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
