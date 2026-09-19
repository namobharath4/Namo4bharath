package com.example.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class StockStatus {
    IN_STOCK,
    LOW_STOCK,
    OUT_OF_STOCK,
    NOT_UPDATED
}

@Entity(tableName = "shop_stock")
data class ShopStockEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val companyId: String,
    val productId: Long,
    val productName: String,
    val category: ProductCategory,
    val shopName: String,
    val shopAddress: String,
    val district: String,
    val mandal: String,
    val village: String,
    val contactPhone: String,
    val packSize: String,
    val availableQuantity: Int,
    val currentPrice: Double,
    val status: StockStatus = StockStatus.IN_STOCK,
    val lat: Double = 0.0,
    val lng: Double = 0.0,
    val lastUpdated: Long = System.currentTimeMillis()
)
