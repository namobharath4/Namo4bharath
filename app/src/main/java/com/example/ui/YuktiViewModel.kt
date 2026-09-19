package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.YuktiDatabase
import com.example.data.YuktiRepository
import com.example.data.models.*
import com.example.network.CurrentWeatherDto
import com.example.network.DailyWeatherDto
import com.example.network.GeminiApiClient
import com.example.network.WeatherApiClient
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class AiMessage(
    val sender: String, // "user" or "yukti_ai"
    val text: String,
    val timestamp: Long = System.currentTimeMillis()
)

data class WeatherUiState(
    val isLoading: Boolean = false,
    val current: CurrentWeatherDto? = null,
    val daily: DailyWeatherDto? = null,
    val locationName: String = "Guntur, Andhra Pradesh",
    val errorMessage: String? = null
)

class YuktiViewModel(application: Application) : AndroidViewModel(application) {
    val repository: YuktiRepository = YuktiRepository(YuktiDatabase.getDatabase(application))

    // Language: "en" (English) or "te" (తెలుగు)
    private val _language = MutableStateFlow("en")
    val language: StateFlow<String> = _language.asStateFlow()

    fun toggleLanguage() {
        _language.value = if (_language.value == "en") "te" else "en"
    }

    fun setLanguage(lang: String) {
        _language.value = lang
    }

    // Active Session & Role
    val activeSession: StateFlow<UserSessionEntity?> = repository.activeSession
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // Fallback current role when testing without persistent login
    private val _currentRole = MutableStateFlow(UserRole.FARMER)
    val currentRole: StateFlow<UserRole> = _currentRole.asStateFlow()

    fun selectRole(role: UserRole) {
        _currentRole.value = role
        viewModelScope.launch {
            val existing = repository.getActiveSessionOnce()
            if (existing != null) {
                repository.setSession(existing.copy(role = role))
            } else {
                // Initialize default profile for the role
                val defaultSession = when (role) {
                    UserRole.FARMER -> UserSessionEntity(
                        id = "FARMER_USER_1",
                        role = UserRole.FARMER,
                        fullName = "Ramesh Naidu",
                        mobile = "9848022334",
                        email = "ramesh.farmer@example.com",
                        state = "Andhra Pradesh",
                        district = "Guntur",
                        mandal = "Tenali",
                        village = "Kolanukonda",
                        preferredLanguage = _language.value
                    )
                    UserRole.COMPANY -> UserSessionEntity(
                        id = "COMP_COROMANDEL",
                        role = UserRole.COMPANY,
                        fullName = "Coromandel Agritech Ltd",
                        mobile = "9876543210",
                        email = "regulatory@coromandelagri.com",
                        state = "Andhra Pradesh",
                        district = "Visakhapatnam",
                        mandal = "Gajuwaka",
                        village = "Industrial Area",
                        preferredLanguage = _language.value,
                        isVerified = true
                    )
                    UserRole.EQUIPMENT_PROVIDER -> UserSessionEntity(
                        id = "PROV_KRISHNA_AGRI",
                        role = UserRole.EQUIPMENT_PROVIDER,
                        fullName = "Srinivasa Rao (Tractor & Harvester Services)",
                        mobile = "9988776655",
                        email = "srinivas.harvesters@example.com",
                        state = "Andhra Pradesh",
                        district = "Krishna",
                        mandal = "Gudivada",
                        village = "Mallayapalem",
                        preferredLanguage = _language.value,
                        isVerified = true
                    )
                    UserRole.ADMIN -> UserSessionEntity(
                        id = "ADMIN_DESK_OFFICER",
                        role = UserRole.ADMIN,
                        fullName = "Agricultural Department Officer",
                        mobile = "0863-2345678",
                        email = "admin.verification@yukti.gov.in",
                        state = "Andhra Pradesh",
                        district = "Amaravati",
                        mandal = "Thullur",
                        village = "Secretariat",
                        preferredLanguage = _language.value,
                        isVerified = true
                    )
                }
                repository.setSession(defaultSession)
            }
        }
    }

    // Weather State
    private val _weatherState = MutableStateFlow(WeatherUiState())
    val weatherState: StateFlow<WeatherUiState> = _weatherState.asStateFlow()

