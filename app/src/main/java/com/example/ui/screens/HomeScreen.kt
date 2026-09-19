package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.models.UserRole
import com.example.ui.WeatherUiState
import com.example.ui.i18n.YuktiStrings
import com.example.ui.theme.*

@Composable
fun HomeScreen(
    language: String,
    currentRole: UserRole,
    weatherState: WeatherUiState,
    onNavigateTo: (String) -> Unit,
    onSelectRole: (UserRole) -> Unit,
    modifier: Modifier = Modifier
) {
    val isTe = language == "te"

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(bottom = 80.dp)
    ) {
        // Hero Section
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                shape = RoundedCornerShape(20.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                colors = CardDefaults.cardColors(
                    containerColor = AgriGreenPrimary
                )
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            brush = Brush.verticalGradient(
                                colors = listOf(AgriGreenPrimary, AgriGreenDark)
                            )
                        )
                        .padding(24.dp)
                ) {
                    Column {
                        Surface(
                            color = HarvestGoldContainer,
                            shape = RoundedCornerShape(20.dp)
                        ) {
                            Text(
                                text = if (isTe) "యుక్తి డిజిటల్ వ్యవసాయం" else "YUKTI Smart Agriculture",
                                color = HarvestGoldOnContainer,
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = YuktiStrings.get("hero_title", language),
                            style = MaterialTheme.typography.headlineSmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = YuktiStrings.get("hero_sub", language),
                            style = MaterialTheme.typography.bodyMedium.copy(
                                color = Color.White.copy(alpha = 0.9f),
                                lineHeight = 20.sp
                            )
                        )
                        Spacer(modifier = Modifier.height(18.dp))
                        // Quick Hero Actions
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Button(
                                onClick = { onNavigateTo("land_survey") },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = HarvestGold,
                                    contentColor = Color(0xFF261800)
                                ),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.Map, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(if (isTe) "భూమి సర్వే" else "Land Survey", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                            OutlinedButton(
                                onClick = { onNavigateTo("ai_assistant") },
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
                                border = ButtonDefaults.outlinedButtonBorder.copy(brush = Brush.horizontalGradient(listOf(Color.White, Color.White))),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(if (isTe) "AI సలహా" else "Ask AI", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                        }
                    }
                }
            }
        }

        // Live Weather Glance Banner (Real Open-Meteo Integration)
        item {
            WeatherGlanceCard(
                weatherState = weatherState,
                language = language,
                onCardClick = { onNavigateTo("farming_insights") },
                modifier = Modifier.padding(horizontal = 16.dp)
            )
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Ecosystem Role Cards
        item {
            Text(
                text = if (isTe) "యుక్తి వ్యవసాయ వేదిక" else "The YUKTI Ecosystem",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                EcosystemPillCard(
                    title = YuktiStrings.get("role_farmer", language),
                    subtitle = if (isTe) "భూమి, పంట సలహాలు" else "Decisions & Products",
                    icon = Icons.Default.Agriculture,
                    isSelected = currentRole == UserRole.FARMER,
                    onClick = { onSelectRole(UserRole.FARMER) },
                    modifier = Modifier.weight(1f)
                )
                EcosystemPillCard(
                    title = YuktiStrings.get("role_company", language),
                    subtitle = if (isTe) "ఉత్పత్తులు & నిల్వలు" else "Verified Products",
                    icon = Icons.Default.Business,
                    isSelected = currentRole == UserRole.COMPANY,
                    onClick = { onSelectRole(UserRole.COMPANY) },
                    modifier = Modifier.weight(1f)
                )
                EcosystemPillCard(
                    title = if (isTe) "యంత్రాలు" else "Equipment",
                    subtitle = if (isTe) "ట్రాక్టర్లు, హార్వెస్టర్" else "Tools & Rentals",
                    icon = Icons.Default.Build,
                    isSelected = currentRole == UserRole.EQUIPMENT_PROVIDER,
                    onClick = { onSelectRole(UserRole.EQUIPMENT_PROVIDER) },
                    modifier = Modifier.weight(1f)
                )
            }
            Spacer(modifier = Modifier.height(20.dp))
        }

        // Main Modules Quick Action Grid
        item {
            Text(
                text = if (isTe) "ప్రధాన వ్యవసాయ సేవలు" else "Core Agricultural Services",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
            )

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    ServiceCard(
                        title = YuktiStrings.get("nav_myland", language),
                        desc = if (isTe) "సర్వే నంబర్ & మ్యాప్ గుర్తింపు" else "Survey & Map boundaries",
                        icon = Icons.Default.Landscape,
                        tag = if (isTe) "భూమి" else "Land",
                        tagColor = AgriGreenPrimary,
                        onClick = { onNavigateTo("land_survey") },
                        modifier = Modifier.weight(1f)
                    )
                    ServiceCard(
                        title = YuktiStrings.get("insights_title", language).substringBefore("&").trim(),
                        desc = if (isTe) "వరి సాగు & నీటిపారుదల" else "Paddy Irrigation & Weather",
                        icon = Icons.Default.WaterDrop,
                        tag = if (isTe) "నీరు" else "Water",
                        tagColor = Color(0xFF0288D1),
                        onClick = { onNavigateTo("farming_insights") },
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    ServiceCard(
                        title = YuktiStrings.get("nav_products", language),
                        desc = if (isTe) "విత్తనాలు, ఎరువులు, మందులు" else "Seeds, Fertilizers, Pesticides",
                        icon = Icons.Default.Inventory2,
                        tag = if (isTe) "కేటలాగ్" else "Catalog",
                        tagColor = SoilBrown,
                        onClick = { onNavigateTo("products") },
                        modifier = Modifier.weight(1f)
                    )
                    ServiceCard(
                        title = YuktiStrings.get("nav_equipment", language),
                        desc = if (isTe) "ట్రాక్టర్లు & హార్వెస్టర్ల బుకింగ్" else "Tractor & Harvester Booking",
                        icon = Icons.Default.PrecisionManufacturing,
                        tag = if (isTe) "అద్దె" else "Rental",
                        tagColor = HarvestGoldDark,
                        onClick = { onNavigateTo("equipment") },
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    ServiceCard(
                        title = YuktiStrings.get("nav_stock", language),
                        desc = if (isTe) "జిల్లా & షాపుల వారీ నిల్వలు" else "District & Shop Real Availability",
                        icon = Icons.Default.Storefront,
                        tag = if (isTe) "నిల్వలు" else "Stock",
                        tagColor = Color(0xFF2E7D32),
                        onClick = { onNavigateTo("stock") },
                        modifier = Modifier.weight(1f)
                    )
                    ServiceCard(
                        title = if (isTe) "యుక్తి పొదుపు" else "YUKTI Savings",
                        desc = if (isTe) "కొనుగోలు vs అద్దె వ్యయ పోలిక" else "Rent vs Buy Cost Calculator",
                        icon = Icons.Default.Calculate,
                        tag = if (isTe) "పొదుపు" else "Savings",
                        tagColor = Color(0xFF512DA8),
                        onClick = { onNavigateTo("savings") },
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }

        // Trust & Official Verification Highlights
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Verified, contentDescription = null, tint = AgriGreenPrimary, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (isTe) "విశ్వసనీయత & అధికారిక నియమాలు" else "Trust & Official Verification",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = if (isTe)
                            "• డెమో లేదా నకిలీ డేటా లేదు: లైసెన్స్ కలిగిన కంపెనీలు నమోదు చేసిన నిజమైన ఉత్పత్తులు మాత్రమే కనిపిస్తాయి.\n• స్టాక్ సమయం: నిల్వ చివరిసారి ఎప్పుడు అప్‌డేట్ అయిందో స్పష్టంగా తేదీ/సమయం కనిపిస్తుంది.\n• భూమి ధృవీకరణ: ప్రభుత్వ వ్యవస్థకు అనుసంధానం అయ్యేవరకు మ్యాప్ లొకేషన్ మీ వ్యక్తిగత రికార్డుగానే ఉంటుంది."
                        else
                            "• Zero fake data: Only company-declared products and shops registered in the database are shown.\n• Transparent stock timestamps: See exactly when inventory was last updated.\n• Land records clarity: Official survey connection status is explicitly disclosed.",
                        style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant, lineHeight = 18.sp)
                    )
                }
            }
        }
    }
}

