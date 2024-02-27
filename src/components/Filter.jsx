import React, { useEffect, useState } from 'react'
import cl from '../styles/Filter.module.css'
import { Form, Input, Select, TreeSelect } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { useForm } from 'antd/es/form/Form'

const Filter = ({ handleFilterClear, isLoading, selectedBrand, setSelectedBrand, selectedPrice, setSelectedPrice, product, setProduct, selectOptions, setSelectedFilterOption, selectedFilterOption, handleFilter }) => {
	const [form] = Form.useForm()
	
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

	const clearFilter = () => {
		form.resetFields()
		handleFilterClear()
	}

	return (
		<div className={cl.filter}>
			<Form form={form} onFinish={handleFilter}>
				<Form.Item label='Сортировать по' className={cl.filterSelected} style={{margin: '10px'}} name="SelectOption"  >
					<Select
						value={selectedFilterOption}
						onChange={(value) => setSelectedFilterOption(value)}
						options={selectOptions.filterOptions.map(i => ({value: i, label: i === 'brand' ? 'Бренд' : i === 'price' ? "Цена" : 'Продукт'}))} 
						placeholder='Выберите из списка'
					/>
				</Form.Item>

				{selectedFilterOption === 'brand' &&
					<Form.Item label='Бренд' className={cl.filterSelected} tyle={{margin: 0}} name="SelectBrand" rules={[{ required: true, message: '' }]}>
						<Select
							required 
							onChange={(value) => setSelectedBrand(value)}
							options={selectOptions.brands.map(i => ({value: i === 'Товар без бренда' ? 'null' : i, label: i}))} 
							placeholder={'Выберите из списка'}
							/>
					</Form.Item>
				}
				{selectedFilterOption === 'price' &&
					<Form.Item className={cl.filterSelected} label='Цена' style={{margin: 0}} name="SelectPrice" rules={[{ required: true, message: '' }]}>
						<TreeSelect
							required
							dropdownStyle={{ maxHeight: 'auto', overflow: 'auto' }}
							placeholder='Выберите из списка'
							treeData={tree}
							onChange={(value) => setSelectedPrice(value)}
						/>
					</Form.Item>
				}
				{selectedFilterOption === 'product' &&
					<Form.Item className={cl.filterSelected} label='Наименование продукта' style={{margin: 0}} name="InputProduct" rules={[{ required: true, message: '' }]}>
						<Input placeholder='кольцо' onChange={(e) => setProduct(e.target.value)}/>
					</Form.Item>
				}
				<div className={cl.filterBtns}>
					{isLoading && selectedFilterOption && <button className={cl.button} type="primary">Отфильтровать</button>}
					{isLoading && selectedFilterOption && <button onClick={clearFilter} className={cl.button}>Сбросить фильтр</button>}
				</div>
			</Form>
		</div>
	)
}

export default Filter