package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import com.example.data.models.ProductCategory
import com.example.data.models.ProductEntity
import com.example.data.models.VerificationStatus
import com.example.ui.components.EmptyStateCard
import com.example.ui.components.StatusBadge
import com.example.ui.i18n.YuktiStrings
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductsScreen(
    language: String,
    products: List<ProductEntity>,
    onSendEnquiry: (recipientType: String, recipientId: String, recipientName: String, subject: String, message: String) -> Unit,
    modifier: Modifier = Modifier
) {
    val isTe = language == "te"

    var selectedCategory by remember { mutableStateOf<ProductCategory?>(null) } // null = All
    var searchQuery by remember { mutableStateOf("") }
    var selectedProductForDetail by remember { mutableStateOf<ProductEntity?>(null) }
    var comparisonList = remember { mutableStateListOf<ProductEntity>() }
    var showComparisonModal by remember { mutableStateOf(false) }

    val filteredProducts = remember(products, selectedCategory, searchQuery) {
        products.filter { p ->
            val matchCategory = selectedCategory == null || p.category == selectedCategory
            val matchSearch = searchQuery.isBlank() ||
                    p.productName.contains(searchQuery, ignoreCase = true) ||
                    p.brandName.contains(searchQuery, ignoreCase = true) ||
                    p.companyName.contains(searchQuery, ignoreCase = true)
            matchCategory && matchSearch
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = if (isTe) "వ్యవసాయ ఉత్పత్తుల కేటలాగ్" else "Agricultural Products Catalog",
                        fontWeight = FontWeight.Bold
                    )
                },
                actions = {
                    if (comparisonList.size >= 2) {
                        Button(
                            onClick = { showComparisonModal = true },
                            colors = ButtonDefaults.buttonColors(containerColor = HarvestGold, contentColor = Color.Black),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.padding(end = 8.dp)
                        ) {
                            Icon(Icons.Default.CompareArrows, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(YuktiStrings.get("btn_compare", language), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
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
            contentPadding = PaddingValues(top = 8.dp, bottom = 90.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Search Bar
            item {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text(YuktiStrings.get("search_placeholder", language)) },
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

            // Category Filter Chips (Seeds, Fertilizers, Pesticides)
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    FilterChip(
                        selected = selectedCategory == null,
                        onClick = { selectedCategory = null },
                        label = { Text(YuktiStrings.get("filter_all", language)) }
                    )
                    FilterChip(
                        selected = selectedCategory == ProductCategory.SEEDS,
                        onClick = { selectedCategory = ProductCategory.SEEDS },
                        label = { Text(YuktiStrings.get("products_seeds", language)) }
                    )
                    FilterChip(
                        selected = selectedCategory == ProductCategory.FERTILIZERS,
                        onClick = { selectedCategory = ProductCategory.FERTILIZERS },
                        label = { Text(YuktiStrings.get("products_fertilizers", language)) }
                    )
                    FilterChip(
                        selected = selectedCategory == ProductCategory.PESTICIDES,
                        onClick = { selectedCategory = ProductCategory.PESTICIDES },
                        label = { Text(YuktiStrings.get("products_pesticides", language)) }
                    )
                }
            }

            if (filteredProducts.isEmpty()) {
                item {
                    EmptyStateCard(
                        icon = Icons.Default.Inventory2,
                        title = YuktiStrings.get("empty_products", language),
                        description = if (isTe)
                            "ధృవీకరించబడిన కంపెనీలు తమ విత్తనాలు, ఎరువులు మరియు పురుగుమందుల వివరాలను నమోదు చేసినప్పుడు ఇక్కడ కనిపిస్తాయి."
                        else
                            "Verified agricultural companies publish approved seed, fertilizer, and pesticide products here."
                    )
                }
            } else {
                items(filteredProducts, key = { it.id }) { product ->
                    val isCompared = comparisonList.any { it.id == product.id }
                    ProductCard(
                        product = product,
                        language = language,
                        isCompared = isCompared,
                        onCompareToggle = {
                            if (isCompared) {
                                comparisonList.removeAll { it.id == product.id }
                            } else {
                                if (comparisonList.size < 2) comparisonList.add(product)
                            }
                        },
                        onClick = { selectedProductForDetail = product }
                    )
                }
            }
        }
    }

    // Product Detail Dialog
    selectedProductForDetail?.let { prod ->
        ProductDetailDialog(
            product = prod,
            language = language,
            onDismiss = { selectedProductForDetail = null },
            onSendEnquiry = { message ->
                onSendEnquiry("COMPANY", prod.companyId, prod.companyName, "Product Enquiry: ${prod.productName}", message)
                selectedProductForDetail = null
            }
        )
    }

    // Comparison Modal
    if (showComparisonModal && comparisonList.size >= 2) {
        ProductComparisonDialog(
            productA = comparisonList[0],
            productB = comparisonList[1],
            language = language,
            onDismiss = { showComparisonModal = false }
        )
    }
}

@Composable
fun ProductCard(
    product: ProductEntity,
    language: String,
    isCompared: Boolean,
    onCompareToggle: () -> Unit,
    onClick: () -> Unit
) {
    val isTe = language == "te"

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .clickable { onClick() },
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
                    color = when (product.category) {
                        ProductCategory.SEEDS -> Color(0xFFE8F5E9)
                        ProductCategory.FERTILIZERS -> Color(0xFFFFF3CD)
                        ProductCategory.PESTICIDES -> Color(0xFFFFEBEE)
                    },
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        text = when (product.category) {
                            ProductCategory.SEEDS -> YuktiStrings.get("products_seeds", language)
                            ProductCategory.FERTILIZERS -> YuktiStrings.get("products_fertilizers", language)
                            ProductCategory.PESTICIDES -> YuktiStrings.get("products_pesticides", language)
                        },
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }

                StatusBadge(
                    text = if (product.verificationStatus == VerificationStatus.APPROVED)
                        (if (isTe) "ధృవీకరించబడింది" else "Verified")
                    else product.verificationStatus.name,
                    status = product.verificationStatus
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = product.productName,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )
            Text(
                text = "${product.brandName} • ${product.companyName}",
                style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
            )

            if (product.nutrientsJson.isNotBlank()) {
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "${if (isTe) "పోషకాలు: " else "Nutrients: "} ${product.nutrientsJson}",
                    style = MaterialTheme.typography.bodySmall.copy(color = AgriGreenPrimary, fontWeight = FontWeight.SemiBold)
                )
            }

            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = YuktiStrings.get("price_declared", language),
                        style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    )
                    Text(
                        text = "₹${product.companyDeclaredPrice}",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.ExtraBold, color = AgriGreenPrimary)
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onCompareToggle) {
                        Icon(
                            imageVector = if (isCompared) Icons.Default.CheckCircle else Icons.Default.CompareArrows,
                            contentDescription = "Compare",
                            tint = if (isCompared) AgriGreenPrimary else Color.Gray
                        )
                    }
                    TextButton(onClick = onClick) {
                        Text(if (isTe) "వివరాలు" else "Details", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductDetailDialog(
    product: ProductEntity,
    language: String,
    onDismiss: () -> Unit,
    onSendEnquiry: (String) -> Unit
) {
    val isTe = language == "te"
    var showEnquiryInput by remember { mutableStateOf(false) }
    var enquiryText by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Column {
                Text(product.productName, fontWeight = FontWeight.Bold)
                Text(
                    text = "${product.brandName} (${product.companyName})",
                    style = MaterialTheme.typography.labelMedium.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                )
            }
        },
        text = {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 420.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                item {
                    Text(
                        text = product.description.ifBlank { if (isTe) "వివరణ అందుబాటులో లేదు." else "No description provided." },
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
                if (product.nutrientsJson.isNotBlank()) {
                    item {
                        DetailRow(if (isTe) "పోషక విలువలు (NPK):" else "Nutrient Composition:", product.nutrientsJson)
                    }
                }
                if (product.dosage.isNotBlank()) {
                    item {
                        DetailRow(YuktiStrings.get("dosage_label", language), product.dosage)
                    }
                }
                if (product.applicationMethod.isNotBlank()) {
                    item {
                        DetailRow(if (isTe) "వినియోగ పద్ధతి:" else "Application Method:", product.applicationMethod)
                    }
                }
                if (product.suitableCropsJson.isNotBlank()) {
                    item {
                        DetailRow(if (isTe) "అనువైన పంటలు:" else "Suitable Crops:", product.suitableCropsJson)
                    }
                }
                item {
                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        Column {
                            Text(if (isTe) "ప్రకటించిన ధర:" else "Declared Price:", style = MaterialTheme.typography.labelSmall)
                            Text("₹${product.companyDeclaredPrice}", fontWeight = FontWeight.Bold, color = AgriGreenPrimary)
                        }
                        if (product.mrp > 0) {
                            Column {
                                Text("MRP:", style = MaterialTheme.typography.labelSmall)
                                Text("₹${product.mrp}", fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
                if (product.category == ProductCategory.PESTICIDES) {
                    item {
                        Surface(
                            color = Color(0xFFFFEBEE),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Row(modifier = Modifier.padding(8.dp)) {
                                Icon(Icons.Default.Warning, contentDescription = null, tint = Color(0xFFC62828), modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = if (isTe) "రక్షణ హెచ్చరిక: పురుగుమందుల వాడేటప్పుడు చేతి తొడుగులు, మాస్క్ ధరించండి. పిల్లలకు దూరంగా ఉంచండి." else "Safety Caution: Wear gloves and mask while spraying. Follow label instructions carefully.",
                                    style = MaterialTheme.typography.bodySmall.copy(color = Color(0xFFC62828), fontSize = 11.sp)
                                )
                            }
                        }
                    }
                }
                if (showEnquiryInput) {
                    item {
                        OutlinedTextField(
                            value = enquiryText,
                            onValueChange = { enquiryText = it },
                            placeholder = { Text(if (isTe) "ఉదాహరణ: 5 ఎకరాలకు ఎన్ని సంచులు కావాలి?" else "e.g. I need 2 bags for 3 acres of paddy.") },
                            label = { Text(if (isTe) "మీ విచారణ సందేశం" else "Your Enquiry Message") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }
        },
        confirmButton = {
            if (!showEnquiryInput) {
                Button(
                    onClick = { showEnquiryInput = true },
                    colors = ButtonDefaults.buttonColors(containerColor = AgriGreenPrimary)
                ) {
                    Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(YuktiStrings.get("btn_enquire", language))
                }
            } else {
                Button(
                    onClick = {
                        if (enquiryText.isNotBlank()) onSendEnquiry(enquiryText)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = AgriGreenPrimary)
                ) {
                    Text(YuktiStrings.get("submit", language))
                }
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(YuktiStrings.get("close", language))
            }
        }
    )
}

@Composable
fun DetailRow(label: String, value: String) {
    Column {
        Text(text = label, style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant))
        Text(text = value, style = MaterialTheme.typography.bodyMedium)
    }
}

@Composable
fun ProductComparisonDialog(
    productA: ProductEntity,
    productB: ProductEntity,
    language: String,
    onDismiss: () -> Unit
) {
    val isTe = language == "te"

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = if (isTe) "ఉత్పత్తుల పోలిక (Factual Comparison)" else "Product Side-by-Side Comparison",
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 440.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                item {
                    Text(
                        text = if (isTe)
                            "గమనిక: యుక్తి వేదిక ఏ ఉత్పత్తిని అత్యుత్తమమైనదిగా ప్రకటించదు. నిజమైన డేటా ఆధారంగా రైతులు తమ సొంత నిర్ణయం తీసుకోవడానికి ఈ సమాచారం ఉపయోగపడుతుంది."
                        else
                            "Notice: YUKTI never declares one product 'best'. We present factual company specifications so farmers make their own informed decision.",
                        style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 11.sp)
                    )
                }
                item {
                    Row(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(productA.productName, fontWeight = FontWeight.Bold, color = AgriGreenPrimary)
                            Text(productA.companyName, style = MaterialTheme.typography.labelSmall)
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(productB.productName, fontWeight = FontWeight.Bold, color = Color(0xFF0277BD))
                            Text(productB.companyName, style = MaterialTheme.typography.labelSmall)
                        }
                    }
                }
                item { Divider() }
                item {
                    ComparisonParamRow(
                        param = if (isTe) "వర్గం" else "Category",
                        valA = productA.category.name,
                        valB = productB.category.name
                    )
                }
                item {
                    ComparisonParamRow(
                        param = if (isTe) "ధర" else "Price",
                        valA = "₹${productA.companyDeclaredPrice}",
                        valB = "₹${productB.companyDeclaredPrice}"
                    )
                }
                item {
                    ComparisonParamRow(
                        param = if (isTe) "పోషకాలు" else "Nutrients",
                        valA = productA.nutrientsJson.ifBlank { "-" },
                        valB = productB.nutrientsJson.ifBlank { "-" }
                    )
                }
                item {
                    ComparisonParamRow(
                        param = if (isTe) "మోతాదు" else "Dosage",
                        valA = productA.dosage.ifBlank { "-" },
                        valB = productB.dosage.ifBlank { "-" }
                    )
                }
                item {
                    ComparisonParamRow(
                        param = if (isTe) "అనువైన పంటలు" else "Suitable Crops",
                        valA = productA.suitableCropsJson.ifBlank { "-" },
                        valB = productB.suitableCropsJson.ifBlank { "-" }
                    )
                }
            }
        },
        confirmButton = {
            Button(onClick = onDismiss, colors = ButtonDefaults.buttonColors(containerColor = AgriGreenPrimary)) {
                Text(YuktiStrings.get("close", language))
            }
        }
    )
}

@Composable
fun ComparisonParamRow(param: String, valA: String, valB: String) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(param, style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(valA, style = MaterialTheme.typography.bodySmall, modifier = Modifier.weight(1f))
            Spacer(modifier = Modifier.width(8.dp))
            Text(valB, style = MaterialTheme.typography.bodySmall, modifier = Modifier.weight(1f))
        }
        Spacer(modifier = Modifier.height(4.dp))
    }
}
