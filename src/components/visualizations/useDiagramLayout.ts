import { useEffect, useRef, useState } from 'react'

// CSS selects the server-rendered geometry before hydration. JS only mirrors that decision
// for animation loops and interactive layouts; viewport width alone is not the source of truth.
export function useDiagramLayout<T extends HTMLElement = HTMLDivElement>() {
	const ref = useRef<T>(null)
	const [portrait, setPortrait] = useState(false)
	useEffect(() => {
		const element = ref.current
		if (!element) return
		const update = () =>
			setPortrait(getComputedStyle(element).getPropertyValue('--diagram-portrait').trim() === '1')
		const observer = new ResizeObserver(update)
		observer.observe(element)
		const orientation = window.matchMedia('(orientation: portrait)')
		orientation.addEventListener('change', update)
		update()
		return () => {
			observer.disconnect()
			orientation.removeEventListener('change', update)
		}
	}, [])
	return { ref, portrait }
}
