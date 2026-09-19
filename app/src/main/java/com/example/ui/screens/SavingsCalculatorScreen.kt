package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.example.ui.i18n.YuktiStrings
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SavingsCalculatorScreen(
    language: String,
    modifier: Modifier = Modifier
) {
    val isTe = language == "te"

    var landSizeInput by remember { mutableStateOf("4.0") } // acres
    var usagePerSeasonInput by remember { mutableStateOf("25") } // hours per season
    var rentalRateInput by remember { mutableStateOf("1200") } // ₹ per hour
    var purchasePriceInput by remember { mutableStateOf("750000") } // ₹7.5 Lakhs
    var annualMaintenanceInput by remember { mutableStateOf("35000") } // ₹ per year

    val landAcres = landSizeInput.toDoubleOrNull() ?: 4.0
    val usageHours = usagePerSeasonInput.toDoubleOrNull() ?: 25.0
    val rentalRate = rentalRateInput.toDoubleOrNull() ?: 1200.0
    val purchasePrice = purchasePriceInput.toDoubleOrNull() ?: 750000.0
    val annualMaintenance = annualMaintenanceInput.toDoubleOrNull() ?: 35000.0

    // Calculations (Annual basis: 2 crop seasons per year)
    val totalRentalCostPerYear = (usageHours * 2) * rentalRate

    // Ownership annualized cost: 5-year depreciation + loan interest (10%) + annual maintenance + insurance
    val annualDepreciationAndInterest = (purchasePrice / 5.0) + (purchasePrice * 0.08)
    val totalOwnershipCostPerYear = annualDepreciationAndInterest + annualMaintenance

    val annualSavingsByRenting = totalOwnershipCostPerYear - totalRentalCostPerYear
    val shouldRent = annualSavingsByRenting > 0

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = YuktiStrings.get("savings_tracker_title", language),
                        fontWeight = FontWeight.Bold
                    )
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
            contentPadding = PaddingValues(top = 10.dp, bottom = 90.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item {
                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = HarvestGoldContainer.copy(alpha = 0.5f))
                ) {
                    Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Savings, contentDescription = null, tint = HarvestGoldDark)
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = YuktiStrings.get("savings_desc", language),
                            style = MaterialTheme.typography.bodySmall.copy(color = HarvestGoldOnContainer, lineHeight = 18.sp)
                        )
                    }
                }
            }

            // Input parameters card
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Text(
                            text = if (isTe) "మీ వ్యవసాయ వినియోగ పారామితులు" else "Farm & Usage Parameters",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold, color = AgriGreenPrimary)
                        )

                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = landSizeInput,
                                onValueChange = { landSizeInput = it },
                                label = { Text(if (isTe) "భూమి (ఎకరాల్లో)" else "Land (Acres)") },
                                modifier = Modifier.weight(1f)
                            )
                            OutlinedTextField(
                                value = usagePerSeasonInput,
                                onValueChange = { usagePerSeasonInput = it },
                                label = { Text(if (isTe) "గంటలు / సీజన్" else "Hours / Season") },
                                modifier = Modifier.weight(1f)
                            )
                        }

                        OutlinedTextField(
                            value = rentalRateInput,
                            onValueChange = { rentalRateInput = it },
                            label = { Text(if (isTe) "యంత్ర అద్దె రేటు (₹/గంట)" else "Rental Rate (₹ / hour)") },
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = purchasePriceInput,
                            onValueChange = { purchasePriceInput = it },
                            label = { Text(if (isTe) "కొత్త యంత్రం కొనుగోలు ధర (₹)" else "New Machine Purchase Price (₹)") },
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = annualMaintenanceInput,
                            onValueChange = { annualMaintenanceInput = it },
                            label = { Text(if (isTe) "వార్షిక నిర్వహణ ఖర్చు (₹)" else "Annual Maintenance & Service (₹)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }

            // Recommendation Card
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (shouldRent) Color(0xFFE8F5E9) else Color(0xFFFFF8E1)
                    ),
                    elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = if (shouldRent) Icons.Default.CheckCircle else Icons.Default.PrecisionManufacturing,
                                contentDescription = null,
                                tint = if (shouldRent) AgriGreenPrimary else HarvestGoldDark,
                                modifier = Modifier.size(28.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = if (shouldRent)
                                        (if (isTe) "సిఫార్సు: అద్దెకు తీసుకోవడం మేలు (RENT)" else "Recommendation: RENT THROUGH YUKTI")
                                    else
                                        (if (isTe) "సిఫార్సు: స్వంతంగా కొనుగోలు అనుకూలం (BUY)" else "Recommendation: BUY MACHINE"),
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = if (shouldRent) AgriGreenPrimary else HarvestGoldDark
                                    )
                                )
                                Text(
                                    text = if (shouldRent)
                                        (if (isTe) "సంవత్సరానికి సుమారు ₹${annualSavingsByRenting.toInt()} పొదుపు చేయవచ్చు!" else "Save ~₹${annualSavingsByRenting.toInt()} per year by renting on-demand!")
                                    else
                                        (if (isTe) "ఎక్కువ విస్తీర్ణం ఉన్నందున కొనుగోలు వ్యయం తక్కువగా ఉంటుంది." else "High seasonal usage justifies capital ownership."),
                                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))
                        Divider()
                        Spacer(modifier = Modifier.height(14.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text(if (isTe) "వార్షిక అద్దె ఖర్చు:" else "Annual Rental Cost:", style = MaterialTheme.typography.labelSmall)
                                Text("₹${totalRentalCostPerYear.toInt()}", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = AgriGreenPrimary))
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text(if (isTe) "వార్షిక కొనుగోలు ఖర్చు:" else "Annual Ownership Cost:", style = MaterialTheme.typography.labelSmall)
                                Text("₹${totalOwnershipCostPerYear.toInt()}", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = Color(0xFFC62828)))
                            }
                        }
                    }
                }
            }
        }
    }
}
