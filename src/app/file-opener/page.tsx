'use client'
import React, { useState } from 'react';

export default function pdfPage() {
  const [inputValue, setInputValue] = useState('');
  const [pdfPath, setPdfPath] = useState('');
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const extractedValue = inputValue.split('_')[0];
    const newPath = `http://10.0.0.1/metrix/order_data/${extractedValue}/production.pdf`;
    setPdfPath(newPath);
    setInputValue('')
  };
  
  return (
    <div>
      {/* Search Bar */}
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          type="text"
          placeholder="Enter value (XXXXXX_X)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      
      {/* PDF Display */}
      <div className={'w-full h-[calc(100vh-96px)] relative'}>
        <iframe
          className={'w-full h-full'}
          src={pdfPath}
          title="PDF Viewer"
        />
        {/* If there's no pdfPath, display an error message over the iframe */}
        {!pdfPath && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <p className="error">Brak pdf do wyświetlenia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
