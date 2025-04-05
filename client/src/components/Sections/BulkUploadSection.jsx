import React from 'react'
import BulkUpload from '../BulkUpload'

const BulkUploadSection = ({ fetchProducts, showAlert }) => {
  return (
    <div className="mt-4">
    <h4 style={{textAlign:'center'}}>Bulk Upload</h4>
    <BulkUpload
      fetchProducts={fetchProducts}
      showAlert={showAlert}
    />
  </div>
  )
}

export default BulkUploadSection