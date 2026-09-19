package com.example.ui.i18n

object YuktiStrings {
    fun get(key: String, lang: String): String {
        val isTe = lang == "te"
        return when (key) {
            // App Branding & Taglines
            "app_name" -> if (isTe) "యుక్తి (YUKTI)" else "YUKTI"
            "app_subtitle" -> if (isTe) "మీ వ్యవసాయ జ్ఞాన మరియు సాంకేతికత వేదిక" else "Your Agriculture Knowledge & Utility Technology Interface"
            "hero_title" -> if (isTe) "మెరుగైన వ్యవసాయం కోసం సాంకేతికత" else "Technology for Better Farming"
            "hero_sub" -> if (isTe) "మీ భూమిని అర్థం చేసుకోండి. సరైన వ్యవసాయ ఉత్పత్తులను కనుగొనండి. సమీప సేవలను గుర్తించండి. యంత్రాలను బుక్ చేయండి. సమాచారంతో కూడిన నిర్ణయాలు తీసుకోండి." else "Understand your land. Find the right agricultural products. Discover nearby services. Book equipment. Make informed farming decisions."

            // Ecosystem Cards
            "role_farmer" -> if (isTe) "రైతు" else "Farmer"
            "role_farmer_desc" -> if (isTe) "మీ భూమి మరియు సాగు అవసరాల కోసం సరైన నిర్ణయాలు తీసుకోండి." else "Make informed decisions for your land and farming needs."
            "role_company" -> if (isTe) "వ్యవసాయ కంపెనీ" else "Agricultural Company"
            "role_company_desc" -> if (isTe) "ధృవీకరించబడిన ఉత్పత్తులు మరియు నిల్వ సమాచారంతో రైతులకు చేరండి." else "Reach farmers with verified agricultural products and real availability."
            "role_equipment" -> if (isTe) "యంత్రాలు & నైపుణ్య సేవలు" else "Equipment & Skilled Services"
            "role_equipment_desc" -> if (isTe) "మీ ట్రాక్టర్లు, హార్వెస్టర్లు మరియు వ్యవసాయ పరికరాలకు మరిన్ని బుకింగ్‌లు పొందండి." else "Get more work from your agricultural tools and services."
            "role_admin" -> if (isTe) "అడ్మిన్ డెస్క్" else "Admin Desk"
            "role_admin_desc" -> if (isTe) "కంపెనీ లైసెన్స్‌లు మరియు ఉత్పత్తుల ధృవీకరణ." else "Verification of company licenses and product approvals."

            // Landing Actions
            "btn_iam_farmer" -> if (isTe) "నేను రైతును" else "I'm a Farmer"
            "btn_iam_company" -> if (isTe) "నేను కంపెనీని" else "I'm a Company"
            "btn_iam_provider" -> if (isTe) "సేవా ప్రదాతను" else "I Provide Equipment Services"
            "btn_explore_yukti" -> if (isTe) "యుక్తిని అన్వేషించండి" else "Explore YUKTI"
            "btn_ask_ai" -> if (isTe) "యుక్తి AI సహాయకుడు" else "Ask YUKTI AI"

            // Navigation
            "nav_home" -> if (isTe) "హోమ్" else "Home"
            "nav_myland" -> if (isTe) "నా భూమి" else "My Land"
            "nav_products" -> if (isTe) "ఉత్పత్తులు" else "Products"
            "nav_equipment" -> if (isTe) "యంత్రాలు" else "Equipment"
            "nav_stock" -> if (isTe) "నిల్వలు" else "Stock"
            "nav_bookings" -> if (isTe) "బుకింగ్స్" else "Bookings"
            "nav_ai" -> if (isTe) "AI సహాయకుడు" else "AI Assistant"
            "nav_admin" -> if (isTe) "ధృవీకరణ" else "Verification"
            "nav_profile" -> if (isTe) "ప్రొఫైల్" else "Profile"
            "nav_weather" -> if (isTe) "వాతావరణం" else "Weather"

            // Farmer Modules
            "survey_title" -> if (isTe) "భూమి సర్వే నమోదు" else "Land Survey & Boundaries"
            "survey_option_a" -> if (isTe) "ఆప్షన్ A: ప్రభుత్వ సర్వే నంబర్" else "Option A: Official Survey Number"
            "survey_option_b" -> if (isTe) "ఆప్షన్ B: మ్యాప్ ద్వారా భూమి ఎంపిక" else "Option B: Map-Based Selection"
            "survey_number_label" -> if (isTe) "సర్వే నంబర్ / పాస్‌బుక్ సంఖ్య" else "Survey Number / Passbook No."
            "state_label" -> if (isTe) "రాష్ట్రం" else "State"
            "district_label" -> if (isTe) "జిల్లా" else "District"
            "mandal_label" -> if (isTe) "మండలం / తాలూకా" else "Mandal / Taluk"
            "village_label" -> if (isTe) "గ్రామం" else "Village"
            "area_acres_label" -> if (isTe) "విస్తీర్ణం (ఎకరాల్లో)" else "Total Area (in Acres)"
            "soil_type_label" -> if (isTe) "నేల రకం" else "Soil Type"
            "irrigation_type_label" -> if (isTe) "నీటిపారుదల వనరు" else "Irrigation Source"
            "btn_save_land" -> if (isTe) "భూమి వివరాలను భద్రపరచండి" else "Save Land Record"
            "land_disclaimer" -> if (isTe) "గమనిక: ప్రభుత్వ భూమి రికార్డుల ధృవీకరణ ఇంకా అధికారికంగా అనుసంధానించబడలేదు. మ్యాప్ లొకేషన్ మరియు సర్వే నంబర్‌ను మీ వ్యక్తిగత రికార్డుగా భద్రపరుచుకోవచ్చు." else "Notice: Government land verification is not currently connected. You can save your map location and survey number and verify it through the available official source. This does not claim legal ownership."

            // Paddy & Crop Insights
            "insights_title" -> if (isTe) "సాగు సలహాలు & వరి సాగు సమాచారం" else "Farming Insights & Paddy Irrigation"
            "paddy_stage_nursery" -> if (isTe) "నారుమడి దశ (0-25 రోజులు)" else "Nursery Stage (0-25 Days)"
            "paddy_stage_tillering" -> if (isTe) "పిలకల దశ (25-50 రోజులు)" else "Tillering Stage (25-50 Days)"
            "paddy_stage_panicle" -> if (isTe) "చిరుపొట్ట దశ (50-75 రోజులు)" else "Panicle Initiation (50-75 Days)"
            "paddy_stage_flowering" -> if (isTe) "పూత దశ (75-95 రోజులు)" else "Flowering Stage (75-95 Days)"
            "paddy_stage_ripening" -> if (isTe) "గింజ పక్వ దశ (95-120 రోజులు)" else "Ripening Stage (95-120 Days)"
            "water_guidance" -> if (isTe) "నీటిపారుదల సలహా (AWD పద్ధతి): 2-5 సెం.మీ నీటి నిల్వ సరిపోతుంది. నిరంతరం లోతుగా నీరు నిలపడం కంటే ఆరి ఆరని పద్ధతి (Alternate Wetting and Drying) మేలు." else "Irrigation Guidance (AWD Method): Maintain 2-5 cm shallow water. Alternate Wetting and Drying saves up to 30% water without reducing yield."
            "insights_advisory_note" -> if (isTe) "క్షేత్ర స్థాయి సిఫార్సుల కోసం మీ స్థానిక వ్యవసాయ విస్తరణ అధికారి లేదా శాస్త్రవేత్తలను సంప్రదించండి." else "Consult local agricultural experts for field-specific recommendations."

            // Products
            "products_seeds" -> if (isTe) "విత్తనాలు" else "Seeds"
            "products_fertilizers" -> if (isTe) "ఎరువులు" else "Fertilizers"
            "products_pesticides" -> if (isTe) "పురుగుమందులు" else "Pesticides"
            "filter_all" -> if (isTe) "అన్నీ" else "All"
            "stock_status_in" -> if (isTe) "నిల్వ ఉంది (IN STOCK)" else "In Stock"
            "stock_status_low" -> if (isTe) "తక్కువ నిల్వ (LOW STOCK)" else "Low Stock"
            "stock_status_out" -> if (isTe) "నిల్వ లేదు (OUT OF STOCK)" else "Out of Stock"
            "stock_status_not_updated" -> if (isTe) "అప్‌డేట్ కాలేదు" else "Not Updated"
            "price_declared" -> if (isTe) "కంపెనీ ప్రకటించిన ధర" else "Company Declared Price"
            "dosage_label" -> if (isTe) "సిఫార్సు మోతాదు" else "Recommended Dosage"
            "nutrients_label" -> if (isTe) "పోషక విలువలు" else "Nutrient Composition"
            "btn_compare" -> if (isTe) "పోల్చండి" else "Compare Products"
            "btn_enquire" -> if (isTe) "విచారించండి" else "Send Enquiry"

            // Equipment
            "equipment_tractor" -> if (isTe) "ట్రాక్టర్" else "Tractor"
            "equipment_harvester" -> if (isTe) "హార్వెస్టర్" else "Harvester"
            "equipment_rotavator" -> if (isTe) "రోటవేటర్" else "Rotavator"
            "equipment_sprayer" -> if (isTe) "స్ప్రేయర్" else "Sprayer"
            "equipment_irrigation" -> if (isTe) "నీటిపారుదల పరికరం" else "Irrigation"
            "btn_book_now" -> if (isTe) "బుకింగ్ అభ్యర్థించండి" else "Request Booking"
            "fuel_terms_label" -> if (isTe) "డీజిల్ నిబంధన" else "Diesel/Fuel Condition"
            "operator_label" -> if (isTe) "డ్రైవర్/ఆపరేటర్" else "Operator"
            "operator_included" -> if (isTe) "ఆపరేటర్ ఉన్నారు" else "Operator Included"
            "operator_excluded" -> if (isTe) "రైతే చూసుకోవాలి" else "Operator Not Included"
            "savings_tracker_title" -> if (isTe) "యుక్తి పొదుపు గణన (YUKTI Savings)" else "YUKTI Savings Calculator"
            "savings_desc" -> if (isTe) "యంత్రాల కొనుగోలు వ్యయం vs అద్దె వ్యయం మరియు నికర పొదుపు అంచనా." else "Compare rental cost vs equipment ownership cost."

            // Company & Admin
            "company_portal_title" -> if (isTe) "కంపెనీ పోర్టల్" else "Agricultural Company Portal"
            "admin_portal_title" -> if (isTe) "అడ్మిన్ ధృవీకరణ డెస్క్" else "Admin Verification Desk"
            "btn_add_product" -> if (isTe) "కొత్త ఉత్పత్తి నమోదు" else "Register Product"
            "btn_add_stock" -> if (isTe) "షాపు నిల్వ నమోదు" else "Add Shop Stock"
            "verification_status_label" -> if (isTe) "ధృవీకరణ స్థితి" else "Verification Status"
            "btn_approve" -> if (isTe) "ఆమోదించండి" else "Approve"
            "btn_request_correction" -> if (isTe) "సవరణ కోరండి" else "Request Correction"
            "btn_reject" -> if (isTe) "తిరస్కరించండి" else "Reject"

            // Empty States
            "empty_products" -> if (isTe) "ఇంకా ధృవీకరించబడిన ఉత్పత్తులు ప్రచురించబడలేదు." else "No verified products have been published yet."
            "empty_land" -> if (isTe) "ఇంకా ఏ భూమి సర్వే జోడించబడలేదు." else "No land survey has been added yet."
            "empty_equipment" -> if (isTe) "ప్రస్తుతం ఏ యంత్రాలు అందుబాటులో లేవు." else "No equipment is currently listed in this category."
            "empty_bookings" -> if (isTe) "ఇంకా ఎలాంటి బుకింగ్స్ లేవు." else "No bookings recorded yet."
            "empty_stock" -> if (isTe) "ఈ జిల్లాలో ఇంకా షాపు నిల్వలు నమోదు కాలేదు." else "No stock information has been published for this district."
            "empty_reviews" -> if (isTe) "ఇంకా రివ్యూలు లేవు." else "No reviews submitted yet."
            "empty_notifications" -> if (isTe) "కొత్త నోటిఫికేషన్లు లేవు." else "No new notifications."

            // Common
            "loading" -> if (isTe) "లోడ్ అవుతోంది..." else "Loading..."
            "error" -> if (isTe) "లోపం సంభవించింది" else "An error occurred"
            "success" -> if (isTe) "విజయవంతమైంది" else "Success"
            "cancel" -> if (isTe) "రద్దు" else "Cancel"
            "submit" -> if (isTe) "సమర్పించండి" else "Submit"
            "close" -> if (isTe) "మూసివేయి" else "Close"
            "search_placeholder" -> if (isTe) "ఉత్పత్తులు, షాపులు, యంత్రాల కోసం వెతకండి..." else "Search products, shops, equipment..."
            "language_switcher" -> if (isTe) "English" else "తెలుగు"

            else -> key
        }
    }
}
