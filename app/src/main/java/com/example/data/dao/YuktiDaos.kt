package com.example.data.dao

import androidx.room.*
import com.example.data.models.*
import kotlinx.coroutines.flow.Flow

@Dao
interface UserDao {
    @Query("SELECT * FROM user_sessions LIMIT 1")
    fun getActiveSession(): Flow<UserSessionEntity?>

    @Query("SELECT * FROM user_sessions LIMIT 1")
    suspend fun getActiveSessionOnce(): UserSessionEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSession(session: UserSessionEntity)

    @Query("DELETE FROM user_sessions")
    suspend fun clearSession()

    @Query("SELECT * FROM companies WHERE id = :id")
    suspend fun getCompanyById(id: String): CompanyEntity?

    @Query("SELECT * FROM companies")
    fun getAllCompanies(): Flow<List<CompanyEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCompany(company: CompanyEntity)

    @Query("UPDATE companies SET verificationStatus = :status, adminFeedback = :feedback WHERE id = :id")
    suspend fun updateCompanyVerification(id: String, status: VerificationStatus, feedback: String)

    @Query("SELECT * FROM equipment_providers WHERE id = :id")
    suspend fun getProviderById(id: String): EquipmentProviderEntity?

    @Query("SELECT * FROM equipment_providers")
    fun getAllProviders(): Flow<List<EquipmentProviderEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProvider(provider: EquipmentProviderEntity)

    @Query("UPDATE equipment_providers SET verificationStatus = :status WHERE id = :id")
    suspend fun updateProviderVerification(id: String, status: VerificationStatus)
}

@Dao
interface LandRecordDao {
    @Query("SELECT * FROM farmer_lands WHERE farmerId = :farmerId ORDER BY createdAt DESC")
    fun getLandsForFarmer(farmerId: String): Flow<List<LandRecordEntity>>

    @Query("SELECT * FROM farmer_lands WHERE id = :id")
    suspend fun getLandById(id: Long): LandRecordEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLand(land: LandRecordEntity): Long

    @Query("DELETE FROM farmer_lands WHERE id = :id")
    suspend fun deleteLand(id: Long)
}

@Dao
interface ProductDao {
    @Query("SELECT * FROM products WHERE verificationStatus = 'APPROVED' ORDER BY updatedAt DESC")
    fun getAllApprovedProducts(): Flow<List<ProductEntity>>

    @Query("SELECT * FROM products WHERE verificationStatus = 'APPROVED' AND category = :category ORDER BY updatedAt DESC")
    fun getApprovedProductsByCategory(category: ProductCategory): Flow<List<ProductEntity>>

    @Query("SELECT * FROM products WHERE companyId = :companyId ORDER BY updatedAt DESC")
    fun getProductsByCompany(companyId: String): Flow<List<ProductEntity>>

    @Query("SELECT * FROM products ORDER BY updatedAt DESC")
    fun getAllProductsForAdmin(): Flow<List<ProductEntity>>

    @Query("SELECT * FROM products WHERE id = :id")
    suspend fun getProductById(id: Long): ProductEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProduct(product: ProductEntity): Long

    @Update
    suspend fun updateProduct(product: ProductEntity)

    @Query("UPDATE products SET verificationStatus = :status, adminFeedback = :feedback, updatedAt = :updatedAt WHERE id = :id")
    suspend fun updateProductVerification(id: Long, status: VerificationStatus, feedback: String, updatedAt: Long = System.currentTimeMillis())

    @Query("DELETE FROM products WHERE id = :id")
    suspend fun deleteProduct(id: Long)
}

@Dao
interface StockDao {
    @Query("SELECT * FROM shop_stock ORDER BY lastUpdated DESC")
    fun getAllStock(): Flow<List<ShopStockEntity>>

    @Query("SELECT * FROM shop_stock WHERE productId = :productId ORDER BY lastUpdated DESC")
    fun getStockForProduct(productId: Long): Flow<List<ShopStockEntity>>

    @Query("SELECT * FROM shop_stock WHERE companyId = :companyId ORDER BY lastUpdated DESC")
    fun getStockByCompany(companyId: String): Flow<List<ShopStockEntity>>

    @Query("SELECT * FROM shop_stock WHERE district = :district ORDER BY lastUpdated DESC")
    fun getStockByDistrict(district: String): Flow<List<ShopStockEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStock(stock: ShopStockEntity): Long

