const csvdata = d3.csv("nodes_word_xy.csv", function (data) {
  var testdata = Array();
  var x = [];
  var y = [];
  var title = [];
  var index = [];
  for (var i = 0; i < data.length; i++) {
    testdata.push(data[i]);
    x.push(parseFloat(data[i].x));
    y.push(parseFloat(data[i].y));
    title.push(data[i].title);
    index.push(data[i].index);
  }
  console.log(testdata);
  var minx = d3.min(x);
  var maxx = d3.max(x);
  var miny = d3.min(y);
  var maxy = d3.max(y);
  // var x = []
  // var y = []
  // for( var i=0; i<data.length; i++ ){
  //      x.push(data[i].x);
  //      y.push(data[i].y);
  //  }
  // console.log(x)
  console.log(data);
  // console.log(data[0].x)
  width = 2000;
  height = 1800;
  margin = {
    top: 10,
    right: 100,
    bottom: 30,
    left: 50,
  };
  // 定义比例尺
  const xScale = d3.scaleLinear().domain([minx, maxx]).range([0, 1000]);
  const yScale = d3.scaleLinear().domain([miny, maxy]).range([900, 0]);
  // xScale = d3.scaleLinear(
  //     d3.extent( testdata, d => d.x ),
  //     [ margin.left, width - margin.right ]
  //   )
  //   yScale = d3.scaleLinear(
  //     d3.extent( testdata, d => d.y ),
  //     [ height - margin.bottom, margin.top ]
  //   )
  // 坐标轴
  xAxis = d3.axisBottom(xScale);
  yAxis = d3.axisLeft(yScale);
  // console.log(xScale);
  // const brush = d3.brush().on("start brush end", brushed);



  //添加悬浮时的提示框（显示id的）
  const tooltip = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("color", "#3497db")
    // .style("visibility", "hidden") // 是否可见（一开始设置为隐藏）
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text(" ");
  // 添加svg
  const svg = d3
    .select("body")
    .append('div')

    .style("width", 1000)
    .style("height", 900)
    .style("position",'absolute')
    .style('overflow','auto')
    .append("svg")
    .attr("id", "svg1")
    // .attr("dx", "100")
    // .style("left","100px")
    .style("width", 1000)
    .style("height", 900)

    .property("value", []);
  // 添加右侧的文本显示框
  const textarea = d3
    .select("body")
    .append("textarea")
    .attr("id", "display")
    .attr("rows", "10")
    .attr("cols", "80")
    .style("top", "100")
    .style("position", "fixed")
    .style('left','1100px')
    .text(" ");
    // 添加直方图
  const barchart =  d3
  .select("body")
  .append("svg")
  .attr('id','svg2')
  .style("width", "550")
  .style("height", "600")
  .style("position", "fixed")
    .style('left','1000px')
    .style('top','200px');
      // 定义缩放
  // var zoom = d3.zoom()
  // .scaleExtent([0.1, 10]).on("zoom", zoomed);
  function zoomed(d) {
    var transform = d3.event.transform;
    // console.log('zoom')
    // d3.select('circle')
    // .attr('transform', e.transform);
    // svg.attr('transform', transform.toString());
    // svg.attr("transform",
    //     "translate(" + zoom.translate() + ")" +
    //     "scale(" + zoom.scale() + ")"
    // );
    var newX = d3.event.transform.rescaleX(xScale);
    var newY = d3.event.transform.rescaleY(yScale);
    d3.select('#svg1')
    .selectAll("circle")
    // .attr('transform',`translate(${function(d){return newX(d.x)}},${ty})`);
    // .attr('cy', function(d) {return newY(d.y)+500})
    // .attr('cx', function(d) {return newX(d.x)+450})

    // d3.select('#svg1').selectAll('circle').attr('transform','translate(' + transform.x + ', ' + transform.y +') scale(' + transform.k + ')');
    // d3.select('#svg1').selectAll('circle').attr()
    d3.select('#svg1').attr('transform','translate(' + transform.x + ', ' + transform.y +') scale(' + transform.k + ')');
    // console.log(svg.attr('transform'))
}

  var zoom = d3.zoom()
  // .scaleExtent([0.5, 10])  // This control how much you can unzoom (x0.5) and zoom (x20)
  .extent([[0, 0], [width, height]])
  .on("zoom", zoomed);
  d3.select('#svg1').attr("transform","translate(100,0)")
  d3.select('#svg1').call(zoom)


  // d3.select('#svg1').append("rect")
  // .attr("width", width)
  // .attr("height", height)
  // .style("fill", "none")
  // .style("pointer-events", "all")
  // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  // .call(zoom)

  //  const brush = d3.select('body')
  //  .append('svg')
  //  .attr('id','brush')
  //  svg.call(d3.brush().extent([[0,0],[1000,1000]]))
  // .attr('transform', `translate(400,400)`)
  // var svgGroup = d3.selectAll("g");
  // var zoom = d3.zoom().on("zoom", function () {
  //   svgGroup.attr("transform", d3.event.transform);
  // });
  // d3.select("#svg1").call(zoom);
  // 矩形选择框的各种函数brush
  function isBrushed(brush_coords, cx, cy) {
    var x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
  }

  function brush_start() {
    extent = d3.event.selection;
    myCircle = d3
      .selectAll("circle")
      .data(testdata)
      .classed("selected", function (d) {
        return isBrushed(extent, xScale(d.x) , yScale(d.y));
      });
  }

  function brush_ended() {
    myg = d3.selectAll(".selected").select(function () {
      return this.parentNode;
    });
    let corpus=[]
    let context = "";
    // console.log(myg._groups[0])
    if (myg._groups[0].length > 0) {
      for (let i = 0; i < myg._groups[0].length; i++) {
        // console.log(myg._groups[0][i].__data__);
        // index.push(myg._groups[0][i].__data__.index)
        // title.push(myg._groups[0][i].__data__.title)
        d3.select("#display").text(
          `${context}title:${myg._groups[0][i].__data__.title}\n`
        );
        // console.log(d3.select("#display").property("value"));
        // 将框选结果都显示在文本框 字符串的连接
        context = d3.select("#display").property("value");
        corpus.push(myg._groups[0][i].__data__.words)
      }
      // console.log(corpus)

      // 直方图绘制联动
      d3.select('#svg2').remove()
      const barchart =  d3
      .select("body")
      .append("svg")
      .attr('id','svg2')
      .style("width", "650")
      .style("height", "600")
      .style("position", "fixed")
        .style('left','1100px')
        .style('top','200px');
      let map = {};
      let list = Array()
      for (let i = 0; i < corpus.length; i++) {
        var str = corpus[i];
        var array = str.split(" ");
        for (let i = 0; i < array.length; i++) {
          var strWord = array[i];
          if (!map[strWord]) {
            map[strWord] = 1;
          } else {
            map[strWord]++;
          }
        }
      }
      for (let word in map) {
        list.push({
          keyword:word,
          num:map[word]
        })
      }
      
      console.log(map)
      console.log(list)
      list.sort(function(a, b){return b.num - a.num});

      data =[]
      for(let i=0;i<20;i++){
          data.push(list[i])
          console.log(list[i].keyword)
      }
      // console.log(data[0].keyword)
      // console.log(data)
      
      let height = 500;
      let width = 600;
      
      let margin = {
        top: 10,
        right: 10,
        bottom: 20,
        left: 35,
      };
      
      yMax = d3.max(data, (d) => d.num);
      
      xDomain = data.map((d) => d.keyword);
      
      let xScale = d3
        .scaleBand()
        .domain(xDomain)
        .range([margin.left, width - margin.right - margin.left])
        .padding(0.5);
      
      let yScale = d3
        .scaleLinear()
        .domain([0, yMax])
        .range([height - margin.bottom, margin.top]);
      
      let xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
      
      let yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

      // const container = html `<svg width="900" height="500"/>`
      
      // const svg = d3.select(container)
      
      barchart
        .append("g")
        .attr("class", "bars")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.keyword))
        .attr("y", (d) => yScale(d.num))
        // bandwidth is a special function of scaleBand
        // it returns the width of the band (bar) based on the configuration
        // we set up earlier
        .attr("width", xScale.bandwidth())
        // remember that yScale(0) is the height of the entire chart
        // so we subtract the y position of the top of the bar yScale(d.value)
        // from it to get the total height of the bar.
        .attr("height", (d) => yScale(0) - yScale(d.num))
        .style("fill", "#7472c0");
      
      // Here we render the x axis
      barchart
        .append("g")
        .attr("class", "x-axis")
        // First set its container's (g) position to the
        // bottom of the chart
        .attr("transform", `translate(0,${height - margin.bottom})`)
      //   .selectAll('text')
      //   .attr('x', xScale.bandwidth() / 2)
      //     .attr('y', 0)
      //     .attr('dy', '.35em')
      //     .attr('transform', 'rotate(90)')
      //     .attr('text-anchor', 'start')
        // then just call this to render it
        .call(xAxis);
      
      // it works the same for the y axis
      barchart
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);
      d3.select('#svg2').select('.x-axis')
          .selectAll('text')
          .attr('x', xScale.bandwidth() / 2)
          // .attr('y', 0)
          // .style('height','100')
          .attr('dy', '-0.35em')
          .attr('transform', 'rotate(90)')
          .style('font-family', 'sans-serif')
          .style('font-size', 14)
          .attr('text-anchor', 'start');

      d3.selectAll(".selected").classed("noselected");

    }

    // console.log("ended");
  }
  // 定义和添加brush
  const brush = d3
    .brush()
    .extent([
      [0, 0],
      [2000, 1800],
    ])
    .on("start brush", brush_start)
    // .on("brush",brush_brushed)
    .on("end", brush_ended);
    // d3.select("#svg1")
    // .append("g")
    // .attr("id", "zoom")
    // .attr("class", "zoom")
    // .call(zoom);
  d3.select("#svg1")
    .append("g")
    .attr("id", "brush")
    .attr("class", "rect-brush")
    .call(brush);

   
  // 添加点的个数个g
  for (let i = 0; i < data.length; i++) {
    d3.select("#svg1")
      .append("g")
      .attr("id", `g${i}`)
      .style("font-family", "sans-serif")
      .attr("class", "scatter-point")
      .style("font-size", 10);
  }
  //   const g = d3.select('#svg1')
  //     .append('g')
  //     .style('font-family', 'sans-serif')
  //     .style('font-size', 10)
  // 在svg上画点
  const g = d3.select("#svg1").selectAll(".scatter-point");
  d3.selectAll(".scatter-point")
    .data(testdata)
    // each data point is a group
    // .enter('g')

    .attr("transform", (d) => `translate(${xScale(d.x)},${yScale(d.y)})`)
    .call((g) =>
      g
        // first we append a circle to our data point
        .append("circle")
        .attr("r", 1.5)
        // .attr("cx", 500)
        // .attr("cy", 450)

        // .attr('id',`circle${d.index}`)
        //   .style('stroke', d => colors( d.category ))
        .style("stroke-width", 0.5)
        .style("fill", "black")
    )
    // 鼠标悬浮事件
    .on("mouseover", function (d, i) {
      // console.log(i)
      d3.select(`#g${i}`).style("stroke", "red");
      // d3.select(`#${i}`).style('stroke','red')
      return tooltip.style("visibility", "visible").text(d.index);
    })
    .on("mousemove", function (d, i) {
      return tooltip
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function (d, i) {
      d3.select(`#g${i}`).style("stroke", "black");
      return tooltip.style("visibility", "hidden");
    })
    // 鼠标点击事件
    .on("click", function (d, i) {
      // d3.selectAll('g').attr('class','scatter-point')
      console.log("click");
      d3.select("#display").text(
        `doi:${d.doi} \n\ntitle:${d.title} \n\nauthors:${d.author_name} \n\nyear:${d.publication_year}\n\nabstract:${d.abstract}`
      );
      d3.select(`#g${i}`).attr("class", "onclicked");
    });
});
