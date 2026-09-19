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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.models.*
import com.example.ui.components.EmptyStateCard
import com.example.ui.components.StatusBadge
import com.example.ui.components.StockBadge
import com.example.ui.i18n.YuktiStrings
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CompanyPortalScreen(
    language: String,
    session: UserSessionEntity?,
    companyProducts: List<ProductEntity>,
    enquiries: List<EnquiryEntity>,
    onAddProduct: (
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
    ) -> Unit,
    onAddStock: (
        productId: Long,
        productName: String,
        category: ProductCategory,
        shopName: String,
        shopAddress: String,
        district: String,
        mandal: String,
        village: String,
        phone: String,
        packSize: String,
        quantity: Int,
        price: Double,
        status: StockStatus
    ) -> Unit,
    onReplyEnquiry: (enquiry: EnquiryEntity, reply: String) -> Unit,
    modifier: Modifier = Modifier
) {
    val isTe = language == "te"
    var selectedTab by remember { mutableStateOf(0) } // 0: Products, 1: Add Stock, 2: Farmer Enquiries
    var showAddProductDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = session?.fullName ?: (if (isTe) "వ్యవసాయ కంపెనీ పోర్టల్" else "Agri Company Portal"),
                            fontWeight = FontWeight.Bold,
                            maxLines = 1
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Verified, contentDescription = null, tint = AgriGreenPrimary, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = if (session?.isVerified == true)
                                    (if (isTe) "లైసెన్స్ ధృవీకరించబడింది" else "Verified License")
                                else
                                    (if (isTe) "పరిశీలనలో ఉంది" else "Pending Verification"),
                                style = MaterialTheme.typography.labelSmall.copy(color = AgriGreenPrimary, fontSize = 10.sp)
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        floatingActionButton = {
            if (selectedTab == 0) {
                FloatingActionButton(
                    onClick = { showAddProductDialog = true },
                    containerColor = AgriGreenPrimary,
                    contentColor = Color.White
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Add Product")
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
                    text = { Text(if (isTe) "ఉత్పత్తులు (${companyProducts.size})" else "Products (${companyProducts.size})", fontWeight = FontWeight.Bold) }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text(if (isTe) "స్టాక్ నమోదు" else "Manage Stock", fontWeight = FontWeight.Bold) }
                )
                Tab(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    text = { Text(if (isTe) "విచారణలు (${enquiries.size})" else "Enquiries (${enquiries.size})", fontWeight = FontWeight.Bold) }
                )
            }

            when (selectedTab) {
                0 -> {
                    // Products List
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp),
                        contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        if (companyProducts.isEmpty()) {
                            item {
                                EmptyStateCard(
                                    icon = Icons.Default.AddBusiness,
                                    title = if (isTe) "ఇంకా ఉత్పత్తులు నమోదు కాలేదు" else "No Products Registered",
                                    description = if (isTe)
                                        "మీ సీడ్స్, ఎరువులు లేదా రక్షణ ఉత్పత్తులను నమోదు చేసి అడ్మిన్ ఆమోదం కోసం సమర్పించండి."
                                    else
                                        "Submit seeds, fertilizers, or crop protection products for official verification.",
                                    actionButtonText = YuktiStrings.get("btn_add_product", language),
                                    onActionClick = { showAddProductDialog = true }
                                )
                            }
                        } else {
                            items(companyProducts, key = { it.id }) { prod ->
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
                                            Text(prod.category.name, style = MaterialTheme.typography.labelSmall.copy(color = AgriGreenPrimary, fontWeight = FontWeight.Bold))
                                            StatusBadge(text = prod.verificationStatus.name, status = prod.verificationStatus)
                                        }
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(prod.productName, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                                        Text("${prod.brandName} • Reg: ${prod.registrationNumber}", style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant))
                                        Spacer(modifier = Modifier.height(6.dp))
                                        Text("Declared Price: ₹${prod.companyDeclaredPrice} (MRP: ₹${prod.mrp})", fontWeight = FontWeight.SemiBold, color = AgriGreenPrimary)
                                        if (prod.regulatoryNotes.isNotBlank()) {
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Text("Admin Feedback: ${prod.regulatoryNotes}", style = MaterialTheme.typography.labelSmall.copy(color = SoilBrown))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                1 -> {
                    // Quick Stock Entry Form
                    CompanyStockEntryView(
                        language = language,
                        products = companyProducts,
                        onAddStock = onAddStock
                    )
                }
                2 -> {
                    // Enquiries View
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp),
                        contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        if (enquiries.isEmpty()) {
                            item {
                                EmptyStateCard(
                                    icon = Icons.Default.ChatBubbleOutline,
                                    title = if (isTe) "రైతు విచారణలు లేవు" else "No Inquiries Yet",
                                    description = if (isTe)
                                        "రైతులు మీ ఉత్పత్తుల గురించి ప్రశ్నలు పంపినప్పుడు ఇక్కడ కనిపిస్తాయి."
                                    else
                                        "Questions and stock inquiries from farmers will be listed here."
                                )
                            }
                        } else {
                            items(enquiries, key = { it.id }) { enq ->
                                EnquiryItemCard(
                                    enquiry = enq,
                                    language = language,
                                    onReply = { reply -> onReplyEnquiry(enq, reply) }
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    if (showAddProductDialog) {
        AddProductDialog(
            language = language,
            onDismiss = { showAddProductDialog = false },
            onSubmit = { name, brand, mfg, cat, type, desc, nut, crops, stage, dosage, method, packs, mrp, price, eff, exp, reg, notes ->
                onAddProduct(name, brand, mfg, cat, type, desc, nut, crops, stage, dosage, method, packs, mrp, price, eff, exp, reg, notes)
                showAddProductDialog = false
            }
        )
    }
}

@Composable
fun CompanyStockEntryView(
    language: String,
    products: List<ProductEntity>,
    onAddStock: (
        productId: Long,
        productName: String,
        category: ProductCategory,
        shopName: String,
        shopAddress: String,
        district: String,
        mandal: String,
        village: String,
        phone: String,
        packSize: String,
        quantity: Int,
        price: Double,
        status: StockStatus
    ) -> Unit
) {
    val isTe = language == "te"

    var selectedProduct by remember { mutableStateOf(products.firstOrNull()) }
    var shopName by remember { mutableStateOf("Sri Balaji Krishi Seva Kendra") }
    var shopAddress by remember { mutableStateOf("Main Road, Near Bus Stand") }
    var district by remember { mutableStateOf("Guntur") }
    var mandal by remember { mutableStateOf("Tenali") }
    var village by remember { mutableStateOf("Kolanukonda") }
    var phone by remember { mutableStateOf("9849123456") }
    var packSize by remember { mutableStateOf("50 kg Bag") }
    var qtyInput by remember { mutableStateOf("150") }
    var priceInput by remember { mutableStateOf("1450") }
    var status by remember { mutableStateOf(StockStatus.IN_STOCK) }
    var submittedMessage by remember { mutableStateOf<String?>(null) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        contentPadding = PaddingValues(bottom = 90.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            Text(
                text = if (isTe) "షాపు నిల్వ నమోదు (Add Retail Availability)" else "Publish Real Shop Stock Availability",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )
            Text(
                text = if (isTe)
                    "నిల్వ సమాచారంలో ఖచ్చితమైన తేదీ/సమయ ముద్ర వేయబడుతుంది. రైతులు నిజ సమయ లభ్యతను చూడగలరు."
                else
                    "Updates are stamped with exact current timestamp so farmers see verified, live availability.",
                style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
            )
        }

        submittedMessage?.let { msg ->
            item {
                Surface(color = Color(0xFFE8F5E9), shape = RoundedCornerShape(8.dp)) {
                    Text(text = msg, color = Color(0xFF2E7D32), modifier = Modifier.padding(12.dp), fontWeight = FontWeight.Bold)
                }
            }
        }

        item {
            OutlinedTextField(
                value = shopName,
                onValueChange = { shopName = it },
                label = { Text(if (isTe) "డీలర్ / షాపు పేరు" else "Shop / Distributor Name") },
                modifier = Modifier.fillMaxWidth()
            )
        }
        item {
            OutlinedTextField(
                value = shopAddress,
                onValueChange = { shopAddress = it },
                label = { Text(if (isTe) "చిరునామా" else "Shop Street Address") },
                modifier = Modifier.fillMaxWidth()
            )
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
                    value = village,
                    onValueChange = { village = it },
                    label = { Text(YuktiStrings.get("village_label", language)) },
                    modifier = Modifier.weight(1f)
                )
                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text(if (isTe) "ఫోన్ నంబర్" else "Contact Phone") },
                    modifier = Modifier.weight(1f)
                )
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = packSize,
                    onValueChange = { packSize = it },
                    label = { Text(if (isTe) "ప్యాకింగ్ పరిమాణం" else "Pack Size") },
                    modifier = Modifier.weight(1f)
                )
                OutlinedTextField(
                    value = qtyInput,
                    onValueChange = { qtyInput = it },
                    label = { Text(if (isTe) "నిల్వ సంఖ్య" else "Available Qty") },
                    modifier = Modifier.weight(1f)
                )
            }
        }
        item {
            OutlinedTextField(
                value = priceInput,
                onValueChange = { priceInput = it },
                label = { Text(if (isTe) "ప్రస్తుత రిటైల్ ధర (₹)" else "Current Retail Price (₹)") },
                modifier = Modifier.fillMaxWidth()
            )
        }
        item {
            Button(
                onClick = {
                    val prod = selectedProduct ?: products.firstOrNull()
                    val pId = prod?.id ?: 1L
                    val pName = prod?.productName ?: "Verified Agri Fertilizer"
                    val pCat = prod?.category ?: ProductCategory.FERTILIZERS
                    val qty = qtyInput.toIntOrNull() ?: 100
                    val prc = priceInput.toDoubleOrNull() ?: 1400.0

                    onAddStock(
                        pId, pName, pCat, shopName, shopAddress, district, mandal, village, phone, packSize, qty, prc, status
                    )
                    submittedMessage = if (isTe) "స్టాక్ విజయవంతంగా నమోదు చేయబడింది!" else "Stock successfully published with real timestamp!"
                },
                colors = ButtonDefaults.buttonColors(containerColor = AgriGreenPrimary),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Default.Publish, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(YuktiStrings.get("btn_add_stock", language), fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun EnquiryItemCard(
    enquiry: EnquiryEntity,
    language: String,
    onReply: (String) -> Unit
) {
    val isTe = language == "te"
    var showReplyInput by remember { mutableStateOf(false) }
    var replyText by remember { mutableStateOf("") }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(enquiry.subject, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleSmall)
            Text("From: ${enquiry.senderName} (${enquiry.senderPhone})", style = MaterialTheme.typography.labelSmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant))
            Spacer(modifier = Modifier.height(6.dp))
            Text(enquiry.message, style = MaterialTheme.typography.bodyMedium)

            if (enquiry.replyMessage.isNotBlank()) {
                Spacer(modifier = Modifier.height(8.dp))
                Surface(color = Color(0xFFE8F5E9), shape = RoundedCornerShape(6.dp), modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = "Your Reply: ${enquiry.replyMessage}",
                        style = MaterialTheme.typography.bodySmall.copy(color = Color(0xFF1B5E20)),
                        modifier = Modifier.padding(8.dp)
                    )
                }
            } else {
                if (showReplyInput) {
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = replyText,
                        onValueChange = { replyText = it },
                        label = { Text(if (isTe) "రైతుకు సమాధానం" else "Reply to Farmer") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Button(
                        onClick = {
                            if (replyText.isNotBlank()) {
                                onReply(replyText)
                                showReplyInput = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AgriGreenPrimary)
                    ) {
                        Text(YuktiStrings.get("submit", language))
                    }
                } else {
                    Spacer(modifier = Modifier.height(6.dp))
                    TextButton(onClick = { showReplyInput = true }) {
                        Icon(Icons.Default.Reply, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(if (isTe) "సమాధానం ఇవ్వండి" else "Reply", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddProductDialog(
    language: String,
    onDismiss: () -> Unit,
    onSubmit: (
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
    ) -> Unit
) {
    val isTe = language == "te"

    var name by remember { mutableStateOf("") }
    var brand by remember { mutableStateOf("") }
    var category by remember { mutableStateOf(ProductCategory.FERTILIZERS) }
    var nutrients by remember { mutableStateOf("N:19%, P:19%, K:19%") }
    var crops by remember { mutableStateOf("Paddy, Cotton, Chilli") }
    var dosage by remember { mutableStateOf("5-7 kg / acre") }
    var method by remember { mutableStateOf("Foliar spray / Fertigation") }
    var declaredPriceInput by remember { mutableStateOf("1250") }
    var mrpInput by remember { mutableStateOf("1400") }
    var regNo by remember { mutableStateOf("AP/AGR/REG-88219") }
    var desc by remember { mutableStateOf("Water soluble balanced plant nutrition for vegetative and tillering stage.") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(YuktiStrings.get("btn_add_product", language), fontWeight = FontWeight.Bold) },
        text = {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 440.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text(if (isTe) "ఉత్పత్తి పేరు" else "Product Name") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = brand,
                        onValueChange = { brand = it },
                        label = { Text(if (isTe) "బ్రాండ్ పేరు" else "Brand Name") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = category == ProductCategory.SEEDS,
                            onClick = { category = ProductCategory.SEEDS },
                            label = { Text(YuktiStrings.get("products_seeds", language)) }
                        )
                        FilterChip(
                            selected = category == ProductCategory.FERTILIZERS,
                            onClick = { category = ProductCategory.FERTILIZERS },
                            label = { Text(YuktiStrings.get("products_fertilizers", language)) }
                        )
                        FilterChip(
                            selected = category == ProductCategory.PESTICIDES,
                            onClick = { category = ProductCategory.PESTICIDES },
                            label = { Text(YuktiStrings.get("products_pesticides", language)) }
                        )
                    }
                }
                item {
                    OutlinedTextField(
                        value = nutrients,
                        onValueChange = { nutrients = it },
                        label = { Text(YuktiStrings.get("nutrients_label", language)) },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = crops,
                        onValueChange = { crops = it },
                        label = { Text(if (isTe) "అనువైన పంటలు" else "Suitable Crops") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = dosage,
                        onValueChange = { dosage = it },
                        label = { Text(YuktiStrings.get("dosage_label", language)) },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = declaredPriceInput,
                            onValueChange = { declaredPriceInput = it },
                            label = { Text(if (isTe) "ప్రకటించిన ధర (₹)" else "Declared Price (₹)") },
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = mrpInput,
                            onValueChange = { mrpInput = it },
                            label = { Text("MRP (₹)") },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
                item {
                    OutlinedTextField(
                        value = regNo,
                        onValueChange = { regNo = it },
                        label = { Text(if (isTe) "ప్రభుత్వ రిజిస్ట్రేషన్ సంఖ్య" else "Govt Registration No.") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = desc,
                        onValueChange = { desc = it },
                        label = { Text(if (isTe) "వివరణ" else "Description") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank()) {
                        onSubmit(
                            name, brand, "Coromandel Agritech", category, "Water Soluble",
                            desc, nutrients, crops, "Vegetative", dosage, method,
                            "1 kg, 5 kg, 25 kg", mrpInput.toDoubleOrNull() ?: 1400.0,
                            declaredPriceInput.toDoubleOrNull() ?: 1250.0,
                            "2025-01-01", "2027-01-01", regNo, ""
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
