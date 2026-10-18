// ================================================================
// Startup Environment Validator for Vista Tour & Travels
// Enforces security invariants without leaking secret values
// ================================================================

export const validateEnv = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const missing = [];

  // Required core variables
  if (!process.env.PORT) {
    process.env.PORT = '5000';
  }

  if (!process.env.JWT_SECRET) {
    if (isProduction) {
      missing.push('JWT_SECRET (Required in production for secure token signing)');
    } else {
      console.warn('[Security Warning] JWT_SECRET not set; falling back to development secret.');
      process.env.JWT_SECRET = 'vista_tour_travels_dev_jwt_secret_key_2026';
    }
  } else if (isProduction && process.env.JWT_SECRET.length < 32) {
    console.warn('[Security Warning] JWT_SECRET in production should be at least 32 characters long for cryptographic security.');
  }

  if (!process.env.MONGO_URI) {
    missing.push('MONGO_URI (Required for database connectivity)');
  }

  if (!process.env.CLIENT_URL) {
    if (isProduction) {
      console.warn('[Security Warning] CLIENT_URL not set in production. CORS may reject frontend requests.');
    } else {
      process.env.CLIENT_URL = 'http://localhost:5173';
    }
  }

  // Fail fast in production if critical secrets are missing
  if (missing.length > 0 && isProduction) {
    console.error('\n❌ FATAL: Missing required production environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('Please configure these in your deployment dashboard or production environment.\n');
    throw new Error('Production environment validation failed');
  }

  console.log(`[Config] Environment validated successfully (Mode: ${process.env.NODE_ENV || 'development'})`);
};

export default validateEnv;
