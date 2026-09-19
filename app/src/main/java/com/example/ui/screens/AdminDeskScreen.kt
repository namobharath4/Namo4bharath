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
import com.example.ui.components.StatusBadge
import com.example.ui.i18n.YuktiStrings
import com.example.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminDeskScreen(
    language: String,
    companies: List<CompanyEntity>,
    products: List<ProductEntity>,
    reportedReviews: List<ReviewEntity>,
    auditLogs: List<AuditLogEntity>,
    onVerifyCompany: (companyId: String, status: VerificationStatus, feedback: String) -> Unit,
    onVerifyProduct: (productId: Long, status: VerificationStatus, feedback: String) -> Unit,
    onModerateReview: (reviewId: Long, delete: Boolean) -> Unit,
    modifier: Modifier = Modifier
) {
    val isTe = language == "te"
    var selectedTab by remember { mutableStateOf(0) } // 0: Products, 1: Companies, 2: Reviews, 3: Audit Log

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.AdminPanelSettings, contentDescription = null, tint = AgriGreenPrimary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = YuktiStrings.get("admin_portal_title", language),
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                            )
                            Text(
                                text = if (isTe) "అధికారిక లైసెన్స్ & ఉత్పత్తుల ధృవీకరణ" else "Official Regulatory Verification Desk",
                                style = MaterialTheme.typography.labelSmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                            )
                        }
                    }
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
            ScrollableTabRow(
                selectedTabIndex = selectedTab,
                containerColor = MaterialTheme.colorScheme.surface,
                edgePadding = 16.dp
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("Product Approvals (${products.size})", fontWeight = FontWeight.Bold) }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("Company Licenses (${companies.size})", fontWeight = FontWeight.Bold) }
                )
                Tab(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    text = { Text("Reported Reviews (${reportedReviews.size})", fontWeight = FontWeight.Bold) }
                )
                Tab(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    text = { Text("Audit Trail (${auditLogs.size})", fontWeight = FontWeight.Bold) }
                )
            }

            when (selectedTab) {
                0 -> {
                    // Products Verification Tab
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp),
                        contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        if (products.isEmpty()) {
                            item {
                                EmptyStateCard(
                                    icon = Icons.Default.FactCheck,
                                    title = "No Products Awaiting Review",
                                    description = "All submitted product specifications have been processed."
                                )
                            }
                        } else {
                            items(products, key = { it.id }) { product ->
                                AdminProductItemCard(
                                    product = product,
                                    language = language,
                                    onVerify = { status, notes ->
                                        onVerifyProduct(product.id, status, notes)
                                    }
                                )
                            }
                        }
                    }
                }
                1 -> {
                    // Companies Licenses Tab
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp),
                        contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        if (companies.isEmpty()) {
                            item {
                                EmptyStateCard(
                                    icon = Icons.Default.CorporateFare,
                                    title = "No Registered Companies",
                                    description = "Submitted company registrations will appear here for verification."
                                )
                            }
                        } else {
                            items(companies, key = { it.id }) { company ->
                                AdminCompanyItemCard(
                                    company = company,
                                    language = language,
                                    onVerify = { status, notes ->
                                        onVerifyCompany(company.id, status, notes)
                                    }
                                )
                            }
                        }
                    }
                }
                2 -> {
                    // Reported Reviews Tab
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp),
                        contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        if (reportedReviews.isEmpty()) {
                            item {
                                EmptyStateCard(
                                    icon = Icons.Default.ThumbUp,
                                    title = "No Flagged Reviews",
                                    description = "User reports and flagged comments will appear here for moderation."
                                )
                            }
                        } else {
                            items(reportedReviews, key = { it.id }) { rev ->
                                Card(
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(12.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                                ) {
                                    Column(modifier = Modifier.padding(14.dp)) {
                                        Text("Target: ${rev.targetName} (${rev.targetType.name})", fontWeight = FontWeight.Bold)
                                        Text("By: ${rev.authorName} (${rev.authorRole.name}) • Rating: ${rev.rating}★", style = MaterialTheme.typography.bodySmall)
                                        Spacer(modifier = Modifier.height(6.dp))
                                        Text("\"${rev.reviewText}\"", style = MaterialTheme.typography.bodyMedium)
                                        Spacer(modifier = Modifier.height(10.dp))
                                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                            Button(
                                                onClick = { onModerateReview(rev.id, true) },
                                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFC62828))
                                            ) {
                                                Text("Delete Review")
                                            }
                                            OutlinedButton(
                                                onClick = { onModerateReview(rev.id, false) }
                                            ) {
                                                Text("Dismiss Flag")
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                3 -> {
                    // Chronological Audit Trail
                    val dateFormat = remember { SimpleDateFormat("dd/MM/yyyy HH:mm:ss", Locale.getDefault()) }
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 16.dp),
                        contentPadding = PaddingValues(top = 12.dp, bottom = 90.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        if (auditLogs.isEmpty()) {
                            item {
                                EmptyStateCard(
                                    icon = Icons.Default.History,
                                    title = "Audit Trail Empty",
                                    description = "All official approval and rejection decisions are logged here permanently."
                                )
                            }
                        } else {
                            items(auditLogs, key = { it.id }) { log ->
                                Card(
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(10.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                                ) {
                                    Column(modifier = Modifier.padding(12.dp)) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text(log.action, fontWeight = FontWeight.Bold, color = AgriGreenPrimary, style = MaterialTheme.typography.labelMedium)
                                            Text(dateFormat.format(Date(log.timestamp)), style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp))
                                        }
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text("Admin: ${log.adminId} • Entity: ${log.entityType} (${log.entityId})", style = MaterialTheme.typography.labelSmall)
                                        Text(log.details, style = MaterialTheme.typography.bodySmall)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AdminProductItemCard(
    product: ProductEntity,
    language: String,
    onVerify: (VerificationStatus, String) -> Unit
) {
    val isTe = language == "te"
    var showActionPanel by remember { mutableStateOf(false) }
    var feedbackText by remember { mutableStateOf("") }

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
                Text(product.category.name, style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = AgriGreenPrimary))
                StatusBadge(text = product.verificationStatus.name, status = product.verificationStatus)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(product.productName, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
            Text("Company: ${product.companyName} • Reg: ${product.registrationNumber}", style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant))
            Text("Declared Price: ₹${product.companyDeclaredPrice} (MRP: ₹${product.mrp})", style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold))
            Text("Nutrients: ${product.nutrientsJson} • Dosage: ${product.dosage}", style = MaterialTheme.typography.bodySmall)

            if (product.regulatoryNotes.isNotBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text("Notes: ${product.regulatoryNotes}", style = MaterialTheme.typography.labelSmall.copy(color = SoilBrown))
            }

            Spacer(modifier = Modifier.height(8.dp))
            if (showActionPanel) {
                OutlinedTextField(
                    value = feedbackText,
                    onValueChange = { feedbackText = it },
                    label = { Text("Regulatory Notes / Feedback") },
                    placeholder = { Text("e.g. License checked with State Agriculture Department. Approved.") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = { onVerify(VerificationStatus.APPROVED, feedbackText.ifBlank { "Approved by Department" }) },
                        colors = ButtonDefaults.buttonColors(containerColor = AgriGreenPrimary),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(YuktiStrings.get("btn_approve", language))
                    }
                    Button(
                        onClick = { onVerify(VerificationStatus.CORRECTION_REQUIRED, feedbackText.ifBlank { "Correction required in registration" }) },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF57F17)),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(YuktiStrings.get("btn_request_correction", language), fontSize = 11.sp)
                    }
                    Button(
                        onClick = { onVerify(VerificationStatus.REJECTED, feedbackText.ifBlank { "Invalid credentials" }) },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFC62828)),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(YuktiStrings.get("btn_reject", language))
                    }
                }
            } else {
                OutlinedButton(
                    onClick = { showActionPanel = true },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Take Regulatory Action")
                }
            }
        }
    }
}

