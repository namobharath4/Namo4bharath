package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
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
import com.example.ui.AiMessage
import com.example.ui.i18n.YuktiStrings
import com.example.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AiAssistantScreen(
    language: String,
    messages: List<AiMessage>,
    isLoading: Boolean,
    onSendMessage: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val isTe = language == "te"
    var inputText by remember { mutableStateOf("") }
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()

    val quickQuestions = remember(isTe) {
        if (isTe) listOf(
            "వరికి AWD నీటిపారుదల పద్ధతి ఎలా అమలు చేయాలి?",
            "NPK 19:19:19 ఎరువుల వినియోగం మరియు మోతాదు చెప్పండి",
            "వరిలో మొగిపురుగు నివారణకు రక్షణ చర్యలు ఏమిటి?",
            "ట్రాక్టర్ అద్దెకు తీసుకునేటప్పుడు డీజిల్ నిబంధన ఎలా సరిచూసుకోవాలి?"
        ) else listOf(
            "How to implement Alternate Wetting & Drying (AWD) for rice?",
            "Explain NPK 19:19:19 fertilizer usage and precautions",
            "What are safety measures when spraying crop pesticides?",
            "How does YUKTI Savings Calculator compare rent vs buy?"
        )
    }

    LaunchedEffect(messages.size, isLoading) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(messages.size)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(AgriGreenPrimary),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = if (isTe) "యుక్తి AI వ్యవసాయ సహాయకుడు" else "YUKTI AI Agricultural Assistant",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                            )
                            Text(
                                text = if (isTe) "జెమిని ఆధారిత సలహాదారు" else "Powered by Gemini 2.5 Flash",
                                style = MaterialTheme.typography.labelSmall.copy(color = AgriGreenPrimary, fontSize = 10.sp)
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
            // Safety and Disclaimer Banner
            Surface(
                color = SoilContainer.copy(alpha = 0.5f),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Shield, contentDescription = null, tint = SoilBrown, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isTe)
                            "AI సమాచారం సాధారణ సలహా కొరకు మాత్రమే. రసాయనాల వాడకంలో లేబుల్ సూచనలు మరియు వ్యవసాయ అధికారుల సలహా తప్పనిసరి."
                        else
                            "AI responses are advisory. Always verify chemical labels and consult your local Agriculture Officer.",
                        style = MaterialTheme.typography.labelSmall.copy(color = SoilOnContainer, fontSize = 10.sp)
                    )
                }
            }

            // Chat Messages List
            LazyColumn(
                state = listState,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                contentPadding = PaddingValues(vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                if (messages.isEmpty()) {
                    item {
                        Card(
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f))
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = if (isTe) "నమస్కారం! నేను మీ యుక్తి AI సహాయకుడిని." else "Welcome! I am your YUKTI Agricultural Advisor.",
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = if (isTe)
                                        "మీ పంటలు, నీటిపారుదల, ఎరువుల మోతాదు, పురుగుమందుల భద్రత లేదా యంత్రాల అద్దెల గురించి ఏదైనా అడగండి."
                                    else
                                        "Ask anything about crops, irrigation schedules, fertilizer ratios, pesticide safety, or machinery rentals.",
                                    style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant)
                                )
                            }
                        }
                    }
                }

                items(messages) { msg ->
                    ChatBubble(message = msg, isTe = isTe)
                }

                if (isLoading) {
                    item {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(8.dp)
                        ) {
                            CircularProgressIndicator(modifier = Modifier.size(18.dp), color = AgriGreenPrimary, strokeWidth = 2.dp)
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = if (isTe) "యుక్తి AI విశ్లేషిస్తోంది..." else "YUKTI AI is preparing guidance...",
                                style = MaterialTheme.typography.bodySmall.copy(color = AgriGreenPrimary)
                            )
                        }
                    }
                }
            }

            // Quick Prompt Suggestions Chips
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(quickQuestions) { q ->
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant,
                        modifier = Modifier.clickable {
                            onSendMessage(q)
                        }
                    ) {
                        Text(
                            text = q,
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Medium),
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                        )
                    }
                }
            }

            // Message Input Bar
            Surface(
                tonalElevation = 3.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = inputText,
                        onValueChange = { inputText = it },
                        placeholder = { Text(if (isTe) "మీ ప్రశ్నను ఇక్కడ అడగండి..." else "Ask crop or farming question...") },
                        shape = RoundedCornerShape(24.dp),
                        modifier = Modifier.weight(1f)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    IconButton(
                        onClick = {
                            if (inputText.isNotBlank() && !isLoading) {
                                onSendMessage(inputText.trim())
                                inputText = ""
                            }
                        },
                        colors = IconButtonDefaults.filledIconButtonColors(containerColor = AgriGreenPrimary)
                    ) {
                        Icon(Icons.Default.Send, contentDescription = "Send", tint = Color.White)
                    }
                }
            }
        }
    }
}

@Composable
fun ChatBubble(message: AiMessage, isTe: Boolean) {
    val isUser = message.sender == "user"

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
    ) {
        if (!isUser) {
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(AgriGreenPrimary),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Spa, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
            }
            Spacer(modifier = Modifier.width(8.dp))
        }

        Surface(
            shape = RoundedCornerShape(
                topStart = 16.dp,
                topEnd = 16.dp,
                bottomStart = if (isUser) 16.dp else 4.dp,
                bottomEnd = if (isUser) 4.dp else 16.dp
            ),
            color = if (isUser) AgriGreenPrimary else MaterialTheme.colorScheme.surfaceVariant,
            contentColor = if (isUser) Color.White else MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.widthIn(max = 300.dp)
        ) {
            Text(
                text = message.text,
                style = MaterialTheme.typography.bodyMedium.copy(lineHeight = 20.sp),
                modifier = Modifier.padding(12.dp)
            )
        }
    }
}
