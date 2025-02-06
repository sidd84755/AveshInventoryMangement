import React from 'react'
import AddStock from '../AddStock'

const AddStockSection = ( products, fetchProducts, fetchSales, showAlert ) => {
  return (
    <div className="mt-4">
    <h4 style={{textAlign:'center'}}>Add Stock</h4>
    <AddStock
      products={products}
      fetchProducts={fetchProducts}
      fetchSales={fetchSales}
      showAlert={showAlert}
    />
  </div>
  )
}

export default AddStockSection