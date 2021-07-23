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
      createdAt: client.createdAt.toDateString(),
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
      dateOfEntry: product.dateOfEntry.toDateString(),
      dateOfExpry: product.dateOfExpry.toDateString(),
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
      dateOfEntry: record.dateOfEntry.toDateString(),
      dateRecorded: record.dateRecorded.toDateString(),
    }
  },
  adminReducer(admin) {
    return {
      adminId: admin._id,
      username: admin.username,
      email: admin.email,
      phone: admin.phone,
      gender: admin.gender,
      role: admin.role,
      createdAt: admin.createdAt.toDateString(),
    }
  },
  notificationReducer(notification) {
    return {
      notificationId: notification._id,
      admin: notification.adminId,
      client: notification.clientId,
      message: notification.message,
      createdAt: notification.createdAt.toDateString(),
    }
  },
}
