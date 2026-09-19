package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.models.*
import com.example.ui.i18n.YuktiStrings
import com.example.ui.theme.*

@Composable
fun YuktiHeader(
    currentRole: UserRole,
    language: String,
    onRoleSelect: (UserRole) -> Unit,
    onToggleLanguage: () -> Unit,
    modifier: Modifier = Modifier
) {
    var showRoleMenu by RememberRoleMenuState()

    Surface(
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 3.dp,
        modifier = modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // YUKTI Logo & Brand
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    YuktiLogoBadge()
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "YUKTI",
                                style = MaterialTheme.typography.titleLarge.copy(
                                    fontWeight = FontWeight.ExtraBold,
                                    letterSpacing = 1.sp,
                                    color = AgriGreenPrimary
                                )
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "యుక్తి",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontWeight = FontWeight.SemiBold,
                                    color = SoilBrown
                                )
                            )
                        }
                        Text(
                            text = if (language == "te") "వ్యవసాయ సాంకేతిక వేదిక" else "Agri-Tech Platform",
                            style = MaterialTheme.typography.labelSmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                        )
                    }
                }

                // Controls: Language Switcher & Role Selector
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Language Switcher Button
                    OutlinedButton(
                        onClick = onToggleLanguage,
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                        ),
                        modifier = Modifier.height(36.dp)
                    ) {
                        Icon(
                            Icons.Default.Translate,
                            contentDescription = "Language",
                            modifier = Modifier.size(16.dp),
                            tint = AgriGreenPrimary
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (language == "te") "English" else "తెలుగు",
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                            color = AgriGreenPrimary
                        )
                    }

                    // Role Switcher Chip
                    Box {
                        FilterChip(
                            selected = true,
                            onClick = { showRoleMenu = true },
                            label = {
                                Text(
                                    text = when (currentRole) {
                                        UserRole.FARMER -> if (language == "te") "రైతు" else "Farmer"
                                        UserRole.COMPANY -> if (language == "te") "కంపెనీ" else "Company"
                                        UserRole.EQUIPMENT_PROVIDER -> if (language == "te") "యంత్రాలు" else "Equipment"
                                        UserRole.ADMIN -> if (language == "te") "అడ్మిన్" else "Admin"
                                    },
                                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                )
                            },
                            trailingIcon = {
                                Icon(Icons.Default.ArrowDropDown, contentDescription = "Select Role", modifier = Modifier.size(18.dp))
                            },
                            shape = RoundedCornerShape(8.dp),
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = AgriGreenContainer,
                                selectedLabelColor = AgriOnGreenContainer
                            ),
                            modifier = Modifier.height(36.dp)
                        )

                        DropdownMenu(
                            expanded = showRoleMenu,
                            onDismissRequest = { showRoleMenu = false }
                        ) {
                            UserRole.values().forEach { role ->
                                DropdownMenuItem(
                                    text = {
                                        Column {
                                            Text(
                                                text = when (role) {
                                                    UserRole.FARMER -> if (language == "te") "రైతు (Farmer)" else "Farmer"
                                                    UserRole.COMPANY -> if (language == "te") "కంపెనీ (Agri Company)" else "Agri Company"
                                                    UserRole.EQUIPMENT_PROVIDER -> if (language == "te") "యంత్రాల యజమాని (Equipment)" else "Equipment & Labour"
                                                    UserRole.ADMIN -> if (language == "te") "అధికారి (Admin Desk)" else "Internal Admin"
                                                },
                                                fontWeight = if (role == currentRole) FontWeight.Bold else FontWeight.Normal
                                            )
                                        }
                                    },
                                    onClick = {
                                        onRoleSelect(role)
                                        showRoleMenu = false
                                    },
                                    leadingIcon = {
                                        val icon = when (role) {
                                            UserRole.FARMER -> Icons.Default.Agriculture
                                            UserRole.COMPANY -> Icons.Default.Business
                                            UserRole.EQUIPMENT_PROVIDER -> Icons.Default.Build
                                            UserRole.ADMIN -> Icons.Default.VerifiedUser
                                        }
                                        Icon(icon, contentDescription = null, tint = AgriGreenPrimary)
                                    }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun RememberRoleMenuState(): MutableState<Boolean> = remember { mutableStateOf(false) }

@Composable
fun YuktiLogoBadge(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .size(38.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(
                brush = Brush.linearGradient(
                    colors = listOf(AgriGreenPrimary, AgriGreenLight)
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = Icons.Default.Spa,
            contentDescription = "YUKTI Logo",
            tint = HarvestGoldContainer,
            modifier = Modifier.size(24.dp)
        )
    }
}

@Composable
fun StatusBadge(
    text: String,
    status: VerificationStatus,
    modifier: Modifier = Modifier
) {
    val (bgColor, textColor) = when (status) {
        VerificationStatus.APPROVED, VerificationStatus.VERIFIED -> Pair(Color(0xFFE8F5E9), Color(0xFF2E7D32))
        VerificationStatus.PENDING, VerificationStatus.UNDER_REVIEW, VerificationStatus.SUBMITTED -> Pair(Color(0xFFFFF8E1), Color(0xFFF57F17))
        VerificationStatus.CORRECTION_REQUIRED -> Pair(Color(0xFFFFEBEE), Color(0xFFC62828))
        VerificationStatus.REJECTED, VerificationStatus.SUSPENDED -> Pair(Color(0xFFFFEBEE), Color(0xFFD32F2F))
        VerificationStatus.DRAFT -> Pair(Color(0xFFF5F5F5), Color(0xFF616161))
    }

    Surface(
        color = bgColor,
        shape = RoundedCornerShape(6.dp),
        modifier = modifier
    ) {
        Text(
            text = text,
            color = textColor,
            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
        )
    }
}

@Composable
fun StockBadge(status: StockStatus, language: String, modifier: Modifier = Modifier) {
    val isTe = language == "te"
    val (label, bg, fg) = when (status) {
        StockStatus.IN_STOCK -> Triple(if (isTe) "నిల్వ ఉంది" else "IN STOCK", Color(0xFFE8F5E9), Color(0xFF1B5E20))
        StockStatus.LOW_STOCK -> Triple(if (isTe) "తక్కువ నిల్వ" else "LOW STOCK", Color(0xFFFFF3CD), Color(0xFFB78103))
        StockStatus.OUT_OF_STOCK -> Triple(if (isTe) "నిల్వ లేదు" else "OUT OF STOCK", Color(0xFFFFEBEE), Color(0xFFC62828))
        StockStatus.NOT_UPDATED -> Triple(if (isTe) "అప్‌డేట్ కాలేదు" else "NOT UPDATED", Color(0xFFEEEEEE), Color(0xFF616161))
    }

    Surface(
        color = bg,
        shape = RoundedCornerShape(6.dp),
        modifier = modifier
    ) {
        Text(
            text = label,
            color = fg,
            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
        )
    }
}

@Composable
fun RatingStars(
    rating: Int,
    maxRating: Int = 5,
    onRatingSelected: ((Int) -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    Row(modifier = modifier, verticalAlignment = Alignment.CenterVertically) {
        for (i in 1..maxRating) {
            val isFilled = i <= rating
            Icon(
                imageVector = if (isFilled) Icons.Default.Star else Icons.Outlined.StarBorder,
                contentDescription = "$i Stars",
                tint = if (isFilled) HarvestGold else Color.Gray,
                modifier = Modifier
                    .size(20.dp)
                    .then(
                        if (onRatingSelected != null) {
                            Modifier.clickable { onRatingSelected(i) }
                        } else Modifier
                    )
            )
        }
    }
}

@Composable
fun EmptyStateCard(
    icon: ImageVector,
    title: String,
    description: String,
    actionButtonText: String? = null,
    onActionClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(28.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.surface),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = AgriGreenPrimary,
                    modifier = Modifier.size(36.dp)
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
            if (actionButtonText != null && onActionClick != null) {
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = onActionClick,
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AgriGreenPrimary)
                ) {
                    Text(actionButtonText, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
