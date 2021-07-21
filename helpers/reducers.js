module.exports = {
  clientReducer(client) {
    return {
      clientId: client._id,
      username: client.username,
      email: client.email,
      phone: client.phone,
      role: client.role,
      gender: client.gender,
      active: client.active,
      createdAt: JSON.stringify(client.createdAt),
    }
  },
  productReducer(product) {
    return {
      client: product.clientId,
      productId: product._id,
      name: product.name,
      buyingPrice: product.buyingPrice,
      amount: product.amount,
      pricePerUnit: product.pricePerUnit,
      description: product.description,
      dateOfEntry: JSON.stringify(product.dateOfEntry),
      dateOfExpry: JSON.stringify(product.dateOfExpry),
    }
  },
  productRecordReducer(record) {
    return {
      client: record.clientId,
      recordId: record._id,
      name: record.name,
      productType: record.productType,
      buyingPrice: record.buyingPrice,
      sellingPrice: record.sellingPrice,
      amount: record.amount,
      description: record.description,
      dateOfEntry: JSON.stringify(record.dateOfEntry),
      dateRecorded: JSON.stringify(record.dateRecorded),
    }
  },
  adminReducer(admin) {
    return {
      adminId: admin._id,
      username: admin.username,
      email: admin.email,
      phone: admin.phone,
      role: admin.role
    }
  }
}