@Composable
fun AdminCompanyItemCard(
    company: CompanyEntity,
    language: String,
    onVerify: (VerificationStatus, String) -> Unit
) {
    var showActionPanel by remember { mutableStateOf(false) }
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
                Text(company.category, style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = AgriGreenPrimary))
                StatusBadge(text = company.verificationStatus.name, status = company.verificationStatus)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(company.companyName, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
            Text("License: ${company.licenseNumber}", style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant))
            Text("Officer: ${company.contactPerson} • Phone: ${company.mobile}", style = MaterialTheme.typography.bodySmall)
            Text("Address: ${company.address}, ${company.district}, ${company.state}", style = MaterialTheme.typography.bodySmall)

            Spacer(modifier = Modifier.height(8.dp))
            if (showActionPanel) {
                OutlinedTextField(
                    value = notesText,
                    onValueChange = { notesText = it },
                    label = { Text("License Verification Findings") },
                    placeholder = { Text("e.g. License verified in portal.") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = { onVerify(VerificationStatus.VERIFIED, notesText.ifBlank { "License Verified" }) },
                        colors = ButtonDefaults.buttonColors(containerColor = AgriGreenPrimary),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Verify License")
                    }
                    Button(
                        onClick = { onVerify(VerificationStatus.SUSPENDED, notesText.ifBlank { "Suspended" }) },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFC62828)),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Suspend")
                    }
                }
            } else {
                OutlinedButton(
                    onClick = { showActionPanel = true },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Verify License")
                }
            }
        }
    }
}
