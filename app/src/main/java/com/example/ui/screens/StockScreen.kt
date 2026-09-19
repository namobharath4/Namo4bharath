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
import com.example.data.models.ShopStockEntity
import com.example.data.models.StockStatus
import com.example.ui.components.EmptyStateCard
import com.example.ui.components.StockBadge
import com.example.ui.i18n.YuktiStrings
import com.example.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StockScreen(
    language: String,
    stocks: List<ShopStockEntity>,
    modifier: Modifier = Modifier
) {
    val isTe = language == "te"

    var selectedDistrict by remember { mutableStateOf<String?>(null) }
    var searchQuery by remember { mutableStateOf("") }

    val districts = remember(stocks) {
        stocks.map { it.district }.distinct().filter { it.isNotBlank() }
    }

    val filteredStocks = remember(stocks, selectedDistrict, searchQuery) {
        stocks.filter { s ->
            val matchDistrict = selectedDistrict == null || s.district.equals(selectedDistrict, ignoreCase = true)
            val matchSearch = searchQuery.isBlank() ||
                    s.shopName.contains(searchQuery, ignoreCase = true) ||
                    s.productName.contains(searchQuery, ignoreCase = true) ||
                    s.mandal.contains(searchQuery, ignoreCase = true) ||
                    s.village.contains(searchQuery, ignoreCase = true)
            matchDistrict && matchSearch
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = if (isTe) "సమీప షాపుల్లో నిజమైన నిల్వలు" else "Real Shop Stock Availability",
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
            contentPadding = PaddingValues(top = 8.dp, bottom = 90.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Notice about factual stock
            item {
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFE8F5E9))
                ) {
                    Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Verified, contentDescription = null, tint = AgriGreenPrimary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (isTe)
                                "ఈ నిల్వ సమాచారం కంపెనీలు మరియు డీలర్లు నేరుగా నమోదు చేసినది. ప్రయాణం చేసే ముందు షాపును ఫోన్ ద్వారా సంప్రదించండి."
                            else
                                "Stock data is declared directly by registered companies and verified retail distributors. Call ahead to confirm.",
                            style = MaterialTheme.typography.bodySmall.copy(color = AgriOnGreenContainer, fontSize = 11.sp)
                        )
                    }
                }
            }

            // Search Bar
            item {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text(if (isTe) "షాపు పేరు, ఉత్పత్తి లేదా గ్రామం..." else "Search shop, product, or village...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                    trailingIcon = {
                        if (searchQuery.isNotBlank()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Default.Clear, contentDescription = "Clear")
                            }
                        }
                    },
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.fillMaxWidth()
                )
            }

            // District Filter Chips
            if (districts.isNotEmpty()) {
                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        FilterChip(
                            selected = selectedDistrict == null,
                            onClick = { selectedDistrict = null },
                            label = { Text(YuktiStrings.get("filter_all", language)) }
                        )
                        districts.forEach { dist ->
                            FilterChip(
                                selected = selectedDistrict == dist,
                                onClick = { selectedDistrict = dist },
                                label = { Text(dist) }
                            )
                        }
                    }
                }
            }

            if (filteredStocks.isEmpty()) {
                item {
                    EmptyStateCard(
                        icon = Icons.Default.Storefront,
                        title = YuktiStrings.get("empty_stock", language),
                        description = if (isTe)
                            "కంపెనీలు కొత్త నిల్వలను నమోదు చేసినప్పుడు అవి ఇక్కడ ఖచ్చితమైన తేదీ మరియు సమయంతో కనిపిస్తాయి."
                        else
                            "Distributor stock updates with verified timestamps will appear here once submitted."
                    )
                }
            } else {
                items(filteredStocks, key = { it.id }) { stock ->
                    ShopStockCard(stock = stock, language = language)
                }
            }
        }
    }
}

@Composable
fun ShopStockCard(
    stock: ShopStockEntity,
    language: String
) {
    val isTe = language == "te"
    val dateFormat = remember { SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault()) }
    val formattedDate = remember(stock.lastUpdated) {
        dateFormat.format(Date(stock.lastUpdated))
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
                StockBadge(status = stock.status, language = language)
                Text(
                    text = "₹${stock.currentPrice} (${stock.packSize})",
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold, color = AgriGreenPrimary)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = stock.productName,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )

            Spacer(modifier = Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Store, contentDescription = null, tint = SoilBrown, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = stock.shopName,
                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
                )
            }

            Text(
                text = "${stock.shopAddress}, ${stock.village}, ${stock.mandal}, ${stock.district}",
                style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
            )

            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Phone, contentDescription = null, tint = AgriGreenPrimary, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = stock.contactPhone,
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold)
                    )
                }

                Text(
                    text = "${if (isTe) "లభ్యత: " else "Qty: "}${stock.availableQuantity} ${if (isTe) "ప్యాకెట్లు" else "units"}",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
            Divider()
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "${if (isTe) "చివరి అప్‌డేట్: " else "Stock last updated: "}$formattedDate",
                style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            )
        }
    }
}
