import { spawn, ChildProcess } from "child_process";
import * as path from "path";
import * as fs from "fs";
import { KPIData } from "./DatabaseService";

export interface ChartData {
  date: string;
  operator?: string;
  value: number;
  [key: string]: any;
}

export interface ChartConfig {
  width?: number;
  height?: number;
  title?: string;
  chartType?: 'line' | 'column' | 'area';
  kpiName?: string;
  unit?: string;
  template?: 'kpi' | 'simple' | 'custom';
  colors?: string[];
  [key: string]: any;
}

export interface ChartOptions {
  width?: number;
  height?: number;
  timeout?: number;
  waitForSelector?: string;
  waitTime?: number;
}

export class ChartProcessor {
  private nodePath: string;
  private scriptPath: string;

  constructor() {
    this.nodePath = process.execPath;
    // Use the generic chart worker
    this.scriptPath = path.join(process.cwd(), "dist", "services", "chartWorker.js");
    if (!fs.existsSync(this.scriptPath)) {
      throw new Error(
        `Chart Worker script not found at: ${this.scriptPath}\nDid you run 'yarn build'?`
      );
    }
  }

  /**
   * Generate chart from data configuration
   */
  public async generateChartFromData(
    data: ChartData[],
    chartConfig: ChartConfig,
    options: ChartOptions = {}
  ): Promise<Buffer> {
    const input = {
      mode: 'data' as const,
      data,
      chartConfig,
      ...options
    };

    return this.processChart(input);
  }

  /**
   * Generate chart from HTML string
   */
  public async generateChartFromHTML(
    html: string,
    options: ChartOptions = {}
  ): Promise<Buffer> {
    const input = {
      mode: 'html' as const,
      html,
      ...options
    };

    return this.processChart(input);
  }

  /**
   * Transform KPI data into chart format
   */
  public transformKPIData(kpiData: KPIData[], kpiField: keyof KPIData): ChartData[] {
    const chartData: ChartData[] = [];
    
    kpiData.forEach((record) => {
      const value = record[kpiField];
      if (typeof value === 'number' && !isNaN(value)) {
        chartData.push({
          date: record.dateid,
          operator: record.operator,
          value: value
        });
      }
    });

    return chartData.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return (a.operator || '').localeCompare(b.operator || '');
    });
  }

  /**
   * Get unique operators from data
   */
  public getOperators(data: ChartData[]): string[] {
    const operators = new Set<string>();
    data.forEach(record => {
      if (record.operator) {
        operators.add(record.operator);
      }
    });
    return Array.from(operators).sort();
  }

  /**
   * Generate latency chart specifically (backward compatibility)
   */
  public async generateLatencyChart(kpiData: KPIData[]): Promise<Buffer> {
    const chartData = this.transformKPIData(kpiData, 'latency');
    
    return this.generateChartFromData(chartData, {
      title: 'Network Latency - Last 30 Days',
      kpiName: 'Latency',
      unit: 'ms',
      chartType: 'line',
      template: 'kpi',
      width: 1200,
      height: 700
    });
  }

  /**
   * Generate any KPI chart with flexible configuration
   */
  public async generateKPIChart(
    kpiData: KPIData[], 
    kpiField: keyof KPIData,
    config: Partial<ChartConfig> = {}
  ): Promise<Buffer> {
    const chartData = this.transformKPIData(kpiData, kpiField);
    
    const defaultConfig: ChartConfig = {
      title: `${String(kpiField)} - Last 30 Days`,
      kpiName: String(kpiField),
      chartType: 'line',
      template: 'kpi',
      width: 1200,
      height: 700
    };

    const finalConfig = { ...defaultConfig, ...config };
    
    return this.generateChartFromData(chartData, finalConfig);
  }

  /**
   * Create custom HTML template for specific chart requirements
   */
  public createCustomHTML(
    data: any[], 
    templateConfig: {
      title?: string;
      chartLibrary?: 'amcharts' | 'chartjs' | 'custom';
      customCSS?: string;
      customJS?: string;
      width?: number;
      height?: number;
    }
  ): string {
    const {
      title = "Custom Chart",
      chartLibrary = 'amcharts',
      customCSS = '',
      customJS = '',
      width = 1000,
      height = 600
    } = templateConfig;

    const dataString = JSON.stringify(data);

    if (chartLibrary === 'amcharts') {
      return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8f9fa;
        }
        #chartdiv {
            width: ${width}px;
            height: ${height}px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        ${customCSS}
    </style>
</head>
<body>
    <div id="chartdiv"></div>
    
    <!-- AmCharts v4 -->
    <script src="https://cdn.amcharts.com/lib/4/core.js"></script>
    <script src="https://cdn.amcharts.com/lib/4/charts.js"></script>
    <script src="https://cdn.amcharts.com/lib/4/themes/animated.js"></script>
    
    <script>
        am4core.useTheme(am4themes_animated);
        var chartData = ${dataString};
        
        ${customJS}
        
        // Default chart creation if no custom JS provided
        if (typeof chart === 'undefined') {
            var chart = am4core.create("chartdiv", am4charts.XYChart);
            chart.data = chartData;
            
            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            
            var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "value";
            series.dataFields.dateX = "date";
            
            var title = chart.titles.create();
            title.text = "${title}";
        }
    </script>
</body>
</html>`;
    }

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        #chartdiv { width: ${width}px; height: ${height}px; }
        ${customCSS}
    </style>
</head>
<body>
    <div id="chartdiv"></div>
    <script>
        var chartData = ${dataString};
        ${customJS}
    </script>
</body>
</html>`;
  }

  /**
   * Process chart generation with child process
   */
  private async processChart(input: any): Promise<Buffer> {
    const { timeout = 30000 } = input;

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
        reject(new Error("Chart processing timeout"));
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
            new Error(`Chart worker failed with code ${code}: ${errorOutput}`)
          );
        }
      });

      // Handle process errors
      childProcess.on("error", (error: Error) => {
        clearTimeout(timeoutId);
        reject(error);
      });

      // Send data to child process
      if (childProcess.stdin) {
        childProcess.stdin.write(JSON.stringify(input));
        childProcess.stdin.end();
      } else {
        reject(new Error("Child process stdin is not available"));
      }
    });
  }
} 