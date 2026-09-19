package com.example.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "farmer_lands")
data class LandRecordEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val farmerId: String,
    val surveyNumber: String,
    val state: String,
    val district: String,
    val mandal: String,
    val village: String,
    val totalAreaAcres: Double,
    val soilType: String, // Black soil, Red soil, Alluvial, Sandy loam
    val irrigationType: String, // Borewell, Canal, Rainfed, Drip
    val boundaryPointsJson: String, // JSON array of [lat, lng]
    val centerLat: Double,
    val centerLng: Double,
    val notes: String = "",
    val createdAt: Long = System.currentTimeMillis()
)
