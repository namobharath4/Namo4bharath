package com.example.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.models.LandRecordEntity
import com.example.ui.components.EmptyStateCard
import com.example.ui.i18n.YuktiStrings
import com.example.ui.theme.*
import kotlin.math.abs

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LandSurveyScreen(
    language: String,
    lands: List<LandRecordEntity>,
    onSaveLand: (
        surveyNumber: String,
        state: String,
        district: String,
        mandal: String,
        village: String,
        acres: Double,
        soil: String,
        irrigation: String,
        boundaryJson: String,
        lat: Double,
        lng: Double,
        notes: String
    ) -> Unit,
    onDeleteLand: (Long) -> Unit,
    modifier: Modifier = Modifier
) {
    val isTe = language == "te"
    var showAddDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = YuktiStrings.get("survey_title", language),
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = AgriGreenPrimary,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.AddLocationAlt, contentDescription = "Add Land")
            }
        },
        modifier = modifier
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Official Legal Disclaimer Card
            item {
                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = SoilContainer.copy(alpha = 0.7f))
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.Top
                    ) {
                        Icon(
                            Icons.Default.Info,
                            contentDescription = null,
                            tint = SoilBrown,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = YuktiStrings.get("land_disclaimer", language),
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = SoilOnContainer,
                                lineHeight = 18.sp
                            )
                        )
                    }
                }
            }

            if (lands.isEmpty()) {
                item {
                    EmptyStateCard(
                        icon = Icons.Default.Landscape,
                        title = YuktiStrings.get("empty_land", language),
                        description = if (isTe)
                            "మీ భూమి వివరాలు నమోదు చేసి నేల రకం, నీటిపారుదల మరియు పంట సిఫార్సులను పొందండి."
                        else
                            "Mark your land boundaries on the map or enter your survey number to get customized crop insights.",
                        actionButtonText = if (isTe) "భూమి సర్వే ప్రారంభించండి" else "Start Land Survey",
                        onActionClick = { showAddDialog = true }
                    )
                }
            } else {
                item {
                    Text(
                        text = if (isTe) "నమోదైన భూమి రికార్డులు (${lands.size})" else "Saved Land Records (${lands.size})",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }

                items(lands, key = { it.id }) { land ->
                    LandRecordCard(
                        land = land,
                        language = language,
                        onDelete = { onDeleteLand(land.id) }
                    )
                }
            }
        }
    }

    if (showAddDialog) {
        LandSurveyDialog(
            language = language,
            onDismiss = { showAddDialog = false },
            onSave = { surveyNumber, state, district, mandal, village, acres, soil, irrigation, boundaryJson, lat, lng, notes ->
                onSaveLand(surveyNumber, state, district, mandal, village, acres, soil, irrigation, boundaryJson, lat, lng, notes)
                showAddDialog = false
            }
        )
    }
}

