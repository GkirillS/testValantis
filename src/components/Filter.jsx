import React, { useEffect, useState } from 'react'
import cl from '../styles/Filter.module.css'
import { Form, Input, Select, TreeSelect } from 'antd'

const Filter = ({ handleFilterClear, isLoading, selectedBrand, setSelectedBrand, selectedPrice, setSelectedPrice, product, setProduct, selectOptions, setSelectedFilterOption, selectedFilterOption, handleFilter }) => {
	const [tree, setTree] = useState([])

	function spliceIntoChunks(arr, chunkSize) {
		const res = [];
		while (arr.length > 0) {
			const chunk = arr.splice(0, chunkSize);
			res.push(chunk);
		}
		return res;
	}

	function createTree(arr) {
		setTree([])
		arr.forEach(item => {
			const obj = {
				title: `от ${item[0]} ...до ${item[item.length - 1]}`,
				value: `от ${item[0]} ...до ${item[item.length - 1]}`,
				selectable: false,
				children: item.map(i => ({ title: i, value: i }))
			}
			setTree(prev => [...prev, obj])
		})
	}

	useEffect(() => {
		const chunks = spliceIntoChunks(selectOptions.prices, 100)
		createTree(chunks)
	}, [selectOptions.prices])

	return (
		<div className={cl.filter}>
			<Form onFinish={handleFilter}>
				<div className={cl.filterSelected}>
					<span>Сортировать по:</span> 
					<Form.Item style={{margin: 0}} name="SelectOption">
						<Select 
							value={selectedFilterOption}
							onChange={value => setSelectedFilterOption(value)}
							options={selectOptions.filterOptions.map(i => ({value: i, label: i === 'brand' ? 'Бренд' : i === 'price' ? "Цена" : 'Продукт'}))} 
							placeholder={'Выберите из списка'}
						/>
					</Form.Item>
				</div>
				{selectedFilterOption === 'brand' &&
					<div className={cl.filterSelected}>
						<span>Бренд: </span>
						<Form.Item style={{margin: 0}} name="SelectBrand" rules={[{ required: true, message: '' }]}>
							<Select
								required 
								value={selectedBrand}
								onChange={value => setSelectedBrand(value)}
								options={selectOptions.brands.map(i => ({value: i === 'Товар без бренда' ? 'null' : i, label: i}))} 
								placeholder={'Выберите из списка'}
								/>
						</Form.Item>
					</div>
				}
				{selectedFilterOption === 'price' &&
					<div className={cl.filterSelected}>
						<span>Цена: </span>
						<Form.Item style={{margin: 0}} name="SelectPrice" rules={[{ required: true, message: '' }]}>
							<TreeSelect
								required
								dropdownStyle={{ maxHeight: 'auto', overflow: 'auto' }}
								placeholder='Выберите из списка'
								treeData={tree}
								value={selectedPrice}
								onChange={value => setSelectedPrice(value)}
							/>
						</Form.Item>
						
					</div>
				}
				{selectedFilterOption === 'product' &&
					<div className={cl.filterSelected}>
						<span>Наименование продукта: </span>
						<Form.Item style={{margin: 0}} name="SelectProduct" rules={[{ required: true, message: '' }]}>
							<Input placeholder='кольцо' value={product} onChange={e => setProduct(e.target.value)}/>
						</Form.Item>
					</div>
				}
				<div className={cl.filterBtns}>
				{isLoading && selectedFilterOption && <button className={cl.button} type="primary">Отфильтровать</button>}
				{isLoading && selectedFilterOption && <button onClick={handleFilterClear} className={cl.button}>Сбросить фильтр</button>}
				</div>
			</Form>
		</div>
	)
}

export default Filter