

import { Component, OnInit, ViewChild } from '@angular/core';

import { ChartComponent, ApexPlotOptions, ApexLegend, ApexAnnotations, ApexChart, ApexTooltip, ApexFill, ApexDataLabels, ApexStroke, ApexXAxis, ApexYAxis, ApexAxisChartSeries } from 'ng-apexcharts';

@Component({
  selector: 'app-my-report',
  templateUrl: './my-report.component.html',
  styleUrls: ['./my-report.component.scss']
})
export class MyReportComponent implements OnInit {
  copyrightYear=new Date();
  loggedUser:any;
  institution:any;

  print() {
    window.print()
  }
  constructor() {
    this.loggedUser = JSON.parse(localStorage.getItem("login_data"))['name'];
    this.institution = JSON.parse(localStorage.getItem("login_data"))['institution'];

    // console.log(JSON.parse(localStorage.getItem("login_data")))
   }
  ngOnInit() {
    this.barChart();
    this.circleChart();
  }
  // Overall chart block starts................................//

  circleAverage: [];
  overallSeries: Array<Array<number>> = [];

  overallChartOptions: ApexChart = {

    height: 360,
    type: 'radialBar',

    toolbar: {
      show: false
    },

    dropShadow: {
      enabled: true,
      top: 3,
      left: 0,
      blur: 4,
      opacity: 0.24
    }
  };