@Composable
fun LandRecordCard(
    land: LandRecordEntity,
    language: String,
    onDelete: () -> Unit
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
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Terrain, contentDescription = null, tint = AgriGreenPrimary)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "${land.totalAreaAcres} ${if (isTe) "ఎకరాలు" else "Acres"}",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }
                IconButton(onClick = onDelete) {
                    Icon(Icons.Default.DeleteOutline, contentDescription = "Delete", tint = Color(0xFFC62828))
                }
            }

            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "${if (isTe) "సర్వే నం:" else "Survey No:"} ${land.surveyNumber}",
                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold, color = AgriGreenPrimary)
            )
            Text(
                text = "${land.village}, ${land.mandal}, ${land.district}, ${land.state}",
                style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
            )

            Spacer(modifier = Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Surface(
                    color = SoilContainer,
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        text = "${if (isTe) "నేల: " else "Soil: "}${land.soilType}",
                        color = SoilOnContainer,
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Medium),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
                Surface(
                    color = Color(0xFFE1F5FE),
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        text = "${if (isTe) "నీరు: " else "Water: "}${land.irrigationType}",
                        color = Color(0xFF0277BD),
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Medium),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            if (land.notes.isNotBlank()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = land.notes,
                    style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LandSurveyDialog(
    language: String,
    onDismiss: () -> Unit,
    onSave: (
        surveyNumber: String,
        state: String,
        district: String,
        mandal: String,
        village: String,
        acres: Double,
        soil: String,
        irrigation: String,
        boundaryJson: String,
        lat: Double,
        lng: Double,
        notes: String
    ) -> Unit
) {
    val isTe = language == "te"

    var selectedTab by remember { mutableStateOf(0) } // 0: Option A (Survey Details), 1: Option B (Map Polygon)
    var surveyNumber by remember { mutableStateOf("") }
    var state by remember { mutableStateOf("Andhra Pradesh") }
    var district by remember { mutableStateOf("Guntur") }
    var mandal by remember { mutableStateOf("Tenali") }
    var village by remember { mutableStateOf("Kolanukonda") }
    var areaInput by remember { mutableStateOf("3.5") }
    var soilType by remember { mutableStateOf(if (isTe) "నల్లరేగడి నేల (Black Soil)" else "Black Soil") }
    var irrigationType by remember { mutableStateOf(if (isTe) "బోరుబావి (Borewell)" else "Borewell") }
    var notes by remember { mutableStateOf("") }

    // Map drawing points (Option B)
    val mapPoints = remember { mutableStateListOf<Offset>() }
    var calculatedMapAcres by remember { mutableStateOf(0.0) }

    fun calculateAcreage(points: List<Offset>): Double {
        if (points.size < 3) return 0.0
        var area = 0.0
        val j = points.size - 1
        for (i in points.indices) {
            val p1 = points[i]
            val p2 = points[(i + 1) % points.size]
            area += (p1.x * p2.y) - (p2.x * p1.y)
        }
        val pixelArea = abs(area) / 2.0
        // Scaled conversion for parcel canvas: ~10000 px^2 = 1 Acre representation
        return (pixelArea / 12000.0).coerceAtLeast(0.1)
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = YuktiStrings.get("survey_title", language),
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 480.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                TabRow(
                    selectedTabIndex = selectedTab,
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                ) {
                    Tab(
                        selected = selectedTab == 0,
                        onClick = { selectedTab = 0 },
                        text = { Text(if (isTe) "సర్వే వివరాలు" else "Survey Info", fontWeight = FontWeight.Bold) }
                    )
                    Tab(
                        selected = selectedTab == 1,
                        onClick = { selectedTab = 1 },
                        text = { Text(if (isTe) "మ్యాప్ గీయండి" else "Draw Map", fontWeight = FontWeight.Bold) }
                    )
                }

                if (selectedTab == 0) {
                    // Option A: Survey Number & Location Details
                    LazyColumn(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        item {
                            OutlinedTextField(
                                value = surveyNumber,
                                onValueChange = { surveyNumber = it },
                                label = { Text(YuktiStrings.get("survey_number_label", language)) },
                                placeholder = { Text("e.g. 142/2B or RS-88") },
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        item {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                OutlinedTextField(
                                    value = village,
                                    onValueChange = { village = it },
                                    label = { Text(YuktiStrings.get("village_label", language)) },
                                    modifier = Modifier.weight(1f)
                                )
                                OutlinedTextField(
                                    value = mandal,
                                    onValueChange = { mandal = it },
                                    label = { Text(YuktiStrings.get("mandal_label", language)) },
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                        item {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                OutlinedTextField(
                                    value = district,
                                    onValueChange = { district = it },
                                    label = { Text(YuktiStrings.get("district_label", language)) },
                                    modifier = Modifier.weight(1f)
                                )
                                OutlinedTextField(
                                    value = state,
                                    onValueChange = { state = it },
                                    label = { Text(YuktiStrings.get("state_label", language)) },
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                        item {
                            OutlinedTextField(
                                value = areaInput,
                                onValueChange = { areaInput = it },
                                label = { Text(YuktiStrings.get("area_acres_label", language)) },
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        item {
                            OutlinedTextField(
                                value = soilType,
                                onValueChange = { soilType = it },
                                label = { Text(YuktiStrings.get("soil_type_label", language)) },
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        item {
                            OutlinedTextField(
                                value = irrigationType,
                                onValueChange = { irrigationType = it },
                                label = { Text(YuktiStrings.get("irrigation_type_label", language)) },
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    }
                } else {
                    // Option B: Map-Based Boundary Polygon Drawing
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text(
                            text = if (isTe)
                                "మ్యాప్‌పై క్లిక్ చేసి మీ పొలం సరిహద్దులను (పాయింట్లను) గుర్తించండి:"
                            else
                                "Tap on the map grid to mark corner pins of your land parcel:",
                            style = MaterialTheme.typography.bodySmall
                        )
                        Spacer(modifier = Modifier.height(6.dp))

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(220.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFFE8F5E9))
                                .border(1.dp, AgriGreenPrimary, RoundedCornerShape(12.dp))
                                .pointerInput(Unit) {
                                    detectTapGestures { offset ->
                                        mapPoints.add(offset)
                                        if (mapPoints.size >= 3) {
                                            calculatedMapAcres = String.format("%.2f", calculateAcreage(mapPoints)).toDoubleOrNull() ?: 1.0
                                            areaInput = calculatedMapAcres.toString()
                                        }
                                    }
                                }
                        ) {
                            Canvas(modifier = Modifier.fillMaxSize()) {
                                // Draw agricultural field grid lines
                                for (x in 0..size.width.toInt() step 50) {
                                    drawLine(
                                        color = Color(0x221B5E20),
                                        start = Offset(x.toFloat(), 0f),
                                        end = Offset(x.toFloat(), size.height),
                                        strokeWidth = 1f
                                    )
                                }
                                for (y in 0..size.height.toInt() step 50) {
                                    drawLine(
                                        color = Color(0x221B5E20),
                                        start = Offset(0f, y.toFloat()),
                                        end = Offset(size.width, y.toFloat()),
                                        strokeWidth = 1f
                                    )
                                }

                                // Draw Polygon boundary
                                if (mapPoints.size >= 2) {
                                    val path = Path()
                                    path.moveTo(mapPoints[0].x, mapPoints[0].y)
                                    for (i in 1 until mapPoints.size) {
                                        path.lineTo(mapPoints[i].x, mapPoints[i].y)
                                    }
                                    if (mapPoints.size >= 3) {
                                        path.close()
                                        drawPath(
                                            path = path,
                                            color = AgriGreenPrimary.copy(alpha = 0.25f)
                                        )
                                    }
                                    drawPath(
                                        path = path,
                                        color = AgriGreenPrimary,
                                        style = Stroke(width = 3f)
                                    )
                                }

                                // Draw Pin Nodes
                                mapPoints.forEachIndexed { index, point ->
                                    drawCircle(
                                        color = HarvestGoldDark,
                                        radius = 7f,
                                        center = point
                                    )
                                    drawCircle(
                                        color = Color.White,
                                        radius = 4f,
                                        center = point
                                    )
                                }
                            }

                            // Overlay info
                            Row(
                                modifier = Modifier
                                    .align(Alignment.BottomStart)
                                    .padding(8.dp)
                                    .background(Color.White.copy(alpha = 0.9f), RoundedCornerShape(6.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "${mapPoints.size} ${if (isTe) "పాయింట్లు" else "Pins"} • ${calculatedMapAcres} ${if (isTe) "ఎకరాలు" else "Acres"}",
                                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = AgriGreenPrimary)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(6.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            TextButton(
                                onClick = {
                                    if (mapPoints.isNotEmpty()) mapPoints.removeAt(mapPoints.lastIndex)
                                    calculatedMapAcres = String.format("%.2f", calculateAcreage(mapPoints)).toDoubleOrNull() ?: 0.0
                                    areaInput = calculatedMapAcres.toString()
                                },
                                enabled = mapPoints.isNotEmpty()
                            ) {
                                Text(if (isTe) "అన్‌డూ" else "Undo Point")
                            }
                            TextButton(
                                onClick = {
                                    mapPoints.clear()
                                    calculatedMapAcres = 0.0
                                },
                                enabled = mapPoints.isNotEmpty()
                            ) {
                                Text(if (isTe) "క్లియర్" else "Clear All")
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val acresVal = areaInput.toDoubleOrNull() ?: 1.0
                    val boundaryJson = mapPoints.joinToString(separator = ",", prefix = "[", postfix = "]") {
                        "{\"x\":${it.x},\"y\":${it.y}}"
                    }
                    onSave(
                        if (surveyNumber.isBlank()) "SURV-UNSPECIFIED" else surveyNumber,
                        state,
                        district,
                        mandal,
                        village,
                        acresVal,
                        soilType,
                        irrigationType,
                        boundaryJson,
                        16.3067, // Center Lat
                        80.4365, // Center Lng
                        notes
                    )
                },
                colors = ButtonDefaults.buttonColors(containerColor = AgriGreenPrimary)
            ) {
                Text(YuktiStrings.get("btn_save_land", language), fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(YuktiStrings.get("cancel", language))
            }
        }
    )
}
