import React from 'react'
import { VectorEditor, labelsEn, labelsEs } from '@oquinterol/vector-editor'
import '@oquinterol/vector-editor/styles.css'

// Biopunk palette: backbone cyan, insert bio green, cut sites pink.
const colors = { vector: '#5ed9d1', insert: '#a4e66d', enzyme: '#ff6b9a' }

export default function VectorEditorIsland({ locale }: { locale: 'es' | 'en' }) {
	return <VectorEditor labels={locale === 'es' ? labelsEs : labelsEn} colors={colors} />
}