@Composable
fun WeatherGlanceCard(
    weatherState: WeatherUiState,
    language: String,
    onCardClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isTe = language == "te"

    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onCardClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.LocationOn, contentDescription = null, tint = AgriGreenPrimary, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = weatherState.locationName,
                        style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.SemiBold)
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                if (weatherState.isLoading) {
                    Text(text = if (isTe) "వాతావరణం లోడ్ అవుతోంది..." else "Fetching live weather...", style = MaterialTheme.typography.bodySmall)
                } else if (weatherState.current != null) {
                    Text(
                        text = "${weatherState.current.temperature}°C",
                        style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, color = AgriGreenPrimary)
                    )
                    Text(
                        text = if (isTe)
                            "తేమ: ${weatherState.current.humidity}% • వర్షపాతం: ${weatherState.current.precipitation} mm • గాలి: ${weatherState.current.windSpeed} km/h"
                        else
                            "Humidity: ${weatherState.current.humidity}% • Rain: ${weatherState.current.precipitation} mm • Wind: ${weatherState.current.windSpeed} km/h",
                        style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                    )
                } else {
                    Text(
                        text = weatherState.errorMessage ?: (if (isTe) "వాతావరణ డేటా సిద్ధంగా ఉంది" else "Live meteorological forecast"),
                        style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                    )
                }
            }

            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFE1F5FE)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.WbSunny,
                    contentDescription = "Weather",
                    tint = Color(0xFFF57C00),
                    modifier = Modifier.size(28.dp)
                )
            }
        }
    }
}

@Composable
fun EcosystemPillCard(
    title: String,
    subtitle: String,
    icon: ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .clip(RoundedCornerShape(14.dp))
            .clickable { onClick() }
            .then(
                if (isSelected) Modifier.border(2.dp, AgriGreenPrimary, RoundedCornerShape(14.dp))
                else Modifier
            ),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) AgriGreenContainer.copy(alpha = 0.4f) else MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = if (isSelected) AgriGreenPrimary else SoilBrown,
                modifier = Modifier.size(26.dp)
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                textAlign = TextAlign.Center
            )
            Text(
                text = subtitle,
                style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant),
                textAlign = TextAlign.Center,
                maxLines = 1
            )
        }
    }
}

@Composable
fun ServiceCard(
    title: String,
    desc: String,
    icon: ImageVector,
    tag: String,
    tagColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(tagColor.copy(alpha = 0.12f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(icon, contentDescription = null, tint = tagColor, modifier = Modifier.size(22.dp))
                }
                Surface(
                    color = tagColor.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        text = tag,
                        color = tagColor,
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, fontSize = 10.sp),
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = desc,
                style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 11.sp),
                maxLines = 2
            )
        }
    }
}