  overallPlotOptions: ApexPlotOptions = {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: "#D8D8D8",
        strokeWidth: '97%',
        margin: -10, // margin is in pixels

      },
      dataLabels: {
        name: {
          show: false
        },
        value: {
          offsetY: -15,
          fontSize: '22px'
        }
      }
    }
  }

  stroke: ApexStroke = {
    // lineCap: 'round'
  };


  overallFill: ApexFill = {
    type: 'soild',
    colors: ['#26c58f'],

    gradient: {
      shade: 'light',
      type: 'horizontal',
      shadeIntensity: 0.8,
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }

  }




  // Overall chart block ends................................//

  // ----------------------------------------------------------------------------------------------//

  // Bar chart block start................................//
  barcolors = [];

  barSeries: any = [{
    data: [78, 86, 49, 55, 39, 75, 38, 45, 58, 45, 61, 32, 84]
  }]

  barChartOptions: ApexChart = {
    dropShadow: {
      enabled: true,
      top: 3,
      left: 0,
      blur: 3,
      opacity: 0.24
    },
    toolbar: {
      show: false
    },
    height: 470,
    type: 'bar',
  };

  barplotOptions: ApexPlotOptions = {

    bar: {
      horizontal: true,
      distributed: true,
      endingShape: 'rounded',
      barHeight: '60%',
      dataLabels: {
        position: 'top',
        maxItems: 100,
        hideOverflowingLabels: true,
        orientation: 'horizontal'
      }

    }
  }

  barDataLabels: ApexDataLabels = {
    enabled: true,
    offsetX: 35,
    style: {
      fontSize: '20px',
      colors: ['#000']
    }
  };

  barxaxis: ApexXAxis = {
    max: 100,
        categories: ['Programming','Algo and DS','OOPS','System Design', 'UI', 'Web API','Mobile' ,'NoSQL', 'SQL', 'Data Analysis', 'Quality',  'Quantitative','Demonstration',   ],

  };

  baryaxis: ApexYAxis = {
    opposite: false,
    labels: {
      style: {
        fontSize: '12px',

      },
    },
  };

  barTooltip: ApexTooltip = {
    x: {
      show: true,
    },
    y: {
      title: {
        formatter: function () {
          return ''
        }
      }
    }
  }

  barAnnotations: ApexAnnotations = {
    xaxis: [{
      x: 50.2,
      strokeDashArray: 0,
      borderColor: '#F1F1F1',
      label: {
        borderColor: '#F1F1F1',
        style: {
          color: '#fff',
          background: '#5B5B5B',
        },
        text: 'Weak',
      }
    },
    {
      x: 80.4,
      strokeDashArray: 0,
      borderColor: '#F1F1F1',
      label: {
        // offsetY: 350,

        borderColor: '#F1F1F1',
        style: {
          // fontSize: '15px',
          color: '#fff',
          background: '#5B5B5B',
        },
        text: 'Proficient',
      }
    }, {
      x: 100,
      strokeDashArray: 0,
      borderColor: '#F1F1F1',
      label: {
        // offsetX: 20,
        borderColor: '#F1F1F1',
        style: {
          // fontSize: '15px',
          color: '#fff',
          background: '#5B5B5B',
        },
        text: 'Strong',
      }
    }],

  }
  barChart() {
    for (let i in this.barSeries[0].data) {

      if (this.barSeries[0].data[i] < 50) {
        this.barcolors.push("#d95467");
      } else if (this.barSeries[0].data[i] >= 50 && this.barSeries[0].data[i] < 80) {
        this.barcolors.push("#d8a132");
      } else if (this.barSeries[0].data[i] >= 80) {
        this.barcolors.push("#26c58f");
      }

    }
  }
  // Bar chart block ends................................//

  // ----------------------------------------------------------------------------------------------//

  // circle chart block starts

  circleSeries: Array<Array<number>> = [[91], [79], [49], [96], [93], [78], [0]];


  circleChart() {
    let average = 0
    for (let i in this.circleSeries) {
      average += this.circleSeries[i][0];

      this.circleFill[i].colors[0] = this.colorCompose(this.circleSeries[i][0])

    }
    average = Math.round(average / 6)
    this.circleFill[6].colors[0] = this.colorCompose(average)
    this.circleSeries[6][0] = average
  }

  colorCompose(percent: number) {
    if (percent < 50) {
      return "#d95467";
    } else if (percent >= 50 && percent < 80) {
      return "#d8a132";
    } else if (percent >= 80) {
      return "#26c58f";
    }

  }

  circleChartOptions: ApexChart = {
    height: 250,
    type: 'radialBar',
    toolbar: {
      show: false
    },
    dropShadow: {
      enabled: true,
      top: 3,
      left: 0,
      blur: 4,
      opacity: 0.24
    }
  };

  circleplotOptions: ApexPlotOptions = {
    radialBar: {
      startAngle: -135,
      endAngle: 225,
      hollow: {
        margin: 0,
        size: '20%',
        background: 'white',
        image: undefined,
        offsetX: 0,
        offsetY: 0,
        position: 'back',


      },

      track: {
        background: '#D8D8D8',
        strokeWidth: '95%',
        margin: 15, // margin is in pixels

      },


      dataLabels: {
        name: {
          offsetY: -10,
          show: false,
          color: '#1E5B8A',
          fontSize: '17px'
        },

        value: {
          offsetY: 7,
          color: '#111',
          fontSize: '15px',
          show: true,
        }
      }
    }
  };

  circleFill: Array<ApexFill> = [{
    type: 'solid',
    colors: ['#d8a132'],

  }, {
    type: 'solid',
    colors: ['#d95467'],

  }, {
    type: 'solid',
    colors: ['#26c58f'],
  }, {
    type: 'solid',
    colors: ['#2689d6'],

  }, {
    type: 'solid',
    colors: ['#2689d6'],

  },
  {
    type: 'solid',
    colors: ['#2689d6'],

  },
  {
    type: 'solid',
    colors: ['#2689d6'],

  },
  ];

  // circle chart block ends.......................................//

  // -------------------------------------------------------------------------------------------//

  // Line chart block starts.......................................//
  @ViewChild('stacked', { static: false }) stacked: ChartComponent;

  stackedChartOptions: ApexChart = {
    height: 350,
    width: 480,
    type: 'bar',
    toolbar: {
      show: false
    },
    stacked: true,
    events: {
      selection: function (chart, e) {
        // console.log(new Date(e.xaxis.min))
      }
    },

  };
  stackedPlotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
    }
  }

  stackedDataLabels: ApexDataLabels = {
    enabled: true
  }
  series1: Array<number> = [3, 3.5, 5, 4, 2, 4, 6, 4.5]
  series2: Array<number> = [2, 2.5, 1, 3, 5, 2, 1.5, 1.5]
  series3: Array<number> = [5, 6, 6, 7, 7, 6, 7.5, 6]
  stackedLearningSeries: Array<number> = this.generateDayWiseTimeSeries(new Date('11 Oct 2017 GMT').getTime(), 8, this.series1)
  stackedPracticeSeries: Array<number> = this.generateDayWiseTimeSeries(new Date('11 Oct 2017 GMT').getTime(), 8, this.series2)
  stackedTotalSeries: Array<number> = this.generateDayWiseTimeSeries(new Date('11 Oct 2017 GMT').getTime(), 8, this.series3)


  stackedSeries: any = [{
    name: '  Learning',
    data: this.stackedLearningSeries
  },
  {
    name: '  Hands-on',
    data: this.stackedPracticeSeries
  },

  ]

  stackedFill: ApexFill = {
    opacity: 1
  };
  stackedLegend: ApexLegend = {
    position: 'bottom',
    horizontalAlign: 'right',
    markers: {
      radius: 12
    }
  };

  stackedXAxis: ApexXAxis = {

    type: 'category',
    categories: ['1', '2', '3', '4', '5', '6', '7', '8'],
    axisTicks: {
      show: false,
    },
    crosshairs: {
      width: 1,
    }
  };

  generateDayWiseTimeSeries(baseval, count, timeSeries) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y = timeSeries[i] * 7
      series.push(y);
      i++;
    }
    // console.log(series)
    return series;
  }

  stackedTootTip: ApexTooltip = {
    shared: true,
    followCursor: true,
    x: {
      formatter: function (val) {
        return 'Week ' + val
      }
    }

  }
  // Line chart block ends.........................................//





}
