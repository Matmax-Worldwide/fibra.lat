import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="px-6 md:px-12 py-8 md:py-12 max-w-screen-xl mx-auto">
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center">
          Investment Calculators for Real Estate Developers
        </h1>
        
        <p className="text-xl text-center max-w-3xl mx-auto">
          Professional financial models and calculators to analyze real estate investments
          in Latin America.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src="/investment-calculator.jpg"
                alt="Investment Return Calculator"
                fill
                style={{objectFit: 'cover'}}
                priority
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Investment Return Calculator</h2>
              <p className="text-gray-600 mb-4">
                Calculate returns on real estate investments based on purchase price, rental income, and expenses.
              </p>
              <Link href="/calculator" className="button-primary inline-block">
                Open Calculator
              </Link>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src="/mortgage-calculator.jpg"
                alt="Mortgage Calculator"
                fill
                style={{objectFit: 'cover'}}
                priority
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Mortgage Calculator</h2>
              <p className="text-gray-600 mb-4">
                Estimate monthly mortgage payments based on loan amount, interest rate, and term length.
              </p>
              <Link href="/mortgage" className="button-primary inline-block">
                Open Calculator
              </Link>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src="/development-calculator.jpg"
                alt="Development Calculator"
                fill
                style={{objectFit: 'cover'}}
                priority
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Development Calculator</h2>
              <p className="text-gray-600 mb-4">
                Model multi-format real estate development projects with mixed hotel, serviced apartments, and Airbnb units.
              </p>
              <Link href="/development" className="button-primary inline-block">
                Open Calculator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 