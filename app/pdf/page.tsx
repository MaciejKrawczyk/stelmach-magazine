'use client'


export default function pdfPage() {

    return (
        <object
            className={'w-full h-[calc(100vh-96px)]'}
            data={"/generatedPDFs/sample.pdf"}
            type="application/pdf"
        >
            <embed src={"/generatedPDFs/sample.pdf"} type="application/pdf"></embed>
            <p className="error"> Brak pdf do wyświetlenia.</p>
        </object>
    )

}

