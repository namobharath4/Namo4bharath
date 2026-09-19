package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.data.DatabaseSeeder
import com.example.data.models.UserRole
import com.example.ui.YuktiViewModel
import com.example.ui.components.YuktiHeader
import com.example.ui.i18n.YuktiStrings
import com.example.ui.screens.*
import com.example.ui.theme.AgriGreenPrimary
import com.example.ui.theme.MyApplicationTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                YuktiApp()
            }
        }
    }
}

@Composable
fun YuktiApp(viewModel: YuktiViewModel = viewModel()) {
    val language by viewModel.language.collectAsStateWithLifecycle()
    val currentRole by viewModel.currentRole.collectAsStateWithLifecycle()
    val activeSession by viewModel.activeSession.collectAsStateWithLifecycle()
    val weatherState by viewModel.weatherState.collectAsStateWithLifecycle()
    val farmerLands by viewModel.farmerLands.collectAsStateWithLifecycle()
    val approvedProducts by viewModel.approvedProducts.collectAsStateWithLifecycle()
    val companyProducts by viewModel.companyProducts.collectAsStateWithLifecycle()
    val adminAllProducts by viewModel.adminAllProducts.collectAsStateWithLifecycle()
    val allStock by viewModel.allStock.collectAsStateWithLifecycle()
    val availableEquipment by viewModel.availableEquipment.collectAsStateWithLifecycle()
    val providerEquipment by viewModel.providerEquipment.collectAsStateWithLifecycle()
    val farmerBookings by viewModel.farmerBookings.collectAsStateWithLifecycle()
    val providerBookings by viewModel.providerBookings.collectAsStateWithLifecycle()
    val aiMessages by viewModel.aiMessages.collectAsStateWithLifecycle()
    val isAiLoading by viewModel.isAiLoading.collectAsStateWithLifecycle()
    val allCompanies by viewModel.allCompanies.collectAsStateWithLifecycle()
    val auditLogs by viewModel.auditLogs.collectAsStateWithLifecycle()
    val reportedReviews by viewModel.reportedReviews.collectAsStateWithLifecycle()
    val userEnquiries by viewModel.userEnquiries.collectAsStateWithLifecycle()

    var currentScreen by remember { mutableStateOf("home") }
    val scope = rememberCoroutineScope()

    // Auto-seed initial realistic database on startup
    LaunchedEffect(Unit) {
        DatabaseSeeder.seedIfEmpty(viewModel.repository)
    }

    // Role changes automatically redirect to suitable landing views
    LaunchedEffect(currentRole) {
        currentScreen = when (currentRole) {
            UserRole.FARMER -> "home"
            UserRole.COMPANY -> "company_portal"
            UserRole.EQUIPMENT_PROVIDER -> "provider_portal"
            UserRole.ADMIN -> "admin_desk"
        }
    }

    val isTe = language == "te"

    Scaffold(
        topBar = {
            YuktiHeader(
                currentRole = currentRole,
                language = language,
                onRoleSelect = { role -> viewModel.selectRole(role) },
                onToggleLanguage = { viewModel.toggleLanguage() }
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp
            ) {
                when (currentRole) {
                    UserRole.FARMER -> {
                        NavigationBarItem(
                            selected = currentScreen == "home",
                            onClick = { currentScreen = "home" },
                            icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                            label = { Text(YuktiStrings.get("nav_home", language)) },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                        NavigationBarItem(
                            selected = currentScreen == "land_survey",
                            onClick = { currentScreen = "land_survey" },
                            icon = { Icon(Icons.Default.Landscape, contentDescription = "Land") },
                            label = { Text(YuktiStrings.get("nav_myland", language)) },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                        NavigationBarItem(
                            selected = currentScreen == "products",
                            onClick = { currentScreen = "products" },
                            icon = { Icon(Icons.Default.Inventory2, contentDescription = "Products") },
                            label = { Text(YuktiStrings.get("nav_products", language)) },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                        NavigationBarItem(
                            selected = currentScreen == "equipment",
                            onClick = { currentScreen = "equipment" },
                            icon = { Icon(Icons.Default.Build, contentDescription = "Equipment") },
                            label = { Text(YuktiStrings.get("nav_equipment", language)) },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                        NavigationBarItem(
                            selected = currentScreen == "ai_assistant",
                            onClick = { currentScreen = "ai_assistant" },
                            icon = { Icon(Icons.Default.AutoAwesome, contentDescription = "AI") },
                            label = { Text(YuktiStrings.get("nav_ai", language)) },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                    }
                    UserRole.COMPANY -> {
                        NavigationBarItem(
                            selected = currentScreen == "company_portal",
                            onClick = { currentScreen = "company_portal" },
                            icon = { Icon(Icons.Default.Business, contentDescription = "Portal") },
                            label = { Text(if (isTe) "కంపెనీ" else "Products") },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                        NavigationBarItem(
                            selected = currentScreen == "stock",
                            onClick = { currentScreen = "stock" },
                            icon = { Icon(Icons.Default.Storefront, contentDescription = "Stock") },
                            label = { Text(YuktiStrings.get("nav_stock", language)) },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                        NavigationBarItem(
                            selected = currentScreen == "ai_assistant",
                            onClick = { currentScreen = "ai_assistant" },
                            icon = { Icon(Icons.Default.AutoAwesome, contentDescription = "AI") },
                            label = { Text(YuktiStrings.get("nav_ai", language)) },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                    }
                    UserRole.EQUIPMENT_PROVIDER -> {
                        NavigationBarItem(
                            selected = currentScreen == "provider_portal",
                            onClick = { currentScreen = "provider_portal" },
                            icon = { Icon(Icons.Default.Build, contentDescription = "Portal") },
                            label = { Text(if (isTe) "బుకింగ్స్" else "Bookings") },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                        NavigationBarItem(
                            selected = currentScreen == "equipment",
                            onClick = { currentScreen = "equipment" },
                            icon = { Icon(Icons.Default.PrecisionManufacturing, contentDescription = "Market") },
                            label = { Text(if (isTe) "మార్కెట్" else "Market") },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                        NavigationBarItem(
                            selected = currentScreen == "ai_assistant",
                            onClick = { currentScreen = "ai_assistant" },
                            icon = { Icon(Icons.Default.AutoAwesome, contentDescription = "AI") },
                            label = { Text(YuktiStrings.get("nav_ai", language)) },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                    }
                    UserRole.ADMIN -> {
                        NavigationBarItem(
                            selected = currentScreen == "admin_desk",
                            onClick = { currentScreen = "admin_desk" },
                            icon = { Icon(Icons.Default.AdminPanelSettings, contentDescription = "Admin") },
                            label = { Text(YuktiStrings.get("nav_admin", language)) },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                        NavigationBarItem(
                            selected = currentScreen == "products",
                            onClick = { currentScreen = "products" },
                            icon = { Icon(Icons.Default.Inventory2, contentDescription = "Products") },
                            label = { Text(YuktiStrings.get("nav_products", language)) },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                        NavigationBarItem(
                            selected = currentScreen == "ai_assistant",
                            onClick = { currentScreen = "ai_assistant" },
                            icon = { Icon(Icons.Default.AutoAwesome, contentDescription = "AI") },
                            label = { Text(YuktiStrings.get("nav_ai", language)) },
                            colors = NavigationBarItemDefaults.colors(selectedIconColor = AgriGreenPrimary, indicatorColor = AgriGreenPrimary.copy(alpha = 0.15f))
                        )
                    }
                }
            }
        },
        modifier = Modifier.fillMaxSize()
    ) { innerPadding ->
        Box(modifier = Modifier.fillMaxSize().padding(innerPadding)) {
            when (currentScreen) {
                "home" -> HomeScreen(
                    language = language,
                    currentRole = currentRole,
                    weatherState = weatherState,
                    onNavigateTo = { dest -> currentScreen = dest },
                    onSelectRole = { role -> viewModel.selectRole(role) }
                )
                "land_survey" -> LandSurveyScreen(
                    language = language,
                    lands = farmerLands,
                    onSaveLand = { surveyNumber, state, district, mandal, village, acres, soil, irrigation, boundaryJson, lat, lng, notes ->
                        viewModel.saveLandSurvey(surveyNumber, state, district, mandal, village, acres, soil, irrigation, boundaryJson, lat, lng, notes)
                    },
                    onDeleteLand = { id -> viewModel.deleteLand(id) }
                )
                "farming_insights" -> FarmingInsightsScreen(
                    language = language,
                    weatherState = weatherState,
                    farmerLands = farmerLands,
                    onRefreshWeather = { viewModel.loadWeather() }
                )
                "products" -> ProductsScreen(
                    language = language,
                    products = approvedProducts,
                    onSendEnquiry = { recipientType, recipientId, recipientName, subject, message ->
                        viewModel.sendEnquiry(recipientType, recipientId, recipientName, subject, message)
                    }
                )
                "stock" -> StockScreen(
                    language = language,
                    stocks = allStock
                )
                "equipment" -> EquipmentScreen(
                    language = language,
                    equipmentList = availableEquipment,
                    farmerBookings = farmerBookings,
                    onRequestBooking = { equip, date, qty, village, notes ->
                        viewModel.requestEquipmentBooking(equip, date, qty, village, notes)
                    }
                )
                "savings" -> SavingsCalculatorScreen(
                    language = language
                )
                "ai_assistant" -> AiAssistantScreen(
                    language = language,
                    messages = aiMessages,
                    isLoading = isAiLoading,
                    onSendMessage = { question -> viewModel.askAiAssistant(question) }
                )
                "company_portal" -> CompanyPortalScreen(
                    language = language,
                    session = activeSession,
                    companyProducts = companyProducts,
                    enquiries = userEnquiries,
                    onAddProduct = { name, brand, mfg, cat, type, desc, nut, crops, stage, dosage, method, packs, mrp, price, eff, exp, reg, notes ->
                        viewModel.saveProduct(name, brand, mfg, cat, type, desc, nut, crops, stage, dosage, method, packs, mrp, price, eff, exp, reg, notes)
                    },
                    onAddStock = { pId, pName, cat, shop, addr, dist, mand, vill, phone, pack, qty, price, status ->
                        viewModel.addShopStock(pId, pName, cat, shop, addr, dist, mand, vill, phone, pack, qty, price, status)
                    },
                    onReplyEnquiry = { enq, reply ->
                        viewModel.replyToEnquiry(enq, reply)
                    }
                )
                "provider_portal" -> EquipmentProviderPortalScreen(
                    language = language,
                    session = activeSession,
                    providerEquipment = providerEquipment,
                    providerBookings = providerBookings,
                    onAddEquipment = { cat, model, cond, specs, area, dist, vill, rate, unit, fuel, op, min, trans, notes, phone ->
                        viewModel.addEquipment(cat, model, cond, specs, area, dist, vill, rate, unit, fuel, op, min, trans, notes, phone)
                    },
                    onUpdateBookingStatus = { booking, status, notes ->
                        viewModel.updateBookingStatus(booking, status, notes)
                    }
                )
                "admin_desk" -> AdminDeskScreen(
                    language = language,
                    companies = allCompanies,
                    products = adminAllProducts,
                    reportedReviews = reportedReviews,
                    auditLogs = auditLogs,
                    onVerifyCompany = { compId, status, feedback ->
                        viewModel.verifyCompany(compId, status, feedback)
                    },
                    onVerifyProduct = { prodId, status, feedback ->
                        viewModel.verifyProduct(prodId, status, feedback)
                    },
                    onModerateReview = { revId, delete ->
                        if (delete) viewModel.deleteReview(revId)
                        else viewModel.reportReview(revId)
                    }
                )
            }
        }
    }
}
