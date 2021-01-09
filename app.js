var XLSX = require('xlsx');

var workbook = XLSX.readFile('sentieo_sample.csv');
var sheets = workbook.Sheets.Sheet1;
// console.log(sheets);

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var dataHeader = [],
    data = [];
var j = -1; // row
var flag = 1,
    len = 0,
    cnt = 0;
for (var i in sheets) {
    if (i == '!ref') {
        continue;
    }
    if (i.slice(1, ) == 1 && flag == 1) {
        dataHeader.push(sheets[i].v);
        len = dataHeader.length;
    } else {
        flag = 0;
        if (i.slice(0, 1) == 'A') {
            cnt = 0;
            j++;
            data[j] = [];
            data[j].push(sheets[i].w);
            cnt++;
        } else if (i.slice(0, 1) == 'B') {
            data[j].push(parseFloat(sheets[i].w));
            cnt++;


            var address = XLSX.utils.encode_col(0) + (j + 2);
            var date = new Date(sheets[address].w);
            if (date.getDay() == 0 || date.getDay() == 6) {
                /// Column C
                data[j].push("");
                cnt++;
                /// Rest of columns for this row
                while (cnt != len) {
                    data[j].push("");
                    cnt++;
                }
            } else {
                /// Column C
                data[j].push(parseFloat(sheets[i].w));
                cnt++;
                /// Rest of columns 
                while (cnt != len) {
                    var range = XLSX.utils.decode_range(sheets['!ref']);
                    var C = range.s.c;
                    var address = XLSX.utils.encode_col(C + cnt) + "1";
                    var val = sheets[address].v.split(' ')[0];
                    // console.log(val);
                    if ((j + 1) - val >= 0) {
                        var temp = 1,
                            avg = parseFloat(sheets[i].w),
                            k = j + 2 - 1;
                        while (k != 0) {
                            var add = XLSX.utils.encode_col(0) + k;
                            var d = new Date(sheets[add].w);
                            if (d.getDay() == 0 || d.getDay() == 6) {
                                k--;
                                continue;
                            } else {
                                if (temp == val) {
                                    break;
                                }
                                var price = XLSX.utils.encode_col(1) + k;
                                avg += parseFloat(sheets[price].w);
                                k--;
                                temp++;
                            }
                        }
                        var avgVal = parseFloat(avg / val);
                        data[j].push(avgVal);
                        cnt++;
                    } else {
                        data[j].push("");
                        cnt++;
                    }
                }
            }
        }
    }
}

console.log(data);
var ws = XLSX.utils.json_to_sheet(data);
var range = XLSX.utils.decode_range(ws['!ref']);

for (var C = range.s.c; C <= range.e.c; ++C) {
    var address = XLSX.utils.encode_col(C) + "1";
    if (!ws[address])
        continue;
    ws[address].v = dataHeader[C];
}
// console.log(ws);
var wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'result');

// Save the resulted CSV file
XLSX.writeFile(wb, 'result.csv', { bookType: 'csv', type: 'array' });