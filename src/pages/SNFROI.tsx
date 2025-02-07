
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SNFROI = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">ROI Calculator for SNFs</h1>
          <p className="text-xl text-gray-600">See how AI can impact your bottom line</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          <div className="col-span-1 lg:col-span-2 bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-primary mb-6">Key Benefits</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Reduced Processing Time</h3>
                  <p className="text-gray-600">Cut claim processing time by up to 75% with AI automation</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Increased Revenue</h3>
                  <p className="text-gray-600">Average 30% increase in successful claim rates</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Cost Savings</h3>
                  <p className="text-gray-600">Reduce operational costs by up to 40%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-primary mb-6">Quick Facts</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-4xl font-bold text-primary">75%</p>
                <p className="text-gray-600">Reduction in claim processing time</p>
              </div>
              <div className="border-b pb-4">
                <p className="text-4xl font-bold text-primary">30%</p>
                <p className="text-gray-600">Increase in successful claims</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">40%</p>
                <p className="text-gray-600">Reduction in operational costs</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SNFROI;
