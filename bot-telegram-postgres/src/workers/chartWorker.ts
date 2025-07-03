import puppeteer from 'puppeteer';

interface ChartWorkerInput {
  mode: 'data' | 'html';
  
  // For data mode
  data?: any[];
  chartConfig?: {
    width?: number;
    height?: number;
    title?: string;
    chartType?: string;
    kpiName?: string;
    unit?: string;
    template?: 'kpi' | 'simple' | 'custom';
    colors?: string[];
    [key: string]: any;
  };
  
  // For HTML mode
  html?: string;
  
  // Common options
  width?: number;
  height?: number;
  timeout?: number;
  waitForSelector?: string;
  waitTime?: number;
}

// Read input data from stdin
let inputData = '';
process.stdin.on('data', (chunk: Buffer) => {
  inputData += chunk.toString();
});

process.stdin.on('end', async () => {
  try {
    const input: ChartWorkerInput = JSON.parse(inputData);
    
    let htmlContent: string;
    
    if (input.mode === 'html') {
      // Direct HTML mode
      if (!input.html) {
        throw new Error('HTML content is required when mode is "html"');
      }
      htmlContent = input.html;
    } else if (input.mode === 'data') {
      // Data-driven chart generation
      if (!input.data || !input.chartConfig) {
        throw new Error('Data and chartConfig are required when mode is "data"');
      }
      htmlContent = generateChartHTML(input.data, input.chartConfig);
    } else {
      throw new Error('Invalid mode. Must be "data" or "html"');
    }
    
    // Generate the chart image
    const imageBuffer = await generateChartImage(
      htmlContent,
      input.width || input.chartConfig?.width || 1000,
      input.height || input.chartConfig?.height || 600,
      input.waitForSelector || '#chartdiv',
      input.waitTime || 3000
    );
    
    // Output the buffer to stdout
    process.stdout.write(imageBuffer);
    process.exit(0);
    
  } catch (error) {
    console.error('Error in chart worker:', error);
    process.stderr.write(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
});

async function generateChartImage(
  htmlContent: string,
  width: number,
  height: number,
  waitForSelector: string = '#chartdiv',
  waitTime: number = 3000
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width, height });
    
    // Set content
    await page.setContent(htmlContent);
    
    // Wait for chart to be rendered
    await page.waitForFunction((selector) => {
      const element = document.querySelector(selector);
      return element && element.children.length > 0;
    }, { timeout: 15000 }, waitForSelector);
    
    // Additional wait for animations and dynamic content
    await page.waitForTimeout(waitTime);
    
    // Take screenshot as buffer
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width,
        height
      }
    });
    
    return screenshot;
    
  } finally {
    await browser.close();
  }
}

function generateChartHTML(data: any[], config: any): string {
  const template = config.template || 'kpi';
  
  switch (template) {
    case 'kpi':
      return generateKPIChartHTML(data, config);
    case 'simple':
      return generateSimpleChartHTML(data, config);
    default:
      throw new Error(`Unknown template: ${template}`);
  }
}

