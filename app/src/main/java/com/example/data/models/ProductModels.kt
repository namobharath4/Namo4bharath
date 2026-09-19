package com.example.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class ProductCategory {
    SEEDS,
    FERTILIZERS,
    PESTICIDES
}

@Entity(tableName = "products")
data class ProductEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val companyId: String,
    val companyName: String,
    val productName: String,
    val brandName: String,
    val manufacturerName: String,
    val category: ProductCategory,
    val productType: String,
    val description: String,
    val nutrientsJson: String = "", // e.g. [{"name":"Nitrogen","percentage":"19%"},{"name":"Phosphorus","percentage":"19%"}]
    val suitableCropsJson: String = "", // e.g. ["Paddy","Cotton","Chilli"]
    val cropStage: String = "",
    val recommendedUsage: String = "",
    val dosage: String = "",
    val applicationMethod: String = "",
    val packSizesJson: String = "", // e.g. ["1 kg","5 kg","25 kg"]
    val mrp: Double = 0.0,
    val companyDeclaredPrice: Double = 0.0,
    val effectiveDate: String = "",
    val expiryDate: String = "",
    val registrationNumber: String = "",
    val regulatoryNotes: String = "",
    val verificationStatus: VerificationStatus = VerificationStatus.DRAFT,
    val adminFeedback: String = "",
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
