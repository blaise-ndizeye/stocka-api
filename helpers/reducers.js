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
      createdAt: client.createdAt.toGMTString(),
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
      dateOfEntry: product.dateOfEntry.toGMTString(),
      dateOfExpry: product.dateOfExpry? product.dateOfExpry.toGMTString() : "No expry Date",
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
      dateOfEntry: record.dateOfEntry.toGMTString(),
      dateRecorded: record.dateRecorded.toGMTString(),
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
      createdAt: admin.createdAt.toGMTString(),
    }
  },
  notificationReducer(notification) {
    return {
      notificationId: notification._id,
      source: notification.source,
      client: notification.clientId,
      message: notification.message,
      createdAt: notification.createdAt.toGMTString(),
    }
  },
  paymentReducer(pays) {
    return {
      paymentId: pays._id,
      client: pays.clientId,
      paid: pays.paid,
      expryDate: pays.expryDate.toGMTString(),
      refund: pays.refund,
    }
  },
  premiumReducer(premium) {
    return {
      premiumId: premium._id,
      amountPaid: premium.amountPaid,
      duration: premium.duration,
      createdAt: premium.createdAt.toGMTString(),
      updatedAt: premium.updatedAt.toGMTString(),
    }
  },
}
