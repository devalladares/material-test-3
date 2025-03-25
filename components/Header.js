const Header = () => {
  return (
    <header className="w-full py-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <h1 className="text-lg font-medium tracking-[-0.2px] text-gray-800" style={{ fontFamily: "'Google Sans Text', sans-serif" }}>GEMINI 3D</h1>
        
        <p className="text-sm text-gray-400">
          <span>By</span>{" "}
          <a href="https://x.com/dev_valladares" className="hover:text-gray-600 transition-colors">Dev Valladares</a> 
          {" "}&{" "}
          <a href="https://x.com/trudypainter" className="hover:text-gray-600 transition-colors">Trudy Painter</a>
          {" "}• <a 
            href="https://aistudio.google.com/prompts/new_chat" 
            className="hover:text-gray-600 transition-colors"
            target="_blank" 
            rel="noopener noreferrer"
          >
            Google Creative Lab
          </a>
        </p>
      </div>
    </header>
  );
};

export default Header; 