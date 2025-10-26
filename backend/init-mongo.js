// MongoDB initialization script for MGNREGA Goa Dashboard
// This script creates the database, collections, and initial data

// Switch to the MGNREGA database
db = db.getSiblingDB('mgnrega-goa-dashboard');

// Create collections with validation schemas
db.createCollection('district_data', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['districtCode', 'districtName', 'stateCode', 'stateName'],
      properties: {
        districtCode: {
          bsonType: 'string',
          description: 'District code is required and must be a string'
        },
        districtName: {
          bsonType: 'string',
          description: 'District name is required and must be a string'
        },
        stateCode: {
          bsonType: 'string',
          description: 'State code is required and must be a string'
        },
        stateName: {
          bsonType: 'string',
          description: 'State name is required and must be a string'
        },
        data: {
          bsonType: 'object',
          description: 'MGNREGA data object'
        },
        cacheMetadata: {
          bsonType: 'object',
          description: 'Cache metadata object'
        }
      }
    }
  }
});

// Create indexes for better query performance
db.district_data.createIndex({ 'districtCode': 1, 'stateCode': 1 }, { unique: true });
db.district_data.createIndex({ 'cacheMetadata.lastFetched': 1 });
db.district_data.createIndex({ 'cacheMetadata.expiresAt': 1 });
db.district_data.createIndex({ 'cacheMetadata.isStale': 1 });
db.district_data.createIndex({ 'districtName': 1 });

// Insert initial Goa districts data
db.district_data.insertMany([
  {
    districtCode: 'GA01',
    districtName: 'North Goa',
    stateCode: 'GOA',
    stateName: 'Goa',
    data: {
      workCompletion: {
        totalWorks: 0,
        completedWorks: 0,
        ongoingWorks: 0,
        pendingWorks: 0
      },
      employment: {
        totalJobCards: 0,
        activeJobCards: 0,
        totalHouseholds: 0,
        employedHouseholds: 0,
        totalPersonDays: 0
      },
      financial: {
        totalAllocation: 0,
        totalExpenditure: 0,
        availableFunds: 0,
        wagePayments: 0,
        materialCosts: 0
      },
      performance: {
        averageWageDays: 0,
        completionRate: 0,
        expenditureRate: 0
      },
      rawData: {}
    },
    cacheMetadata: {
      lastFetched: new Date(),
      apiEndpoint: 'init',
      dataSource: 'initial_setup',
      fetchDuration: 0,
      isStale: true,
      expiresAt: new Date(),
      fetchStatus: 'success',
      errorMessage: null
    },
    apiMetadata: {
      responseTime: 0,
      recordCount: 0,
      apiVersion: 'v1',
      dataQuality: 'low'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    districtCode: 'GA02',
    districtName: 'South Goa',
    stateCode: 'GOA',
    stateName: 'Goa',
    data: {
      workCompletion: {
        totalWorks: 0,
        completedWorks: 0,
        ongoingWorks: 0,
        pendingWorks: 0
      },
      employment: {
        totalJobCards: 0,
        activeJobCards: 0,
        totalHouseholds: 0,
        employedHouseholds: 0,
        totalPersonDays: 0
      },
      financial: {
        totalAllocation: 0,
        totalExpenditure: 0,
        availableFunds: 0,
        wagePayments: 0,
        materialCosts: 0
      },
      performance: {
        averageWageDays: 0,
        completionRate: 0,
        expenditureRate: 0
      },
      rawData: {}
    },
    cacheMetadata: {
      lastFetched: new Date(),
      apiEndpoint: 'init',
      dataSource: 'initial_setup',
      fetchDuration: 0,
      isStale: true,
      expiresAt: new Date(),
      fetchStatus: 'success',
      errorMessage: null
    },
    apiMetadata: {
      responseTime: 0,
      recordCount: 0,
      apiVersion: 'v1',
      dataQuality: 'low'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create additional collections for logging and monitoring
db.createCollection('api_logs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['timestamp', 'endpoint', 'method'],
      properties: {
        timestamp: {
          bsonType: 'date',
          description: 'Request timestamp'
        },
        endpoint: {
          bsonType: 'string',
          description: 'API endpoint'
        },
        method: {
          bsonType: 'string',
          description: 'HTTP method'
        }
      }
    }
  }
});

// Create indexes for API logs
db.api_logs.createIndex({ 'timestamp': -1 });
db.api_logs.createIndex({ 'endpoint': 1 });
db.api_logs.createIndex({ 'method': 1 });

// Create collection for cache statistics
db.createCollection('cache_stats');
db.cache_stats.createIndex({ 'date': -1 });

// Create administrative user for the database
db.createUser({
  user: 'mgnrega_admin',
  pwd: 'secure_password_123',
  roles: [
    {
      role: 'readWrite',
      db: 'mgnrega-goa-dashboard'
    }
  ]
});

// Insert initial cache statistics record
db.cache_stats.insertOne({
  date: new Date(),
  totalEntries: 2,
  validEntries: 0,
  staleEntries: 2,
  expiredEntries: 0,
  hitRate: '0%',
  averageResponseTime: 0,
  createdAt: new Date()
});

// Print initialization results
print('✅ MongoDB initialization completed successfully!');
print('📊 Created collections:');
print('   - district_data (with indexes)');
print('   - api_logs (with indexes)');
print('   - cache_stats (with indexes)');
print('📍 Inserted initial data:');
print('   - 2 Goa districts (North Goa, South Goa)');
print('   - Initial cache statistics');
print('👤 Created database user: mgnrega_admin');
print('🔧 Database is ready for MGNREGA Goa Dashboard backend!');
