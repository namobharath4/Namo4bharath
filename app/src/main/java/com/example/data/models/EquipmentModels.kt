package com.example.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class EquipmentCategory {
    TRACTOR,
    HARVESTER,
    ROTAVATOR,
    CULTIVATOR,
    SEEDER,
    SPRAYER,
    IRRIGATION,
    TRANSPORT,
    TILLER,
    OTHER
}

enum class PricingUnit {
    PER_HOUR,
    PER_ACRE,
    PER_DAY
}

enum class BookingStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    CANCELLED,
    COMPLETED
}

@Entity(tableName = "equipment")
data class EquipmentEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val providerId: String,
    val providerName: String,
    val category: EquipmentCategory,
    val nameModel: String,
    val condition: String, // Excellent, Good, Fair
    val specifications: String,
    val serviceArea: String,
    val district: String,
    val village: String,
    val rate: Double,
    val pricingUnit: PricingUnit = PricingUnit.PER_HOUR,
    val dieselFuelTerms: String, // "Farmer provides diesel" or "Diesel included in rate"
    val operatorIncluded: Boolean = true,
    val minBookingDuration: Int = 1, // hours or acres
    val transportationCharges: Double = 0.0,
    val additionalConditions: String = "",
    val contactPhone: String,
    val isAvailable: Boolean = true,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "equipment_bookings")
data class EquipmentBookingEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val equipmentId: Long,
    val equipmentName: String,
    val category: EquipmentCategory,
    val providerId: String,
    val providerName: String,
    val farmerId: String,
    val farmerName: String,
    val farmerPhone: String,
    val bookingDate: String,
    val quantityOrAcres: Double,
    val pricingUnit: PricingUnit,
    val locationVillage: String,
    val estimatedTotalCost: Double,
    val dieselTermsSnapshot: String,
    val status: BookingStatus = BookingStatus.PENDING,
    val farmerNotes: String = "",
    val providerResponseNotes: String = "",
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
