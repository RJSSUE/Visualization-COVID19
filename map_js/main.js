const width = 1200;
const height = 700;
const margin = {top: 70, right: 10, bottom: 10, left: 10};
let svg = d3.select('#container_map').select('#mainsvg');
const g = svg.append('g').attr('id', 'maingroup')
    .attr('opacity',0.5)
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0.3)
    .attr('transform', `translate(${margin.left}, ${margin.top}) scale(0.8,0.8)`);
const gg = svg.append('g').attr('id', 'dots')
    .attr('transform', `translate(${margin.left}, ${margin.top}) scale(0.8,0.8)`);
const ti = svg.append('g').attr('')
let padding = {'left': 30, 'bottom': 50, 'top': 50, 'right': 50};
let datedisplay;
const projection = d3.geoEquirectangular()
    .center([0,30])  // 指定投影中心，注意[]中的是经纬度
    .scale(130)//150 originial
    .translate([400, 200]);
    //.translate([width / 2, height / 2-50]);
//const projection = d3.geoTransverseMercator();
const pathGenerator = d3.geoPath().projection(projection);
let pos_dict = {};
let place_dict = {};

var array;
// setting up the tip tool;
const tip = d3.tip()
    .attr('class', 'd3-tip').html(function(d) { return d.properties.name });
svg.call(tip);
let circles,linki,frac,root,x,y;
let week_data;

function parse_date(s){
    s = s.toString();
    let m_d = [31,29,31,30,31,30,31,31,30,31,30,31];
    let year = parseInt(s.substring(0,4));
    let month = parseInt(s.substring(5,7));
    let day = parseInt(s.substring(8,10));
    if(year == 2019)
        return day-26+1;
    if(year == 2020) {
        let da = 6;
        for(let i = 0; i < month-1; i++){
            da += m_d[i];
        }
        da += day;
        return da;
    }
    else{
        return 6+366+day;
    }
}

function to_format(d){
    let m_d = [31,29,31,30,31,30,31,31,30,31,30,31];
    let year = 0;
    let day = 0;
    let month = 0;
    if(d <= 6){
        year = 2019;
        day = 25+d;
        month = 12;
    }
    else if(d <= 6+366){
        year = 2020;
        let i = 0;
        let remain = d-6;
        while(remain > m_d[i]){
            remain -= m_d[i];
            i+=1;
        }
        month = i+1;
        day = remain;
    }
    else{
        year = 2021;
        day = d-6-366;
        month = 1;
    }
    let tat = year.toString()+'-';
    if(month < 10){
        tat += '0';
        tat+=month.toString()+'-';
    }
    else{
        tat += month.toString()+'-';
    }
    if(day < 10){
        tat+='0';
        tat+=day.toString();
        return tat;
    }
    else{
        tat+=day.toString();
        return tat;
    }
}
function parse2(s){
    s = s.toString();
    let m_d = [31,29,31,30,31,30,31,31,30,31,30,31];
    let year = parseInt(s.substring(6,10));
    let month = parseInt(s.substring(3,5));
    let day = parseInt(s.substring(0,2));
    if(year == 2019)
        return day-26+1;
    if(year == 2020) {
        let da = 6;
        for(let i = 0; i < month-1; i++){
            da += m_d[i];
        }
        da += day;
        return da;
    }
    else{
        return 6+366+day;
    }
}
d3.csv('./data/weekly_data.csv').then(function(DATA) {
    week_data = DATA;
})
function drawPie(dat, d, statNow, Date) {
    capitalListedData = []
    for (i in statNow) {
        capitalListedData.push(statNow[i])
    }

    sumForRadius = 0
    for (i in capitalListedData) {
        sumForRadius += capitalListedData[i]
    }

    var pie = d3.pie();
    piedata = pie(capitalListedData);
    for (i in piedata) 
        piedata[i].country = d;

    var outerRadius = Math.sqrt(sumForRadius);//外半径
    var innerRadius = 0;//内半径，为0则中间没用空白

    var arc = d3.arc()//弧生成器
        .innerRadius(innerRadius)//设置内半径
        .outerRadius(outerRadius);//设置外半径
    capitalinfo = capitalInfoMap.get(d)
    longitude = capitalinfo.longitude
    latitude = capitalinfo.latitude
    var arcs = gg.selectAll("g")
        .data(piedata)
        .enter()
    arcs.append("path")
        .attr("fill",function(d, i){return color[i];})
        .attr("opacity",0.75)
        .attr("d",function (d) {return arc(d);})
        .attr("transform","translate("+(projection([longitude, latitude])[0])+","+(projection([longitude, latitude])[1])+")")
        .on("click", function(d) {            
            selected_country[d.country] = (selected_country[d.country]+1)%3;
            remap(dat, Date, d.country);
            return;
        })
        .on("mouseover", function (d,i) {
            let death_utd = 0;//death up to date
            let case_utd = 0;//case up to date
            let death_tw = -1;//death this week
            let case_tw = -1;//case this week
            for(dati in week_data){
                let kk = week_data[dati].countriesAndTerritories;
                if(kk != d.country)
                    continue;
                else{
                    if(parse2(week_data[dati].dateRep) > Date && parse2(week_data[dati].dateRep) <= Date+7){
                        death_tw = parseInt(week_data[dati].deathsweekly.toString());
                        case_tw = parseInt(week_data[dati].casesweekly.toString());
                    }
                    if(parse2(week_data[dati].dateRep)<=Date){
                        death_utd += parseInt(week_data[dati].deathsweekly.toString());
                        case_utd += parseInt(week_data[dati].casesweekly.toString());
                    }
                }
            }
            let txt;
            if(death_tw != -1) {
                txt =  "Country or Region: "+ d.country+"<br/>"
                    + "Cases this week: " + String(case_tw) + "<br/>" + "Deaths this week: " + String(death_tw) + "<br/>"
                    + "Cases up to last week: " + String(case_utd) + "<br/>"
                    + "Deaths up to last week: " + String(death_utd) + "<p>";
            }
            else{
                txt =  "Country or Region: "+ d.country+"<br/>"
                    + "Cases this week: unknown"  + "<br/>" + "Deaths this week: unknown" + "<br/>"
                    + "Cases up to last week: unknown" +"<br/>"
                    + "Deaths up to last week: unknown" + "<p>";
            }
            let tooltip = d3.select("#tooltip");
            //  console.log(String(schools[i].longitude)+'\n');
            let capinfo = capitalInfoMap.get(d.country);
            let longi = capinfo.longitude;
            let lati = capinfo.latitude;
            let lo,la;
                [lo, la] = projection([longi, lati]);
            tooltip.html(txt)
                //设置tooltip的位置
                .style("left", lo*0.8+50+'px')
                .style("top", la-5+'px')
                .style("visibility", "visible");
        })
        .on("mouseout", function (d) {
            let tooltip = d3.select("#tooltip");
            tooltip.style("visibility", "hidden");
        })
}


