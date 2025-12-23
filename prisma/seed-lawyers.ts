import { PrismaClient, LegalCategory, LawyerStatus, Language } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding demo lawyers...')

  // First, get or create demo users for the lawyers
  const demoLawyers = [
    {
      email: 'john.smith@lawfirm.com',
      firstName: 'John',
      lastName: 'Smith',
      barNumber: 'CA123456',
      barState: 'CA',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      officeAddress: '123 Legal Plaza, Suite 500',
      phoneNumber: '(310) 555-0101',
      websiteUrl: 'https://johnsmithlaw.com',
      bio: 'Experienced family law attorney with over 15 years of practice. Specializing in divorce, child custody, and domestic violence cases. Compassionate approach with a track record of successful outcomes for clients.',
      yearsOfExperience: 15,
      education: 'UCLA School of Law, JD\nUniversity of California, Berkeley, BA in Political Science',
      certifications: 'Certified Family Law Specialist - State Bar of California\nMediation Certification',
      hourlyRate: 350,
      consultationFee: 150,
      categories: ['FAMILY_LAW'],
      isPrimaryCategory: 'FAMILY_LAW',
      languages: [
        { language: 'ENGLISH' as Language, isPrimary: true },
        { language: 'SPANISH' as Language, isPrimary: false }
      ],
      averageRating: 4.8,
      totalConsultations: 156
    },
    {
      email: 'maria.garcia@legalaid.com',
      firstName: 'Maria',
      lastName: 'Garcia',
      barNumber: 'TX789012',
      barState: 'TX',
      city: 'Houston',
      state: 'TX',
      zipCode: '77002',
      officeAddress: '456 Immigration Way',
      phoneNumber: '(713) 555-0202',
      websiteUrl: 'https://garciaimlaw.com',
      bio: 'Dedicated immigration attorney helping families navigate complex immigration processes. Extensive experience with green cards, citizenship applications, asylum cases, and deportation defense. Bilingual services available.',
      yearsOfExperience: 12,
      education: 'University of Texas School of Law, JD\nTexas A&M University, BA in International Studies',
      certifications: 'American Immigration Lawyers Association Member\nBoard Certified in Immigration Law',
      hourlyRate: 275,
      consultationFee: 100,
      categories: ['IMMIGRATION'],
      isPrimaryCategory: 'IMMIGRATION',
      languages: [
        { language: 'ENGLISH' as Language, isPrimary: true },
        { language: 'SPANISH' as Language, isPrimary: false }
      ],
      averageRating: 4.9,
      totalConsultations: 203
    },
    {
      email: 'david.chen@cryptolaw.com',
      firstName: 'David',
      lastName: 'Chen',
      barNumber: 'NY345678',
      barState: 'NY',
      city: 'New York',
      state: 'NY',
      zipCode: '10004',
      officeAddress: '789 Wall Street, 42nd Floor',
      phoneNumber: '(212) 555-0303',
      websiteUrl: 'https://chencryptolaw.com',
      bio: 'Leading cryptocurrency and blockchain compliance attorney. Advising startups, exchanges, and investors on SEC regulations, AML/KYC requirements, and token classifications. Former SEC attorney with deep regulatory knowledge.',
      yearsOfExperience: 8,
      education: 'Columbia Law School, JD\nMIT, BS in Computer Science',
      certifications: 'Certified Bitcoin Professional\nCertified Ethereum Developer',
      hourlyRate: 500,
      consultationFee: 250,
      categories: ['CRYPTO_COMPLIANCE'],
      isPrimaryCategory: 'CRYPTO_COMPLIANCE',
      languages: [
        { language: 'ENGLISH' as Language, isPrimary: true },
        { language: 'MANDARIN' as Language, isPrimary: false },
        { language: 'KOREAN' as Language, isPrimary: false }
      ],
      averageRating: 4.7,
      totalConsultations: 89
    },
    {
      email: 'sarah.johnson@debthelp.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      barNumber: 'FL456789',
      barState: 'FL',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      officeAddress: '321 Consumer Protection Blvd',
      phoneNumber: '(305) 555-0404',
      websiteUrl: 'https://johnsonconsumerlaw.com',
      bio: 'Consumer rights advocate specializing in debt collection defense, credit repair, and bankruptcy. Helping individuals overcome financial challenges and achieve fresh starts. Free initial consultation available.',
      yearsOfExperience: 10,
      education: 'University of Florida Levin College of Law, JD\nFlorida State University, BA in Economics',
      certifications: 'National Association of Consumer Advocates Member\nCertified Bankruptcy Specialist',
      hourlyRate: 225,
      consultationFee: 0,
      categories: ['CONSUMER_DEBT'],
      isPrimaryCategory: 'CONSUMER_DEBT',
      languages: [
        { language: 'ENGLISH' as Language, isPrimary: true }
      ],
      averageRating: 4.6,
      totalConsultations: 178
    },
    {
      email: 'robert.williams@estateplanning.com',
      firstName: 'Robert',
      lastName: 'Williams',
      barNumber: 'IL567890',
      barState: 'IL',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      officeAddress: '555 Estate Planning Center',
      phoneNumber: '(312) 555-0505',
      websiteUrl: 'https://williamsestatlaw.com',
      bio: 'Estate planning and probate attorney with focus on wills, trusts, and wealth preservation. Helping families protect their assets and plan for the future. Expertise in complex estate administration and trust litigation.',
      yearsOfExperience: 20,
      education: 'Northwestern Pritzker School of Law, JD\nNorthwestern University, BA in Finance',
      certifications: 'Board Certified Estate Planning & Probate Attorney\nAccredited Estate Planner',
      hourlyRate: 400,
      consultationFee: 200,
      categories: ['WILLS_ESTATES'],
      isPrimaryCategory: 'WILLS_ESTATES',
      languages: [
        { language: 'ENGLISH' as Language, isPrimary: true }
      ],
      averageRating: 4.9,
      totalConsultations: 245
    },
    {
      email: 'jennifer.lee@housinglaw.com',
      firstName: 'Jennifer',
      lastName: 'Lee',
      barNumber: 'WA678901',
      barState: 'WA',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      officeAddress: '888 Tenant Rights Avenue',
      phoneNumber: '(206) 555-0606',
      websiteUrl: 'https://leehousinglaw.com',
      bio: 'Tenant rights attorney fighting for fair housing and protecting renters from illegal evictions. Experience with landlord-tenant disputes, habitability issues, and rent control matters. Aggressive representation for your rights.',
      yearsOfExperience: 9,
      education: 'University of Washington School of Law, JD\nUniversity of Washington, BA in Urban Planning',
      certifications: 'National Housing Law Project Member\nFair Housing Advocate Certification',
      hourlyRate: 250,
      consultationFee: 75,
      categories: ['HOUSING_LANDLORD'],
      isPrimaryCategory: 'HOUSING_LANDLORD',
      languages: [
        { language: 'ENGLISH' as Language, isPrimary: true },
        { language: 'KOREAN' as Language, isPrimary: false }
      ],
      averageRating: 4.8,
      totalConsultations: 134
    },
    {
      email: 'michael.brown@familylaw.com',
      firstName: 'Michael',
      lastName: 'Brown',
      barNumber: 'MA234567',
      barState: 'MA',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      officeAddress: '999 Family Court Plaza',
      phoneNumber: '(617) 555-0707',
      websiteUrl: 'https://brownfamilylaw.com',
      bio: 'Family law attorney specializing in high-net-worth divorce cases and complex custody arrangements. Skilled negotiator with extensive trial experience when needed. Protecting your interests during difficult times.',
      yearsOfExperience: 18,
      education: 'Harvard Law School, JD\nBoston College, BA in Psychology',
      certifications: 'Fellow of the American Academy of Matrimonial Lawyers\nCertified Family Law Mediator',
      hourlyRate: 450,
      consultationFee: 200,
      categories: ['FAMILY_LAW', 'WILLS_ESTATES'],
      isPrimaryCategory: 'FAMILY_LAW',
      languages: [
        { language: 'ENGLISH' as Language, isPrimary: true },
        { language: 'FRENCH' as Language, isPrimary: false }
      ],
      averageRating: 4.7,
      totalConsultations: 198
    },
    {
      email: 'lisa.rodriguez@immigrationhelp.com',
      firstName: 'Lisa',
      lastName: 'Rodriguez',
      barNumber: 'AZ890123',
      barState: 'AZ',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      officeAddress: '777 Immigration Services Center',
      phoneNumber: '(602) 555-0808',
      websiteUrl: 'https://rodriguezimmigration.com',
      bio: 'Compassionate immigration lawyer with focus on family-based immigration and DACA cases. Providing affordable legal services to immigrant communities. Evening and weekend appointments available.',
      yearsOfExperience: 7,
      education: 'Arizona State University Sandra Day O\'Connor College of Law, JD\nUniversity of Arizona, BA in Latin American Studies',
      certifications: 'AILA Member\nAccredited Representative',
      hourlyRate: 200,
      consultationFee: 50,
      categories: ['IMMIGRATION'],
      isPrimaryCategory: 'IMMIGRATION',
      languages: [
        { language: 'ENGLISH' as Language, isPrimary: true },
        { language: 'SPANISH' as Language, isPrimary: false }
      ],
      averageRating: 4.9,
      totalConsultations: 167
    },
    {
      email: 'james.kim@blockchainlaw.com',
      firstName: 'James',
      lastName: 'Kim',
      barNumber: 'CA987654',
      barState: 'CA',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      officeAddress: '1234 Blockchain Boulevard',
      phoneNumber: '(415) 555-0909',
      websiteUrl: 'https://kimblockchainlaw.com',
      bio: 'Cryptocurrency attorney advising on ICO compliance, exchange licensing, and digital asset regulations. Working with innovative blockchain startups to navigate the evolving regulatory landscape.',
      yearsOfExperience: 6,
      education: 'Stanford Law School, JD\nStanford University, BS in Economics',
      certifications: 'Blockchain Council Certified Expert\nCCO Compliance Certified',
      hourlyRate: 475,
      consultationFee: 225,
      categories: ['CRYPTO_COMPLIANCE'],
      isPrimaryCategory: 'CRYPTO_COMPLIANCE',
      languages: [
        { language: 'ENGLISH' as Language, isPrimary: true },
        { language: 'KOREAN' as Language, isPrimary: false }
      ],
      averageRating: 4.6,
      totalConsultations: 72
    },
    {
      email: 'patricia.davis@debtrelief.com',
      firstName: 'Patricia',
      lastName: 'Davis',
      barNumber: 'GA345678',
      barState: 'GA',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30301',
      officeAddress: '456 Financial Freedom Way',
      phoneNumber: '(404) 555-1010',
      websiteUrl: 'https://davisconsumerlaw.com',
      bio: 'Consumer debt attorney helping people escape the cycle of debt. Expertise in bankruptcy filings, debt settlement negotiations, and stopping creditor harassment. Payment plans available.',
      yearsOfExperience: 11,
      education: 'Emory University School of Law, JD\nGeorgia State University, BA in Business Administration',
      certifications: 'Consumer Bankruptcy Attorney Certification\nNACA Member',
      hourlyRate: 235,
      consultationFee: 0,
      categories: ['CONSUMER_DEBT'],
      isPrimaryCategory: 'CONSUMER_DEBT',
      languages: [
        { language: 'ENGLISH' as Language, isPrimary: true }
      ],
      averageRating: 4.8,
      totalConsultations: 211
    }
  ]

  // Get all categories
  const categories = await prisma.category.findMany()
  const categoryMap = new Map(categories.map(c => [c.key, c.id]))

  for (const lawyerData of demoLawyers) {
    console.log(`Creating lawyer: ${lawyerData.firstName} ${lawyerData.lastName}`)

    // Create or get user
    let user = await prisma.user.findUnique({
      where: { email: lawyerData.email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: lawyerData.email,
          role: 'LAWYER',
          status: 'ACTIVE',
          locale: 'en'
        }
      })
    }

    // Check if lawyer profile already exists
    const existingLawyer = await prisma.lawyerProfile.findUnique({
      where: { userId: user.id }
    })

    if (existingLawyer) {
      console.log(`  Lawyer profile already exists for ${lawyerData.email}, skipping...`)
      continue
    }

    // Create lawyer profile
    const admissionDate = new Date()
    admissionDate.setFullYear(admissionDate.getFullYear() - lawyerData.yearsOfExperience)

    const lawyer = await prisma.lawyerProfile.create({
      data: {
        userId: user.id,
        firstName: lawyerData.firstName,
        lastName: lawyerData.lastName,
        barNumber: lawyerData.barNumber,
        barState: lawyerData.barState,
        barAdmissionDate: admissionDate,
        city: lawyerData.city,
        state: lawyerData.state,
        zipCode: lawyerData.zipCode,
        officeAddress: lawyerData.officeAddress,
        officePhone: lawyerData.phoneNumber,
        website: lawyerData.websiteUrl,
        bio: lawyerData.bio,
        yearsExperience: lawyerData.yearsOfExperience,
        lawSchool: lawyerData.education,
        status: 'APPROVED' as LawyerStatus,
        approvedAt: new Date(),
        hourlyRate: lawyerData.hourlyRate,
        consultationFee: lawyerData.consultationFee,
        averageRating: lawyerData.averageRating,
        totalConsultations: lawyerData.totalConsultations
      }
    })

    // Add categories
    for (const categoryKey of lawyerData.categories) {
      const categoryId = categoryMap.get(categoryKey as LegalCategory)
      if (categoryId) {
        await prisma.lawyerCategory.create({
          data: {
            lawyerId: lawyer.id,
            categoryId: categoryId,
            isPrimary: categoryKey === lawyerData.isPrimaryCategory
          }
        })
      }
    }

    // Add languages
    for (const lang of lawyerData.languages) {
      await prisma.lawyerLanguage.create({
        data: {
          lawyerId: lawyer.id,
          language: lang.language,
          isPrimary: lang.isPrimary
        }
      })
    }

    // Add some sample reviews
    const numReviews = Math.floor(Math.random() * 3) + 2 // 2-4 reviews per lawyer
    for (let i = 0; i < numReviews; i++) {
      // Create a demo client for the review
      const clientEmail = `client${Math.random().toString(36).substring(7)}@example.com`
      let clientUser = await prisma.user.create({
        data: {
          email: clientEmail,
          role: 'CLIENT',
          status: 'ACTIVE',
          locale: 'en'
        }
      })

      const clientProfile = await prisma.clientProfile.create({
        data: {
          userId: clientUser.id,
          firstName: `Client${i + 1}`,
          lastName: 'Testimonial',
          preferredLocale: 'en'
        }
      })

      // Create a consultation
      const consultation = await prisma.consultation.create({
        data: {
          clientId: clientProfile.id,
          lawyerId: lawyer.id,
          type: 'INITIAL_CONSULT',
          status: 'COMPLETED',
          scheduledAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in last 90 days
          categoryId: categoryMap.get(lawyerData.isPrimaryCategory as LegalCategory)!,
          clientDescription: 'Consultation regarding legal matter'
        }
      })

      // Create review
      const reviewComments = [
        'Excellent service! Very knowledgeable and professional.',
        'Helped me navigate a complex situation with ease. Highly recommend!',
        'Great communication and very responsive. Got the results I needed.',
        'Very patient and understanding. Explained everything clearly.',
        'Outstanding attorney! Worth every penny.',
        'Professional, competent, and compassionate. Could not ask for better representation.',
        'Took the time to understand my case and fought hard for me.',
        'Very satisfied with the outcome. Would definitely hire again.'
      ]

      const rating = Math.floor(Math.random() * 2) + 4 // 4 or 5 stars
      await prisma.review.create({
        data: {
          consultationId: consultation.id,
          lawyerId: lawyer.id,
          overallRating: rating,
          professionalismRating: rating,
          communicationRating: rating,
          valueRating: rating,
          reviewText: reviewComments[Math.floor(Math.random() * reviewComments.length)]
        }
      })
    }

    console.log(`  ✓ Created lawyer profile with ${numReviews} reviews`)
  }

  console.log('✅ Demo lawyers seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding demo lawyers:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
