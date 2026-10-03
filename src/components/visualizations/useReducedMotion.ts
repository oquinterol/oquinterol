import { useEffect, useState } from 'react'

// Starts as "reduced" so server HTML and first paint never assume motion is welcome.
export function useReducedMotion(): boolean {
	const [reduced, setReduced] = useState(true)
	useEffect(() => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)')
		const update = () => setReduced(query.matches)
		update()
		query.addEventListener('change', update)
		return () => query.removeEventListener('change', update)
	}, [])
	return reduced
}
