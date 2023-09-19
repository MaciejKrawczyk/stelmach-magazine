'use client'

// PDFViewer.js
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

function PDFViewer() {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <Document
                file="path-to-your-pdf-file.pdf"
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} />
            </Document>
            <div className="mt-4 text-center">
                <p className="text-gray-600">
                    Page {pageNumber} of {numPages}
                </p>
                <div className="flex justify-center mt-2">
                    <button
                        onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                        className="px-4 py-2 mr-2 bg-blue-600 text-white rounded"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PDFViewer;
