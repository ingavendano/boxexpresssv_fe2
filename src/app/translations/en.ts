export const en = {
    navbar: {
        home: 'Home',
        services: 'Services',
        tracking: 'Tracking',
        aboutus: 'About Us',
        calendar: 'Travel Calendar',
        instantQuote: 'Quote Now',
        login: 'Login',
        logout: 'Logout',
        english: 'English',
        spanish: 'Español'
    },
    tracking: {
        title: 'Track your Package',
        subtitle: 'Enter your tracking ID to see your shipment status',
        searchPlaceholder: 'Ex: BOX-123456',
        searchButton: 'Track',
        notFound: 'Tracking ID not found. Please verify and try again.',
        error: 'An error occurred while tracking the package.',
        copyLink: 'Copy Link',
        linkCopied: 'Link Copied!',
        whatsapp: 'Questions? Contact us',
        status: {
            RECEIVED: 'Received at Warehouse',
            IN_TRANSIT: 'In Transit',
            IN_CUSTOMS: 'In Customs',
            READY_PICKUP: 'Ready for Pickup/Delivery',
            DELIVERED: 'Delivered',
            CANCELLED: 'Cancelled'
        }
    },
    admin: {
        sidebar: {
            travels: 'Travel Calendar',
            tracking: 'Tracking Management',
            statuses: 'Tracking Statuses',
            tariffs: 'Tariff Config',
            dashboard: 'Dashboard'
        },
        header: {
            logout: 'Logout',
            profile: 'Profile'
        }
    },
    CUSTOMER: {
        LIST_TITLE: 'Customer Directory',
        NEW: 'New Customer',
        NEW_TITLE: 'Register New Customer',
        SELECT_PROMPT: 'Select a customer to view details or register new addresses.',
        DASHBOARD: {
            WELCOME: 'Hello, Welcome'
        },
        NOTIFICATIONS: {
            STATUS_UPDATE: 'Status Update'
        },
        FIELD: {
            NAME: 'Full Name',
            EMAIL: 'Email Address',
            PHONE: 'Phone',
            PASSWORD: 'Password'
        },
        ADDRESS: {
            TITLE: 'Saved Addresses',
            ADD: 'Add Address',
            MANAGE: 'Manage Addresses',
            HOUSTON: 'USA Address',
            ESA: 'El Salvador Address'
        }
    },
    PACKAGES: {
        TITLE: 'Package Registration',
        SUBTITLE: 'Register new package, calculate costs and generate label.',
        SEARCH_CLIENT: 'Search Client (Name, Email, Phone)',
        SEARCH_PLACEHOLDER: 'Type at least 3 chars...',
        NO_RESULTS: 'No customers found.',
        CREATE_NEW: '+ Register New Customer',
        TOTAL_DUE: 'Total Due',
        REGISTER_PRINT: 'Register & Print Label'
    },
    TARIFFS: {
        TITLE: 'Tariff Configuration',
        WEIGHT: 'Weight',
        VOLUME: 'Volume',
        PERCENTAGE: 'Fee Percentage',
        SAVE: 'Save Changes',
        CATEGORY: 'Category',
        MIN_VALUE: 'Min Value',
        MAX_VALUE: 'Max Value',
        PRODUCT_NAME: 'Product Name',
        FEE: 'Fee / %',
        ACTIONS: 'Actions',
        ADD_RANGE: 'Add Range',
        NO_RANGES: 'No ranges configured for this category',
        DELETE_CONFIRM: 'Delete this range?',
        TYPE: {
            WEIGHT: 'Weight',
            VOLUME: 'Volume',
            PRODUCTS: 'Product Taxes'
        },
        LABEL: {
            SUBCATEGORY: 'Subcategory',
            PERCENTAGE: 'Percentage',
        },
        PLACEHOLDER: {
            ELECTRONICS: 'Ex: Electronics'
        },
        ADD_SUBCATEGORY: 'Add Subcategory'
    },
    SETTINGS: {
        TITLE: 'Global Configuration',
        SUBTITLE: 'Manage system-wide taxes, fees, and costs.',
        CATEGORY: {
            TAXES: 'Taxes',
            COSTS: 'Cost per Lb',
            FEES: 'Admin Fees'
        },
        AUDIT: {
            TITLE: 'Audit Log',
            DATE: 'Date',
            USER: 'User',
            PARAM: 'Parameter Changed',
            CHANGE: 'Change (Old -> New)',
            EMPTY: 'No recent changes found.'
        }
    },
    hero: {
        badge: 'Next Gen Global Logistics',
        title: 'Enabling <span class="text-orange-500">Seamless Global</span> <br class="hidden md:block" /><span class="text-orange-500">Connections</span> Between <br class="hidden md:block" />Salvador & Houston',
        subtitle: 'Experience the future of innovative logistics solutions. We combine advanced tracking technology with a robust physical network to deliver your world, faster.',
        searchPlaceholder: 'Enter Data / Tracking ID...',
        trackButton: 'Track Package'
    },
    services: {
        title: 'Our Services',
        subtitle: 'Logistics solutions with the best connectivity between USA and El Salvador',
        readMore: 'Read More',
        shipping: {
            title: 'Ocean and Air Freight',
            description: 'Consolidated shipments from our Houston warehouse to anywhere in El Salvador.'
        },
        locker: {
            title: 'Virtual Locker',
            description: 'Shop at USA stores (Amazon, eBay, etc.) and we receive and deliver it to your door.'
        },
        cargo: {
            title: 'Commercial Cargo Management',
            description: 'Logistics solutions for companies needing to import merchandise by volume.'
        }
    },
    calendar: {
        title: 'Travel Calendar',
        subtitle: 'Check our upcoming departures and plan your shipments.',
        origin: 'Origin',
        destination: 'Destination',
        closingDate: 'Closes',
        departureDate: 'Departure',
        arrivalDate: 'Est. Arrival',
        status: {
            SCHEDULED: 'Scheduled',
            IN_TRANSIT: 'In Transit',
            COMPLETED: 'Completed',
            CANCELLED: 'Cancelled'
        },
        badge: {
            closingSoon: 'Closing Soon!',
            air: 'Air',
            sea: 'Sea',
            ground: 'Ground'
        }
    },
    processSteps: {
        title: 'Optimized Delivery Cycle',
        subtitle: 'A streamlined, data-driven approach to global distribution.',
        step1: {
            title: 'Initiation & Intake',
            description: 'Efficient induction at our Houston tech hubs or scheduled professional pickups.'
        },
        step2: {
            title: 'Global Transit Flow',
            description: 'Intelligent routing via our air and ground carriers with full telemetry visibility.'
        },
        step3: {
            title: 'Final Distribution',
            description: 'Automated customs processing and precision delivery across El Salvador.'
        }
    },
    pricing: {
        title: 'Transparent Dynamics',
        subtitle: 'Simple standard pricing for essential connections.',
        tableHeaders: {
            format: 'Format',
            dimensions: 'Metric Dimensions',
            baseRate: 'Base Rate'
        },
        plans: {
            compact: {
                name: 'Standard Compact',
                subtitle: 'Envelopes & Small Parcels'
            },
            mid: {
                name: 'Mid-Range Haul',
                subtitle: 'Regular Household Shipments'
            },
            max: {
                name: 'Capacity Max',
                subtitle: 'Commercial Inventory & Bulk'
            }
        },
        exploreLink: 'Explore Full Rate Network'
    },
    footer: {
        cta: {
            title: 'Accelerate Your Shipment',
            description: 'Our global response team is standing by for real-time consultation via WhatsApp.',
            button: 'Connect Instantly'
        },
        brand: {
            description: 'Redefining the logistics bridge between Texas and Central America. High-reliability global connectivity solutions since 2015.'
        },
        houston: {
            title: 'Houston Node',
            address: '18191 HOLLY FOREST DR<br>Houston, TX 77084',
            phone: '+1 (832) 461-5774',
            email: 'houston@boxexpresssv.com'
        },
        salvador: {
            title: 'El Salvador Node',
            address: 'Avenida Los Angeles, Barrio El Centro<br>San Salvador, El Salvador',
            phone: '+503 6837-3849',
            email: 'sanmiguel@boxexpresssv.com'
        },
        directory: {
            title: 'Global Directory',
            trackShipments: 'Track Shipments',
            networkQuotation: 'Network Quotation',
            regulatoryCompliance: 'Regulatory Compliance',
            serviceTerms: 'Service Terms',
            dataProtection: 'Data Protection'
        },
        copyright: '© 2026 Box Express de El Salvador. A Global Connectivity Company.'
    },
    aboutUs: {
        nav: {
            history: 'Our Story',
            payments: 'Payment Methods',
            contact: 'Contact Us'
        },
        history: {
            badge: 'Our Story',
            title: 'Connecting Families Since 2018',
            description: 'Box Express de El Salvador was born from the need to connect Salvadoran families with their loved ones in the United States. What started as a small shipping service between Houston and San Miguel is now a reliable logistics network that unites two cultures.',
            connectionTitle: 'Houston ↔ San Miguel'
        },
        timeline: {
            '2018': {
                title: 'The Beginning',
                description: 'We started operations with weekly shipments between Houston and San Miguel.'
            },
            '2020': {
                title: 'Digital Expansion',
                description: 'Launched real-time tracking system and mobile application.'
            },
            '2022': {
                title: 'New Routes',
                description: 'Expanded coverage to all of El Salvador and more Texas cities.'
            },
            '2024': {
                title: 'Regional Leaders',
                description: 'Over 50,000 packages delivered and growing every day.'
            }
        },
        payments: {
            badge: 'Payment Options',
            title: 'Multiple Payment Methods',
            subtitle: 'We accept the most popular payment methods in the United States and El Salvador for your convenience.',
            zelle: 'Zelle',
            venmo: 'Venmo',
            creditcard: 'Credit Cards',
            agricola: 'Banco Agrícola',
            cuscatlan: 'Banco Cuscatlán',
            cash: 'Cash',
            securityNote: '100% Secure & Encrypted Payments'
        },
        contact: {
            badge: 'Contact Us',
            title: 'Ready to Ship?',
            subtitle: 'Complete the form and we will contact you via WhatsApp in minutes.',
            nameLabel: 'Full Name',
            namePlaceholder: 'Enter your name',
            phoneLabel: 'WhatsApp',
            phonePlaceholder: '12345678',
            packageLabel: 'Package Type',
            packagePlaceholder: 'Briefly describe what you want to ship...',
            submit: 'Send Message',
            sending: 'Sending...',
            successTitle: 'Message Sent!',
            successMessage: 'We will contact you soon via WhatsApp.'
        }
    }
};
