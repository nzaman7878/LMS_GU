

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[300px] w-full">
      
      <div className="flex flex-col items-center gap-3">
        
     
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

       
        <p className="text-gray-500 text-sm">Loading...</p>

      </div>

    </div>
  );
};

export default Loading;