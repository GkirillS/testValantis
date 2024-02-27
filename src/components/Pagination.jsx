import React, { useMemo } from 'react'
import cl from '../styles/Pagination.module.css'

const Pagination = ({ total, page, callback }) => {
	const pagination = useMemo(() => {
		return Array.from({ length: total }, (_, c) => c + 1)
	}, [total])

	return (
		<div className={cl.pagination} >
			{page >= 5 && <div onClick={() => callback(1)}>1</div>}
			{page >= 6 && <div onClick={() => callback(prev => prev - 4)}>...</div>}
			{pagination.map(num => page - 3 <= num && page + 3 >= num &&
				<div className={page === num ? cl.paginationActive : null} onClick={() => callback(num)} key={num}>{num}</div>
			)}
			{page <= total - 5 && <div onClick={() => callback(prev => prev + 4)}>...</div>}
			{page <= total - 4 && <div onClick={() => callback(total)}>{total}</div>}
		</div>
	)
}

export default Pagination