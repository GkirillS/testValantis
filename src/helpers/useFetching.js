import axios from "axios"
import { API, LIMIT, PASSWORD } from "./const"
import { errorIdentifier } from "./errorIdentifier"
import { useEffect, useState } from "react"

export const useFetching = () => {
	const option = { headers: { "X-Auth": PASSWORD } }
	const [isLoading, setIsLoading] = useState(false)
	const [totalPages, setTotalPages] = useState(1)
	const [filterIDS, setFilterIDS] = useState([])
	const [store, setStore] = useState([])
	const [filterOptions, setFilterOptions] = useState([])
	const [brands, setBrands] = useState([])
	const [prices, setPrices] = useState([])
	const [tipForSpin, setTipForSpin] = useState('Запрашиваем данные...')

	const getFields = async () => {
		try {
			const body = {"action": "get_fields"}
			const bodyBrand = {"action": "get_fields", "params": {"field" : "brand"}}
			const bodyPrice = {"action": "get_fields", "params": {"field" : "price"}}
			const bodyLength = {"action": "get_ids"}

			const res = await axios.post(API, body, option)
			setFilterOptions(res.data.result)

			const resBrand = await axios.post(API, bodyBrand, option)
			resBrand.data.result.push('Товар без бренда')
			setBrands(Array.from(new Set(resBrand.data.result.filter(i => i))).sort((a,b) => a-b))

			const resPrice = await axios.post(API, bodyPrice, option) 
			setPrices(Array.from(new Set(resPrice.data.result)).sort((a,b) => a-b))

			const resLength = await axios.post(API, bodyLength, option)
			const length = resLength.data.result.length
			setTotalPages(Math.ceil(length / LIMIT))
		} catch (error) {
			const mes = errorIdentifier(error)
			if (mes) {
				setTipForSpin('Произошла ошибка в подключении. Пробуем подключиться к серверу заново.')
				setTimeout(() => getFields(), 2000)
			}
		}
	}

	const filterQuery = (params) => {
		const body = {"action": "filter", "params": params}
		return axios.post(API, body, option)
	}

	const getIds = (page) => {
		
		const body = {"action": "get_ids", "params": {"limit": LIMIT * 2, "offset": LIMIT * (page - 1)}}
		return axios.post(API, body, option)
	}

	const getItems = (ids) => {
		const body = {"action": "get_items", "params": {"ids": ids}}
		return axios.post(API, body, option)
	}

	const checkDuplicates = (arr) => { // проверка на дубли
		return Array.from(new Set(arr.map(item => item.id)))
					.map(property => arr.find(item => item.id === property));
	}

	const fetching = async (page, method='get_ids', params) => {
		setIsLoading(false)
		try {
			if (method === 'get_ids') {
				const ids = await getIds(page)
				console.log(ids)
				const items = await getItems(ids.data.result) //Запрос по id без применения фильтра с учетом limit
				const itemsUnique = checkDuplicates(items.data.result)
				itemsUnique.length = 50
				setStore(itemsUnique)
			}
			else if (method === 'filter') {
				let ids = [...filterIDS]
				if (params !== 'nextPage') { // Запрос по фильтрации и кеширование отфильтрованных id
					ids = await filterQuery(params)
					setTotalPages(Math.ceil(ids.data.result.length / LIMIT))
					setFilterIDS(ids.data.result)
					ids = ids.data.result
				}
				const items = await getItems(ids.filter((_, index) => LIMIT * (page - 1) <= index && LIMIT * (page + 1) >= index)) // Запрос по отфильтрованным id согласно limit

				const itemsUnique = checkDuplicates(items.data.result)
				itemsUnique.length = 50
				setStore(itemsUnique)
			}

			setIsLoading(true)
			setTipForSpin('Запрашиваем данные...')

		} catch (error) {
			const repeatQuery = errorIdentifier(error)
			if (repeatQuery) {
				setTipForSpin('Произошла ошибка в подключении. Пробуем подключиться к серверу заново')
				setTimeout(() => fetching(page, method, params), 2000)
			}
		}

	}


	useEffect(() => {
		getFields()
	}, [])

	return [
		isLoading,
		store,
		fetching,
		totalPages,
		filterOptions,
		brands,
		prices,
		tipForSpin,
	]
}