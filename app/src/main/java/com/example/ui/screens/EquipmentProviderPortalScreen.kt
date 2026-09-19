package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.models.*
import com.example.ui.components.EmptyStateCard
import com.example.ui.i18n.YuktiStrings
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EquipmentProviderPortalScreen(
    language: String,
    session: UserSessionEntity?,
    providerEquipment: List<EquipmentEntity>,
    providerBookings: List<EquipmentBookingEntity>,
    onAddEquipment: (
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
    ) -> Unit,
    onUpdateBookingStatus: (booking: EquipmentBookingEntity, status: BookingStatus, notes: String) -> Unit,
    modifier: Modifier = Modifier
) {
    val isTe = language == "te"
    var selectedTab by remember { mutableStateOf(0) } // 0: Booking Requests, 1: Listed Machinery
    var showAddDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = session?.fullName ?: (if (isTe) "యంత్రాల సేవా పోర్టల్" else "Equipment Service Portal"),
                            fontWeight = FontWeight.Bold,
                            maxLines = 1
                        )
                        Text(
                            text = "${session?.village ?: "Gudivada"}, ${session?.district ?: "Krishna"} (Service Area: 25 km)",
                            style = MaterialTheme.typography.labelSmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        floatingActionButton = {
            if (selectedTab == 1) {
                FloatingActionButton(
                    onClick = { showAddDialog = true },
                    containerColor = AgriGreenPrimary,
                    contentColor = Color.White
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Add Equipment")
                }
            }
        },
        modifier = modifier
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = MaterialTheme.colorScheme.surface
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(if (isTe) "రైతుల బుకింగ్ అభ్యర్థనలు" else "Booking Requests", fontWeight = FontWeight.Bold)
                            val pendingCount = providerBookings.count { it.status == BookingStatus.PENDING }
                            if (pendingCount > 0) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Surface(
                                    color = Color(0xFFE65100),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text(
                                        text = "$pendingCount",
                                        color = Color.White,
                                        style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp),
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }
                        }
                    }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text(if (isTe) "నా యంత్రాలు (${providerEquipment.size})" else "My Machinery (${providerEquipment.size})", fontWeight = FontWeight.Bold) }
                )
            }

            if (selectedTab == 0) {
                // Incoming Bookings Manager
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp),
                    contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (providerBookings.isEmpty()) {
                        item {
                            EmptyStateCard(
                                icon = Icons.Default.EventAvailable,
                                title = if (isTe) "ఇంకా బుకింగ్ అభ్యర్థనలు రాలేదు" else "No Booking Requests Yet",
                                description = if (isTe)
                                    "రైతులు మీ ట్రాక్టర్ లేదా హార్వెస్టర్ కోసం అభ్యర్థన పంపినప్పుడు ఇక్కడ కనిపిస్తుంది."
                                else
                                    "Incoming farmer booking orders will appear here for review and acceptance."
                            )
                        }
                    } else {
                        items(providerBookings, key = { it.id }) { booking ->
                            ProviderBookingRequestCard(
                                booking = booking,
                                language = language,
                                onUpdateStatus = { status, notes ->
                                    onUpdateBookingStatus(booking, status, notes)
                                }
                            )
                        }
                    }
                }
            } else {
                // Machinery List
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp),
                    contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (providerEquipment.isEmpty()) {
                        item {
                            EmptyStateCard(
                                icon = Icons.Default.PrecisionManufacturing,
                                title = if (isTe) "యంత్రాలు ఏవీ చేర్చబడలేదు" else "No Machinery Listed",
                                description = if (isTe)
                                    "మీ వద్ద ఉన్న ట్రాక్టర్లు, హార్వెస్టర్లు మరియు రోటవేటర్లను జోడించి రైతుల నుండి బుకింగ్‌లను పొందండి."
                                else
                                    "List your agricultural machinery and set rental rates to receive bookings from local farmers.",
                                actionButtonText = if (isTe) "యంత్రాన్ని నమోదు చేయండి" else "Add Machinery",
                                onActionClick = { showAddDialog = true }
                            )
                        }
                    } else {
                        items(providerEquipment, key = { it.id }) { equip ->
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(14.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                            ) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(equip.category.name, style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = AgriGreenPrimary))
                                        Text("₹${equip.rate} / ${equip.pricingUnit.name.lowercase()}", fontWeight = FontWeight.ExtraBold, color = AgriGreenPrimary)
                                    }
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(equip.nameModel, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                                    Text("${equip.dieselFuelTerms} • ${if (equip.operatorIncluded) "Driver Included" else "Driver Excluded"}", style = MaterialTheme.typography.bodySmall)
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text("Service Area: ${equip.serviceArea} • Phone: ${equip.contactPhone}", style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant))
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AddEquipmentDialog(
            language = language,
            onDismiss = { showAddDialog = false },
            onSubmit = { cat, model, cond, specs, area, dist, vill, rate, unit, fuel, op, min, trans, notes, phone ->
                onAddEquipment(cat, model, cond, specs, area, dist, vill, rate, unit, fuel, op, min, trans, notes, phone)
                showAddDialog = false
            }
        )
    }
}

