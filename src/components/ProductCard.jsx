import React from 'react'
import cl from '../styles/ProductCard.module.css'

const ProductCard = ({ card }) => {
	return (
		<div className={cl.product}>
			<div className={cl.containerIMG}>
				<img src={require('../assets/cardsBG.jpg')} alt="bg" />
			</div>
			<div className={cl.description}>
				<div className={cl.id}><b>№:</b> {card.id}</div>
				<div className={cl.title}><b>Название:</b> {card.product}</div>
				<div className={cl.brand}><b>Бренд:</b> {card.brand ? card.brand : '-'}</div>
				<div className={cl.price}><b>Цена:</b> {card.price}</div>
			</div>
		</div>
	)
}

export default ProductCard