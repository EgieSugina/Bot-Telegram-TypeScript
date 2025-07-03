import { Pool, PoolClient, PoolConfig } from "pg";
import dotenv from "dotenv";
import { SSHTunnelManager, createSSHTunnelFromEnv } from "./0xPhantomPortal";

dotenv.config();

export interface KPIData {
  level: string;
  area: string;
  dateid: string;
  region: string;
  operator: string;
  node: string;
  sample: number;
  download_throughput: number;
  upload_throughput: number;
  latency: number;
  jitter: number;
  packetloss: number;
  packetloss_discard: number;
  downloadthroughputtestserver: string;
  excellent_quality: number;
  hd_quality: number;
  good_quality: number;
  game_parameter: number;
  video_score_all: number;
  video_score_without_netflix: number;
  device_share: number;
  enodeb_share: number;
  good_coverage: number;
  coverage_share: number;
  video_score_netflix: number;
  download_1_5mbps: number;
  download_1_mbps: number;
  availability_4g: number;
}

export class DatabaseService {
  private pool!: Pool;
  private tunnelManager?: SSHTunnelManager;

  constructor() {
    this.initializeConnection();
  }

  /**
   * Initialize database connection with optional SSH tunnel
   */
  private async initializeConnection(): Promise<void> {
    // Check if SSH tunnel is required
    const tunnelConfig = createSSHTunnelFromEnv();

    if (tunnelConfig) {
      console.log("🔗 SSH tunnel required, setting up...");

      // Create and establish SSH tunnel
      this.tunnelManager = new SSHTunnelManager();

      try {
        const tunnelInfo = await this.tunnelManager.createTunnel(tunnelConfig);

        // Use tunnel connection details
        this.createPool(tunnelInfo.localHost, tunnelInfo.localPort);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("❌ SSH tunnel failed:", errorMessage);
        throw error;
      }
    } else {
      console.log("📡 Using direct database connection (no SSH tunnel)");

      // Direct database connection
      const dbHost = process.env.DB_HOST || "localhost";
      const dbPort = parseInt(process.env.DB_PORT || "5432");
      this.createPool(dbHost, dbPort);
    }

    // Test connection on startup
    await this.testConnection();
  }

  /**
   * Create PostgreSQL connection pool
   */
  private createPool(host: string, port: number): void {
    const poolConfig: PoolConfig = {
      user: process.env.DB_USER,
      host: host,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: port,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    this.pool = new Pool(poolConfig);

    // Handle pool errors
    this.pool.on("error", (err) => {
      console.error("❌ Database pool error:", err);

      // Attempt to reconnect SSH tunnel if it's the issue
      if (this.tunnelManager && !this.tunnelManager.isActive()) {
        console.log("🔄 Attempting to reconnect SSH tunnel...");
        this.tunnelManager.reconnect().catch(console.error);
      }
    });
  }

  /**
   * Test database connection
   */
  private async testConnection(): Promise<void> {
    try {
      const client = await this.pool.connect();
      const result = await client.query(
        "SELECT NOW() as current_time, version() as pg_version"
      );
      client.release();

      console.log("✅ Database connection established successfully");
      console.log(`📅 Database time: ${result.rows[0].current_time}`);
      console.log(`🐘 PostgreSQL version: ${result.rows[0].pg_version}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Database connection failed:", errorMessage);

      if (this.tunnelManager) {
        console.error("💡 Check SSH tunnel settings and database connectivity");
      }

      throw error;
    }
  }

  /**
   * Get database connection pool
   */
  public getPool(): Pool {
    return this.pool;
  }

  /**
   * Get tunnel manager (if using SSH tunnel)
   */
  public getTunnelManager(): SSHTunnelManager | undefined {
    return this.tunnelManager;
  }

  /**
   * Check if connection is healthy
   */
  public async isHealthy(): Promise<boolean> {
    try {
      // Check tunnel if exists
      if (this.tunnelManager && !this.tunnelManager.isActive()) {
        return false;
      }

      // Check database connection
      const client = await this.pool.connect();
      await client.query("SELECT 1");
      client.release();

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get latency data for the last 30 days
   */
  public async getLatencyData(
    region: string = "SUMBAGSEL",
    node: string = "4G"
  ): Promise<KPIData[]> {
    const client: PoolClient = await this.pool.connect();

    try {
      const query = `
        SELECT level, "Area", dateid, region, operator, node, sample, download_throughput, 
               upload_throughput, latency, jitter, packetloss, packetloss_discard, 
               downloadthroughputtestserver, excellent_quality, hd_quality, good_quality, 
               game_parameter, video_score_all, video_score_without_netflix, device_share, 
               enodeb_share, good_coverage, coverage_share, video_score_netflix, 
               download_1_5mbps, download_1_mbps, availability_4g
        FROM bot_telegram.v_daily_region 
        WHERE region = $1 AND node = $2 
        AND dateid >= CURRENT_DATE - INTERVAL '30 days'
        ORDER BY dateid ASC, operator ASC
      `;

      const result = await client.query(query, [region, node]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Generic method to get KPI data for the last 30 days
   */
  public async getKPIData(
    kpi: string,
    region: string = "SUMBAGSEL",
    node: string = "4G"
  ): Promise<KPIData[]> {
    const client: PoolClient = await this.pool.connect();

    try {
      const query = `
        SELECT level, "Area", dateid, region, operator, node, sample, download_throughput, 
               upload_throughput, latency, jitter, packetloss, packetloss_discard, 
               downloadthroughputtestserver, excellent_quality, hd_quality, good_quality, 
               game_parameter, video_score_all, video_score_without_netflix, device_share, 
               enodeb_share, good_coverage, coverage_share, video_score_netflix, 
               download_1_5mbps, download_1_mbps, availability_4g
        FROM bot_telegram.v_daily_region 
        WHERE region = $1 AND node = $2 
        AND dateid >= CURRENT_DATE - INTERVAL '30 days'
        ORDER BY dateid ASC, operator ASC
      `;

      const result = await client.query(query, [region, node]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Close database connection pool and SSH tunnel
   */
  public async close(): Promise<void> {
    console.log("🔄 Closing database connections...");

    // Close PostgreSQL pool
    if (this.pool) {
      await this.pool.end();
      console.log("🔌 Database connection pool closed");
    }

    // Close SSH tunnel if active
    if (this.tunnelManager) {
      await this.tunnelManager.close();
    }
  }
}
