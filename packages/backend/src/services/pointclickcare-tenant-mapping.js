// PointClickCare Facility to Tenant Mapping
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_HOST?.includes('rds.amazonaws.com') ? { rejectUnauthorized: false } : false
});

/**
 * Maps PointClickCare facility data to tenant IDs
 * @param {Object} pccUserInfo - User info from PointClickCare API
 * @returns {Object} - Tenant mapping result
 */
async function mapPCCUserToTenant(pccUserInfo) {
  try {
    console.log('🏥 Mapping PointClickCare user to tenant...');
    console.log('PCC User Info:', JSON.stringify(pccUserInfo, null, 2));
    
    // Extract facility information
    const facilities = pccUserInfo.facilities || [];
    const primaryFacility = pccUserInfo.primary_facility || facilities[0];
    
    if (!primaryFacility) {
      throw new Error('No facility information found for user');
    }
    
    // Method 1: Direct facility ID mapping
    const facilityMapping = await pool.query(`
      SELECT tenant_id, facility_name 
      FROM tenant_facility_mappings 
      WHERE pcc_facility_id = $1 OR pcc_facility_code = $2
    `, [primaryFacility.id, primaryFacility.code]);
    
    if (facilityMapping.rows.length > 0) {
      const mapping = facilityMapping.rows[0];
      console.log(`✅ Found direct facility mapping: ${mapping.facility_name} -> ${mapping.tenant_id}`);
      
      return {
        tenantId: mapping.tenant_id,
        facilityName: mapping.facility_name,
        method: 'direct_mapping',
        accessLevel: 'full'
      };
    }
    
    // Method 2: Facility name pattern matching
    const facilityNamePatterns = [
      { pattern: /skilled.*nursing/i, tenant: 'snf-group-tenant' },
      { pattern: /rehabilitation.*center/i, tenant: 'rehab-group-tenant' },
      { pattern: /memory.*care/i, tenant: 'memory-care-tenant' },
      // Add more patterns as needed
    ];
    
    for (const pattern of facilityNamePatterns) {
      if (pattern.pattern.test(primaryFacility.name)) {
        console.log(`✅ Found pattern match: ${primaryFacility.name} -> ${pattern.tenant}`);
        
        return {
          tenantId: pattern.tenant,
          facilityName: primaryFacility.name,
          method: 'pattern_matching',
          accessLevel: 'limited'
        };
      }
    }
    
    // Method 3: Create tenant on-demand (for new facilities)
    const autoTenantId = generateTenantIdFromFacility(primaryFacility);
    
    // Check if auto-generated tenant exists
    const existingTenant = await pool.query('SELECT id FROM tenants WHERE id = $1', [autoTenantId]);
    
    if (existingTenant.rows.length === 0) {
      // Create new tenant for this facility
      await pool.query(`
        INSERT INTO tenants (id, name, plan, status, created_via) 
        VALUES ($1, $2, $3, $4, $5)
      `, [
        autoTenantId,
        primaryFacility.name,
        'trial', // Start with trial plan
        'active',
        'pointclickcare_auto'
      ]);
      
      console.log(`✅ Created new tenant: ${autoTenantId} for facility: ${primaryFacility.name}`);
    }
    
    return {
      tenantId: autoTenantId,
      facilityName: primaryFacility.name,
      method: 'auto_created',
      accessLevel: 'full'
    };
    
  } catch (error) {
    console.error('❌ Error mapping PCC user to tenant:', error);
    throw error;
  }
}

/**
 * Generates a tenant ID from facility information
 */
function generateTenantIdFromFacility(facility) {
  // Clean facility name for tenant ID
  const cleanName = facility.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 40);
  
  return `pcc-${cleanName}`;
}

/**
 * Gets accessible tenants for a PointClickCare user
 */
async function getPCCUserAccessibleTenants(pccUserInfo) {
  try {
    const facilities = pccUserInfo.facilities || [];
    const accessibleTenants = [];
    
    for (const facility of facilities) {
      try {
        const mapping = await mapPCCUserToTenant({
          ...pccUserInfo,
          primary_facility: facility,
          facilities: [facility]
        });
        
        accessibleTenants.push({
          tenantId: mapping.tenantId,
          facilityName: mapping.facilityName,
          facilityId: facility.id,
          accessLevel: mapping.accessLevel
        });
      } catch (error) {
        console.warn(`Could not map facility ${facility.name}:`, error.message);
      }
    }
    
    return accessibleTenants;
  } catch (error) {
    console.error('Error getting accessible tenants:', error);
    return [];
  }
}

/**
 * Creates or updates facility mapping in database
 */
async function createFacilityMapping(pccFacilityId, pccFacilityCode, tenantId, facilityName) {
  try {
    await pool.query(`
      INSERT INTO tenant_facility_mappings 
      (pcc_facility_id, pcc_facility_code, tenant_id, facility_name, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (pcc_facility_id) 
      DO UPDATE SET 
        tenant_id = EXCLUDED.tenant_id,
        facility_name = EXCLUDED.facility_name,
        updated_at = NOW()
    `, [pccFacilityId, pccFacilityCode, tenantId, facilityName]);
    
    console.log(`✅ Created/updated facility mapping: ${facilityName} -> ${tenantId}`);
  } catch (error) {
    console.error('Error creating facility mapping:', error);
    throw error;
  }
}

module.exports = {
  mapPCCUserToTenant,
  getPCCUserAccessibleTenants,
  createFacilityMapping,
  generateTenantIdFromFacility
}; 