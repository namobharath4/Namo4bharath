package com.example.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.example.data.dao.*
import com.example.data.models.*

@Database(
    entities = [
        UserSessionEntity::class,
        CompanyEntity::class,
        EquipmentProviderEntity::class,
        LandRecordEntity::class,
        ProductEntity::class,
        ShopStockEntity::class,
        EquipmentEntity::class,
        EquipmentBookingEntity::class,
        ReviewEntity::class,
        EnquiryEntity::class,
        NotificationEntity::class,
        AuditLogEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class YuktiDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun landRecordDao(): LandRecordDao
    abstract fun productDao(): ProductDao
    abstract fun stockDao(): StockDao
    abstract fun equipmentDao(): EquipmentDao
    abstract fun bookingDao(): BookingDao
    abstract fun reviewDao(): ReviewDao
    abstract fun enquiryDao(): EnquiryDao
    abstract fun notificationDao(): NotificationDao
    abstract fun auditLogDao(): AuditLogDao

    companion object {
        @Volatile
        private var INSTANCE: YuktiDatabase? = null

        fun getDatabase(context: Context): YuktiDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    YuktiDatabase::class.java,
                    "yukti_agricultural_database.db"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
