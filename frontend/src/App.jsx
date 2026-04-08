import { useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    setLoading(true);
    try {
      // Fetching from your deployed Render backend
      const response = await fetch('https://resumeparser-production-5539.up.railway.app/match');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Check if your Render backend is awake! It may take a minute to spin up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      {/* Simple Header */}
      <nav className="bg-white border-b border-slate-200 py-4 px-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-tighter uppercase text-indigo-600">RecruitEngine</h2>
          <div className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded">RULE_BASED_v1.0</div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Job Match Analysis</h1>
          <p className="text-slate-500 text-lg">Evaluate candidate alignment using traditional NLP methods.</p>
        </div>

        {/* Upload/Action Area */}
        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm transition-all hover:shadow-md">
          {!data ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Analyze Local Resume</h3>
              <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm">The system will process the PDF stored in the backend data folder.</p>
              <button 
                onClick={analyzeResume}
                disabled={loading}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Processing NLP Logic..." : "Begin Matching"}
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Candidate Overview */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-8 mb-8">
                <div>
                  <h2 className="text-3xl font-black">{data.name}</h2>
                  <p className="text-slate-400 font-medium">Exp: {data.yearOfExperience} Years • {data.salary}</p>
                </div>
                <div className="flex flex-col items-center bg-indigo-600 text-white px-6 py-4 rounded-2xl min-w-[120px]">
                  <span className="text-4xl font-black">{data.matchingJobs[0].matchingScore}%</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Matching Score</span>
                </div>
              </div>

              {/* Skills Analysis [cite: 35-38, 58-61] */}
              <div className="space-y-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Job Skill Mapping</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.matchingJobs[0].skillsAnalysis.map((item, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${item.presentInResume ? 'border-green-100 bg-green-50/50' : 'border-slate-100 bg-slate-50/30'}`}>
                      <span className="font-bold text-slate-700">{item.skill}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${item.presentInResume ? 'text-green-600 bg-green-100' : 'text-slate-300 bg-slate-100'}`}>
                        {item.presentInResume ? 'Verified' : 'Missing'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setData(null)}
                className="mt-12 text-slate-400 hover:text-slate-600 text-sm font-bold transition-colors"
              >
                ← Clear Results
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;