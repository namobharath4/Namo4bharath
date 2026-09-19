package com.example.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class UserRole {
    FARMER,
    COMPANY,
    EQUIPMENT_PROVIDER,
    ADMIN
}

enum class VerificationStatus {
    PENDING,
    UNDER_REVIEW,
    VERIFIED,
    APPROVED,
    CORRECTION_REQUIRED,
    REJECTED,
    SUSPENDED,
    DRAFT,
    SUBMITTED
}

@Entity(tableName = "user_sessions")
data class UserSessionEntity(
    @PrimaryKey val id: String,
    val role: UserRole,
    val fullName: String,
    val mobile: String,
    val email: String,
    val state: String,
    val district: String,
    val mandal: String,
    val village: String,
    val preferredLanguage: String, // "en" or "te"
    val isVerified: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "companies")
data class CompanyEntity(
    @PrimaryKey val id: String,
    val companyName: String,
    val licenseNumber: String,
    val category: String, // SEEDS, FERTILIZERS, PESTICIDES
    val contactPerson: String,
    val mobile: String,
    val email: String,
    val address: String,
    val state: String,
    val district: String,
    val website: String,
    val verificationStatus: VerificationStatus = VerificationStatus.PENDING,
    val adminFeedback: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "equipment_providers")
data class EquipmentProviderEntity(
    @PrimaryKey val id: String,
    val providerName: String,
    val mobile: String,
    val email: String,
    val state: String,
    val district: String,
    val village: String,
    val serviceArea: String,
    val verificationStatus: VerificationStatus = VerificationStatus.PENDING,
    val createdAt: Long = System.currentTimeMillis()
)
