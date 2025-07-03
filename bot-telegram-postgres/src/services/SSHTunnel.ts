import { Client as SSHClient, ConnectConfig } from "ssh2";
import { createServer, Server, Socket } from "net";

export interface SSHTunnelConfig {
  sshHost: string;
  sshPort: number;
  sshUsername: string;
  sshPassword?: string;
  sshPrivateKey?: string;
  sshPassphrase?: string;
  remoteHost: string;
  remotePort: number;
  localPort: number;
}

export interface TunnelInfo {
  localHost: string;
  localPort: number;
  remoteHost: string;
  remotePort: number;
  isActive: boolean;
}

export class SSHTunnelManager {
  private sshClient?: SSHClient;
  private localServer?: Server;
  private tunnelInfo?: TunnelInfo;
  private config?: SSHTunnelConfig;

  constructor() {}

  /**
   * Create SSH tunnel
   */
  public async createTunnel(config: SSHTunnelConfig): Promise<TunnelInfo> {
    this.config = config;
    
    console.log(
      `🔗 Setting up SSH tunnel: ${config.sshUsername}@${config.sshHost}:${config.sshPort} -> ${config.remoteHost}:${config.remotePort}`
    );

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
        sshOptions.password = config.sshPassword;
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
            config.remoteHost,
            config.remotePort,
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

        this.localServer.listen(config.localPort, "localhost", () => {
          this.tunnelInfo = {
            localHost: "localhost",
            localPort: config.localPort,
            remoteHost: config.remoteHost,
            remotePort: config.remotePort,
            isActive: true,
          };
          
          console.log(
            `🚇 Local tunnel listening on port ${config.localPort}`
          );
          console.log("✅ SSH tunnel established successfully");
          
          resolve(this.tunnelInfo);
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

      this.sshClient.on("close", () => {
        console.log("🔗 SSH connection closed");
        if (this.tunnelInfo) {
          this.tunnelInfo.isActive = false;
        }
      });

      this.sshClient.connect(sshOptions);
    });
  }

  /**
   * Get tunnel information
   */
  public getTunnelInfo(): TunnelInfo | undefined {
    return this.tunnelInfo;
  }

  /**
   * Check if tunnel is active
   */
  public isActive(): boolean {
    return this.tunnelInfo?.isActive ?? false;
  }

  /**
   * Reconnect tunnel if it's disconnected
   */
  public async reconnect(): Promise<TunnelInfo> {
    if (!this.config) {
      throw new Error("No tunnel configuration available for reconnection");
    }

    if (this.isActive()) {
      console.log("🔄 Tunnel is already active, skipping reconnection");
      return this.tunnelInfo!;
    }

    console.log("🔄 Reconnecting SSH tunnel...");
    await this.close();
    return this.createTunnel(this.config);
  }

  /**
   * Close SSH tunnel
   */
  public async close(): Promise<void> {
    console.log("🔄 Closing SSH tunnel...");

    // Close local server
    if (this.localServer) {
      return new Promise((resolve) => {
        this.localServer!.close(() => {
          console.log("🚇 Local tunnel server closed");
          
          // Close SSH connection
          if (this.sshClient) {
            this.sshClient.end();
            console.log("🔗 SSH connection closed");
          }
          
          if (this.tunnelInfo) {
            this.tunnelInfo.isActive = false;
          }
          
          resolve();
        });
      });
    } else if (this.sshClient) {
      this.sshClient.end();
      console.log("🔗 SSH connection closed");
    }

    if (this.tunnelInfo) {
      this.tunnelInfo.isActive = false;
    }
  }

  /**
   * Get connection details for database
   */
  public getConnectionDetails(): { host: string; port: number } | null {
    if (!this.isActive() || !this.tunnelInfo) {
      return null;
    }

    return {
      host: this.tunnelInfo.localHost,
      port: this.tunnelInfo.localPort,
    };
  }
}

/**
 * Factory function to create SSH tunnel from environment variables
 */
export function createSSHTunnelFromEnv(
  envPrefix: string = "DB",
  localPort?: number
): SSHTunnelConfig | null {
  const useSSH = process.env[`${envPrefix}_USE_SSH`] === "true";
  
  if (!useSSH) {
    return null;
  }

  const config: SSHTunnelConfig = {
    sshHost: process.env[`${envPrefix}_SSH_HOST`] || "localhost",
    sshPort: parseInt(process.env[`${envPrefix}_SSH_PORT`] || "22"),
    sshUsername: process.env[`${envPrefix}_SSH_USERNAME`] || "root",
    sshPassword: process.env[`${envPrefix}_SSH_PASSWORD`],
    sshPrivateKey: process.env[`${envPrefix}_SSH_PRIVATE_KEY`],
    sshPassphrase: process.env[`${envPrefix}_SSH_PASSPHRASE`],
    remoteHost: process.env[`${envPrefix}_HOST`] || "localhost",
    remotePort: parseInt(process.env[`${envPrefix}_PORT`] || "5432"),
    localPort: localPort || parseInt(process.env[`${envPrefix}_LOCAL_PORT`] || "15432"),
  };

  return config;
}