@Composable
fun ProviderBookingRequestCard(
    booking: EquipmentBookingEntity,
    language: String,
    onUpdateStatus: (BookingStatus, String) -> Unit
) {
    val isTe = language == "te"
    var showResponseInput by remember { mutableStateOf(false) }
    var notesText by remember { mutableStateOf("") }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    color = when (booking.status) {
                        BookingStatus.PENDING -> Color(0xFFFFF3CD)
                        BookingStatus.ACCEPTED -> Color(0xFFE8F5E9)
                        BookingStatus.REJECTED -> Color(0xFFFFEBEE)
                        BookingStatus.COMPLETED -> Color(0xFFE1F5FE)
                        BookingStatus.CANCELLED -> Color(0xFFEEEEEE)
                    },
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        text = booking.status.name,
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
                Text("Est. ₹${booking.estimatedTotalCost}", fontWeight = FontWeight.Bold, color = AgriGreenPrimary)
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(booking.equipmentName, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
            Text("Farmer: ${booking.farmerName} (${booking.farmerPhone})", style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold))
            Text("Location: ${booking.locationVillage} • Date: ${booking.bookingDate}", style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant))
            Text("Requirement: ${booking.quantityOrAcres} ${booking.pricingUnit.name.lowercase()} • Diesel: ${booking.dieselTermsSnapshot}", style = MaterialTheme.typography.bodySmall)

            if (booking.farmerNotes.isNotBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text("Farmer Note: ${booking.farmerNotes}", style = MaterialTheme.typography.bodySmall.copy(color = SoilBrown))
            }

            if (booking.status == BookingStatus.PENDING) {
                Spacer(modifier = Modifier.height(10.dp))
                if (showResponseInput) {
                    OutlinedTextField(
                        value = notesText,
                        onValueChange = { notesText = it },
                        label = { Text(if (isTe) "రైతుకు సమాధాన గమనిక" else "Notes to Farmer") },
                        placeholder = { Text("e.g. Will arrive by 8:00 AM morning.") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = { onUpdateStatus(BookingStatus.ACCEPTED, notesText) },
                            colors = ButtonDefaults.buttonColors(containerColor = AgriGreenPrimary),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(YuktiStrings.get("btn_approve", language))
                        }
                        Button(
                            onClick = { onUpdateStatus(BookingStatus.REJECTED, notesText) },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFC62828)),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(YuktiStrings.get("btn_reject", language))
                        }
                    }
                } else {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = { showResponseInput = true },
                            colors = ButtonDefaults.buttonColors(containerColor = AgriGreenPrimary),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(if (isTe) "సమీక్షించండి & నిర్ణయించండి" else "Review Request")
                        }
                    }
                }
            } else if (booking.status == BookingStatus.ACCEPTED) {
                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = { onUpdateStatus(BookingStatus.COMPLETED, "Work successfully completed.") },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0277BD)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.DoneAll, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(if (isTe) "పని పూర్తయినట్లు మార్క్ చేయండి" else "Mark Work as Completed")
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEquipmentDialog(
    language: String,
    onDismiss: () -> Unit,
    onSubmit: (
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
    ) -> Unit
) {
    val isTe = language == "te"

    var category by remember { mutableStateOf(EquipmentCategory.TRACTOR) }
    var nameModel by remember { mutableStateOf("") }
    var rateInput by remember { mutableStateOf("1200") }
    var pricingUnit by remember { mutableStateOf(PricingUnit.PER_HOUR) }
    var dieselTerms by remember { mutableStateOf(if (isTe) "రైతు డీజిల్ సమకూర్చాలి" else "Farmer provides diesel") }
    var operatorIncluded by remember { mutableStateOf(true) }
    var transportInput by remember { mutableStateOf("200") }
    var phone by remember { mutableStateOf("9988776655") }
    var serviceArea by remember { mutableStateOf("Within 20 km radius") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(if (isTe) "కొత్త యంత్రం నమోదు" else "Register Machinery", fontWeight = FontWeight.Bold) },
        text = {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 440.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    OutlinedTextField(
                        value = nameModel,
                        onValueChange = { nameModel = it },
                        label = { Text(if (isTe) "యంత్రం పేరు & మోడల్" else "Machine Name & Model") },
                        placeholder = { Text("e.g. Mahindra 575 DI (45 HP)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = category == EquipmentCategory.TRACTOR,
                            onClick = { category = EquipmentCategory.TRACTOR },
                            label = { Text(YuktiStrings.get("equipment_tractor", language)) }
                        )
                        FilterChip(
                            selected = category == EquipmentCategory.HARVESTER,
                            onClick = { category = EquipmentCategory.HARVESTER },
                            label = { Text(YuktiStrings.get("equipment_harvester", language)) }
                        )
                        FilterChip(
                            selected = category == EquipmentCategory.ROTAVATOR,
                            onClick = { category = EquipmentCategory.ROTAVATOR },
                            label = { Text(YuktiStrings.get("equipment_rotavator", language)) }
                        )
                    }
                }
                item {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = rateInput,
                            onValueChange = { rateInput = it },
                            label = { Text(if (isTe) "అద్దె రేటు (₹)" else "Rate (₹)") },
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = transportInput,
                            onValueChange = { transportInput = it },
                            label = { Text(if (isTe) "రవాణా చార్జీ (₹)" else "Transport (₹)") },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
                item {
                    OutlinedTextField(
                        value = dieselTerms,
                        onValueChange = { dieselTerms = it },
                        label = { Text(YuktiStrings.get("fuel_terms_label", language)) },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(checked = operatorIncluded, onCheckedChange = { operatorIncluded = it })
                        Text(YuktiStrings.get("operator_included", language), style = MaterialTheme.typography.bodyMedium)
                    }
                }
                item {
                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        label = { Text(if (isTe) "సంప్రదింపు ఫోన్" else "Phone Number") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (nameModel.isNotBlank()) {
                        onSubmit(
                            category, nameModel, "Good Condition", "Heavy duty agricultural equipment",
                            serviceArea, "Krishna", "Gudivada",
                            rateInput.toDoubleOrNull() ?: 1200.0, pricingUnit,
                            dieselTerms, operatorIncluded, 1,
                            transportInput.toDoubleOrNull() ?: 200.0,
                            "Standard safety terms apply", phone
                        )
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = AgriGreenPrimary)
            ) {
                Text(YuktiStrings.get("submit", language))
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(YuktiStrings.get("cancel", language))
            }
        }
    )
}
