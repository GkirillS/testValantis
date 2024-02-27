import React, { useEffect, useState } from 'react'
import './App.css'
import Pagination from './components/Pagination'
import ProductCard from './components/ProductCard'
import Filter from './components/Filter'
import { useFetching } from './helpers/useFetching'
import { Spin } from 'antd'

const App = () => {
  const [page, setPage] = useState(1)
  const [filterActive, setFilterActive] = useState(false)
  const [selectedFilterOption, setSelectedFilterOption] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [product, setProduct] = useState('')



  const [isLoading, store, fetching, totalPages, filterOptions, brands, prices, tipForSpin] = useFetching()

  const handleFilter = () => {
    const params = {}
    if (selectedFilterOption === 'brand') params[selectedFilterOption] = selectedBrand === 'null' ? null : selectedBrand
    else if (selectedFilterOption === 'price') params[selectedFilterOption] = +selectedPrice
    else if (selectedFilterOption === 'product') params[selectedFilterOption] = product

    setPage(1)
    setFilterActive(true)
    fetching(page, 'filter', params)
  }

  const handleFilterClear = () => {
      setSelectedFilterOption('')
      setSelectedBrand('')
      setSelectedPrice('')
      setProduct('')
      setPage(1)
      setFilterActive(false)
      fetching(page)
  }

  useEffect(() => {
    filterActive ? fetching(page, 'filter', 'nextPage') : fetching(page)
  }, [page])

  return (
    <div>
      <div className='wrapper'>
        <Filter 
          handleFilterClear={handleFilterClear} 
          isLoading={isLoading} 
          handleFilter={handleFilter} 
          selectedBrand={selectedBrand} 
          setSelectedBrand={setSelectedBrand} 
          selectedPrice={selectedPrice} 
          setSelectedPrice={setSelectedPrice} 
          product={product} 
          setProduct={setProduct} 
          selectOptions={{ filterOptions, brands, prices }} 
          selectedFilterOption={selectedFilterOption} 
          setSelectedFilterOption={setSelectedFilterOption} />
        {isLoading ?
          <>
            <div className='container-products'>
              {store.map(item => 
                <ProductCard key={item.id} card={item} /> 
              )}
            </div>
            <Pagination total={totalPages} page={page} callback={setPage} />
          </>
          :
          <Spin tip={tipForSpin} spinning={!isLoading} fullscreen/>}
      </div>
    </div>
  )
}

export default App