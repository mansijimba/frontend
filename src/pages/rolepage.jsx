import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import rolebg from "../assets/images/rolebg.png";

export default function RolePage() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#f5f3f0] relative">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#f8f6f3] via-[#f5f3f0] to-[#ede9e4]" />

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Title */}
          <h1 className="text-4xl font-serif bg-gradient-to-r from-yellow-500 to-amber-800 bg-clip-text text-transparent">
            CREATE AN ACCOUNT
          </h1>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto py-8">
            
            {/* Buyer Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-neutral-300 p-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-6 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="35" r="15" fill="none" stroke="black" strokeWidth="3" />
                  <path d="M 30 80 Q 30 55 50 55 Q 70 55 70 80" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="72" cy="72" r="18" fill="black" />
                  <rect x="64" y="68" width="10" height="8" rx="1" fill="white" />
                  <circle cx="67" cy="79" r="1.5" fill="white" />
                  <circle cx="71" cy="79" r="1.5" fill="white" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                Register as Buyer
              </h2>
              <p className="text-neutral-700 mb-8 leading-relaxed">
                Shop products, explore collections,
                <br />
                and enjoy exclusive deals.
              </p>

              <button
                onClick={() => navigate("/register1")}
                className="bg-[#c9a876] hover:bg-[#b89865] text-neutral-900 px-10 py-4 text-lg font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
              >
                Register
              </button>
            </div>

            {/* Seller Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-neutral-300 p-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-6 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="35" r="15" fill="none" stroke="black" strokeWidth="3" />
                  <path d="M 30 80 Q 30 55 50 55 Q 70 55 70 80" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="72" cy="72" r="18" fill="black" />
                  <text
                    x="72"
                    y="80"
                    fontSize="24"
                    fill="white"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    $
                  </text>
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                Register as Seller
              </h2>
              <p className="text-neutral-700 mb-8 leading-relaxed">
                Turn your passion into joy for
                <br />
                thousands of customers
              </p>

              <button
                onClick={() => navigate("/register2")}
                className="bg-[#c9a876] hover:bg-[#b89865] text-neutral-900 px-10 py-4 text-lg font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
              >
                Register
              </button>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
