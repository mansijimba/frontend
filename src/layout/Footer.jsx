import insta from "../assets/logo/insta.png"
import facebook from "../assets/logo/facebook.png"

export default function Footer() {
  return (
    <footer className="mt-12" style={{ backgroundColor: "#8f7e3dff", color: "#fff" }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Steps and Stitches */}
          <div>
            <h3 className="text-xl font-serif mb-4">Loops and Stitches</h3>
            <div className="space-y-3">
              <a
                href="#"
                className="text-white hover:text-gray-200 text-sm transition"
              >
                Social Media
              </a>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-2 bg-white/20 rounded hover:bg-white/30 transition"
                >
                  <img src={facebook} alt="Facebook" className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-white/20 rounded hover:bg-white/30 transition"
                >
                  <img src={insta} alt="Instagram" className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4">SHOP</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-200 text-sm transition"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-200 text-sm transition"
                >
                  Overview
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-200 text-sm transition"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-gray-200 text-sm transition"
                >
                  Releases
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/40 mt-8 pt-8 text-center text-white text-sm">
          <p>© 2025 Loops and Stitches. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
