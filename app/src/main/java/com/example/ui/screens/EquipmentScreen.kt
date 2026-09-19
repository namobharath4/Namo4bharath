package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.draw.clip
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
fun EquipmentScreen(
    language: String,
    equipmentList: List<EquipmentEntity>,
    farmerBookings: List<EquipmentBookingEntity>,
    onRequestBooking: (equipment: EquipmentEntity, date: String, qty: Double, village: String, notes: String) -> Unit,
    modifier: Modifier = Modifier
) {
    val isTe = language == "te"

    var selectedTab by remember { mutableStateOf(0) } // 0: Available Machinery, 1: My Bookings
    var selectedCategory by remember { mutableStateOf<EquipmentCategory?>(null) }
    var selectedEquipmentForBooking by remember { mutableStateOf<EquipmentEntity?>(null) }

    val filteredEquipment = remember(equipmentList, selectedCategory) {
        if (selectedCategory == null) equipmentList
        else equipmentList.filter { it.category == selectedCategory }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = if (isTe) "వ్యవసాయ యంత్రాలు & సేవల అద్దె" else "Farm Equipment & Skilled Labour",
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
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
                    text = { Text(if (isTe) "యంత్రాల మార్కెట్" else "Machinery Market", fontWeight = FontWeight.Bold) }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(if (isTe) "నా బుకింగ్స్" else "My Bookings", fontWeight = FontWeight.Bold)
                            if (farmerBookings.isNotEmpty()) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Surface(
                                    color = AgriGreenPrimary,
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text(
                                        text = "${farmerBookings.size}",
                                        color = Color.White,
                                        style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp),
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }
                        }
                    }
                )
            }

            if (selectedTab == 0) {
                // Category Filter Row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    FilterChip(
                        selected = selectedCategory == null,
                        onClick = { selectedCategory = null },
                        label = { Text(YuktiStrings.get("filter_all", language)) }
                    )
                    FilterChip(
                        selected = selectedCategory == EquipmentCategory.TRACTOR,
                        onClick = { selectedCategory = EquipmentCategory.TRACTOR },
                        label = { Text(YuktiStrings.get("equipment_tractor", language)) }
                    )
                    FilterChip(
                        selected = selectedCategory == EquipmentCategory.HARVESTER,
                        onClick = { selectedCategory = EquipmentCategory.HARVESTER },
                        label = { Text(YuktiStrings.get("equipment_harvester", language)) }
                    )
                    FilterChip(
                        selected = selectedCategory == EquipmentCategory.ROTAVATOR,
                        onClick = { selectedCategory = EquipmentCategory.ROTAVATOR },
                        label = { Text(YuktiStrings.get("equipment_rotavator", language)) }
                    )
                }

                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp),
                    contentPadding = PaddingValues(top = 4.dp, bottom = 90.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (filteredEquipment.isEmpty()) {
                        item {
                            EmptyStateCard(
                                icon = Icons.Default.PrecisionManufacturing,
                                title = YuktiStrings.get("empty_equipment", language),
                                description = if (isTe)
                                    "ట్రాక్టర్లు మరియు హార్వెస్టర్ సర్వీస్ ప్రొవైడర్లు తమ పరికరాలను నమోదు చేసినప్పుడు ఇక్కడ కనిపిస్తాయి."
                                else
                                    "Equipment owners in your district will appear here once listed."
                            )
                        }
                    } else {
                        items(filteredEquipment, key = { it.id }) { equip ->
                            EquipmentCard(
                                equip = equip,
                                language = language,
                                onBookClick = { selectedEquipmentForBooking = equip }
                            )
                        }
                    }
                }
            } else {
                // My Bookings Tab
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp),
                    contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (farmerBookings.isEmpty()) {
                        item {
                            EmptyStateCard(
                                icon = Icons.Default.EventNote,
                                title = YuktiStrings.get("empty_bookings", language),
                                description = if (isTe)
                                    "మీరు ఏ యంత్రాన్ని అయినా బుక్ చేసుకున్నప్పుడు దాని స్థితి ఇక్కడ కనిపిస్తుంది."
                                else
                                    "Track the status of your requested tractors, harvesters, and labour services here."
                            )
                        }
                    } else {
                        items(farmerBookings, key = { it.id }) { booking ->
                            BookingStatusCard(booking = booking, language = language)
                        }
                    }
                }
            }
        }
    }

    selectedEquipmentForBooking?.let { equip ->
        BookingRequestDialog(
            equipment = equip,
            language = language,
            onDismiss = { selectedEquipmentForBooking = null },
            onSubmit = { date, qty, village, notes ->
                onRequestBooking(equip, date, qty, village, notes)
                selectedEquipmentForBooking = null
                selectedTab = 1 // Switch to bookings
            }
        )
    }
}

