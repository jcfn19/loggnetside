const express = require('express');
const app = express();
const sqlite3 = require('better-sqlite3');
const db = sqlite3('lnetside.db', {verbose: console.log})
const session = require('express-session');
// nettside hvorman kan logg føre hvilke ting skolen har(raspberry pi, labquest, microbit, etc)

app.use(session({
    secret: "qwerty",
    resave: false,
    saveUninitialized: false
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function rootRouten(request, response) {
    const sql = db.prepare('SELECT * FROM navnlistt');
    const info = sql.all();
    response.send(info);
}

app.get('/navnlist', rootRouten)

function rootRouteb(request, response) {
    const sql = db.prepare('SELECT * FROM brukere');
    const info = sql.all();
    response.send(info);
}

app.get('/brukere', rootRouteb)

function rootRoutei(request, response) {
    const sql = db.prepare('SELECT * FROM items');
    const info = sql.all();
    response.send(info);
}

app.get('/items', rootRoutei)

const path = require('path');
const publicDirectoryPath = path.join(__dirname, "./static")
app.use(express.static(publicDirectoryPath))

let testbruker = '';

//formhandler for innlogin
function formhandlerlog(request, response) {
    const bsql = db.prepare('SELECT * FROM brukere WHERE brukere.bnavn = ?')
    const row = bsql.get(request.body.ilbrukernavn);
    testbruker = request.body.ilbrukernavn;
    console.log(testbruker);

    if (row === undefined) {
        request.session.logedin = false;
        response.redirect("/index.html");
        console.log("incorrect username");
        return;
    } else {
        request.session.ilbrukernavn = row.brukernavn;
        console.log(row.bpassord);
        if (request.body.ilpassord == row.bpassord) {
            request.session.logedin = true;
            request.session.ilpassord = row.passord;
            request.session.brolle = row.brolle;
            response.redirect("/logedin.html");
        } else {
            request.session.logedin = false;
            response.redirect("/index.html");
            console.log("incorrect password");
            return;
        }
    }
    console.log(request.session.logedin);
}

app.post('/flogin', formhandlerlog);

app.get('/logedin.html', (request,response) => {
    //console.log(request.session.logedin);
    if (request.session.logedin!== true) {
        response.redirect("/index.html")
        return;
    } else {
        response.sendFile(path.join(__dirname, "./secret/logedin.html"));
    }
})

app.get('/loggut', (request,response) => {
    request.session.logedin = false;
    response.redirect("/index.html");
})

function formhandlernyitem(request, response) {
    console.log(request.body);
    const isql = db.prepare('INSERT INTO items (inavn, itilstand, iansvarlig, irometasje, iskap) VALUES (?, ?, ?, ?, ?)');
    const info = isql.run(request.body.ifnavn, request.body.iftilstand, request.body.ifansvarlig, request.body.ifrometasje, request.body.ifskap);

    response.send("ny item lagt til")
}

app.post('/nyitem', formhandlernyitem);

app.get('/liste.html', (request,response) => {
    //console.log(request.session.logedin);
    if (request.session.logedin!== true) {
        response.redirect("/index.html")
        return;
    } else {
        response.sendFile(path.join(__dirname, "./secret/liste.html"));
    }
})

function formhandlerendreitem(request, response) {
    console.log(request.body);
    const isql = db.prepare('SELECT * FROM items WHERE items.iid = ?');
    const info = isql.get(request.body.ifrid);

    request.body.ifrid = info.iid;
    console.log(info.inavn);
    if (request.body.ifrnavn !== info.inavn) {
        const insql = db.prepare('UPDATE items SET inavn = ? WHERE iid = ' + info.iid + '')
        insql.run(request.body.ifrnavn)
    } else if (request.body.ifrtilstand !== info.itilstand){
        const itsql = db.prepare('UPDATE items SET itilstand = ? WHERE iid = ' + info.iid + '')
        itsql.run(request.body.ifrtilstand)
    } else if (request.body.ifransvarlig !== info.iansvarlig){
        const iasql = db.prepare('UPDATE items SET iansvarlig = ? WHERE iid = ' + info.iid + '')
        iasql.run(request.body.ifransvarlig)
    } else if (request.body.ifrrometasje !== info.irometasje){
        const irsql = db.prepare('UPDATE items SET irometasje = ? WHERE iid = ' + info.iid + '')
        irsql.run(request.body.ifrrometasje)
    } else if (request.body.ifrskap !== info.iskap){
        const issql = db.prepare('UPDATE items SET iskap = ? WHERE iid = ' + info.iid + '')
        issql.run(request.body.ifrskap)
    } else {
        response.sendError(404, 'ingen items forandret')
    }
    
    response.send("item endret")
}

app.post('/redigeritem', formhandlerendreitem);

function formhandlerslettitem(request, response) {
    console.log(request.body);
    const isql = db.prepare('DELETE items WHERE items.iid = ?');
    const info = isql.run(request.body.ifid);

    response.send("item slettet")
}

app.post('/slettitem', formhandlerslettitem);

app.get('/brukerel.html', (request,response) => {
    //console.log(request.session.logedin);
    if (request.session.logedin!== true) {
        response.redirect("/index.html")
        return;
    } else if (request.session.brolle!== "admin") {
        response.send("du har ikke tilgang til denne siden")
        return;
    } else {
        response.sendFile(path.join(__dirname, "./secret/brukerel.html"));
    }
})

function formhandlerendrebruker(request, response) {
    console.log(request.body);
    const bsql = db.prepare('SELECT * FROM brukere WHERE brukere.bid = ?');
    const info = bsql.get(request.body.bfrid);

    request.body.bfrid = info.bid;
    console.log(info.bid);
    if (request.body.bfrbnavn !== info.bnavn) {
        const bnsql = db.prepare('UPDATE brukere SET bnavn = ? WHERE bid = ?')
        bnsql.run(request.body.bfrbnavn, info.bid)
    } else if (request.body.bfrfornavn !== info.bfornavn){
        const bfsql = db.prepare('UPDATE brukere SET bfornavn = ? WHERE bid = ?')
        bfsql.run(request.body.bfrfornavn, info.bid)
    } else if (request.body.bfretternavn !== info.betternavn){
        const besql = db.prepare('UPDATE brukere SET betternavn = ? WHERE bid = ?')
        besql.run(request.body.bfretternavn, info.bid)
    } else if (request.body.bfrpassord !== info.bpassord){
        const bpsql = db.prepare('UPDATE brukere SET bpassord = ? WHERE bid = ?')
        bpsql.run(request.body.bfrpassord, info.bid)
    } else if (request.body.bfrrolle !== info.brolle){
        const brsql = db.prepare('UPDATE brukere SET brolle = ? WHERE bid = ?')
        brsql.run(request.body.bfrrolle, info.bid)
    } else {
        response.sendError(404, 'ingen brukere forandret')
    }
    
    response.send("bruker endret")
}

app.post('/redigerbruker', formhandlerendrebruker);

function formhandlerslettbruker(request, response) {
    console.log(request.body);
    const isql = db.prepare('DELETE brukere WHERE brukere.bnavn = ?');
    const info = isql.run(request.body.bsbnavn);

    response.send("bruker slettet")
}

app.post('/slettbruker', formhandlerslettbruker);

app.get('/brukerkonto', (request,response) => {
    console.log(testbruker);
    const xsql = db.prepare('SELECT * FROM brukere WHERE brukere.bnavn = ?');
    const temp = xsql.all(testbruker)

    response.send(temp)
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
}) 