function drawLineChart(date, SelectedCountry) {
    const ggg = d3.select('#container_map').select('#LineGraph');
    ggg.selectAll('g').remove()
    ggg.selectAll('path').remove()

    weekly_data = []
    let temp_weekly_data = []
    let sum_date = []
    let map_date = []
    for(i in dat) {
        if(SelectedCountry.length != 0 && dat[i]["Country of Exposure"] != SelectedCountry) {
            continue;
        }
        datei = parse_date(""+dat[i]['Collection Data']);
        if(datei > date) continue;
        weeki = parseInt(datei / 7);
        if(sum_date[weeki] == undefined) {
            sum_date[weeki] = [];
            map_date[weeki] = weekDateMap[weeki];
        }
        clade = dat[i]["Clade"];
        if(sum_date[weeki][clade] == undefined) {
            sum_date[weeki][clade] = 0;
        }
        sum_date[weeki][clade] ++;
    }
    for(j in cladeArr) {
        weekly_data.push([]);
        weekly_data[j].clade_index = j;
        weekly_data[j].arr = []
    }
    for(i in sum_date) {
        if(i == "NaN") continue;
        sum = 0;
        for(j in cladeArr) {
            let d = {}
            if(sum_date[i][cladeArr[j]] == undefined) {
                d.cladesumy0 = 0;
                d.cladesumy1 = 0;
            } else {
                d.cladesumy0 = sum;
                sum += sum_date[i][cladeArr[j]];  
                d.cladesumy1 = sum; 
            }
            d.date = map_date[i];
            d.clade = cladeArr[j];
            d.clade_index = j;
            weekly_data[j].arr.push(d);
            temp_weekly_data.push(d);
            if(d.cladesumy0 == undefined) {console.log(d);}
        }
    }
    // console.log(weekly_data)
    


    x = d3.scaleTime().range([0, 660])
        .domain(d3.extent(temp_weekly_data, function(d) { return d.date; }))
    let axis_x = d3.axisBottom().scale(x);
    ggg.append('g')
        .attr("class", "axis")
        .attr("transform", `translate(${0},${120})`)
        .attr('font-size', '0.8rem')
        .call(axis_x);

    y = d3.scaleLinear().range([120, 0])
        .domain(d3.extent(temp_weekly_data, function(d) { return d.cladesumy1; }))

    let axis_y = d3.axisRight().scale(y).ticks(5);

    ggg.append('g')
        .attr("class", "axis")
        .call(axis_y);
    ggg.append('g')
        .attr('transform', `translate(${330}, ${160})`)
        .append('text')
        .attr('class', 'axis_label')
        .text('time')
/*
    ggg.append('g')
        .attr('transform', `translate(${10}, ${0})`)
        .append('text')
        .attr('class', 'axis_label')
        .text('confirmed cases weekly')

    const lineGenerator = d3.line()
                            .x(d=>x(d.date))
                            .y(d=>y(d.CaseSum));

    ggg.append('path')
        .datum(weekly_data)
        .attr('class','line-path')
        .attr('d', lineGenerator)
        .attr('opacity',0.5);
*/

    // bars
    console.log(weekly_data)
    ggg.append('g')
        .selectAll('g')
        .data(weekly_data)
        .enter().append('g')
        .attr('fill', d => color[d.clade_index])
        .selectAll('rect')
        .data(d => d.arr)
        .enter().append('rect')
        .attr('x', d => x(d.date))
        .attr('y', d => y(d.cladesumy1))
        .attr('width', 10)
        .attr('height', d => y(d.cladesumy0)-y(d.cladesumy1))
        
}

