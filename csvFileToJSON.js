function csvFileToJSON(file) {
        try {
            var reader = new FileReader();

            reader.readAsText(file);
            reader.onload = function (e) {
                var jsonData = [];
                var headers = [];
                var rows = reader.result.split("\n");

                for (var i = 0; i < rows.length; i++) {
                    if (rows[i] !== '') {
                        var cells = rows[i].split(",");
                        var rowData = {};

                        for (var j = 0; j < cells.length; j++) {
                            if (i == 0) {
                                var headerName = cells[j].replaceAll('"', '').trim();

                                headers.push(headerName);

                            } else {
                                var key = headers[j];

                                if (key) {
                                    rowData[key] = cells[j].replaceAll('"', '').trim();
                                }
                            }
                        }
                        //skip the first row (header) data
                        if (i != 0) { jsonData.push(rowData); }
                    }
                }
                setData(jsonData);
            }
        } catch (e) {
            console.error(e);
        }
    }
