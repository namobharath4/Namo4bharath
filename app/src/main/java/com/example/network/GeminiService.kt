package com.example.network

import com.example.BuildConfig
import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Query
import java.util.concurrent.TimeUnit

@JsonClass(generateAdapter = true)
data class GeminiPart(
    @Json(name = "text") val text: String? = null
)

@JsonClass(generateAdapter = true)
data class GeminiContent(
    @Json(name = "parts") val parts: List<GeminiPart>,
    @Json(name = "role") val role: String? = "user"
)

@JsonClass(generateAdapter = true)
data class GeminiRequest(
    @Json(name = "contents") val contents: List<GeminiContent>,
    @Json(name = "systemInstruction") val systemInstruction: GeminiContent? = null
)

@JsonClass(generateAdapter = true)
data class GeminiCandidate(
    @Json(name = "content") val content: GeminiContent? = null
)

@JsonClass(generateAdapter = true)
data class GeminiResponse(
    @Json(name = "candidates") val candidates: List<GeminiCandidate>? = null
)

interface GeminiApi {
    @POST("v1beta/models/gemini-3.5-flash:generateContent")
    suspend fun generateContent(
        @Query("key") apiKey: String,
        @Body request: GeminiRequest
    ): GeminiResponse
}

object GeminiApiClient {
    private const val BASE_URL = "https://generativelanguage.googleapis.com/"

    private val moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .build()

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    val api: GeminiApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
            .create(GeminiApi::class.java)
    }

    suspend fun askAssistant(
        prompt: String,
        farmerContext: String,
        language: String // "en" or "te"
    ): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isBlank() || apiKey == "MY_GEMINI_API_KEY") {
            return@withContext if (language == "te") {
                "గమనిక: Gemini API Key సెట్ చేయబడలేదు. AI Studio Secrets ప్యానెల్‌లో GEMINI_API_KEY ను కాన్ఫిగర్ చేయండి. వ్యవసాయ సలహాల కోసం స్థానిక వ్యవసాయ అధికారిని సంప్రదించండి."
            } else {
                "Notice: Gemini API Key is not configured. Please set GEMINI_API_KEY in the AI Studio Secrets panel. For immediate guidance, please consult your local Agricultural Extension Officer."
            }
        }

        val systemInstructionText = """
            You are YUKTI AI (యుక్తి AI వ్యవసాయ సహాయకుడు), a dedicated Indian agricultural advisory assistant.
            You help farmers make informed decisions about crops, fertilizers, irrigation, pest symptoms, and equipment.
            
            Strict Guidelines:
            1. Clearly distinguish general agricultural guidance from verified government data.
            2. Never fabricate government land records, legal ownership, or product registrations.
            3. For agro-chemicals and pesticides, always include standard safety precautions (wear protective gear, follow label dosage, store safely away from children).
            4. If the farmer asks in Telugu or preferred language is 'te', respond in clear, respectful, easy-to-understand Telugu (తెలుగు). Otherwise, respond in clear English.
            5. Always recommend consulting local agricultural university / Krishi Vigyan Kendra (KVK) experts for farm-specific decisions.
            
            Farmer Context:
            $farmerContext
        """.trimIndent()

        val request = GeminiRequest(
            contents = listOf(
                GeminiContent(
                    parts = listOf(GeminiPart(text = prompt)),
                    role = "user"
                )
            ),
            systemInstruction = GeminiContent(
                parts = listOf(GeminiPart(text = systemInstructionText))
            )
        )

        try {
            val response = api.generateContent(apiKey, request)
            response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text
                ?: if (language == "te") "క్షమించండి, సమాధానం రూపొందించలేకపోయాము." else "Unable to generate an advisory response."
        } catch (e: Exception) {
            if (language == "te") {
                "AI సహాయకుడు లోపం: ${e.localizedMessage ?: "నెట్‌వర్క్ సమస్య"}. దయచేసి మళ్లీ ప్రయత్నించండి."
            } else {
                "AI Assistant error: ${e.localizedMessage ?: "Network issue"}. Please try again."
            }
        }
    }
}
