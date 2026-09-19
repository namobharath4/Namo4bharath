package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
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
import com.example.data.models.LandRecordEntity
import com.example.ui.WeatherUiState
import com.example.ui.i18n.YuktiStrings
import com.example.ui.theme.*

data class PaddyStageInfo(
    val id: String,
    val nameEn: String,
    val nameTe: String,
    val dayRange: String,
    val waterDepthGuidanceEn: String,
    val waterDepthGuidanceTe: String,
    val frequencyEn: String,
    val frequencyTe: String,
    val tipsEn: String,
    val tipsTe: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FarmingInsightsScreen(
    language: String,
    weatherState: WeatherUiState,
    farmerLands: List<LandRecordEntity>,
    onRefreshWeather: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isTe = language == "te"

    val paddyStages = remember {
        listOf(
            PaddyStageInfo(
                id = "nursery",
                nameEn = "Nursery (0–25 Days)",
                nameTe = "నారుమడి దశ (0–25 రోజులు)",
                dayRange = "0-25 days",
                waterDepthGuidanceEn = "Maintain shallow 1-2 cm water layer for seedling emergence. Drain water before pulling seedlings.",
                waterDepthGuidanceTe = "నారు మొలకెత్తడానికి 1-2 సెం.మీ పలుచని నీటి పొర ఉంచండి. నారు తీసే ముందు నీటిని బయటకు తీయండి.",
                frequencyEn = "Every 2-3 days based on soil dryness",
                frequencyTe = "నేల తేమను బట్టి ప్రతి 2-3 రోజులకు ఒకసారి",
                tipsEn = "Avoid stagnant deep flooding to prevent seedling rot.",
                tipsTe = "నారు కుళ్ళిపోకుండా అధిక నీరు నిలవకుండా చూడండి."
            ),
            PaddyStageInfo(
                id = "tillering",
                nameEn = "Tillering (25–50 Days)",
                nameTe = "పిలకల దశ (25–50 రోజులు)",
                dayRange = "25-50 days",
                waterDepthGuidanceEn = "Maintain 2-3 cm water level. Adopt Alternate Wetting & Drying (AWD).",
                waterDepthGuidanceTe = "2-3 సెం.మీ నీటి స్థాయి ఉంచండి. ఆరి ఆరని పద్ధతి (AWD) అనుసరించండి.",
                frequencyEn = "Irrigate when water level drops 5 cm below soil surface",
                frequencyTe = "నేల ఉపరితలం కింద 5 సెం.మీ మేర నీరు తగ్గినప్పుడు మాత్రమే నీరు పెట్టండి",
                tipsEn = "Allows soil aeration and promotes deep, vigorous root penetration.",
                tipsTe = "వేర్లకు గాలి ఆడి బలమైన పిలకలు తొందరగా వస్తాయి."
            ),
            PaddyStageInfo(
                id = "panicle",
                nameEn = "Panicle Initiation (50–75 Days)",
                nameTe = "చిరుపొట్ట దశ (50–75 రోజులు)",
                dayRange = "50-75 days",
                waterDepthGuidanceEn = "CRITICAL WATER PERIOD: Maintain continuous 3-5 cm standing water.",
                waterDepthGuidanceTe = "అత్యంత కీలక దశ: పొలంలో తప్పనిసరిగా 3-5 సెం.మీ నిలకడ నీరు ఉండాలి.",
                frequencyEn = "Continuous shallow standing water required",
                frequencyTe = "నిరంతరం పలుచని నీటి నిల్వ అవసరం",
                tipsEn = "Moisture stress at this stage causes severe grain abortion and high sterility.",
                tipsTe = "ఈ దశలో నీటి కొరత వస్తే తాలు గింజలు పెరిగి దిగుబడి గణనీయంగా తగ్గుతుంది."
            ),
            PaddyStageInfo(
                id = "flowering",
                nameEn = "Flowering & Milk (75–95 Days)",
                nameTe = "పూత & పాలుపోసుకునే దశ (75–95 రోజులు)",
                dayRange = "75-95 days",
                waterDepthGuidanceEn = "Maintain 2-4 cm water until grains fill. Prevent sudden drying.",
                waterDepthGuidanceTe = "గింజ పాలుపోసుకునే వరకు 2-4 సెం.మీ నీరు ఉంచండి. అకస్మాత్తుగా ఎండనివ్వవద్దు.",
                frequencyEn = "Regular replenishment every 3-4 days",
                frequencyTe = "ప్రతి 3-4 రోజులకు ఒకసారి తేలికపాటి తడులు",
                tipsEn = "Essential for complete starch synthesis and heavy panicle weight.",
                tipsTe = "గింజ గట్టిపడటానికి మరియు నాణ్యమైన బరువుకు అవసరం."
            ),
            PaddyStageInfo(
                id = "ripening",
                nameEn = "Ripening (95–120 Days)",
                nameTe = "పక్వ దశ (95–120 రోజులు)",
                dayRange = "95-120 days",
                waterDepthGuidanceEn = "Drain water completely 10-14 days before harvest.",
                waterDepthGuidanceTe = "కోతకు 10-14 రోజుల ముందు నీటిని పూర్తిగా తీసివేయండి.",
                frequencyEn = "Stop irrigation completely",
                frequencyTe = "నీటిపారుదలను పూర్తిగా నిలిపివేయండి",
                tipsEn = "Ensures uniform ripening and dry ground for tractor/harvester movement.",
                tipsTe = "వరి గింజలు సమంగా పండటానికి మరియు హార్వెస్టర్ల ప్రవేశానికి అనుకూలం."
            )
        )
    }

    var selectedStageIndex by remember { mutableStateOf(1) } // Default Tillering
    val currentStage = paddyStages[selectedStageIndex]

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = if (isTe) "సాగు సలహాలు & వరి నీటిపారుదల" else "Farming Insights & Paddy Irrigation",
                        fontWeight = FontWeight.Bold
                    )
                },
                actions = {
                    IconButton(onClick = onRefreshWeather) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh Weather")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        modifier = modifier
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Mandatory Advisory Disclaimer
            item {
                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = SoilContainer.copy(alpha = 0.7f))
                ) {
                    Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = SoilBrown)
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = YuktiStrings.get("insights_advisory_note", language),
                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium, color = SoilOnContainer)
                        )
                    }
                }
            }

            // Real Weather Dashboard
            item {
                Card(
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
                            Text(
                                text = if (isTe) "క్షేత్ర వాతావరణం (ఓపెన్-మెటియో API)" else "Field Weather (Open-Meteo API)",
                                style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold, color = AgriGreenPrimary)
                            )
                            Surface(
                                color = Color(0xFFE8F5E9),
                                shape = RoundedCornerShape(6.dp)
                            ) {
                                Text(
                                    text = if (isTe) "నిజ సమయ సమాచారం" else "Live API",
                                    color = AgriGreenPrimary,
                                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        if (weatherState.current != null) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "${weatherState.current.temperature}°C",
                                        style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold)
                                    )
                                    Text(
                                        text = weatherState.locationName,
                                        style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    )
                                }
                                Column(horizontalAlignment = Alignment.End) {
                                    Text(
                                        text = "${if (isTe) "గాలి వేగం: " else "Wind: "}${weatherState.current.windSpeed} km/h",
                                        style = MaterialTheme.typography.bodySmall
                                    )
                                    Text(
                                        text = "${if (isTe) "తేమ: " else "Humidity: "}${weatherState.current.humidity}%",
                                        style = MaterialTheme.typography.bodySmall
                                    )
                                    Text(
                                        text = "${if (isTe) "వర్షపాతం: " else "Precipitation: "}${weatherState.current.precipitation} mm",
                                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold, color = Color(0xFF0288D1))
                                    )
                                }
                            }
                        } else {
                            Text(
                                text = weatherState.errorMessage ?: if (isTe) "వాతావరణ సమాచారం లోడ్ అవుతోంది..." else "Loading live weather...",
                                style = MaterialTheme.typography.bodySmall
                            )
                        }
                    }
                }
            }

            // Dedicated Paddy / Rice Irrigation Guide
            item {
                Text(
                    text = if (isTe) "వరి పంట దశల వారీ నీటి నిర్వహణ" else "Paddy Crop Stage Irrigation Management",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            }

            // Horizontal Stage Selector Tabs
            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(paddyStages.indices.toList()) { index ->
                        val stage = paddyStages[index]
                        val isSelected = index == selectedStageIndex
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (isSelected) AgriGreenPrimary else MaterialTheme.colorScheme.surfaceVariant,
                            contentColor = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.clickable { selectedStageIndex = index }
                        ) {
                            Column(modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp)) {
                                Text(
                                    text = if (isTe) stage.nameTe.substringBefore("(") else stage.nameEn.substringBefore("("),
                                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                )
                                Text(
                                    text = stage.dayRange,
                                    style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp)
                                )
                            }
                        }
                    }
                }
            }

            // Stage Detail Card
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFFE1F5FE)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.WaterDrop, contentDescription = null, tint = Color(0xFF0288D1))
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = if (isTe) currentStage.nameTe else currentStage.nameEn,
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                                )
                                Text(
                                    text = "${if (isTe) "సిఫార్సు పద్ధతి: " else "Method: "} Alternate Wetting & Drying (AWD)",
                                    style = MaterialTheme.typography.labelSmall.copy(color = AgriGreenPrimary, fontWeight = FontWeight.SemiBold)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))
                        Divider()
                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = if (isTe) "నీటి మట్టం & నిర్వహణ మార్గదర్శకం:" else "Water Depth & Inundation Guidance:",
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (isTe) currentStage.waterDepthGuidanceTe else currentStage.waterDepthGuidanceEn,
                            style = MaterialTheme.typography.bodyMedium.copy(lineHeight = 20.sp)
                        )

                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = if (isTe) "తడుల వ్యవధి (Frequency):" else "Irrigation Frequency Guidance:",
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (isTe) currentStage.frequencyTe else currentStage.frequencyEn,
                            style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                        )

                        Spacer(modifier = Modifier.height(12.dp))
                        Surface(
                            color = HarvestGoldContainer.copy(alpha = 0.5f),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Row(modifier = Modifier.padding(10.dp), verticalAlignment = Alignment.Top) {
                                Icon(Icons.Default.Lightbulb, contentDescription = null, tint = HarvestGoldDark, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = if (isTe) currentStage.tipsTe else currentStage.tipsEn,
                                    style = MaterialTheme.typography.bodySmall.copy(color = HarvestGoldOnContainer, lineHeight = 18.sp)
                                )
                            }
                        }
                    }
                }
            }

            // General AWD Water Saving Suggestions
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = if (isTe) "నీటి పొదుపు సూచనలు (AWD టెక్నాలజీ)" else "Water-Saving AWD Recommendations",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = YuktiStrings.get("water_guidance", language),
                            style = MaterialTheme.typography.bodySmall.copy(lineHeight = 19.sp)
                        )
                    }
                }
            }
        }
    }
}
