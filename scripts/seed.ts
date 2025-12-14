/**
 * Comprehensive Database Seed Script
 * 
 * This script populates the database with realistic dummy data for testing and development.
 * Run with: npx tsx scripts/seed.ts
 * 
 * Note: This script requires Supabase credentials and will create auth users.
 * Make sure you have SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set in your environment.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables from .env or .env.local files
function loadEnvFile() {
  const envFiles = ['.env.local', '.env']
  
  for (const envFile of envFiles) {
    try {
      const envPath = join(process.cwd(), envFile)
      const envContent = readFileSync(envPath, 'utf-8')
      const lines = envContent.split('\n')
      
      for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=')
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
            if (!process.env[key]) {
              process.env[key] = value
            }
          }
        }
      }
      console.log(`✅ Loaded environment variables from ${envFile}`)
      return
    } catch (e) {
      // File doesn't exist, try next one
      continue
    }
  }
  
  console.log('ℹ️  No .env or .env.local file found, using environment variables directly')
}

// Load env files
loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL in .env or .env.local')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY!')
  console.error('')
  console.error('⚠️  CRITICAL: This script REQUIRES the SERVICE_ROLE_KEY (not the anon key)')
  console.error('   The service role key is needed to:')
  console.error('   - Bypass Row Level Security (RLS) policies')
  console.error('   - Create auth users (supabase.auth.admin.createUser)')
  console.error('   - Insert data into protected tables')
  console.error('')
  console.error('Found environment variables:')
  console.error(`  NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`)
  console.error(`  SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}`)
  console.error(`  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${anonKey ? '✅ Set (not used for seeding)' : '❌ Missing'}`)
  console.error('')
  console.error('📋 How to get your SERVICE_ROLE_KEY:')
  console.error('   1. Go to your Supabase Dashboard')
  console.error('   2. Navigate to: Settings → API')
  console.error('   3. Find "service_role" key (it\'s the SECRET one, not the anon key)')
  console.error('   4. Copy it and add to .env.local:')
  console.error('      SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...')
  console.error('')
  console.error('🔒 Security Note: Never commit the service role key to git!')
  process.exit(1)
}

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ============================================================================
// DATA ARRAYS
// ============================================================================

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Switzerland',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Australia', 'Japan', 'Singapore',
  'South Korea', 'China', 'India', 'Brazil', 'Mexico', 'Spain', 'Italy',
  'Poland', 'Czech Republic', 'Austria', 'Belgium', 'Finland', 'Ireland',
  'New Zealand', 'South Africa', 'Argentina', 'Chile', 'Portugal', 'Greece',
  'Turkey', 'Israel', 'United Arab Emirates', 'Saudi Arabia', 'Malaysia',
  'Thailand', 'Indonesia', 'Philippines', 'Vietnam', 'Egypt', 'Nigeria',
  'Kenya', 'Ghana', 'Morocco', 'Tunisia', 'Colombia', 'Peru', 'Ecuador'
]

const CITIES = [
  'New York', 'London', 'Toronto', 'Berlin', 'Paris', 'Zurich', 'Amsterdam',
  'Stockholm', 'Oslo', 'Copenhagen', 'Sydney', 'Tokyo', 'Singapore', 'Seoul',
  'Beijing', 'Mumbai', 'São Paulo', 'Mexico City', 'Madrid', 'Rome', 'Warsaw',
  'Prague', 'Vienna', 'Brussels', 'Helsinki', 'Dublin', 'Auckland', 'Cape Town',
  'Buenos Aires', 'Santiago', 'Lisbon', 'Athens', 'Istanbul', 'Tel Aviv',
  'Dubai', 'Riyadh', 'Kuala Lumpur', 'Bangkok', 'Jakarta', 'Manila', 'Ho Chi Minh City',
  'Cairo', 'Lagos', 'Nairobi', 'Accra', 'Casablanca', 'Tunis', 'Bogotá', 'Lima', 'Quito'
]

const UNIVERSITIES = [
  // Top US Universities
  { name: 'Massachusetts Institute of Technology', country: 'United States', city: 'Cambridge', ranking: 1 },
  { name: 'Stanford University', country: 'United States', city: 'Stanford', ranking: 2 },
  { name: 'Harvard University', country: 'United States', city: 'Cambridge', ranking: 3 },
  { name: 'California Institute of Technology', country: 'United States', city: 'Pasadena', ranking: 4 },
  { name: 'University of Chicago', country: 'United States', city: 'Chicago', ranking: 5 },
  { name: 'Princeton University', country: 'United States', city: 'Princeton', ranking: 6 },
  { name: 'Yale University', country: 'United States', city: 'New Haven', ranking: 7 },
  { name: 'Columbia University', country: 'United States', city: 'New York', ranking: 8 },
  { name: 'University of Pennsylvania', country: 'United States', city: 'Philadelphia', ranking: 9 },
  { name: 'Cornell University', country: 'United States', city: 'Ithaca', ranking: 10 },
  { name: 'University of California, Berkeley', country: 'United States', city: 'Berkeley', ranking: 11 },
  { name: 'University of California, Los Angeles', country: 'United States', city: 'Los Angeles', ranking: 12 },
  { name: 'University of Michigan', country: 'United States', city: 'Ann Arbor', ranking: 13 },
  { name: 'Carnegie Mellon University', country: 'United States', city: 'Pittsburgh', ranking: 14 },
  { name: 'University of Washington', country: 'United States', city: 'Seattle', ranking: 15 },
  
  // UK Universities
  { name: 'University of Oxford', country: 'United Kingdom', city: 'Oxford', ranking: 16 },
  { name: 'University of Cambridge', country: 'United Kingdom', city: 'Cambridge', ranking: 17 },
  { name: 'Imperial College London', country: 'United Kingdom', city: 'London', ranking: 18 },
  { name: 'University College London', country: 'United Kingdom', city: 'London', ranking: 19 },
  { name: 'London School of Economics', country: 'United Kingdom', city: 'London', ranking: 20 },
  { name: 'University of Edinburgh', country: 'United Kingdom', city: 'Edinburgh', ranking: 21 },
  { name: 'King\'s College London', country: 'United Kingdom', city: 'London', ranking: 22 },
  { name: 'University of Manchester', country: 'United Kingdom', city: 'Manchester', ranking: 23 },
  
  // European Universities
  { name: 'ETH Zurich', country: 'Switzerland', city: 'Zurich', ranking: 24 },
  { name: 'EPFL', country: 'Switzerland', city: 'Lausanne', ranking: 25 },
  { name: 'Technical University of Munich', country: 'Germany', city: 'Munich', ranking: 26 },
  { name: 'Ludwig Maximilian University of Munich', country: 'Germany', city: 'Munich', ranking: 27 },
  { name: 'Heidelberg University', country: 'Germany', city: 'Heidelberg', ranking: 28 },
  { name: 'Sorbonne University', country: 'France', city: 'Paris', ranking: 29 },
  { name: 'École Polytechnique', country: 'France', city: 'Palaiseau', ranking: 30 },
  { name: 'University of Amsterdam', country: 'Netherlands', city: 'Amsterdam', ranking: 31 },
  { name: 'Delft University of Technology', country: 'Netherlands', city: 'Delft', ranking: 32 },
  { name: 'Karolinska Institute', country: 'Sweden', city: 'Stockholm', ranking: 33 },
  { name: 'Lund University', country: 'Sweden', city: 'Lund', ranking: 34 },
  { name: 'University of Copenhagen', country: 'Denmark', city: 'Copenhagen', ranking: 35 },
  
  // Asian Universities
  { name: 'National University of Singapore', country: 'Singapore', city: 'Singapore', ranking: 36 },
  { name: 'Nanyang Technological University', country: 'Singapore', city: 'Singapore', ranking: 37 },
  { name: 'University of Tokyo', country: 'Japan', city: 'Tokyo', ranking: 38 },
  { name: 'Kyoto University', country: 'Japan', city: 'Kyoto', ranking: 39 },
  { name: 'Seoul National University', country: 'South Korea', city: 'Seoul', ranking: 40 },
  { name: 'KAIST', country: 'South Korea', city: 'Daejeon', ranking: 41 },
  { name: 'Tsinghua University', country: 'China', city: 'Beijing', ranking: 42 },
  { name: 'Peking University', country: 'China', city: 'Beijing', ranking: 43 },
  { name: 'Indian Institute of Technology Bombay', country: 'India', city: 'Mumbai', ranking: 44 },
  { name: 'Indian Institute of Science', country: 'India', city: 'Bangalore', ranking: 45 },
  
  // Canadian Universities
  { name: 'University of Toronto', country: 'Canada', city: 'Toronto', ranking: 46 },
  { name: 'University of British Columbia', country: 'Canada', city: 'Vancouver', ranking: 47 },
  { name: 'McGill University', country: 'Canada', city: 'Montreal', ranking: 48 },
  { name: 'University of Alberta', country: 'Canada', city: 'Edmonton', ranking: 49 },
  { name: 'University of Waterloo', country: 'Canada', city: 'Waterloo', ranking: 50 },
  
  // Australian Universities
  { name: 'Australian National University', country: 'Australia', city: 'Canberra', ranking: 51 },
  { name: 'University of Melbourne', country: 'Australia', city: 'Melbourne', ranking: 52 },
  { name: 'University of Sydney', country: 'Australia', city: 'Sydney', ranking: 53 },
  { name: 'University of New South Wales', country: 'Australia', city: 'Sydney', ranking: 54 },
]

const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Timothy', 'Deborah', 'Ronald', 'Stephanie', 'Jason', 'Rebecca', 'Edward', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Angela', 'Eric', 'Shirley', 'Jonathan', 'Anna', 'Stephen', 'Brenda',
  'Larry', 'Pamela', 'Justin', 'Emma', 'Scott', 'Nicole', 'Brandon', 'Helen',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Frank', 'Christine', 'Gregory', 'Debra',
  'Raymond', 'Rachel', 'Alexander', 'Carolyn', 'Patrick', 'Janet', 'Jack', 'Virginia',
  'Dennis', 'Maria', 'Jerry', 'Heather', 'Tyler', 'Diane', 'Aaron', 'Julie',
  'Jose', 'Joyce', 'Henry', 'Victoria', 'Adam', 'Kelly', 'Douglas', 'Christina',
  'Nathan', 'Joan', 'Zachary', 'Evelyn', 'Kyle', 'Lauren', 'Noah', 'Judith',
  'Ethan', 'Megan', 'Jeremy', 'Cheryl', 'Walter', 'Andrea', 'Christian', 'Hannah',
  'Keith', 'Jacqueline', 'Roger', 'Martha', 'Terry', 'Gloria', 'Gerald', 'Teresa',
  'Harold', 'Sara', 'Sean', 'Janice', 'Austin', 'Marie', 'Carl', 'Julia',
  'Arthur', 'Grace', 'Lawrence', 'Judy', 'Dylan', 'Theresa', 'Jesse', 'Madison',
  'Jordan', 'Beverly', 'Bryan', 'Denise', 'Billy', 'Marilyn', 'Joe', 'Amber',
  'Bruce', 'Danielle', 'Gabriel', 'Rose', 'Logan', 'Brittany', 'Alan', 'Diana',
  'Juan', 'Abigail', 'Wayne', 'Jane', 'Roy', 'Lori', 'Ralph', 'Olivia', 'Randy', 'Kathy'
]

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Sanchez',
  'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams',
  'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards',
  'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers',
  'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly',
  'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks',
  'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross',
  'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell', 'Sullivan', 'Bell',
  'Coleman', 'Butler', 'Henderson', 'Barnes', 'Gonzales', 'Fisher', 'Vasquez', 'Simmons',
  'Romero', 'Jordan', 'Patterson', 'Alexander', 'Hamilton', 'Graham', 'Reynolds', 'Griffin',
  'Wallace', 'Moreno', 'West', 'Cole', 'Hayes', 'Bryant', 'Herrera', 'Gibson',
  'Ellis', 'Tran', 'Medina', 'Aguilar', 'Stevens', 'Murray', 'Ford', 'Castro', 'Marshall'
]

const FIELDS_OF_STUDY = [
  'Computer Science', 'Artificial Intelligence', 'Machine Learning', 'Data Science',
  'Software Engineering', 'Cybersecurity', 'Information Systems', 'Human-Computer Interaction',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering',
  'Biomedical Engineering', 'Aerospace Engineering', 'Materials Science', 'Robotics',
  'Mathematics', 'Statistics', 'Physics', 'Chemistry', 'Biology', 'Biochemistry',
  'Molecular Biology', 'Genetics', 'Neuroscience', 'Psychology', 'Cognitive Science',
  'Economics', 'Finance', 'Business Administration', 'Marketing', 'Management',
  'Public Health', 'Epidemiology', 'Medicine', 'Pharmacy', 'Nursing',
  'Environmental Science', 'Climate Science', 'Sustainability', 'Energy Systems',
  'Architecture', 'Urban Planning', 'Design', 'Fine Arts', 'Music',
  'Linguistics', 'Literature', 'History', 'Philosophy', 'Political Science',
  'International Relations', 'Law', 'Education', 'Social Work', 'Anthropology'
]

const RESEARCH_INTERESTS = [
  'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision',
  'Reinforcement Learning', 'Neural Networks', 'Data Mining', 'Big Data Analytics',
  'Cloud Computing', 'Distributed Systems', 'Blockchain', 'Cryptography',
  'Quantum Computing', 'Bioinformatics', 'Computational Biology', 'Genomics',
  'Precision Medicine', 'Drug Discovery', 'Cancer Research', 'Immunology',
  'Climate Change', 'Renewable Energy', 'Solar Energy', 'Wind Energy',
  'Battery Technology', 'Electric Vehicles', 'Smart Grids', 'Energy Storage',
  'Sustainable Materials', 'Nanotechnology', '3D Printing', 'Robotics',
  'Autonomous Systems', 'Internet of Things', 'Cybersecurity', 'Privacy',
  'Human-Computer Interaction', 'User Experience', 'Accessibility', 'Digital Health',
  'Mental Health', 'Public Health', 'Epidemiology', 'Global Health',
  'Urban Planning', 'Smart Cities', 'Transportation', 'Infrastructure',
  'Economics', 'Behavioral Economics', 'Development Economics', 'Finance',
  'Social Networks', 'Social Media', 'Digital Humanities', 'Cultural Studies'
]

const GRANT_TITLES = [
  'Fully Funded PhD Scholarship in Computer Science',
  'Master\'s Research Fellowship in Artificial Intelligence',
  'Postdoctoral Research Grant in Machine Learning',
  'Graduate Scholarship in Data Science',
  'PhD Position in Cybersecurity',
  'Research Fellowship in Quantum Computing',
  'Master\'s Scholarship in Software Engineering',
  'PhD Scholarship in Bioinformatics',
  'Postdoc Position in Computational Biology',
  'Graduate Fellowship in Neuroscience',
  'PhD Research Grant in Climate Science',
  'Master\'s Scholarship in Renewable Energy',
  'Fully Funded PhD in Materials Science',
  'Research Fellowship in Nanotechnology',
  'Graduate Scholarship in Robotics',
  'PhD Position in Electrical Engineering',
  'Master\'s Fellowship in Biomedical Engineering',
  'Postdoctoral Grant in Drug Discovery',
  'PhD Scholarship in Public Health',
  'Research Fellowship in Epidemiology',
  'Graduate Scholarship in Economics',
  'PhD Position in Finance',
  'Master\'s Fellowship in Business Administration',
  'Postdoc Grant in Social Sciences',
  'PhD Scholarship in Psychology',
  'Research Fellowship in Cognitive Science',
  'Graduate Scholarship in Linguistics',
  'PhD Position in Literature',
  'Master\'s Fellowship in History',
  'Postdoctoral Grant in Philosophy',
  'Fully Funded PhD in Mathematics',
  'Research Fellowship in Statistics',
  'Graduate Scholarship in Physics',
  'PhD Position in Chemistry',
  'Master\'s Fellowship in Biology',
  'Postdoc Grant in Environmental Science',
  'PhD Scholarship in Architecture',
  'Research Fellowship in Urban Planning',
  'Graduate Scholarship in Design',
  'PhD Position in Fine Arts',
  'Master\'s Fellowship in Music',
  'Postdoctoral Grant in Law',
  'PhD Scholarship in International Relations',
  'Research Fellowship in Political Science',
  'Graduate Scholarship in Education',
  'PhD Position in Social Work',
  'Master\'s Fellowship in Anthropology',
  'Postdoc Grant in Cultural Studies',
  'Fully Funded PhD in Digital Humanities',
  'Research Fellowship in Human-Computer Interaction'
]

const STATEMENTS_OF_PURPOSE = [
  'I am deeply passionate about advancing the field of artificial intelligence and machine learning. My research interests lie in developing more efficient algorithms that can learn from limited data while maintaining high accuracy. I believe this scholarship will provide me with the resources and mentorship needed to make significant contributions to the field.',
  'Throughout my academic journey, I have been fascinated by the intersection of computer science and biology. My goal is to develop computational tools that can help solve complex biological problems, particularly in the area of personalized medicine. This opportunity would allow me to work with leading researchers in the field.',
  'Climate change is one of the most pressing challenges of our time. I am committed to contributing to solutions through research in renewable energy systems. This scholarship would enable me to focus on developing more efficient solar energy conversion technologies.',
  'My research interests center on understanding how neural networks process information and how we can make them more interpretable and trustworthy. I am particularly interested in applications in healthcare where AI decisions can have life-changing consequences.',
  'I have always been drawn to the mathematical foundations of machine learning. This scholarship would allow me to pursue research in theoretical machine learning, specifically focusing on optimization algorithms and their convergence properties.',
  'The field of quantum computing holds immense promise for solving problems that are intractable for classical computers. I am excited about the opportunity to contribute to this cutting-edge field through research in quantum algorithms and error correction.',
  'My passion lies in using data science to address social challenges. I am particularly interested in applying machine learning techniques to improve public health outcomes and reduce healthcare disparities.',
  'I am fascinated by the potential of robotics to transform industries and improve quality of life. My research focuses on developing more intuitive human-robot interaction systems that can work safely alongside humans.',
  'The intersection of neuroscience and artificial intelligence is where I see the future of both fields. I am interested in developing AI systems inspired by biological neural networks and using AI to better understand the brain.',
  'Sustainable materials are crucial for addressing environmental challenges. My research aims to develop new materials with improved properties while reducing environmental impact through green chemistry approaches.'
]

const RESEARCH_PROPOSALS = [
  'This research proposes a novel approach to few-shot learning using meta-learning techniques. We will develop a framework that can quickly adapt to new tasks with minimal training data, addressing a key limitation of current deep learning systems.',
  'I propose to investigate the role of gut microbiota in neurodegenerative diseases using computational modeling and machine learning. This interdisciplinary approach will combine bioinformatics, systems biology, and AI to identify potential therapeutic targets.',
  'This research aims to develop next-generation battery materials using computational design and machine learning. We will use high-throughput screening and AI-guided synthesis to discover materials with superior energy density and cycle life.',
  'I propose to develop a comprehensive framework for explainable AI in healthcare applications. The research will focus on creating interpretable models that can provide clinicians with actionable insights while maintaining high predictive accuracy.',
  'This research will investigate quantum algorithms for optimization problems in logistics and supply chain management. We aim to demonstrate quantum advantage for real-world problems and develop hybrid classical-quantum algorithms.',
  'I propose to study the impact of climate change on urban heat islands using remote sensing and machine learning. The research will develop predictive models to help cities plan for and mitigate the effects of rising temperatures.',
  'This research aims to develop personalized treatment recommendations for cancer patients using multi-omics data and deep learning. We will integrate genomic, transcriptomic, and clinical data to predict treatment response.',
  'I propose to investigate the neural mechanisms underlying decision-making using computational models and neuroimaging. This research will bridge cognitive science, neuroscience, and AI to understand how the brain makes complex decisions.',
  'This research will develop sustainable alternatives to petroleum-based plastics using bio-based materials and green chemistry. We will use computational modeling to design materials with desired properties and minimal environmental impact.',
  'I propose to create a comprehensive framework for privacy-preserving machine learning in healthcare. The research will develop techniques that allow models to learn from sensitive medical data while protecting patient privacy.'
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function randomElement<T>(array: readonly T[] | T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function randomElements<T>(array: readonly T[] | T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function randomEmail(firstName: string, lastName: string): string {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'university.edu', 'student.edu']
  const domain = randomElement(domains)
  const number = Math.random() > 0.5 ? randomInt(1, 999) : ''
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${number}@${domain}`
}

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedUniversities() {
  console.log('🌍 Seeding universities...')
  
  // Check existing universities to avoid duplicates
  const { data: existing } = await supabase
    .from('universities')
    .select('name')
  
  const existingNames = new Set((existing || []).map(u => u.name))
  
  const universities = UNIVERSITIES
    .filter(uni => !existingNames.has(uni.name))
    .map(uni => ({
      name: uni.name,
      country: uni.country,
      city: uni.city,
      ranking: uni.ranking,
      website: `https://www.${uni.name.toLowerCase().replace(/\s+/g, '')}.edu`,
      logo_url: null
    }))

  if (universities.length === 0) {
    console.log('ℹ️  All universities already exist, skipping...')
    // Fetch existing universities
    const { data: existingUnis } = await supabase
      .from('universities')
      .select('*')
    return existingUnis || []
  }

  const { data, error } = await supabase
    .from('universities')
    .insert(universities)
    .select()

  if (error) {
    console.error('❌ Error seeding universities:', error)
    // Try to fetch existing ones
    const { data: existingUnis } = await supabase
      .from('universities')
      .select('*')
    return existingUnis || []
  }

  console.log(`✅ Seeded ${data.length} universities`)
  
  // Also fetch all universities (new + existing) for use in rest of script
  const { data: allUniversities } = await supabase
    .from('universities')
    .select('*')
  
  return allUniversities || data || []
}

async function createAuthUser(email: string, password: string, firstName: string, lastName: string) {
  // Check if user already exists
  const { data: existing } = await supabase.auth.admin.listUsers()
  const userExists = existing?.users?.some(u => u.email === email)
  
  if (userExists) {
    // User exists, find and return it
    const existingUser = existing.users.find(u => u.email === email)
    if (existingUser) {
      return existingUser
    }
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      last_name: lastName
    }
  })

  if (error) {
    // If user already exists, try to get it
    if (error.message.includes('already registered') || error.message.includes('already exists')) {
      const { data: existing } = await supabase.auth.admin.listUsers()
      const existingUser = existing?.users?.find(u => u.email === email)
      if (existingUser) {
        return existingUser
      }
    }
    console.error(`❌ Error creating auth user ${email}:`, error.message)
    return null
  }

  return data.user
}

async function seedUsers(universities: any[], count: number) {
  console.log(`👥 Creating ${count} users...`)
  const users: any[] = []
  const profiles: any[] = []
  const userRoles: any[] = []

  // Create 5% admins, 20% professors, 75% students
  const adminCount = Math.max(1, Math.floor(count * 0.05))
  const professorCount = Math.floor(count * 0.2)
  const studentCount = count - adminCount - professorCount

  // Create admins
  for (let i = 0; i < adminCount; i++) {
    const firstName = randomElement(FIRST_NAMES)
    const lastName = randomElement(LAST_NAMES)
    const email = `admin${i + 1}.${randomEmail(firstName, lastName)}`
    const password = 'Test123!@#'
    const university = randomElement(universities)

    const user = await createAuthUser(email, password, firstName, lastName)
    if (!user) continue

    users.push(user)
    userRoles.push({
      user_id: user.id,
      role: 'admin'
    })

    profiles.push({
      user_id: user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      phone: `+1${randomInt(2000000000, 9999999999)}`,
      date_of_birth: randomDate(new Date(1970, 0, 1), new Date(1985, 11, 31)).toISOString().split('T')[0],
      nationality: randomElement(COUNTRIES),
      current_country: university.country,
      current_city: university.city,
      bio: `Administrator with full system access.`,
      title: 'Administrator',
      department: 'Administration',
      profile_completed: true,
      university_id: university.id
    })
  }

  // Create professors
  for (let i = 0; i < professorCount; i++) {
    const firstName = randomElement(FIRST_NAMES)
    const lastName = randomElement(LAST_NAMES)
    const email = randomEmail(firstName, lastName)
    const password = 'Test123!@#'
    const university = randomElement(universities)
    const researchAreas = randomElements(RESEARCH_INTERESTS, randomInt(2, 5))
    const department = randomElement(FIELDS_OF_STUDY)

    const user = await createAuthUser(email, password, firstName, lastName)
    if (!user) continue

    users.push(user)
    userRoles.push({
      user_id: user.id,
      role: 'professor'
    })

    profiles.push({
      user_id: user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      phone: `+1${randomInt(2000000000, 9999999999)}`,
      date_of_birth: randomDate(new Date(1960, 0, 1), new Date(1985, 11, 31)).toISOString().split('T')[0],
      nationality: randomElement(COUNTRIES),
      current_country: university.country,
      current_city: university.city,
      bio: `Professor of ${department} with expertise in ${researchAreas.join(', ')}. Published ${randomInt(20, 150)} papers with h-index of ${randomInt(15, 50)}.`,
      department,
      title: randomElement(['Professor', 'Associate Professor', 'Assistant Professor', 'Research Professor']),
      research_areas: researchAreas,
      h_index: randomInt(15, 50),
      publications_count: randomInt(20, 150),
      profile_completed: true,
      university_id: university.id
    })
  }

  // Create students
  for (let i = 0; i < studentCount; i++) {
    const firstName = randomElement(FIRST_NAMES)
    const lastName = randomElement(LAST_NAMES)
    const email = randomEmail(firstName, lastName)
    const password = 'Test123!@#'
    const university = randomElement(universities)
    const fieldOfStudy = randomElement(FIELDS_OF_STUDY)
    const researchInterests = randomElements(RESEARCH_INTERESTS, randomInt(2, 4))
    const degree = randomElement(['masters', 'phd', 'bachelors'] as ('masters' | 'phd' | 'bachelors')[])

    const user = await createAuthUser(email, password, firstName, lastName)
    if (!user) continue

    users.push(user)
    userRoles.push({
      user_id: user.id,
      role: 'student'
    })

    const gpa = randomFloat(3.0, 4.0)
    const hasGRE = Math.random() > 0.3
    const hasTOEFL = Math.random() > 0.4

    profiles.push({
      user_id: user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      phone: `+1${randomInt(2000000000, 9999999999)}`,
      date_of_birth: randomDate(new Date(1995, 0, 1), new Date(2005, 11, 31)).toISOString().split('T')[0],
      nationality: randomElement(COUNTRIES),
      current_country: randomElement(COUNTRIES),
      current_city: randomElement(CITIES),
      bio: `Passionate ${fieldOfStudy} student interested in ${researchInterests.join(', ')}. Seeking opportunities to advance research in these areas.`,
      current_degree: degree,
      field_of_study: fieldOfStudy,
      university_id: university.id,
      gpa,
      gpa_scale: 4.0,
      graduation_year: randomInt(2024, 2027),
      gre_verbal: hasGRE ? randomInt(150, 170) : null,
      gre_quant: hasGRE ? randomInt(150, 170) : null,
      gre_awa: hasGRE ? randomFloat(3.0, 5.0, 1) : null,
      toefl_score: hasTOEFL ? randomInt(90, 120) : null,
      ielts_score: hasTOEFL ? null : (Math.random() > 0.5 ? randomFloat(6.5, 9.0, 1) : null),
      research_interests: researchInterests,
      publications_count: Math.random() > 0.7 ? randomInt(0, 5) : 0,
      profile_completed: Math.random() > 0.2
    })
  }

  // Insert user roles (skip duplicates)
  if (userRoles.length > 0) {
    const { error: rolesError } = await supabase
      .from('user_roles')
      .upsert(userRoles, { onConflict: 'user_id,role', ignoreDuplicates: true })

    if (rolesError) {
      console.error('❌ Error seeding user roles:', rolesError)
    }
  }

  // Insert profiles (skip duplicates)
  if (profiles.length > 0) {
    const { error: profilesError } = await supabase
      .from('profiles')
      .upsert(profiles, { onConflict: 'user_id', ignoreDuplicates: true })

    if (profilesError) {
      console.error('❌ Error seeding profiles:', profilesError)
      // Still try to fetch existing profiles
    }
  }

  // Always fetch all profiles for the users we created (upsert doesn't return existing records)
  let allProfiles: any[] = []
  if (users.length > 0) {
    const { data: fetchedProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .in('user_id', users.map(u => u.id))
    
    if (fetchError) {
      console.error('❌ Error fetching profiles:', fetchError)
    } else {
      allProfiles = fetchedProfiles || []
    }
  }

  console.log(`✅ Created ${users.length} users (${adminCount} admins, ${professorCount} professors, ${studentCount} students)`)
  console.log(`   Fetched ${allProfiles.length} profiles from database`)
  
  return { users, profiles: allProfiles }
}

async function seedGrants(universities: any[], professors: any[], count: number) {
  console.log(`💰 Seeding ${count} grants...`)
  const grants = []

  if (!professors || professors.length === 0) {
    console.error('❌ No professors available to create grants')
    return []
  }

  for (let i = 0; i < count; i++) {
    const university = randomElement(universities)
    const professor = randomElement(professors)
    
    if (!professor || !professor.user_id) {
      console.warn(`⚠️  Skipping grant ${i + 1}: Invalid professor`)
      continue
    }
    const title = randomElement(GRANT_TITLES)
    const fieldOfStudy = randomElement(FIELDS_OF_STUDY)
    const grantType = randomElement(['scholarship', 'fellowship', 'research_grant', 'travel_grant'] as ('scholarship' | 'fellowship' | 'research_grant' | 'travel_grant')[])
    const degreeLevels = randomElements(['masters', 'phd', 'postdoc'] as const, randomInt(1, 3))
    const fieldsOfStudy = randomElements(FIELDS_OF_STUDY, randomInt(1, 3))
    const eligibleCountries = randomElements(COUNTRIES, randomInt(5, 20))

    const startDate = randomDate(new Date(2024, 0, 1), new Date(2025, 11, 31))
    const deadline = new Date(startDate)
    deadline.setMonth(deadline.getMonth() - randomInt(1, 6))

    const fundingAmount = randomElement([
      '$25,000 per year',
      '$30,000 per year',
      '$35,000 per year',
      '$40,000 per year',
      'Full tuition + $20,000 stipend',
      'Full tuition + $25,000 stipend',
      'Full funding + $30,000 stipend',
      '$50,000 total',
      '$60,000 total',
      'Full funding'
    ])

    const stipendMonthly = Math.random() > 0.3 ? `$${randomInt(1500, 3500)}/month` : null

    grants.push({
      title: `${title} - ${university.name}`,
      description: `We are offering a ${grantType} in ${fieldOfStudy} at ${university.name}. This position provides an excellent opportunity to work with leading researchers in the field. The successful candidate will have access to state-of-the-art facilities and resources. ${randomElement(STATEMENTS_OF_PURPOSE)}`,
      grant_type: grantType,
      university_id: university.id,
      degree_levels: degreeLevels,
      fields_of_study: fieldsOfStudy,
      eligible_countries: eligibleCountries,
      min_gpa: Math.random() > 0.4 ? randomFloat(3.0, 3.8) : null,
      funding_amount: fundingAmount,
      stipend_monthly: stipendMonthly,
      covers_tuition: Math.random() > 0.3,
      covers_living: Math.random() > 0.5,
      deadline: deadline.toISOString(),
      start_date: startDate.toISOString().split('T')[0],
      duration_months: randomInt(12, 48),
      language: randomElement(['English', 'English', 'English', 'English', 'German', 'French', 'Spanish']),
      application_url: `https://${university.name.toLowerCase().replace(/\s+/g, '')}.edu/apply`,
      is_featured: Math.random() > 0.8,
      created_by: professor.user_id
    })
  }

  // Check for existing grants to avoid duplicates
  const { data: existingGrants } = await supabase
    .from('grants')
    .select('id, title')
    .limit(1000)
  
  const existingTitles = new Set((existingGrants || []).map(g => g.title))
  const newGrants = grants.filter(g => !existingTitles.has(g.title))

  if (newGrants.length === 0) {
    console.log('ℹ️  All grants already exist, fetching existing...')
    const { data: allGrants } = await supabase
      .from('grants')
      .select('*')
      .limit(1000)
    return allGrants || []
  }

  const { data, error } = await supabase
    .from('grants')
    .insert(newGrants)
    .select()

  if (error) {
    console.error('❌ Error seeding grants:', error)
    // Try to fetch existing grants
    const { data: allGrants } = await supabase
      .from('grants')
      .select('*')
      .limit(1000)
    return allGrants || []
  }

  console.log(`✅ Seeded ${data.length} new grants (${grants.length - newGrants.length} already existed)`)
  
  // Fetch all grants (new + existing) for use in rest of script
  const { data: allGrants } = await supabase
    .from('grants')
    .select('*')
    .limit(1000)
  
  return allGrants || data || []
}

async function seedApplications(students: any[], grants: any[], count: number) {
  console.log(`📝 Seeding ${count} applications...`)
  const applications = []
  const statuses: Array<'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'interview' | 'accepted' | 'rejected'> = [
    'draft', 'submitted', 'under_review', 'shortlisted', 'interview', 'accepted', 'rejected'
  ]

  if (students.length === 0 || grants.length === 0) {
    console.error('❌ No students or grants available for applications')
    return []
  }

  // Check existing applications to avoid duplicates
  const { data: existingApps } = await supabase
    .from('applications')
    .select('user_id, grant_id')
    .limit(10000)
  
  const existingKeys = new Set(
    (existingApps || []).map(app => `${app.user_id}-${app.grant_id}`)
  )

  // Ensure some students have multiple applications
  const applicationsPerStudent = Math.ceil(count / students.length)

  for (const student of students) {
    const studentApplications = randomInt(1, Math.min(applicationsPerStudent, 5))
    const selectedGrants = randomElements(grants, studentApplications)

    for (const grant of selectedGrants) {
      // Skip if application already exists
      const key = `${student.user_id}-${grant.id}`
      if (existingKeys.has(key)) {
        continue
      }
      
      const status = randomElement(statuses)
      const isSubmitted = ['submitted', 'under_review', 'shortlisted', 'interview', 'accepted', 'rejected'].includes(status)
      const isReviewed = ['shortlisted', 'interview', 'accepted', 'rejected'].includes(status)
      const isDecided = ['accepted', 'rejected'].includes(status)

      const submittedAt = isSubmitted
        ? randomDate(new Date(2024, 0, 1), new Date())
        : null

      const reviewedAt = isReviewed && submittedAt
        ? new Date(submittedAt.getTime() + randomInt(1, 30) * 24 * 60 * 60 * 1000)
        : null

      const decisionAt = isDecided && reviewedAt
        ? new Date(reviewedAt.getTime() + randomInt(1, 14) * 24 * 60 * 60 * 1000)
        : null

      const matchScore = isSubmitted ? randomInt(60, 95) : null
      const rScore = isReviewed ? randomInt(70, 100) : null
      const globalRank = isReviewed ? randomInt(1, 1000) : null

      applications.push({
        user_id: student.user_id,
        grant_id: grant.id,
        status,
        statement_of_purpose: isSubmitted ? randomElement(STATEMENTS_OF_PURPOSE) : null,
        research_proposal: isSubmitted ? randomElement(RESEARCH_PROPOSALS) : null,
        r_score: rScore,
        match_score: matchScore,
        global_rank: globalRank,
        submitted_at: submittedAt?.toISOString(),
        reviewed_at: reviewedAt?.toISOString(),
        decision_at: decisionAt?.toISOString(),
        reviewer_notes: isReviewed ? randomElement([
          'Strong candidate with excellent research background.',
          'Good fit for the program. Recommended for interview.',
          'Outstanding academic record and research proposal.',
          'Candidate shows promise but needs more experience.',
          'Excellent match with research interests.',
          'Strong application overall.'
        ]) : null
      })

      if (applications.length >= count) break
    }

    if (applications.length >= count) break
  }

  // Limit to requested count
  const limitedApplications = applications.slice(0, count)

  if (limitedApplications.length === 0) {
    console.log('ℹ️  No new applications to create (all already exist)')
    const { data: existingApps } = await supabase
      .from('applications')
      .select('*')
      .limit(1000)
    return existingApps || []
  }

  const { data, error } = await supabase
    .from('applications')
    .upsert(limitedApplications, { onConflict: 'user_id,grant_id', ignoreDuplicates: true })
    .select()

  if (error) {
    console.error('❌ Error seeding applications:', error)
    return []
  }

  console.log(`✅ Seeded ${data.length} applications`)
  return data
}

async function seedSavedGrants(students: any[], grants: any[], count: number) {
  console.log(`🔖 Seeding ${count} saved grants...`)
  
  if (!students || students.length === 0) {
    console.error('❌ No students provided for saved grants')
    return []
  }
  
  if (!grants || grants.length === 0) {
    console.error('❌ No grants provided for saved grants')
    return []
  }
  
  // Check existing saved grants
  const { data: existingSaved } = await supabase
    .from('saved_grants')
    .select('user_id, grant_id')
    .limit(10000)
  
  const existingKeys = new Set(
    (existingSaved || []).map(sg => `${sg.user_id}-${sg.grant_id}`)
  )
  
  const savedGrants = []
  const used = new Set<string>()

  for (let i = 0; i < count; i++) {
    const student = randomElement(students)
    const grant = randomElement(grants)
    
    if (!student || !student.user_id) {
      console.warn(`⚠️  Skipping saved grant ${i + 1}: Invalid student`)
      continue
    }
    
    if (!grant || !grant.id) {
      console.warn(`⚠️  Skipping saved grant ${i + 1}: Invalid grant`)
      continue
    }
    const key = `${student.user_id}-${grant.id}`

    if (used.has(key) || existingKeys.has(key)) continue
    used.add(key)

    savedGrants.push({
      user_id: student.user_id,
      grant_id: grant.id
    })
  }

  if (savedGrants.length === 0) {
    console.log('ℹ️  No new saved grants to create (all already exist)')
    const { data: existingSavedGrants } = await supabase
      .from('saved_grants')
      .select('*')
      .limit(1000)
    return existingSavedGrants || []
  }

  const { data, error } = await supabase
    .from('saved_grants')
    .upsert(savedGrants, { onConflict: 'user_id,grant_id', ignoreDuplicates: true })
    .select()

  if (error) {
    console.error('❌ Error seeding saved grants:', error)
    return []
  }

  console.log(`✅ Seeded ${data.length} saved grants`)
  return data
}

async function seedDocuments(students: any[], count: number) {
  console.log(`📄 Seeding ${count} documents...`)
  const documents = []
  const documentTypes = ['cv', 'transcript', 'recommendation', 'sop', 'portfolio']

  for (let i = 0; i < count; i++) {
    const student = randomElement(students)
    const docType = randomElement(documentTypes)
    const docNames = {
      cv: ['CV_2024.pdf', 'Resume_Updated.pdf', 'Curriculum_Vitae.pdf'],
      transcript: ['Official_Transcript.pdf', 'Academic_Transcript.pdf', 'Transcript_2024.pdf'],
      recommendation: ['Recommendation_Letter_1.pdf', 'LOR_Professor_Smith.pdf', 'Reference_Letter.pdf'],
      sop: ['Statement_of_Purpose.pdf', 'SOP_Final.pdf', 'Personal_Statement.pdf'],
      portfolio: ['Portfolio_2024.pdf', 'Research_Portfolio.pdf', 'Project_Portfolio.pdf']
    }

    const docName = randomElement(docNames[docType as keyof typeof docNames])
    documents.push({
      user_id: student.user_id,
      name: docName,
      document_type: docType,
      file_url: `https://storage.supabase.co/documents/${student.user_id}/${docName}`,
      file_size: randomInt(100000, 5000000), // 100KB to 5MB
      uploaded_at: randomDate(new Date(2023, 0, 1), new Date()).toISOString()
    })
  }

  const { data, error } = await supabase
    .from('documents')
    .upsert(documents, { onConflict: 'id', ignoreDuplicates: true })
    .select()

  if (error) {
    console.error('❌ Error seeding documents:', error)
    return []
  }

  console.log(`✅ Seeded ${data.length} documents`)
  return data
}

async function seedTryoutSubmissions(applications: any[], count: number) {
  console.log(`🎯 Seeding ${count} tryout submissions...`)
  const tryoutSubmissions = []

  // Only create tryouts for submitted applications
  const submittedApplications = applications.filter(app => 
    ['submitted', 'under_review', 'shortlisted', 'interview', 'accepted'].includes(app.status)
  )

  const selectedApplications = randomElements(submittedApplications, Math.min(count, submittedApplications.length))

  for (const application of selectedApplications) {
    const hasProposal = Math.random() > 0.2
    const hasVideo = Math.random() > 0.3
    const hasPortfolio = Math.random() > 0.4

    const dueDate = application.submitted_at
      ? new Date(new Date(application.submitted_at).getTime() + randomInt(7, 30) * 24 * 60 * 60 * 1000)
      : randomDate(new Date(), new Date(2025, 11, 31))

    const submittedAt = Math.random() > 0.3 && application.submitted_at
      ? new Date(new Date(application.submitted_at).getTime() + randomInt(1, 14) * 24 * 60 * 60 * 1000)
      : null

    const status = submittedAt ? (Math.random() > 0.5 ? 'submitted' : 'reviewed') : 'pending'

    tryoutSubmissions.push({
      application_id: application.id,
      user_id: application.user_id,
      proposal_url: hasProposal ? `https://storage.supabase.co/tryouts/${application.id}/proposal.pdf` : null,
      video_url: hasVideo ? `https://storage.supabase.co/tryouts/${application.id}/video.mp4` : null,
      portfolio_url: hasPortfolio ? `https://storage.supabase.co/tryouts/${application.id}/portfolio.pdf` : null,
      status,
      submitted_at: submittedAt?.toISOString(),
      due_date: dueDate.toISOString()
    })
  }

  const { data, error } = await supabase
    .from('tryout_submissions')
    .insert(tryoutSubmissions)
    .select()

  if (error) {
    console.error('❌ Error seeding tryout submissions:', error)
    return []
  }

  console.log(`✅ Seeded ${data.length} tryout submissions`)
  return data
}

// ============================================================================
// FLUSH DATABASE FUNCTION
// ============================================================================

async function flushDatabase() {
  console.log('🗑️  Flushing database (deleting all existing records)...\n')

  try {
    // Delete in order respecting foreign key constraints (child tables first)
    // Using a filter that matches all rows (created_at >= '1970-01-01' which is always true)
    
    // 1. Tryout Submissions (references applications and users)
    console.log('   Deleting tryout submissions...')
    const { count: tryoutCount } = await supabase
      .from('tryout_submissions')
      .select('*', { count: 'exact', head: true })
    const { error: tryoutError } = await supabase
      .from('tryout_submissions')
      .delete()
      .gte('created_at', '1970-01-01') // Matches all rows
    if (tryoutError) console.error('   ⚠️  Error deleting tryout_submissions:', tryoutError.message)
    else console.log(`   ✅ Deleted ${tryoutCount || 0} tryout_submissions`)

    // 2. Documents (references users)
    console.log('   Deleting documents...')
    const { count: docsCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
    const { error: docsError } = await supabase
      .from('documents')
      .delete()
      .gte('uploaded_at', '1970-01-01')
    if (docsError) console.error('   ⚠️  Error deleting documents:', docsError.message)
    else console.log(`   ✅ Deleted ${docsCount || 0} documents`)

    // 3. Saved Grants (references users and grants)
    console.log('   Deleting saved grants...')
    const { count: savedCount } = await supabase
      .from('saved_grants')
      .select('*', { count: 'exact', head: true })
    const { error: savedError } = await supabase
      .from('saved_grants')
      .delete()
      .gte('created_at', '1970-01-01')
    if (savedError) console.error('   ⚠️  Error deleting saved_grants:', savedError.message)
    else console.log(`   ✅ Deleted ${savedCount || 0} saved_grants`)

    // 4. Applications (references users and grants)
    console.log('   Deleting applications...')
    const { count: appsCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
    const { error: appsError } = await supabase
      .from('applications')
      .delete()
      .gte('created_at', '1970-01-01')
    if (appsError) console.error('   ⚠️  Error deleting applications:', appsError.message)
    else console.log(`   ✅ Deleted ${appsCount || 0} applications`)

    // 5. Grants (references universities and users)
    console.log('   Deleting grants...')
    const { count: grantsCount } = await supabase
      .from('grants')
      .select('*', { count: 'exact', head: true })
    const { error: grantsError } = await supabase
      .from('grants')
      .delete()
      .gte('created_at', '1970-01-01')
    if (grantsError) console.error('   ⚠️  Error deleting grants:', grantsError.message)
    else console.log(`   ✅ Deleted ${grantsCount || 0} grants`)

    // 6. Profiles (references users and universities)
    console.log('   Deleting profiles...')
    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    const { error: profilesError } = await supabase
      .from('profiles')
      .delete()
      .gte('created_at', '1970-01-01')
    if (profilesError) console.error('   ⚠️  Error deleting profiles:', profilesError.message)
    else console.log(`   ✅ Deleted ${profilesCount || 0} profiles`)

    // 7. User Roles (references users)
    console.log('   Deleting user roles...')
    const { count: rolesCount } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
    const { error: rolesError } = await supabase
      .from('user_roles')
      .delete()
      .gte('created_at', '1970-01-01')
    if (rolesError) console.error('   ⚠️  Error deleting user_roles:', rolesError.message)
    else console.log(`   ✅ Deleted ${rolesCount || 0} user_roles`)

    // 8. Universities (standalone, no dependencies)
    console.log('   Deleting universities...')
    const { count: unisCount } = await supabase
      .from('universities')
      .select('*', { count: 'exact', head: true })
    const { error: unisError } = await supabase
      .from('universities')
      .delete()
      .gte('created_at', '1970-01-01')
    if (unisError) console.error('   ⚠️  Error deleting universities:', unisError.message)
    else console.log(`   ✅ Deleted ${unisCount || 0} universities`)

    // 9. Auth Users (via Supabase Admin API)
    console.log('   Deleting auth users...')
    const { data: { users: authUsers }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('   ⚠️  Error listing auth users:', listError.message)
    } else if (authUsers && authUsers.length > 0) {
      let deletedCount = 0
      let errorCount = 0
      for (const user of authUsers) {
        // Skip system users if any
        if (user.email?.includes('@supabase') || user.email?.includes('@system')) {
          continue
        }
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
        if (deleteError) {
          console.error(`   ⚠️  Error deleting user ${user.email}:`, deleteError.message)
          errorCount++
        } else {
          deletedCount++
        }
      }
      console.log(`   ✅ Deleted ${deletedCount} auth users${errorCount > 0 ? ` (${errorCount} errors)` : ''}`)
    } else {
      console.log('   ℹ️  No auth users to delete')
    }

    console.log('\n✅ Database flush completed!\n')
  } catch (error: any) {
    console.error('❌ Error during database flush:', error.message)
    throw error
  }
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('🚀 Starting database seed...\n')

  // Flush database first
  await flushDatabase()

  try {
    // 1. Seed Universities
    const universities = await seedUniversities()
    if (universities.length === 0) {
      console.error('❌ No universities created. Exiting.')
      return
    }

    // 2. Seed Users (Professors and Students)
    const { users, profiles } = await seedUsers(universities, 200)
    if (users.length === 0) {
      console.error('❌ No users created. Exiting.')
      return
    }

    // Get user roles from database
    const { data: userRolesData } = await supabase
      .from('user_roles')
      .select('*')

    const userRoles = userRolesData || []

    // Debug: Check what we have
    console.log(`\n📋 Debug Info:`)
    console.log(`   - Total profiles: ${profiles.length}`)
    console.log(`   - Total user roles: ${userRoles.length}`)
    console.log(`   - Total users: ${users.length}`)

    const admins_fixed = profiles.filter(p => 
      userRoles.some(ur => ur.user_id === p.user_id && ur.role === 'admin')
    )
    const professors_fixed = profiles.filter(p => 
      userRoles.some(ur => ur.user_id === p.user_id && ur.role === 'professor')
    )
    const students_fixed = profiles.filter(p => 
      userRoles.some(ur => ur.user_id === p.user_id && ur.role === 'student')
    )

    console.log(`   - Admins: ${admins_fixed.length}`)
    console.log(`   - Professors: ${professors_fixed.length}`)
    console.log(`   - Students: ${students_fixed.length}\n`)

    // If no students found, try fetching from database
    let final_students = students_fixed
    if (students_fixed.length === 0) {
      console.error('❌ No students found in returned profiles. Fetching from database...')
      // Try to fetch students directly from database
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*')
      
      const { data: allUserRoles } = await supabase
        .from('user_roles')
        .select('*')
      
      const students_from_db = (allProfiles || []).filter(p => 
        (allUserRoles || []).some(ur => ur.user_id === p.user_id && ur.role === 'student')
      )
      
      if (students_from_db.length === 0) {
        console.error('❌ Still no students found. Cannot continue.')
        return
      }
      
      console.log(`✅ Found ${students_from_db.length} students from database`)
      final_students = students_from_db
    }

    // 3. Seed Grants (created by professors, but students won't see who created them)
    const professorUsers = users
      .filter(u => userRoles.some(ur => ur.user_id === u.id && ur.role === 'professor'))
      .map(u => ({ user_id: u.id }))
    
    if (professorUsers.length === 0) {
      console.error('❌ No professors found. Cannot create grants.')
      return
    }
    
    const grants = await seedGrants(universities, professorUsers, 150)
    
    if (grants.length === 0) {
      console.error('❌ No grants created. Cannot continue.')
      return
    }

    // 4. Seed Applications
    let applications: any[] = []
    if (final_students.length === 0) {
      console.error('❌ No students available for applications. Skipping...')
    } else {
      applications = await seedApplications(final_students, grants, 300)

      // 5. Seed Saved Grants
      await seedSavedGrants(final_students, grants, 200)

      // 6. Seed Documents
      await seedDocuments(final_students, 400)

      // 7. Seed Tryout Submissions
      if (applications.length > 0) {
        await seedTryoutSubmissions(applications, 100)
      }
    }

    // 6. Seed Documents
    await seedDocuments(students_fixed, 400)

    // 7. Seed Tryout Submissions
    await seedTryoutSubmissions(applications, 100)

    console.log('\n✅ Database seed completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - ${universities.length} Universities`)
    console.log(`   - ${users.length} Users (${admins_fixed.length} admins, ${professors_fixed.length} professors, ${students_fixed.length} students)`)
    console.log(`   - ${grants.length} Grants (created by professors, students cannot see publisher)`)
    console.log(`   - ${applications.length} Applications`)
    if (final_students.length > 0) {
      console.log(`   - 200 Saved Grants`)
      console.log(`   - 400 Documents`)
      console.log(`   - 100 Tryout Submissions`)
    }
    console.log('\n📝 Note:')
    console.log('   - Professors can publish grants (created_by field set)')
    console.log('   - Students can see grants but NOT who published them')
    console.log('   - Students can only contact professors after applying')
    console.log('   - All users have password: Test123!@#')

  } catch (error) {
    console.error('❌ Fatal error during seeding:', error)
    process.exit(1)
  }
}

// Run the seed
main()