    fun loadWeather(lat: Double = 16.3067, lng: Double = 80.4365, locationName: String = "Guntur, Andhra Pradesh") {
        viewModelScope.launch {
            _weatherState.value = _weatherState.value.copy(isLoading = true, errorMessage = null, locationName = locationName)
            try {
                val resp = WeatherApiClient.api.getForecast(lat, lng)
                _weatherState.value = WeatherUiState(
                    isLoading = false,
                    current = resp.current,
                    daily = resp.daily,
                    locationName = locationName
                )
            } catch (e: Exception) {
                _weatherState.value = WeatherUiState(
                    isLoading = false,
                    current = null,
                    daily = null,
                    locationName = locationName,
                    errorMessage = e.localizedMessage ?: "Unable to fetch real-time weather"
                )
            }
        }
    }

    // Farmers Data
    val farmerLands: StateFlow<List<LandRecordEntity>> = activeSession.flatMapLatest { session ->
        val farmerId = session?.id ?: "FARMER_USER_1"
        repository.getLandsForFarmer(farmerId)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun saveLandSurvey(
        surveyNumber: String,
        state: String,
        district: String,
        mandal: String,
        village: String,
        totalAreaAcres: Double,
        soilType: String,
        irrigationType: String,
        boundaryJson: String,
        centerLat: Double,
        centerLng: Double,
        notes: String
    ) {
        viewModelScope.launch {
            val farmerId = activeSession.value?.id ?: "FARMER_USER_1"
            repository.saveLand(
                LandRecordEntity(
                    farmerId = farmerId,
                    surveyNumber = surveyNumber,
                    state = state,
                    district = district,
                    mandal = mandal,
                    village = village,
                    totalAreaAcres = totalAreaAcres,
                    soilType = soilType,
                    irrigationType = irrigationType,
                    boundaryPointsJson = boundaryJson,
                    centerLat = centerLat,
                    centerLng = centerLng,
                    notes = notes
                )
            )
            // Also update weather for farmer's land location
            loadWeather(centerLat, centerLng, "$village, $district")
        }
    }

    fun deleteLand(id: Long) {
        viewModelScope.launch { repository.deleteLand(id) }
    }

    // Products Data
    val approvedProducts: StateFlow<List<ProductEntity>> = repository.approvedProducts
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val adminAllProducts: StateFlow<List<ProductEntity>> = repository.allProductsForAdmin
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val companyProducts: StateFlow<List<ProductEntity>> = activeSession.flatMapLatest { session ->
        val companyId = session?.id ?: "COMP_COROMANDEL"
        repository.getProductsByCompany(companyId)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun saveProduct(
        productName: String,
        brandName: String,
        manufacturer: String,
        category: ProductCategory,
        productType: String,
        description: String,
        nutrientsJson: String,
        suitableCropsJson: String,
        cropStage: String,
        dosage: String,
        applicationMethod: String,
        packSizesJson: String,
        mrp: Double,
        companyDeclaredPrice: Double,
        effectiveDate: String,
        expiryDate: String,
        registrationNumber: String,
        regulatoryNotes: String
    ) {
        viewModelScope.launch {
            val session = activeSession.value
            val companyId = session?.id ?: "COMP_COROMANDEL"
            val companyName = session?.fullName ?: "Agricultural Company"

            repository.saveProduct(
                ProductEntity(
                    companyId = companyId,
                    companyName = companyName,
                    productName = productName,
                    brandName = brandName,
                    manufacturerName = manufacturer,
                    category = category,
                    productType = productType,
                    description = description,
                    nutrientsJson = nutrientsJson,
                    suitableCropsJson = suitableCropsJson,
                    cropStage = cropStage,
                    dosage = dosage,
                    applicationMethod = applicationMethod,
                    packSizesJson = packSizesJson,
                    mrp = mrp,
                    companyDeclaredPrice = companyDeclaredPrice,
                    effectiveDate = effectiveDate,
                    expiryDate = expiryDate,
                    registrationNumber = registrationNumber,
                    regulatoryNotes = regulatoryNotes,
                    verificationStatus = VerificationStatus.SUBMITTED
                )
            )
        }
    }

    fun verifyProduct(id: Long, status: VerificationStatus, feedback: String) {
        viewModelScope.launch {
            repository.updateProductVerification(id, status, feedback)
        }
    }

    // Stock Data
    val allStock: StateFlow<List<ShopStockEntity>> = repository.allStock
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addShopStock(
        productId: Long,
        productName: String,
        category: ProductCategory,
        shopName: String,
        shopAddress: String,
        district: String,
        mandal: String,
        village: String,
        contactPhone: String,
        packSize: String,
        quantity: Int,
        price: Double,
        status: StockStatus
    ) {
        viewModelScope.launch {
            val companyId = activeSession.value?.id ?: "COMP_COROMANDEL"
            repository.saveStock(
                ShopStockEntity(
                    companyId = companyId,
                    productId = productId,
                    productName = productName,
                    category = category,
                    shopName = shopName,
                    shopAddress = shopAddress,
                    district = district,
                    mandal = mandal,
                    village = village,
                    contactPhone = contactPhone,
                    packSize = packSize,
                    availableQuantity = quantity,
                    currentPrice = price,
                    status = status
                )
            )
        }
    }

    // Equipment Data
    val availableEquipment: StateFlow<List<EquipmentEntity>> = repository.availableEquipment
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val providerEquipment: StateFlow<List<EquipmentEntity>> = activeSession.flatMapLatest { session ->
        val providerId = session?.id ?: "PROV_KRISHNA_AGRI"
        repository.getEquipmentByProvider(providerId)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addEquipment(
        category: EquipmentCategory,
        nameModel: String,
        condition: String,
        specifications: String,
        serviceArea: String,
        district: String,
        village: String,
        rate: Double,
        pricingUnit: PricingUnit,
        dieselFuelTerms: String,
        operatorIncluded: Boolean,
        minHours: Int,
        transportCharges: Double,
        conditions: String,
        contactPhone: String
    ) {
        viewModelScope.launch {
            val session = activeSession.value
            val providerId = session?.id ?: "PROV_KRISHNA_AGRI"
            val providerName = session?.fullName ?: "Equipment Service Provider"
            repository.saveEquipment(
                EquipmentEntity(
                    providerId = providerId,
                    providerName = providerName,
                    category = category,
                    nameModel = nameModel,
                    condition = condition,
                    specifications = specifications,
                    serviceArea = serviceArea,
                    district = district,
                    village = village,
                    rate = rate,
                    pricingUnit = pricingUnit,
                    dieselFuelTerms = dieselFuelTerms,
                    operatorIncluded = operatorIncluded,
                    minBookingDuration = minHours,
                    transportationCharges = transportCharges,
                    additionalConditions = conditions,
                    contactPhone = contactPhone
                )
            )
        }
    }

    // Bookings Data
    val farmerBookings: StateFlow<List<EquipmentBookingEntity>> = activeSession.flatMapLatest { session ->
        val farmerId = session?.id ?: "FARMER_USER_1"
        repository.getBookingsForFarmer(farmerId)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val providerBookings: StateFlow<List<EquipmentBookingEntity>> = activeSession.flatMapLatest { session ->
        val providerId = session?.id ?: "PROV_KRISHNA_AGRI"
        repository.getBookingsForProvider(providerId)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun requestEquipmentBooking(
        equipment: EquipmentEntity,
        bookingDate: String,
        quantityOrAcres: Double,
        locationVillage: String,
        notes: String
    ) {
        viewModelScope.launch {
            val session = activeSession.value
            val farmerId = session?.id ?: "FARMER_USER_1"
            val farmerName = session?.fullName ?: "Farmer Ramesh"
            val farmerPhone = session?.mobile ?: "9848022334"

            val calculatedCost = (equipment.rate * quantityOrAcres) + equipment.transportationCharges
            repository.createBooking(
                EquipmentBookingEntity(
                    equipmentId = equipment.id,
                    equipmentName = equipment.nameModel,
                    category = equipment.category,
                    providerId = equipment.providerId,
                    providerName = equipment.providerName,
                    farmerId = farmerId,
                    farmerName = farmerName,
                    farmerPhone = farmerPhone,
                    bookingDate = bookingDate,
                    quantityOrAcres = quantityOrAcres,
                    pricingUnit = equipment.pricingUnit,
                    locationVillage = locationVillage,
                    estimatedTotalCost = calculatedCost,
                    dieselTermsSnapshot = equipment.dieselFuelTerms,
                    farmerNotes = notes,
                    status = BookingStatus.PENDING
                )
            )
        }
    }

    fun updateBookingStatus(booking: EquipmentBookingEntity, status: BookingStatus, notes: String) {
        viewModelScope.launch {
            repository.updateBookingStatus(
                id = booking.id,
                status = status,
                notes = notes,
                farmerId = booking.farmerId,
                equipmentName = booking.equipmentName
            )
        }
    }

    // Reviews Data
    fun getReviewsForTarget(type: ReviewTargetType, targetId: Long): Flow<List<ReviewEntity>> {
        return repository.getReviewsForTarget(type, targetId)
    }

    val reportedReviews: StateFlow<List<ReviewEntity>> = repository.reportedReviews
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun submitReview(
        targetType: ReviewTargetType,
        targetId: Long,
        targetName: String,
        rating: Int,
        reviewText: String,
        isVerified: Boolean = true
    ) {
        viewModelScope.launch {
            val session = activeSession.value
            repository.addReview(
                ReviewEntity(
                    targetType = targetType,
                    targetId = targetId,
                    targetName = targetName,
                    authorId = session?.id ?: "FARMER_USER_1",
                    authorName = session?.fullName ?: "Farmer",
                    authorRole = session?.role ?: UserRole.FARMER,
                    rating = rating.coerceIn(1, 5),
                    reviewText = reviewText,
                    isVerifiedPurchase = isVerified
                )
            )
        }
    }

    fun reportReview(id: Long) {
        viewModelScope.launch { repository.reportReview(id) }
    }

    fun deleteReview(id: Long) {
        viewModelScope.launch { repository.deleteReview(id) }
    }

    // Enquiries
    val userEnquiries: StateFlow<List<EnquiryEntity>> = activeSession.flatMapLatest { session ->
        val userId = session?.id ?: "FARMER_USER_1"
        if (session?.role == UserRole.FARMER) {
            repository.getEnquiriesForSender(userId)
        } else {
            repository.getEnquiriesForRecipient(userId)
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun sendEnquiry(
        recipientType: String,
        recipientId: String,
        recipientName: String,
        subject: String,
        message: String
    ) {
        viewModelScope.launch {
            val session = activeSession.value
            repository.sendEnquiry(
                EnquiryEntity(
                    recipientType = recipientType,
                    recipientId = recipientId,
                    recipientName = recipientName,
                    senderId = session?.id ?: "FARMER_USER_1",
                    senderName = session?.fullName ?: "Farmer",
                    senderPhone = session?.mobile ?: "9848022334",
                    subject = subject,
                    message = message
                )
            )
        }
    }

    fun replyToEnquiry(enquiry: EnquiryEntity, reply: String) {
        viewModelScope.launch {
            repository.replyToEnquiry(enquiry.id, reply, enquiry.senderId, enquiry.subject)
        }
    }

    // Notifications
    val notifications: StateFlow<List<NotificationEntity>> = activeSession.flatMapLatest { session ->
        val userId = session?.id ?: "FARMER_USER_1"
        repository.getNotificationsForUser(userId)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun markNotificationRead(id: Long) {
        viewModelScope.launch { repository.markNotificationRead(id) }
    }

    // Companies & Verification
    val allCompanies: StateFlow<List<CompanyEntity>> = repository.allCompanies
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun verifyCompany(companyId: String, status: VerificationStatus, feedback: String) {
        viewModelScope.launch { repository.updateCompanyVerification(companyId, status, feedback) }
    }

    // Audit Logs
    val auditLogs: StateFlow<List<AuditLogEntity>> = repository.auditLogs
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // AI Assistant Messages
    private val _aiMessages = MutableStateFlow<List<AiMessage>>(emptyList())
    val aiMessages: StateFlow<List<AiMessage>> = _aiMessages.asStateFlow()

    private val _isAiLoading = MutableStateFlow(false)
    val isAiLoading: StateFlow<Boolean> = _isAiLoading.asStateFlow()

    fun askAiAssistant(question: String) {
        val userMsg = AiMessage(sender = "user", text = question)
        _aiMessages.value = _aiMessages.value + userMsg
        _isAiLoading.value = true

        viewModelScope.launch {
            val session = activeSession.value
            val lands = farmerLands.value
            val landSummary = if (lands.isNotEmpty()) {
                val l = lands.first()
                "Farmer Land: ${l.totalAreaAcres} acres in ${l.village}, ${l.district}, ${l.state}. Soil: ${l.soilType}, Irrigation: ${l.irrigationType}."
            } else {
                "Farmer Location: ${session?.village ?: "Guntur"}, ${session?.district ?: "Andhra Pradesh"}."
            }
            val weatherSummary = _weatherState.value.current?.let {
                "Current Weather: Temp ${it.temperature}°C, Humidity ${it.humidity}%, Rain ${it.precipitation} mm, Wind ${it.windSpeed} km/h."
            } ?: "Weather data not loaded yet."

            val context = "$landSummary $weatherSummary"
            val responseText = GeminiApiClient.askAssistant(
                prompt = question,
                farmerContext = context,
                language = _language.value
            )

            _aiMessages.value = _aiMessages.value + AiMessage(sender = "yukti_ai", text = responseText)
            _isAiLoading.value = false
        }
    }

    init {
        // Load default weather on startup
        loadWeather()
    }
}
