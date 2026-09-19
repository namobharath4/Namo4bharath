package com.example.data

import androidx.room.TypeConverter
import com.example.data.models.*

class Converters {
    @TypeConverter
    fun fromUserRole(role: UserRole?): String? = role?.name

    @TypeConverter
    fun toUserRole(value: String?): UserRole? = value?.let { enumValueOf<UserRole>(it) }

    @TypeConverter
    fun fromVerificationStatus(status: VerificationStatus?): String? = status?.name

    @TypeConverter
    fun toVerificationStatus(value: String?): VerificationStatus? = value?.let { enumValueOf<VerificationStatus>(it) }

    @TypeConverter
    fun fromProductCategory(category: ProductCategory?): String? = category?.name

    @TypeConverter
    fun toProductCategory(value: String?): ProductCategory? = value?.let { enumValueOf<ProductCategory>(it) }

    @TypeConverter
    fun fromStockStatus(status: StockStatus?): String? = status?.name

    @TypeConverter
    fun toStockStatus(value: String?): StockStatus? = value?.let { enumValueOf<StockStatus>(it) }

    @TypeConverter
    fun fromEquipmentCategory(category: EquipmentCategory?): String? = category?.name

    @TypeConverter
    fun toEquipmentCategory(value: String?): EquipmentCategory? = value?.let { enumValueOf<EquipmentCategory>(it) }

    @TypeConverter
    fun fromPricingUnit(unit: PricingUnit?): String? = unit?.name

    @TypeConverter
    fun toPricingUnit(value: String?): PricingUnit? = value?.let { enumValueOf<PricingUnit>(it) }

    @TypeConverter
    fun fromBookingStatus(status: BookingStatus?): String? = status?.name

    @TypeConverter
    fun toBookingStatus(value: String?): BookingStatus? = value?.let { enumValueOf<BookingStatus>(it) }

    @TypeConverter
    fun fromReviewTargetType(type: ReviewTargetType?): String? = type?.name

    @TypeConverter
    fun toReviewTargetType(value: String?): ReviewTargetType? = value?.let { enumValueOf<ReviewTargetType>(it) }
}