function remap(dat, Date, SelectedCountry) {
    datedisplay.remove();
    let datey = to_format(Date);
    datedisplay = gg.append('text')
        .text(datey)
        .attr('x',350+'px')
        .attr('y',40+'px')
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("font-size", 20);
    if(SelectedCountry.length != 0) {
        gg.selectAll("path").remove();
        gg.selectAll("line").remove();
        gg.selectAll("circle").remove();
        if(selected_country[SelectedCountry] == 1) {
        //    selected_country[SelectedCountry] = 1;
            drawLineChart(Date, SelectedCountry);
            drawPie(dat, SelectedCountry, capitalStat[SelectedCountry], Date)
            let linkSet = new Set();
            for (i in dat) {
                //console.log(dat[i]["Collection Data"])
                if(parse_date(""+dat[i]['Collection Data']) > Date)
                    continue;
                if(dat[i]["Country of Exposure"] == SelectedCountry) {
                    linkSet.add(dat[i]["Country"]);
                }
            }
            capitalinfo = capitalInfoMap.get(SelectedCountry);
            var x1, y1
            [x1, y1] = projection([capitalinfo.longitude, capitalinfo.latitude])
            var links = []
            var circles = []
            linkSet.forEach(inCountry => {
                let capitalinfo2 = capitalInfoMap.get(inCountry);
                var x2, y2
                [x2, y2] = projection([capitalinfo2.longitude, capitalinfo2.latitude])
                links.push([x1, y1, x2, y2])
                if(inCountry != SelectedCountry)
                    circles.push([x2, y2])
            })
            gg.selectAll('line')
                .data(links)
                .enter().append('line')
                .attr('x1',d=>d[0])
                .attr('y1',d=>d[1])
                .attr('x2',d=>d[2])
                .attr('y2',d=>d[3])
                .attr("stroke", "red")
                .join("line")
                .attr('stroke-opacity',0.6)
                .attr("stroke-width", d =>0.25*Math.sqrt(d.weight))
            gg.selectAll('circle')
                .data(circles)
                .enter().append('circle')
                .attr("class","point")
                .attr("cx",d=>d[0])
                .attr("cy",d=>d[1])
                .attr("r", 2)
                .attr("fill", "black")
                .attr("opacity", 0.6)
        }
        else if(selected_country[SelectedCountry] == 2){
        //    selected_country[SelectedCountry] = 2;
            drawLineChart(Date, SelectedCountry);
            drawPie(dat, SelectedCountry, capitalStat[SelectedCountry], Date)
            linkSet2 = new Set();
            for (i in dat) {
                //console.log(dat[i]["Collection Data"])
                if(parse_date(""+dat[i]['Collection Data']) > Date)
                    continue;
                if(dat[i]["Country"] == SelectedCountry){
                    linkSet2.add(dat[i]["Country of Exposure"]);
                }
            }
            capitalinfo = capitalInfoMap.get(SelectedCountry);
            var x1, y1
            [x1, y1] = projection([capitalinfo.longitude, capitalinfo.latitude])
            let links2 = [];
            let circles2 = [];
            linkSet2.forEach(outCountry => {
                let capitalinfo3 = capitalInfoMap.get(outCountry);
                var x3, y3;
                [x3, y3] = projection([capitalinfo3.longitude, capitalinfo3.latitude])
                links2.push([x3, y3, x1, y1])
                if(outCountry != SelectedCountry)
                    circles2.push([x3, y3])
            })
            //console.log(circles2)
            gg.selectAll('line')
                .data(links2)
                .enter().append('line')
                .attr('x1',d=>d[0])
                .attr('y1',d=>d[1])
                .attr('x2',d=>d[2])
                .attr('y2',d=>d[3])
                .attr("stroke", "blue")
                .join("line")
                .attr('stroke-opacity',0.6)
                .attr("stroke-width", d =>0.25*Math.sqrt(d.weight))
            gg.selectAll('circle')
                .data(circles2)
                .enter().append('circle')
                .attr("class","point")
                .attr("cx",d=>d[0])
                .attr("cy",d=>d[1])
                .attr("r", 2)
                .attr("fill", "yellow")
                .attr("opacity", 0.6)
        }
        else {
        //    selected_country[SelectedCountry] = 0;
            remap(dat, Date, "");            
        }
        return;
    }


    let start_date = 1;
    let end_date = parseInt(Date)+1;
    let excluded = 0;
    let countrySet = new Set();
    capitalStat = []
    for (i in dat) {
        dat[i].capitalinfo = capitalInfoMap.get(dat[i]["Country of Exposure"])
        if(dat[i].capitalinfo == undefined)
            continue;
        if(parse_date(dat[i]['Collection Data'].toString()) < start_date || parse_date(dat[i]['Collection Data'].toString()) >= end_date){
            excluded += 1;
            continue;
        }
        countrySet.add(dat[i]["Country of Exposure"])
        if(capitalStat[dat[i].capitalinfo.country] == undefined) {
            cladeMap = []
            for (iter in cladeArr) 
                cladeMap[cladeArr[iter]] = 0;
            capitalStat[dat[i].capitalinfo.country] = cladeMap;
        }
        capitalStat[dat[i].capitalinfo.country][dat[i]["Clade"]] += 1;
    }
    
    gg.selectAll("path").remove();
    countrySet.forEach(d => {drawPie(dat, d, capitalStat[d], Date)})
    drawLineChart(Date, "");
}

