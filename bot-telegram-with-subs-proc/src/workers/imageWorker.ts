import puppeteer from 'puppeteer';

interface ChartData {
  date: string;
  value: number;
}

interface WorkerInput {
  data: ChartData[];
  width?: number;
  height?: number;
}

// Read input data from stdin
let inputData = '';
process.stdin.on('data', (chunk: Buffer) => {
  inputData += chunk.toString();
});

process.stdin.on('end', async () => {
  try {
    const { data, width = 840, height = 560 }: WorkerInput = JSON.parse(inputData);
    
    // Generate the chart image
    const imageBuffer = await generateChartImage(data, width, height);
    
    // Output the buffer to stdout
    process.stdout.write(imageBuffer);
    process.exit(0);
    
  } catch (error) {
    console.error('Error in image worker:', error);
    process.stderr.write(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
});

async function generateChartImage(data: ChartData[], width: number, height: number): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width, height });
    
    // Create HTML content
    const htmlContent = createChartHTML(data);
    
    // Set content
    await page.setContent(htmlContent);
    
    // Wait for chart to be rendered
    await page.waitForFunction(() => {
      const chartDiv = document.querySelector('#chartdiv');
      return chartDiv && chartDiv.children.length > 0;
    }, { timeout: 10000 });
    
    // Additional wait for animations
    await page.waitForTimeout(2000);
    
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

function createChartHTML(data: ChartData[]): string {
  const dataString = JSON.stringify(data);
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AmCharts v4 Chart</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8f9fa;
        }
        #chartdiv {
            width: 800px;
            height: 500px;
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
        
        // Add data
        chart.data = ${dataString};
        
        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 50;
        
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minGridDistance = 30;
        
        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 3;
        series.stroke = am4core.color("#2196F3");
        series.fill = am4core.color("#2196F3");
        series.fillOpacity = 0.1;
        
        // Add bullet
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        
        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "zoomXY";
        
        // Add scrollbar
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        
        // Add title
        var title = chart.titles.create();
        title.text = "Sample Data Chart";
        title.fontSize = 20;
        title.marginBottom = 30;
        title.fontWeight = "bold";
        title.fill = am4core.color("#333");
        
        // Wait for chart to be ready
        chart.events.on("ready", function() {
            console.log("Chart is ready");
        });
    </script>
</body>
</html>`;
} 