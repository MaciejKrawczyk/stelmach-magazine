'use client'
import {Page, Text, View, Document, StyleSheet, PDFViewer} from '@react-pdf/renderer';


export default function pdfPage() {

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });

    // Create Document Component
    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    );

    return (
        <PDFViewer className={'w-full h-[calc(100vh-96px)]'}>
            <MyDocument />
        </PDFViewer>
    )

}