@Composable
fun EquipmentCard(
    equip: EquipmentEntity,
    language: String,
    onBookClick: () -> Unit
) {
    val isTe = language == "te"

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Surface(
                    color = HarvestGoldContainer,
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        text = equip.category.name,
                        color = HarvestGoldOnContainer,
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }

                Text(
                    text = "₹${equip.rate} / ${equip.pricingUnit.name.lowercase()}",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.ExtraBold, color = AgriGreenPrimary)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = equip.nameModel,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )
            Text(
                text = "${equip.providerName} • ${equip.village}, ${equip.district}",
                style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
            )

            Spacer(modifier = Modifier.height(10.dp))
            // Key Terms: Diesel Condition & Operator
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Surface(
                    color = Color(0xFFFFF3E0),
                    shape = RoundedCornerShape(6.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Row(modifier = Modifier.padding(6.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.LocalGasStation, contentDescription = null, tint = Color(0xFFE65100), modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = equip.dieselFuelTerms,
                            style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp, fontWeight = FontWeight.SemiBold),
                            maxLines = 1
                        )
                    }
                }
                Surface(
                    color = Color(0xFFE8F5E9),
                    shape = RoundedCornerShape(6.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Row(modifier = Modifier.padding(6.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Person, contentDescription = null, tint = AgriGreenPrimary, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (equip.operatorIncluded) YuktiStrings.get("operator_included", language) else YuktiStrings.get("operator_excluded", language),
                            style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp, fontWeight = FontWeight.SemiBold)
                        )
                    }
                }
            }

            if (equip.transportationCharges > 0) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${if (isTe) "రవాణా చార్జీ: " else "Transport charges: "}₹${equip.transportationCharges}",
                    style = MaterialTheme.typography.labelSmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Phone, contentDescription = null, tint = AgriGreenPrimary, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = equip.contactPhone, style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold))
                }

                Button(
                    onClick = onBookClick,
                    colors = ButtonDefaults.buttonColors(containerColor = AgriGreenPrimary),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(Icons.Default.BookmarkBorder, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(YuktiStrings.get("btn_book_now", language), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
fun BookingStatusCard(
    booking: EquipmentBookingEntity,
    language: String
) {
    val isTe = language == "te"
    val (statusLabel, statusColor) = when (booking.status) {
        BookingStatus.PENDING -> Pair(if (isTe) "నిరీక్షణలో ఉంది (PENDING)" else "Pending Confirmation", Color(0xFFF57F17))
        BookingStatus.ACCEPTED -> Pair(if (isTe) "ఆమోదించబడింది (ACCEPTED)" else "Accepted by Provider", Color(0xFF2E7D32))
        BookingStatus.REJECTED -> Pair(if (isTe) "తిరస్కరించబడింది (REJECTED)" else "Declined", Color(0xFFC62828))
        BookingStatus.COMPLETED -> Pair(if (isTe) "పూర్తయింది (COMPLETED)" else "Completed", Color(0xFF1565C0))
        BookingStatus.CANCELLED -> Pair(if (isTe) "రద్దు చేయబడింది" else "Cancelled", Color.Gray)
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Surface(
                    color = statusColor.copy(alpha = 0.12f),
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        text = statusLabel,
                        color = statusColor,
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
                Text(
                    text = "₹${booking.estimatedTotalCost}",
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold, color = AgriGreenPrimary)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = booking.equipmentName,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )
            Text(
                text = "${if (isTe) "సేవా ప్రదాత: " else "Provider: "}${booking.providerName}",
                style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
            )

            Spacer(modifier = Modifier.height(6.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Text(
                    text = "${if (isTe) "తేదీ: " else "Date: "}${booking.bookingDate}",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold)
                )
                Text(
                    text = "${if (isTe) "పరిమాణం: " else "Requirement: "}${booking.quantityOrAcres} ${booking.pricingUnit.name.lowercase()}",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold)
                )
            }

            if (booking.providerResponseNotes.isNotBlank()) {
                Spacer(modifier = Modifier.height(8.dp))
                Surface(
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "${if (isTe) "ప్రొవైడర్ సమాధానం: " else "Provider Notes: "}${booking.providerResponseNotes}",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium),
                        modifier = Modifier.padding(8.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun BookingRequestDialog(
    equipment: EquipmentEntity,
    language: String,
    onDismiss: () -> Unit,
    onSubmit: (date: String, qty: Double, village: String, notes: String) -> Unit
) {
    val isTe = language == "te"

    var dateInput by remember { mutableStateOf("2025-05-10") }
    var qtyInput by remember { mutableStateOf("2.0") }
    var villageInput by remember { mutableStateOf("Kolanukonda") }
    var notesInput by remember { mutableStateOf("") }

    val qty = qtyInput.toDoubleOrNull() ?: 1.0
    val calculatedTotal = (equipment.rate * qty) + equipment.transportationCharges

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Column {
                Text(YuktiStrings.get("btn_book_now", language), fontWeight = FontWeight.Bold)
                Text(equipment.nameModel, style = MaterialTheme.typography.labelMedium.copy(color = AgriGreenPrimary))
            }
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = dateInput,
                    onValueChange = { dateInput = it },
                    label = { Text(if (isTe) "అవసరమైన తేదీ" else "Required Date") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = qtyInput,
                    onValueChange = { qtyInput = it },
                    label = { Text("${if (isTe) "పరిమాణం" else "Duration / Quantity"} (${equipment.pricingUnit.name.lowercase()})") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = villageInput,
                    onValueChange = { villageInput = it },
                    label = { Text(YuktiStrings.get("village_label", language)) },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = notesInput,
                    onValueChange = { notesInput = it },
                    label = { Text(if (isTe) "రైతు సూచనలు" else "Additional Instructions") },
                    modifier = Modifier.fillMaxWidth()
                )

                // Cost Breakdown Snapshot
                Surface(
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(if (isTe) "యంత్ర రేటు:" else "Machinery Rate:", style = MaterialTheme.typography.bodySmall)
                            Text("₹${equipment.rate} x $qty", style = MaterialTheme.typography.bodySmall)
                        }
                        if (equipment.transportationCharges > 0) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(if (isTe) "రవాణా చార్జీలు:" else "Transport Fee:", style = MaterialTheme.typography.bodySmall)
                                Text("₹${equipment.transportationCharges}", style = MaterialTheme.typography.bodySmall)
                            }
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(if (isTe) "డీజిల్ నిబంధన:" else "Fuel Condition:", style = MaterialTheme.typography.bodySmall)
                            Text(equipment.dieselFuelTerms, style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold))
                        }
                        Divider(modifier = Modifier.padding(vertical = 4.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(if (isTe) "అంచనా మొత్తం:" else "Estimated Total:", fontWeight = FontWeight.Bold)
                            Text("₹$calculatedTotal", fontWeight = FontWeight.Bold, color = AgriGreenPrimary)
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = { onSubmit(dateInput, qty, villageInput, notesInput) },
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