function draw() {
    let worldmeta;
    let lastid = undefined;
    let datey = to_format(380);
    console.log(datey);
    datedisplay = gg.append('text')
        .text(datey)
        .attr('x',350+'px')
        .attr('y',40+'px')
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("font-size", 20);
    d3.json('./data/countries-110m.json').then(
        function(data){
            // convert topo-json to geo-json;
            worldmeta = topojson.feature(data, data.objects.countries);

            // this code is really important if you want to fit your geoPaths (map) in your SVG element;
            // projection.fitSize([innerWidth, innerHeight], worldmeta);
            projection(worldmeta);
            // perform data-join;
            const paths = g.selectAll('path')
                .data(worldmeta.features, d => d.properties.name)
                .enter().append('path')
                .attr('d', pathGenerator)
                .attr('stroke', 'black')
                .attr('opacity',0.4)
                .attr('stroke-width', 1)
                .on('mouseover',function(d){
                    d3.select(this)
                        .attr("opacity", 0.7)
                        .attr("stroke","white")
                        .attr("stroke-width", 6);
                })
                .on('mouseout', function(d){
                    d3.select(this)
                        .attr("opacity", 0.4)
                        .attr("stroke","black")
                        .attr("stroke-width",1);
                })
                .on('contextmenu', function(d){
                    d3.event.preventDefault();
                    if(lastid !== d.properties.name){
                        tip.show(d)
                        lastid = d.properties.name;
                    }else{
                        tip.hide(d)
                    }
                })
        }
    );

    var legend = g.selectAll(".legend")
        .data(data_legend)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(-85," + (i * 15 + 30) + ")"; });  //transform属性便是整个图例的坐标
    legend.append("rect")
        .attr("x", 200) //width是svg的宽度，x属性用来调整位置
        // .attr("x", (width / 160) * 157)
        //或者可以用width的分数来表示，更稳定一些，这是我试出来的，下面同
        .attr("y", 200)
        .attr("width", 18)
        .attr("height", 18) //设低一些就是线，高一些就是面，很好理解
        .style("fill", function(d){
            return d.color
        });
    legend.append("text")
        .attr("x", 183)
        // .attr("x", (width / 40) * 39)
        .attr("y", 215)
        .style("text-anchor", "end") //样式对齐
        .text(function(d) {
            return d.name;
        });
}

function main(){
    d3.csv('./data/nextstrain_ncov_global_metadata.csv').then(function(DATA) { 
        dat = DATA; 
        d3.json('./data/country_capital.json').then(function(DATA) {
            country_capital = DATA;
            InitializeData();
            draw();
            remap(dat, 380, '');
        })
    })
    
}

main();



function SubTreeReMapping(root) {
    if(root == null) {
        filteredData = null;
        remap(dat, 380, '');
        return;
    }
    filteredData = [];
    var q = [root];
    var front = 0, end = 1;
    while(front < q.length) {
        var now = q[front ++];
        var item = strainInfoMap.get(now.name);
        if(item == undefined) {
            for(i in now.children) {
                q.push(now.children[i]);
            }
        } else {
            filteredData.push(item);
        }
    }
    
    remap(filteredData, 380, '');
}
