import { spawn, ChildProcess } from "child_process";
import * as path from "path";
import * as fs from "fs";

export interface ChartData {
  date: string;
  value: number;
}

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  timeout?: number;
}

export class ImageProcessor {
  private nodePath: string;
  private scriptPath: string;

  constructor() {
    this.nodePath = process.execPath;
    // Always use the compiled JS worker from dist
    this.scriptPath = path.join(process.cwd(), "dist", "workers", "imageWorker.js");
    if (!fs.existsSync(this.scriptPath)) {
      throw new Error(
        `Worker script not found at: ${this.scriptPath}\nDid you run 'yarn build'?`
      );
    }
  }

  /**
   * Generate chart image as buffer using child process
   */
  public async generateChartAsBuffer(
    data: ChartData[],
    options: ImageProcessingOptions = {}
  ): Promise<Buffer> {
    const { width = 840, height = 560, timeout = 30000 } = options;

    return new Promise((resolve, reject) => {
      let childProcess: ChildProcess;
      childProcess = spawn(this.nodePath, [this.scriptPath], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let outputBuffer = Buffer.alloc(0);
      let errorOutput = "";

      // Set timeout
      const timeoutId = setTimeout(() => {
        childProcess.kill("SIGTERM");
        reject(new Error("Image processing timeout"));
      }, timeout);

      // Handle stdout (image buffer)
      if (childProcess.stdout) {
        childProcess.stdout.on("data", (chunk: Buffer) => {
          outputBuffer = Buffer.concat([outputBuffer, chunk]);
        });
      }

      // Handle stderr
      if (childProcess.stderr) {
        childProcess.stderr.on("data", (chunk: Buffer) => {
          errorOutput += chunk.toString();
        });
      }

      // Handle process completion
      childProcess.on("close", (code: number) => {
        clearTimeout(timeoutId);

        if (code === 0 && outputBuffer.length > 0) {
          resolve(outputBuffer);
        } else {
          reject(
            new Error(`Child process failed with code ${code}: ${errorOutput}`)
          );
        }
      });

      // Handle process errors
      childProcess.on("error", (error: Error) => {
        clearTimeout(timeoutId);
        reject(error);
      });

      // Send data to child process
      const inputData = {
        data,
        width,
        height,
      };

      if (childProcess.stdin) {
        childProcess.stdin.write(JSON.stringify(inputData));
        childProcess.stdin.end();
      } else {
        reject(new Error("Child process stdin is not available"));
      }
    });
  }

  /**
   * Generate sample chart data
   */
  public generateRandomData(): ChartData[] {
    const data: ChartData[] = [];
    const baseValue = Math.random() * 100;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      
      data.push({
        date: date.toISOString().split("T")[0],
        value: baseValue + Math.random() * 50 - 25,
      });
    }
    
    return data;
  }
}