    @Update
    suspend fun updateStock(stock: ShopStockEntity)

    @Query("DELETE FROM shop_stock WHERE id = :id")
    suspend fun deleteStock(id: Long)
}

@Dao
interface EquipmentDao {
    @Query("SELECT * FROM equipment WHERE isAvailable = 1 ORDER BY createdAt DESC")
    fun getAllAvailableEquipment(): Flow<List<EquipmentEntity>>

    @Query("SELECT * FROM equipment WHERE isAvailable = 1 AND category = :category ORDER BY createdAt DESC")
    fun getEquipmentByCategory(category: EquipmentCategory): Flow<List<EquipmentEntity>>

    @Query("SELECT * FROM equipment WHERE providerId = :providerId ORDER BY createdAt DESC")
    fun getEquipmentByProvider(providerId: String): Flow<List<EquipmentEntity>>

    @Query("SELECT * FROM equipment WHERE id = :id")
    suspend fun getEquipmentById(id: Long): EquipmentEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEquipment(equipment: EquipmentEntity): Long

    @Update
    suspend fun updateEquipment(equipment: EquipmentEntity)

    @Query("DELETE FROM equipment WHERE id = :id")
    suspend fun deleteEquipment(id: Long)
}

@Dao
interface BookingDao {
    @Query("SELECT * FROM equipment_bookings WHERE farmerId = :farmerId ORDER BY createdAt DESC")
    fun getBookingsForFarmer(farmerId: String): Flow<List<EquipmentBookingEntity>>

    @Query("SELECT * FROM equipment_bookings WHERE providerId = :providerId ORDER BY createdAt DESC")
    fun getBookingsForProvider(providerId: String): Flow<List<EquipmentBookingEntity>>

    @Query("SELECT * FROM equipment_bookings WHERE id = :id")
    suspend fun getBookingById(id: Long): EquipmentBookingEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBooking(booking: EquipmentBookingEntity): Long

    @Query("UPDATE equipment_bookings SET status = :status, providerResponseNotes = :notes, updatedAt = :updatedAt WHERE id = :id")
    suspend fun updateBookingStatus(id: Long, status: BookingStatus, notes: String, updatedAt: Long = System.currentTimeMillis())
}

@Dao
interface ReviewDao {
    @Query("SELECT * FROM reviews WHERE targetType = :targetType AND targetId = :targetId ORDER BY createdAt DESC")
    fun getReviewsForTarget(targetType: ReviewTargetType, targetId: Long): Flow<List<ReviewEntity>>

    @Query("SELECT * FROM reviews WHERE isReported = 1 ORDER BY createdAt DESC")
    fun getReportedReviews(): Flow<List<ReviewEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReview(review: ReviewEntity): Long

    @Query("UPDATE reviews SET isReported = 1 WHERE id = :id")
    suspend fun reportReview(id: Long)

    @Query("DELETE FROM reviews WHERE id = :id")
    suspend fun deleteReview(id: Long)
}

@Dao
interface EnquiryDao {
    @Query("SELECT * FROM enquiries WHERE recipientId = :recipientId ORDER BY createdAt DESC")
    fun getEnquiriesForRecipient(recipientId: String): Flow<List<EnquiryEntity>>

    @Query("SELECT * FROM enquiries WHERE senderId = :senderId ORDER BY createdAt DESC")
    fun getEnquiriesForSender(senderId: String): Flow<List<EnquiryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEnquiry(enquiry: EnquiryEntity): Long

    @Query("UPDATE enquiries SET replyMessage = :reply, status = 'REPLIED' WHERE id = :id")
    suspend fun replyToEnquiry(id: Long, reply: String)
}

@Dao
interface NotificationDao {
    @Query("SELECT * FROM notifications WHERE recipientId = :recipientId ORDER BY createdAt DESC")
    fun getNotificationsForUser(recipientId: String): Flow<List<NotificationEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNotification(notification: NotificationEntity): Long

    @Query("UPDATE notifications SET isRead = 1 WHERE id = :id")
    suspend fun markAsRead(id: Long)
}

@Dao
interface AuditLogDao {
    @Query("SELECT * FROM audit_logs ORDER BY timestamp DESC")
    fun getAllAuditLogs(): Flow<List<AuditLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAuditLog(log: AuditLogEntity): Long
}
