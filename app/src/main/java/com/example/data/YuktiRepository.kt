package com.example.data

import com.example.data.models.*
import kotlinx.coroutines.flow.Flow

class YuktiRepository(private val db: YuktiDatabase) {
    // User & Session
    val activeSession: Flow<UserSessionEntity?> = db.userDao().getActiveSession()
    suspend fun getActiveSessionOnce(): UserSessionEntity? = db.userDao().getActiveSessionOnce()
    suspend fun setSession(session: UserSessionEntity) = db.userDao().insertSession(session)
    suspend fun clearSession() = db.userDao().clearSession()

    // Companies
    val allCompanies: Flow<List<CompanyEntity>> = db.userDao().getAllCompanies()
    suspend fun getCompanyById(id: String): CompanyEntity? = db.userDao().getCompanyById(id)
    suspend fun registerCompany(company: CompanyEntity) = db.userDao().insertCompany(company)
    suspend fun updateCompanyVerification(id: String, status: VerificationStatus, feedback: String) {
        db.userDao().updateCompanyVerification(id, status, feedback)
        db.auditLogDao().insertAuditLog(
            AuditLogEntity(
                adminId = "ADMIN_USER",
                action = "VERIFY_COMPANY_${status.name}",
                entityType = "COMPANY",
                entityId = id,
                details = "Status changed to ${status.name}. Feedback: $feedback"
            )
        )
    }

    // Equipment Providers
    val allProviders: Flow<List<EquipmentProviderEntity>> = db.userDao().getAllProviders()
    suspend fun getProviderById(id: String): EquipmentProviderEntity? = db.userDao().getProviderById(id)
    suspend fun registerProvider(provider: EquipmentProviderEntity) = db.userDao().insertProvider(provider)
    suspend fun updateProviderVerification(id: String, status: VerificationStatus) {
        db.userDao().updateProviderVerification(id, status)
        db.auditLogDao().insertAuditLog(
            AuditLogEntity(
                adminId = "ADMIN_USER",
                action = "VERIFY_PROVIDER_${status.name}",
                entityType = "EQUIPMENT_PROVIDER",
                entityId = id,
                details = "Provider status changed to ${status.name}"
            )
        )
    }

    // Land Surveys
    fun getLandsForFarmer(farmerId: String): Flow<List<LandRecordEntity>> = db.landRecordDao().getLandsForFarmer(farmerId)
    suspend fun saveLand(land: LandRecordEntity): Long = db.landRecordDao().insertLand(land)
    suspend fun deleteLand(id: Long) = db.landRecordDao().deleteLand(id)

    // Products
    val approvedProducts: Flow<List<ProductEntity>> = db.productDao().getAllApprovedProducts()
    fun getApprovedProductsByCategory(category: ProductCategory): Flow<List<ProductEntity>> = db.productDao().getApprovedProductsByCategory(category)
    fun getProductsByCompany(companyId: String): Flow<List<ProductEntity>> = db.productDao().getProductsByCompany(companyId)
    val allProductsForAdmin: Flow<List<ProductEntity>> = db.productDao().getAllProductsForAdmin()
    suspend fun getProductById(id: Long): ProductEntity? = db.productDao().getProductById(id)
    suspend fun saveProduct(product: ProductEntity): Long = db.productDao().insertProduct(product)
    suspend fun updateProduct(product: ProductEntity) = db.productDao().updateProduct(product)
    suspend fun updateProductVerification(id: Long, status: VerificationStatus, feedback: String) {
        db.productDao().updateProductVerification(id, status, feedback)
        db.auditLogDao().insertAuditLog(
            AuditLogEntity(
                adminId = "ADMIN_USER",
                action = "VERIFY_PRODUCT_${status.name}",
                entityType = "PRODUCT",
                entityId = id.toString(),
                details = "Product verification status changed to ${status.name}. Notes: $feedback"
            )
        )
    }

    // Stock Management
    val allStock: Flow<List<ShopStockEntity>> = db.stockDao().getAllStock()
    fun getStockForProduct(productId: Long): Flow<List<ShopStockEntity>> = db.stockDao().getStockForProduct(productId)
    fun getStockByCompany(companyId: String): Flow<List<ShopStockEntity>> = db.stockDao().getStockByCompany(companyId)
    fun getStockByDistrict(district: String): Flow<List<ShopStockEntity>> = db.stockDao().getStockByDistrict(district)
    suspend fun saveStock(stock: ShopStockEntity): Long = db.stockDao().insertStock(stock)
    suspend fun updateStock(stock: ShopStockEntity) = db.stockDao().updateStock(stock)
    suspend fun deleteStock(id: Long) = db.stockDao().deleteStock(id)

