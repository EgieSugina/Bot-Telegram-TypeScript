import { Pool, PoolClient, PoolConfig } from "pg";
import { Client as SSHClient, ConnectConfig } from "ssh2";
import { createServer, Server, Socket } from "net";
import dotenv from "dotenv";

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
  private pool!: Pool; // Definite assignment assertion
  private sshClient?: SSHClient;
  private localServer?: Server;
  private localPort?: number;

  constructor() {
    this.initializeConnection();
  }

  /**
   * Initialize database connection with optional SSH tunnel
   */
  private async initializeConnection(): Promise<void> {
    // SSH Tunnel Configuration
    const useSSH = process.env.DB_USE_SSH === "true";
    const sshHost = process.env.DB_SSH_HOST || "localhost";
    const sshPort = parseInt(process.env.DB_SSH_PORT || "22");
    const sshUsername = process.env.DB_SSH_USERNAME || "root";
    const sshPassword = process.env.DB_SSH_PASSWORD;
    const sshPrivateKey = process.env.DB_SSH_PRIVATE_KEY;
    const sshPassphrase = process.env.DB_SSH_PASSPHRASE;

    // Database configuration
    const dbHost = process.env.DB_HOST || "localhost";
    const dbPort = parseInt(process.env.DB_PORT || "5432");
    const localTunnelPort = parseInt(process.env.DB_LOCAL_PORT || "15432");

    if (useSSH) {
      console.log(
        `🔗 Setting up SSH tunnel: ${sshUsername}@${sshHost}:${sshPort} -> ${dbHost}:${dbPort}`
      );

      try {
        await this.createSSHTunnel({
          sshHost,
          sshPort,
          sshUsername,
          sshPassword,
          sshPrivateKey,
          sshPassphrase,
          dbHost,
          dbPort,
          localTunnelPort,
        });

        // Use local tunnel port for database connection
        this.createPool("localhost", localTunnelPort);
        console.log("✅ SSH tunnel established successfully");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("❌ SSH tunnel failed:", errorMessage);
        throw error;
      }
    } else {
      console.log("📡 Using direct database connection (no SSH tunnel)");
      this.createPool(dbHost, dbPort);
    }

    // Test connection on startup
    await this.testConnection();
  }

  /**
   * Create SSH tunnel for database connection
   */
  private createSSHTunnel(config: {
    sshHost: string;
    sshPort: number;
    sshUsername: string;
    sshPassword?: string;
    sshPrivateKey?: string;
    sshPassphrase?: string;
    dbHost: string;
    dbPort: number;
    localTunnelPort: number;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sshClient = new SSHClient();

      // SSH connection options
      const sshOptions: ConnectConfig = {
        host: config.sshHost,
        port: config.sshPort,
        username: config.sshUsername,
      };

      // Add authentication method
      if (config.sshPrivateKey) {
        // Use private key authentication
        sshOptions.privateKey = config.sshPrivateKey;
        if (config.sshPassphrase) {
          sshOptions.passphrase = config.sshPassphrase;
        }
        console.log("🔑 Using SSH private key authentication");
      } else if (config.sshPassword) {
        // Use password authentication
        sshOptions.password = "Sur0p4t1#";
        console.log("🔐 Using SSH password authentication");
      } else {
        reject(
          new Error(
            "No SSH authentication method provided (password or private key required)"
          )
        );
        return;
      }

      this.sshClient.on("ready", () => {
        console.log("🔌 SSH connection established");

        // Create local server for port forwarding
        this.localServer = createServer((socket: Socket) => {
          this.sshClient!.forwardOut(
            socket.remoteAddress!,
            socket.remotePort!,
            config.dbHost,
            config.dbPort,
            (err: Error | undefined, stream: any) => {
              if (err) {
                console.error("❌ SSH port forwarding error:", err);
                socket.end();
                return;
              }
              socket.pipe(stream).pipe(socket);
            }
          );
        });

        this.localServer.listen(config.localTunnelPort, "localhost", () => {
          this.localPort = config.localTunnelPort;
          console.log(
            `🚇 Local tunnel listening on port ${config.localTunnelPort}`
          );
          resolve();
        });

        this.localServer.on("error", (err: Error) => {
          console.error("❌ Local tunnel server error:", err);
          reject(err);
        });
      });

      this.sshClient.on("error", (err: Error) => {
        console.error("❌ SSH connection error:", err);
        reject(err);
      });

      this.sshClient.connect(sshOptions);
    });
  }

  /**
   * Create PostgreSQL connection pool
   */
  private createPool(host: string, port: number): void {
    const poolConfig: PoolConfig = {
      user: process.env.DB_USER,
      host: host,
      database: process.env.DB_NAME,
      password: "T3lk0ms3l#2022*05",
      port: port,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    this.pool = new Pool(poolConfig);
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
      console.log(
        `🐘 PostgreSQL version: ${result.rows[0].pg_version.split(" ")[0]}`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Database connection failed:", errorMessage);
      if (process.env.DB_USE_SSH === "true") {
        console.error("💡 Check SSH tunnel settings and database connectivity");
      }
      throw error;
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
    if (this.localServer) {
      this.localServer.close();
      console.log("🚇 Local tunnel server closed");
    }

    if (this.sshClient) {
      this.sshClient.end();
      console.log("🔗 SSH connection closed");
    }
  }
}
