const sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('namrata');
var db = new sqlite3.Database('order.db',sqlite3.OPEN_READWRITE,(err)=> {
    if(err){
        return  console.error(err.message);
    }

    console.log('Connected to the in-memory SQLITE database');


});
/*
db.serialize(function(){
    db.run("CREATE TABLE nammu (id INT, dt TEXT)");
    var stmt = db.prepare("INSERT INTO nammu VALUES (?,?)");
    for(var i=0;i<10;i++){
        var d = new Date();
        var n = d.toLocaleTimeString();
        stmt.run(i,n);

    }
    stmt.finalize();

    db.each("SELECT id , dt FROM nammu", function(err,row){
        console.log("User id: "+ row.id , row.dt);
    });
});
*/
db.close((err)=> {
    if(err){
        return console.error(err.message);
    }
    console.log('close the database connection');
});