    // Equipment & Booking
    val availableEquipment: Flow<List<EquipmentEntity>> = db.equipmentDao().getAllAvailableEquipment()
    fun getEquipmentByCategory(category: EquipmentCategory): Flow<List<EquipmentEntity>> = db.equipmentDao().getEquipmentByCategory(category)
    fun getEquipmentByProvider(providerId: String): Flow<List<EquipmentEntity>> = db.equipmentDao().getEquipmentByProvider(providerId)
    suspend fun getEquipmentById(id: Long): EquipmentEntity? = db.equipmentDao().getEquipmentById(id)
    suspend fun saveEquipment(equipment: EquipmentEntity): Long = db.equipmentDao().insertEquipment(equipment)
    suspend fun updateEquipment(equipment: EquipmentEntity) = db.equipmentDao().updateEquipment(equipment)
    suspend fun deleteEquipment(id: Long) = db.equipmentDao().deleteEquipment(id)

    fun getBookingsForFarmer(farmerId: String): Flow<List<EquipmentBookingEntity>> = db.bookingDao().getBookingsForFarmer(farmerId)
    fun getBookingsForProvider(providerId: String): Flow<List<EquipmentBookingEntity>> = db.bookingDao().getBookingsForProvider(providerId)
    suspend fun createBooking(booking: EquipmentBookingEntity): Long {
        val bookingId = db.bookingDao().insertBooking(booking)
        // Send notification to equipment provider
        db.notificationDao().insertNotification(
            NotificationEntity(
                recipientRole = UserRole.EQUIPMENT_PROVIDER,
                recipientId = booking.providerId,
                title = "New Booking Request",
                message = "${booking.farmerName} requested ${booking.equipmentName} on ${booking.bookingDate}",
                category = "BOOKING"
            )
        )
        return bookingId
    }
    suspend fun updateBookingStatus(id: Long, status: BookingStatus, notes: String, farmerId: String, equipmentName: String) {
        db.bookingDao().updateBookingStatus(id, status, notes)
        // Send notification to farmer
        db.notificationDao().insertNotification(
            NotificationEntity(
                recipientRole = UserRole.FARMER,
                recipientId = farmerId,
                title = "Booking Status Updated",
                message = "Your booking for $equipmentName is now ${status.name}. Notes: $notes",
                category = "BOOKING"
            )
        )
    }

    // Reviews
    fun getReviewsForTarget(targetType: ReviewTargetType, targetId: Long): Flow<List<ReviewEntity>> = db.reviewDao().getReviewsForTarget(targetType, targetId)
    val reportedReviews: Flow<List<ReviewEntity>> = db.reviewDao().getReportedReviews()
    suspend fun addReview(review: ReviewEntity): Long = db.reviewDao().insertReview(review)
    suspend fun reportReview(id: Long) = db.reviewDao().reportReview(id)
    suspend fun deleteReview(id: Long) = db.reviewDao().deleteReview(id)

    // Enquiries
    fun getEnquiriesForRecipient(recipientId: String): Flow<List<EnquiryEntity>> = db.enquiryDao().getEnquiriesForRecipient(recipientId)
    fun getEnquiriesForSender(senderId: String): Flow<List<EnquiryEntity>> = db.enquiryDao().getEnquiriesForSender(senderId)
    suspend fun sendEnquiry(enquiry: EnquiryEntity): Long {
        val id = db.enquiryDao().insertEnquiry(enquiry)
        db.notificationDao().insertNotification(
            NotificationEntity(
                recipientRole = if (enquiry.recipientType == "COMPANY") UserRole.COMPANY else UserRole.EQUIPMENT_PROVIDER,
                recipientId = enquiry.recipientId,
                title = "New Enquiry: ${enquiry.subject}",
                message = "From ${enquiry.senderName} (${enquiry.senderPhone}): ${enquiry.message}",
                category = "ENQUIRY"
            )
        )
        return id
    }
    suspend fun replyToEnquiry(id: Long, reply: String, senderId: String, subject: String) {
        db.enquiryDao().replyToEnquiry(id, reply)
        db.notificationDao().insertNotification(
            NotificationEntity(
                recipientRole = UserRole.FARMER,
                recipientId = senderId,
                title = "Reply to your enquiry: $subject",
                message = reply,
                category = "ENQUIRY"
            )
        )
    }

    // Notifications
    fun getNotificationsForUser(recipientId: String): Flow<List<NotificationEntity>> = db.notificationDao().getNotificationsForUser(recipientId)
    suspend fun markNotificationRead(id: Long) = db.notificationDao().markAsRead(id)

    // Audit Logs
    val auditLogs: Flow<List<AuditLogEntity>> = db.auditLogDao().getAllAuditLogs()
}
