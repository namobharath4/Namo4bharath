package com.example.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class ReviewTargetType {
    PRODUCT,
    COMPANY,
    SHOP,
    EQUIPMENT_PROVIDER
}

@Entity(tableName = "reviews")
data class ReviewEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val targetType: ReviewTargetType,
    val targetId: Long, // productId or company/provider numeric id hash
    val targetName: String,
    val authorId: String,
    val authorName: String,
    val authorRole: UserRole,
    val rating: Int, // 1 to 5
    val reviewText: String,
    val isVerifiedPurchase: Boolean = false,
    val isReported: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "enquiries")
data class EnquiryEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val recipientType: String, // "COMPANY" or "EQUIPMENT_PROVIDER"
    val recipientId: String,
    val recipientName: String,
    val senderId: String,
    val senderName: String,
    val senderPhone: String,
    val subject: String,
    val message: String,
    val replyMessage: String = "",
    val status: String = "PENDING", // PENDING, REPLIED, CLOSED
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "notifications")
data class NotificationEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val recipientRole: UserRole,
    val recipientId: String,
    val title: String,
    val message: String,
    val category: String, // BOOKING, VERIFICATION, STOCK, ENQUIRY, SYSTEM
    val isRead: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "audit_logs")
data class AuditLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val adminId: String,
    val action: String, // "VERIFIED_COMPANY", "APPROVED_PRODUCT", "CORRECTION_REQUESTED", "MODERATED_REVIEW"
    val entityType: String,
    val entityId: String,
    val details: String,
    val timestamp: Long = System.currentTimeMillis()
)