function generateKPIChartHTML(data: any[], config: any): string {
  const {
    title = "KPI Chart",
    kpiName = "Value",
    unit = "",
    chartType = "line",
    width = 1000,
    height = 600,
    colors = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", 
      "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
    ]
  } = config;

  // Group data by operator if it has operator field
  const hasOperator = data.length > 0 && 'operator' in data[0];
  let operators: string[] = [];
  
  if (hasOperator) {
    const operatorData: { [key: string]: any[] } = {};
    data.forEach(record => {
      if (!operatorData[record.operator]) {
        operatorData[record.operator] = [];
      }
      operatorData[record.operator].push({
        date: record.date,
        value: record.value
      });
    });
    operators = Object.keys(operatorData);
  }

  const dataString = JSON.stringify(data);
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Chart - ${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8f9fa;
        }
        #chartdiv {
            width: ${Math.max(800, width * 0.8)}px;
            height: ${Math.max(500, height * 0.8)}px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
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
        
        // Create chart instance
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        
        var allData = ${dataString};
        var hasOperator = ${hasOperator};
        
        if (hasOperator) {
            // Prepare data grouped by date with all operators
            var chartData = {};
            
            // Initialize dates
            allData.forEach(function(record) {
                if (!chartData[record.date]) {
                    chartData[record.date] = { date: record.date };
                }
                chartData[record.date][record.operator] = record.value;
            });
            
            // Convert to array
            var finalData = Object.values(chartData);
            chart.data = finalData;
        } else {
            // Simple data structure
            chart.data = allData;
        }
        
        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 50;
        dateAxis.dateFormats.setKey("day", "MM-dd");
        dateAxis.periodChangeDateFormats.setKey("day", "MM-dd");
        
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minGridDistance = 30;
        valueAxis.title.text = "${kpiName}" + (${JSON.stringify(unit)} ? " (${unit})" : "");
        
        // Color palette
        var colors = ${JSON.stringify(colors)};
        
        if (hasOperator) {
            var operators = ${JSON.stringify(operators)};
            
            // Create series for each operator
            operators.forEach(function(operator, index) {
                var series;
                
                if ("${chartType}" === "column") {
                    series = chart.series.push(new am4charts.ColumnSeries());
                } else if ("${chartType}" === "area") {
                    series = chart.series.push(new am4charts.LineSeries());
                    series.fillOpacity = 0.3;
                } else {
                    series = chart.series.push(new am4charts.LineSeries());
                }
                
                series.dataFields.valueY = operator;
                series.dataFields.dateX = "date";
                series.name = operator;
                series.strokeWidth = 3;
                series.stroke = am4core.color(colors[index % colors.length]);
                series.fill = am4core.color(colors[index % colors.length]);
                
                // Add bullet for line charts
                if ("${chartType}" !== "column") {
                    var bullet = series.bullets.push(new am4charts.CircleBullet());
                    bullet.circle.strokeWidth = 2;
                    bullet.circle.radius = 4;
                    bullet.circle.fill = am4core.color("#fff");
                    bullet.circle.stroke = series.stroke;
                }
                
                // Tooltip
                series.tooltipText = "{name}: [bold]{valueY}[/]" + (${JSON.stringify(unit)} ? " ${unit}" : "");
            });
            
            // Add legend
            chart.legend = new am4charts.Legend();
            chart.legend.position = "bottom";
            chart.legend.paddingTop = 20;
            chart.legend.markers.template.width = 15;
            chart.legend.markers.template.height = 15;
        } else {
            // Single series for simple data
            var series;
            
            if ("${chartType}" === "column") {
                series = chart.series.push(new am4charts.ColumnSeries());
            } else if ("${chartType}" === "area") {
                series = chart.series.push(new am4charts.LineSeries());
                series.fillOpacity = 0.3;
            } else {
                series = chart.series.push(new am4charts.LineSeries());
            }
            
            series.dataFields.valueY = "value";
            series.dataFields.dateX = "date";
            series.strokeWidth = 3;
            series.stroke = am4core.color(colors[0]);
            series.fill = am4core.color(colors[0]);
            
            // Add bullet for line charts
            if ("${chartType}" !== "column") {
                var bullet = series.bullets.push(new am4charts.CircleBullet());
                bullet.circle.strokeWidth = 2;
                bullet.circle.radius = 4;
                bullet.circle.fill = am4core.color("#fff");
                bullet.circle.stroke = series.stroke;
            }
            
            // Tooltip
            series.tooltipText = "[bold]{valueY}[/]" + (${JSON.stringify(unit)} ? " ${unit}" : "");
        }
        
        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "zoomXY";
        
        // Add title
        var chartTitle = chart.titles.create();
        chartTitle.text = "${title}";
        chartTitle.fontSize = 18;
        chartTitle.marginBottom = 20;
        chartTitle.fontWeight = "bold";
        chartTitle.fill = am4core.color("#333");
        
        // Add scrollbar for long data
        if (chart.data.length > 15) {
            chart.scrollbarX = new am4charts.XYChartScrollbar();
        }
        
        // Wait for chart to be ready
        chart.events.on("ready", function() {
            console.log("Chart is ready");
        });
    </script>
</body>
</html>`;
}

function generateSimpleChartHTML(data: any[], config: any): string {
  const {
    title = "Simple Chart",
    width = 800,
    height = 500,
    colors = ["#2196F3"]
  } = config;

  const dataString = JSON.stringify(data);
  
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
        
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = ${dataString};
        
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 3;
        series.stroke = am4core.color("${colors[0]}");
        
        var title = chart.titles.create();
        title.text = "${title}";
        title.fontSize = 18;
        title.marginBottom = 20;
        
        chart.events.on("ready", function() {
            console.log("Simple chart is ready");
        });
    </script>
</body>
</html>`;
} 