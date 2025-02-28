import React from 'react';
import Header from '../component/Header';

const ClientDash = () => {



  const cases = [
    { caseName: "Divorce", category: "Civil", file: "details.pdf", description: "Description" },
    { caseName: "Deforestation", category: "Environmental", file: "details.pdf", description: "Description" },
    { caseName: "Murder Case", category: "Criminal", file: "details.pdf", description: "Description" },
  ];

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center bg-cover bg-center"
      style={{ background: '#f' }} 
    >
      {/* Header */}
      <div className='bg-bg1 w-full '>
        <Header />
      </div>
      

      {/* Title */}
      <div className="text-center text-3xl md:text-4xl font-bold text-black mt-5">
        Your Cases
      </div>

      {/* Cases Table with Glass Effect */}
      <div
          className="w-full max-w-6xl bg-white/30 rounded-lg p-6 my-10 mx-1 shadow-glassmorphism backdrop-blur-[8.5px]"
          style={{
            background: 'rgba(255, 250, 250, 0.25)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(8.5px)',
            WebkitBackdropFilter: 'blur(8.5px)', // For Safari support
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-black border-collapse">
              <thead>
                <tr className="border-b text-lg md:text-xl font-semibold">
                  <th className="py-2 px-4">Case Name</th>
                  <th className="py-2 px-4">Category</th>
                  <th className="py-2 px-4">File</th>
                  <th className="py-2 px-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((item, index) => (
                  <tr key={index} className="border-b text-sm md:text-lg">
                    <td className="py-3 px-4">{item.caseName}</td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4 text-blue-600 cursor-pointer hover:underline">{item.file}</td>
                    <td className="py-3 px-4">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default ClientDash