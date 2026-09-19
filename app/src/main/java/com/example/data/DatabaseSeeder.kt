package com.example.data

import com.example.data.models.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object DatabaseSeeder {
    suspend fun seedIfEmpty(repository: YuktiRepository) = withContext(Dispatchers.IO) {
        val existingSession = repository.getActiveSessionOnce()
        if (existingSession != null) return@withContext // already seeded

        // 1. Seed Initial Farmer Session
        val defaultFarmer = UserSessionEntity(
            id = "FARMER_USER_1",
            role = UserRole.FARMER,
            fullName = "Ramesh Naidu",
            mobile = "9848022334",
            email = "ramesh.farmer@example.com",
            state = "Andhra Pradesh",
            district = "Guntur",
            mandal = "Tenali",
            village = "Kolanukonda",
            preferredLanguage = "en",
            isVerified = true
        )
        repository.setSession(defaultFarmer)

        // 2. Seed Verified Companies
        val coromandel = CompanyEntity(
            id = "COMP_COROMANDEL",
            companyName = "Coromandel International Ltd",
            licenseNumber = "AP/FERT/LIC-2024/0082",
            category = "Fertilizers & Nutrients",
            contactPerson = "Dr. K. V. Sharma",
            mobile = "0891-2567890",
            email = "regulatory@coromandel.biz",
            address = "Coromandel House, SP Road",
            state = "Andhra Pradesh",
            district = "Visakhapatnam",
            website = "https://www.coromandel.biz",
            verificationStatus = VerificationStatus.VERIFIED
        )
        val mahyco = CompanyEntity(
            id = "COMP_MAHYCO",
            companyName = "Maharashtra Hybrid Seeds Company (Mahyco)",
            licenseNumber = "TS/SEED/LIC-2023/1190",
            category = "Seeds & Biotechnology",
            contactPerson = "S. N. Reddy",
            mobile = "040-27891234",
            email = "seeds.regulatory@mahyco.biz",
            address = "Agri Innovation Park, Shamirpet",
            state = "Telangana",
            district = "Hyderabad",
            website = "https://www.mahyco.com",
            verificationStatus = VerificationStatus.VERIFIED
        )
        repository.registerCompany(coromandel)
        repository.registerCompany(mahyco)

        // 3. Seed Equipment Provider
        val provider = EquipmentProviderEntity(
            id = "PROV_KRISHNA_AGRI",
            providerName = "Srinivasa Rao (Tractor & Harvester Services)",
            mobile = "9988776655",
            email = "srinivasa.agri@example.com",
            state = "Andhra Pradesh",
            district = "Krishna",
            village = "Gudivada",
            serviceArea = "Within 25 km radius",
            verificationStatus = VerificationStatus.VERIFIED
        )
        repository.registerProvider(provider)

        // 4. Seed Products
        val prod1 = ProductEntity(
            companyId = coromandel.id,
            companyName = coromandel.companyName,
            productName = "Gromor 19:19:19 (Water Soluble NPK)",
            brandName = "Gromor",
            manufacturerName = "Coromandel International Ltd",
            category = ProductCategory.FERTILIZERS,
            productType = "100% Water Soluble Fertilizer",
            description = "Balanced essential plant nutrients (N, P, K in 1:1:1 ratio) suitable for vegetative and tillering phases.",
            nutrientsJson = "Nitrogen: 19%, Phosphorus: 19%, Potassium: 19%",
            suitableCropsJson = "Paddy, Cotton, Chilli, Maize, Tomato",
            cropStage = "Vegetative & Early Tillering",
            dosage = "5 - 7 grams / litre of water or 1.5 - 2 kg / acre foliar",
            applicationMethod = "Foliar Spray & Fertigation",
            packSizesJson = "1 kg, 5 kg, 25 kg Bag",
            mrp = 1600.0,
            companyDeclaredPrice = 1450.0,
            effectiveDate = "2024-01-01",
            expiryDate = "2027-01-01",
            registrationNumber = "FCO/AP/191919/882",
            regulatoryNotes = "Official FCO Batch Certificate Verified",
            verificationStatus = VerificationStatus.APPROVED
        )

        val prod2 = ProductEntity(
            companyId = coromandel.id,
            companyName = coromandel.companyName,
            productName = "Gromor 28:28:0 Ammonium Phosphate",
            brandName = "Gromor",
            manufacturerName = "Coromandel International Ltd",
            category = ProductCategory.FERTILIZERS,
            productType = "Complex High Nitrogen Fertilizer",
            description = "High nitrogen and water-soluble phosphate for rapid root proliferation and heavy tillering in paddy.",
            nutrientsJson = "Nitrogen: 28%, Available Phosphorus: 28%",
            suitableCropsJson = "Paddy (Rice), Sugarcane, Wheat",
            cropStage = "Basal & First Top Dressing (20-25 days)",
            dosage = "50 kg bag / acre",
            applicationMethod = "Soil broadcast with shallow moisture",
            packSizesJson = "50 kg HDPE Bag",
            mrp = 1750.0,
            companyDeclaredPrice = 1580.0,
            effectiveDate = "2024-01-01",
            expiryDate = "2026-12-31",
            registrationNumber = "FCO/AP/282800/104",
            regulatoryNotes = "Verified by Department of Agriculture",
            verificationStatus = VerificationStatus.APPROVED
        )

        val prod3 = ProductEntity(
            companyId = mahyco.id,
            companyName = mahyco.companyName,
            productName = "Mahyco MRC-7080 Hybrid Paddy Seed",
            brandName = "Mahyco",
            manufacturerName = "Maharashtra Hybrid Seeds Co.",
            category = ProductCategory.SEEDS,
            productType = "Certified Hybrid Rice Seeds",
            description = "Medium duration (125-130 days) hybrid rice seed with high grain weight and built-in tolerance to Brown Planthopper (BPH).",
            nutrientsJson = "Germination: 85% Min, Physical Purity: 98% Min",
            suitableCropsJson = "Paddy / Rice (Kharif & Rabi)",
            cropStage = "Nursery Sowing",
            dosage = "5 - 6 kg seed per acre",
            applicationMethod = "Raised bed nursery followed by transplanting",
            packSizesJson = "3 kg Bag",
            mrp = 1100.0,
            companyDeclaredPrice = 980.0,
            effectiveDate = "2024-03-01",
            expiryDate = "2025-06-30",
            registrationNumber = "SEED/GOI/HYB/2024/77",
            regulatoryNotes = "ISTA certified seed germination test passed",
            verificationStatus = VerificationStatus.APPROVED
        )

        val prod4 = ProductEntity(
            companyId = coromandel.id,
            companyName = coromandel.companyName,
            productName = "Tata Rallis Anant (Cartap 50% SP)",
            brandName = "Rallis",
            manufacturerName = "Rallis India Limited",
            category = ProductCategory.PESTICIDES,
            productType = "Systemic Insecticide",
            description = "Controls stem borer, leaf folder, and whorl maggot in paddy with systemic contact and stomach action.",
            nutrientsJson = "Cartap Hydrochloride 50% SP",
            suitableCropsJson = "Paddy / Rice",
            cropStage = "Vegetative to Panicle Initiation",
            dosage = "400 grams / acre mixed in 200 litres water",
            applicationMethod = "Foliar knapsack spray. Wear rubber gloves and protective face mask.",
            packSizesJson = "250g, 500g, 1 kg",
            mrp = 750.0,
            companyDeclaredPrice = 650.0,
            effectiveDate = "2024-02-01",
            expiryDate = "2026-02-01",
            registrationNumber = "CIB&RC/CIR-8841/CARTAP",
            regulatoryNotes = "Approved by Central Insecticides Board (CIB)",
            verificationStatus = VerificationStatus.APPROVED
        )

        val id1 = repository.saveProduct(prod1)
        val id2 = repository.saveProduct(prod2)
        val id3 = repository.saveProduct(prod3)
        val id4 = repository.saveProduct(prod4)

        // 5. Seed Real Shop Stock Points
        repository.saveStock(
            ShopStockEntity(
                companyId = coromandel.id,
                productId = id1,
                productName = prod1.productName,
                category = prod1.category,
                shopName = "Sri Balaji Krishi Seva Kendra",
                shopAddress = "Station Road, Near Rythu Bazar",
                district = "Guntur",
                mandal = "Tenali",
                village = "Kolanukonda",
                contactPhone = "08644-223344",
                packSize = "25 kg Bag",
                availableQuantity = 120,
                currentPrice = 1450.0,
                status = StockStatus.IN_STOCK
            )
        )

        repository.saveStock(
            ShopStockEntity(
                companyId = mahyco.id,
                productId = id3,
                productName = prod3.productName,
                category = prod3.category,
                shopName = "Kisan Seeds & Fertilizer Depot",
                shopAddress = "Gudivada Main Road",
                district = "Krishna",
                mandal = "Gudivada",
                village = "Mallayapalem",
                contactPhone = "9876543210",
                packSize = "3 kg Bag",
                availableQuantity = 85,
                currentPrice = 980.0,
                status = StockStatus.IN_STOCK
            )
        )

        repository.saveStock(
            ShopStockEntity(
                companyId = coromandel.id,
                productId = id2,
                productName = prod2.productName,
                category = prod2.category,
                shopName = "Raithu Mithra Fertilizers",
                shopAddress = "Market Yard Complex",
                district = "Prakasam",
                mandal = "Ongole",
                village = "Ongole Rural",
                contactPhone = "9440112233",
                packSize = "50 kg Bag",
                availableQuantity = 14,
                currentPrice = 1580.0,
                status = StockStatus.LOW_STOCK
            )
        )

        // 6. Seed Equipment
        repository.saveEquipment(
            EquipmentEntity(
                providerId = provider.id,
                providerName = provider.providerName,
                category = EquipmentCategory.TRACTOR,
                nameModel = "Mahindra 575 DI (45 HP) with Rotavator",
                condition = "Excellent, 2023 Model",
                specifications = "45 HP Engine, Heavy 42-blade Rotavator for wet puddling and dry tilling",
                serviceArea = "Tenali, Kolanukonda, Gudivada (within 20 km)",
                district = "Krishna",
                village = "Gudivada",
                rate = 1200.0,
                pricingUnit = PricingUnit.PER_HOUR,
                dieselFuelTerms = "Farmer provides diesel",
                operatorIncluded = true,
                minBookingDuration = 2,
                transportationCharges = 200.0,
                contactPhone = "9988776655"
            )
        )

        repository.saveEquipment(
            EquipmentEntity(
                providerId = provider.id,
                providerName = "Venkateswara Combine Harvesters",
                category = EquipmentCategory.HARVESTER,
                nameModel = "Kubota DC-68G Rubber Track Paddy Combine Harvester",
                condition = "Fully serviced, Rubber tracks for soft wet soil",
                specifications = "Cuts, threshes and cleans paddy in one pass. Minimum grain loss (<1.5%)",
                serviceArea = "Guntur, Tenali, Mangalagiri",
                district = "Guntur",
                village = "Tenali",
                rate = 2600.0,
                pricingUnit = PricingUnit.PER_ACRE,
                dieselFuelTerms = "Diesel included in rate",
                operatorIncluded = true,
                minBookingDuration = 1,
                transportationCharges = 500.0,
                contactPhone = "9848011223"
            )
        )

        // 7. Seed Initial Farmer Land Record
        repository.saveLand(
            LandRecordEntity(
                farmerId = defaultFarmer.id,
                surveyNumber = "142/2B",
                state = "Andhra Pradesh",
                district = "Guntur",
                mandal = "Tenali",
                village = "Kolanukonda",
                totalAreaAcres = 3.5,
                soilType = "Black Clay Loam (నల్లరేగడి నేల)",
                irrigationType = "Borewell with canal backup (బోరుబావి)",
                boundaryPointsJson = "[{\"x\":120,\"y\":80},{\"x\":280,\"y\":75},{\"x\":295,\"y\":220},{\"x\":105,\"y\":215}]",
                centerLat = 16.2435,
                centerLng = 80.6401,
                notes = "Paddy cultivation in Kharif, Black gram (Minumu) in Rabi."
            )
        )
    }
}
